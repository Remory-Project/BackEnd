import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function loginCuidador(request: FastifyRequest, reply: FastifyReply) {
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(5),
    });

    try {
        const { email, password } = loginSchema.parse(request.body);

        const cuidador = await prisma.cuidador.findUnique({
            where: { email },
        });

        if (!cuidador) {
            return reply.status(404).send({ message: "E-mail não encontrado." });
        }

        if (cuidador.password_hash !== password) {
            return reply.status(401).send({ message: "Senha incorreta." });
        }

        return reply.status(200).send({
            message: "Login realizado com sucesso.",
            cuidador: {
                id: cuidador.id,
                nome: cuidador.nome,
                email: cuidador.email,
            },
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Erro de validação.",
                issues: error.format(),
            });
        }

        console.error("Erro no login:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
