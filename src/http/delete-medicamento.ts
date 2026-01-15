import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function excluirMedicamento(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        medicamentoId: z.string().cuid().or(z.string().min(1)),
    });

    try {
        const { medicamentoId } = paramsSchema.parse(request.params);

        const med = await prisma.medicamentoAgendado.findUnique({
            where: { id: medicamentoId },
            include: {
                paciente: true
            }
        });

        if (!med) {
            return reply.status(404).send({ message: "Medicamento não encontrado." });
        }

        if (med.paciente.cuidadorId !== request.user.id) {
            return reply.status(403).send({ message: "Você não tem permissão para excluir este medicamento." });
        }

        // Exclui horários primeiro (ou use onDelete cascade no schema)
        await prisma.horarioMedicamento.deleteMany({
            where: { medicamentoId }
        });

        await prisma.medicamentoAgendado.delete({
            where: { id: medicamentoId }
        });

        return reply.status(204).send();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Erro de validação.",
                issues: error.format()
            });
        }

        console.error("Erro ao excluir medicamento:", error);
        return reply.status(500).send({ message: "Erro interno no servidor." });
    }
}
