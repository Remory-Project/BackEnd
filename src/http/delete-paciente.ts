import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function deletePaciente(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply); // Protege a rota com token JWT

    const paramsSchema = z.object({
        id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    try {
        const paciente = await prisma.paciente.findUnique({
            where: { id },
        });

        if (!paciente) {
            return reply.status(404).send({ message: "Paciente não encontrado." });
        }

        // Verifica se o paciente pertence ao cuidador logado
        if (paciente.cuidadorId !== request.user.id) {
            return reply.status(403).send({ message: "Acesso negado: paciente não pertence a você." });
        }

        await prisma.paciente.delete({
            where: { id },
        });

        return reply.status(200).send({ message: "Paciente deletado com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar paciente:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
