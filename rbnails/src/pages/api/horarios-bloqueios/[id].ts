import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Bloqueio from '@/models/Bloqueio';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
        method,
    } = req;

    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'ID de bloqueio inválido.' });
    }

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const bloqueio = await Bloqueio.findById(id);
                if (!bloqueio) {
                    return res.status(404).json({ success: false, message: 'Bloqueio não encontrado.' });
                }
                res.status(200).json({ success: true, data: bloqueio });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Erro ao buscar bloqueio.' });
            }
            break;

        case 'PUT':
            try {
                const bloqueio = await Bloqueio.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!bloqueio) {
                    return res.status(404).json({ success: false, message: 'Bloqueio não encontrado.' });
                }
                res.status(200).json({ success: true, data: bloqueio });
            } catch (error: any) {
                res.status(400).json({ success: false, message: error.message, errors: error.errors });
            }
            break;

        case 'DELETE':
            try {
                const deletedBloqueio = await Bloqueio.deleteOne({ _id: id });
                if (!deletedBloqueio.deletedCount) {
                    return res.status(404).json({ success: false, message: 'Bloqueio não encontrado.' });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false, message: 'Erro ao deletar bloqueio.' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${req.method} não permitido`);
            break;
    }
}