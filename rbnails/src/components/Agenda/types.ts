export interface TimeSlot {
    id: string; // Mapeado do _id do MongoDB
    dataHora: string; // Formato ISO string
    cliente: { _id: string; nome: string; };
    servico: { _id:string; nome: string; preco: number };
    profissional: { _id: string; name: string; };
    status: 'agendado' | 'confirmado' | 'cancelado' | 'concluído' | 'bloqueado' | 'livre';
    valorServico: number;
    observacoes?: string;
    // Adicionamos uma referência ao objeto original para facilitar a edição
    _original: any;
  }
  
  export interface DaySchedule {
    day: string;
    date: string;
    slots: TimeSlot[];
  }
  
  export interface WeekSchedule {
    weekNumber?: number;
    days: DaySchedule[];
  }