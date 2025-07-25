// ARQUIVO: delete-relatorio.ts (VERSÃO FINAL E SEGURA)

import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function deleteRelatorio(request: FastifyRequest, reply: FastifyReply) {
    // Verifica se o usuário está autenticado
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        id: z.string(), // Validação corrigida para aceitar qualquer string
    });

    try {
        const { id: relatorioId } = paramsSchema.parse(request.params);
        const cuidadorId = request.user.id;

        // Verifica se o relatório a ser deletado realmente pertence a um paciente deste cuidador
        const relatorio = await prisma.relatorio.findFirst({
            where: {
                id: relatorioId,
                paciente: {
                    cuidadorId: cuidadorId,
                },
            },
        });

        // Se a busca não retornar nada, significa que ou o relatório não existe, ou o usuário não tem permissão
        if (!relatorio) {
            return reply.status(403).send({ message: "Acesso negado. O relatório não existe ou não pertence a um de seus pacientes." });
        }

        // Se a verificação passou, aí sim deletamos
        await prisma.relatorio.delete({
            where: {
                id: relatorio.id,
            },
        });

        return reply.status(204).send();

    } catch (error) {
        // Log do erro completo no servidor para depuração
        console.error("ERRO COMPLETO AO DELETAR RELATÓRIO:", error);

        // Retorna um erro genérico para o cliente
        return reply.status(500).send({ message: "Erro interno ao processar a exclusão do relatório." });
    }
}