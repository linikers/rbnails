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

const diasSemana = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

export default function ModalHorario({ open, onClose, onSave, horario, profissionalId }: ModalHorarioProps) {
  const [formData, setFormData] = useState({
    diaSemana: 1,
    horaInicio: '08:00',
    horaFim: '18:00',
  });

  useEffect(() => {
    if (horario) {
      setFormData({
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio,
        horaFim: horario.horaFim,
      });
    } else {
      setFormData({
        diaSemana: 1,
        horaInicio: '08:00',
        horaFim: '18:00',
      });
    }
  }, [horario, open]);

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
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
        {horario ? 'Editar Horário Disponível' : 'Novo Horário Disponível'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Dia da Semana</InputLabel>
            <Select
              value={formData.diaSemana}
              label="Dia da Semana"
              onChange={(e) => handleChange('diaSemana', e.target.value)}
            >
              {diasSemana.map((dia) => (
                <MenuItem key={dia.value} value={dia.value}>
                  {dia.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Hora Início"
            type="time"
            value={formData.horaInicio}
            onChange={(e) => handleChange('horaInicio', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 1800 }} // 30 minutos
          />

          <TextField
            label="Hora Fim"
            type="time"
            value={formData.horaFim}
            onChange={(e) => handleChange('horaFim', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 1800 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}