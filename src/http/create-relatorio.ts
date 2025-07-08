import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function criarRelatorio(request: FastifyRequest, reply: FastifyReply) {
    const createRelatorioBodySchema = z.object({
        titulo: z.string(),
        descricao: z.string(),
        medicamentos: z.string(),
        dosagem: z.string(),
        horarioMedicacao: z.string()
    });

    try {
        const {
            titulo,
            descricao,
            medicamentos,
            dosagem,
            horarioMedicacao
        } = createRelatorioBodySchema.parse(request.body);

        await prisma.relatorio.create({
            data: {
                titulo,
                descricao,
                medicamentos,
                dosagem,
                horarioMedicacao
            }
        });

        return reply.status(201).send({ message: "Relatório criado com sucesso." });

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
