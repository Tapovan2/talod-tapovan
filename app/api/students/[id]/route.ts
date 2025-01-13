import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json()
  const student = await prisma.student.update({
    where: { id: parseInt(params.id) },
    data: {
      name: data.name,
      rollNo: data.rollNo,
      currentStandard:parseInt(data.standard),
      currentClass: data.class,
    },
  })
  return NextResponse.json(student)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.academicHistory.deleteMany({
    where: { studentId: parseInt(params.id) },
  });

  await prisma.mark.deleteMany({
    where: {
      studentId: parseInt(params.id)
    }
  });

  await prisma.student.delete({
    where: { id: parseInt(params.id) },
  });

  return NextResponse.json({ message: 'Student deleted successfully' });
}

