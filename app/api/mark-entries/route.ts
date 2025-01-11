import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = searchParams.get("standard");
  const subject = searchParams.get("subject");

  const markEntries = await prisma.markEntry.findMany({
    where: {
      standard: standard ? parseInt(standard) : undefined,
      subject: subject || undefined,
    },
  });

  if (markEntries.length === 0) {
    return NextResponse.json([]);
  }

  return NextResponse.json(markEntries);
}

export async function POST(request: Request) {
  const data = await request.json();

  // First, find the subject by name

  const markEntry = await prisma.markEntry.create({
    data: {
      name: data.Chapter,
      date: new Date(data.date),
      test:data.testName,
      MaxMarks: parseInt(data.MaxMarks),
      standard: parseInt(data.standard),
      subject: data.subject,
    },
  });

  return NextResponse.json(markEntry);
}
