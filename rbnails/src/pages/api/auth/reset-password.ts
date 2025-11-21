import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import bcrypt from 'bcryptjs'; // Use a mesma biblioteca de hash de senha do seu login

// import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
    }

    try {
        // 1. Hashear o token recebido para encontrar no DB
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 2. Encontrar o usuário pelo token e verificar a data de expiração
        /*
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken,
                passwordResetExpires: {
                    gt: new Date(), // gt = greater than (maior que a data/hora atual)
                },
            },
        });
        */
       // Lógica de mock para encontrar o usuário
       const user = { id: '123', passwordResetToken, passwordResetExpires: new Date(Date.now() + 5 * 60 * 1000) };

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        // 3. Hashear a nova senha
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. Atualizar a senha e limpar os campos de redefinição
        /*
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
        */
       console.log("Senha do usuário atualizada no DB.");

        return res.status(200).json({ message: 'Senha redefinida com sucesso! Você será redirecionado para o login.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno.' });
    }
}
