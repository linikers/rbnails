import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Agendamento from '@/models/Agendamento';
import Bloqueio from '@/models/Bloqueio';
import HorarioDisponivel from '@/models/HorarioDisponivel';
import { startOfDay, endOfDay, parseISO, getDay, addMinutes, format } from 'date-fns';

// Função para gerar slots de tempo (ex: de 09:00 às 18:00, de 60 em 60 minutos)
const gerarSlotsDeTempo = (inicio: string, fim: string, intervalo: number): string[] => {
  const slots: string[] = [];
  // Usamos uma data base fixa apenas para os cálculos de hora, ignorando o dia.
  // O 'Z' no final garante que o parse seja feito em UTC, evitando problemas de fuso.
  const dataBase = '1970-01-01';
  let atual = parseISO(`${dataBase}T${inicio}:00.000Z`);
  const dataFim = parseISO(`${dataBase}T${fim}:00.000Z`);

  while (atual < dataFim) {
    slots.push(format(atual, 'HH:mm'));
    atual = addMinutes(atual, intervalo);
  }
  return slots;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }

  const { date, profissionalId } = req.query;

  if (!date || typeof date !== 'string' || !profissionalId || typeof profissionalId !== 'string') {
    return res.status(400).json({ success: false, message: 'Parâmetros "date" e "profissionalId" são obrigatórios.' });
  }

  try {
    await dbConnect();

    const targetDate = parseISO(date);
    const inicioDoDia = startOfDay(targetDate);
    const fimDoDia = endOfDay(targetDate);
    const diaDaSemana = getDay(targetDate); // 0 = Domingo, 1 = Segunda, ...

    //1. Buscar o horário de funcionamento do profissional para o dia da semana
    const horarioFuncionamento = await HorarioDisponivel.findOne<{ horaInicio: string; horaFim: string }>({
        profissional: profissionalId,
        diaSemana: diaDaSemana
    }).lean();

    if (!horarioFuncionamento) {
      // Se não há horário cadastrado para este dia, retorna um array vazio.
      return res.status(200).json({ success: true, data: [] });
    }

    // 2. Gerar todos os slots de tempo possíveis para o dia (a cada 60 min)
    const todosOsSlots = gerarSlotsDeTempo(horarioFuncionamento.horaInicio, horarioFuncionamento.horaFim, 60);

    // 3. Buscar agendamentos e bloqueios existentes para o dia
    const [agendamentosDoDia, bloqueiosDoDia] = await Promise.all([
        Agendamento.find<{ dataHora: Date }>({
          profissional: profissionalId,
          dataHora: { $gte: inicioDoDia, $lte: fimDoDia },
          status: { $ne: 'cancelado' }
      }).select('dataHora').lean(),
        Bloqueio.find<{ horaInicio: string; horaFim: string }>({
          profissional: profissionalId,
          data: { $gte: inicioDoDia, $lte: fimDoDia },
        }).lean()
    ]);
    
    // 4. Mapear todos os horários ocupados
    const horariosAgendados = agendamentosDoDia.map((ag) => format(ag.dataHora, 'HH:mm'));

    const horariosBloqueados = new Set<string>();
    bloqueiosDoDia.forEach((bloqueio) => { // Usando 'any' aqui para evitar problemas com o tipo de 'lean()'
        const slotsBloqueados = gerarSlotsDeTempo(bloqueio.horaInicio, bloqueio.horaFim, 60);
        slotsBloqueados.forEach(slot => horariosBloqueados.add(slot));
    });

    const horariosOcupados = new Set([...horariosAgendados, ...Array.from(horariosBloqueados)]);

    // 5. Filtrar os slots de funcionamento, retornando apenas os que não estão ocupados
    const horariosDisponiveis = todosOsSlots.filter(horario => !horariosOcupados.has(horario));

    res.status(200).json({ success: true, data: horariosDisponiveis });
  } catch (error: any) {
    console.error("API_HORARIOS_ERROR:", error);
    res.status(500).json({ success: false, message: 'Erro interno ao buscar horários disponíveis.' });
  }
}
