/*
  Warnings:

  - You are about to drop the column `medicamentosEmUso` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `horarioMeds` on the `Relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `medicamentos` on the `Relatorio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "medicamentosEmUso";

-- AlterTable
ALTER TABLE "Relatorio" DROP COLUMN "horarioMeds",
DROP COLUMN "medicamentos";

-- CreateTable
CREATE TABLE "MedicamentoAgendado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "pacienteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicamentoAgendado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioMedicamento" (
    "id" TEXT NOT NULL,
    "hora" INTEGER NOT NULL,
    "minuto" INTEGER NOT NULL,
    "medicamentoId" TEXT NOT NULL,

    CONSTRAINT "HorarioMedicamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicamentoAgendado" ADD CONSTRAINT "MedicamentoAgendado_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioMedicamento" ADD CONSTRAINT "HorarioMedicamento_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "MedicamentoAgendado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
