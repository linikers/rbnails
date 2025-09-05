// import { uuid } from "uuidv4";
import { v4 as uuidv4 } from 'uuid';

export interface Agendamento {
    id: string;
    userId: string;
    data: string;
    hora: string;
    descricao: string;
    valor: number;
    confirmado: boolean;
}

const STORAGE_KEY = 'userAgendamento';

export const loadAgendamentos = (): Agendamento[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ?JSON.parse(data) : [];
};

export const saveAgendamentos = (agendamentos: Agendamento[]) => {

    if (typeof window ==='undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
};

export const addAgendamento = (newHorario: Omit<Agendamento, 'id'>): Agendamento => {
    const agendamentos = loadAgendamentos();
    const agendamentoComId = { ...newHorario, id: uuidv4() };
    agendamentos.push(agendamentoComId);
    saveAgendamentos(agendamentos);
    return agendamentoComId;
};

export const updateAgendamento = (updatedAgendamento: Agendamento) => {
    const agendamentos = loadAgendamentos();

    const index = agendamentos.findIndex(a => a.id === updatedAgendamento.id)
    if (index > -1) {
        agendamentos[index] = updatedAgendamento;
        saveAgendamentos(agendamentos);
        return updatedAgendamento;
    }
    
    return undefined;
};

export const getAgendamentosByUserId = (userId: string) => {
    const agendamentos = loadAgendamentos();
    return agendamentos.filter(a => a.userId ===userId);
};

export const calcularTotalConfirmado = (userId: string) => {
    const agendamentos = getAgendamentosByUserId(userId);

    return agendamentos
        .filter(a => a.confirmado)
        .reduce((sum: number, a: Agendamento) => sum + a.valor, 0);
};

export const getAgendamentosConfirmados = (): Agendamento[] => {
    const agendamentos = loadAgendamentos();

    return agendamentos.filter(a => a.confirmado);
};

export const getAllAgendamentosGroupByUser = ():Record<string, Agendamento[]> => {
    
    const allAgendamentos = loadAgendamentos();
    
    const grouped: Record<string, Agendamento[]> = {};

    allAgendamentos.forEach(ag => {
        if (!grouped[ag.userId]) {
            grouped[ag.userId] = [];
        }
        grouped[ag.userId].push(ag);
    });
    return grouped;
};

export const getUniqueConfirmedClientsCount = () => {
    const confirmedAgendamentos = loadAgendamentos().filter(a => a.confirmado);
    const uniqueUserIds = new Set(confirmedAgendamentos.map(ag => ag.userId));
    return uniqueUserIds.size;
}