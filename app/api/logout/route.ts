import { cookies } from "next/headers";
import { NextResponse } from "next/server";

 
 export async function POST(request: Request) {
    cookies().delete("adminAuthenticated");
    return NextResponse.json({ success: true });
 }
