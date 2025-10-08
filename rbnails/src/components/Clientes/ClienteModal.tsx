import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material';
import { ICliente } from '@/models/Cliente';

interface ClienteModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (cliente: Partial<ICliente>) => void;
  initialData: Partial<ICliente> | null;
}

export default function ClienteModal({
  isOpen,
  toggle,
  onSave,
  initialData,
}: ClienteModalProps) {
  const [cliente, setCliente] = useState<Partial<ICliente>>({
    nome: '',
    telefone: '',
    email: '',
  });

  useEffect(() => {
    if (initialData) {
      setCliente(initialData);
    } else {
      setCliente({ nome: '', telefone: '', email: '' });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(cliente);
  };

  return (
    <Dialog open={isOpen} onClose={toggle} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData?._id ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
          <TextField autoFocus margin="dense" name="nome" label="Nome Completo" type="text" fullWidth variant="outlined" value={cliente.nome || ''} onChange={handleChange} required />
          <TextField margin="dense" name="telefone" label="Telefone (com DDD)" type="tel" fullWidth variant="outlined" value={cliente.telefone || ''} onChange={handleChange} required />
          <TextField margin="dense" name="email" label="Email (Opcional)" type="email" fullWidth variant="outlined" value={cliente.email || ''} onChange={handleChange} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
