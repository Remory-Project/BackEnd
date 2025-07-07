import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function updateTask(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
        id: z.string().cuid()
    });

    const bodySchema = z.object({
        title: z.string().optional(),
        decription: z.string().optional(),
        done: z.boolean().optional(),
    });
    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    try {
        const updatedTask = await prisma.task.update({
            where: { id: id },
            data: data,
        });
        
        return reply.status(200).send(updateTask);
    } catch (error) {
        console.error("erro ao atualizar a tarefa:", error);
        return reply.status(500).send({message: "erro interno do servidor"});
    }
}