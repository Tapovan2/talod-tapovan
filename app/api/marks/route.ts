import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = searchParams.get("standard");
  const classParam = searchParams.get("class");
  const subject = searchParams.get("subject");

  const marks = await prisma.mark.findMany({
    where: {
      student: {
        currentStandard: standard ? { number: parseInt(standard) } : undefined,
        currentClass: classParam || undefined,
      },
      subject: {
        name: subject || undefined,
      },
    },
    include: {
      student: true,
      subject: true,
    },
  });

  return NextResponse.json(marks);
}

export async function POST(request: Request) {
  const data = await request.json();

  const marks = await Promise.all(
    data.map(
      async (mark: {
        student: any;
        subject: any;
        score: any;
        academicYear: any;
      }) => {
        const student = await prisma.student.findUnique({
          where: { id: mark.student },
        });

        const subject = await prisma.subject.findFirst({
          where: { name: mark.subject, standardId: student?.standardId },
        });

        if (!student || !subject) {
          throw new Error("Student or Subject not found");
        }

        return prisma.mark.create({
          data: {
            student: { connect: { id: student?.id } },
            subject: { connect: { id: subject?.id } },
            score: mark.score,
            academicYear: mark.academicYear,
          },
        });
      }
    )
  );

  return NextResponse.json(marks);
}
