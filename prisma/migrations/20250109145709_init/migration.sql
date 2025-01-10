/*
  Warnings:

  - Changed the type of `rollNo` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "rollNo",
ADD COLUMN     "rollNo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNo_key" ON "Student"("rollNo");
