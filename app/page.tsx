"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <h1 className="text-2xl font-bold">Website Doctor</h1>

        <div className="flex gap-6 text-sm font-medium">
          <Link href="/">Analyze</Link>
          <Link href="/case-studies">Case Studies</Link>
          <Link href="/about">About</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        <h2 className="mb-6 text-5xl font-bold leading-tight">
          Analyze websites and uncover redesign opportunities
        </h2>

        <p className="mb-10 max-w-2xl text-lg text-gray-600">
          Website Doctor helps identify UX, accessibility, SEO, and visual design
          issues so you can build better websites and showcase smarter redesigns.
        </p>

        <div className="flex w-full max-w-2xl gap-3">
          <input
            type="text"
            placeholder="Enter website URL (example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />

          <Link
            href={`/report?url=${encodeURIComponent(url)}`}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Analyze
          </Link>
        </div>
      </section>
    </main>
  );
}