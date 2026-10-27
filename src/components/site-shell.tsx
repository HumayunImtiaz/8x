import Link from "next/link";
import type { ReactNode } from "react";
import { CustomCursor } from "@/components/custom-cursor";
import { AuthControls } from "@/components/auth-controls";

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen">
      <CustomCursor />
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
          <div className="flex w-full flex-wrap items-center justify-between gap-3 text-xs sm:w-auto sm:flex-nowrap sm:justify-start sm:gap-5 sm:text-sm">
            <Link
              className="whitespace-nowrap rounded-sm text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
              href="/explore"
            >
              Explore
            </Link>
            <Link
              className="whitespace-nowrap rounded-sm text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
              href="/generate/image"
            >
              Image Generator
            </Link>
            <Link
              className="whitespace-nowrap rounded-sm text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
              href="/generate/video"
            >
              Video Generator
            </Link>
            <Link
              className="whitespace-nowrap rounded-sm text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
              href="/creations"
            >
              My Creations
            </Link>
            <Link
              className="whitespace-nowrap rounded-sm text-[#D0D0DE] transition-colors hover:text-[#FFE84A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD91A]"
              href="/settings"
            >
              Settings
            </Link>
            <AuthControls />
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
