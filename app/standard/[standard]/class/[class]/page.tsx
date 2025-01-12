import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StandardKey, standards } from "@/Data";

interface SubjectPageProps {
  params: {
    standard: StandardKey;
    class: string;
  };
}

export default function ClassPage({ params }: SubjectPageProps) {
  const { standard, class: cls } = params;
  const classData = standards[standard];

  const { subjects } = classData;

  // Conditional filtering for standards 11 and 12 only
  const filteredSubjects =
    (standard == "11" || standard == "12") && cls === "Maths"
      ? subjects.filter((subject) =>
          ["Chemistry", "Physics", "Maths", "Computer", "English"].includes(
            subject.trim()
          )
        )
      : (standard === "11" || standard === "12") && cls === "Biology"
      ? subjects.filter((subject) =>
          ["Chemistry", "Physics", "Biology", "Computer", "English"].includes(
            subject.trim()
          )
        )
      : subjects;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Standard {params.standard} - Class {params.class}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subject) => (
          <Link
            href={`/standard/${params.standard}/class/${params.class}/subject/${subject}`}
            key={subject}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center">{subject}</CardTitle>
              </CardHeader>
            
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
