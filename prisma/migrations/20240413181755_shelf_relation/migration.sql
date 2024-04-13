/*
  Warnings:

  - You are about to drop the column `position` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "position";

-- CreateTable
CREATE TABLE "Shelf" (
    "id" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "Shelf_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shelf" ADD CONSTRAINT "Shelf_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
