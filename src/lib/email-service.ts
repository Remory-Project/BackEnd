import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarCodigoPorEmail(email: string, codigo: string) {
    console.log('Enviando para:', email, 'com código:', codigo); 

    try {
        const response = await resend.emails.send({
            from: 'Remory <no-reply@resend.dev>',
            to: email,
            subject: 'Recuperação de senha',
            html: `
        <p>Você solicitou a recuperação de senha.</p>
        <p>Seu código é: <strong style="font-size: 18px;">${codigo}</strong></p>
        <p>Esse código é válido por 15 minutos.</p>
    `,
        });

        console.log('Resposta do Resend:', response);

    } catch (err) {
        console.error('Erro ao enviar email:', err);
    }
}
