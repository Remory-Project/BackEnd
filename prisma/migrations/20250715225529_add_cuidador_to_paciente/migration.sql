/*
  Warnings:

  - Added the required column `cuidadorId` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "cuidadorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_cuidadorId_fkey" FOREIGN KEY ("cuidadorId") REFERENCES "Cuidador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
