"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function LogoutButton() {
     const[loading,setIsLoading]=useState(false)
     const router = useRouter();
     const logout = async () => {
          setIsLoading(true)
        await fetch("/api/logout", {
            method: "POST",
        });
        setIsLoading(false)
        router.push("/login");
     }
  return (
     <div className='flex justify-end items-end w-full'>
    <Button disabled={loading} onClick={() => logout()}>
     { loading ? "Logout..." : "Logout"}
    </Button>
    </div>
  )
}

