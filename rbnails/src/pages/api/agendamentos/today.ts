import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import Servico from '@/models/Servico'; //aqui nao pode apagar os imports
import Cliente from '@/models/Cliente'; // aqui tbm não 
import { startOfDay, endOfDay } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Methodo ${req.method} Não permitido`);
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ success: false, message: 'id profissional obrigatorio.' });
    }

    
    try {
        await dbConnect();
        
        const hoje = new Date();
        const inicioDoDia = startOfDay(hoje);
        const fimDoDia = endOfDay(hoje);

        const agendamentos = await Agendamento.find({
            profissional: userId,
            dataHora: {
                $gte: inicioDoDia,
                $lte: fimDoDia,
            },
        })
        .sort({ dataHora: 'asc' })
        .populate('cliente', 'nome telefone')
        .populate('servico', 'nome preco')
        .lean();

        // Convertemos para objetos puros para garantir que os campos virtuais sejam incluídos.
        // const data = agendamentos.map(ag => ag.toObject());

        res.status(200).json({ success: true, data: agendamentos });

    } catch (error: any) {
        console.error("API_TODAY_AGENDAMENTOS_ERROR:", error);
        res.status(500).json({ success: false, message: 'erro ao buscar agendamentos de hoje.' });
    }
}
