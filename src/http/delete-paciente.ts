import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function deletePaciente(request: FastifyRequest, reply: FastifyReply) {

    const paramsSchema = z.object({
        id: z.string().cuid(),
    });

    try {
        const { id } = paramsSchema.parse(request.params);

        await prisma.paciente.delete({
            where: { id },
        });

        return reply.status(204).send();

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "ID inválido.",
                issues: error.format(),
            });
        }

        console.error("Erro ao deletar a tarefa:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
