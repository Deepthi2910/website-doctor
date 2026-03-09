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

      <section className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="mb-4 text-4xl font-bold">About Website Doctor</h2>
        <p className="mb-6 text-lg text-gray-700">
          Website Doctor is a web app concept built to analyze websites, surface UX and
          design issues, and suggest redesign improvements.
        </p>

        <p className="mb-6 text-gray-700">
          This project is designed to showcase frontend development, backend integration,
          UI design thinking, and website redesign strategy.
        </p>

        <p className="text-gray-700">
          The long-term goal is to evolve it into a complete UX audit and redesign
          platform with smarter scoring, real case studies, and polished reports.
        </p>
      </section>
    </main>
  );
}