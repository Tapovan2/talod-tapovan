import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = searchParams.get("standard");
  const classParam = searchParams.get("class");
  const subject = searchParams.get("subject");
  const subClass = searchParams.get("subClass");

  console.log(standard, classParam, subject, subClass);

  let students;

  if (standard === "11" || standard === "12") {
    if (subject === "Maths" || subject === "Computer") {
      students = await prisma.student.findMany({
        where: {
          Standard: standard ? parseInt(standard) : undefined,
          Class: classParam || undefined,
          subClass: "Maths",
        },
      });
    } else if (subject === "Biology" || subject === "Sanskrit") {
      students = await prisma.student.findMany({
        where: {
          Standard: standard ? parseInt(standard) : undefined,
          Class: classParam || undefined,
          subClass: "Biology",
        },
      });
    } else if (
      subject === "Chemistry" ||
      subject === "Physics" ||
      subject === "English"
    ) {
      students = await prisma.student.findMany({
        where: {
          Standard: standard ? parseInt(standard) : undefined,
          Class: classParam || undefined,
        },
      });
    } else {
      students = await prisma.student.findMany({
        where: {
          Standard: standard ? parseInt(standard) : undefined,
          Class: classParam || undefined,
          subClass,
        },
      });
    }
  } else {
    students = await prisma.student.findMany({
      where: {
        Standard: standard ? parseInt(standard) : undefined,
        Class: classParam || undefined,
        subClass,
      },
    });
  }

  //@ts-expect-error
  const sortedStudents = students.sort((a, b) => a.rollNo - b.rollNo);

  return NextResponse.json(sortedStudents);
}

export async function POST(request: Request) {
  const data = await request.json();

  const student = await prisma.student.create({
    data: {
      name: data.name,
      rollNo: data.rollNo,
      Standard: parseInt(data.standard),
      Class: data.class,
      subClass: data.subClass,
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
