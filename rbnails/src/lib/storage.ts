import { WeekSchedule } from "@/components/Agenda/types";

export const loadSchedule = (): WeekSchedule | null => {
    if ( typeof window !== 'undefined') {
        const saved = localStorage.getItem('agendaSchedule');
        return saved ? JSON.parse(saved) : null;
    }
    return null;
};

export const saveSchedule = (schedule: WeekSchedule): void => {
    if ( typeof window !== 'undefined') {
        localStorage.setItem('agendaSchedule', JSON.stringify(schedule));
    }
};

export const exportToJson = () => {

}

export const importFromJson = () => {
    
}