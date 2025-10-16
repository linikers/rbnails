import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import Servico from '@/models/Servico'; // deixa essa merda aqui
import Cliente from '@/models/Cliente'; //não excluir esses import sem uso
import User from '@/models/User'; //manteha esses imports 


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
console.log(req.body);
switch (req.method) {
    case 'GET':
    try {

      const { startDate, endDate, profissionalId } = req.query;
      let query: any = {};
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
      const agendamentos = await Agendamento.find(query)
      .sort({ dataHora: 1 })
      .populate('cliente', 'nome telefone')
      .populate('servico', 'nome preco')
      .populate('profissional', 'name')
      .lean(); // Otimização: Retorna POJOs para melhor performance em listas


      console.log(agendamentos);
      res.status(200).json({ success: true, data: agendamentos });
    } catch (error: any) {
      console.error("API_AGENDAMENTOS_GET_ERROR:", error);
      res.status(500).json({ success: false, message: 'Erro interno ao buscar agendamentos.' })
  }
    break;
    
    case 'POST':
        try {
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
