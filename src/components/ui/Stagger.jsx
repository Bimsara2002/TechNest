import { Children } from "react";
import Reveal from "./Reveal.jsx";

/**
 * Reveals a list one item at a time rather than all at once, which reads as
 * deliberate instead of a single flash.
 *
 * The delay is capped so a long product grid never leaves the last card
 * waiting seconds to appear.
 */
export default function Stagger({ className = "", step = 60, maxDelay = 400, children }) {
  return (
    <div className={className}>
      {/* h-full so the wrapper does not stop grid items stretching to the
          tallest card in their row. */}
      {Children.map(children, (child, index) => (
        <Reveal className="h-full" delay={Math.min(index * step, maxDelay)}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
