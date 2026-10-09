import { useEffect, useRef } from "react";

export default function PointerGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const trail = trailRef.current;
    if (!glow || !trail) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let trailX = mouseX;
    let trailY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let rafId: number;
    const animate = () => {
      // Glow follows faster
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;

      // Trail follows slower
      trailX += (mouseX - trailX) * 0.03;
      trailY += (mouseY - trailY) * 0.03;
      trail.style.transform = `translate(${trailX - 200}px, ${trailY - 200}px)`;

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Hide on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Primary glow - follows cursor closely */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 z-[1] pointer-events-none"
        style={{ transform: "translate(-100px, -100px)" }}
      >
        <div
          className="w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Secondary trail - follows with delay */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 z-[1] pointer-events-none"
        style={{ transform: "translate(-100px, -100px)" }}
      >
        <div
          className="w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 60%)",
          }}
        />
      </div>
    </>
  );
}
