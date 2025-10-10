import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IBloqueio } from '@/models/Bloqueio';

interface BloqueioTableProps {
  bloqueios: IBloqueio[];
  onEdit: (bloqueio: IBloqueio) => void;
  onDelete: (id: string) => void;
}

const BloqueioTable: React.FC<BloqueioTableProps> = ({ bloqueios, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Hora Início</TableCell>
            <TableCell>Hora Fim</TableCell>
            <TableCell>Motivo</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bloqueios.map((bloqueio) => (
            <TableRow key={bloqueio._id}>
              <TableCell>{bloqueio.data}</TableCell>
              <TableCell>{bloqueio.horaInicio}</TableCell>
              <TableCell>{bloqueio.horaFim}</TableCell>
              <TableCell>{bloqueio.motivo}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(bloqueio)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(bloqueio._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BloqueioTable;
