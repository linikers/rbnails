import useSWR from 'swr';
import {
    Box,
    Typography,
    Stack,
    CircularProgress,
    Alert,
    Paper
} from "@mui/material";
import { CalendarToday } from '@mui/icons-material';
import { TimeSlot } from './types';
import { CardAgendamento } from './CardAgendamento';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MinhaAgendaProps {
    userId: string;
}

export const MinhaAgenda: React.FC<MinhaAgendaProps> = ({ userId }) => {
    const { data: apiResponse, error, isLoading } = useSWR(`/api/agendamentos/today?userId=${userId}`, fetcher, {
        refreshInterval: 60000 // Atualiza a cada minuto
    });

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    if (error || !apiResponse?.success) return <Alert severity="error">Erro ao carregar sua agenda do dia.</Alert>;

    const agendamentos: TimeSlot[] = apiResponse.data;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Minha Agenda de Hoje
            </Typography>
            {agendamentos.length > 0 ? (
                <Stack spacing={0}>
                    {agendamentos.map((agendamento) => (
                        <CardAgendamento
                            key={agendamento.id}
                            agendamento={agendamento}
                            onEdit={() => { /* TODO: Implementar edição a partir do dashboard se necessário */ }}
                        />
                    ))}
                </Stack>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mt: 2 }}>
                    <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Nenhum agendamento para hoje.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};
