import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IBloqueio extends Document {
  _id: string;
  profissional: mongoose.Types.ObjectId | string;
  data: Date;
  horaInicio: string; // "07:00"
  horaFim: string; // "20:00"
  motivo: string;
}

const BloqueioSchema: Schema = new Schema({
  profissional: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  data: {
    type: Date,
    required: true,
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
  motivo: {
    type: String,
    required: true,
  },
});

export default models.Bloqueio || model<IBloqueio>('Bloqueio', BloqueioSchema);
