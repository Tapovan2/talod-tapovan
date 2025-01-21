import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const standard = searchParams.get("standard");
  const subject = searchParams.get("subject");
  const className = searchParams.get("className");

 

  try {
    
 
  // Build the `where` object dynamically
  const where: Record<string, any> = {};
  
  if (standard) {
    where.standard = parseInt(standard);
  }
  
  if (className) {
    where.class = className;
  }
  
  if (subject) {
    where.subject = subject;
  }

  
  

  const markEntries = await prisma.markEntry.findMany({ where });



  return NextResponse.json(markEntries);
} catch (error:any) {
    throw new Error(error)
}finally{
  await prisma.$disconnect();
}
}

export async function POST(request: Request) {

  const data = await request.json();

  try{

  // First, find the subject by name

  const markEntry = await prisma.markEntry.create({
    data: {
      name: data.testName,
      date: new Date(data.date),
      Chapter:data.Chapter,
      MaxMarks: parseInt(data.MaxMarks),
      standard: parseInt(data.standard),
      class:data.className,
      subject: data.subject,
    },
  });
  
 
  return NextResponse.json(markEntry);
}catch(e:any){
  throw new Error(e)
}finally{
  await prisma.$disconnect();
}
}
