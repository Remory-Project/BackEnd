import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
    // Validação do ID via parâmetros
    const paramsSchema = z.object({
        id: z.string().cuid(),
    });

    try {
        const { id } = paramsSchema.parse(request.params);

        // Tenta deletar a tarefa
        await prisma.task.delete({
            where: { id },
        });

        return reply.status(204).send(); // No Content

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "ID inválido.",
                issues: error.format(),
            });
        }

        // Erro de tentativa de deletar um ID inexistente, por exemplo
        // if (error.code === "P2025") {
        //     return reply.status(404).send({ message: "Tarefa não encontrada." });
        // }

        console.error("Erro ao deletar a tarefa:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
