import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

const createTaskSchema = z.object({
    title: z.string({ required_error: "Título é obrigatório." }),
    description: z.string().optional(),
    done: z.boolean().optional(),
});

export async function createTask(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { title, description, done } = createTaskSchema.parse(request.body);

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                done,
            },
        });

        return reply.status(201).send({
            message: "Tarefa criada com sucesso.",
            task: newTask,
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Erro de validação nos dados enviados.",
                issues: error.format(),
            });
        }

        console.error("Erro ao criar a tarefa:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
