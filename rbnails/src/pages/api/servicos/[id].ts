import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Servico from '@/models/Servico';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID de serviço inválido.' });
  }

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const servico = await Servico.findById(id);
        if (!servico) {
          return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
        }
        res.status(200).json({ success: true, data: servico });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao buscar serviço.' });
      }
      break;

    case 'PUT':
      try {
        const servico = await Servico.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!servico) {
          return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
        }
        res.status(200).json({ success: true, data: servico });
      } catch (error: any) {
        res.status(400).json({ success: false, message: error.message, errors: error.errors });
      }
      break;

    case 'DELETE':
      try {
        const deletedServico = await Servico.deleteOne({ _id: id });
        if (!deletedServico.deletedCount) {
          return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao deletar serviço.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
      break;
  }
}

