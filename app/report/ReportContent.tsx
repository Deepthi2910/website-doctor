"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Scores = {
  performance: number;
  accessibility: number;
  seo: number;
  design: number;
};

type AnalysisResult = {
  scores: Scores;
  issues: string[];
  recommendations: string[];
  priorityFix: string;
  pageData?: {
    title: string;
    metaDescription: string;
    h1s: string[];
    h2s: string[];
    buttons: string[];
    imageCount: number;
    internalLinks: number;
    externalLinks: number;
  };
  error?: string;
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
  const [pageData, setPageData] = useState<AnalysisResult["pageData"]>();
  const [loading, setLoading] = useState(true);
  const [imageStatus, setImageStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [error, setError] = useState("");

  const totalScore = Math.round(
    (scores.performance +
      scores.accessibility +
      scores.seo +
      scores.design) / 4
  );

  useEffect(() => {
    async function runAnalysis() {
      if (!url) return;

      setLoading(true);
      setError("");
      setImageStatus("loading");

      const screenshotPath = `/api/screenshot?url=${encodeURIComponent(url)}`;
      setScreenshotUrl(screenshotPath);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        const data: AnalysisResult = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Analysis failed");
        }

        setScores(data.scores);
        setIssues(data.issues);
        setRecommendations(data.recommendations);
        setPriorityFix(data.priorityFix);
        setPageData(data.pageData);
      } catch (err) {
        console.error(err);
        setError("Could not analyze this website. Some websites block automated scanning.");
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [url]);

  if (!url) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 text-gray-900">
        <h1 className="text-2xl font-bold">No website provided</h1>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 text-gray-900">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-2xl font-bold">Analyzing {url}...</h1>
          <p className="text-gray-600">
            Scanning website structure and generating recommendations.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 text-gray-900">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 text-gray-900">
      <h1 className="mb-2 text-4xl font-bold">Website Audit Report</h1>
      <p className="mb-8 text-gray-600">Analyzing: {url}</p>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold">Overall Website Score</h2>
        <p className="text-5xl font-bold text-gray-900">{totalScore}/100</p>
      </section>

      {screenshotUrl && (
        <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">Website Screenshot</h2>

          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 p-3 shadow-sm min-h-[420px]">
            {imageStatus === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
                  <p className="text-sm text-gray-500">Capturing screenshot...</p>
                </div>
              </div>
            )}

            {imageStatus === "error" && (
              <div className="flex h-[400px] items-center justify-center rounded-lg bg-gray-100">
                <p className="text-sm text-gray-500">
                  Screenshot unavailable for this website.
                </p>
              </div>
            )}

            <img
              src={screenshotUrl}
              alt={`Screenshot of ${url}`}
              onLoad={() => setImageStatus("loaded")}
              onError={() => setImageStatus("error")}
              className={`w-full max-h-[500px] rounded-lg object-contain ${
                imageStatus === "error" ? "hidden" : "block"
              }`}
            />
          </div>
        </section>
      )}

      <section className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <ScoreCard title="Performance" score={scores.performance} />
        <ScoreCard title="Accessibility" score={scores.accessibility} />
        <ScoreCard title="SEO" score={scores.seo} />
        <ScoreCard title="Design" score={scores.design} />
      </section>

      {pageData && (
        <>
          <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">Website Overview</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Domain:</strong> {url}</p>
              <p><strong>Total Images:</strong> {pageData.imageCount}</p>
              <p><strong>Internal Links:</strong> {pageData.internalLinks}</p>
              <p><strong>External Links:</strong> {pageData.externalLinks}</p>
            </div>
          </section>

          <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">Page Summary</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Title:</strong> {pageData.title}</p>
              <p><strong>Meta description:</strong> {pageData.metaDescription}</p>
              <p><strong>H1 count:</strong> {pageData.h1s.length}</p>
              <p><strong>H2 count:</strong> {pageData.h2s.length}</p>
              <p><strong>Buttons found:</strong> {pageData.buttons.length}</p>
              <p><strong>Images found:</strong> {pageData.imageCount}</p>
              <p><strong>Internal links:</strong> {pageData.internalLinks}</p>
              <p><strong>External links:</strong> {pageData.externalLinks}</p>
            </div>
          </section>
        </>
      )}

      <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Key Issues</h2>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          {issues.map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Recommendations</h2>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          {recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h2 className="mb-3 text-2xl font-semibold">Priority Fix</h2>
        <p className="text-gray-800">{priorityFix}</p>
      </section>
    </main>
  );
}

function ScoreCard({ title, score }: { title: string; score: number }) {
  let borderColor = "border-gray-200";
  let textColor = "text-gray-900";
  let label = "Average";

  if (score >= 85) {
    borderColor = "border-green-400";
    textColor = "text-green-600";
    label = "Excellent";
  } else if (score >= 70) {
    borderColor = "border-blue-400";
    textColor = "text-blue-600";
    label = "Good";
  } else if (score >= 50) {
    borderColor = "border-yellow-400";
    textColor = "text-yellow-600";
    label = "Fair";
  } else {
    borderColor = "border-red-400";
    textColor = "text-red-600";
    label = "Poor";
  }

  return (
    <div className={`rounded-2xl border-2 ${borderColor} bg-white p-5 shadow-sm transition hover:shadow-md`}>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className={`mt-2 text-3xl font-bold ${textColor}`}>
        {score}
        <span className="ml-2 text-base font-medium text-gray-500">/100</span>
      </p>
      <p className={`mt-1 text-sm font-medium ${textColor}`}>{label}</p>
    </div>
  );
}