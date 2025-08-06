import AddEditModal from "@/components/Agenda/modalAddEdit";
import { DaySchedule, TimeSlot } from "@/components/Agenda/types";
import WeekView from "@/components/Agenda/viewSemana";
import Logo from "@/components/logo";
import NavBar from "@/components/navbar";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";

export default function Agenda ()  {

    //func auxiliares
    function getCurrentWeekNumber(): number {
        const now = new Date();
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    function generateWeekDays(): DaySchedule[] {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const today = new Date();
        const currentDay = today.getDay();
        
        return days.map((dayName, index) => {
          const date = new Date(today);
          date.setDate(today.getDate() + (index - currentDay));
          
          return {
            day: dayName,
            date: date.toLocaleDateString(),
            slots: []
          };
        });
    }

    const [currentWeek, setCurrentWeek] = useState({
        weekNumber: getCurrentWeekNumber(),
        days: generateWeekDays()
    });
    const [openModal, setOpenModal] = useState(false);
    const [currentDay, setCurrentDay] = useState<string>('');
    const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);

    useEffect(() => {
        const savedSchedule = localStorage.getItem('agendaSchedule');
        if (savedSchedule) {
          setCurrentWeek(JSON.parse(savedSchedule));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('agendaSchedule', JSON.stringify(currentWeek));
    }, [currentWeek]);

    const handleAddSlot = (day: string) => {
        setCurrentDay(day);
        setCurrentSlot(null);
        setOpenModal(true);
    };

    const handleEditSlot = (day: string, slotId: string) => {
        const daySchedule = currentWeek.days.find(d => d.day === day);
        const slot = daySchedule?.slots.find(s => s.id === slotId);

        if (slot) {
            setCurrentDay(day);
            setCurrentSlot(slot);
            setOpenModal(true);
        }
    };

    const handleDeleteSlot = (day: string, slotId: string) => {
        setCurrentWeek(prev => ({
          ...prev,
          days: prev.days.map(d => {
            if (d.day === day) {
              return {
                ...d,
                slots: d.slots.filter(s => s.id !== slotId)
              };
            }
            return d;
          })
        }));
      };
    
    const handlSaveSlot = (slot: TimeSlot) => {
        setCurrentWeek(prev => {
            const dayIndex = prev.days.findIndex(d => d.day === currentDay);
            if (dayIndex === -1) return prev;
      
            const day = prev.days[dayIndex];
            const slotIndex = day.slots.findIndex(s => s.id === slot.id);
      
            const newSlots = slotIndex === -1 
              ? [...day.slots, slot] 
              : day.slots.map(s => s.id === slot.id ? slot : s);
      
            const newDays = [...prev.days];
            newDays[dayIndex] = {
              ...day,
              slots: newSlots
            };
      
            return {
              ...prev,
              days: newDays
            };
          });
    }

    return (
        <Container className="agendaContainer">
            <header>
                <Logo />
                <NavBar />
            </header>
        <h1 className="text-center my-4 title__orange">Agenda - RB nails</h1>
        
        <WeekView
          weekSchedule={currentWeek}
          onAddSlot={handleAddSlot}
          onEditSlot={handleEditSlot}
          onDeleteSlot={handleDeleteSlot}
        />
        
        <AddEditModal
          isOpen={openModal}
          toggle={() => setOpenModal(false)}
          onSave={handlSaveSlot}
          initialData={currentSlot}
          day={currentDay}
        />
      </Container>
    )
}
