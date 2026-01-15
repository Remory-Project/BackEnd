import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function verifyResetCode(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        email: z.string().email(),
        code: z.string().length(6),
    });

    const { email, code } = bodySchema.parse(request.body);

    const cuidador = await prisma.cuidador.findUnique({ where: { email } });
    if (!cuidador) {
        return reply.status(400).send({ message: 'Código inválido ou expirado.' });
    }

    const reset = await prisma.passwordReset.findFirst({
        where: {
            cuidadorId: cuidador.id,
            code,
            usedAt: null,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
    });

    if (!reset) {
        return reply.status(400).send({ message: 'Código inválido ou expirado.' });
    }

    return reply.status(200).send({ valid: true });
}
