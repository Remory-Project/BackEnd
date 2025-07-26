import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function deleteRelatorio(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        id: z.string(),
    });

    try {
        const { id: relatorioId } = paramsSchema.parse(request.params);
        const cuidadorId = request.user.id;

        const relatorio = await prisma.relatorio.findFirst({
            where: {
                id: relatorioId,
                paciente: {
                    cuidadorId: cuidadorId,
                },
            },
        });

        if (!relatorio) {
            return reply.status(403).send({ message: "Acesso negado. O relatório não existe ou não pertence a um de seus pacientes." });
        }

        await prisma.relatorio.delete({
            where: {
                id: relatorio.id,
            },
        });

        return reply.status(204).send();

    } catch (error) {
        console.error("ERRO COMPLETO AO DELETAR RELATÓRIO:", error);

        return reply.status(500).send({ message: "Erro interno ao processar a exclusão do relatório." });
    }
}