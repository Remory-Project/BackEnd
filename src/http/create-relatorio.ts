import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function criarRelatorio(request: FastifyRequest, reply: FastifyReply) {
    const createRelatorioBodySchema = z.object({
        pacienteId: z.string(),
        dataVisita: z.string(),
        horaVisita: z.string(),
        tipoVisita: z.string(),
        descricaoVisita: z.string(),
        observacoesVisita: z.string().optional(),
        medicamentos: z.string(),
        localizacaoDor: z.string().optional(),
        horarioMeds: z.string().optional(),
        pressaoArterial: z.string().optional(),
        temperatura: z.string().optional(),
        peso: z.string().optional(),
    });

    try {
        const {
            pacienteId,
            dataVisita,
            horaVisita,
            tipoVisita,
            descricaoVisita,
            observacoesVisita,
            medicamentos,
            localizacaoDor,
            horarioMeds,
            pressaoArterial,
            temperatura,
            peso,
        } = createRelatorioBodySchema.parse(request.body);

        await prisma.relatorio.create({
            data: {
                dataVisita,
                horaVisita,
                tipoVisita,
                descricaoVisita,
                observacoesVisita,
                medicamentos,
                localizacaoDor,
                horarioMeds,
                pressaoArterial,
                temperatura,
                peso,
                paciente: {
                    connect: {
                        id: pacienteId,
                    },
                },
            },
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
