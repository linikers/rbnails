import AuthGuard from '@/components/AuthGuard';
import {
  Assessment,
  BarChart,
  Cancel,
  CheckCircle,
  Download,
  Event,
  PieChart,
  ShowChart,
  AccessTime,
  AttachMoney
} from '@mui/icons-material';
import { Box, CircularProgress, Paper, Typography, Alert, Divider, TablePagination, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Button, Grid, TextField, MenuItem, FormGroup, FormControlLabel, Checkbox, Card, CardContent } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: any) => fetch(url).then((res) => res.json());

const formatarMoeda = (valor: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
};

export default function PaginaRelatorios() {
    const [periodo, setPeriodo] = useState('mes');
    const [profissionalId, setProfissionalId] = useState('todos');
    const [servicoId, setServicoId] = useState('todos');
    const [statusFiltro, setStatusFiltro] = useState({
        'Concluído': true,
        'Cancelado': true,
        'Pendente': true,
        'Agendado': true,
        'Confirmado': true,
        'Desmarcado': false,
    });

    // Paginação: MUI é 0-indexado, nossa API é 1-indexada.
    const [pagina, setPagina] = useState(0); 
    const [linhasPorPagina, setLinhasPorPagina] = useState(10);

    // Busca de dados para os filtros
    const { data: profissionaisData } = useSWR('/api/users?role=profissional', fetcher);
    const { data: servicosData } = useSWR('/api/servicos', fetcher);

    // Constrói a URL da API dinamicamente com base nos filtros e paginação
    const statusSelecionados = Object.keys(statusFiltro).filter(status => statusFiltro[status as keyof typeof statusFiltro]).join(',');
    const apiUrl = `/api/relatorios/agendamentos?periodo=${periodo}&profissionalId=${profissionalId}&servicoId=${servicoId}&status=${statusSelecionados}&pagina=${pagina + 1}&limite=${linhasPorPagina}`;

    const { data: relatorioData, error: relatorioError, mutate: recarregarRelatorio } = useSWR(apiUrl, fetcher, { revalidateOnFocus: false });

    const handleGerarRelatorio = () => {
        recarregarRelatorio();
    };
    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatusFiltro({
            ...statusFiltro,
            [e.target.name]: e.target.checked,
        });
    };

    const handleChangePagina = (event: unknown, novaPagina: number) => {
      setPagina(novaPagina);
    };

    const handleChangeLinhasPorPagina = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLinhasPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };
    
    const isLoading = !relatorioData && !relatorioError;
    const { stats, detalhes, paginacao } = relatorioData || {};

  return (

    <AuthGuard>
      <Box sx={{ p: 3 }}>
        {/* Cabeçalho */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Relatórios de Agendamentos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Visualize estatísticas e métricas sobre agendamentos, usuários e faturamento.
          </Typography>
        </Box>

        {/* Filtros */}
        <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <TextField
                label="Período"
                select
                fullWidth
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <MenuItem value="hoje">Hoje</MenuItem>
                <MenuItem value="semana">Esta Semana</MenuItem>
                <MenuItem value="mes">Este Mês</MenuItem>
                {/* <MenuItem value="personalizado">Personalizado</MenuItem> */}
              </TextField>
            </Grid>
            <Grid>
              <TextField
                label="Profissional"
                select
                fullWidth
                value={profissionalId}
                onChange={(e) => setProfissionalId(e.target.value)}
                disabled={!profissionaisData}
              >
                <MenuItem value="todos">Todos</MenuItem>
                {profissionaisData?.users?.map((user: any) => (
                  <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid>
              <TextField
                label="Serviço"
                select
                fullWidth
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                disabled={!servicosData}
              >
                <MenuItem value="todos">Todos</MenuItem>
                {servicosData?.servicos?.map((servico: any) => (
                  <MenuItem key={servico._id} value={servico._id}>{servico.nome}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid>
              <FormGroup row>
                <FormControlLabel control={<Checkbox checked={statusFiltro.Concluído} onChange={handleStatusChange} name="Concluído" />} label="Concluído" />
                <FormControlLabel control={<Checkbox checked={statusFiltro.Cancelado} onChange={handleStatusChange} name="Cancelado" />} label="Cancelado" />
                <FormControlLabel control={<Checkbox checked={statusFiltro.Agendado} onChange={handleStatusChange} name="Agendado" />} label="Agendado" />
              </FormGroup>
            </Grid>
            <Grid display="flex" justifyContent="flex-end">
              <Button variant="contained" startIcon={<Assessment />} onClick={handleGerarRelatorio} disabled={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Indicador de Carregamento e Erro */}
        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {relatorioError && <Alert severity="error" sx={{ my: 2 }}>Não foi possível carregar os dados do relatório. Verifique a conexão e tente novamente.</Alert>}

        {/* Conteúdo principal, exibido apenas quando os dados estiverem prontos */}
        {relatorioData && (
          <>
            {/* Cards de Resumo */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { title: 'Total de Agendamentos', value: stats?.totalAgendamentos, desc: 'Quantidade total no período', icon: <Event fontSize="large" color="action" /> },
                { title: 'Agendamentos Concluídos', value: stats?.agendamentosConcluidos, desc: 'Sessões finalizadas com sucesso', icon: <CheckCircle fontSize="large" color="success" /> },
                { title: 'Cancelamentos', value: stats?.cancelamentos, desc: 'Agendamentos cancelados', icon: <Cancel fontSize="large" color="error" /> },
                { title: 'Faturamento Total', value: formatarMoeda(stats?.faturamentoTotal), desc: 'Receita gerada no período', icon: <AttachMoney fontSize="large" color="primary" /> },
                { title: 'Tempo Médio (Concluídos)', value: `${Math.round(stats?.tempoMedio)} min`, desc: 'Média de duração das sessões', icon: <AccessTime fontSize="large" color="action" /> },
              ].map((card) => (
                <Grid key={card.title}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h5" component="div" fontWeight="bold">{card.value}</Typography>
                          <Typography color="text.secondary" sx={{ mb: 1 }}>{card.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{card.desc}</Typography>
                        </Box>
                        {card.icon}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

        {/* Seção de Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid>
            <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Evolução dos Agendamentos</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <ShowChart sx={{ mr: 1 }} />
                <Typography>Gráfico de evolução será implementado aqui.</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid>
            <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Agendamentos por Status</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <PieChart sx={{ mr: 1 }} />
                <Typography>Gráfico de status será implementado aqui.</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid>
            <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Top 5 Profissionais</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <BarChart sx={{ mr: 1 }} />
                <Typography>Gráfico de top profissionais será implementado aqui.</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

            {/* Tabela de Detalhes */}
        <Paper elevation={2}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Detalhes dos Agendamentos</Typography>
            <Button variant="outlined" startIcon={<Download />}>
              Exportar para Excel
            </Button>
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de detalhes">
              <TableHead>
                <TableRow>
                  <TableCell>Data / Hora</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Profissional</TableCell>
                  <TableCell>Serviço</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detalhes?.map((linha: any) => (
                  <TableRow
                    key={linha._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{format(new Date(linha.dataHora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>{linha.cliente?.nome || 'N/A'}</TableCell>
                    <TableCell>{linha.profissional?.name || 'N/A'}</TableCell>
                    <TableCell>{linha.servico?.nome || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: linha.status === 'Concluído' ? 'success.main' : linha.status === 'Cancelado' || linha.status === 'Desmarcado' ? 'error.main' : 'text.secondary',
                          fontWeight: 'bold'
                        }}
                      >
                        {linha.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatarMoeda(linha.servico?.preco)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={paginacao?.total || 0}
            rowsPerPage={paginacao?.limite || 10}
            page={paginacao?.pagina - 1 || 0}
            onPageChange={handleChangePagina}
            onRowsPerPageChange={handleChangeLinhasPorPagina}
            labelRowsPerPage="Linhas por página:"
          />
        </Paper>
          </>
        )}

        {/* Rodapé */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Relatórios gerados automaticamente com base nos agendamentos do sistema.
          </Typography>
          <Typography variant="caption" display="block">
            <a href="#">Ver histórico de relatórios anteriores</a>
          </Typography>
        </Box>
      </Box>
    </AuthGuard>
    
  );
}
