/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Mark` table. All the data in the column will be lost.
  - You are about to drop the column `standardId` on the `MarkEntry` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `MarkEntry` table. All the data in the column will be lost.
  - You are about to drop the column `standardId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `Standard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subject` to the `MarkEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentStandard` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "MarkEntry" DROP CONSTRAINT "MarkEntry_standardId_fkey";

-- DropForeignKey
ALTER TABLE "MarkEntry" DROP CONSTRAINT "MarkEntry_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_standardId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_standardId_fkey";

-- AlterTable
ALTER TABLE "Mark" DROP COLUMN "subjectId";

-- AlterTable
ALTER TABLE "MarkEntry" DROP COLUMN "standardId",
DROP COLUMN "subjectId",
ADD COLUMN     "subject" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "standardId",
ADD COLUMN     "currentStandard" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Standard";

-- DropTable
DROP TABLE "Subject";
