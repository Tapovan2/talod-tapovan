import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();
  const { studentIds } = data;

  try {
    // Delete academic history for all selected students
    await prisma.academicHistory.deleteMany({
      where: { studentId: { in: studentIds } },
    });

    const mark = await prisma.mark.deleteMany({
      where: {
        studentId: parseInt(studentIds),
      },
    });

    // Delete the students
    await prisma.student.deleteMany({
      where: { id: { in: studentIds } },
    });

    return NextResponse.json({ message: "Students deleted successfully" });
  } catch (error) {
    console.error("Error deleting students:", error);
    return NextResponse.json(
      { error: "Error deleting students" },
      { status: 500 }
    );
  }
}
