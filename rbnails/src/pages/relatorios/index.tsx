import { useRelatorioAgendamentos } from '@/hooks/useRelatorioAgendamentos';
import { Box, CircularProgress, Container, Paper, Typography, Alert } from '@mui/material';

// Componentes que você criará a seguir
// import { FiltrosRelatorio } from '@/components/Relatorios/FiltrosRelatorio';
// import { CardsResumoRelatorio } from '@/components/Relatorios/CardsResumoRelatorio';
// import { TabelaAgendamentos } from '@/components/Relatorios/TabelaAgendamentos';

export default function PaginaRelatorios() {
  const { data, isLoading, error, filters, setFilters } = useRelatorioAgendamentos();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Relatório de Agendamentos
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Filtros</Typography>
        {/* Aqui entrará o componente de filtros */}
        {/* <FiltrosRelatorio filters={filters} onFilterChange={setFilters} /> */}
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </Paper>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">Ocorreu um erro ao carregar o relatório.</Alert>}

      {data && (
        <>
          {/* Aqui entrarão os cards de resumo */}
          {/* <CardsResumoRelatorio summary={data} /> */}
          <pre>{JSON.stringify({ totalAgendamentos: data.totalAgendamentos, faturamentoBruto: data.faturamentoBruto }, null, 2)}</pre>

          {/* Aqui entrará a tabela detalhada */}
          {/* <TabelaAgendamentos agendamentos={data.agendamentos} /> */}
          <pre>{JSON.stringify(data.agendamentos, null, 2)}</pre>
        </>
      )}
    </Container>
  );
}

