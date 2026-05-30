/*
  Warnings:

  - Added the required column `id_organizador` to the `Entrada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entrada" ADD COLUMN     "id_organizador" TEXT NOT NULL;
