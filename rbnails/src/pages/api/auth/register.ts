import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }

  await dbConnect();

  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const newUser = new User({ name, username, email, password });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Usuário criado com sucesso!' });
  } catch (error: any) {
    if (error.code === 11000) { // Código de erro para duplicidade (unique)
      return res.status(409).json({ message: 'Usuário ou email já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
  }
}
