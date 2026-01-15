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
        nome: z.string(),
        dataDeNascimento: z.string(),
        telefone: z.string(),
        sexo: z.string(),
        email: z.string().email(),
        estadoCivil: z.string(),
        nomeDaMae: z.string(),
        nomeDoPai: z.string(),
        nacionalidade: z.string(),
        contatoDeEmergencia: z.string(),
        endereco: z.string(),
        cep: z.string(),
        tipoSanguineo: z.string(),
        alergias: z.string(),
        doencaCronica: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { nome, dataDeNascimento, telefone, sexo, email, estadoCivil, nomeDaMae, nomeDoPai, nacionalidade, contatoDeEmergencia, endereco, cep, tipoSanguineo, alergias, doencaCronica} = bodySchema.parse(request.body);

    try {
        const paciente = await prisma.paciente.findUnique({
            where: { id },
        });

        if (!paciente) {
            return reply.status(404).send({ message: "Paciente não encontrado." });
        }

        if (paciente.cuidadorId !== request.user.id) {
            return reply.status(403).send({ message: "Acesso negado: paciente não pertence a você." });
        }

        const pacienteAtualizado = await prisma.paciente.update({
            where: { id },
            data: {
                nome,
                dataDeNascimento,
                telefone,
                sexo,
                email,
                estadoCivil,
                nomeDaMae,
                nomeDoPai,
                nacionalidade,
                contatoDeEmergencia,
                endereco,
                cep,
                tipoSanguineo,
                alergias,
                doencaCronica
            },
        });

        return reply.status(200).send(pacienteAtualizado);
    } catch (error) {
        console.error("Erro ao editar paciente:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
