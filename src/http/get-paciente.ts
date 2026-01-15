import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function getPaciente(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        id: z.string().cuid(),
    });

    try {
        const { id } = paramsSchema.parse(request.params);

        const paciente = await prisma.paciente.findUnique({
            where: { id },
            include: {
                relatorios: true,
            },
        });

        if (!paciente) {
            return reply.status(404).send({ message: "Paciente não encontrado." });
        }

        if (paciente.cuidadorId !== request.user.id) {
            return reply.status(403).send({ message: "Acesso negado: esse paciente não pertence a você." });
        }

        return reply.status(200).send(paciente);
    } catch (error) {
        console.error("Erro ao buscar paciente:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
