// src/services/email-service.ts
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

type LembreteInput = {
    email: string;
    pacienteNome: string;
    medicamentoNome: string;
    hora: number;
    minuto: number;
};

export async function enviarLembreteMedicamento({
    email,
    pacienteNome,
    medicamentoNome,
    hora,
    minuto,
}: LembreteInput) {
    try {
        const hh = String(hora).padStart(2, '0');
        const mm = String(minuto).padStart(2, '0');

        await resend.emails.send({
            from: 'Remory <no-reply@resend.dev>',
            to: email,
            subject: `Hora do medicamento: ${medicamentoNome} (${hh}:${mm})`,
            html: `
                <p>Olá, este é um aviso relacionado ao ${pacienteNome},</p>
                <p>Este é um lembrete para tomar o medicamento <strong>${medicamentoNome}</strong> às <strong>${hh}:${mm}</strong>.</p>
                <p>Se você já tomou, desconsidere este e-mail.</p>
                <hr/>
                <small>Enviado automaticamente pelo Remory.</small>
            `,
        });
    } catch (err) {
        console.error('Erro ao enviar lembrete de medicamento:', err);
    }
}
