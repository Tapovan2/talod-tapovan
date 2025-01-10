import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { StandardKey, standards } from "../../../Data/index";

// This would come from a database in a real application

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
                <CardTitle>Class {cls}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage marks for Class {cls}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
