"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import * as XLSX from "xlsx";
import { standards } from "@/Data";
import { Trash2 } from "lucide-react";

export default function MarkEntriesPage() {
  const [currentStandard, setCurrentStandard] = useState<string>("");
  const [currentClass, setCurrentClass] = useState<string>("");
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [markEntries, setMarkEntries] = useState<any[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fLoading, setfLoading] = useState<boolean>(false);
  const [dLoading, setIsdLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentStandard) {
      setClasses([
        ...standards[currentStandard as keyof typeof standards].classes,
      ]);
    }
  }, [currentStandard]);

  useEffect(() => {
    if (selectedStandard && selectedClass) {
      fetchMarkEntries(selectedStandard, selectedClass);
    }
  }, [selectedStandard, selectedClass]);

  const handleFetchStudents = () => {
    if (currentStandard && currentClass) {
      fetchMarkEntries(currentStandard, currentClass);
    } else {
      alert("Please select both current standard and class to fetch students.");
    }
  };

  const fetchMarkEntries = async (standard: string, className: string) => {
    
    setfLoading(true);

    const response = await fetch(
      `/api/mark-entries?standard=${standard}&className=${className}`
    );
    const data = await response.json();
    setMarkEntries(data);
    setfLoading(false);
  };

  const handleEntrySelection = (entryId: string) => {
    setSelectedEntries((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  };

  const generateExcel = async () => {
    if (selectedEntries.length === 0) {
      alert("Please select at least one mark entry");
      return;
    }

    setIsLoading(true);

    try {
      const standardToSend = selectedStandard || currentStandard;
      const classToSend = selectedClass || currentClass;

      const response = await fetch("/api/generate-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markEntryIds: selectedEntries,
          standard: standardToSend,
          class: classToSend,
        }),
      });
      if (!response.ok) throw new Error("Failed to generate Excel file");

      const data = await response.json();
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      const centerAlignStyle = {
        alignment: { horizontal: "center", vertical: "center" },
        font: { name: "Arial", sz: 12 },
      };
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 12 },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
      };

      const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) ws[cellRef] = { v: "", t: "s" };
          ws[cellRef].s = R === 0 ? headerStyle : centerAlignStyle;
        }
      }

      const colWidths = [{ wch: 8 }, { wch: 12 }, { wch: 30 }];

      for (let i = 3; i < Object.keys(data[0]).length; i++) {
        colWidths.push({ wch: 25 });
      }
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Marks");

      XLSX.writeFile(wb, `marks_${standardToSend}_${classToSend}.xlsx`);
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Failed to generate Excel file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedEntries.length === 0) {
      alert("Please select at least one mark entry to delete");
      return;
    }

   

    if (confirm("Are you sure you want to delete the selected entries?")) {
      try {
        setIsdLoading(true);
        const response = await fetch("/api/mark-entries", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markEntryIds: selectedEntries }),
        });

        if (response.ok) {
          setIsdLoading(false);
          alert("Selected entries have been deleted successfully");
        } else {
          setIsdLoading(false);
          alert("Failed to delete mark entries. Please try again.");
        }

        // Refresh the mark entries after deletion
        await fetchMarkEntries(
          selectedStandard || currentStandard,
          selectedClass || currentClass
        );
        setSelectedEntries([]);
      } catch (error) {
        setIsdLoading(false);
        console.error("Error deleting mark entries:", error);
        alert("Failed to delete mark entries. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select onValueChange={setCurrentStandard}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Current Standard" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(standards).map((standard) => (
              <SelectItem key={standard} value={standard}>
                Standard {standard}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setCurrentClass}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Current Class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((className) => (
              <SelectItem key={className} value={className}>
                Class {className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleFetchStudents}
          disabled={!currentStandard || !currentClass || fLoading}
        >
          {fLoading ? "fetching..." : "Fetch"}
        </Button>
      </div>

      {markEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Mark Entries - Standard {selectedStandard || currentStandard},
              Class {selectedClass || currentClass}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {markEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={() => handleEntrySelection(entry.id)}
                      />
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.subject}</TableCell>
                    <TableCell>
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {}
            <div className="mt-4 flex gap-2">
              <Button
                onClick={generateExcel}
                disabled={isLoading || selectedEntries.length === 0}
              >
                {isLoading ? "Generating..." : "Generate Excel"}
              </Button>
              {selectedEntries.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={dLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {dLoading ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
