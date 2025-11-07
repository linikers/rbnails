import { useState } from 'react';
import useSWR from 'swr';
import {
    Box,
    Typography,
    Stack,
    CircularProgress,
    Alert,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from "@mui/material";
import { CalendarToday, Group } from '@mui/icons-material';
import { TimeSlot } from './types';
import { CardAgendamento } from './CardAgendamento';
import { IUser } from '@/models/User';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AgendaProfissionais: React.FC = () => {
    const [selectedProfissionalId, setSelectedProfissionalId] = useState<string>('');

    // 1. Fetch all professionals
    const { data: profissionaisResponse, error: profissionaisError } = useSWR('/api/users?role=profissional', fetcher);
    const profissionais: IUser[] = profissionaisResponse?.data || [];

    // 2. Fetch appointments for the selected professional
    const { data: apiResponse, error, isLoading } = useSWR(
        selectedProfissionalId ? `/api/agendamentos/today?userId=${selectedProfissionalId}` : null,
        fetcher,
        { refreshInterval: 60000 } // Refresh every minute
    );

    const handleProfissionalChange = (event: SelectChangeEvent<string>) => {
        setSelectedProfissionalId(event.target.value);
    };

    const renderContent = () => {
        if (!selectedProfissionalId) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Group sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                        Selecione um profissional para ver a agenda.
                    </Typography>
                </Paper>
            );
        }

        if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
        if (error || !apiResponse?.success) return <Alert severity="error">Erro ao carregar a agenda do profissional.</Alert>;

        const agendamentos: TimeSlot[] = apiResponse.data;

        if (agendamentos.length === 0) {
            return (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mt: 2 }}>
                    <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Nenhum agendamento para hoje.
                    </Typography>
                </Paper>
            );
        }

        return (
            <Stack spacing={0}>
                {agendamentos.map((agendamento) => (
                    <CardAgendamento
                        key={agendamento.id}
                        agendamento={agendamento}
                        onEdit={() => { /* A edição pode ser implementada aqui se necessário */ }}
                    />
                ))}
            </Stack>
        );
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Agenda dos Profissionais (Hoje)
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="profissional-select-label">Selecione o Profissional</InputLabel>
                <Select
                    labelId="profissional-select-label"
                    value={selectedProfissionalId}
                    label="Selecione o Profissional"
                    onChange={handleProfissionalChange}
                    disabled={profissionaisError || !profissionaisResponse}
                >
                    {profissionais.map((p) => (
                        <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {renderContent()}
        </Box>
    );
};

