"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(QUERY);
  // People toggle this setting precisely when something on screen is
  // bothering them, so react to changes rather than reading it once.
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  // The server cannot know, and guessing "reduce" would strip the animations
  // from the markup for everyone until hydration.
  return false;
}

/**
 * Tracks the OS-level "reduce motion" setting.
 *
 * CSS handles this for ordinary animations, but a WebGL render loop has to opt
 * out in JavaScript: there is no stylesheet that stops requestAnimationFrame.
 *
 * useSyncExternalStore rather than useState + useEffect because matchMedia is
 * exactly the external store this hook exists for, and it keeps the server and
 * client renders consistent without a setState in an effect body.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
