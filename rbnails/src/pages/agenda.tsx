import AddEditModal from "@/components/Agenda/modalAddEdit";
import { DaySchedule, TimeSlot, WeekSchedule } from "@/components/Agenda/types";
import WeekView from "@/components/Agenda/viewSemana";
import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
import { useEffect, useMemo, useState } from "react";
import { Container } from "reactstrap";
import useSWR from 'swr';
import { startOfWeek, endOfWeek, format, parseISO, eachDayOfInterval, getWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Transforma os dados da API na estrutura que a View da Semana espera
function processAgendamentos(apiData: any, weekStart: Date): WeekSchedule {
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 0 }) })
        .map(date => ({
            day: format(date, 'EEEE', { locale: ptBR }),
            date: format(date, 'dd/MM/yyyy'),
            slots: [] as TimeSlot[]
        }));

    if (!apiData || !apiData.data) {
        return { days: weekDays };
    }

    const agendamentos: any[] = apiData.data;

    agendamentos.forEach(ag => {
        const agDateStr = format(parseISO(ag.dataHora), 'dd/MM/yyyy');
        const daySchedule = weekDays.find(d => d.date === agDateStr);
        if (daySchedule) {
            // Mapeia o agendamento do backend para o TimeSlot do frontend
            daySchedule.slots.push({
                id: ag._id,
                dataHora: ag.dataHora,
                cliente: ag.cliente,
                servico: ag.servico,
                profissional: ag.profissional,
                status: ag.status,
                valorServico: ag.valorServico,
                observacoes: ag.observacoes,
                _original: ag, // Guarda o objeto original
            });
        }
    });

    // Ordena os agendamentos dentro de cada dia
    weekDays.forEach(day => {
        day.slots.sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    });

    return { days: weekDays };
}

export default function Agenda ()  {

    //func auxiliares
    // function getCurrentWeekNumber(): number {
    //     const now = new Date();
    //     const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    //     const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    //     return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    // };

    // function generateWeekDays(): DaySchedule[] {
    //     const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    //     const today = new Date();
    //     const currentDay = today.getDay();
        
    //     return days.map((dayName, index) => {
    //       const date = new Date(today);
    //       date.setDate(today.getDate() + (index - currentDay));
          
    //       return {
    //         day: dayName,
    //         date: date.toLocaleDateString(),
    //         slots: []
    //       };
    //     });
    // }

    // const [currentWeek, setCurrentWeek] = useState({
    //     weekNumber: getCurrentWeekNumber(),
    //     days: generateWeekDays()
    // });
    // const [openModal, setOpenModal] = useState(false);
    // const [currentDay, setCurrentDay] = useState<string>('');
    // const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);

    // useEffect(() => {
    //     const savedSchedule = localStorage.getItem('agendaSchedule');
    //     if (savedSchedule) {
    //       setCurrentWeek(JSON.parse(savedSchedule));
    //     }
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem('agendaSchedule', JSON.stringify(currentWeek));
    // }, [currentWeek]);

    // const handleAddSlot = (day: string) => {
    //     setCurrentDay(day);
    //     setCurrentSlot(null);
    //     setOpenModal(true);
    // };

    // const handleEditSlot = (day: string, slotId: string) => {
    //     const daySchedule = currentWeek.days.find(d => d.day === day);
    //     const slot = daySchedule?.slots.find(s => s.id === slotId);

    //     if (slot) {
    //         setCurrentDay(day);
    //         setCurrentSlot(slot);
    //         setOpenModal(true);
    //     }
    // };

    // const handleDeleteSlot = (day: string, slotId: string) => {
    //     setCurrentWeek(prev => ({
    //       ...prev,
    //       days: prev.days.map(d => {
    //         if (d.day === day) {
    //           return {
    //             ...d,
    //             slots: d.slots.filter(s => s.id !== slotId)
    //           };
    //         }
    //         return d;
    //       })
    //     }));
    //   };
    
    // const handlSaveSlot = (slot: TimeSlot) => {
    //     setCurrentWeek(prev => {
    //         const dayIndex = prev.days.findIndex(d => d.day === currentDay);
    //         if (dayIndex === -1) return prev;
      
    //         const day = prev.days[dayIndex];
    //         const slotIndex = day.slots.findIndex(s => s.id === slot.id);
      
    //         const newSlots = slotIndex === -1 
    //           ? [...day.slots, slot] 
    //           : day.slots.map(s => s.id === slot.id ? slot : s);
      
    //         const newDays = [...prev.days];
    //         newDays[dayIndex] = {
    //           ...day,
    //           slots: newSlots
    //         };
      
    //         return {
    //           ...prev,
    //           days: newDays
    //         };
    //       });
    // }
    // Função para buscar dados com SWR
    const [currentDate, setCurrentDate] = useState(new Date());
    const [openModal, setOpenModal] = useState(false);
    const [currentDay, setCurrentDay] = useState<string>(''); // Formato 'yyyy-MM-dd'
    const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

    const apiUrl = `/api/agendamentos?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`;
    const { data: apiResponse, error, isLoading, mutate } = useSWR(apiUrl, fetcher);

    const weekSchedule = useMemo(() => processAgendamentos(apiResponse, weekStart), [apiResponse, weekStart]);
    const weekNumber = useMemo(() => getWeek(currentDate), [currentDate]);

    const handleAddSlot = (dayDate: string) => { // dayDate está no formato 'dd/MM/yyyy'
        const [day, month, year] = dayDate.split('/');
        setCurrentDay(`${year}-${month}-${day}`);
        setCurrentSlot(null);
        setOpenModal(true);
    };

    const handleEditSlot = (slot: TimeSlot) => {
        if (slot) {
            const [day, month, year] = format(parseISO(slot.dataHora), 'dd/MM/yyyy').split('/');
            setCurrentDay(`${year}-${month}-${day}`);
            setCurrentSlot(slot);
            setOpenModal(true);
        }
    };

    const handleDeleteSlot = async (slotId: string) => {
        if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

        // Atualização otimista da UI para uma resposta mais rápida
        mutate((currentData: any) => ({
            ...currentData,
            data: currentData.data.filter((s: any) => s._id !== slotId)
        }), false);

        try {
            await fetch(`/api/agendamentos/${slotId}`, { method: 'DELETE' });
            mutate(); // Revalida os dados com o servidor
        } catch (e) {
            console.error("Erro ao deletar agendamento", e);
            mutate(); // Reverte a atualização otimista em caso de erro
        }
      };
    
    const handleSaveSlot = async (slotDataFromModal: any) => {
        // ATENÇÃO: O modal precisa ser atualizado para buscar e enviar os IDs de cliente, serviço e profissional.
        // Por enquanto, usaremos valores fixos como placeholder.
        const payload = {
            ...slotDataFromModal,
            // TODO: Substituir por IDs dinâmicos vindos de <select> no modal
            cliente: '6521d8a7a3e5e3a3b3e3a3e3', // ID de Cliente placeholder
            servico: '6521d8bba3e5e3a3b3e3a3e5', // ID de Serviço placeholder
            profissional: '6521d8cfa3e5e3a3b3e3a3e7', // ID de Profissional placeholder
            dataHora: new Date(`${currentDay}T${slotDataFromModal.hora}`).toISOString(),
            valorServico: slotDataFromModal.valor,
        };
        
        const isEditing = currentSlot && currentSlot.id;
        const url = isEditing ? `/api/agendamentos/${currentSlot.id}` : '/api/agendamentos';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Falha ao salvar agendamento');
            }
            
            mutate(); // Revalida os dados para mostrar a atualização
            setOpenModal(false); // Fecha o modal em caso de sucesso
        } catch (e) {
            console.error(e);
            alert('Ocorreu um erro ao salvar. Verifique o console.');
        }
    }

    if (error) return <div>Falha ao carregar a agenda.</div>
    if (isLoading) return <div>Carregando agenda...</div>

    return (
        <Container className="agendaContainer">
            <header>
                <Logo />
                <NavBar />
            </header>
        <h1 className="text-center my-4 title__orange">Agenda - RB nails</h1>
        
        <WeekView
          weekSchedule={{...weekSchedule, weekNumber}}
          onAddSlot={handleAddSlot}
          onEditSlot={(_day, slotId) => {
            const slot = weekSchedule.days.flatMap(d => d.slots).find(s => s.id === slotId);
            if (slot) handleEditSlot(slot);
          }}
          onDeleteSlot={(_day, slotId) => handleDeleteSlot(slotId)}
        />
        
        <AddEditModal
          isOpen={openModal}
          toggle={() => setOpenModal(false)}
          onSave={handleSaveSlot}
          initialData={currentSlot}
          day={currentDay}
        />
      </Container>
    )
}
