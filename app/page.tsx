import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const standards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">School Mark Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {standards.map((standard) => (
          <Link href={`/standard/${standard}`} key={standard}>
            <Card>
              <CardHeader>
                <CardTitle>Standard {standard}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage marks for Standard {standard}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
