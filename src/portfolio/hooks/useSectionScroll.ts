import { useEffect, useRef, useCallback, useState } from "react";

export function useSectionScroll(sectionCount: number, reducedMotion: boolean) {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionScrollEnabled, setSectionScrollEnabled] = useState(() =>
    window.matchMedia("(min-width: 48rem)").matches
  );
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const lastWheelTime = useRef(0);
  const lastTouchTime = useRef(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollToSection = useCallback(
    (index: number, instant = false) => {
      if (index < 0 || index >= sectionCount) return;
      if (isTransitioning.current && !instant) return;

      const section = sectionRefs.current[index];
      if (!section) return;

      isTransitioning.current = true;
      setCurrentSection(index);

      section.scrollIntoView({
        behavior: instant || reducedMotion ? "auto" : "smooth",
        block: "start",
      });

      // Unlock after transition
      setTimeout(() => {
        isTransitioning.current = false;
      }, reducedMotion ? 50 : 800);
    },
    [sectionCount, reducedMotion]
  );

  const goNext = useCallback(() => {
    if (currentSection < sectionCount - 1) {
      scrollToSection(currentSection + 1);
    }
  }, [currentSection, sectionCount, scrollToSection]);

  const goPrev = useCallback(() => {
    if (currentSection > 0) {
      scrollToSection(currentSection - 1);
    }
  }, [currentSection, scrollToSection]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 48rem)");
    const updateSectionScroll = (event: MediaQueryListEvent) => {
      setSectionScrollEnabled(event.matches);
    };

    mediaQuery.addEventListener("change", updateSectionScroll);
    return () => mediaQuery.removeEventListener("change", updateSectionScroll);
  }, []);

  useEffect(() => {
    if (sectionScrollEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (!visibleSection) return;

        const index = sectionRefs.current.indexOf(visibleSection.target as HTMLElement);
        if (index !== -1) setCurrentSection(index);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sectionCount, sectionScrollEnabled]);

  // Wheel handler
  useEffect(() => {
    if (!sectionScrollEnabled) return;

    const handleWheel = (e: WheelEvent) => {
      const atLastSection = currentSection >= sectionCount - 1;
      const atFirstSection = currentSection <= 0;

      if (e.deltaY > 30 && atLastSection) return;
      if (e.deltaY < -30 && atFirstSection) return;

      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelTime.current < 500) return; // Debounce
      lastWheelTime.current = now;

      if (isTransitioning.current) return;

      if (e.deltaY > 30) {
        goNext();
      } else if (e.deltaY < -30) {
        goPrev();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev, sectionScrollEnabled]);

  // Touch handler
  useEffect(() => {
    if (!sectionScrollEnabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning.current) return;

      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;

      const atLastSection = currentSection >= sectionCount - 1;
      const atFirstSection = currentSection <= 0;

      if (Math.abs(deltaY) <= 50 || Math.abs(deltaY) <= Math.abs(deltaX)) return;
      if (deltaY > 0 && atLastSection) return;
      if (deltaY < 0 && atFirstSection) return;

      const now = Date.now();
      if (now - lastTouchTime.current < 650) return;
      lastTouchTime.current = now;

      if (deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goNext, goPrev, currentSection, sectionCount, sectionScrollEnabled]);

  // Keyboard handler
  useEffect(() => {
    if (!sectionScrollEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning.current) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case " ":
          e.preventDefault();
          goNext();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          scrollToSection(0);
          break;
        case "End":
          e.preventDefault();
          scrollToSection(sectionCount - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, scrollToSection, sectionCount, sectionScrollEnabled]);

  // Set initial section on mount
  useEffect(() => {
    setCurrentSection(0);
    // Scroll to top instantly on load
    window.scrollTo(0, 0);
  }, []);

  return {
    currentSection,
    scrollToSection,
    goNext,
    goPrev,
    sectionRefs,
    isTransitioning,
    sectionScrollEnabled,
  };
}
