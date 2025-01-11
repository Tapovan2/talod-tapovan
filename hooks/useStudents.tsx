import { useState, useEffect } from 'react';

export function useStudents(standard: string, classId: string) {
  const [students, setStudents] = useState([]);
//hook
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `/api/students?standard=${standard}&class=${classId}`
        );
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [standard, classId]);

  return { students };
}

