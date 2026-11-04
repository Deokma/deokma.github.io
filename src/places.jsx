/* places.jsx — helpers shared by the "places" (workbench, handheld).
   A place is a scene made of layers. Elements with the .layer class move a few pixels with
   the pointer, by their --d (depth) value, so the scene reads as stacked layers.
   Only for a mouse or trackpad, never with reduced motion; one rAF-throttled write of two
   CSS variables per frame, and the layers only animate transform. */
import React from "react";

const DEPTH_MQ = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function useDepth(ref) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia(DEPTH_MQ).matches) return;
    let raf = 0, cx = 0, cy = 0, inside = false;
    const apply = () => {
      raf = 0;
      let x = 0, y = 0;
      if (inside) {
        const r = el.getBoundingClientRect();
        x = Math.max(-1, Math.min(1, ((cx - r.left) / r.width - 0.5) * 2));
        y = Math.max(-1, Math.min(1, ((cy - r.top) / r.height - 0.5) * 2));
      }
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const move = (e) => { cx = e.clientX; cy = e.clientY; inside = true; queue(); };
    const leave = () => { inside = false; queue(); };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);
}

/* Style for a .layer element: depth (px of travel at the scene edge) and resting rotation (deg). */
export const layer = (d, r = 0) => ({ "--d": d, "--r": r + "deg" });
