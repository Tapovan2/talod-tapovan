/*
  Warnings:

  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_standardId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- AlterTable
ALTER TABLE "Mark" ALTER COLUMN "score" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Attendance";
