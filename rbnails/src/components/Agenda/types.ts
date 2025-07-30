export interface TimeSlot {
    id: string;
    time: string;
    title: string;
    description?: string;
    color?: string;
  }
  
  export interface DaySchedule {
    day: string;
    date: string;
    slots: TimeSlot[];
  }
  
  export interface WeekSchedule {
    weekNumber: number;
    days: DaySchedule[];
  }