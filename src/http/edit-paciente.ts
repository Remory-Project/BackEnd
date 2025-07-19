import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function editPaciente(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const paramsSchema = z.object({
        id: z.string().cuid(), 
    });

    const bodySchema = z.object({
        nome: z.string().min(1),
        dataDeNascimento: z.string().min(1),
        sexo: z.string().min(1),
        telefone: z.string().min(1),
    });

    const { id } = paramsSchema.parse(request.params);
    const { nome, dataDeNascimento, sexo, telefone } = bodySchema.parse(request.body);

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

        const pacienteAtualizado = await prisma.paciente.update({
            where: { id },
            data: {
                nome,
                dataDeNascimento,
                sexo,
                telefone,
            },
        });

        return reply.status(200).send(pacienteAtualizado);
    } catch (error) {
        console.error("Erro ao editar paciente:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
