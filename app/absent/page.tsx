"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AbsentStudentsPDF from "@/components/AbsentstudentPdf";

type AbsentStudent = {
  id: number;
  rollNo: string;
  name: string;
  standard: string;
  class: string;
  date: string;
  reason?: string;
};

export default function AbsentStudentReason() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth().toString()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [absentStudents, setAbsentStudents] = useState<AbsentStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - 2 + i).toString()
  );

  const fetchAbsentStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/absent-students?month=${selectedMonth}&year=${selectedYear}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch absent students data");
      }
      const data = await response.json();
      setAbsentStudents(data);
    } catch (error) {
      console.error("Error fetching absent students:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReasonUpdate = async (studentId: number, reason: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/absent-students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId, reason }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update reason");
      }
      // Refresh the absent students data
      fetchAbsentStudents();
    } catch (error) {
      console.error("Error updating reason:", error);
      setError("Failed to update reason. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Absent Student Reasons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={fetchAbsentStudents}
              disabled={isLoading}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Fetching...
                </>
              ) : (
                "Get Absent Students"
              )}
            </Button>

            {absentStudents.length > 0 && (
              <PDFDownloadLink
                document={
                  <AbsentStudentsPDF
                    absentStudents={absentStudents}
                    month={months[Number.parseInt(selectedMonth)]}
                    year={selectedYear}
                  />
                }
                fileName={`absent_students_report_${
                  months[Number.parseInt(selectedMonth)]
                }_${selectedYear}.pdf`}
              >
                {/* @ts-ignore */}
                {({ blob, url, loading, error }) => (
                  <Button disabled={loading} className="min-w-[200px]">
                    {loading ? "Generating PDF..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>

          {error && <div className="text-red-500 text-center">{error}</div>}

          {absentStudents.length > 0 && (
            <div className="w-full overflow-auto sm:overflow-visible">
              <div className="min-w-[800px] sm:w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="whitespace-nowrap">
                      <TableHead className="px-2">Date</TableHead>
                      <TableHead className="px-2">Standard</TableHead>
                      <TableHead className="px-2">Class</TableHead>
                      <TableHead className="px-2">Roll No</TableHead>
                      <TableHead className="px-2">Name</TableHead>
                      <TableHead className="px-2">Reason</TableHead>
                      <TableHead className="px-2">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absentStudents.map((student) => (
                      <TableRow
                        key={`${student.id}-${student.date}`}
                        className="whitespace-nowrap"
                      >
                        <TableCell className="px-2">
                          {formatDate(student.date)}
                        </TableCell>
                        <TableCell className="px-2">
                          {student.standard}
                        </TableCell>
                        <TableCell className="px-2">{student.class}</TableCell>
                        <TableCell className="px-2">{student.rollNo}</TableCell>
                        <TableCell className="px-2">{student.name}</TableCell>
                        <TableCell className="px-2">
                          {student.reason || "Not specified"}
                        </TableCell>
                        <TableCell className="px-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Update Reason
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Absence Reason</DialogTitle>
                              </DialogHeader>
                              <ReasonSelector
                                initialReason={student.reason || ""}
                                onReasonUpdate={(reason) =>
                                  handleReasonUpdate(student.id, reason)
                                }
                              />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {!isLoading && absentStudents.length === 0 && (
            <div className="text-center text-muted-foreground">
              No absent students found. Please select a different month/year or
              click the button to fetch data.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ReasonSelector({
  initialReason,
  onReasonUpdate,
}: {
  initialReason: string;
  onReasonUpdate: (reason: string) => Promise<void>;
}) {
  const [selectedReason, setSelectedReason] = useState(
    initialReason || "Please select reason"
  );
  const [customReason, setCustomReason] = useState(
    initialReason &&
      !["Lagan ma gayel chhe", "Bimar padel chhe", "Bar gayel chhe"].includes(
        initialReason
      )
      ? initialReason
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonChange = (value: string) => {
    setSelectedReason(value);
    if (value !== "Other") {
      setCustomReason("");
    }
  };

  const handleSubmit = async () => {
    if (selectedReason === "Please select reason") return;

    setIsSubmitting(true);
    try {
      const finalReason =
        selectedReason === "Other" ? customReason.trim() : selectedReason;
      await onReasonUpdate(finalReason);
    } catch (error) {
      console.error("Error updating reason:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Select onValueChange={handleReasonChange} value={selectedReason}>
          <SelectTrigger>
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Please select reason">
              Please select reason
            </SelectItem>
            <SelectItem value="Lagan ma gayel chhe">
              Lagan ma gayel chhe
            </SelectItem>
            <SelectItem value="Bimar padel chhe">Bimar padel chhe</SelectItem>
            <SelectItem value="Bar gayel chhe">Bar gayel chhe</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selectedReason === "Other" && (
        <div className="space-y-2">
          <Label htmlFor="customReason">Custom Reason</Label>
          <Input
            id="customReason"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Enter custom reason"
          />
        </div>
      )}
      <DialogFooter>
        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            selectedReason === "Please select reason" ||
            (selectedReason === "Other" && !customReason.trim())
          }
        >
          {isSubmitting ? "Updating..." : "Update Reason"}
        </Button>
      </DialogFooter>
    </div>
  );
}
