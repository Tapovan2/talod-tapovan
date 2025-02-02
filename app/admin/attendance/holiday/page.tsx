"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Holiday = {
  id: number;
  date: string;
  reason: string;
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/holiday`;

export default function HolidayManager() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [reason, setReason] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchHolidays();
  }, []); // Removed unnecessary dependency 'year'

  const fetchHolidays = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?year=${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }
      const fetchedHolidays = await response.json();
      setHolidays(fetchedHolidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const handleAddHoliday = async () => {
    if (!selectedDate || !reason) return;

    try {
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          reason: reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add holiday");
      }

      setReason("");
      setSelectedDate(new Date());
      fetchHolidays();
    } catch (error) {
      console.error("Error adding holiday:", error);
    }
  };

  const handleDeleteHoliday = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete holiday");
      }

      fetchHolidays();
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Holiday</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="reason">Reason</label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter holiday reason"
            />
          </div>
          <Button onClick={handleAddHoliday}>Add Holiday</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Holiday List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell>
                    {new Date(holiday.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{holiday.reason}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteHoliday(holiday.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
