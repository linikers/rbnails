import { useEffect, useState } from "react";
import { TimeSlot } from "./types";
import useSWR from 'swr';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { IServico } from "@/models/Servico";
import { addMinutes, endOfDay, format, parseISO, startOfDay } from "date-fns";
import { ICliente } from "@/models/Cliente";
import { IUser } from "@/models/User";
import { IAgendamento } from "@/models/Agendamento";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
interface AddEditModalProps {
    isOpen: boolean;
    toggle: () => void;
    onSave: (data: any) => void;
    initialData?: TimeSlot | null;
    day: string; // Formato 'yyyy-MM-dd'
    // allSlots: TimeSlot[]; // Todos os slots (livres, agendados, bloqueados) da semana
}

    interface FormData {
        clienteId: string;
        servicoId: string;
        profissionalId: string;
        hora: string; // Formato 'HH:mm'
        // status: string;
        status: IAgendamento['status'];
        observacoes: string;
    }

  
    export default function AddEditModal({
        isOpen,
        toggle,
        onSave,
        initialData,
        day,
        // allSlots,
      }: AddEditModalProps) {
        const { data: clientesRes, error: clientesError } = useSWR('/api/clientes', fetcher);
        const { data: servicosRes, error: servicosError } = useSWR('/api/servicos', fetcher);
        const { data: profissionaisRes, error: profissionaisError } = useSWR('/api/users?role=profissional', fetcher);
      

        const [formData, setFormData] = useState<FormData>({
          clienteId: '',
          servicoId: '',
          profissionalId: '',
          // hora: '09:00',
          hora: '',
          status: 'agendado',
          observacoes: '',
        });

        const [availableTimes, setAvailableTimes] = useState<string[]>([]);

         // --- NOVO: Busca os agendamentos do dia para o profissional selecionado ---
         const dayStart = startOfDay(new Date(day)).toISOString();
         const dayEnd = endOfDay(new Date(day)).toISOString();
         const shouldFetchAppointments = day && formData.profissionalId;
 
         const { data: agendamentosDoDiaRes, isLoading: agendamentosLoading } = useSWR(
           shouldFetchAppointments
             ? `/api/agendamentos?startDate=${dayStart}&endDate=${dayEnd}&profissionalId=${formData.profissionalId}`
             : null,
           fetcher
         );
         const agendamentosDoDia: TimeSlot[] = agendamentosDoDiaRes?.data || [];
       
        useEffect(() => {
          if (initialData) {
            setFormData({
              clienteId: initialData.cliente?._id || '',
              servicoId: initialData.servico?._id || '',
              profissionalId: initialData.profissional?._id || '',
              hora: format(parseISO(initialData.dataHora), 'HH:mm'),
              status: 'agendado',
              observacoes: initialData.observacoes || '',
            });
          } else {
            // Reset form for new entry
            setFormData({
              clienteId: '',
              servicoId: '',
              profissionalId: '',
              // hora: '09:00',
              hora: '',
              status: 'agendado',
              observacoes: '',
            });
          }
        }, [initialData, isOpen]);
      
                // --- ALTERADO: Calcula os horários disponíveis baseado nos dados buscados pelo modal ---
        useEffect(() => {
          if (!formData.servicoId || !servicosRes?.data || agendamentosLoading) {
            setAvailableTimes([]);
            return;
        }
      
        // Gera os slots base do dia (ex: de 30 em 30 min, das 07:00 às 20:00)
        const baseSlots: any = [];
          let currentTime = new Date(`${day}T07:00:00`);
          const endTime = new Date(`${day}T20:00:00`);
          while (currentTime < endTime) {
            baseSlots.push({
              dataHora: currentTime.toISOString(),
              status: 'livre'
            });
            currentTime = addMinutes(currentTime, 30);
          }
        
          let agendamentosParaVerificar: any[] = [];

          // Marca os slots ocupados pelos agendamentos já existentes
          agendamentosParaVerificar.forEach((agendamento: any) => {
            const inicioAgendamento = parseISO(agendamento.dataHora);
            const duracao = agendamento.servico?.duracaoEstimada || 30;
            const duracaoArredondada = Math.ceil(duracao / 30) * 30;
            const fimAgendamento = addMinutes(inicioAgendamento, duracaoArredondada);

            baseSlots.forEach((slot: any) => {
              const inicioSlot = parseISO(slot.dataHora);
              const fimSlot = addMinutes(inicioSlot, 30);

              // Verifica se o slot cruza com o agendamento existente
              if (inicioSlot < fimAgendamento && fimSlot > inicioAgendamento) {
                if (slot.status === 'livre') {
                  slot.status = 'agendado'; // Marca como ocupado
                }
              }
            });
          });

          const selectedServico = servicosRes.data.find((s: IServico) => s._id === formData.servicoId);
          if (!selectedServico) {
            setAvailableTimes([]);
            return;
          }
      
          // Arredonda a duração para o próximo múltiplo de 30 minutos
          const duracao = selectedServico.duracaoEstimada || 30;
          const slotsNeeded = Math.ceil(duracao / 30);
      
          // const slotsDoDia = allSlots.filter(slot => format(parseISO(slot.dataHora), 'yyyy-MM-dd') === day);
      
          const validTimes: string[] = [];
          for (let i = 0; i <= baseSlots.length - slotsNeeded; i++) {
            const potentialSlots = baseSlots.slice(i, i + slotsNeeded);
            const isSequenceFree = potentialSlots.every((slot: any) => slot.status === 'livre');
      
            if (isSequenceFree) {
              validTimes.push(format(parseISO(potentialSlots[0].dataHora), 'HH:mm'));
            }
          }
      
          setAvailableTimes(validTimes);
      
          // Se a hora atualmente selecionada não for mais válida, limpa ela
          if (formData.hora && !validTimes.includes(formData.hora)) {
            setFormData(prev => ({ ...prev, hora: '' }));
          }
      
        }, [
            formData.servicoId,
            day, 
            servicosRes, 
            formData.hora, 
            agendamentosDoDia, 
            agendamentosLoading
          ]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
        };
      
        const handleSelectChange = (e: SelectChangeEvent) => {
          const { name, value } = e.target;
          setFormData((prev) => {
            const updatedState = { ...prev, [name]: value };
            // Se o profissional foi alterado, limpa a hora para forçar uma nova seleção de horário válido
            // if (name === 'profissionalId' && value !== prev.profissionalId) {
            // Se o profissional ou serviço for alterado, limpa a hora para forçar uma nova seleção
            if ((name === 'profissionalId' || name === 'servicoId') && value !== prev[name as keyof FormData]) {
              updatedState.hora = '';
            }
            return updatedState;
          });
        };
      
      
        const handleSave = () => {
          const selectedServico = servicosRes?.data.find((s: IServico) => s._id === formData.servicoId);
          
          const payload = {
            cliente: formData.clienteId,
            servico: formData.servicoId,
            profissional: formData.profissionalId,
            status: formData.status,
            observacoes: formData.observacoes,
            dataHora: new Date(`${day}T${formData.hora}`).toISOString(),
            valorServico: selectedServico?.preco || 0,
          };
          onSave(payload);
        };
      
        const isLoading = !clientesRes || !servicosRes || !profissionaisRes;
        // const hasError = clientesError || servicosError || profissionaisError || horariosError;
        const hasError = clientesError || servicosError || profissionaisError;
      
        return (
          <Dialog open={isOpen} onClose={toggle} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
            <DialogContent>
            {/* {(isLoading || (shouldFetchHorarios && !horariosRes && !horariosError)) && <CircularProgress />} */}
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
                    disabled={!formData.profissionalId || !formData.servicoId}
                  >
                    <InputLabel>Hora</InputLabel>
                    <Select name="hora" value={formData.hora} label="Hora" onChange={handleSelectChange} required>
                      {/* {horariosRes?.data?.length > 0 ? (
                        horariosRes.data.map((h: string) => (<MenuItem key={h} value={h}>{h}</MenuItem>)) */}
                      {availableTimes.length > 0 ? (
                        availableTimes.map((h: string) => (<MenuItem key={h} value={h}>{h}</MenuItem>))
                      ) : (
                        <MenuItem disabled>
                          {/* {formData.profissionalId ? 'Nenhum horário disponível' : 'Selecione um profissional'} */}
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
                  || !formData.clienteId
                  || !formData.servicoId ||
                  !formData.profissionalId
                  || !formData.hora}
                >
                Salvar
              </Button>
            </DialogActions>
          </Dialog>
        );
      }