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
import { IHorario } from '@/models/HorarioDisponivel';

interface HorarioTableProps {
  horarios: IHorario[];
  onEdit: (horario: IHorario) => void;
  onDelete: (id: string) => void;
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

const HorarioTable: React.FC<HorarioTableProps> = ({ horarios, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dia da Semana</TableCell>
            <TableCell>Hora Início</TableCell>
            <TableCell>Hora Fim</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {horarios.map((horario) => (
            <TableRow key={horario._id}>
              <TableCell>{diasDaSemana[horario.diaSemana]}</TableCell>
              <TableCell>{horario.horaInicio}</TableCell>
              <TableCell>{horario.horaFim}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(horario)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(horario._id)}>
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

export default HorarioTable;
