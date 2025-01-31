"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StandardKey, standards } from "@/Data"

// This would come from a database in a real application
interface SubjectPageProps {
  params: {
    standard: StandardKey;
    class: string;
  };
}

export default function ClassPage({ params }: SubjectPageProps) {
  const { standard, class: cls } = params;
  const classData = standards[standard];

  const { subjects } = classData;


  const filteredSubjects =
    (standard === "8" || standard === "9") && cls === "Foundation"
      ? [...subjects, "Physics", "Chemistry"]
      : (standard == "11" || standard == "12") && cls === "Maths"
      ? subjects.filter((subject) =>
          ["Chemistry", "Physics", "Maths", "Computer", "English"].includes(
            subject.trim()
          )
        )
      : (standard === "11" || standard === "12") && cls === "Biology"
      ? subjects.filter((subject) =>
          ["Biology", "Sanskrit"].includes(
            subject.trim()
          )
        )
      : subjects;
  const [selectedOption, setSelectedOption] = useState<"marks" | "attendance" | null>(null)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Standard {params.standard} - Class {params.class}
      </h1>

      {!selectedOption && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer" onClick={() => setSelectedOption("marks")}>
            <CardHeader>
              <CardTitle>Marks</CardTitle>
            </CardHeader>
           
          </Card>
          <Card className="cursor-pointer" onClick={() => setSelectedOption("attendance")}>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
           
          </Card>
        </div>
      )}

      {selectedOption === "marks" && (
        <div>
          <Button onClick={() => setSelectedOption(null)} className="mb-4">
            Back
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((subject) => (
              <Link href={`/standard/${params.standard}/class/${params.class}/subject/${subject}`} key={subject}>
                <Card>
                  <CardHeader>
                    <CardTitle>{subject}</CardTitle>
                  </CardHeader>
                  
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {selectedOption === "attendance" && (
        <div>
          <Button onClick={() => setSelectedOption(null)} className="mb-4">
            Back
          </Button>
          <Link prefetch={false} href={`/standard/${params.standard}/class/${params.class}/attendance`}>
            <Card>
              <CardHeader>
                <CardTitle>Mark Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Mark attendance for all students in this class</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}

