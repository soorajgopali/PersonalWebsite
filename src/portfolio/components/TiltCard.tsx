import { useRef, useState, useCallback, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glowColor?: string;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  scale = 1.02,
  glowColor = "rgba(0,229,255,0.08)",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * maxTilt * 2;
      const rotateY = (x - 0.5) * maxTilt * 2;

      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);
      setGlow({ x: x * 100, y: y * 100, opacity: 1 });
    },
    [maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlow({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      data-hover
      className={`relative transition-transform duration-300 ease-out ${className}`}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: glow.opacity,
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, ${glowColor}, transparent 60%)`,
          borderRadius: "inherit",
        }}
      />
      {children}
    </div>
  );
}
