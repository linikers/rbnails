import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Servico from '@/models/Servico';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const servicos = await Servico.find({}).sort({ nome: 1 });
        res.status(200).json({ success: true, data: servicos });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao buscar serviços.' });
      }
      break;

    case 'POST':
      try {
        const servico = await Servico.create(req.body);
        res.status(201).json({ success: true, data: servico });
      } catch (error: any) {
        res.status(400).json({ success: false, message: error.message, errors: error.errors });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${req.method} não permitido`);
      break;
  }
}

