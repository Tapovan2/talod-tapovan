/*
  Warnings:

  - Changed the type of `standard` on the `MarkEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MarkEntry" DROP COLUMN "standard",
ADD COLUMN     "standard" INTEGER NOT NULL;
