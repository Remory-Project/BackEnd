import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { enviarCodigoPorEmail } from '../../lib/email-service';

const prisma = new PrismaClient();

function generate6DigitCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestPasswordReset(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        email: z.string().email(),
    });

    const { email } = bodySchema.parse(request.body);

    const cuidador = await prisma.cuidador.findUnique({ where: { email } });

    if (!cuidador) {
        return reply.status(200).send({
            message: 'Se este e-mail existir, um código foi enviado.',
        });
    }

    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const reset = await prisma.passwordReset.create({
        data: {
            code,
            expiresAt,
            cuidadorId: cuidador.id,
        },
    });

    await enviarCodigoPorEmail(email, code);
    
    return reply.status(200).send({
        message: 'Se este e-mail existir, um código foi enviado.',
        resetId: reset.id,
    });
}
