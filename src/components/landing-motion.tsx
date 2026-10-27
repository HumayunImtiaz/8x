"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  Clapperboard,
  Compass,
  ImagePlus,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useStudioReducedMotion } from "@/lib/use-studio-reduced-motion";

const heroArtwork = "/assets/heroimage.jpg";

function getNormalizedPointerPosition(
  coordinate: number,
  start: number,
  length: number,
) {
  return Math.max(0, Math.min(1, (coordinate - start) / length));
}

function usePrefersReducedMotion() {
  return useStudioReducedMotion();
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

export function HeroCopyMotion({ children }: Readonly<{ children: ReactNode }>) {
  const reducedMotion = usePrefersReducedMotion();
  const [interacting, setInteracting] = useState(false);

  return (
    <div
      className="hero-copy-motion"
      data-interacting={interacting}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setInteracting(false);
        }
      }}
      onFocusCapture={() => setInteracting(true)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && !reducedMotion) {
          setInteracting(true);
        }
      }}
      onPointerLeave={() => setInteracting(false)}
    >
      {children}
    </div>
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
          loading="eager"
          priority
          sizes="100vw"
          src={heroArtwork}
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
          poster={heroArtwork}
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
          loading="eager"
          priority
          sizes="100vw"
          src={heroArtwork}
        />
      )}
      <div className="hero-overlay absolute inset-0" />
    </div>
  );
}

export function ParallaxArtwork() {
  const reducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(pointerX, {
    stiffness: 110,
    damping: 24,
    mass: 0.65,
  });
  const rotateY = useSpring(pointerY, {
    stiffness: 110,
    damping: 24,
    mass: 0.65,
  });

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && !reducedMotion) {
      setRevealed(true);
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || reducedMotion) {
      return;
    }

    setRevealed(true);
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

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

    pointerX.set((0.5 - vertical) * 4);
    pointerY.set((horizontal - 0.5) * 5);
  }

  function handlePointerLeave() {
    setRevealed(false);
    pointerX.set(0);
    pointerY.set(0);
  }

  const showTools = reducedMotion || revealed;

  return (
    <motion.div
      className="hero-visual relative mx-auto w-full max-w-[44rem] [perspective:1200px] lg:ml-auto"
      data-revealed={showTools}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setRevealed(false);
        }
      }}
      onFocusCapture={() => setRevealed(true)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={
        reducedMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1200 }
      }
    >
      <div
        className="hero-tool-stage relative"
        ref={stageRef}
      >
        <svg
          aria-hidden="true"
          className="hero-tool-trails absolute inset-0 size-full overflow-visible"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 600 560"
        >
          <motion.path
            animate={{ pathLength: showTools ? 1 : 0.16, opacity: showTools ? 0.74 : 0.16 }}
            d="M300 280 C246 230 180 190 96 128"
            stroke="#FFD91A"
            strokeDasharray="5 8"
            strokeWidth="1.5"
            transition={{ duration: 0.7, delay: 0.08 }}
          />
          <motion.path
            animate={{ pathLength: showTools ? 1 : 0.16, opacity: showTools ? 0.74 : 0.16 }}
            d="M300 280 C354 230 420 190 504 128"
            stroke="#7C3AED"
            strokeDasharray="5 8"
            strokeWidth="1.5"
            transition={{ duration: 0.7, delay: 0.16 }}
          />
          <motion.path
            animate={{ pathLength: showTools ? 1 : 0.16, opacity: showTools ? 0.74 : 0.16 }}
            d="M300 280 C246 330 180 370 96 432"
            stroke="#E83AFF"
            strokeDasharray="5 8"
            strokeWidth="1.5"
            transition={{ duration: 0.7, delay: 0.24 }}
          />
          <motion.path
            animate={{ pathLength: showTools ? 1 : 0.16, opacity: showTools ? 0.74 : 0.16 }}
            d="M300 280 C354 330 420 370 504 432"
            stroke="#00D9FF"
            strokeDasharray="5 8"
            strokeWidth="1.5"
            transition={{ duration: 0.7, delay: 0.32 }}
          />
          <circle cx="96" cy="128" fill="#FFD91A" r="2" />
          <circle cx="504" cy="128" fill="#7C3AED" r="2" />
          <circle cx="96" cy="432" fill="#E83AFF" r="2" />
          <circle cx="504" cy="432" fill="#00D9FF" r="2" />
        </svg>

        <div aria-hidden="true" className="hero-tool-sparks">
          <span className="hero-spark hero-spark-one" />
          <span className="hero-spark hero-spark-two" />
          <span className="hero-spark hero-spark-three" />
          <span className="hero-spark hero-spark-four" />
          <span className="hero-spark hero-spark-five" />
          <span className="hero-spark hero-spark-six" />
        </div>

        <motion.div
          className="hero-canvas absolute left-1/2 top-1/2 aspect-[16/9] w-[86%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#101426]"
          animate={{ scale: !reducedMotion && revealed ? 1.04 : 1 }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: [0.2, 0.75, 0.25, 1],
          }}
        >
          <motion.div
            animate={
              reducedMotion
                ? { scale: 1, rotateX: 0, rotateY: 0 }
                : revealed
                  ? { scale: 1.09, rotateX: -1.5, rotateY: 2 }
                  : { scale: 1, rotateX: 0, rotateY: 0 }
            }
            className="hero-canvas-art absolute inset-0"
            style={{ transformPerspective: 1000, transformOrigin: "center" }}
            transition={{
              duration: reducedMotion ? 0 : 0.7,
              ease: [0.2, 0.75, 0.25, 1],
            }}
          >
            <Image
              alt="Sample artwork displayed on the Neon Cinema creative canvas"
              className="object-contain object-center"
              fill
              priority
              sizes="(max-width: 1024px) 78vw, 40vw"
              src={heroArtwork}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#070711]/10 via-[#070711]/15 to-[#070711]/80" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 bg-[#070711]/40 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#FFD91A]" />
              <span className="size-1.5 rounded-full bg-[#7C3AED]" />
              <span className="size-1.5 rounded-full bg-[#00D9FF]" />
            </div>
            <span className="text-[0.48rem] font-semibold uppercase tracking-[0.15em] text-white/65 sm:text-[0.56rem]">
              Visual canvas · sample
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 sm:bottom-4 sm:left-4 sm:right-4">
            <div>
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.17em] text-[#FFE84A] sm:text-[0.58rem]">
                Curated Flora artwork
              </p>
              <p className="mt-1 text-[0.66rem] font-medium text-white sm:text-xs">
                Beyond the known
              </p>
            </div>
            <Sparkles
              aria-hidden="true"
              className="mb-0.5 size-4 text-[#FFD91A] drop-shadow-[0_0_8px_#FFC928]"
            />
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="hero-creative-core absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          animate={
            showTools
              ? { scale: 1, boxShadow: "0 0 42px rgba(255,217,26,.34)" }
              : { scale: 0.94, boxShadow: "0 0 22px rgba(255,217,26,.18)" }
          }
          transition={{ duration: 0.45, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <span className="hero-core-ring absolute inset-[-10px] rounded-full border border-[#FFD91A]/55" />
          <span className="hero-core-ring hero-core-ring-inner absolute inset-[7px] rounded-full border border-[#00D9FF]/50" />
          <span className="relative flex size-full flex-col items-center justify-center rounded-full bg-[#070711]/90 text-center backdrop-blur-xl">
            <Sparkles
              aria-hidden="true"
              className="mb-1 size-6 text-[#FFD91A] drop-shadow-[0_0_12px_#FFC928] sm:size-7"
            />
            <span className="text-[0.52rem] font-bold uppercase tracking-[0.12em] text-[#F8F7FF] sm:text-[0.62rem]">
              Create
            </span>
            <span className="mt-0.5 text-[0.42rem] uppercase tracking-[0.14em] text-[#A7A9BD]">
              beyond
            </span>
          </span>
        </motion.div>

        <div className="hero-tool-grid">
          <HeroToolCard
            color="yellow"
            delay={0}
            href="/generate/image"
            icon={<ImagePlus aria-hidden="true" />}
            label="AI Image"
            revealed={showTools}
          />
          <HeroToolCard
            color="violet"
            delay={0.14}
            href="/generate/video"
            icon={<Clapperboard aria-hidden="true" />}
            label="AI Video"
            revealed={showTools}
          />
          <HeroToolCard
            color="magenta"
            delay={0.28}
            href="/generate/image"
            icon={<WandSparkles aria-hidden="true" />}
            label="Creative Effects"
            revealed={showTools}
          />
          <HeroToolCard
            color="cyan"
            delay={0.42}
            href="/explore"
            icon={<Compass aria-hidden="true" />}
            label="Explore Gallery"
            revealed={showTools}
          />
        </div>
        <p className="hero-tool-disclaimer absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.56rem] uppercase tracking-[0.12em] text-[#A7A9BD]">
          Creative tools preview · Demo artwork
        </p>
      </div>
    </motion.div>
  );
}

type HeroToolCardProps = {
  color: "yellow" | "violet" | "magenta" | "cyan";
  delay: number;
  href: string;
  icon: ReactNode;
  label: string;
  revealed: boolean;
};

function HeroToolCard({
  color,
  delay,
  href,
  icon,
  label,
  revealed,
}: HeroToolCardProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerX, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(pointerY, { stiffness: 180, damping: 18 });
  const reducedMotion = usePrefersReducedMotion();
  const tuckedPosition = {
    yellow: { x: 146, y: 116, rotate: -14 },
    violet: { x: -146, y: 116, rotate: 14 },
    magenta: { x: 146, y: -116, rotate: 14 },
    cyan: { x: -146, y: -116, rotate: -14 },
  }[color];

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || reducedMotion) {
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

    pointerX.set((0.5 - vertical) * 10);
    pointerY.set((horizontal - 0.5) * 12);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      className={`hero-tool-slot hero-tool-${color}`}
      initial={false}
      animate={
        revealed
          ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }
          : {
              opacity: 0.03,
              scale: 0.48,
              x: tuckedPosition.x,
              y: tuckedPosition.y,
              rotate: tuckedPosition.rotate,
            }
      }
      transition={{
        duration: reducedMotion ? 0 : 0.76,
        delay: reducedMotion ? 0 : revealed ? delay : 0,
        ease: [0.16, 0.82, 0.22, 1],
      }}
    >
      <motion.div
        animate={
          revealed && !reducedMotion
            ? { y: [0, -9, 0, 7, 0], rotateZ: [0, -1.2, 0, 1.2, 0] }
            : { y: 0 }
        }
        transition={
          revealed && !reducedMotion
            ? {
                duration: 4.2,
                delay: delay + 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : { duration: reducedMotion ? 0 : 0.3 }
        }
      >
        <motion.a
          aria-label={`${label} preview. AI generation is not connected.`}
          className="hero-tool-card group flex items-center gap-3 rounded-2xl border bg-[#0B0D19]/95 px-3.5 py-3 backdrop-blur-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFE84A] sm:gap-3.5 sm:px-4.5 sm:py-4"
          href={href}
          onPointerLeave={resetPointer}
          onPointerMove={handlePointerMove}
          style={
            reducedMotion
              ? undefined
              : { rotateX, rotateY, transformPerspective: 600 }
          }
          whileHover={
            reducedMotion
              ? undefined
              : {
                  scale: 1.16,
                  y: -8,
                  rotateZ: color === "violet" || color === "cyan" ? 2 : -2,
                }
          }
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        >
          <span className="hero-tool-icon flex size-11 shrink-0 items-center justify-center rounded-xl border sm:size-14">
            {icon}
          </span>
          <span className="min-w-0">
            <span className="block whitespace-nowrap text-[0.7rem] font-semibold text-[#F8F7FF] sm:text-sm">
              {label}
            </span>
            <span className="mt-1 block text-[0.53rem] font-medium uppercase tracking-[0.14em] text-[#A7A9BD] sm:text-[0.58rem]">
              Demo preview
            </span>
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="ml-auto size-3.5 shrink-0 text-white/35 transition-colors group-hover:text-current"
          />
        </motion.a>
      </motion.div>
    </motion.div>
  );
}

type ArtworkCardProps = {
  alt: string;
  category: string;
  className: string;
  href: string;
  poster?: string;
  src: string;
  title: string;
  videoSrc?: string;
  wide?: boolean;
};

export function ArtworkCard({
  alt,
  category,
  className,
  href,
  poster,
  src,
  title,
  videoSrc,
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
        {videoSrc ? (
          <video
            aria-label={alt}
            autoPlay
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            loop
            muted
            playsInline
            poster={poster ?? src}
            preload="metadata"
            src={videoSrc}
          />
        ) : (
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
        )}
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
