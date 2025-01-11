"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const[loading,setIsLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault(); 
    setError(""); 

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    const response = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setIsLoading(false)
    } else {
      setIsLoading(false)
      setError("Invalid password. Access denied.");
    }
  };

    if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
            disabled={loading}
              type="submit"
              className="w-full py-2 rounded-md "
            >
             {
              loading ? "Loding..." : "Login"
             }
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return null; 
}