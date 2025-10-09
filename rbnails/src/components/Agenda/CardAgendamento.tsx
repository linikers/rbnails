import { AccessTime } from "@mui/icons-material";
import { TimeSlot } from "./types";
import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";

export const CardAgendamento = ({ agendamento, onEdit }: {agendamento: TimeSlot, onEdit: () => void }) => (
    <Card 
        onClick={onEdit}
        sx={{
            mb: 1.5,
            borderLeft: `4px solid var(--custom-pink-1)`,
            transition: 'all 0.2s',
            cursor: 'pointer',
            '&:hover': { transform: 'translateX(4px)', boxShadow: 3 }
          }}
        >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'var(--custom-pink-2)', width: 40, height: 40 }}>
                        {agendamento.cliente.nome.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                            {agendamento.cliente.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {agendamento.servico.nome}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={0.5}>
                            <Chip
                            icon={<AccessTime sx={{ fontSize: 16 }} />}
                            label={format(parseISO(agendamento.dataHora), 'HH:mm')}
                            size="small"
                            sx={{ height: 24 }}
                            />
                        </Stack>
                        </Box>
                    </Stack>
                </CardContent>
        </Card>
)