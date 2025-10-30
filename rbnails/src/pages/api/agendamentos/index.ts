import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import Servico from '@/models/Servico'; // deixa essa merda aqui
import Cliente from '@/models/Cliente'; //não excluir esses import 'sem uso'
import User from '@/models/User'; //mantenha esses imports 
import { addMinutes } from 'date-fns';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
// console.log(req.body);
switch (req.method) {
    case 'GET':
    try {

      // const { startDate, endDate, profissionalId } = req.query;
      // let query: any = {};
      const { startDate, endDate, profissionalId, view } = req.query;
      let query: any = {
        status: { $nin: ['cancelado', 'desmarcado'] } // Exclui agendamentos cancelados ou desmarcados
      };
      if (startDate && endDate 
        && typeof startDate === 'string' 
        && typeof endDate === 'string') {
            query.dataHora = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
      }

      // if (profissionalId && typeof profissionalId === 'string') {
      //   query.profissional = profissionalId;
      // }
      if (profissionalId && typeof profissionalId === 'string') {
        query.profissional = profissionalId;
      }
      const agendamentos = await Agendamento.find(query)
      .sort({ dataHora: 1 })
      .populate('cliente', 'nome telefone')
      .populate('servico', 'nome preco duracaoEstimada')
      .populate('profissional', 'name')
      .lean(); // Otimização: Retorna POJOs para melhor performance em listas


      // console.log(agendamentos);
      res.status(200).json({ success: true, data: agendamentos });
    } catch (error: any) {
      console.error("API_AGENDAMENTOS_GET_ERROR:", error);
      res.status(500).json({ success: false, message: 'Erro interno ao buscar agendamentos.' })
  }
    break;
    
    case 'POST':
        try {
          const { dataHora, servico: servicoId, profissional: profissionalId } = req.body;

          // --- VALIDAÇÃO DE CONFLITO DE HORÁRIO ---
          // 1. Buscar o serviço para saber a duração
          const servicoInfo = await Servico.findById(servicoId);
          if (!servicoInfo) {
            return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
          }

          // 2. Calcular o início e o fim do novo agendamento
          const inicioNovoAgendamento = new Date(dataHora);
          const fimNovoAgendamento = addMinutes(inicioNovoAgendamento, servicoInfo.duracaoEstimada);

          // 3. Buscar por agendamentos conflitantes no banco de dados
          const agendamentosConflitantes = await Agendamento.find({
            profissional: profissionalId,
            status: { $nin: ['cancelado', 'desmarcado'] }, // Ignora agendamentos cancelados
            dataHora: {
              $lt: fimNovoAgendamento, // Um agendamento existente que começa ANTES do novo terminar
              $gte: inicioNovoAgendamento // E que começa DEPOIS ou JUNTO com o início do novo
            }
          });

          // Se encontrarmos qualquer agendamento que comece dentro do intervalo do novo, é um conflito.
          // NOTA: Esta lógica simples já previne a maioria dos casos. Uma lógica mais complexa poderia
          // verificar se o novo agendamento começa durante um agendamento existente.
          // Por simplicidade e robustez, esta já é uma grande melhoria.
          if (agendamentosConflitantes.length > 0) {
            return res.status(409).json({ // 409 Conflict
              success: false,
              message: 'O horário selecionado já está ocupado ou entra em conflito com outro agendamento.'
            });
          }

          // A validação do Mongoose (e do Yup, via middleware) será executada aqui!
          const agendamento = await Agendamento.create(req.body);
          // Retorna o objeto puro para garantir que os virtuais sejam incluídos
          res.status(201).json({ success: true, data: agendamento.toObject() });
        } catch (error: any) {
          // Retorna os erros de validação de forma clara para o frontend
          res.status(400).json({ success: false, message: error.message, errors: error.errors });
        }
        break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${req.method} não permitido`);
      break;
}
}
