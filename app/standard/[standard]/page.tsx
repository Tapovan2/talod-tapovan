import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { type StandardKey, standards } from "../../../Data/index";
import { notFound } from "next/navigation";

interface StandardPageProps {
  params: { standard: StandardKey };
}

export default function StandardPage({ params }: StandardPageProps) {
  const standard = params.standard;
  const classes = standards[standard];

  if (!classes) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Standard {standard}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.classes.map((cls) => (
          <Link href={`/standard/${standard}/class/${cls}`} key={cls}>
            <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-center">Class {cls}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(standards).map((standard) => ({
    standard,
  }));
}

export const dynamicParams = false;
