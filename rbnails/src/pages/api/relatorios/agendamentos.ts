import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import mongoose from 'mongoose';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from 'date-fns';

// Imports "sem uso" são mantidos propositalmente.
// Em ambientes serverless (como a Vercel), o Mongoose pode não registrar os schemas
// em todas as invocações, causando um 'MissingSchemaError'.
// Importar os modelos aqui garante que eles sejam registrados.
import Servico from '@/models/Servico';
import Cliente from '@/models/Cliente';
import User from '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    await dbConnect();

    const { 
      periodo,
      dataInicio, // Para período personalizado
      dataFim,    // Para período personalizado
      profissionalId,
      servicoId, 
      status, 
      pagina = 1, 
      limite = 10,
    } = req.query;

    // 1. Construir o filtro de data
    let filtroData: any = {};
    const hoje = new Date();

    if (periodo === 'personalizado' && dataInicio && dataFim) {
        filtroData = { dataHora: { $gte: startOfDay(parseISO(dataInicio as string)), $lte: endOfDay(parseISO(dataFim as string)) } };
    } else if (periodo === 'hoje') {
        filtroData = { dataHora: { $gte: startOfDay(hoje), $lte: endOfDay(hoje) } };
    } else if (periodo === 'semana') {
        filtroData = { dataHora: { $gte: startOfWeek(hoje, { weekStartsOn: 1 }), $lte: endOfWeek(hoje, { weekStartsOn: 1 }) } };
    } else if (periodo === 'mes') {
        filtroData = { dataHora: { $gte: startOfMonth(hoje), $lte: endOfMonth(hoje) } };
    }

    // 2. Construir o filtro principal para a consulta no MongoDB
    const filtroQuery: any = { ...filtroData };
    if (profissionalId && profissionalId !== 'todos' && mongoose.isValidObjectId(profissionalId as string)) {
        filtroQuery.profissional = new mongoose.Types.ObjectId(profissionalId as string);
    }
    if (servicoId && servicoId !== 'todos' && mongoose.isValidObjectId(servicoId as string)) {
        filtroQuery.servico = new mongoose.Types.ObjectId(servicoId as string);
    }
    if (status && (status as string).length > 0) {
        filtroQuery.status = { $in: (status as string).split(',') };
    }

    // 3. Executar agregação para ESTATÍSTICAS e DADOS DE GRÁFICOS
    const agregacaoResultados = await Agendamento.aggregate([
      { $match: filtroQuery },
      {
          $lookup: {
              from: 'servicos',
              localField: 'servico',
              foreignField: '_id',
              as: 'servicoInfo'
          }
      },
      { $unwind: { path: '$servicoInfo', preserveNullAndEmptyArrays: true } },
      {
          $facet: {
              // Pipeline para os cards de resumo
              stats: [
                  {
                      $group: {
                          _id: null,
                          totalAgendamentos: { $sum: 1 },
                          agendamentosConcluidos: { $sum: { $cond: [{ $eq: ['$status', 'Concluído'] }, 1, 0] } },
                          cancelamentos: { $sum: { $cond: [{ $eq: ['$status', 'Cancelado'] }, 1, 0] } },
                          faturamentoTotal: { $sum: { $cond: [{ $eq: ['$status', 'Concluído'] }, '$servicoInfo.preco', 0] } },
                          tempoTotal: { $sum: { $cond: [{ $eq: ['$status', 'Concluído'] }, '$servicoInfo.duracaoEstimada', 0] } },
                      }
                  }
              ],
              // Pipeline para o gráfico de evolução
              evolucao: [
                  { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$dataHora" } }, count: { $sum: 1 } } },
                  { $sort: { _id: 1 } },
                  { $project: { name: '$_id', value: '$count', _id: 0 } }
              ],
              // Pipeline para o gráfico de pizza por status
              porStatus: [
                  { $group: { _id: '$status', count: { $sum: 1 } } },
                  { $project: { name: '$_id', value: '$count', _id: 0 } }
              ],
              // Pipeline para o gráfico de top profissionais
              topProfissionais: [
                  { $match: { profissional: { $ne: null } } },
                  { $group: { _id: '$profissional', count: { $sum: 1 } } },
                  { $sort: { count: -1 } },
                  { $limit: 5 },
                  {
                      $lookup: {
                          from: 'users',
                          localField: '_id',
                          foreignField: '_id',
                          as: 'profissionalInfo'
                      }
                  },
                  { $unwind: '$profissionalInfo' },
                  { $project: { name: '$profissionalInfo.name', value: '$count', _id: 0 } }
              ]
          }
      }
    ]);

    // 4. Buscar a lista de DETALHES (paginada)
    const paginaNum = parseInt(pagina as string);
    const limiteNum = parseInt(limite as string);
    const skip = (paginaNum - 1) * limiteNum;
    const detalhes = await Agendamento.find(filtroQuery, {}, { lean: true })
        .populate('cliente', 'nome')
        .populate('profissional', 'name')
        .populate('servico', 'nome preco')
        .sort({ dataHora: -1 })
        .skip(skip)
        .limit(limiteNum);

    // 5. Contar o total de documentos para a paginação
    const totalDocumentos = await Agendamento.countDocuments(filtroQuery);

    // 6. Formatar a resposta final
    const statsResult = agregacaoResultados[0]?.stats[0] || {};
    const tempoMedio = (statsResult.agendamentosConcluidos > 0) 
        ? (statsResult.tempoTotal / statsResult.agendamentosConcluidos) 
        : 0;

    res.status(200).json({
      stats: {
          totalAgendamentos: statsResult.totalAgendamentos || 0,
          agendamentosConcluidos: statsResult.agendamentosConcluidos || 0,
          cancelamentos: statsResult.cancelamentos || 0,
          faturamentoTotal: statsResult.faturamentoTotal || 0,
          tempoMedio: Math.round(tempoMedio),
      },
      graficos: {
          evolucao: agregacaoResultados[0]?.evolucao || [],
          porStatus: agregacaoResultados[0]?.porStatus || [],
          topProfissionais: agregacaoResultados[0]?.topProfissionais || [],
      },
      detalhes,
      paginacao: {
          total: totalDocumentos,
          pagina: paginaNum,
          limite: limiteNum,
          paginas: Math.ceil(totalDocumentos / limiteNum)
      }
    });

  } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({ message: 'Erro interno do servidor ao gerar relatório.', error: error.message });
  }
}