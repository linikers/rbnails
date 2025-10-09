import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { format, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TimeSlot } from "./types";

interface VisaoSemanaProps {
  semanaAtual: Date[];
  agendamentosDaSemana: TimeSlot[];
  isMobile: boolean;
  handleOpenModal: (slot: TimeSlot | null, date: Date) => void;
}

export const VisaoSemana = ({ semanaAtual, agendamentosDaSemana, isMobile, handleOpenModal }: VisaoSemanaProps) => (
  <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2 }}>
  {semanaAtual.map((dia) => {
    const agendamentosDia = agendamentosDaSemana.filter(a => format(parseISO(a.dataHora), 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd'));
    return (
      <Paper
        key={dia.toISOString()}
        elevation={3}
        sx={{
          minWidth: isMobile ? 280 : 220,
          flex: isMobile ? '0 0 280px' : 1,
          p: 2,
          bgcolor: isToday(dia) ? 'primary.50' : 'background.paper',
          borderTop: `4px solid ${isToday(dia) ? 'var(--custom-pink-1)' : 'transparent'}`
        }}
      >
        <Box textAlign="center" mb={2}>
          <Typography variant="caption" color="text.secondary" textTransform="capitalize">
            {format(dia, 'EEE', { locale: ptBR })}
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {format(dia, 'd')}
          </Typography>
          <Chip
            label={`${agendamentosDia.length} agend.`}
            size="small"
            color={agendamentosDia.length > 0 ? 'primary' : 'default'}
            sx={{ mt: 1 }}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          {agendamentosDia.length > 0 ? (
            agendamentosDia.map(agendamento => (
              <Box
                key={agendamento.id}
                onClick={() => handleOpenModal(agendamento, dia)}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  borderLeft: `3px solid var(--custom-pink-2)`,
                  bgcolor: 'background.default',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Typography variant="body2" fontWeight={600} noWrap>
                  {format(parseISO(agendamento.dataHora), 'HH:mm')}
                </Typography>
                <Typography variant="caption" noWrap>
                  {agendamento.cliente.nome}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ pt: 2 }}>
              Sem agendamentos
            </Typography>
          )}
        </Stack>
      </Paper>
    );
  })}
</Box>
);