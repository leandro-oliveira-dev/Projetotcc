-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "bookId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
