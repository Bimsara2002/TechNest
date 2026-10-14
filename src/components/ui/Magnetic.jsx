import { useCallback, useEffect, useRef } from "react";

/**
 * The element drifts toward the cursor as it approaches, then springs back.
 *
 * Kept subtle (a quarter of the cursor offset by default): a control that runs
 * away from the pointer is a nuisance, not a delight. Disabled for coarse
 * pointers and reduced motion, and it only ever writes CSS custom properties,
 * so nothing re-renders.
 */
export default function Magnetic({ strength = 0.25, className = "", children }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const enabled = useRef(true);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      enabled.current = fine.matches && !calm.matches;
    };

    sync();
    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);

    return () => {
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const onMove = useCallback(
    (event) => {
      const node = ref.current;
      if (!node || !enabled.current) return;

      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        node.style.setProperty("--mx", `${dx * strength}px`);
        node.style.setProperty("--my", `${dy * strength}px`);
      });
    },
    [strength],
  );

  const onLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    cancelAnimationFrame(frame.current);
    node.style.setProperty("--mx", "0px");
    node.style.setProperty("--my", "0px");
  }, []);

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-300 ease-out transform-[translate3d(var(--mx,0),var(--my,0),0)] ${className}`}
    >
      {children}
    </span>
  );
}
