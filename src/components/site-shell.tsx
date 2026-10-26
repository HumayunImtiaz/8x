import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/explore", label: "Explore" },
  { href: "/create/image", label: "Image Studio" },
  { href: "/create/video", label: "Video Studio" },
  { href: "/creations", label: "My Creations" },
];

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[#0B0D19]/85">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-5"
        >
          <Link
            className="text-sm font-bold tracking-[0.22em] text-white"
            href="/"
          >
            NEON <span className="text-[#FFD91A]">CINEMA</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/65">
            {navigation.map((item) => (
              <Link
                className="transition-colors hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="rounded-full border border-[#FFD91A]/50 px-4 py-2 text-[#FFD91A] transition-colors hover:bg-[#FFD91A]/10"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
