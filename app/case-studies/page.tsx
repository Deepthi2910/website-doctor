import Link from "next/link";

const studies = [
  {
    title: "Restaurant Website Redesign",
    before: "/case-studies/restaurant-before.png",
    after: "/case-studies/restaurant-after.png",
    problem:
      "The original site felt outdated, had weak hierarchy, and did not guide users clearly toward booking or menu actions.",
    improvements: [
      "Simplified navigation structure",
      "Added prominent 'Reserve a Table' call-to-action",
      "Introduced a 'View Menu' button",
      "Improved visual hierarchy in the hero section",
      "Added clearer spacing between elements",
    ],
    result:
      "The redesign feels more modern, easier to scan, and more conversion-focused.",
  },
  {
    title: "Operation Level Up Website Redesign",
    before: "/case-studies/business-before.png",
    after: "/case-studies/business-after.png",
    problem:
      "The original website contained a cluttered navigation structure and unclear call-to-action messaging. Important actions such as requesting a solar quote or exploring available solutions were not immediately obvious, making the user journey less intuitive.",
    improvements: [
      "Simplified navigation structure",
      "Introduced a clear 'Get Solar Quote' primary call-to-action",
      "Added a secondary 'Explore Solutions' CTA",
      "Improved hero section hierarchy",
      "Reduced visual distractions and improved spacing",
    ],
    result:
      "The redesigned concept improves clarity and guides users toward the primary goal — requesting solar solutions or exploring available services.",
  },
];

export default function CaseStudiesPage() {
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
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Concept UX Redesign Case Studies
        </p>
        <h2 className="mb-4 text-4xl font-bold">Before & After Case Studies</h2>
        <p className="mb-10 max-w-3xl text-gray-600">
          These redesign examples show how design problems can be identified and
          improved through better hierarchy, spacing, usability, and
          conversion-focused decisions.
        </p>

        <div className="space-y-10">
          {studies.map((study, index) => (
            <div
              key={index}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <h3 className="mb-6 text-2xl font-semibold">{study.title}</h3>

              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Before
                  </p>
                  <div className="overflow-hidden rounded-xl border bg-gray-100">
                    <img
                      src={study.before}
                      alt={`${study.title} before redesign`}
                      className="h-[280px] w-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    After
                  </p>
                  <div className="overflow-hidden rounded-xl border bg-gray-100">
                    <img
                      src={study.after}
                      alt={`${study.title} after redesign`}
                      className="h-[280px] w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Problem
                  </p>
                  <p className="text-gray-700">{study.problem}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Improvements
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    {study.improvements.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Result
                  </p>
                  <p className="text-gray-700">{study.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}