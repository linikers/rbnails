import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Horario from '@/models/HorarioDisponivel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            try {
                const { profissionalId } = req.query;
                let query = {};

                if (profissionalId && typeof profissionalId === 'string') {
                    query = { profissional: profissionalId };
                }

                const horarios = await Horario.find(query).sort({ diaSemana: 1, horaInicio: 1 });
                res.status(200).json({ success: true, data: horarios });
            } catch (error: any) {
                console.error("API_HORARIOS_DISPONIVEIS_GET_ERROR:", error);
                res.status(500).json({ success: false, message: 'Erro ao buscar horários disponíveis.' });
            }
            break;

        case 'POST':
            try {
                const horario = await Horario.create(req.body);
                res.status(201).json({ success: true, data: horario });
            } catch (error: any) {
                res.status(400).json({ success: false, message: error.message, errors: error.errors });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Método ${req.method} não permitido`);
            break;
    }
}