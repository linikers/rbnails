import { useEffect, useState } from "react";
import { TimeSlot } from "./types";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import useSWR from "swr";
import { Alert, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { IServico } from "@/models/Servico";
import { format, parseISO } from "date-fns";
import { ICliente } from "@/models/Cliente";
import { IUser } from "@/models/User";

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
        status: string;
        observacoes: string;
    }

  
    export default function AddEditModal({
        isOpen,
        toggle,
        onSave,
        initialData,
        day,
      }: AddEditModalProps) {
        const { data: clientesRes, error: clientesError } = useSWR('/api/clientes', fetcher);
        const { data: servicosRes, error: servicosError } = useSWR('/api/servicos', fetcher);
        const { data: profissionaisRes, error: profissionaisError } = useSWR('/api/users?role=profissional', fetcher);
      
        const [formData, setFormData] = useState<FormData>({
          clienteId: '',
          servicoId: '',
          profissionalId: '',
          hora: '09:00',
          status: 'agendado',
          observacoes: '',
        });
      
        useEffect(() => {
          if (initialData) {
            setFormData({
              clienteId: initialData.cliente?._id || '',
              servicoId: initialData.servico?._id || '',
              profissionalId: initialData.profissional?._id || '',
              hora: format(parseISO(initialData.dataHora), 'HH:mm'),
              status: initialData.status,
              observacoes: initialData.observacoes || '',
            });
          } else {
            // Reset form for new entry
            setFormData({
              clienteId: '',
              servicoId: '',
              profissionalId: '',
              hora: '09:00',
              status: 'agendado',
              observacoes: '',
            });
          }
        }, [initialData, isOpen]);
      
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
        };
      
        const handleSelectChange = (e: SelectChangeEvent) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
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
                  <TextField margin="dense" name="hora" label="Hora" type="time" fullWidth variant="outlined" value={formData.hora} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select name="status" value={formData.status} label="Status" onChange={handleSelectChange}>
                      <MenuItem value="agendado">Agendado</MenuItem>
                      <MenuItem value="confirmado">Confirmado</MenuItem>
                      <MenuItem value="concluído">Concluído</MenuItem>
                      <MenuItem value="cancelado">Cancelado</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField margin="dense" name="observacoes" label="Observações" type="text" fullWidth multiline rows={3} variant="outlined" value={formData.observacoes} onChange={handleChange} />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={toggle}>Cancelar</Button>
              <Button onClick={handleSave} variant="contained" disabled={isLoading}>
                Salvar
              </Button>
            </DialogActions>
          </Dialog>
        );
      }