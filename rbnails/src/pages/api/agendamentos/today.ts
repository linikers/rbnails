import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import { startOfToday, endOfToday } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    await dbConnect();

    try {
        const startOfDay = startOfToday();
        const endOfDay = endOfToday();

        const agendamentos = await Agendamento.find({
            profissional: userId,
            dataHora: { $gte: startOfDay, $lte: endOfDay }
        })
        .sort({ dataHora: 1 })
        .populate('cliente', 'nome')
        .populate('servico', 'nome');

        res.status(200).json({ success: true, data: agendamentos });

    } catch (error: any) {
        console.error("API_TODAY_AGENDAMENTOS_ERROR:", error);
        res.status(500).json({ success: false, message: 'Internal server error while fetching today\'s appointments.' });
    }
}
