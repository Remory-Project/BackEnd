import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function editPaciente(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
        id: z.string().cuid()
    });

    const bodySchema = z.object({
        nome: z.string().optional(),
        dataDeNascimento: z.string().optional(),
        telefone: z.string().optional(),
        sexo: z.enum(['Masculino', 'Feminino', 'Outro']).optional(),
        email: z.string().email().optional(),
        estadoCivil: z.string().optional(),
        nomeDaMae: z.string().optional(),
        nomeDoPai: z.string().optional(),
        nacionalidade: z.string().optional(),
        contatoDeEmergencia: z.string().optional(),
        endereco: z.string().optional(),
        cep: z.string().optional(),
        tipoSanguineo: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
        alergias: z.string().optional(),
        doencaCronica: z.string().optional(),
        medicamentosEmUso: z.string().optional()
    });
    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    if (Object.keys(data).length === 0) {
        return reply.status(400).send({ message: "Nenhum dado fornecido para atualização." });
    }

    try {
        const pacienteAtualizado = await prisma.paciente.update({
            where: { id: id },
            data: data,
        });
        
        return reply.status(200).send(pacienteAtualizado);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ message: "Dados inválidos.", issues: error.format() });
        }
        console.error("Erro ao atualizar o paciente:", error);
        return reply.status(500).send({ message: "Erro interno do servidor" });
    }
}