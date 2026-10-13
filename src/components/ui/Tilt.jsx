import { useCallback, useEffect, useRef } from "react";

/**
 * Pointer-tracking 3D tilt.
 *
 * Writes CSS custom properties rather than React state: a mousemove handler
 * that called setState would re-render the whole card on every pixel of
 * movement. The transform itself lives in the `tilt-surface` utility, so the
 * browser can keep it on the compositor.
 *
 * Switches itself off for coarse pointers (there is no hover on a phone, and a
 * tilt that only fires on tap feels broken) and for reduced-motion users.
 */
export default function Tilt({
  max = 9,
  scale = 1.02,
  className = "",
  children,
  ...rest
}) {
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

  const handleMove = useCallback(
    (event) => {
      const node = ref.current;
      if (!node || !enabled.current) return;

      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width; // 0 to 1
        const y = (event.clientY - rect.top) / rect.height;

        node.style.setProperty("--rx", `${(0.5 - y) * 2 * max}deg`);
        node.style.setProperty("--ry", `${(x - 0.5) * 2 * max}deg`);
        node.style.setProperty("--gx", `${x * 100}%`);
        node.style.setProperty("--gy", `${y * 100}%`);
        node.style.setProperty("--tilt-scale", String(scale));
      });
    },
    [max, scale],
  );

  const handleLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;

    cancelAnimationFrame(frame.current);
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
    node.style.setProperty("--tilt-scale", "1");
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-surface ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
