import AuthGuard from '@/components/AuthGuard';
import { useRelatorioAgendamentos } from '@/hooks/useRelatorioAgendamentos';
import { BarChart, Download } from '@mui/icons-material';
import { Box, CircularProgress, Container, Paper, Typography, Alert, Divider, TablePagination, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Button, Grid } from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import useSWR from 'swr';
// Componentes que você criará a seguir
// import { FiltrosRelatorio } from '@/components/Relatorios/FiltrosRelatorio';
// import { CardsResumoRelatorio } from '@/components/Relatorios/CardsResumoRelatorio';
// import { TabelaAgendamentos } from '@/components/Relatorios/TabelaAgendamentos';

const fetcher = (url) => fetch(url).then((res) => res.json());

const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
};

export default function PaginaRelatorios() {
  const { data, isLoading, error, filters, setFilters } = useRelatorioAgendamentos();

    const [periodo, setPeriodo] = useState('mes');
    const [profissionalId, setProfissionalId] = useState('todos');
    const [servicoId, setServicoId] = useState('todos');
    const [statusFiltro, setStatusFiltro] = useState({
        concluido: true,
        cancelado: true,
        desmarcado: true,
        agendado: true,
        confirmado: true,
    });

    const [pagina, setPagina] = useState(0);
    const [linhasPorPagina, setLinhasPorPagina] = useState(10);

    const {}= useSWR('/api/relatorios/agendamentos', fetcher);

    const statusSelecionado = Object.keys(statusFiltro).filter(status => statusFiltro[status as keyof typeof statusFiltro]);
    const apiURl =`/api/relatorios/agendamentos?periodo=${periodo}&profissionalId=${profissionalId}&servicoId=${servicoId}&status=${statusSelecionado.join(',')}&`

    const handleGerarRelatorio = () => {
        recarregarRelatorio();
    };
    const handleStatusChanfe = (e) => {
        setStatusFiltro({
            ...statusFiltro,
            [e.target.name]: e.target.checked,
        });
    };

    const handleChangeLinhasPorPagina = (event) => {
        setLinhasPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
      };
    
      const isLoading = !relatorioData && !relatorioError;
      const detalhes = relatorioData?.detalhes || [];
      const stats = relatorioData?.stats || {};




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
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Profissional"
                select
                fullWidth
                value={profissionalId}
                onChange={(e) => setProfissionalId(e.target.value)}
                disabled={!profissionaisData}
              >
                <MenuItem value="todos">Todos</MenuItem>
                {profissionaisData?.users?.map((user) => (
                  <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Serviço"
                select
                fullWidth
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                disabled={!servicosData}
              >
                <MenuItem value="todos">Todos</MenuItem>
                {servicosData?.servicos?.map((servico) => (
                  <MenuItem key={servico._id} value={servico._id}>{servico.nome}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormGroup row>
                <FormControlLabel control={<Checkbox checked={statusFiltro.Concluído} onChange={handleStatusChange} name="Concluído" />} label="Concluído" />
                <FormControlLabel control={<Checkbox checked={statusFiltro.Cancelado} onChange={handleStatusChange} name="Cancelado" />} label="Cancelado" />
                <FormControlLabel control={<Checkbox checked={statusFiltro.Pendente} onChange={handleStatusChange} name="Pendente" />} label="Pendente" />
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" startIcon={<Assessment />} onClick={handleGerarRelatorio} disabled={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Indicador de Carregamento e Erro */}
        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {relatorioError && <Alert severity="error" sx={{ my: 2 }}>Não foi possível carregar os dados do relatório. Tente novamente.</Alert>}

        {/* Conteúdo principal, exibido apenas quando os dados estiverem prontos */}
        {relatorioData && (
          <>
            {/* Cards de Resumo */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { title: 'Total de Agendamentos', value: stats.totalAgendamentos, desc: 'Quantidade total no período', icon: <Event fontSize="large" color="action" /> },
                { title: 'Agendamentos Concluídos', value: stats.agendamentosConcluidos, desc: 'Sessões finalizadas com sucesso', icon: <CheckCircle fontSize="large" color="success" /> },
                { title: 'Cancelamentos', value: stats.cancelamentos, desc: 'Agendamentos cancelados', icon: <Cancel fontSize="large" color="error" /> },
                { title: 'Faturamento Total', value: formatarMoeda(stats.faturamentoTotal), desc: 'Receita gerada no período', icon: <AttachMoney fontSize="large" color="primary" /> },
                { title: 'Tempo Médio por Atendimento', value: `${Math.round(stats.tempoMedio)} min`, desc: 'Média de duração das sessões', icon: <AccessTime fontSize="large" color="action" /> },
              ].map((card, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
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
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Evolução dos Agendamentos</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <ShowChart sx={{ mr: 1 }} />
                <Typography>Gráfico de linha/barra mostrando agendamentos ao longo do tempo.</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Agendamentos por Status</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <PieChart sx={{ mr: 1 }} />
                <Typography>Gráfico de pizza mostrando a proporção de status.</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Top 5 Profissionais</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <BarChart sx={{ mr: 1 }} />
                <Typography>Gráfico de barras comparando os profissionais com mais agendamentos.</Typography>
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
                {detalhes.slice(pagina * linhasPorPagina, pagina * linhasPorPagina + linhasPorPagina).map((linha) => (
                  <TableRow
                    key={linha._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{format(new Date(linha.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>{linha.cliente?.nome || 'N/A'}</TableCell>
                    <TableCell>{linha.profissional?.name || 'N/A'}</TableCell>
                    <TableCell>{linha.servico?.nome || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: linha.status === 'Concluído' ? 'success.main' : linha.status === 'Cancelado' ? 'error.main' : 'warning.main',
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
            count={detalhes.length}
            rowsPerPage={linhasPorPagina}
            page={pagina}
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

