import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
// import dbConnect from '../../../lib/dbConnect'; // Ajuste o caminho se necessário
import User from '../../../models/User'; // Ajuste o caminho se necessário
import dbConnect from '@/lib/mongoose';
// import { sendPasswordResetEmail } from '../../../lib/email'; // Descomente quando tiver um serviço de e-mail

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  await dbConnect();

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'O e-mail é obrigatório.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Resposta genérica para evitar enumeração de usuários
      return res.status(200).json({ success: true, message: 'Se um usuário com este e-mail existir, um link de redefinição de senha foi enviado.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // Expira em 1 hora

    await user.save();

    // --- Lógica para Enviar E-mail ---
    //nodemailer instalado
    // O SendGrid tem um plano gratuito generoso e é muito usado.
    
    // Aqui você integraria um serviço como Nodemailer para enviar o e-mail.
    // O link no e-mail conteria o `resetToken` (não o hash).
    // Ex: const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(user.email, resetUrl);

    // Por enquanto, apenas retornamos sucesso. Em um ambiente real, o envio do e-mail é crucial.
    console.log(`Password reset token for ${user.email}: ${resetToken}`); // Log para desenvolvimento

    return res.status(200).json({ success: true, message: 'Se um usuário com este e-mail existir, um link de redefinição de senha foi enviado.' });

  } catch (error) {
    console.error('FORGOT_PASSWORD_ERROR:', error);
    // Limpar token em caso de erro no envio de email, por exemplo
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;
    // await user.save();
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
}

