import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal that tips the section up out of the page rather than only
 * fading it in.
 *
 * The perspective lives on an outer wrapper and the rotation on the inner
 * element — applying both to one node makes the rotation look like a vertical
 * squash instead of depth.
 *
 * One-shot, like Reveal: re-animating on scroll-up reads as jitter.
 */
export default function Reveal3D({
  delay = 0,
  className = "",
  // Layout classes belong on the outer wrapper: it is the one that becomes the
  // grid/flex item, so `xl:sticky` or `col-span-2` must live there, while the
  // inner element keeps the visual styling it animates with.
  wrapperClassName = "",
  children,
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`stage-3d ${wrapperClassName}`}>
      <div
        style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
        className={`${shown ? "animate-rise-3d" : "opacity-0"} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
