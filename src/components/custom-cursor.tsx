"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { readReducedMotionPreference } from "@/lib/local-settings";

const interactiveSelector =
  "a, button, input, select, textarea, summary, [role='button'], [data-cursor-interactive]";

export function CustomCursor() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const trailX = useSpring(pointerX, { stiffness: 115, damping: 24 });
  const trailY = useSpring(pointerY, { stiffness: 115, damping: 24 });
  const enabledRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    function updateAvailability() {
      const userPrefersReducedMotion =
        document.documentElement.dataset.userReducedMotion === "true";
      const shouldEnable =
        finePointer.matches && !reducedMotion.matches && !userPrefersReducedMotion;
      enabledRef.current = shouldEnable;
      setEnabled(shouldEnable);
      document.documentElement.dataset.customCursor = shouldEnable
        ? "active"
        : "inactive";
      if (!shouldEnable) {
        setVisible(false);
        setHovered(false);
        setPressed(false);
      }
    }

    function syncSavedPreference() {
      document.documentElement.dataset.userReducedMotion = String(
        readReducedMotionPreference(),
      );
      updateAvailability();
    }

    function handlePointerMove(event: PointerEvent) {
      if (!enabledRef.current || event.pointerType !== "mouse") {
        return;
      }

      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(true);

      const target = event.target;
      const interactive =
        target instanceof Element && target.closest(interactiveSelector);
      setHovered(Boolean(interactive));
    }

    function handlePointerDown(event: PointerEvent) {
      if (enabledRef.current && event.pointerType === "mouse") {
        setPressed(true);
      }
    }

    function handlePointerUp() {
      setPressed(false);
    }

    function handlePointerLeave() {
      setVisible(false);
      setHovered(false);
      setPressed(false);
    }

    syncSavedPreference();
    finePointer.addEventListener("change", updateAvailability);
    reducedMotion.addEventListener("change", updateAvailability);
    const preferenceObserver = new MutationObserver(updateAvailability);
    preferenceObserver.observe(document.documentElement, {
      attributeFilter: ["data-user-reduced-motion"],
      attributes: true,
    });
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("storage", syncSavedPreference);
    window.addEventListener("blur", handlePointerLeave);
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      finePointer.removeEventListener("change", updateAvailability);
      reducedMotion.removeEventListener("change", updateAvailability);
      preferenceObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("storage", syncSavedPreference);
      window.removeEventListener("blur", handlePointerLeave);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
      delete document.documentElement.dataset.customCursor;
    };
  }, [pointerX, pointerY]);

  if (!enabled) {
    return null;
  }

  return (
    <div aria-hidden="true" className="site-custom-cursor-layer">
      <motion.span
        className="site-custom-cursor-trail"
        data-visible={visible}
        style={{ x: trailX, y: trailY }}
      />
      <motion.span
        animate={{
          scale: pressed ? 0.72 : hovered ? 1.42 : 1,
        }}
        className="site-custom-cursor"
        data-hovered={hovered}
        data-visible={visible}
        style={{ x: pointerX, y: pointerY }}
        transition={{ duration: 0.18, ease: [0.2, 0.75, 0.25, 1] }}
      >
        <span className="site-custom-cursor-dot" />
      </motion.span>
    </div>
  );
}
