export interface TimeSlot {
    // id: string;
    // time: string;
    // title: string;
    // user: string;
    // description?: string;
    // color?: string;
    id: string; // Mapeado do _id do MongoDB
    dataHora: string; // Formato ISO string
    cliente: { _id: string; nome: string; };
    servico: { _id:string; nome: string; preco: number };
    profissional: { _id: string; nome: string; };
    status: 'agendado' | 'confirmado' | 'cancelado' | 'concluído';
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