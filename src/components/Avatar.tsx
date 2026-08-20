import { useEffect, useRef, useState, useCallback } from 'react';
import AvatarCharacter from './AvatarCharacter';

type CharacterState = 'idle' | 'walking' | 'jumping' | 'falling' | 'phone' | 'sitting';
type Direction = 'left' | 'right';
type PortalExitType = 'walk' | 'fall';
type PortalEnterType = 'walk' | 'jump';

const SECTION_SPEECH: Record<string, string[]> = {
  hero: [
    "Welcome to Usman's Portfolio! ☕",
    "Scroll down or let me teleport you around!",
    "Everything here was engineered from scratch 🚀",
    "I'm keeping an eye on the codebase!",
  ],
  projects: [
    "Inspecting project architecture... 💻",
    "Data structures + React = pure magic.",
    "Check out the technical depth on these cards ↑",
    "Robust engineering in action!",
  ],
  experience: [
    "Reviewing work history & impact 📈",
    "Delivering production code every day.",
    "Strong technical execution!",
  ],
  skills: [
    "Skill matrix loaded & verified 🛠️",
    "C++ algorithms + Modern React.",
    "Always leveling up the tech stack!",
  ],
  education: [
    "Computer Science & Systems 🎓",
    "Core CS fundamentals are key.",
    "Theory applied to real-world software.",
  ],
  contact: [
    "Ready to build something awesome? 🤝",
    "Drop an email or phone call!",
    "Available for frontend & full-stack roles.",
  ],
};

export default function Avatar() {
  // Movement & physics state in refs for 60fps performance
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Position & physics
  const posXRef = useRef<number>(100);
  const posYRef = useRef<number>(0); // Y relative to current section platform
  const velocityYRef = useRef<number>(0);
  const dirRef = useRef<Direction>('right');
  const stateRef = useRef<CharacterState>('walking');
  const walkPhaseRef = useRef<number>(0);
  
  // Section platform tracking
  const activeSectionIdRef = useRef<string>('hero');
  const platformBoundsRef = useRef<{ left: number; right: number; y: number }>({ left: 50, right: 800, y: 100 });

  // Portal transition states
  const isTeleportingRef = useRef<boolean>(false);
  const portalPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // React state for rendering UI overlay
  const [characterState, setCharacterState] = useState<CharacterState>('walking');
  const [direction, setDirection] = useState<Direction>('right');
  const [walkPhase, setWalkPhase] = useState<number>(0);
  const [speech, setSpeech] = useState<string>('');
  const [showSpeech, setShowSpeech] = useState<boolean>(false);
  const [portalCoords, setPortalCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [portalScale, setPortalScale] = useState<number>(0);
  const [characterOpacity, setCharacterOpacity] = useState<number>(1);

  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const teleportTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Speech bubble helper
  const triggerSpeech = useCallback((text: string) => {
    setSpeech(text);
    setShowSpeech(true);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => setShowSpeech(false), 4000);
  }, []);

  const triggerSectionSpeech = useCallback((sectionId: string) => {
    const lines = SECTION_SPEECH[sectionId] || SECTION_SPEECH.hero;
    const line = lines[Math.floor(Math.random() * lines.length)];
    triggerSpeech(line);
  }, [triggerSpeech]);

  // Find active section platform in viewport
  const updateActiveSection = useCallback(() => {
    const sections = ['hero', 'projects', 'experience', 'skills', 'education', 'contact'];
    const viewportMiddle = window.scrollY + window.innerHeight * 0.45;
    
    let currentId = 'hero';
    let currentEl: HTMLElement | null = null;

    for (const id of sections) {
      const el = document.getElementById(id) || (id === 'hero' ? document.getElementById('main-content') : null);
      if (el) {
        const rect = el.getBoundingClientRect();
        const topAbs = window.scrollY + rect.top;
        const bottomAbs = topAbs + rect.height;

        if (viewportMiddle >= topAbs && viewportMiddle <= bottomAbs) {
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
      
      const left = Math.max(20, cRect.left + 20);
      const right = Math.min(window.innerWidth - 60, cRect.right - 60);
      const y = window.scrollY + rect.bottom - 40; // platform walk line near section bottom/container

      platformBoundsRef.current = { left, right, y };
    }

    return currentId;
  }, []);

  // Teleport Avatar between sections via Portal
  const executePortalTeleport = useCallback((targetSectionId: string, enterMode: PortalEnterType = 'walk', exitMode: PortalExitType = 'fall') => {
    if (isTeleportingRef.current) return;
    isTeleportingRef.current = true;

    const startX = posXRef.current;
    const startY = posYRef.current;

    // 1. Open entrance portal near character
    portalPosRef.current = { x: startX + (dirRef.current === 'right' ? 40 : -40), y: startY - 10 };
    setPortalCoords(portalPosRef.current);
    setPortalScale(1);

    if (enterMode === 'jump') {
      stateRef.current = 'jumping';
      setCharacterState('jumping');
      velocityYRef.current = -8;
      triggerSpeech("Jumping into the portal! 🌀");
    } else {
      triggerSpeech("Entering portal... 🌀");
    }

    // 2. Character enters portal (disappears)
    teleportTimerRef.current = setTimeout(() => {
      setCharacterOpacity(0);
      setPortalScale(0);

      // 3. Move to new section
      setTimeout(() => {
        activeSectionIdRef.current = targetSectionId;
        const targetEl = document.getElementById(targetSectionId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        updateActiveSection();
        const { left, right, y } = platformBoundsRef.current;
        const newX = left + (right - left) * 0.3;
        
        posXRef.current = newX;
        setDirection('right');
        dirRef.current = 'right';

        if (exitMode === 'fall') {
          // Portal opens high above, character falls down
          const highY = y - 180;
          posYRef.current = highY;
          portalPosRef.current = { x: newX, y: highY + 20 };
          setPortalCoords(portalPosRef.current);
          setPortalScale(1);

          setTimeout(() => {
            setCharacterOpacity(1);
            stateRef.current = 'falling';
            setCharacterState('falling');
            velocityYRef.current = 2; // fall speed

            setTimeout(() => {
              setPortalScale(0);
              triggerSectionSpeech(targetSectionId);
            }, 300);
          }, 300);

        } else {
          // Walk out of portal
          posYRef.current = y;
          portalPosRef.current = { x: newX - 30, y: y - 10 };
          setPortalCoords(portalPosRef.current);
          setPortalScale(1);

          setTimeout(() => {
            setCharacterOpacity(1);
            stateRef.current = 'walking';
            setCharacterState('walking');

            setTimeout(() => {
              setPortalScale(0);
              isTeleportingRef.current = false;
              triggerSectionSpeech(targetSectionId);
            }, 400);
          }, 300);
        }
      }, 600);
    }, 600);
  }, [triggerSpeech, triggerSectionSpeech, updateActiveSection]);

  // Handle scroll detection and random portal travel
  useEffect(() => {
    const handleScroll = () => {
      if (isTeleportingRef.current) return;
      const newSection = updateActiveSection();
      
      if (newSection !== activeSectionIdRef.current) {
        activeSectionIdRef.current = newSection;
        const enterMode: PortalEnterType = Math.random() > 0.5 ? 'jump' : 'walk';
        const exitMode: PortalExitType = Math.random() > 0.5 ? 'fall' : 'walk';
        executePortalTeleport(newSection, enterMode, exitMode);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection();

    // Occasional portal teleport every 22 seconds if idle
    const portalInterval = setInterval(() => {
      if (!isTeleportingRef.current && Math.random() < 0.6) {
        const sections = ['hero', 'projects', 'experience', 'skills', 'education', 'contact'];
        const nextSec = sections[Math.floor(Math.random() * sections.length)];
        const enterMode: PortalEnterType = Math.random() > 0.5 ? 'jump' : 'walk';
        const exitMode: PortalExitType = Math.random() > 0.5 ? 'fall' : 'walk';
        executePortalTeleport(nextSec, enterMode, exitMode);
      }
    }, 22000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(portalInterval);
      if (teleportTimerRef.current) clearTimeout(teleportTimerRef.current);
    };
  }, [updateActiveSection, executePortalTeleport]);

  // Main 60fps Game Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const container = containerRef.current;
      const { left, right, y: targetGroundY } = platformBoundsRef.current;

      if (container && !isTeleportingRef.current) {
        // 1. Gravity & Fall physics
        if (stateRef.current === 'falling') {
          posYRef.current += velocityYRef.current * delta * 120;
          velocityYRef.current += 15 * delta; // gravity

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
          // Keep character anchored smoothly to platform Y
          const yDiff = targetGroundY - posYRef.current;
          if (Math.abs(yDiff) > 1) {
            posYRef.current += yDiff * 0.1;
          } else {
            posYRef.current = targetGroundY;
          }
        }

        // 2. Horizontal walking on block platform bounds
        if (stateRef.current === 'walking') {
          const walkSpeed = 65; // px per sec
          walkPhaseRef.current += delta * 10;
          
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

          // Random phone/idle pause while walking on platform
          if (Math.random() < 0.0015) {
            stateRef.current = 'phone';
            setCharacterState('phone');
            setTimeout(() => {
              if (stateRef.current === 'phone') {
                stateRef.current = 'walking';
                setCharacterState('walking');
              }
            }, 3500);
          }
        }

        // Update DOM transform directly for zero latency frame rendering
        container.style.transform = `translate3d(${posXRef.current}px, ${posYRef.current}px, 0)`;
        setWalkPhase(walkPhaseRef.current);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Video Game Swirling Portal Component */}
      <div
        className="fixed top-0 left-0 z-[70] pointer-events-none transition-all duration-500 ease-out"
        style={{
          transform: `translate3d(${portalCoords.x}px, ${portalCoords.y}px, 0) scale(${portalScale})`,
          opacity: portalScale > 0 ? 1 : 0,
        }}
      >
        <div className="relative w-16 h-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* Outer glowing vortex ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-white animate-spin blur-sm opacity-80" />
          {/* Inner swirling portal core */}
          <div className="absolute w-12 h-16 rounded-full bg-slate-950 border-2 border-white shadow-[0_0_25px_rgba(255,255,255,0.8)] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-white via-cyan-400 to-purple-900 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Character Game Entity Container */}
      <div
        ref={containerRef}
        className="absolute top-0 left-0 z-[60] pointer-events-none transition-opacity duration-300 hidden md:block"
        style={{
          opacity: characterOpacity,
          willChange: 'transform',
        }}
      >
        {/* Speech Bubble */}
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-xl bg-slate-900/95 border border-white/20 backdrop-blur-md text-xs text-white font-mono shadow-2xl transition-all duration-300 ${
            showSpeech ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
          }`}
        >
          {speech}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-slate-900/95 border-r border-b border-white/20" />
        </div>

        {/* Character Ground Shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 rounded-full blur-xs" />

        {/* CSS Character Sprite */}
        <AvatarCharacter
          state={characterState}
          direction={direction}
          walkPhase={walkPhase}
        />
      </div>
    </>
  );
}
