import mongoose, { Schema, Document, models, model } from 'mongoose';
// import * as yup from 'yup';
import * as yup from 'yup';

export interface IAgendamento extends Document {
  cliente: mongoose.Types.ObjectId;
  servico: mongoose.Types.ObjectId;
  profissional: mongoose.Types.ObjectId;
  dataHora: Date;
  valorServico: number;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluído';
  valorPago?: number;
  metodoPagamento?: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix';
  observacoes?: string;
  taxaValor?: number;
  valorLiquido?: number;
}

const AgendamentoSchema: Schema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente', // Referência ao modelo Cliente
    required: true,
  },
  servico: {
    type: Schema.Types.ObjectId,
    ref: 'Servico', // Referência ao modelo Servico
    required: true,
  },
  profissional: {
    type: Schema.Types.ObjectId,
    // ref: 'Profissional', // Referência ao modelo User
    ref: 'User', //conferir e tratar
    required: true,
  },
  dataHora: {
    type: Date,
    required: true,
  },
  valorServico: {
    type: Number,
    required: [true, 'O valor do serviço no momento do agendamento é obrigatório.'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['agendado', 'confirmado', 'cancelado', 'concluído'],
    default: 'agendado',
  },
  valorPago: {
    type: Number,
    min: 0,
    default: 0,
  },
  metodoPagamento: {
    type: String,
    enum: ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix', null],
  },
  observacoes: {
    type: String,
    trim: true,
  },
});

// Exemplo de como integrar YUP para validações mais complexas
const agendamentoYupSchema = yup.object({
    // Ex: garantir que um agendamento não seja marcado no passado
    dataHora: yup.date()
        .min(new Date(), 'Não é possível agendar um horário no passado.')
        .required(),
    // Ex: garantir que se o status for 'concluído', o valor pago deve ser maior que zero
    status: yup.string().required(),
    valorPago: yup.number().when('status', {
        is: 'concluído',
        then: (schema: yup.NumberSchema) => schema.min(0.01, 'Agendamentos concluídos devem ter um valor pago.'),
        otherwise: (schema: yup.NumberSchema) => schema.optional(),
    }),
});

// Middleware do Mongoose: executa antes de salvar
AgendamentoSchema.pre('validate', async function (next) {
  try {
    // 'this' é o documento que está sendo salvo
    await agendamentoYupSchema.validate(this, { abortEarly: false });
    next();
  } catch (error: any) {
    // Se a validação do Yup falhar, passa o erro para o Mongoose
    if (error instanceof yup.ValidationError) {
        const mongooseError = new mongoose.Error.ValidationError();
        error.inner.forEach((error: any) => {
            if (error.path) {
                mongooseError.errors[error.path] = new mongoose.Error.ValidatorError({
                    path: error.path,
                    message: error.message,
                    type: error.type || 'validation',
                    value: error.value
                });
            }
        });
        next(mongooseError);
    } else {
        next(error as Error);
    }
  }
});

// --- Lógica de Taxas e Valores Finais ---

// Define a taxa como uma constante para fácil manutenção
const TAXA_CARTAO_PERCENTUAL = 0.05; // 5%

// Virtual para calcular o valor da taxa do cartão (o "desconto" que a operadora pega)
AgendamentoSchema.virtual('taxaValor').get(function(this: IAgendamento) {
  if (this.metodoPagamento === 'cartao_credito' && this.status === 'concluído' && this.valorPago && this.valorPago > 0) {
    // A taxa é calculada sobre o valor que foi efetivamente pago
    return this.valorPago * TAXA_CARTAO_PERCENTUAL;
  }
  return 0;
});

// Virtual para calcular o valor líquido que a esmalteria recebe
AgendamentoSchema.virtual('valorLiquido').get(function(this: IAgendamento) {
  if (this.status === 'concluído' && this.valorPago && this.valorPago > 0) {
    // Acessa o campo virtual 'taxaValor' para o cálculo
    return this.valorPago - (this as any).taxaValor;
  }
  // Se não foi pago ou não é concluído, o valor líquido é o valor pago (provavelmente 0)
  return this.valorPago || 0;
});

// Garante que os campos virtuais sejam incluídos nas saídas JSON da API
AgendamentoSchema.set('toJSON', { virtuals: true });
AgendamentoSchema.set('toObject', { virtuals: true });

export default models.Agendamento || model<IAgendamento>('Agendamento', AgendamentoSchema);
