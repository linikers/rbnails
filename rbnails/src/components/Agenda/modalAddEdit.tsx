import { useCallback, useEffect, useMemo, useState } from "react";
import { TimeSlot } from "./types";
import useSWR from 'swr';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { IServico } from "@/models/Servico";
import { addMinutes, parseISO } from "date-fns";
import { ICliente } from "@/models/Cliente";
import { IUser } from "@/models/User";
import { IAgendamento } from "@/models/Agendamento";
import { format, getTimezoneOffset } from 'date-fns-tz'; 

const timeZone = 'America/Sao_Paulo';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
interface AddEditModalProps {
    isOpen: boolean;
    toggle: () => void;
    onSave: (data: any) => void;
    initialData?: TimeSlot | null;
    day: string; // Formato 'yyyy-MM-dd'
}

    interface FormData {
        clienteId: string;
        servicoId: string;
        profissionalId: string;
        hora: string; // Formato 'HH:mm'
        status: IAgendamento['status'];
        observacoes: string;
    }

    interface BaseSlot {
      dataHora: string; // ISO String
      status: 'livre' | 'agendado';
    }

    export default function AddEditModal({
        isOpen,
        toggle,
        onSave,
        initialData,
        day,
      }: AddEditModalProps) {
        const { data: clientesRes, error: clientesError } = useSWR('/api/clientes', fetcher);
        // Helper para criar um objeto Date no fuso de SP a partir de uma string de tempo
        const getSaoPauloDate = useCallback((time: string) => {
        const dateString = `${day}T${time}`;
        // getTimezoneOffset da date-fns-tz retorna um valor negativo para fusos a oeste de UTC (ex: -10800000 para SP)
        const offset = getTimezoneOffset(timeZone, new Date(dateString));
                            
        const sign = offset < 0 ? '-' : '+';
        const offsetAbs = Math.abs(offset);
        const offsetHours = Math.floor(offsetAbs / 3600000);
        const offsetMinutes = Math.floor((offsetAbs % 3600000) / 60000);
                        
        const offsetString = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
          return parseISO(`${dateString}${offsetString}`);
        }, [day]);

        const { data: servicosRes, error: servicosError } = useSWR('/api/servicos', fetcher);
        const { data: profissionaisRes, error: profissionaisError } = useSWR('/api/users?role=profissional', fetcher);
      

        const [formData, setFormData] = useState<FormData>({
          clienteId: '',
          servicoId: '',
          profissionalId: '',
          hora: '',
          status: 'agendado',
          observacoes: '',
        });

        const [availableTimes, setAvailableTimes] = useState<string[]>([]);

         // --- NOVO: Busca os agendamentos do dia para o profissional selecionado ---
        const dayStart = `${day}T00:00:00.000Z`;
        const dayEnd = `${day}T23:59:59.999Z`;
        const shouldFetchAppointments = day && formData.profissionalId;
 
        const { data: agendamentosDoDiaRes, isLoading: agendamentosLoading } = useSWR(
          shouldFetchAppointments
            ? `/api/agendamentos?startDate=${dayStart}&endDate=${dayEnd}&profissionalId=${formData.profissionalId}`
            : null,
          fetcher,
        );
        // Memoize agendamentosDoDia to ensure stable reference and prevent unnecessary re-renders
        const agendamentosDoDia: TimeSlot[] = useMemo(() => agendamentosDoDiaRes?.data || [], [agendamentosDoDiaRes]);
         
        // Efeito 1: Responsável APENAS por inicializar o formulário quando o modal abre.
        useEffect(() => {
          if (isOpen) {
            if (initialData) {
              setFormData({
                clienteId: initialData.cliente?._id || '',
                servicoId: initialData.servico?._id || '',
                profissionalId: initialData.profissional?._id || '',
                hora: format(
                  typeof initialData.dataHora === 'string' ? parseISO(initialData.dataHora) : initialData.dataHora,
                  'HH:mm', 
                  { timeZone }
                ),
                status: initialData.status || 'agendado',
                observacoes: initialData.observacoes || '',
              });
            } else {
              // Limpa o formulário para um novo agendamento.
              setFormData({
                clienteId: '', servicoId: '', profissionalId: '', hora: '',
                status: 'agendado', observacoes: '',
              });
            }
          }
        }, [isOpen, initialData]);
      
        // Efeito 2: Responsável APENAS por calcular os horários disponíveis.
        useEffect(() => {
          if (!isOpen || !formData.servicoId || !formData.profissionalId || !servicosRes?.data || agendamentosLoading) {
            setAvailableTimes([]);
            return;
          }
      
          const baseSlots: BaseSlot[] = [];
          let currentTime = getSaoPauloDate('08:00:00');
          const endTime = getSaoPauloDate('20:00:00');
      
          while (currentTime < endTime) {
            baseSlots.push({ dataHora: currentTime.toISOString(), status: 'livre' });
            currentTime = addMinutes(currentTime, 30);
          }
      
          const agendamentosParaVerificar = agendamentosDoDia.filter(ag => ag._id !== initialData?._id);
      
          const slotsComAgendamentos = baseSlots.map(slot => {
            const inicioSlot = parseISO(slot.dataHora);
            const fimSlot = addMinutes(inicioSlot, 30);
            let isOcupado = false;
            for (const agendamento of agendamentosParaVerificar) {
              const inicioAgendamento = parseISO(agendamento.dataHora as string);
              const servicoDetails = servicosRes.data.find((s: IServico) => s._id === (agendamento.servico as any)?._id);
              const duracao = servicoDetails?.duracaoEstimada || 30;
              const fimAgendamento = addMinutes(inicioAgendamento, Math.ceil(duracao / 30) * 30);
              if (inicioSlot < fimAgendamento && fimSlot > inicioAgendamento) {
                isOcupado = true;
                break;
              }
            }
            return { ...slot, status: isOcupado ? 'agendado' : 'livre' };
          });
      
          const selectedServico = servicosRes.data.find((s: IServico) => s._id === formData.servicoId);
          if (!selectedServico) {
            setAvailableTimes([]);
            return;
          }
          const slotsNeeded = Math.ceil((selectedServico.duracaoEstimada || 30) / 30);
      
          const validTimes: string[] = [];
          for (let i = 0; i <= slotsComAgendamentos.length - slotsNeeded; i++) {
            const potentialSlots = slotsComAgendamentos.slice(i, i + slotsNeeded);
            if (potentialSlots.every(slot => slot.status === 'livre')) {
              const time = format(parseISO(potentialSlots[0].dataHora), 'HH:mm', { timeZone });
              validTimes.push(time);
            }
          }
      
          setAvailableTimes(validTimes);
      
          if (formData.hora && !validTimes.includes(formData.hora)) {
            setFormData(prev => ({ ...prev, hora: '' }));
          }
        // }, [isOpen, formData.servicoId, formData.profissionalId, agendamentosDoDia, servicosRes, agendamentosLoading, day, initialData?._id]);
      }, [isOpen, formData.servicoId, formData.profissionalId, agendamentosDoDia, servicosRes, agendamentosLoading, day, initialData?._id, getSaoPauloDate, formData.hora]);
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
        };
      
        const handleSelectChange = (e: SelectChangeEvent) => {
          const { name, value } = e.target;
          setFormData((prev) => {
            const updatedState = { ...prev, [name]: value };
            // Se o profissional ou serviço for alterado, limpa a hora para forçar uma nova seleção
            if ((name === 'profissionalId' || name === 'servicoId') && value !== prev[name as keyof FormData]) {
              updatedState.hora = '';
            }
            return updatedState;
          });
        };
      
      
        const handleSave = () => {
        const selectedServico = servicosRes?.data.find((s: IServico) => s._id === formData.servicoId);
        const dataHoraFinal = getSaoPauloDate(formData.hora);
                  
        const payload = {
            cliente: formData.clienteId,
            servico: formData.servicoId,
            profissional: formData.profissionalId,
            status: formData.status,
            observacoes: formData.observacoes,
            dataHora: dataHoraFinal.toISOString(),
            valorServico: selectedServico?.preco || 0,
          };
          onSave(payload);
        };
      
        const isLoading = !clientesRes || !servicosRes || !profissionaisRes;
        const hasError = clientesError || servicosError || profissionaisError;
      
        return (
          <Dialog open={isOpen} onClose={toggle} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
            <DialogContent>
            {isLoading && <CircularProgress />}
              {hasError && <Alert severity="error">Erro ao carregar dados para o formulário.</Alert>}
              {!isLoading && !hasError && (
                <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Cliente</InputLabel>
                    <Select name="clienteId" value={formData.clienteId} label="Cliente" onChange={handleSelectChange} required>
                      {clientesRes.data.map((c: ICliente) => (<MenuItem key={c._id} value={c._id}>{c.nome}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Serviço</InputLabel>
                    <Select name="servicoId" value={formData.servicoId} label="Serviço" onChange={handleSelectChange} required>
                      {servicosRes.data.map((s: IServico) => (<MenuItem key={s._id} value={s._id}>{s.nome} - R$ {s.preco.toFixed(2)}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Profissional</InputLabel>
                    <Select name="profissionalId" value={formData.profissionalId} label="Profissional" onChange={handleSelectChange} required>
                      {profissionaisRes.data.map((p: IUser) => (<MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl 
                    fullWidth 
                    margin="dense" 
                    disabled={!formData.profissionalId || !formData.servicoId || agendamentosLoading}
                  >
                    <InputLabel>Hora</InputLabel>
                    <Select name="hora" value={formData.hora} label="Hora" onChange={handleSelectChange} required>
                      {agendamentosLoading ? (
                        <MenuItem disabled>Carregando horários...</MenuItem>
                      ) : availableTimes.length > 0 ? (
                        availableTimes.map((h: string) => (<MenuItem key={h} value={h}>{h}</MenuItem>))
                      ) : (
                        <MenuItem disabled>
                          {formData.servicoId ? 'Nenhum horário disponível para este serviço' : 'Selecione um serviço'}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select name="status" value={formData.status} label="Status" onChange={handleSelectChange}>
                      <MenuItem value="agendado">Agendado</MenuItem>
                      <MenuItem value="confirmado">Confirmado</MenuItem>
                      <MenuItem value="concluído">Concluído</MenuItem>
                      <MenuItem value="cancelado">Cancelado</MenuItem>
                      <MenuItem value="desmarcado">Desmarcado</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField 
                    margin="dense"
                    name="observacoes" 
                    label="Observações" 
                    type="text" 
                    fullWidth 
                    multiline 
                    rows={3} 
                    variant="outlined" 
                    value={formData.observacoes} 
                    onChange={handleChange}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={toggle}>Cancelar</Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={
                  isLoading
                  || !formData.profissionalId
                  || !formData.clienteId
                  || !formData.servicoId
                  || !formData.hora
                }
                >
                Salvar
              </Button>
            </DialogActions>
          </Dialog>
        );
      }