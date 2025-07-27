import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function criarMedicamentoAgendado(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        pacienteId: z.string().cuid()
    });

    const bodySchema = z.object({
        nome: z.string().min(1),
        descricao: z.string().optional(),
        horarios: z.array(z.string().regex(/^\d{2}:\d{2}$/)).min(1) // ["08:00","14:30"]
    });

    try {
        const { pacienteId } = paramsSchema.parse(request.params);
        const { nome, descricao, horarios } = bodySchema.parse(request.body);

        const paciente = await prisma.paciente.findUnique({
            where: { id: pacienteId }
        });

        if (!paciente) {
            return reply.status(404).send({ message: "Paciente não encontrado." });
        }

        if (paciente.cuidadorId !== request.user.id) {
            return reply.status(403).send({ message: "Você não tem permissão para alterar este paciente." });
        }

        const med = await prisma.medicamentoAgendado.create({
            data: {
                nome,
                descricao: descricao ?? null,
                pacienteId
            }
        });

        const horariosData = horarios.map((h) => {
            const [hora, minuto] = h.split(":").map(Number);
            return {
                hora,
                minuto,
                medicamentoId: med.id
            };
        });

        await prisma.horarioMedicamento.createMany({
            data: horariosData
        });

        const created = await prisma.medicamentoAgendado.findUnique({
            where: { id: med.id },
            include: { horarios: true }
        });

        return reply.status(201).send(created);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Erro de validação.",
                issues: error.format()
            });
        }

        console.error("Erro ao criar medicamento:", error);
        return reply.status(500).send({ message: "Erro interno no servidor." });
    }
}
