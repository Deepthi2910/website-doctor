<<<<<<< HEAD
import Link from "next/link";

export default function AboutPage() {
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

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="mb-6 text-5xl font-bold">About Website Doctor</h2>

        <p className="mb-6 text-lg leading-8 text-gray-700">
          Website Doctor is a web app concept that helps review websites and
          uncover opportunities for UX, SEO, accessibility, and visual design
          improvement.
        </p>

        <p className="mb-6 text-lg leading-8 text-gray-700">
          The goal of this project is to make website analysis more visual and
          actionable by combining website screenshots, issue summaries, and
          redesign recommendations in one simple interface.
        </p>

        <p className="mb-6 text-lg leading-8 text-gray-700">
          It also includes before-and-after case studies to demonstrate how weak
          layouts, unclear navigation, and low-conversion sections can be
          improved through stronger hierarchy, better spacing, and clearer calls
          to action.
        </p>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-2xl font-semibold">
            What this project shows
          </h3>

          <ul className="space-y-3 text-gray-700">
            <li>Frontend development with Next.js</li>
            <li>Website analysis and report-style UI design</li>
            <li>Before-and-after redesign case studies</li>
            <li>Visual thinking around UX and conversion improvements</li>
          </ul>
=======
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-bold">Website Doctor</h1>
        <nav className="flex gap-6 text-sm text-gray-600">
          <Link href="/">Analyze</Link>
          <Link href="/case-studies">Case Studies</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-5xl font-bold leading-tight">
          Analyze websites and uncover redesign opportunities
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Website Doctor scans websites for UX, SEO, accessibility, and visual
          design issues so you can identify what is working, what is broken,
          and what to improve next.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Enter a website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-blue-500"
          />
          <Link
            href={`/report?url=${encodeURIComponent(url)}`}
            className="rounded-xl bg-black px-6 py-4 text-white transition hover:opacity-90"
          >
            Analyze Website
          </Link>
        </div>

        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">UX Review</h3>
            <p className="mt-2 text-sm text-gray-600">
              Find weak calls to action, cluttered layouts, and unclear user flows.
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">SEO Signals</h3>
            <p className="mt-2 text-sm text-gray-600">
              Check titles, descriptions, heading structure, and content hierarchy.
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <h3 className="font-semibold">Design Insights</h3>
            <p className="mt-2 text-sm text-gray-600">
              Spot visual issues and identify opportunities for cleaner, stronger redesigns.
            </p>
          </div>
>>>>>>> 80365d441e2c6bed578a07aa31c847d067e6b3bd
        </div>
      </section>
    </main>
  );
}