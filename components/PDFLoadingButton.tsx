"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface PDFLoadingButtonProps {
  document: React.ReactElement;
  fileName: string;
  buttonText: string;
  loadingText?: string;
  className?: string;
}

export function PDFLoadingButton({
  document,
  fileName,
  buttonText,
  loadingText = "Preparing PDF...",
  className = "",
}: PDFLoadingButtonProps) {
  const [isPreparing, setIsPreparing] = useState(false);

  if (!isPreparing) {
    return (
      <Button className={className} onClick={() => setIsPreparing(true)}>
        {buttonText}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="mb-2"
        onClick={() => setIsPreparing(false)}
      >
        Cancel
      </Button>
      <PDFDownloadLink document={document} fileName={fileName}>
        {/* @ts-ignore */}
        {({ loading, error }) => (
          <Button className={className} disabled={loading}>
            {loading
              ? loadingText
              : error
              ? "Error generating PDF"
              : buttonText}
          </Button>
        )}
      </PDFDownloadLink>
    </>
  );
}
