import { type StandardKey, standards } from "@/Data";
import ClientComponent from "./ClientComponent";

interface ClassPageProps {
  params: {
    standard: StandardKey;
    class: string;
  };
}

export default async function ClassPage({ params }: ClassPageProps) {
  const { standard, class: cls } = params;
  const classData = standards[standard];
  const { subjects } = classData;

  const filteredSubjects =
    (standard === "8" || standard === "9") && cls === "Foundation"
      ? [...subjects, "Physics", "Chemistry"]
      : (standard === "11" || standard === "12") && cls === "Maths"
      ? subjects.filter((subject) =>
          ["Chemistry", "Physics", "Maths", "Computer", "English"].includes(
            subject.trim()
          )
        )
      : (standard === "11" || standard === "12") && cls === "Biology"
      ? subjects.filter((subject) =>
          ["Biology", "Sanskrit"].includes(subject.trim())
        )
      : subjects;

  return (
    <ClientComponent
      standard={standard}
      class={cls}
      subjects={[...filteredSubjects]}
    />
  );
}

export async function generateStaticParams() {
  const paths = [];
  for (const [standard, data] of Object.entries(standards)) {
    const classes = data.classes || ["Foundation"];
    for (const cls of classes) {
      paths.push({ standard, class: cls });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: any) {
  return {
    title: `Standard ${params.standard} - Class ${params.class}`,
  };
}
