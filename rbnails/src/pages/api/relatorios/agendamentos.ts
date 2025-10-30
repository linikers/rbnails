import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import mongoose from 'mongoose';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }

  await dbConnect();

  try {
    const { startDate, endDate, profissionalId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'As datas de início e fim são obrigatórias.' });
    }

    // 1. Construir o estágio $match do pipeline de agregação
    const matchStage: any = {
      dataHora: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    };

    if (profissionalId && typeof profissionalId === 'string') {
      matchStage.profissional = new mongoose.Types.ObjectId(profissionalId);
    }

    // 2. Executar a agregação no banco de dados
    const reportData = await Agendamento.aggregate([
      { $match: matchStage },
      { $sort: { dataHora: 1 } },
      // "Enriquecer" os documentos com dados de outras coleções
      {
        $lookup: {
          from: 'users', // O nome da coleção de usuários no MongoDB
          localField: 'profissional',
          foreignField: '_id',
          as: 'profissionalInfo',
        },
      },
      { $unwind: '$profissionalInfo' }, // Desconstrói o array do lookup
      {
        $lookup: {
          from: 'clientes',
          localField: 'cliente',
          foreignField: '_id',
          as: 'clienteInfo',
        },
      },
      { $unwind: '$clienteInfo' },
      {
        $lookup: {
          from: 'servicos',
          localField: 'servico',
          foreignField: '_id',
          as: 'servicoInfo',
        },
      },
      { $unwind: '$servicoInfo' },

      // 3. Agrupar os resultados para criar o resumo e a lista
      {
        $group: {
          _id: null, // Agrupar todos os documentos em um só
          totalAgendamentos: { $sum: 1 },
          faturamentoBruto: { $sum: '$valorServico' },
          faturamentoConcluido: { $sum: { $cond: [{ $eq: ['$status', 'concluído'] }, '$valorServico', 0] } },
          agendamentos: { $push: '$$ROOT' }, // Adiciona o documento inteiro a uma lista
        },
      },
    ]);

    res.status(200).json({ success: true, data: reportData[0] || { totalAgendamentos: 0, faturamentoBruto: 0, faturamentoConcluido: 0, agendamentos: [] } });
  } catch (error: any) {
    console.error("API_RELATORIOS_AGENDAMENTOS_ERROR:", error);
    res.status(500).json({ success: false, message: 'Erro interno ao gerar o relatório.', error: error.message });
  }
}

