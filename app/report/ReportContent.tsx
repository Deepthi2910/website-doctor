"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Scores = {
  performance: number;
  accessibility: number;
  seo: number;
  design: number;
};

export default function ReportContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const [scores, setScores] = useState<Scores>({
    performance: 0,
    accessibility: 0,
    seo: 0,
    design: 0,
  });

  const [issues, setIssues] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [priorityFix, setPriorityFix] = useState("");

  const [screenshotUrl, setScreenshotUrl] = useState("");

  useEffect(() => {
    if (!url) return;

    // screenshot endpoint
    setScreenshotUrl(`/api/screenshot?url=${url}`);

    // Fake analysis for demo
    setScores({
      performance: 72,
      accessibility: 80,
      seo: 65,
      design: 70,
    });

    setIssues([
      "Hero section lacks clear call-to-action",
      "Navigation menu is cluttered",
      "Low contrast text in some sections",
      "Page loads multiple large images",
    ]);

    setRecommendations([
      "Add a prominent primary CTA in the hero section",
      "Simplify navigation to 4-5 main links",
      "Improve contrast for readability",
      "Optimize images for faster loading",
    ]);

    setPriorityFix("Add a strong call-to-action above the fold.");
  }, [url]);

  if (!url) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold">No website provided</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-10">

      <h1 className="text-4xl font-bold mb-6">
        Website Audit Report
      </h1>

      <p className="mb-8 text-gray-600">
        Analyzing: <strong>{url}</strong>
      </p>

      {/* Screenshot */}
      {screenshotUrl && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Website Screenshot</h2>
          <img
            src={screenshotUrl}
            alt="Website screenshot"
            className="rounded-lg border shadow-md"
          />
        </div>
      )}

      {/* Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

        <ScoreCard title="Performance" score={scores.performance} />
        <ScoreCard title="Accessibility" score={scores.accessibility} />
        <ScoreCard title="SEO" score={scores.seo} />
        <ScoreCard title="Design" score={scores.design} />

      </div>

      {/* Issues */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Key Issues</h2>

        <ul className="list-disc ml-6 space-y-2">
          {issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      </section>

      {/* Recommendations */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>

        <ul className="list-disc ml-6 space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </section>

      {/* Priority Fix */}
      <section className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-2xl font-semibold mb-2">Priority Fix</h2>
        <p>{priorityFix}</p>
      </section>

    </main>
  );
}

function ScoreCard({ title, score }: { title: string; score: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{score}</p>
    </div>
  );
}