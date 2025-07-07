import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";


export async function listTasks(request: FastifyRequest, reply: FastifyReply) {
    const tasks = await prisma.task.findMany();
    return reply.status(200).send(tasks);    
}