"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const [screenshotUrl, setScreenshotUrl] = useState("");

  useEffect(() => {
    if (!url) return;

    const screenshot = `/api/screenshot?url=${url}`;
    setScreenshotUrl(screenshot);
  }, [url]);

  if (!url) {
    return <p>No website provided.</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-6">Audit Report</h1>

      <p className="mb-6 text-gray-600">
        Website analyzed: <strong>{url}</strong>
      </p>

      <h2 className="text-2xl font-semibold mb-4">Website Screenshot</h2>

      {screenshotUrl ? (
        <img
          src={screenshotUrl}
          alt="Website screenshot"
          className="rounded-lg border shadow-md"
        />
      ) : (
        <p>Loading screenshot...</p>
      )}
    </main>
  );
}