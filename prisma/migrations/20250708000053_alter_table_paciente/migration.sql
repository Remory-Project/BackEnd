/*
  Warnings:

  - You are about to drop the column `nomeDaMa` on the `Paciente` table. All the data in the column will be lost.
  - Added the required column `nomeDaMae` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "nomeDaMa",
ADD COLUMN     "nomeDaMae" TEXT NOT NULL;
