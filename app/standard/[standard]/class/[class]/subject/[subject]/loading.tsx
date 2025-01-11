import React from "react";

const loading = () => {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-16 w-16" />
    </div>
  );
};

export default loading;