import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IHorario extends Document {
  _id: string;
  profissional: mongoose.Types.ObjectId;
  diaSemana: number; // 0 (Domingo) a 6 (Sábado)
  horaInicio: string; // "07:00"
  horaFim: string; // "20:00"
}

const HorarioSchema: Schema = new Schema({
  profissional: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  diaSemana: {
    type: Number,
    required: true,
    min: 0,
    max: 6,
  },
  horaInicio: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // Valida formato HH:MM
  },
  horaFim: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // Valida formato HH:MM
  },
});

export default models.HorarioDisponivel || model<IHorario>('HorarioDisponivel', HorarioSchema);
