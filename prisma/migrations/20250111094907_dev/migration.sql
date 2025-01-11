/*
  Warnings:

  - You are about to drop the column `test` on the `MarkEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MarkEntry" DROP COLUMN "test",
ADD COLUMN     "Chapter" TEXT DEFAULT '';
