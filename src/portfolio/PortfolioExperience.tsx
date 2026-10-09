import { useEffect, useRef, useState, useCallback } from "react";
import { SceneManager } from "./three/SceneManager";
import { useScrollProgress, useMousePosition, useReducedMotion, useWebGLSupport, useLoadingProgress } from "./hooks/useExperience";
import { useSectionScroll } from "./hooks/useSectionScroll";
import { personalInfo, experiences, personalProjects, skillCategories, education } from "../data/portfolio";
import LoadingScreen from "./components/LoadingScreen";
import Navigation from "./components/Navigation";
import ProfileImage from "./components/ProfileImage";
import WebGLFallback from "./components/WebGLFallback";
import CustomCursor from "./components/CustomCursor";
import PointerGlow from "./components/PointerGlow";
import TiltCard from "./components/TiltCard";


const SCENE_COUNT = 7;

export default function PortfolioExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);


  const { progress, activeScene } = useScrollProgress();
  const mousePos = useMousePosition();
  const reducedMotion = useReducedMotion();
  const webglSupported = useWebGLSupport();
  const { progress: loadingProgress, complete: loadingComplete } = useLoadingProgress();
  const { currentSection, scrollToSection, sectionRefs } = useSectionScroll(SCENE_COUNT, reducedMotion);

  const [introPhase, setIntroPhase] = useState<"loading" | "profile" | "transition" | "complete">("loading");
  const [sceneOpacity, setSceneOpacity] = useState<number[]>(Array(SCENE_COUNT).fill(0));
  const [sceneTransforms, setSceneTransforms] = useState<string[]>(Array(SCENE_COUNT).fill("translateY(40px)"));

  // Initialize Three.js
  useEffect(() => {
    if (!webglSupported || !threeContainerRef.current || reducedMotion) return;

    const manager = new SceneManager(threeContainerRef.current);
    sceneManagerRef.current = manager;
    manager.start();

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, [webglSupported, reducedMotion]);

  // Update Three.js with scroll and mouse
  useEffect(() => {
    if (!sceneManagerRef.current) return;
    sceneManagerRef.current.updateScrollProgress(progress);
    sceneManagerRef.current.updateActiveScene(activeScene);
    sceneManagerRef.current.updateMousePos(mousePos.x, mousePos.y);
  }, [progress, activeScene, mousePos]);

  // Intro is always complete — profile image is permanent in intro section
  useEffect(() => {
    setIntroPhase("complete");
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scene visibility based on current section
  useEffect(() => {
    const newOpacities: number[] = [];
    const newTransforms: string[] = [];

    for (let i = 0; i < SCENE_COUNT; i++) {
      let opacity = 0;
      let transform = "translateY(40px)";

      if (i === currentSection) {
        opacity = 1;
        transform = "translateY(0)";
      } else if (i < currentSection) {
        opacity = 0;
        transform = "translateY(-40px)";
      } else {
        opacity = 0;
        transform = "translateY(40px)";
      }

      newOpacities.push(opacity);
      newTransforms.push(transform);
    }

    setSceneOpacity(newOpacities);
    setSceneTransforms(newTransforms);
  }, [currentSection]);

  const handleNavigate = useCallback((index: number) => {
    scrollToSection(index);
  }, [scrollToSection]);

  // WebGL Fallback
  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return (
    <div ref={containerRef} className="relative bg-void text-ink-50">
      {/* Three.js Background */}
      <div
        ref={threeContainerRef}
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: introPhase === "complete" ? 0.9 : 0 }}
      />

      {/* Pointer glow effects */}
      <PointerGlow />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Loading Screen */}
      <LoadingScreen progress={loadingProgress} complete={loadingComplete} />

      {/* Navigation */}
      <Navigation activeScene={activeScene} onNavigate={handleNavigate} currentSection={currentSection} />

      {/* Progress indicator */}
      <div className="fixed bottom-6 left-6 z-50">
        <span className="text-[10px] font-mono tracking-[0.3em] text-ink-500">
          {String(activeScene + 1).padStart(2, "0")} / {String(SCENE_COUNT).padStart(2, "0")}
        </span>
      </div>

      {/* SCENE 01 - INTRO: Profile image beside name, no space above */}
      <section id="scene-0" ref={(el) => { sectionRefs.current[0] = el; }} className="relative h-screen flex items-start justify-center overflow-hidden pt-24">
        {/* Decorative elements */}
        <div className="absolute top-20 left-8 w-32 h-32 border border-ink-800/30 rotate-12 hidden lg:block" />
        <div className="absolute bottom-32 right-12 w-24 h-24 border border-electric/20 rotate-45 hidden lg:block" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-electric/40 hidden lg:block" />
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-violet/40 hidden lg:block" />
        <div className="absolute top-1/2 left-8 w-px h-32 bg-gradient-to-b from-transparent via-electric/20 to-transparent hidden lg:block" />
        <div className="absolute top-1/2 right-8 w-px h-32 bg-gradient-to-b from-transparent via-violet/20 to-transparent hidden lg:block" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
          <div
            className="transition-all duration-700"
            style={{
              opacity: sceneOpacity[0],
              transform: sceneTransforms[0],
            }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Profile image - permanent, beside name */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-8 rounded-full blur-3xl bg-electric/15" />
                <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-2 border-electric/25 relative">
                  <ProfileImage className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 rounded-full border border-electric/10" />
              </div>

              {/* Name and details */}
              <div className="text-center lg:text-left">
                <div className="mb-3">
                  <p className="text-meta">{personalInfo.location}</p>
                </div>
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.85] mb-4">
                  {personalInfo.name}
                </h2>
                <p className="text-xl sm:text-2xl text-ink-300 font-light tracking-wide mb-4">
                  {personalInfo.title}
                </p>
                <p className="text-ink-400 text-sm max-w-md mb-6">
                  {personalInfo.tagline}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                  {["C#", "ASP.NET", ".NET", "SQL", "API"].map((tech) => (
                    <span key={tech} className="text-meta px-4 py-2 border border-ink-700 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-ink-500 text-xs font-mono">
                  <span className="w-8 h-px bg-ink-700" />
                  <span>Scroll to explore</span>
                  <span className="w-8 h-px bg-ink-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 02 - ABOUT */}
      <section id="scene-1" ref={(el) => { sectionRefs.current[1] = el; }} className="relative h-screen flex items-center">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
          <div
            className="transition-all duration-700"
            style={{
              opacity: sceneOpacity[1],
              transform: sceneTransforms[1],
            }}
          >
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left column - main content */}
              <div className="lg:col-span-7 lg:col-start-1">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-mono text-sm text-electric">02</span>
                  <span className="h-px w-12 bg-electric/40" />
                  <span className="text-meta">ABOUT</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-8">
                  {personalInfo.title} based in Nepal
                </h2>
                <p className="text-lg sm:text-xl text-ink-300 leading-relaxed mb-8 max-w-xl text-justify">
                  {personalInfo.summary}
                </p>

                {/* Areas of focus */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-meta">Areas of Focus</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Backend Development",
                      "RESTful API Design",
                      "Database Management",
                      "Web Application Development",
                    ].map((focus) => (
                      <div key={focus} className="flex items-center gap-3 text-ink-200 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-electric" />
                        {focus}
                      </div>
                    ))}
                  </div>
                </div>


              </div>

              {/* Right column - offset stats */}
              <div className="lg:col-span-4 lg:col-start-9 lg:mt-24">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Location", value: "Kathmandu, Nepal" },
                    { label: "Experience", value: "2024 — Present" },
                    { label: "Focus", value: ".NET Development" },
                    { label: "Education", value: "BCA" },
                  ].map((item, i) => (
                    <TiltCard
                      key={item.label}
                      className={`p-4 border border-ink-800/50 bg-deep/30 ${i % 2 === 1 ? "mt-8" : ""}`}
                      maxTilt={4}
                    >
                      <p className="text-meta mb-1">{item.label}</p>
                      <p className="text-ink-100 text-sm font-medium">{item.value}</p>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 03 - EXPERIENCE */}
      <section id="scene-2" ref={(el) => { sectionRefs.current[2] = el; }} className="relative h-screen flex items-center">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
          <div
            className="transition-all duration-700"
            style={{
              opacity: sceneOpacity[2],
              transform: sceneTransforms[2],
            }}
          >
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-sm text-electric">03</span>
              <span className="h-px w-12 bg-electric/40" />
              <span className="text-meta">EXPERIENCE</span>
            </div>

            {/* Company header */}
            <div className="mb-10">
              <span className="font-mono text-sm text-electric">{experiences[0].period}</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-ink-50 mt-2">{experiences[0].company}</h3>
              <span className="text-ink-500 text-sm">{experiences[0].location}</span>
            </div>

            {/* Projects grid - 3 columns on desktop, equal height */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiences[0].projects.map((project, i) => (
                <TiltCard
                  key={project.name}
                  className="p-5 border border-ink-800/50 bg-deep/30 flex flex-col h-full"
                  maxTilt={5}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="text-lg font-semibold text-ink-100">{project.name}</h4>
                    <span className="font-mono text-[10px] text-ink-600 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-ink-400 text-sm mb-3">{project.description}</p>
                  <div className="mb-3 flex-1">
                    <ul className="space-y-1">
                      {project.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-ink-400 text-xs flex items-start gap-2">
                          <span className="text-electric mt-0.5">—</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-[10px] font-mono bg-ink-800 text-ink-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 04 - TECHNOLOGY */}
      <section id="scene-3" ref={(el) => { sectionRefs.current[3] = el; }} className="relative h-screen flex items-center">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
          <div
            className="transition-all duration-700"
            style={{
              opacity: sceneOpacity[3],
              transform: sceneTransforms[3],
            }}
          >
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left column - skills */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-4 mb-12">
                  <span className="font-mono text-sm text-electric">04</span>
                  <span className="h-px w-12 bg-electric/40" />
                  <span className="text-meta">TECHNOLOGY</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-12">
                  Technologies
                </h2>
                <div className="space-y-8">
                  {skillCategories.map((category) => (
                    <div key={category.id}>
                      <h3 className="text-meta mb-4">{category.title}</h3>
                      <div className="flex flex-wrap gap-3">
                        {category.skills.map((skill) => (
                          <span
                            key={skill.name}
                            className="px-4 py-2 border border-ink-700 bg-deep/30 text-ink-200 text-sm"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column - decorative offset */}
              <div className="lg:col-span-4 lg:col-start-9">
                <div className="lg:sticky lg:top-32 space-y-6">
                  <TiltCard className="p-6 border border-ink-800/50 bg-deep/30" maxTilt={4}>
                    <p className="text-meta mb-2">Primary Stack</p>
                    <p className="text-ink-100 text-lg font-medium">ASP.NET Core</p>
                    <p className="text-ink-100 text-lg font-medium">C#</p>
                    <p className="text-ink-100 text-lg font-medium">SQL Server</p>
                  </TiltCard>
                  <TiltCard className="p-6 border border-ink-800/50 bg-deep/30 mt-8" maxTilt={4}>
                    <p className="text-meta mb-2">Also Working With</p>
                    <p className="text-ink-300 text-sm">Entity Framework</p>
                    <p className="text-ink-300 text-sm">AngularJS</p>
                    <p className="text-ink-300 text-sm">jQuery</p>
                    <p className="text-ink-300 text-sm">Git</p>
                  </TiltCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 05 - PROJECTS */}
      <section id="scene-4" ref={(el) => { sectionRefs.current[4] = el; }} className="relative h-screen flex items-center">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
          <div
            className="transition-all duration-700"
            style={{
              opacity: sceneOpacity[4],
              transform: sceneTransforms[4],
            }}
          >
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-sm text-electric">05</span>
              <span className="h-px w-12 bg-electric/40" />
              <span className="text-meta">PROJECTS</span>
            </div>

            <div className="space-y-12">
              {personalProjects.map((project, i) => (
                <div
                  key={project.name}
                  className={`grid lg:grid-cols-12 gap-6 items-center`}
                >
                  {/* Project number - alternates */}
                  <div className={`lg:col-span-2 ${i % 2 === 1 ? "lg:col-start-11" : "lg:col-start-1"}`}>
                    <span className="font-mono text-6xl text-ink-800 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Project content - alternates */}
                  <div className={`lg:col-span-9 ${i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-4"}`}>
                    <TiltCard className="p-6 border border-ink-800/50 bg-deep/30" maxTilt={6} scale={1.01}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-ink-50 group-hover:text-electric transition-colors">
                          {project.name}
                        </h3>
                      </div>
                      <p className="text-ink-400 text-sm mb-4">{project.description}</p>
                      <div className="mb-4">
                        <p className="text-meta mb-2 text-[10px]">Featured Work</p>
                        <ul className="space-y-1">
                          {project.responsibilities.map((resp, idx) => (
                            <li key={idx} className="text-ink-400 text-xs flex items-start gap-2">
                              <span className="text-electric mt-0.5">—</span>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 text-[10px] font-mono bg-ink-800 text-ink-400">
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-electric text-sm mt-4 hover:text-electric/80 transition-colors"
                        >
                          View Code
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </TiltCard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 06 - EDUCATION */}
      <section id="scene-5" ref={(el) => { sectionRefs.current[5] = el; }} className="relative h-screen flex items-center">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
          <div
            className="transition-all duration-700"
            style={{
              opacity: sceneOpacity[5],
              transform: sceneTransforms[5],
            }}
          >
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left column - decorative */}
              <div className="lg:col-span-4 lg:col-start-1">
                <div className="lg:sticky lg:top-32">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="font-mono text-sm text-electric">06</span>
                    <span className="h-px w-12 bg-electric/40" />
                    <span className="text-meta">EDUCATION</span>
                  </div>
                  <div className="w-32 h-32 border border-ink-800/30 rotate-12" />
                </div>
              </div>

              {/* Right column - education content */}
              <div className="lg:col-span-7 lg:col-start-6">
                <div className="space-y-6">
                  {education.map((edu) => (
                    <TiltCard key={edu.id} className="p-6 border border-ink-800/50 bg-deep/30" maxTilt={4}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-ink-100">{edu.institution}</h3>
                        <span className="px-3 py-1 rounded-full bg-deep border border-ink-800 text-ink-400 text-xs font-mono">
                          {edu.period}
                        </span>
                      </div>
                      <p className="text-ink-400 text-sm mb-1">{edu.degree}</p>
                      {edu.grade && <p className="text-ink-500 text-sm">{edu.grade}</p>}
                    </TiltCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 07 - CONTACT */}
      <section id="scene-6" ref={(el) => { sectionRefs.current[6] = el; }} className="relative h-screen flex items-center justify-center">
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-12">
          <div
            className="transition-all duration-700"
            style={{
              opacity: sceneOpacity[6],
              transform: sceneTransforms[6],
            }}
          >
            <div className="lg:ml-12">
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.9] mb-8">
                LET'S<br />
                <span className="gradient-text">BUILD</span><br />
                SOMETHING
              </h2>
              <p className="text-lg text-ink-300 mb-12 max-w-xl">
                Have a project in mind? Let's talk about how we can work together.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-electric text-void font-semibold text-sm hover:shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-all duration-300"
                >
                  Get in touch
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                {personalInfo.cvPath && (
                  <a
                    href={personalInfo.cvPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-ink-700 text-ink-200 font-medium text-sm hover:border-electric/50 hover:text-electric transition-all duration-300"
                  >
                    Download CV
                  </a>
                )}
                {personalInfo.github && (
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-ink-700 text-ink-200 font-medium text-sm hover:border-electric/50 hover:text-electric transition-all duration-300"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-ink-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-ink-50 mb-1">{personalInfo.name}</p>
              <p className="text-meta">© 2026 — Nepal</p>
            </div>
            <div className="flex gap-6">
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-ink-500 hover:text-electric text-xs font-mono tracking-wider uppercase transition-colors">
                  GitHub
                </a>
              )}
              <a href={`mailto:${personalInfo.email}`} className="text-ink-500 hover:text-electric text-xs font-mono tracking-wider uppercase transition-colors">
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
