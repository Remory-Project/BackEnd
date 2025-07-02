
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export async function createTask(request: FastifyRequest, reply: FastifyReply) {
    const createTaskBodySchema = z.object({
        title: z.string(),
        description: z.string().optional(),
        done: z.boolean()
    });

    const { title, description, done } = createTaskBodySchema.parse(request.body)

    const task = await prisma.task.create({
        data: {
            title,
            description,
            done
        }
    });

    return reply.status(201).send({
        message: "Tarefa criada com sucesso",
        task
    });
};