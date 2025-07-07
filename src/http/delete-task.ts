import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";



export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
        id: z.string().cuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    try {
        await prisma.task.delete({
            where: { id: id },
        });

        return reply.status(204).send();
        
        
    } catch (error) {
        console.error("Erro ao deletar a tarefa:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}