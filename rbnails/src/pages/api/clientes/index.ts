import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Cliente from '@/models/Cliente';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const clientes = await Cliente.find({}).sort({ nome: 1 });
        res.status(200).json({ success: true, data: clientes });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao buscar clientes.' });
      }
      break;

    case 'POST':
      try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json({ success: true, data: cliente });
      } catch (error: any) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Já existe um cliente com este telefone.' });
        }
        res.status(400).json({ success: false, message: error.message, errors: error.errors });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${req.method} não permitido`);
      break;
  }
}
