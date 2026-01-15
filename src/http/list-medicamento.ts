import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function listarMedicamentosPorPaciente(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        pacienteId: z.string().cuid().or(z.string().min(1)),
    });

    try {
        const { pacienteId } = paramsSchema.parse(request.params);

        const paciente = await prisma.paciente.findUnique({
            where: { id: pacienteId },
            select: { cuidadorId: true }
        });

        if (!paciente) {
            return reply.status(404).send({ message: "Paciente não encontrado." });
        }

        if (paciente.cuidadorId !== request.user.id) {
            return reply.status(403).send({ message: "Você não tem permissão para ver estes medicamentos." });
        }

        const meds = await prisma.medicamentoAgendado.findMany({
            where: { pacienteId },
            include: { horarios: true },
            orderBy: { createdAt: 'desc' }
        });

        return reply.status(200).send(meds);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Erro de validação.",
                issues: error.format()
            });
        }

        console.error("Erro ao listar medicamentos:", error);
        return reply.status(500).send({ message: "Erro interno no servidor." });
    }
}
