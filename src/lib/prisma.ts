
import { PrismaClient } from '../generated/prisma'; //Verique o caminho na sua aplicação

export const prisma = new PrismaClient()

// usada para interagir com o banco em serviços, rotas, repositórios.