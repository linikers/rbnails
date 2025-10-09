import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import { startOfMonth, endOfMonth } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Método ${req.method} não permitido`);
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ success: false, message: 'O ID do usuário é obrigatório.' });
    }

    await dbConnect();

    try {
        const targetDate = new Date();
        const startDate = startOfMonth(targetDate);
        const endDate = endOfMonth(targetDate);

        const agendamentos = await Agendamento.find({
            profissional: userId,
            dataHora: { $gte: startDate, $lte: endDate }
        }).populate('cliente');

        const agendamentosConcluidos = agendamentos.filter(a => a.status === 'concluído');
        
        const faturamento = agendamentosConcluidos.reduce((sum, a) => sum + a.valorServico, 0);
        
        const clientesUnicos = new Set(agendamentos.map(a => a.cliente._id.toString())).size;

        const stats = {
            qtdAtendimentos: agendamentos.length,
            qtdConcluidos: agendamentosConcluidos.length,
            clientesUnicos: clientesUnicos,
            faturamento: faturamento,
        };

        res.status(200).json({ success: true, data: stats });

    } catch (error: any) {
        console.error("API_DASHBOARD_STATS_ERROR:", error);
        res.status(500).json({ success: false, message: 'Erro interno ao buscar estatísticas do dashboard.' });
    }
}
