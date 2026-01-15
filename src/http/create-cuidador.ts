import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

const createTaskSchema = z.object({
    nome: z.string({ required_error: "Título é obrigatório." }),
    email: z.string(),
    password_hash: z.string(),
});

export async function createCuidador(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { nome, email, password_hash } = createTaskSchema.parse(request.body);

        const novoCuidador = await prisma.cuidador.create({
            data: {
                nome,
                email,
                password_hash,
            },
        });

        return reply.status(201).send({
            message: "criado com sucesso.",
            task: novoCuidador,
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Erro de validação nos dados enviados.",
                issues: error.format(),
            });
        }

        console.error("Erro ao criar", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
