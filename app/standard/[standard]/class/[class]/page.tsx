import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// This would come from a database in a real application
const subjects = ['Mathematics', 'Science', 'English', 'Social Studies']

export default function ClassPage({ params }: { params: { standard: string, class: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Standard {params.standard} - Class {params.class}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Link href={`/standard/${params.standard}/class/${params.class}/subject/${subject}`} key={subject}>
            <Card>
              <CardHeader>
                <CardTitle>{subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage marks for {subject}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

