/*
  Warnings:

  - Changed the type of `status` on the `Book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('avariado', 'disponivel', 'indisponivel', 'emprestado');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "status",
ADD COLUMN     "status" "BookStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
