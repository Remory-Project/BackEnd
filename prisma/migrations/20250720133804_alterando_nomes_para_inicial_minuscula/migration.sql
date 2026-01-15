/*
  Warnings:

  - You are about to drop the column `descricao` on the `Relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `dosagem` on the `Relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `horarioMedicacao` on the `Relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Relatorio` table. All the data in the column will be lost.
  - Added the required column `dataVisita` to the `Relatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricaoVisita` to the `Relatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaVisita` to the `Relatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pacienteId` to the `Relatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoVisita` to the `Relatorio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Relatorio" DROP COLUMN "descricao",
DROP COLUMN "dosagem",
DROP COLUMN "horarioMedicacao",
DROP COLUMN "titulo",
ADD COLUMN     "dataVisita" TEXT NOT NULL,
ADD COLUMN     "descricaoVisita" TEXT NOT NULL,
ADD COLUMN     "horaVisita" TEXT NOT NULL,
ADD COLUMN     "horarioMeds" TEXT,
ADD COLUMN     "localizacaoDor" TEXT,
ADD COLUMN     "observacoesVisita" TEXT,
ADD COLUMN     "pacienteId" TEXT NOT NULL,
ADD COLUMN     "peso" TEXT,
ADD COLUMN     "pressaoArterial" TEXT,
ADD COLUMN     "temperatura" TEXT,
ADD COLUMN     "tipoVisita" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Relatorio" ADD CONSTRAINT "Relatorio_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
