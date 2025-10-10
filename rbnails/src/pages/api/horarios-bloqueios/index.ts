import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Bloqueio from '@/models/Bloqueio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            try {
                const { profissionalId, data } = req.query;
                let query: any = {};

                if (profissionalId && typeof profissionalId === 'string') {
                    query.profissional = profissionalId;
                }

                if (data && typeof data === 'string') {
                    query.data = data; // Assumindo que 'data' é uma string em formato de data ISO
                }

                const bloqueios = await Bloqueio.find(query).sort({ data: 1, horaInicio: 1 });
                res.status(200).json({ success: true, data: bloqueios });
            } catch (error: any) {
                console.error("API_BLOQUEIOS_GET_ERROR:", error);
                res.status(500).json({ success: false, message: 'Erro ao buscar bloqueios.' });
            }
            break;

        case 'POST':
            try {
                const bloqueio = await Bloqueio.create(req.body);
                res.status(201).json({ success: true, data: bloqueio });
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