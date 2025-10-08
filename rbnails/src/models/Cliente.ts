import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICliente extends Document {
  nome: string;
  telefone: string;
  email?: string;
  dataCadastro: Date;
}

const ClienteSchema: Schema = new Schema({
  nome: {
    type: String,
    required: [true, 'O nome do cliente é obrigatório.'],
    trim: true,
  },
  telefone: {
    type: String,
    required: [true, 'O telefone do cliente é obrigatório.'],
    unique: true, // Garante que não haja dois clientes com o mesmo telefone
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, use um email válido.'],
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

// Evita a recriação do modelo em hot-reloads do Next.js
export default models.Cliente || model<ICliente>('Cliente', ClienteSchema);
