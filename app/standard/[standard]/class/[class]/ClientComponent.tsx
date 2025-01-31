"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { StandardKey } from "@/Data";

interface ClientComponentProps {
  standard: StandardKey;
  class: string;
  subjects: string[];
}

export default function ClientComponent({
  standard,
  class: cls,
  subjects,
}: ClientComponentProps) {
  const [selectedOption, setSelectedOption] = useState<
    "marks" | "attendance" | null
  >(null);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Standard {standard} - Class {cls}
      </h1>

      {!selectedOption && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors cursor-pointer"
            onClick={() => setSelectedOption("marks")}
          >
            <CardHeader>
              <CardTitle>Marks</CardTitle>
            </CardHeader>
          </Card>
          <Card
            className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors cursor-pointer"
            onClick={() => setSelectedOption("attendance")}
          >
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
            {subjects.map((subject) => (
              <Link
                href={`/standard/${standard}/class/${cls}/subject/${subject}`}
                key={subject}
              >
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
          <Link href={`/standard/${standard}/class/${cls}/attendance`}>
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
  );
}
