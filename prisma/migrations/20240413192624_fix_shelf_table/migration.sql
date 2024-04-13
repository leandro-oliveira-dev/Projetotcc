/*
  Warnings:

  - A unique constraint covering the columns `[bookId]` on the table `Shelf` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shelf_bookId_key" ON "Shelf"("bookId");
