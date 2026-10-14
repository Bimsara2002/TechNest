import { useCallback, useEffect, useRef } from "react";
import ProductImage from "./ProductImage.jsx";

/**
 * Drag-to-rotate product stage.
 *
 * Rotation is clamped to ±38°: the source is a flat photograph, so spinning it
 * a full turn would just show a mirrored back. A limited tilt reads as holding
 * the product up to the light, which is honest about what the image is.
 *
 * Rotation lives in a ref and is written to a CSS custom property, so dragging
 * never re-renders. Falls back to a static image for reduced motion.
 */
const LIMIT = 38;

export default function Showcase3D({ product }) {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const rotation = useRef(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);
  const frame = useRef(0);
  const enabled = useRef(true);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      enabled.current = !calm.matches;
    };
    sync();
    calm.addEventListener("change", sync);
    return () => {
      calm.removeEventListener("change", sync);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const apply = useCallback(() => {
    const node = cardRef.current;
    if (!node) return;
    node.style.setProperty("--spin", `${rotation.current}deg`);
    // Shadow slides opposite the tilt, which sells the light direction.
    node.style.setProperty("--shadow-shift", `${-rotation.current * 0.6}px`);
  }, []);

  const setRotation = useCallback(
    (value) => {
      rotation.current = Math.max(-LIMIT, Math.min(LIMIT, value));
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(apply);
    },
    [apply],
  );

  const onPointerDown = (event) => {
    if (!enabled.current) return;
    dragging.current = true;
    startX.current = event.clientX;
    startRotation.current = rotation.current;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!enabled.current) return;

    if (dragging.current) {
      setRotation(startRotation.current + (event.clientX - startX.current) * 0.35);
      return;
    }

    // Not dragging: follow the pointer gently across the stage.
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width - 0.5;
    setRotation(ratio * 26);
  };

  const release = () => {
    dragging.current = false;
  };

  const onPointerLeave = () => {
    dragging.current = false;
    setRotation(0);
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={onPointerLeave}
      className="stage-3d relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
    >
      {/* Ambient glow behind the product */}
      <div
        aria-hidden="true"
        className="animate-glow pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl"
      />

      <div
        ref={cardRef}
        className="relative transform-3d transition-transform duration-300 ease-out transform-[rotateY(var(--spin,0deg))]"
      >
        <div className="overflow-hidden rounded-3xl bg-linear-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200">
          <ProductImage
            product={product}
            eager
            className="aspect-square w-full p-8 drop-shadow-[var(--shadow-shift,0px)_18px_26px_rgb(15_23_42_/_0.22)]"
          />
        </div>

        {/* Floor reflection, fading out downward */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-full h-24 scale-y-[-1] overflow-hidden opacity-25 [mask-image:linear-gradient(to_top,transparent,black)]"
        >
          <ProductImage product={product} className="w-full p-8" />
        </div>
      </div>

      <p className="mt-28 text-center text-xs text-slate-400">
        Drag to tilt
      </p>
    </div>
  );
}
