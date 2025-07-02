import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("mostrando tarefa");
    const tasks = await prisma.task.findMany();
    console.log("Tarefas:", tasks);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error("Erro ao conectar ao banco:", e);
        return prisma.$disconnect();
    });
