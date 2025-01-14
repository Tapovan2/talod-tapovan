import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StandardKey, standards } from "../../../Data/index";

interface StandardPageProps {
  params: { standard: StandardKey };
}

export default async function StandardPage({ params }: StandardPageProps) {
  const standard = params.standard;

  const classes = standards[standard];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Standard {standard}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.classes.map((cls) => (
          <Link href={`/standard/${standard}/class/${cls}`} key={cls}>
            <Card>
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
