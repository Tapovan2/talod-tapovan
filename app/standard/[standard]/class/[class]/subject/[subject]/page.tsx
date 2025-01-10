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
import { MarkEntryCard } from "@/components/MarkEntryCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarkEntry {
  id: string;
  name: string;
  date: string;
}

export default function SubjectPage({
  params,
}: {
  params: { standard: string; class: string; subject: string };
}) {
  const subjectName = decodeURIComponent(params.subject);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState<{ [key: string]: string }>({});
  const [isClient, setIsClient] = useState(false);
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<MarkEntry | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetchStudents();
    fetchMarkEntries();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      initializeMarks();
    }
  }, [students]);

  useEffect(() => {
    // Fetch marks when a new entry is selected
    if (selectedEntry) {
      fetchMarks(selectedEntry.id);
    }
  }, [selectedEntry]);

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
      acc[student.id] = "";
      return acc;
    }, {});
    setMarks(initialMarks);
  };

  const fetchMarkEntries = async () => {
    const res = await fetch(
      `/api/mark-entries?standard=${params.standard}&subject=${subjectName}`
    );

    const data = await res.json();
    if (!data) return;

    setMarkEntries(data);
  };

  const fetchMarks = async (markEntryId: string) => {
    const res = await fetch(`/api/marks?markEntryId=${markEntryId}`);
    const data = await res.json();
    if (data.length === 0) {
      initializeMarks();
      return;
    }

    const marksObj = data.reduce((acc: any, mark: any) => {
      acc[mark.student.id] = mark.score.toString();
      return acc;
    }, {});
    setMarks(marksObj);
  };

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: value,
    }));
  };

  const handleSubmit = async () => {
    const markData = students.map((student: any) => ({
      student: student.id,
      markEntryId: selectedEntry?.id,
      academicYear: new Date().getFullYear(),
      score: marks[student.id] || "AB",
    }));

    try {
      const res = await fetch("/api/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(markData),
      });

      if (res.ok) {
        alert("Marks submitted successfully");
      } else {
        throw new Error("Error submitting marks");
      }
    } catch (error) {
      alert("Error submitting marks");
      console.error(error);
    }
  };

  const handleCreateEntry = (newEntry: MarkEntry) => {
    setMarkEntries([...markEntries, newEntry]);
    setSelectedEntry(newEntry);
  };

  const handleSelectEntry = (entry: MarkEntry) => {
    setSelectedEntry(entry);
    fetchMarks(entry.id);
  };

  const getPdfData = () => {
    return {
      subject: subjectName.toUpperCase(),
      chapter: selectedEntry?.name || "",
      standard: params.standard,
      date: selectedEntry?.date || new Date().toLocaleDateString("en-GB"),
      entryName: selectedEntry?.name || "",
      students: students.map((student: any, index: number) => ({
        srNo: index + 1,
        rollNo: student.rollNo,
        name: student.name.toUpperCase(),
        marks: marks[student.id] || "AB",
      })),
    };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Standard {params.standard} - Class {params.class} - {subjectName}
      </h1>

      <div className="flex w-[300px] gap-4 items-center">
        <label
          htmlFor="entryDropdown"
          className="block text-sm font-medium text-gray-700 mb-2"
        ></label>
        <select
          id="entryDropdown"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={selectedEntry?.id || ""}
          onChange={(e) => {
            const selectedId = e.target.value;

            const selected = markEntries.find(
              (entry) => entry.id == selectedId
            );
            console.log("selectedID", selected);
            //@ts-expect-error
            handleSelectEntry(selected || null);
          }}
        >
          <option value="" disabled>
            Select an entry
          </option>
          {markEntries.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.name} - {new Date(entry.date).toLocaleDateString()}
            </option>
          ))}
        </select>
        <MarkEntryCard
          standard={params.standard}
          subject={subjectName}
          onCreateEntry={handleCreateEntry}
        />
      </div>

      {selectedEntry && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student: any, index: number) => (
                <TableRow key={student.id}>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={marks[student.id] || ""}
                      onChange={(e) =>
                        handleMarkChange(student.id, e.target.value)
                      }
                      min="0"
                      max="30"
                      className="w-[80px] border-2 border-gray-500 rounded-md p-2"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button onClick={handleSubmit}>Save Marks</Button>
            {isClient && (
              <PDFDownloadLink
                document={<MarkSheetPDF {...getPdfData()} />}
                fileName={`marksheet-${params.standard}-${params.class}-${subjectName}-${selectedEntry.name}.pdf`}
              >
                {/*@ts-ignore*/}
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? "Generating PDF..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </>
      )}
    </div>
  );
}
