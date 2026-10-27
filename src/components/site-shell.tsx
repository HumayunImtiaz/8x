import Link from "next/link";
import type { ReactNode } from "react";

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="site-header relative z-30 border-b border-[#292E49]/80 bg-[#0B0D19]/90 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-4 sm:px-8 lg:px-10"
        >
          <Link
            className="rounded-sm text-[0.72rem] font-bold tracking-[0.24em] text-[#F8F7FF] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
            href="/"
          >
            NEON <span className="text-[#FFD91A]">CINEMA</span>
          </Link>
          <div className="flex w-full items-center justify-between gap-3 text-xs sm:w-auto sm:justify-start sm:gap-5 sm:text-sm">
            <Link
              className="rounded-sm text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
              href="/explore"
            >
              Explore
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                className="rounded-sm px-2 py-2 text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-full border border-[#FFD91A]/60 bg-[#FFD91A] px-4 py-2 font-semibold text-[#070711] shadow-[0_0_22px_rgba(255,201,40,0.12)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-[#FFE84A] hover:shadow-[0_0_28px_rgba(255,201,40,0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFE84A] active:translate-y-0 sm:px-5"
                href="/signup"
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
