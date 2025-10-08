// import {
//     addAgendamento,
//     Agendamento,
//     calcularTotalConfirmado,
//     getAgendamentosByUserId,
//     getAgendamentosConfirmados,
//     getUniqueConfirmedClientsCount,
//     updateAgendamento
// } from "@/lib/agendamentoStorage";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    // Dialog,
    // DialogActions,
    // DialogContent,
    // DialogTitle,
    Grid,
    // IconButton,
    // TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import useSWR from "swr";
// import Grid from "@mui/material/Grid";
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import stats from "@/pages/api/dashboard/stats";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DashboardCardsProps {
    userId: string;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ userId }) => {

    const { data: apiResponse, error, isLoading } = useSWR(`/api/dashboard/stats?userId=${userId}`, fetcher);

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    if (error || !apiResponse?.success) return <Alert severity="error">Erro ao carregar as estatísticas do dashboard.</Alert>;

    const stats = apiResponse.data;

    const items = [
        { label: "Atendimentos no Mês", value: stats.qtdAtendimentos },
        { label: "Concluídos no Mês", value: stats.qtdConcluidos },
        { label: "Clientes Únicos", value: stats.clientesUnicos },
        { label: "Faturamento (Concluído)", value: `R$ ${stats.faturamento.toFixed(2)}` },
    ];

    return (
        <Grid container spacing={3} sx={{ p: 2 }}>
                       {items.map((item, id) => (
                            <Grid xs={12} sm={6} md={3} key={id}>
                                <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" color="primary">{item.label}</Typography>
                                        <Typography variant="h4">{item.value}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
            ))}
        </Grid>
    )
}