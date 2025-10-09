import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  useMediaQuery,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Divider,
  Paper
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  AccessTime,
  Person,
  Add
} from '@mui/icons-material';

const agendamentos = [
  { id: 1, cliente: 'Ana Silva', servico: 'Corte de Cabelo', hora: '09:00', duracao: '1h', dia: 1, cor: '#FF6B6B' },
  { id: 2, cliente: 'Carlos Santos', servico: 'Barba', hora: '10:30', duracao: '30min', dia: 1, cor: '#4ECDC4' },
  { id: 3, cliente: 'Maria Costa', servico: 'Manicure', hora: '14:00', duracao: '45min', dia: 1, cor: '#45B7D1' },
  { id: 4, cliente: 'João Pereira', servico: 'Corte + Barba', hora: '16:00', duracao: '1h30', dia: 2, cor: '#96CEB4' },
  { id: 5, cliente: 'Paula Oliveira', servico: 'Coloração', hora: '09:00', duracao: '2h', dia: 2, cor: '#FFEAA7' },
  { id: 6, cliente: 'Roberto Lima', servico: 'Corte', hora: '11:30', duracao: '1h', dia: 3, cor: '#DFE6E9' },
  { id: 7, cliente: 'Juliana Souza', servico: 'Penteado', hora: '15:00', duracao: '1h', dia: 4, cor: '#A29BFE' },
  { id: 8, cliente: 'Pedro Alves', servico: 'Corte Infantil', hora: '10:00', duracao: '30min', dia: 5, cor: '#FD79A8' },
];

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function AgendaSystem() {
  const [diaAtual, setDiaAtual] = useState(1);
  const [visualizacao, setVisualizacao] = useState('semana');
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  const semanaAtual = [
    { dia: 1, diaSemana: 'Seg', diaMes: 8 },
    { dia: 2, diaSemana: 'Ter', diaMes: 9 },
    { dia: 3, diaSemana: 'Qua', diaMes: 10 },
    { dia: 4, diaSemana: 'Qui', diaMes: 11 },
    { dia: 5, diaSemana: 'Sex', diaMes: 12 },
    { dia: 6, diaSemana: 'Sáb', diaMes: 13 },
    { dia: 0, diaSemana: 'Dom', diaMes: 14 },
  ];

  const agendamentosDoDia = agendamentos.filter(a => a.dia === diaAtual);
  const agendamentosDaSemana = agendamentos;

  const CardAgendamento = ({ agendamento, compact = false }) => (
    <Card 
      sx={{ 
        mb: 1.5, 
        borderLeft: `4px solid ${agendamento.cor}`,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ py: compact ? 1.5 : 2, '&:last-child': { pb: compact ? 1.5 : 2 } }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: agendamento.cor, width: 40, height: 40 }}>
            {agendamento.cliente.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {agendamento.cliente}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {agendamento.servico}
            </Typography>
            <Stack direction="row" spacing={1} mt={0.5}>
              <Chip 
                icon={<AccessTime sx={{ fontSize: 16 }} />} 
                label={agendamento.hora} 
                size="small" 
                sx={{ height: 24 }}
              />
              <Chip 
                label={agendamento.duracao} 
                size="small" 
                variant="outlined"
                sx={{ height: 24 }}
              />
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const VisaoSemana = () => (
    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2 }}>
      {semanaAtual.map((dia) => {
        const agendamentosDia = agendamentos.filter(a => a.dia === dia.dia);
        return (
          <Paper
            key={dia.dia}
            sx={{
              minWidth: isMobile ? 280 : 200,
              flex: isMobile ? '0 0 280px' : 1,
              p: 2,
              bgcolor: dia.dia === diaAtual ? 'primary.50' : 'background.paper'
            }}
          >
            <Box textAlign="center" mb={2}>
              <Typography variant="caption" color="text.secondary">
                {dia.diaSemana}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {dia.diaMes}
              </Typography>
              <Chip 
                label={`${agendamentosDia.length} agend.`} 
                size="small" 
                color={agendamentosDia.length > 0 ? 'primary' : 'default'}
                sx={{ mt: 1 }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box>
              {agendamentosDia.length > 0 ? (
                agendamentosDia.map(agendamento => (
                  <Box 
                    key={agendamento.id}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 1,
                      borderLeft: `3px solid ${agendamento.cor}`,
                      bgcolor: 'background.default',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {agendamento.hora}
                    </Typography>
                    <Typography variant="caption" noWrap>
                      {agendamento.cliente}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary" noWrap>
                      {agendamento.servico}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Sem agendamentos
                </Typography>
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f5f7fa',
      p: isMobile ? 2 : 3 
    }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} color="primary">
              Agenda
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Outubro 2025
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            size={isMobile ? 'small' : 'medium'}
          >
            Novo
          </Button>
        </Stack>

        {/* Seletor de Dia */}
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <IconButton size="small">
            <ChevronLeft />
          </IconButton>
          <Box sx={{ flex: 1, overflowX: 'auto' }}>
            <Stack direction="row" spacing={1}>
              {semanaAtual.map((dia) => (
                <Chip
                  key={dia.dia}
                  label={`${dia.diaSemana} ${dia.diaMes}`}
                  onClick={() => setDiaAtual(dia.dia)}
                  color={diaAtual === dia.dia ? 'primary' : 'default'}
                  sx={{ 
                    minWidth: isMobile ? 60 : 80,
                    fontWeight: diaAtual === dia.dia ? 600 : 400
                  }}
                />
              ))}
            </Stack>
          </Box>
          <IconButton size="small">
            <ChevronRight />
          </IconButton>
        </Stack>

        {/* Tabs de Visualização */}
        <Tabs 
          value={visualizacao} 
          onChange={(e, v) => setVisualizacao(v)}
          variant="fullWidth"
        >
          <Tab label="Dia" value="dia" />
          <Tab label="Semana" value="semana" />
        </Tabs>
      </Paper>

      {/* Conteúdo */}
      {visualizacao === 'dia' ? (
        <Box>
          <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <CalendarToday color="primary" />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {semanaAtual.find(d => d.dia === diaAtual)?.diaSemana}, {semanaAtual.find(d => d.dia === diaAtual)?.diaMes} de Outubro
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {agendamentosDoDia.length} agendamento{agendamentosDoDia.length !== 1 ? 's' : ''} hoje
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {agendamentosDoDia.length > 0 ? (
            agendamentosDoDia.map(agendamento => (
              <CardAgendamento key={agendamento.id} agendamento={agendamento} />
            ))
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Nenhum agendamento para este dia
              </Typography>
            </Paper>
          )}
        </Box>
      ) : (
        <VisaoSemana />
      )}
    </Box>
  );
}