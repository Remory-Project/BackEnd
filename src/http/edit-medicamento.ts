import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { verifyJWT } from './middlewares/verify-jwt';

const prisma = new PrismaClient();

export async function editMedicamento(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        id: z.string().cuid(),
    });

    const bodySchema = z.object({
        nome: z.string(),
        descricao: z.string().optional(),
        horarios: z.array(
        z.object({
            hora: z.number().int().min(0).max(23),
            minuto: z.number().int().min(0).max(59),
        })
        ),
    });

    try {
        const { id } = paramsSchema.parse(request.params);
        const { nome, descricao, horarios } = bodySchema.parse(request.body);

        await prisma.medicamentoAgendado.update({
        where: { id },
        data: {
            nome,
            descricao,
            horarios: {
            deleteMany: {}, 
            create: horarios,
            },
        },
        });

        return reply.send({ message: 'Medicamento atualizado com sucesso!' });
    } catch (err) {
        console.error(err);
        return reply.status(500).send({ message: 'Erro ao atualizar medicamento.' });
    }
}
