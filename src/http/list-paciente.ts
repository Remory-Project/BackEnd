import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

const prisma = new PrismaClient();

export async function listPaciente(request: FastifyRequest, reply: FastifyReply) {
    try {
        const tasks = await prisma.paciente.findMany();

        console.log("Tarefas encontradas no banco:");
        console.table(tasks);

        return reply.status(200).send(tasks);

    } catch (error) {
        console.error("Erro ao listar tarefas:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
