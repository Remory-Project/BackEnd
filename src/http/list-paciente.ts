import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function listPaciente(request: FastifyRequest, reply: FastifyReply) {
    
    await verifyJWT(request, reply);

    try {
        const cuidadorId = request.user.id;

        const pacientes = await prisma.paciente.findMany({
            where: {
                cuidadorId: cuidadorId,
            },
        });

        return reply.status(200).send(pacientes);

    } catch (error) {
        console.error("Erro ao listar pacientes:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
