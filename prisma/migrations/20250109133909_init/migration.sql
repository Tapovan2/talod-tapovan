/*
  Warnings:

  - Added the required column `standard` to the `MarkEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarkEntry" ADD COLUMN     "standard" TEXT NOT NULL;
