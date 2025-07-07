import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function createPaciente(request: FastifyRequest, reply: FastifyReply) {
    const createPacienteBodySchema = z.object({
        name: z.string(),
        email: z.string().email({ message: "Formato de e-mail inválido." }),
        password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
    });

    try {
        const { name, email, password } = createPacienteBodySchema.parse(request.body);

        const password_hash = await hash(password, 6);

        const pacienteComMesmoEmail = await prisma.paciente.findUnique({
            where: { email }
        });

        if (pacienteComMesmoEmail) {
            return reply.status(409).send({ message: "Este e-mail já está em uso." });
        }

        await prisma.paciente.create({
            data: {
                name,
                email,
                password_hash,
            }
        });

        return reply.status(201).send({ message: "Paciente criado com sucesso." });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({
                message: "Erro de validação nos dados enviados.",
                issues: error.format()
            });
        }

        console.error("Erro inesperado ao criar paciente:", error);
        return reply.status(500).send({ message: "Erro interno no servidor." });
    }
}
