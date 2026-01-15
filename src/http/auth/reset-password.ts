import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
        email: z.string().email(),
        code: z.string().length(6),
        newPassword: z.string().min(5),
        confirmPassword: z.string().min(5),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });

    const { email, code, newPassword } = bodySchema.parse(request.body);

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

    const password_hash = newPassword;

    await prisma.$transaction([
        prisma.cuidador.update({
            where: { id: cuidador.id },
            data: { password_hash },
        }),
        prisma.passwordReset.update({
            where: { id: reset.id },
            data: { usedAt: new Date() },
        }),
    ]);

    return reply.status(200).send({ message: 'Senha redefinida com sucesso.' });
}
