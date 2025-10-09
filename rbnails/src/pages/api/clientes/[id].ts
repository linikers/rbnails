import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Cliente from '@/models/Cliente';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID de cliente inválido.' });
  }

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const cliente = await Cliente.findById(id);
        if (!cliente) {
          return res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
        }
        res.status(200).json({ success: true, data: cliente });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao buscar cliente.' });
      }
      break;

    case 'PUT':
      try {
        const cliente = await Cliente.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!cliente) {
          return res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
        }
        res.status(200).json({ success: true, data: cliente });
      } catch (error: any) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Já existe um cliente com este telefone.' });
        }
        res.status(400).json({ success: false, message: error.message, errors: error.errors });
      }
      break;

    case 'DELETE':
      try {
        const deletedCliente = await Cliente.deleteOne({ _id: id });
        if (!deletedCliente.deletedCount) {
          return res.status(404).json({ success: false, message: 'Cliente não encontrado.' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao deletar cliente.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
      break;
  }
}
