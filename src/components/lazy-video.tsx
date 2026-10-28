"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

type VideoCandidate = {
  video: HTMLVideoElement;
  src: string;
  visible: boolean;
  autoPlay: boolean;
  priority: boolean;
};

const candidates = new Map<HTMLVideoElement, VideoCandidate>();
let activeCandidate: VideoCandidate | null = null;

function releaseActiveCandidate() {
  if (!activeCandidate) return;

  activeCandidate.video.autoplay = false;
  activeCandidate.video.pause();
  activeCandidate.video.removeAttribute("src");
  activeCandidate.video.load();
  activeCandidate = null;
}

function syncActiveCandidate() {
  const visibleCandidates = [...candidates.values()].filter(
    (candidate) => candidate.visible,
  );
  const priorityCandidate = visibleCandidates.find(
    (candidate) => candidate.priority,
  );
  const nextCandidate =
    priorityCandidate ??
    (activeCandidate?.visible ? activeCandidate : visibleCandidates[0]);

  if (nextCandidate === activeCandidate) return;

  releaseActiveCandidate();
  if (!nextCandidate) return;

  activeCandidate = nextCandidate;
  nextCandidate.video.autoplay = nextCandidate.autoPlay;
  nextCandidate.video.preload = "metadata";
  nextCandidate.video.src = nextCandidate.src;
}

type LazyVideoProps = Omit<
  ComponentPropsWithoutRef<"video">,
  "autoPlay" | "preload" | "src"
> & {
  autoPlay?: boolean;
  priority?: boolean;
  src: string;
};

export function LazyVideo({
  autoPlay = false,
  muted = true,
  playsInline = true,
  priority = false,
  src,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  ...props
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const candidateRef = useRef<VideoCandidate | null>(null);
  const pointerInsideRef = useRef(false);
  const focusedRef = useRef(false);
  const interactive = Boolean(props.controls);

  function updateCandidatePriority() {
    const candidate = candidateRef.current;
    if (!candidate || !interactive) return;

    candidate.priority =
      priority || pointerInsideRef.current || focusedRef.current;
    syncActiveCandidate();
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const candidate: VideoCandidate = {
      video,
      src,
      visible: false,
      autoPlay,
      priority,
    };
    candidateRef.current = candidate;
    candidates.set(video, candidate);

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              candidate.visible =
                entry.isIntersecting && entry.intersectionRatio >= 0.15;
              syncActiveCandidate();
            },
            { threshold: [0, 0.15] },
          );
    if (observer) {
      observer.observe(video);
    } else {
      candidate.visible = true;
      syncActiveCandidate();
    }

    return () => {
      observer?.disconnect();
      candidates.delete(video);
      if (candidateRef.current === candidate) candidateRef.current = null;
      if (activeCandidate === candidate) releaseActiveCandidate();
      syncActiveCandidate();
    };
  }, [autoPlay, priority, src]);

  return (
    <video
      {...props}
      muted={muted}
      onBlur={(event) => {
        focusedRef.current = false;
        updateCandidatePriority();
        onBlur?.(event);
      }}
      onFocus={(event) => {
        focusedRef.current = true;
        updateCandidatePriority();
        onFocus?.(event);
      }}
      onPointerEnter={(event) => {
        pointerInsideRef.current = true;
        updateCandidatePriority();
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        pointerInsideRef.current = false;
        updateCandidatePriority();
        onPointerLeave?.(event);
      }}
      playsInline={playsInline}
      preload="none"
      ref={videoRef}
    />
  );
}
