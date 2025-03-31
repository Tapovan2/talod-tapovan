/*
  Warnings:

  - You are about to drop the column `currentClass` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `currentStandard` on the `Student` table. All the data in the column will be lost.
  - Added the required column `class` to the `MarkEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Class` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Standard` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarkEntry" ADD COLUMN     "class" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "currentClass",
DROP COLUMN "currentStandard",
ADD COLUMN     "Class" TEXT NOT NULL,
ADD COLUMN     "Standard" INTEGER NOT NULL,
ADD COLUMN     "subClass" TEXT;
