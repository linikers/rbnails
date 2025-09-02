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

export const saveAgendamentos = () => {

}

export const addAgendamento = () => {

}

export const updateAgendamento = () => {

}

export const getAgendamentoByUser = (userId: string) => {
    const agendamentos = '';
}

export const calcularTotalConfirmado = (userId: string) => {
    const agendamentos = getAgendamentoByUser(userId);
}