"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type ReactNode,
} from "react";

const portalArtwork =
  "/assets/Futuristic_structure_with_energy%E2%80%A6_2K_20261026191840.jpg";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function getNormalizedPointerPosition(
  coordinate: number,
  start: number,
  length: number,
) {
  return Math.max(0, Math.min(1, (coordinate - start) / length));
}

function subscribeToMotionPreference(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerMotionPreference() {
  return true;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

export function HeroBackdrop() {
  const reducedMotion = usePrefersReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const video = videoRef.current;

    if (video) {
      void video.play().catch(() => setVideoFailed(true));
    }
  }, [reducedMotion]);

  if (reducedMotion && !videoFailed) {
    return (
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          alt=""
          className="absolute inset-0 size-full object-cover"
          fill
          priority
          src={portalArtwork}
        />
        <div className="hero-overlay absolute inset-0" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
      {!reducedMotion && !videoFailed ? (
        <video
          autoPlay
          className="hero-video absolute inset-0 size-full object-cover"
          loop
          muted
          onError={() => setVideoFailed(true)}
          playsInline
          poster={portalArtwork}
          preload="metadata"
          ref={videoRef}
        >
          <source src="/assets/Hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          alt=""
          className="absolute inset-0 size-full object-cover"
          fill
          priority
          sizes="100vw"
          src={portalArtwork}
        />
      )}
      <div className="hero-overlay absolute inset-0" />
    </div>
  );
}

export function ParallaxArtwork() {
  const reducedMotion = usePrefersReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 120, damping: 22, mass: 0.6 });
  const rotateY = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.6 });
  const rawDepthX = useMotionValue(0);
  const rawDepthY = useMotionValue(0);
  const depthX = useSpring(rawDepthX, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  });
  const depthY = useSpring(rawDepthY, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = getNormalizedPointerPosition(
      event.clientX,
      bounds.left,
      bounds.width,
    );
    const vertical = getNormalizedPointerPosition(
      event.clientY,
      bounds.top,
      bounds.height,
    );

    rawX.set((0.5 - vertical) * 5);
    rawY.set((horizontal - 0.5) * 7);
    rawDepthX.set((horizontal - 0.5) * 8);
    rawDepthY.set((vertical - 0.5) * 8);
  }

  function resetPointer() {
    rawX.set(0);
    rawY.set(0);
    rawDepthX.set(0);
    rawDepthY.set(0);
  }

  return (
    <motion.div
      className="hero-visual relative mx-auto w-full max-w-[38rem] [perspective:1200px] lg:ml-auto"
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
      style={
        reducedMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1200 }
      }
    >
      <motion.div
        aria-hidden="true"
        className="hero-orbit absolute -inset-5 rounded-[2rem] border border-[#00D9FF]/15 sm:-inset-7"
        style={reducedMotion ? undefined : { x: depthX, y: depthY }}
      />
      <motion.div
        className="hero-artwork-frame relative aspect-[16/11] overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#101426] shadow-[0_35px_100px_-35px_rgba(0,0,0,0.9)]"
      >
        <Image
          alt="A radiant energy portal surrounded by futuristic architecture"
          className="object-cover object-center"
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 48vw"
          src={portalArtwork}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#070711]/90 via-transparent to-[#070711]/5"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#FFE84A]">
              Curated Flora artwork
            </p>
            <p className="mt-2 text-lg font-medium tracking-tight text-white sm:text-xl">
              Beyond the known
            </p>
          </div>
          <span className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#070711]/40 text-[#FFE84A] backdrop-blur-md">
            <span className="size-2 rounded-full bg-[#FFD91A] shadow-[0_0_14px_#FFC928]" />
          </span>
        </div>
      </motion.div>
      <div
        aria-hidden="true"
        className="hero-light absolute -right-8 -top-9 size-32 rounded-full bg-[#7C3AED]/25 blur-[65px] sm:-right-12 sm:-top-12 sm:size-44"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-5 -left-8 size-28 rounded-full bg-[#00D9FF]/15 blur-[60px]"
      />
    </motion.div>
  );
}

type ArtworkCardProps = {
  alt: string;
  category: string;
  className: string;
  href: string;
  src: string;
  title: string;
  wide?: boolean;
};

export function ArtworkCard({
  alt,
  category,
  className,
  href,
  src,
  title,
  wide = false,
}: ArtworkCardProps) {
  const reducedMotion = usePrefersReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 140, damping: 20 });
  const rotateY = useSpring(rawY, { stiffness: 140, damping: 20 });

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = getNormalizedPointerPosition(
      event.clientX,
      bounds.left,
      bounds.width,
    );
    const vertical = getNormalizedPointerPosition(
      event.clientY,
      bounds.top,
      bounds.height,
    );
    rawX.set((0.5 - vertical) * 5);
    rawY.set((horizontal - 0.5) * 6);
  }

  function resetPointer() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.article
      className="artwork-card [perspective:900px]"
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
      style={
        reducedMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
      whileHover={reducedMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <Link
        aria-label={`${title}, ${category}. View the curated gallery.`}
        className={`artwork-card-link group relative block overflow-hidden rounded-2xl border border-[#292E49] bg-[#101426] ${className}`}
        href={href}
      >
        <Image
          alt={alt}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          fill
          sizes={
            wide
              ? "(max-width: 768px) 92vw, (max-width: 1280px) 86vw, 58vw"
              : "(max-width: 640px) 92vw, (max-width: 1280px) 44vw, 22vw"
          }
          src={src}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#070711]/90 via-[#070711]/5 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-[#FFE84A]">
            {category}
          </p>
          <h3 className="max-w-[25ch] text-lg font-medium leading-snug tracking-tight text-[#F8F7FF] sm:text-xl">
            {title}
          </h3>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl border border-[#FFE84A]/0 transition-colors duration-300 group-hover:border-[#FFE84A]/35"
        />
      </Link>
    </motion.article>
  );
}
