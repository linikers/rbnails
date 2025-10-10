import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { IBloqueio } from '@/models/Bloqueio';
import { data } from 'autoprefixer';

interface ModalBloqueioProps {
  open: boolean;
  onClose: () => void;
  onSave: (bloqueio: Partial<IBloqueio>) => void;
  bloqueio: IBloqueio | null;
  profissionalId: string;
}

export default function BloqueioModal({ open, onClose, onSave, bloqueio, profissionalId }: ModalBloqueioProps) {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().slice(0, 10),
    horaInicio: '07:00',
    horaFim: '20:00',
    motivo: '',
  });

  useEffect(() => {
    if (bloqueio) {
      setFormData({
        data: new Date(bloqueio.data).toISOString().slice(0, 10),
        horaInicio: bloqueio.horaInicio,
        horaFim: bloqueio.horaFim,
        motivo: bloqueio.motivo,
      });
    } else {
      setFormData({
        data: new Date().toISOString().slice(0, 10),
        horaInicio: '08:00',
        horaFim: '20:00',
        motivo: '',
      });
    }
  }, [bloqueio, open]);

  const handleSubmit = () => {
    const utcDate = new Date(`${formData.data}T00:00:00`);
    const dataToSave = {
      ...formData,
      data: utcDate,
      profissional: profissionalId,
      ...(bloqueio?._id && { _id: bloqueio._id }),
    };
    onSave(dataToSave);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{bloqueio ? 'Editar Bloqueio' : 'Novo Bloqueio'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField 
                label="Data"
                type="date"
                value={formData.data}
                fullWidth 
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleChange('data', e.target.value)} 
                // InputLabelProps={{ shrink: true }}
            />

            <TextField 
                label="Hora Início" 
                type="time" 
                value={formData.horaInicio}
                onChange={(e) => handleChange('horaInicio', e.target.value)} 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
                inputProps={{ step: 1800 }}
            />

            <TextField 
                label="Hora Fim" 
                type="time" value={formData.horaFim} 
                onChange={(e) => handleChange('horaFim', e.target.value)} 
                fullWidth InputLabelProps={{ shrink: true }} 
                inputProps={{ step: 1800 }}
            />

            <TextField 
                label="Motivo" 
                value={formData.motivo} 
                onChange={(e) => handleChange('motivo', e.target.value)} 
                fullWidth multiline rows={4} 
                />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}