-- CreateTable
CREATE TABLE "Cuidador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cuidador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataDeNascimento" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "estadoCivil" TEXT NOT NULL,
    "nomeDaMa" TEXT NOT NULL,
    "nomeDoPai" TEXT NOT NULL,
    "nacionalidade" TEXT NOT NULL,
    "contatoDeEmergencia" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "tipoSanguineo" TEXT NOT NULL,
    "alergias" TEXT NOT NULL,
    "doencaCronica" TEXT NOT NULL,
    "medicamentosEmUso" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);
