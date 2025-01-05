"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarkSheetPDF } from "@/components/MaeksheetPdf";

const date = new Date().toLocaleDateString();

export default function SubjectPage({
  params,
}: {
  params: { standard: string; class: string; subject: string };
}) {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      initializeMarks();
      fetchMarks();
    }
  }, [students]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `/api/students?standard=${params.standard}&class=${params.class}`
      );
      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();

      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const initializeMarks = () => {
    const initialMarks = students.reduce((acc, student) => {
      //@ts-expect-error
      acc[student.id] = ""; // Use student.id instead of student._id
      return acc;
    }, {});
    setMarks(initialMarks);
  };

  const fetchMarks = async () => {
    try {
      const res = await fetch(
        `/api/marks?standard=${params.standard}&class=${params.class}&subject=${params.subject}`
      );
      if (!res.ok) throw new Error("Failed to fetch marks");

      const data = await res.json();
      //@ts-expect-error
      const marksObj = data.reduce((acc, mark) => {
        acc[mark.student.id] = mark.score.toString(); // Use student.id
        return acc;
      }, {});

      setMarks((prevMarks) => ({
        ...prevMarks,
        ...marksObj, // Merge fetched marks with initialized marks
      }));
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: value,
    }));
  };

  const handleSubmit = async () => {
    const markData = students.map((student: any) => ({
      student: student.id, // Ensure this matches your API's expected identifier
      subject: params.subject,
      standard: parseInt(params.standard),
      class: params.class,
      academicYear: new Date().getFullYear(),
      score: marks[student.id] || "AB", // Use student.id
    }));

    try {
      const res = await fetch("/api/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(markData),
      });

      if (res.ok) {
        alert("Marks submitted successfully");
        fetchMarks();
      } else {
        throw new Error("Error submitting marks");
      }
    } catch (error) {
      alert("Error submitting marks");
      console.error(error);
    }
  };

  const getPdfData = () => {
    return {
      subject: params.subject.toUpperCase(),
      standard: params.standard,
      date: new Date().toLocaleDateString("en-GB"),
      students: students.map((student: any, index: number) => ({
        srNo: index + 1,
        rollNo: student.rollNo,
        name: student.name.toUpperCase(),
        marks: marks[student.id] || "AB", // Use student.id
      })),
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Standard {params.standard} - Class {params.class} - {params.subject}
        </h1>
        {isClient && (
          <PDFDownloadLink
            document={<MarkSheetPDF {...getPdfData()} />}
            fileName={`Std-${params.standard}-${params.subject}-${date}.pdf`}
          >
            {/* @ts-expect-error */}
            {({ blob, url, loading, error }) =>
              loading ? (
                <Button disabled>Generating PDF...</Button>
              ) : error ? (
                <Button disabled>Error Generating PDF</Button>
              ) : (
                <Button>Download PDF</Button>
              )
            }
          </PDFDownloadLink>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr No</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Mark</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student: any, index: number) => (
            <TableRow key={student.id}>
              {" "}
              {/* Use student.id */}
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student.rollNo}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={marks[student.id] || ""}
                  onChange={(e) => handleMarkChange(student.id, e.target.value)}
                  min="0"
                  max="30"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleSubmit} className="mt-4">
        Submit Marks
      </Button>
    </div>
  );
}
