import { useState, useEffect } from 'react';

export function useStudents(standard: string, classId: string, subject: string) {
  const [students, setStudents] = useState([]);
  console.log("classId",classId);
  
//hook
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `/api/students?standard=${standard}&class=${classId}&subject=${subject}`
        );
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [standard, classId, subject]);

  return { students };
}

