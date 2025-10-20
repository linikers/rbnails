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
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Typography
} from "@mui/material";
import useSWR from "swr";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

// console.log(fetcher);
interface DashboardCardsProps {
    userId: string;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ userId }) => {

    const { data: apiResponse, error, isLoading } = useSWR(`/api/dashboard/stats?userId=${userId}`, fetcher);

    // console.log(apiResponse);
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
                       {items.map((cardItem, index) => (
                            <Grid key={index}>
                                <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" color="primary">{cardItem.label}</Typography>
                                        <Typography variant="h4">{cardItem.value}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
        </Grid>
    )
}