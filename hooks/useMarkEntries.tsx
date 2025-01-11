import { useState, useEffect, useCallback } from 'react';

interface MarkEntry {
  id: string;
  name: string;
  test: string;
  MaxMarks: number;
  date: string;
}

export function useMarkEntries(standard: string, subject: string) {
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>([]);

  useEffect(() => {
    const fetchMarkEntries = async () => {
      const res = await fetch(
        `/api/mark-entries?standard=${standard}&subject=${subject}`
      );
      const data = await res.json();
      if (data) setMarkEntries(data);
    };

    fetchMarkEntries();
  }, [standard, subject]);

  const addMarkEntry = useCallback((newEntry: MarkEntry) => {
    setMarkEntries((prevEntries) => [...prevEntries, newEntry]);
  }, []);

  return { markEntries, addMarkEntry };
}

