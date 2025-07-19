import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

const prisma = new PrismaClient();

export async function criarPaciente(request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply); 

    const createPacienteBodySchema = z.object({
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
        medicamentosEmUso: z.string(),
        // cuidadorId foi REMOVIDO do schema
    });

    try {
        const {
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
            doencaCronica,
            medicamentosEmUso
        } = createPacienteBodySchema.parse(request.body);

        await prisma.paciente.create({
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
                doencaCronica,
                medicamentosEmUso,
                cuidadorId: request.user.id 
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
