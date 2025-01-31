"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

import { useStudents } from "@/hooks/useStudents";

export default function AttendancePage() {
  const params = useParams();

  const standard = params.standard as string;
  const classParam = params.class as string;
  const subject = params.subject as string;
  const [date, setDate] = useState<Date | null>(null);
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({});
  const { students, isLoading: isLoadingStudents } = useStudents(
    standard,
    classParam,
    subject
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isSunday = useCallback((date: Date) => date.getDay() === 0, []);

  useEffect(() => {
    const setInitialDate = () => {
      const initialDate = new Date();
      initialDate.setHours(0, 0, 0, 0);
      while (isSunday(initialDate)) {
        initialDate.setDate(initialDate.getDate() + 1);
      }
      setDate(initialDate);
    };

    setInitialDate();
  }, [isSunday]);

  const handleAttendanceChange = (studentId: string, value: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (isSunday(date)) {
      toast({
        title: "Error",
        description: "Attendance cannot be marked on Sundays",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const attendanceData = students.map((student: any) => ({
        studentId: student.id,
        status: attendance[student.id] || "P", // Default to "P" if not explicitly marked
      }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: date,
            standard: standard,
            class: classParam,
            attendance: attendanceData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark attendance");
      }

      const data = await response.json();
      if (data.success) {
        alert("Attendance marked successfully");

        toast({
          title: "Success",
          description: "Attendance marked successfully",
        });
      } else {
        throw new Error("Failed to mark attendance");
      }
    } catch (error) {
      alert("Failed to mark attendance");
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Attendance - Standard {standard} Class {classParam}
        </h1>
      </div>

      <div className="grid md:grid-cols-[300px,1fr] gap-6">
        <Card className="md:sticky md:top-6 h-fit">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={(day) => setDate(day || null)}
              disabled={(date) => isSunday(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStudents ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : date && !isSunday(date) ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[200px]">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.rollNo}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <RadioGroup
                          defaultValue="P"
                          onValueChange={(value) =>
                            handleAttendanceChange(student.id.toString(), value)
                          }
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="P"
                              id={`present-${student.id}`}
                            />
                            <Label
                              htmlFor={`present-${student.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              P
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="A"
                              id={`absent-${student.id}`}
                            />
                            <Label
                              htmlFor={`absent-${student.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              A
                            </Label>
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg font-medium text-gray-600">
                  {date && isSunday(date)
                    ? "Attendance is not marked on Sundays."
                    : "Please select a date to mark attendance."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center">
        <Button
          onClick={handleSubmitAttendance}
          disabled={
            isSubmitting ||
            isLoadingStudents ||
            !date ||
            (date && isSunday(date))
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Attendance"
          )}
        </Button>
      </div>
    </div>
  );
}
