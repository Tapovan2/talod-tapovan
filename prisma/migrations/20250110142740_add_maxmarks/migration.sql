/*
  Warnings:

  - Added the required column `MaxMarks` to the `MarkEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarkEntry" ADD COLUMN     "MaxMarks" INTEGER NOT NULL;
