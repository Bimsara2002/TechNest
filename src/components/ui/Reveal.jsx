import { useEffect, useRef, useState } from "react";

/**
 * Fades a section up the first time it scrolls into view.
 *
 * Deliberately one-shot (it unobserves after firing) so scrolling back up does
 * not re-animate, which reads as jittery. The animation itself is a CSS class,
 * so the reduced-motion rule in index.css neutralises it for free.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children }) {
  const ref = useRef(null);
  // Without IntersectionObserver, start visible rather than hiding the content
  // forever. Decided at init so the effect never sets state synchronously.
  const [shown, setShown] = useState(() => typeof IntersectionObserver === "undefined");

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
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
      className={`${shown ? "animate-fade-up" : "opacity-0"} ${className}`}
    >
      {children}
    </Tag>
  );
}
