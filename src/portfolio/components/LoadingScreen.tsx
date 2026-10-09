import { useEffect, useState } from "react";

interface LoadingScreenProps {
  progress: number;
  complete: boolean;
}

export default function LoadingScreen({ progress, complete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (complete) {
      setFading(true);
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [complete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-void transition-opacity duration-700 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-[min(420px,74vw)] text-center">
        {/* Logo mark */}
        <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-sm border border-ink-700 text-lg font-bold tracking-[0.2em] text-ink-100 opacity-90">
          SG
        </div>

        {/* Japanese-inspired label */}
        <p className="text-xs tracking-[0.5em] text-ink-400 uppercase mb-6 font-mono">
          Initializing
        </p>

        {/* Progress bar */}
        <div className="relative h-px bg-ink-800 overflow-hidden mb-4">
          <div
            className="absolute inset-y-0 left-0 bg-electric transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Meta */}
        <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-ink-500 font-mono">
          <span>Experience</span>
          <span className="text-ink-300 tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
