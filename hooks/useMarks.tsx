import { useState, useEffect, useCallback } from 'react';

interface Student {
  id: string;
  name: string;
  rollNo: string;
}

interface MarksRecord {
  [key: string]: string;
}

interface MarkData {
  student: {
    id: string;
  };
  score: number | string;
}

export function useMarks(students: Student[], markEntryId: string | null) {
  const [marks, setMarks] = useState<MarksRecord>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeMarks = () => {
      const initialMarks = students.reduce((acc: MarksRecord, student) => {
        acc[student.id] = "";
        return acc;
      }, {} as MarksRecord);
      setMarks(initialMarks);
    };

    if (students.length > 0) {
      initializeMarks();
    }
  }, [students]);

  useEffect(() => {
    setMarks({});

    const fetchMarks = async () => {
      if (!markEntryId) return;

      const res = await fetch(`/api/marks?markEntryId=${markEntryId}`);
      const data = await res.json();
      console.log("marks", data);
      
      if (data.length === 0) {
        return;
      }

      const marksObj = data.reduce((acc: MarksRecord, mark: MarkData) => {
        acc[mark.student.id] = mark.score.toString();
        return acc;
      }, {} as MarksRecord);
      setMarks(marksObj);
    };

    fetchMarks();
  }, [markEntryId]);

  const submitMarks = useCallback(async () => {
    const markData = students.map((student) => ({
      student: student.id,
      markEntryId,
      academicYear: new Date().getFullYear(),
      score: marks[student.id] || "AB",
    }));

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [students, markEntryId, marks]);

  return { marks, setMarks, submitMarks, loading };
}

