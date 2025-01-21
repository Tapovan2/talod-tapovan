"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-100 to-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          <AlertTriangle className="mx-auto h-24 w-24 text-red-600" />
        </motion.div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Oops! Something went wrong
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We apologize for the inconvenience. An unexpected error has occurred please contact us to Developer .
        </p>
        <div className="mt-5 space-y-4">
          <Button
            onClick={reset}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Try again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
            >
              Go back to homepage
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}