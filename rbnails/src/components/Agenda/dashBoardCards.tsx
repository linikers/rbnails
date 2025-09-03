import { calcularTotalConfirmado, getAgendamentoByUser } from "@/lib/agendamentoStorage";
import { Card, CardContent, Grid, Typography } from "@mui/material";
// import Grid from "@mui/material/Grid";



interface Props {
    userId: string;
}
export default function DashboardCards({ userId }: Props) {

    const agendamentos = getAgendamentoByUser(userId);
    const totalConfirmados = calcularTotalConfirmado(userId);
    const qtdAtendimentos = agendamentos.length;
    const qtdConfirmados = agendamentos.filter(a => a.confirmado).length;
    const clientesUnicos = new Set(agendamentos.map(a=> a.descricao)).size;

    const items = [
        { label: "Atendimentos", value: qtdAtendimentos },
        { label: "Confirmados", value: qtdConfirmados },
        { label: "Clientes únicos", value: clientesUnicos },
        { label: "Total COnfirmado", value: `R$ ${totalConfirmados.toFixed(2)}` },
    ];

    return (
        <Grid container>
            {items.map((item, idx) => (
                <Card sx={{ borderRadius: 2, boxShadow: 3}} key={idx}>
                    <CardContent>
                        <Typography variant="h6" color="primary">{item.label}</Typography>
                        <Typography variant="h4">{item.value}</Typography>
                    </CardContent>
               </Card>
            ))}
        </Grid>
    )
}