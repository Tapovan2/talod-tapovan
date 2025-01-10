import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogDescription, DialogHeader, DialogTrigger } from "./ui/dialog";

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
    <>
      {isCreating && (
        <div className="flex gap-4 justify-center items-center">
          <Dialog open={isCreating}>
            <DialogContent className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
              <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold mb-4 text-center">
                    Create Mark Entry
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600 text-center mb-6">
                    Fill in the details below to create a new mark entry.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Entry Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
                  <Button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>

    // <Card className="w-[300px]">
    //   <CardHeader>
    //     <CardTitle>New Mark Entry</CardTitle>
    //   </CardHeader>
    //   <CardContent className="space-y-4">
    //     <Input
    //       placeholder="Entry Name"
    //       value={name}
    //       onChange={(e) => setName(e.target.value)}
    //     />
    //     <Input
    //       type="date"
    //       value={date}
    //       onChange={(e) => setDate(e.target.value)}
    //     />
    //     <Button onClick={handleCreate}>Create</Button>
    //     <Button onClick={() => setIsCreating(false)}>Cancel</Button>
    //   </CardContent>
    // </Card>
  );
}
