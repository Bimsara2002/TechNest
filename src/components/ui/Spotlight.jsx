import { useCallback, useRef } from "react";

/**
 * Soft glow that follows the cursor across a dark section.
 *
 * The glow is a separate absolutely positioned layer so the parent's own
 * background and content are untouched, and it fades in on hover so a
 * stationary pointer does not leave a permanent blob on the page.
 */
export default function Spotlight({ className = "", children }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onMove = useCallback((event) => {
    const node = ref.current;
    if (!node) return;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--sx", `${event.clientX - rect.left}px`);
      node.style.setProperty("--sy", `${event.clientY - rect.top}px`);
    });
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} className={`group/spot relative ${className}`}>
      <div
        aria-hidden="true"
        className="spotlight-surface pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      />
      {children}
    </div>
  );
}
