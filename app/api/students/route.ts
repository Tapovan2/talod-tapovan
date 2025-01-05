import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = searchParams.get("standard");
  const classParam = searchParams.get("class");

  const students = await prisma.student.findMany({
    where: {
      currentStandard: standard ? { number: parseInt(standard) } : undefined,
      currentClass: classParam || undefined,
    },
    include: {
      currentStandard: true,
    },
  });

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const data = await request.json();
  const student = await prisma.student.create({
    data: {
      name: data.name,
      rollNo: data.rollNo,
      currentStandard: { connect: { number: data.currentStandard } },
      currentClass: data.currentClass,
      academicHistory: {
        create: {
          year: new Date().getFullYear(),
          standard: data.currentStandard,
          class: data.currentClass,
        },
      },
    },
  });
  return NextResponse.json(student);
}
