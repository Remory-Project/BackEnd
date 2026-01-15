import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function listRelatorios(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        id: z.string(),
    });

    try {
        const { id: pacienteId } = paramsSchema.parse(request.params);
        const cuidadorId = request.user.id;

        const paciente = await prisma.paciente.findFirst({
            where: {
                id: pacienteId,
                cuidadorId,
            },
        });

        if (!paciente) {
            return reply.status(403).send({ message: "Acesso negado ao paciente." });
        }

        const relatorios = await prisma.relatorio.findMany({
            where: {
                pacienteId,
            },
            orderBy: {
                dataVisita: "desc",
            },
            select: {
                id: true,
                dataVisita: true,
                horaVisita: true,
                tipoVisita: true,
                descricaoVisita: true,
                observacoesVisita: true,
                localizacaoDor: true,
                pressaoArterial: true,
                temperatura: true,
                peso: true,
            },
        });

        return reply.status(200).send(relatorios);
    } catch (error) {
        console.error("Erro ao listar relatórios:", error);
        return reply.status(500).send({ message: "Erro ao buscar relatórios." });
    }
}
