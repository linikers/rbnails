import { IAgendamento } from "@/models/Agendamento";
import { ICliente } from "@/models/Cliente";
import { IServico } from "@/models/Servico";
import { IUser } from "@/models/User";

// Estende a interface do Mongoose com os campos populados
export interface TimeSlot extends Partial<IAgendamento<Partial<ICliente>, Partial<IServico>, Partial<IUser>>> {
  _id?: string;
  cliente?: Partial<ICliente>;
  servico?: Partial<IServico>;
  profissional?: Partial<IUser>;
  valorServico?: number;
  dataHora: string | Date;
  status: IAgendamento['status'];
}