import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface MarkEntryCardProps {
  standard: string;
  subject: string;
  onCreateEntry: (entry: any) => void;
}

export function MarkEntryCard({
  standard,
  subject,
  onCreateEntry,
}: MarkEntryCardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleCreate = async () => {
    if (name && date) {
      try {
        const response = await fetch("/api/mark-entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            date,
            standard,
            subject,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create mark entry");
        }

        const newEntry = await response.json();
        onCreateEntry(newEntry);
        setIsCreating(false);
        setName("");
        setDate("");
      } catch (error) {
        console.error("Error creating mark entry:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to create mark entry. Please try again."
        );
      }
    }
  };

  if (!isCreating) {
    return (
      <Button
        className="border-dashed flex items-center justify-center cursor-pointer"
        onClick={() => setIsCreating(true)}
      >
        <PlusCircle className="w-12 h-12 text-gray-400" />
      </Button>
    );
  }

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>New Mark Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Entry Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={handleCreate}>Create</Button>
        <Button onClick={() => setIsCreating(false)}>Cancel</Button>
      </CardContent>
    </Card>
  );
}
