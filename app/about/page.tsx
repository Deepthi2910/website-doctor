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
        </div>
      </section>
    </main>
  );
}