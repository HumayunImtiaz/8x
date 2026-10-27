import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Neon Cinema — Create Beyond Reality",
    template: "%s | Neon Cinema",
  },
  description:
    "A cinematic creative studio for imagining and creating beyond reality.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} dark h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
