import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
// import Agendamento, { IAgendamento } from '@/models/Agendamento';
// import Cliente from '@/models/Cliente'; // Importe outros modelos se precisar
// import Servico from '@/models/Servico';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

//   switch (req.method) {
//     case 'GET':
//       try {
//         // .populate() é a mágica do Mongoose para trazer dados relacionados!
//         const agendamentos = await Agendamento.find({})
//           .populate('cliente', 'nome telefone') // Traz apenas nome e telefone do cliente
//           .populate('servico', 'nome preco');   // Traz nome e preço do serviço
        
//         res.status(200).json({ success: true, data: agendamentos });
//       } catch (error) {
//         res.status(400).json({ success: false, message: 'Erro ao buscar agendamentos.' });
//       }
//       break;

//     case 'POST':
//       try {
//         // A validação do Mongoose (e do Yup, via middleware) será executada aqui!
//         const agendamento = await Agendamento.create(req.body);
//         res.status(201).json({ success: true, data: agendamento });
//       } catch (error: any) {
//         // Retorna os erros de validação de forma clara para o frontend
//         res.status(400).json({ success: false, message: error.message, errors: error.errors });
//       }
//       break;

//     default:
//       res.setHeader('Allow', ['GET', 'POST']);
//       res.status(405).end(`Método ${req.method} não permitido`);
//       break;
//   }
switch (req.method) {
    case 'GET':
    try {
      const { startDate, endDate } = req.query;
      let query = {};
      if (startDate && endDate 
        && typeof startDate === 'string' 
        && typeof endDate === 'string') {
            query = {
            data: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            };
      }

      const agendamentos = await Agendamento.find(query)
      .sort({ dataHora: 1 })
      .populate('cliente', 'nome telefone')
      .populate('servico', 'nome preco')
      .populate('profissional', 'nome')

      res.status(200).json({ success: true, data: agendamentos });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao buscar agendamentos.' })
    }
    break;
    
    case 'POST':
        try {
          // A validação do Mongoose (e do Yup, via middleware) será executada aqui!
          const agendamento = await Agendamento.create(req.body);
          res.status(201).json({ success: true, data: agendamento });
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
