import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-81px)] items-center overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_40%,rgba(124,58,237,0.18),transparent_48%),radial-gradient(ellipse_at_20%_75%,rgba(0,217,255,0.1),transparent_38%)]"
      />
      <div className="mx-auto w-full max-w-7xl">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#00D9FF]">
          Your imagination, in motion
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-8xl">
          Create Beyond{" "}
          <span className="text-[#FFD91A] [text-shadow:0_0_32px_rgba(255,217,26,0.18)]">
            Reality.
          </span>
        </h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
          Neon Cinema is a creative space for turning your ideas into
          extraordinary visual stories.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            className="rounded-full bg-[#FFD91A] px-6 py-3 text-sm font-semibold text-[#070711] transition-transform hover:scale-[1.02]"
            href="/explore"
          >
            Explore the gallery
          </Link>
          <Link
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/50"
            href="/signup"
          >
            Enter the studio
          </Link>
        </div>
      </div>
    </section>
  );
}
