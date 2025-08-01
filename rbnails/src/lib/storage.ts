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

export const exportToJson = (schedule: WeekSchedule, filename: string = 'agenda-backup.json'): void => {
    const dataStr = JSON.stringify(schedule);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const importFromJson = async (file: File): Promise<WeekSchedule> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const result = e.target?.result as string;
                resolve(JSON.parse(result));
            } catch (error) {
                reject(new Error('Arquivo inválido'));
            }
        };

        reader.onerror = () => reject(new Error('Erro na leitura'));
        reader.readAsText(file);
    })
}