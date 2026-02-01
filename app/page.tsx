import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Social Capital</h1>
        <p className="text-base text-slate-600">
          Choose your path to start lending or borrowing.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          href="/lend"
        >
          Lend
        </Link>
        <Link
          className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
          href="/borrow"
        >
          Borrow
        </Link>
      </div>
    </section>
  );
}
