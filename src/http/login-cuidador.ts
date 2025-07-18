import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../env";

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

        const token = jwt.sign({ sub: cuidador.id }, env.JWT_SECRET, { expiresIn: '1d' });

        return reply.status(200).send({
            message: "Login realizado com sucesso.",
            token,
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
