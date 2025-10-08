import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IServico extends Document {
  nome: string;
  preco: number;
  duracaoEstimada: number; // em minutos
}

const ServicoSchema: Schema = new Schema({
  nome: {
    type: String,
    required: [true, 'O nome do serviço é obrigatório.'],
    trim: true,
  },
  preco: {
    type: Number,
    required: [true, 'O preço do serviço é obrigatório.'],
    min: [0, 'O preço não pode ser negativo.'],
  },
  duracaoEstimada: {
    type: Number,
    required: [true, 'A duração é obrigatória.'],
    min: [0, 'A duração não pode ser negativa.'],
  },
});

export default models.Servico || model<IServico>('Servico', ServicoSchema);
