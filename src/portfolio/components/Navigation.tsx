import { useState } from "react";

interface NavigationProps {
  onNavigate: (index: number) => void;
  currentSection: number;
}

const scenes = [
  { label: "Intro", number: "01" },
  { label: "About", number: "02" },
  { label: "Experience", number: "03" },
  { label: "Technology", number: "04" },
  { label: "Projects", number: "05" },
  { label: "Education", number: "06" },
  { label: "Contact", number: "07" },
];

export default function Navigation({ onNavigate, currentSection }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (index: number) => {
    onNavigate(index);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 mix-blend-difference">
        {/* Desktop nav */}
        <div className="hidden md:flex justify-end gap-6">
          {scenes.map((scene, i) => (
            <button
              key={scene.label}
              onClick={() => handleNavClick(i)}
              className={`text-[10px] font-mono tracking-widest uppercase transition-colors duration-300 ${
                currentSection === i ? "text-electric" : "text-ink-500 hover:text-ink-100"
              }`}
            >
              {scene.label}
            </button>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden w-6 h-4 relative flex flex-col justify-between"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-full h-px bg-ink-50 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`w-full h-px bg-ink-50 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-void/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-start justify-center h-full px-8 gap-6">
          {scenes.map((scene, i) => (
            <button
              key={scene.label}
              onClick={() => handleNavClick(i)}
              className={`text-2xl font-bold tracking-tight transition-all duration-300 ${
                currentSection === i ? "text-electric" : "text-ink-400"
              }`}
            >
              <span className="text-xs font-mono text-ink-600 mr-3">{scene.number}</span>
              {scene.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
