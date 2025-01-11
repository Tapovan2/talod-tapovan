import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = searchParams.get("standard");
  const classParam = searchParams.get("class");

  const students = await prisma.student.findMany({
    where: {
      currentStandard: standard ? parseInt(standard) : undefined,
      currentClass: classParam || undefined,
    },
  });
  //@ts-expect-error
  const sortedStudents = students.sort((a, b) => a.rollNo - b.rollNo);

  return NextResponse.json(sortedStudents);
}

export async function POST(request: Request) {
  const data = await request.json();
  console.log("data",data);
  
  const student = await prisma.student.create({
    data: {
      name: data.name,
      rollNo: data.rollNo,
      currentStandard: parseInt(data.standard),
      currentClass: data.class,
      academicHistory: {
        create: {
          year: new Date().getFullYear(),
          standard: parseInt(data.standard),
          class: data.class,
        },
      },
    },
  });
  return NextResponse.json(student);
}
