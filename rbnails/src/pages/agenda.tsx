import React, { useEffect, useMemo, useState } from "react";
import { CardAgendamento } from "@/components/Agenda/CardAgendamento";
import AddEditModal from "@/components/Agenda/modalAddEdit";
import { TimeSlot } from "@/components/Agenda/types";
import { VisaoSemana } from "@/components/Agenda/VisaoSemana";
import AuthGuard from "@/components/AuthGuard";
import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
// import { Add, CalendarToday, ChevronLeft, ChevronRight } from "@mui/icons-material";
import Add from '@mui/icons-material/Add';
import CalendarToday from '@mui/icons-material/CalendarToday';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Alert, Box, Button, Chip, CircularProgress, Container, IconButton, Paper, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { addDays, addMinutes, eachDayOfInterval, endOfWeek, format, parseISO, setHours, setMinutes, startOfWeek, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Agenda() {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [visualizacao, setVisualizacao] = useState('semana');
  const { data: session } = useSession();
  const [openModal, setOpenModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);
  const [slotsProcessados, setSlotsProcessados] = useState<any[]>([]);

  const isMobile = useMediaQuery('(max-width:600px)');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const semanaAtual = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const userId = session?.user.id;


  // const apiUrl = `/api/agendamentos?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`;
  const apiUrl = userId ? `/api/agendamentos?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}&profissionalId=${userId}` : null;
  
  const { data: apiResponse, error, isLoading, mutate } = useSWR(apiUrl, fetcher);

  const { data: horariosResponse, isLoading: horariosLoading } = useSWR(userId ? `/api/horarios-disponiveis?profissionalId=${userId}` : null, fetcher);
  const { data: bloqueiosResponse, isLoading: bloqueiosLoading } = useSWR(userId ? `/api/horarios-bloqueios?profissionalId=${userId}` : null, fetcher);

  const agendamentosDaSemana: TimeSlot[] = useMemo(() => apiResponse?.data || [], [apiResponse]);
  const horariosDisponiveis = useMemo(() => horariosResponse?.data || [], [horariosResponse]);
  const bloqueios = useMemo(() => bloqueiosResponse?.data || [], [bloqueiosResponse]);

  useEffect(() => {
   
    if (!userId || horariosLoading || bloqueiosLoading || isLoading) return;

    const todosOsSlots = semanaAtual.flatMap(dia => {
      const diaDaSemanaNumerico = dia.getDay();

      let horarioTrabalho: any = horariosDisponiveis.find((h: any) => h.diaSemana === diaDaSemanaNumerico);

      if (!horarioTrabalho && diaDaSemanaNumerico > 0 && diaDaSemanaNumerico < 6) { // Padrão de Seg a Sex
        horarioTrabalho = { horaInicio: '07:00', horaFim: '20:00' };
      }

      if (!horarioTrabalho) {
        return []; // Dia sem expediente
      }

      const [inicioHoras, inicioMinutos] = horarioTrabalho.horaInicio.split(':').map(Number);
      const [fimHoras, fimMinutos] = horarioTrabalho.horaFim.split(':').map(Number);

      const inicioDoDia = setMinutes(setHours(dia, inicioHoras), inicioMinutos);
      const fimDoDia = setMinutes(setHours(dia, fimHoras), fimMinutos);

      const slotsDoDia = [];
      let slotAtual = inicioDoDia;

      while (slotAtual < fimDoDia) {
        const proximoSlot = addMinutes(slotAtual, 30);

        const slotParaAdicionar: any = {
          id: null,
          dataHora: slotAtual.toISOString(),
          status: 'livre',
        };

        const agendamentoNoSlot = agendamentosDaSemana.find(ag => {
          const dataAgendamento = parseISO(ag.dataHora);
          return dataAgendamento >= slotAtual && dataAgendamento < proximoSlot;
        });

        if (agendamentoNoSlot) {
          Object.assign(slotParaAdicionar, { ...agendamentoNoSlot, status: 'agendado' });
        } else {
          const bloqueioNoSlot = bloqueios.find((bl: any) => {
            if (format(parseISO(bl.data), 'yyyy-MM-dd') !== format(dia, 'yyyy-MM-dd')) return false;

            const [inicioHorasBl, inicioMinutosBl] = bl.horaInicio.split(':').map(Number);
            const [fimHorasBl, fimMinutosBl] = bl.horaFim.split(':').map(Number);
            const inicioBloqueio = setMinutes(setHours(dia, inicioHorasBl), inicioMinutosBl);
            const fimBloqueio = setMinutes(setHours(dia, fimHorasBl), fimMinutosBl);

            return slotAtual < fimBloqueio && proximoSlot > inicioBloqueio;
          });

          if (bloqueioNoSlot) {
            slotParaAdicionar.status = 'bloqueado';
            slotParaAdicionar.cliente = { nome: bloqueioNoSlot.motivo };
          }
        }
        slotsDoDia.push(slotParaAdicionar);
        slotAtual = proximoSlot;
      }
      return slotsDoDia;
    });

    setSlotsProcessados(todosOsSlots);
  }, [agendamentosDaSemana, horariosDisponiveis, bloqueios, semanaAtual, userId, horariosLoading, bloqueiosLoading, isLoading])
  
  // const agendamentosDaSemana: TimeSlot[] = apiResponse?.data || [];
  
  const handleOpenModal = (slot: TimeSlot | null, date: Date) => {
    if (slot && (slot as any).status === 'bloqueado') {
      return; // Não faz nada se o slot estiver bloqueado
    }
    setSelectedDay(date);
    setCurrentSlot(slot);
    setOpenModal(true);
  };


  const handleSaveSlot = async (slotDataFromModal: any) => {
    const isEditing = currentSlot && currentSlot.id;
    const url = isEditing ? `/api/agendamentos/${currentSlot.id}` : '/api/agendamentos';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotDataFromModal),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Falha ao salvar agendamento');
      }
      
      mutate();
      setOpenModal(false);
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro ao salvar. Verifique o console.');
    }
  };

  const agendamentosDoDiaSelecionado = slotsProcessados.filter(
    a => a.status === 'agendado' && format(parseISO(a.dataHora), 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd')
  );

  return (
    <AuthGuard>
      <Container>
        <header className="custom-header">
          <Logo />
          <NavBar />
        </header>
        <Box sx={{ minHeight: '100vh', p: isMobile ? 1 : 2 }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} color="primary">
                  Agenda
                </Typography>
                <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenModal(null, selectedDay)}
                size={isMobile ? 'small' : 'medium'}
              >
                Novo
              </Button>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <IconButton size="small" onClick={() => setCurrentDate(subDays(currentDate, 7))}>
                <ChevronLeft />
              </IconButton>
              <Box sx={{ flex: 1, overflowX: 'auto' }}>
                <Stack direction="row" spacing={1} justifyContent="center">
                  {semanaAtual.map((dia) => (
                    <Chip
                      key={dia.toISOString()}
                      label={`${format(dia, 'EEE', { locale: ptBR })} ${format(dia, 'd')}`}
                      onClick={() => setSelectedDay(dia)}
                      color={format(selectedDay, 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd') ? 'primary' : 'default'}
                      sx={{ minWidth: isMobile ? 60 : 80, fontWeight: 600}}
                    />
                  ))}
                </Stack>
              </Box>
              <IconButton size="small" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                <ChevronRight />
              </IconButton>
            </Stack>

            <Tabs value={visualizacao} onChange={(v: any) => setVisualizacao(v)} variant="fullWidth" centered>
              <Tab label="Dia" value="dia" />
              <Tab label="Semana" value="semana" />
            </Tabs>
          </Paper>

          {isLoading && <CircularProgress />}
          {error && <Alert severity="error">Não foi possível carregar os agendamentos.</Alert>}

          {visualizacao === 'dia' ? (
            <Box>
              {agendamentosDoDiaSelecionado.length > 0 ? (
                agendamentosDoDiaSelecionado.map(agendamento => (
                  <CardAgendamento key={agendamento.id} agendamento={agendamento} onEdit={() => handleOpenModal(agendamento, selectedDay)} />
                ))
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Nenhum agendamento para este dia
                  </Typography>
                </Paper>
              )}
            </Box>
          ) : (
            <VisaoSemana 
            semanaAtual={semanaAtual}
            // agendamentosDaSemana={agendamentosDaSemana}
            slotsDaSemana={slotsProcessados}
            isMobile={isMobile}
            handleOpenModal={handleOpenModal}
          />
          )}
          
        </Box>
      </Container>
      <AddEditModal
        isOpen={openModal}
        toggle={() => setOpenModal(false)}
        onSave={handleSaveSlot}
        initialData={currentSlot}
        day={format(selectedDay, 'yyyy-MM-dd')}
      />
    </AuthGuard>
  )
}