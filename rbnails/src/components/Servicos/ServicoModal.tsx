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
import { IServico } from '@/models/Servico';

interface ServicoModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (servico: Partial<IServico>) => void;
  initialData: Partial<IServico> | null;
}

export default function ServicoModal({
  isOpen,
  toggle,
  onSave,
  initialData,
}: ServicoModalProps) {
  const [servico, setServico] = useState<Partial<IServico>>({
    nome: '',
    preco: 0,
    duracaoEstimada: 0,
  });

  useEffect(() => {
    if (initialData) {
      setServico(initialData);
    } else {
      setServico({ nome: '', preco: 0, duracaoEstimada: 0 });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServico((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(servico);
  };

  return (
    <Dialog open={isOpen} onClose={toggle} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData?._id ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
          <TextField autoFocus margin="dense" name="nome" label="Nome do Serviço" type="text" fullWidth variant="outlined" value={servico.nome || ''} onChange={handleChange} required />
          <TextField margin="dense" name="preco" label="Preço (R$)" type="number" fullWidth variant="outlined" value={servico.preco || ''} onChange={handleChange} required />
          <TextField margin="dense" name="duracaoEstimada" label="Duração (minutos)" type="number" fullWidth variant="outlined" value={servico.duracaoEstimada || ''} onChange={handleChange} required />
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

