import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = searchParams.get("standard");
  const classParam = searchParams.get("class");
  const subject = searchParams.get("subject");

  // const cacheKey = `student-${standard}-${classParam}`;

  // const cachedData = await redis.get(cacheKey);

  // if(cachedData){
  //   return NextResponse.json(cachedData)
  // }

  let students;

  if (
    (subject === "Chemistry" ||
      subject === "Physics" ||
      subject === "English") &&
    (standard === "11" || standard === "12")
  ) {
    students = await prisma.student.findMany({
      where: {
        currentStandard: standard ? parseInt(standard) : undefined,
      },
    });
  } else {
    students = await prisma.student.findMany({
      where: {
        currentStandard: standard ? parseInt(standard) : undefined,
        currentClass: classParam || undefined,
      },
    });
  }

  //@ts-expect-error
  const sortedStudents = students.sort((a, b) => a.rollNo - b.rollNo);

  // await redis.set(cacheKey, JSON.stringify(sortedStudents), { ex: 21600 });

  return NextResponse.json(sortedStudents);
}

export async function POST(request: Request) {
  const data = await request.json();

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
