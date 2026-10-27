"use client";

import { useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  const observer = new MutationObserver(onChange);
  mediaQuery.addEventListener("change", onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ["data-user-reduced-motion"],
    attributes: true,
  });

  return () => {
    mediaQuery.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function getSnapshot() {
  return (
    window.matchMedia(reducedMotionQuery).matches ||
    document.documentElement.dataset.userReducedMotion === "true"
  );
}

export function useStudioReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
