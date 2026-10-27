import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Aperture,
  Clapperboard,
  Compass,
  Sparkles,
} from "lucide-react";
import {
  ArtworkCard,
  HeroBackdrop,
  ParallaxArtwork,
  Reveal,
} from "@/components/landing-motion";

const featuredArtwork = [
  {
    src: "/assets/Alien Ocean Planet.png",
    alt: "Violet crystal islands surrounding a glowing ring above an alien ocean",
    title: "The Luminous Divide",
    category: "Curated sample · Environment",
  },
  {
    src: "/assets/Futuristic Megacity Artwork.png",
    alt: "A neon-lit futuristic city at night",
    title: "Afterlight District",
    category: "Curated sample · Cityscape",
  },
  {
    src: "/assets/Futuristic Supercar Scene.png",
    alt: "A futuristic supercar on a rain-slick neon city street",
    title: "Midnight Circuit",
    category: "Curated sample · Motion study",
  },
];

const creativeDirections = [
  {
    icon: Aperture,
    eyebrow: "01 / Still worlds",
    title: "Image Studio",
    description:
      "A focused space for shaping a visual idea, with room for prompts and creative direction.",
    href: "/create/image",
  },
  {
    icon: Clapperboard,
    eyebrow: "02 / Moving worlds",
    title: "Video Studio",
    description:
      "A cinematic workspace concept for developing scenes, atmosphere, and motion.",
    href: "/create/video",
  },
  {
    icon: Compass,
    eyebrow: "03 / Open worlds",
    title: "Explore",
    description:
      "Wander through a curated visual collection and find a new direction for your next idea.",
    href: "/explore",
  },
];

export default function HomePage() {
  return (
    <>
      <section
        aria-labelledby="hero-title"
        className="hero-section relative isolate flex min-h-[calc(100svh-76px)] items-center overflow-hidden"
      >
        <HeroBackdrop />
        <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.95fr] lg:gap-14 lg:px-10 lg:py-28">
          <div className="relative z-10 max-w-2xl">
            <Reveal>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFD91A]/25 bg-[#0B0D19]/55 px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#FFE84A] backdrop-blur-sm sm:text-xs">
                <Sparkles aria-hidden="true" className="size-3.5" />
                A new frame of imagination
              </p>
              <h1
                className="max-w-[12ch] text-[clamp(3.5rem,9vw,7.3rem)] font-semibold leading-[0.91] tracking-[-0.065em] text-[#F8F7FF]"
                id="hero-title"
              >
                Create
                <br />
                Beyond
                <br />
                <span className="hero-title-accent">Reality.</span>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-[#D0D0DE] sm:text-lg sm:leading-8">
                Step into a cinematic creative space where bold ideas find
                their visual direction.
              </p>
              <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row">
                <Link className="button-primary" href="/signup">
                  Enter the studio <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="button-secondary" href="/explore">
                  Explore the worlds
                </Link>
              </div>
              <p className="mt-5 text-xs text-[#A7A9BD]">
                Studio preview · AI generation is not connected yet
              </p>
            </Reveal>
          </div>

          <ParallaxArtwork />
        </div>
        <a
          aria-label="Scroll to the curated worlds section"
          className="hero-scroll-cue absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-[#A7A9BD] transition-colors hover:text-[#FFE84A] lg:flex"
          href="#worlds"
        >
          Scroll to explore <ArrowDown aria-hidden="true" className="size-3.5" />
        </a>
      </section>

      <section
        aria-labelledby="worlds-title"
        className="section-frame px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
        id="worlds"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="section-kicker">Curated visual worlds</p>
              <h2 className="section-title" id="worlds-title">
                Stories in light.
                <br />
                <span className="text-[#A7A9BD]">Worlds without limits.</span>
              </h2>
            </div>
            <Link className="text-link" href="/explore">
              Enter the gallery <ArrowRight aria-hidden="true" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Reveal className="sm:col-span-2 xl:col-span-2">
              <ArtworkCard
                alt="A radiant golden energy core held within futuristic violet and cyan architecture"
                category="Featured sample · Energy architecture"
                className="aspect-[16/10] sm:aspect-[16/9] xl:aspect-[1.48]"
                href="/explore"
                src="/assets/Futuristic_structure_with_energy%E2%80%A6_2K_20261026191840.jpg"
                title="The architecture of possibility"
                wide
              />
            </Reveal>
            {featuredArtwork.map((artwork, index) => (
              <Reveal delay={index * 0.08} key={artwork.src}>
                <ArtworkCard
                  alt={artwork.alt}
                  category={artwork.category}
                  className="aspect-square"
                  href="/explore"
                  src={artwork.src}
                  title={artwork.title}
                />
              </Reveal>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-[#A7A9BD]">
            Curated sample artwork for inspiration. These images are not
            user-generated creations.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="directions-title"
        className="relative overflow-hidden border-y border-[#292E49] bg-[#0B0D19]/80 px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-44 top-0 size-[32rem] rounded-full bg-[#7C3AED]/10 blur-[110px]"
        />
        <div className="relative mx-auto max-w-7xl">
          <Reveal className="mb-12 max-w-2xl md:mb-16">
            <p className="section-kicker">The creative universe</p>
            <h2 className="section-title" id="directions-title">
              One idea.
              <br />
              <span className="text-[#A7A9BD]">Many ways forward.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#A7A9BD] sm:text-base">
              Find a visual spark, explore a new world, or imagine how a scene
              could move. The studios are previews; AI generation is not yet
              connected.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {creativeDirections.map((direction, index) => {
              const Icon = direction.icon;

              return (
                <Reveal delay={index * 0.1} key={direction.title}>
                  <Link
                    className="direction-card group block h-full rounded-2xl border border-[#292E49] bg-[#101426]/75 p-6 transition-colors hover:border-[#FFD91A]/40 sm:p-7"
                    href={direction.href}
                  >
                    <div className="mb-12 flex items-center justify-between">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#A7A9BD]">
                        {direction.eyebrow}
                      </span>
                      <span className="flex size-10 items-center justify-center rounded-xl border border-[#292E49] bg-[#151A30] text-[#FFE84A] transition-colors group-hover:border-[#FFD91A]/40 group-hover:bg-[#FFD91A]/10">
                        <Icon aria-hidden="true" className="size-[18px]" />
                      </span>
                    </div>
                    <h3 className="text-xl font-medium tracking-tight text-[#F8F7FF] sm:text-2xl">
                      {direction.title}
                    </h3>
                    <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-[#A7A9BD]">
                      {direction.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#FFE84A]">
                      Preview direction
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <Reveal className="final-cta relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#FFD91A]/20 px-6 py-16 text-center sm:px-12 sm:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <Image
              alt=""
              className="object-cover object-center opacity-35"
              fill
              sizes="(max-width: 1280px) 92vw, 1280px"
              src="/assets/Futuristic_structure_with_energy%E2%80%A6_2K_20261026191840.jpg"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,17,0.94),rgba(7,7,17,0.72)_52%,rgba(7,7,17,0.9))]"
          />
          <div className="relative">
            <p className="section-kicker">The next scene is yours</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.045em] text-[#F8F7FF] sm:text-6xl">
              Make room for the impossible.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#C3C3D1] sm:text-base">
              Explore the visual worlds and discover the creative space taking
              shape.
            </p>
            <Link className="button-primary mx-auto mt-8" href="/explore">
              Discover Neon Cinema <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-[#292E49] bg-[#070711]/80 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#A7A9BD] sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="w-fit text-xs font-bold tracking-[0.22em] text-[#F8F7FF]"
            href="/"
          >
            NEON <span className="text-[#FFD91A]">CINEMA</span>
          </Link>
          <p>Imagine boldly. Create beyond reality.</p>
          <div className="flex items-center gap-5">
            <Link className="transition-colors hover:text-[#FFE84A]" href="/explore">
              Explore
            </Link>
            <Link className="transition-colors hover:text-[#FFE84A]" href="/login">
              Login
            </Link>
            <Link className="transition-colors hover:text-[#FFE84A]" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
