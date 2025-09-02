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

export const getAgendamentoByUser = () => {
    
}

export const calcularTotalConfirmado = () => {
    const agendamentos = getAgendamentoByUser();
}