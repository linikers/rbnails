import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { IHorario } from '@/models/HorarioDisponivel';

interface ModalHorarioProps {
  open: boolean;
  onClose: () => void;
  onSave: (horario: Partial<IHorario>) => void;
  horario: IHorario | null;
  profissionalId: string;
}

const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];

export default function HorarioModal({ open, onClose, onSave, horario, profissionalId }: ModalHorarioProps) {
  const [formData, setFormData] = useState({
    diaSemana: 'Segunda-feira',
    horaInicio: '08:00',
    horaFim: '18:00',
  });

  useEffect(() => {
    if (horario) {
      setFormData({
        diaSemana: diasDaSemana[horario.diaSemana],
        horaInicio: horario.horaInicio,
        horaFim: horario.horaFim,
      });
    } else {
      setFormData({
        diaSemana: "Segunda-feira",
        horaInicio: '08:00',
        horaFim: '20:00',
      });
    }
  }, [horario, open]);

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      diaSemana: diasDaSemana.indexOf(formData.diaSemana),
      profissional: profissionalId,
      ...(horario?._id && { _id: horario._id }),
    };
    onSave(dataToSave);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {horario ? 'Editar Horário' : 'Novo Horário'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth>
          <InputLabel id="dia-semana-label">Dia da Semana</InputLabel>
            <Select labelId="dia-semana-label" value={formData.diaSemana} label="Dia da Semana" onChange={(e) => handleChange('diaSemana', e.target.value)}>
              {diasDaSemana.map(dia => <MenuItem key={dia} value={dia}>{dia}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Hora Início" type="time" value={formData.horaInicio} onChange={(e) => handleChange('horaInicio', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} />
          <TextField label="Hora Fim" type="time" value={formData.horaFim} onChange={(e) => handleChange('horaFim', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}