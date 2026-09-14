import { useEffect, useRef, useState, useCallback } from 'react';
import AvatarCharacter from './AvatarCharacter';

type CharacterState = 'idle' | 'walking' | 'jumping' | 'falling' | 'phone' | 'sitting';
type Direction = 'left' | 'right';

const SECTION_SPEECH: Record<string, string[]> = {
  hero: [
    "Welcome to Usman's Portfolio.",
    "Scroll down to explore.",
    "Engineered from scratch.",
  ],
  projects: [
    "Inspecting project architecture...",
    "Check out the technical depth.",
    "Robust engineering in action.",
  ],
  experience: [
    "Reviewing work history.",
    "Production code, daily.",
  ],
  skills: [
    "Skill matrix loaded.",
    "C++ algorithms + React.",
  ],
  education: [
    "Computer Science fundamentals.",
    "Theory applied to real-world software.",
  ],
  contact: [
    "Ready to build something?",
    "Let's connect.",
  ],
};

export default function Avatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Physics refs — mutated in rAF, never cause re-renders
  const posXRef = useRef<number>(120);
  const posYRef = useRef<number>(200);
  const velocityYRef = useRef<number>(0);
  const dirRef = useRef<Direction>('right');
  const stateRef = useRef<CharacterState>('walking');
  const walkPhaseRef = useRef<number>(0);

  // Platform tracking
  const activeSectionIdRef = useRef<string>('hero');
  const platformBoundsRef = useRef<{ left: number; right: number; y: number }>({ left: 40, right: 600, y: 250 });

  // Cursor lean — subtle head-tilt toward mouse
  const cursorXRef = useRef<number>(0);

  // Portal
  const isTeleportingRef = useRef<boolean>(false);
  const teleportTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // React state for rendering
  const [characterState, setCharacterState] = useState<CharacterState>('walking');
  const [direction, setDirection] = useState<Direction>('right');
  const [walkPhase, setWalkPhase] = useState<number>(0);
  const [speech, setSpeech] = useState<string>('');
  const [showSpeech, setShowSpeech] = useState<boolean>(false);
  const [characterOpacity, setCharacterOpacity] = useState<number>(1);
  const [portalCoords, setPortalCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [portalVisible, setPortalVisible] = useState<boolean>(false);

  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Hide on mobile (<640px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Speech bubble
  const triggerSpeech = useCallback((text: string) => {
    setSpeech(text);
    setShowSpeech(true);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => setShowSpeech(false), 3500);
  }, []);

  const triggerSectionSpeech = useCallback((sectionId: string) => {
    const lines = SECTION_SPEECH[sectionId] || SECTION_SPEECH.hero;
    triggerSpeech(lines[Math.floor(Math.random() * lines.length)]);
  }, [triggerSpeech]);

  // Platform bounds from viewport
  const updateActiveSection = useCallback(() => {
    const sections = ['hero', 'projects', 'experience', 'skills', 'education', 'contact'];
    const viewportMiddle = window.innerHeight * 0.45;

    let currentId = 'hero';
    let currentEl: HTMLElement | null = null;

    for (const id of sections) {
      const el = document.getElementById(id) || (id === 'hero' ? document.getElementById('main-content') : null);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= 100) {
          currentId = id;
          currentEl = el;
          break;
        }
      }
    }

    if (!currentEl) {
      currentEl = document.getElementById('hero') || document.body;
    }

    if (currentEl) {
      const rect = currentEl.getBoundingClientRect();
      const contentContainer = currentEl.querySelector('.section') || currentEl;
      const cRect = contentContainer.getBoundingClientRect();

      const left = Math.max(30, cRect.left + 20);
      const right = Math.min(window.innerWidth - 70, cRect.right - 70);
      const targetScreenY = Math.min(window.innerHeight - 100, Math.max(120, rect.bottom - 60));

      platformBoundsRef.current = { left, right, y: targetScreenY };
    }

    return currentId;
  }, []);

  // Teleport — clean monochrome portal
  const executePortalTeleport = useCallback((targetSectionId: string) => {
    if (isTeleportingRef.current) return;
    isTeleportingRef.current = true;

    // Show entrance portal
    const startX = posXRef.current;
    const startY = posYRef.current;
    setPortalCoords({ x: startX + (dirRef.current === 'right' ? 30 : -30), y: startY });
    setPortalVisible(true);
    triggerSpeech('Teleporting...');

    // Character disappears
    teleportTimerRef.current = setTimeout(() => {
      setCharacterOpacity(0);

      setTimeout(() => {
        setPortalVisible(false);

        // Scroll to new section
        activeSectionIdRef.current = targetSectionId;
        const targetEl = document.getElementById(targetSectionId);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          updateActiveSection();
          const { left, right, y } = platformBoundsRef.current;
          const newX = left + (right - left) * 0.3;

          // Exit portal at destination
          setPortalCoords({ x: newX, y: Math.max(60, y - 120) });
          setPortalVisible(true);

          posXRef.current = newX;
          posYRef.current = Math.max(60, y - 120);
          dirRef.current = 'right';
          setDirection('right');

          setTimeout(() => {
            setCharacterOpacity(1);
            stateRef.current = 'falling';
            setCharacterState('falling');
            velocityYRef.current = 2;

            setTimeout(() => {
              setPortalVisible(false);
              triggerSectionSpeech(targetSectionId);
            }, 350);
          }, 250);
        }, 500);
      }, 400);
    }, 500);
  }, [triggerSpeech, triggerSectionSpeech, updateActiveSection]);

  // Cursor tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => { cursorXRef.current = e.clientX; };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Scroll + periodic teleport
  useEffect(() => {
    const handleScroll = () => {
      const newSection = updateActiveSection();
      if (!isTeleportingRef.current && newSection !== activeSectionIdRef.current) {
        activeSectionIdRef.current = newSection;
        executePortalTeleport(newSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    // Initial placement
    updateActiveSection();
    posXRef.current = platformBoundsRef.current.left + 50;
    posYRef.current = platformBoundsRef.current.y;
    triggerSpeech("Welcome to Usman's Portfolio.");

    // Periodic teleport every 25s
    const portalInterval = setInterval(() => {
      if (!isTeleportingRef.current && Math.random() < 0.5) {
        const sections = ['hero', 'projects', 'experience', 'skills', 'education', 'contact'];
        executePortalTeleport(sections[Math.floor(Math.random() * sections.length)]);
      }
    }, 25000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveSection);
      clearInterval(portalInterval);
      if (teleportTimerRef.current) clearTimeout(teleportTimerRef.current);
    };
  }, [updateActiveSection, executePortalTeleport, triggerSpeech]);

  // 60fps game loop
  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const container = containerRef.current;
      const { left, right, y: targetGroundY } = platformBoundsRef.current;

      if (container && !isTeleportingRef.current) {
        // Gravity
        if (stateRef.current === 'falling') {
          posYRef.current += velocityYRef.current * delta * 120;
          velocityYRef.current += 15 * delta;
          if (posYRef.current >= targetGroundY) {
            posYRef.current = targetGroundY;
            velocityYRef.current = 0;
            stateRef.current = 'walking';
            setCharacterState('walking');
            isTeleportingRef.current = false;
          }
        } else if (stateRef.current === 'jumping') {
          posYRef.current += velocityYRef.current * delta * 60;
          velocityYRef.current += 12 * delta;
        } else {
          // Smooth anchor to platform
          const yDiff = targetGroundY - posYRef.current;
          if (Math.abs(yDiff) > 1) {
            posYRef.current += yDiff * 0.1;
          } else {
            posYRef.current = targetGroundY;
          }
        }

        // Walk
        if (stateRef.current === 'walking') {
          const walkSpeed = 55;
          walkPhaseRef.current += delta * 9;

          if (dirRef.current === 'right') {
            posXRef.current += walkSpeed * delta;
            if (posXRef.current >= right) {
              posXRef.current = right;
              dirRef.current = 'left';
              setDirection('left');
            }
          } else {
            posXRef.current -= walkSpeed * delta;
            if (posXRef.current <= left) {
              posXRef.current = left;
              dirRef.current = 'right';
              setDirection('right');
            }
          }

          // Occasional phone pause
          if (Math.random() < 0.001) {
            stateRef.current = 'phone';
            setCharacterState('phone');
            setTimeout(() => {
              if (stateRef.current === 'phone') {
                stateRef.current = 'walking';
                setCharacterState('walking');
              }
            }, 4000);
          }
        }

        container.style.transform = `translate3d(${posXRef.current}px, ${posYRef.current}px, 0)`;
        setWalkPhase(walkPhaseRef.current);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Portal — monochrome spinning square */}
      <div
        className="fixed top-0 left-0 z-[100] pointer-events-none transition-all duration-400 ease-out"
        style={{
          transform: `translate3d(${portalCoords.x}px, ${portalCoords.y}px, 0)`,
          opacity: portalVisible ? 1 : 0,
        }}
      >
        <div className="relative w-14 h-14 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* Outer ring */}
          <div
            className="absolute inset-0 border-[3px] border-black animate-spin"
            style={{ animationDuration: '1.5s' }}
          />
          {/* Inner dot */}
          <div className="w-3 h-3 bg-black" />
        </div>
      </div>

      {/* Character container — fixed viewport positioning */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: characterOpacity,
          willChange: 'transform',
        }}
      >
        {/* Speech Bubble — brutalist box */}
        <div
          className={`absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-white border-2 border-black text-[10px] text-black font-bold uppercase tracking-wider transition-all duration-300 ${
            showSpeech ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {speech}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white border-r-2 border-b-2 border-black" />
        </div>

        {/* Ground shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 rounded-full blur-[2px]" />

        {/* Character sprite */}
        <AvatarCharacter
          state={characterState}
          direction={direction}
          walkPhase={walkPhase}
        />
      </div>
    </>
  );
}
