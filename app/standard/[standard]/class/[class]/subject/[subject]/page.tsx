"use client";

import { useState, useEffect, useCallback } from "react";
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
import Breadcrumbs from "@/components/Breadcrumbs";
import { useStudents } from "@/hooks/useStudents";
import { useMarkEntries } from "@/hooks/useMarkEntries";
import { useMarks } from "@/hooks/useMarks";

interface MarkEntry {
  id: string;
  name: string;
  test: string;
  MaxMarks: number;
  date: string;
}

export default function SubjectPage({
  params,
}: {
  params: { standard: string; class: string; subject: string };
}) {
  const subjectName = decodeURIComponent(params.subject);
  const [selectedEntry, setSelectedEntry] = useState<MarkEntry | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { students } = useStudents(params.standard, params.class);
  const { markEntries, addMarkEntry } = useMarkEntries(params.standard, subjectName);
  const { marks, setMarks, submitMarks, loading } = useMarks(students, selectedEntry?.id || null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMarkChange = useCallback((studentId: string, value: string) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: value,
    }));
  }, [setMarks]);

  const handleCreateEntry = useCallback((newEntry: MarkEntry) => {
    addMarkEntry(newEntry);
    setSelectedEntry(newEntry);
  }, [addMarkEntry]);

  const handleSelectEntry = useCallback((entry: MarkEntry | null) => {
    setSelectedEntry(entry);
  }, []);

  const getPdfData = useCallback(() => {
    return {
      subject: subjectName.toUpperCase(),
      chapter: selectedEntry?.test || "",
      testName: selectedEntry?.name || "",
      maxMarks: selectedEntry?.MaxMarks || 0,
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
  }, [subjectName, selectedEntry, params.standard, students, marks]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: `Standard ${params.standard}`, href: `/standard/${params.standard}` },
          { label: `Class ${params.class}`, href: `/standard/${params.standard}/class/${params.class}` },
          { label: subjectName, href: "#" },
        ]}
      />
     
     <div className="flex gap-4 items-center">
        <label
          htmlFor="entryDropdown"
          className="block text-sm font-medium text-gray-700 mb-2"
        ></label>
        <select
          id="entryDropdown"
          className="block w-[100px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={selectedEntry?.id || ""}
          onChange={(e) => {
            const selectedId = e.target.value;

            const selected = markEntries.find(
              (entry) => entry.id == selectedId
            );
            console.log("selectedID", selected);
            
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
              {students.map((student: any) => (
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
            <Button onClick={submitMarks} disabled={loading}>
              {loading ? "Saving..." : "Save Marks"}
            </Button>
            {isClient && (
              <PDFDownloadLink
                document={<MarkSheetPDF {...getPdfData()} />}
                fileName={`Marks-${params.standard}-${params.class}-${subjectName}-${selectedEntry.name}.pdf`}
              >
                {/*@ts-expect-error*/}
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

