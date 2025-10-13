import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID de agendamento inválido.' });
  }

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const agendamento = await Agendamento.findById(id)
          .populate('cliente', 'nome')
          .populate('servico', 'nome preco')
          .populate('profissional', 'name');
        if (!agendamento) {
          return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
        }
        res.status(200).json({ success: true, data: agendamento.toObject() });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao buscar agendamento.' });
      }
      break;

    case 'PUT':
      try {
        const agendamento = await Agendamento.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!agendamento) {
          return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
        }
        res.status(200).json({ success: true, data: agendamento.toObject() });
      } catch (error: any) {
        res.status(400).json({ success: false, message: error.message, errors: error.errors });
      }
      break;

    case 'DELETE':
      try {
        const deletedAgendamento = await Agendamento.deleteOne({ _id: id });
        if (!deletedAgendamento.deletedCount) {
          return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao deletar agendamento.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
      break;
  }
}