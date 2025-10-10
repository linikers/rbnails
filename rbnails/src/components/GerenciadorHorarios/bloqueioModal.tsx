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
    horaInicio: '08:00',
    horaFim: '18:00',
    motivo: '',
  });

  useEffect(() => {
    if (bloqueio) {
      setFormData({
        data: bloqueio.data,
        horaInicio: bloqueio.horaInicio,
        horaFim: bloqueio.horaFim,
        motivo: bloqueio.motivo,
      });
    } else {
      setFormData({
        data: new Date().toISOString().slice(0, 10),
        horaInicio: '08:00',
        horaFim: '18:00',
        motivo: '',
      });
    }
  }, [bloqueio, open]);

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
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
          <TextField label="Data" type="date" value={formData.data} onChange={(e) => handleChange('data', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Hora Início" type="time" value={formData.horaInicio} onChange={(e) => handleChange('horaInicio', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} />
          <TextField label="Hora Fim" type="time" value={formData.horaFim} onChange={(e) => handleChange('horaFim', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} />
          <TextField label="Motivo" value={formData.motivo} onChange={(e) => handleChange('motivo', e.target.value)} fullWidth multiline rows={4} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
// ```

// Este componente `BloqueioModal` segue uma estrutura similar ao `horarioModal.tsx`, utilizando `Dialog` do Material-UI para criar um modal. Ele inclui campos para `data`, `horaInicio`, `horaFim` e `motivo` do bloqueio. Os dados são gerenciados através do hook `useState`, e o hook `useEffect` é utilizado para preencher o formulário quando um bloqueio existente é passado para o modal.

// Para integrar este modal no `gerenciarHorarios.tsx`, você precisará:

// 1.  Importar o componente `BloqueioModal`.
// 2.  Criar um estado para controlar a abertura do modal e o bloqueio selecionado (se estiver editando).
// 3.  Adicionar botões para abrir o modal de criação e edição de bloqueios.
// 4.  Implementar a lógica para salvar e deletar bloqueios, possivelmente chamando as APIs correspondentes.

// Lembre-se de ajustar os tipos (`IBloqueio`) e os campos conforme necessário para corresponder à sua estrutura de dados e requisitos de negócios.

// Espero que ajude!

// <!--
// [PROMPT_SUGGESTION]Gostaria de ver um exemplo de como integrar o BloqueioModal no gerenciarHorarios.tsx?[/PROMPT_SUGGESTION]
// [PROMPT_SUGGESTION]Como posso melhorar a validação dos campos no BloqueioModal?[/PROMPT_SUGGESTION]
// ->
