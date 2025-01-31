import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logout from "./logout";


const standards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


export default async function Home() {
  
  return (
    <div>
       <Logout />
      <h1 className="text-3xl font-bold mb-6">School Mark Management</h1>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
        {standards.map((standard) => (
          <Link prefetch={false} href={`/standard/${standard}`} key={standard}>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Standard {standard}</CardTitle>
              </CardHeader>
              
            </Card>
          </Link>
        ))}
      </div>
    
    </div>
      
  );
}
