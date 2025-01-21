import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface MarkEntryCardProps {
  standard: string;
  className:string;
  subject: string;
  onCreateEntry: (entry: any) => void;
}

export function MarkEntryCard({
  standard,
  className,
  subject,
  onCreateEntry,
}: MarkEntryCardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [Chapter, setChapter] = useState("");
  const [date, setDate] = useState("");
  const [testName,setTestName] =useState("");
  const [MaxMarks, setMaxMarks] = useState("");
  const[loading,setIsLoading]=useState(false)

  const handleCreate = async () => {
    setIsLoading(true)
    if (testName && date) {
      try {
        const response = await fetch("/api/mark-entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Chapter,
            testName,
            date,
            standard,
            className,
            subject,
            MaxMarks,
          }),
        });

        if (!response.ok) {
          setIsLoading(false)
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create mark entry");
        }

        const newEntry = await response.json();
        onCreateEntry(newEntry);
        setIsCreating(false);
        setIsLoading(false)
        setChapter("");
        setDate("");
      } catch (error) {
        setIsLoading(false)
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
      <Dialog open={isCreating}>
        <DialogContent className=" flex items-center justify-center p-4">
          <div className=" rounded-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold mb-4 text-center">
                Create Mark Entry
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Test Name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
              <Input
               placeholder="Chapter Name"
               value={Chapter}
               onChange={(e)=> setChapter(e.target.value)}
               className="w-full px-4 py-2 border rounded-md"
              />
              <Input
                type="number"
                placeholder="Marks"
                onChange={(e) => setMaxMarks(e.target.value)}
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
                className="text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create'
          )}
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
