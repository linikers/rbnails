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
}

export const saveAgendamentos = (agendamentos: Agendamento[]) => {

    if (typeof window ==='undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
}

export const addAgendamento = (newHorario: Omit<Agendamento, 'id'>): Agendamento => {
    const agendamentos = loadAgendamentos();
    const agendamentoComId = { ...newHorario, id: uuidv4() };
    agendamentos.push(agendamentoComId);
    saveAgendamentos(agendamentos);
    return agendamentoComId;
}

export const updateAgendamento = (updatedAgendamento: Agendamento) => {
    const agendamentos = loadAgendamentos();

    const index = agendamentos.findIndex(a => a.id === updatedAgendamento.id)

}

export const getAgendamentoByUser = (userId: string) => {
    const agendamentos = loadAgendamentos();
    return agendamentos.filter(a => a.userId ===userId);
}

export const calcularTotalConfirmado = (userId: string) => {
    const agendamentos = getAgendamentoByUser(userId);

    return agendamentos
        .filter(a => a.confirmado)
        .reduce((sum: number, a: Agendamento) => sum + a.valor, 0);
}