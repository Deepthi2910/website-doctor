"use client";

import { Suspense } from "react";
import ReportContent from "./ReportContent";

export default function ReportPage() {
  return (
    <Suspense fallback={<div>Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );
}

type ReportContent = {
  issues: string[];
  recommendations: string[];
  priorityFix: string;
};

type Scores = {
  performance: number;
  accessibility: number;
  seo: number;
  design: number;
};

function getHash(input: string) {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function generateScoresFromUrl(url: string): Scores {
  const hash = getHash(url);

  const makeScore = (offset: number) => {
    return ((hash + offset * 97) % 41) + 60;
  };

  return {
    performance: makeScore(1),
    accessibility: makeScore(2),
    seo: makeScore(3),
    design: makeScore(4),
  };
}

function pickStableItems(items: string[], count: number, seed: number) {
  const copied = [...items];

  copied.sort((a, b) => {
    const aScore = getHash(a + seed.toString());
    const bScore = getHash(b + seed.toString());
    return aScore - bScore;
  });

  return copied.slice(0, count);
}

function getGenericReport(url: string): ReportContent {
  const seed = getHash(url);

  const genericIssues = [
    "Navigation hierarchy could be clearer",
    "Call-to-action visibility could be improved",
    "Typography scale may reduce readability in key sections",
    "Spacing consistency can be refined across content blocks",
    "Hero messaging could be more focused",
    "Visual hierarchy may not guide users strongly enough",
    "Mobile layout may need further refinement",
    "Images may need optimization for faster loading",
    "Important actions may not stand out enough",
    "Section organization could improve scanning speed",
    "Trust signals may not be emphasized clearly",
    "Content density may feel high for first-time users",
  ];

  const genericRecommendations = [
    "Strengthen the primary call-to-action with better contrast",
    "Simplify the hero section and focus on one clear message",
    "Improve heading hierarchy for faster scanning",
    "Standardize spacing and alignment across sections",
    "Reduce visual clutter around key content areas",
    "Improve mobile-first layout decisions",
    "Highlight trust-building elements more clearly",
    "Compress large images and optimize page weight",
    "Use stronger separation between primary and secondary actions",
    "Make navigation labels clearer and more goal-oriented",
    "Guide users toward the next action more explicitly",
    "Refine section flow to improve readability",
  ];

  const priorityOptions = [
    "Improve accessibility and visual hierarchy first",
    "Clarify the main call-to-action and core user journey",
    "Reduce visual clutter and strengthen page structure",
    "Improve readability and mobile usability first",
    "Make key actions easier to discover and understand",
  ];

  return {
    issues: pickStableItems(genericIssues, 5, seed),
    recommendations: pickStableItems(genericRecommendations, 5, seed + 111),
    priorityFix: priorityOptions[seed % priorityOptions.length],
  };
}

function getWebsiteReport(url: string): ReportContent {
  const normalized = url.toLowerCase();

  if (normalized.includes("wikipedia")) {
    return {
      issues: [
        "Text-heavy layout may overwhelm first-time users",
        "Primary actions are not visually emphasized enough",
        "Content density can reduce scanability on smaller screens",
        "Navigation and discovery could be simplified for casual users",
        "Visual hierarchy is weaker than the content quality deserves",
      ],
      recommendations: [
        "Create clearer visual separation between primary sections",
        "Improve heading hierarchy to make scanning easier",
        "Highlight key actions such as search and language selection",
        "Introduce better spacing for dense content blocks",
        "Strengthen mobile readability with a cleaner content rhythm",
      ],
      priorityFix: "Improve readability and visual hierarchy for first-time visitors",
    };
  }

  if (normalized.includes("amazon")) {
    return {
      issues: [
        "Too many competing elements reduce focus on key actions",
        "Product page hierarchy can feel visually crowded",
        "Promotions and secondary content compete with purchase intent",
        "Navigation density may increase cognitive load",
        "Important actions could stand out more clearly",
      ],
      recommendations: [
        "Reduce visual noise around high-value actions",
        "Strengthen product page hierarchy with cleaner spacing",
        "Make purchase-related CTAs more dominant",
        "Group secondary promotional elements more clearly",
        "Improve layout focus for faster decision-making",
      ],
      priorityFix: "Reduce visual clutter around key buying actions",
    };
  }

  if (
    normalized.includes("apple") ||
    normalized.includes("figma") ||
    normalized.includes("stripe") ||
    normalized.includes("notion")
  ) {
    return {
      issues: [
        "Visual design is strong, but some sections may prioritize aesthetics over clarity",
        "Content depth can make decision paths longer than needed",
        "Secondary CTAs may blend in with surrounding content",
        "Certain pages may require more explicit hierarchy for conversion",
        "Long-scroll storytelling can reduce immediate task orientation",
      ],
      recommendations: [
        "Clarify key conversion paths earlier on the page",
        "Use stronger contrast between primary and secondary actions",
        "Shorten decision journeys for first-time visitors",
        "Highlight important information blocks more distinctly",
        "Balance immersive visuals with faster content comprehension",
      ],
      priorityFix: "Make core conversion paths clearer and faster to understand",
    };
  }

  if (
    normalized.includes("dribbble") ||
    normalized.includes("behance") ||
    normalized.includes("awwwards")
  ) {
    return {
      issues: [
        "Strong visuals may come at the cost of usability clarity",
        "Navigation can feel secondary to presentation",
        "Portfolio-style layouts may reduce practical task efficiency",
        "Some call-to-action areas lack sufficient emphasis",
        "Content discovery could be smoother for goal-driven users",
      ],
      recommendations: [
        "Balance visual showcase with clearer navigation cues",
        "Strengthen CTA visibility in key sections",
        "Improve task-oriented hierarchy for browsing flows",
        "Reduce decorative distraction around important actions",
        "Guide users more clearly through content discovery",
      ],
      priorityFix: "Balance visual appeal with clearer user flows",
    };
  }

  if (
    normalized.includes("restaurant") ||
    normalized.includes("cafe") ||
    normalized.includes("food") ||
    normalized.includes("menu")
  ) {
    return {
      issues: [
        "Booking and menu actions may not be prominent enough",
        "Visual hierarchy often does not support quick decision-making",
        "Users may struggle to find essential info like hours and location",
        "Hero sections can be image-heavy but action-light",
        "Mobile usability is often weaker than desktop presentation",
      ],
      recommendations: [
        "Make booking and menu CTAs immediately visible",
        "Bring location, hours, and contact details higher on the page",
        "Use clearer section hierarchy for quick scanning",
        "Reduce visual friction in hero sections",
        "Improve mobile-first layout decisions for faster access",
      ],
      priorityFix: "Make booking, menu, and contact actions instantly visible",
    };
  }

  if (
    normalized.includes("salon") ||
    normalized.includes("spa") ||
    normalized.includes("beauty")
  ) {
    return {
      issues: [
        "Appointment booking is not always visually prioritized",
        "Brand styling may overpower usability in some sections",
        "Service discovery can feel less structured than it should",
        "CTA contrast may be too subtle for high conversion intent",
        "Information hierarchy may not support fast trust-building",
      ],
      recommendations: [
        "Bring booking actions above the fold",
        "Clarify service categories with stronger structure",
        "Use more distinct CTA styling for appointment actions",
        "Improve hierarchy around testimonials and trust signals",
        "Simplify content blocks for easier scanning",
      ],
      priorityFix: "Prioritize appointment booking and trust-building content",
    };
  }

  if (
    normalized.includes("portfolio") ||
    normalized.includes("agency") ||
    normalized.includes("studio")
  ) {
    return {
      issues: [
        "Strong visuals may not clearly communicate services fast enough",
        "Case studies can lack clear decision-oriented structure",
        "Navigation may focus more on style than user goals",
        "Primary conversion actions may not stand out enough",
        "Messaging can be too broad instead of outcome-focused",
      ],
      recommendations: [
        "Clarify service value proposition earlier on the page",
        "Use stronger CTA emphasis for inquiries or booking",
        "Structure case studies around problem, approach, and result",
        "Reduce ambiguity in section messaging",
        "Guide users more clearly toward the next action",
      ],
      priorityFix: "Make the value proposition and primary CTA clearer",
    };
  }

  return getGenericReport(url);
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-yellow-500";
  return "text-red-500";
}

function getScoreBar(score: number) {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-yellow-500";
  return "bg-red-500";
}

function getOverallScore(scores: Scores) {
  return Math.round(
    (scores.performance + scores.accessibility + scores.seo + scores.design) / 4
  );
}

function getOverallLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs work";
}

export default function ReportPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  const screenshotUrl = `/api/screenshot?url=${encodeURIComponent(url)}`;
  const scores = generateScoresFromUrl(url);
  const report = getWebsiteReport(url);
  const overallScore = getOverallScore(scores);

  const scoreItems = [
    { label: "Performance", value: scores.performance },
    { label: "Accessibility", value: scores.accessibility },
    { label: "SEO", value: scores.seo },
    { label: "Design", value: scores.design },
  ];

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

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h2 className="mb-2 text-5xl font-bold tracking-tight">Audit Report</h2>
          <p className="text-lg text-gray-600">
            Website analyzed:{" "}
            <span className="font-semibold text-gray-900">
              {url || "No URL provided"}
            </span>
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="mb-2 text-sm font-medium text-gray-500">Overall Score</p>
            <div className="mb-2 flex items-end gap-3">
              <span className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {getOverallLabel(overallScore)}
              </span>
            </div>
            <p className="text-gray-600">
              {overallScore >= 85
                ? "Strong foundation with only minor improvements needed."
                : overallScore >= 70
                ? "Good foundation, but needs UX refinement."
                : "Needs stronger usability, hierarchy, and clarity."}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="mb-2 text-sm font-medium text-gray-500">Top Priority Fix</p>
            <p className="text-2xl font-semibold leading-snug text-gray-900">
              {report.priorityFix}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="mb-2 text-sm font-medium text-gray-500">Analyzed URL</p>
            <p className="break-all text-2xl font-semibold text-gray-900">{url}</p>
          </div>
        </div>

        <div className="mb-10 rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-2xl font-semibold">Website Screenshot</h3>

          {url ? (
            <img
              src={screenshotUrl}
              alt="Website screenshot preview"
              className="w-full rounded-xl border"
            />
          ) : (
            <p className="text-gray-500">No website URL entered.</p>
          )}
        </div>

        <div className="mb-10">
          <h3 className="mb-5 text-2xl font-semibold">Audit Scores</h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {scoreItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  <p className={`text-3xl font-bold ${getScoreColor(item.value)}`}>
                    {item.value}
                  </p>
                </div>

                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-3 rounded-full ${getScoreBar(item.value)}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-2xl font-semibold">Issues Found</h3>
            <div className="space-y-4">
              {report.issues.map((issue, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-red-100 bg-red-50 p-4"
                >
                  <p className="font-medium text-gray-800">{issue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-2xl font-semibold">Redesign Recommendations</h3>
            <div className="space-y-4">
              {report.recommendations.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-blue-100 bg-blue-50 p-4"
                >
                  <p className="font-medium text-gray-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}