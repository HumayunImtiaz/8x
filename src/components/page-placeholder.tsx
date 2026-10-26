import Link from "next/link";

type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-7xl flex-col justify-center px-6 py-20">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#00D9FF]">
        Neon Cinema
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
        {description}
      </p>
      <Link
        className="mt-8 w-fit text-sm font-medium text-[#FFD91A] underline decoration-[#FFD91A]/40 underline-offset-4 transition-colors hover:text-white"
        href="/"
      >
        Back to home
      </Link>
    </section>
  );
}
