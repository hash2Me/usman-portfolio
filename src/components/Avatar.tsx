import { useEffect, useRef, useState, useCallback } from 'react';
import AvatarCharacter from './AvatarCharacter';

type CharacterState = 'idle' | 'walking' | 'jumping' | 'falling' | 'phone' | 'waving' | 'dancing' | 'typing' | 'thinking' | 'dragged' | 'listening' | 'talking' | 'sitting';
type Direction = 'left' | 'right';

// ── Constants ──────────────────────────────────────────────────────────────────

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const POKE_REACTIONS = [
  'Hey!', 'Stop that.', "I'm working here.", 'Quit poking me.',
  '...', 'Again?', 'Do you mind?', "I'll fall off!",
  'Rude.', 'OK fine.', 'What?', 'Cut it out.',
];

const SECTION_SPEECH: Record<string, string[]> = {
  hero: ['Scroll down to explore.', 'Engineered from scratch.'],
  projects: ['Inspecting project architecture.', 'Check the technical depth.'],
  experience: ['Reviewing work history.', 'Production code, daily.'],
  skills: ['Skill matrix loaded.', 'C++ algorithms + React.'],
  education: ['CS fundamentals.', 'Theory applied to real software.'],
  contact: ['Ready to build something?', "Let's connect."],
};

const POKE_STORAGE_KEY = 'avatar-poke-count';

// ── Helpers ────────────────────────────────────────────────────────────────────

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "Good morning. Coffee's ready.";
  if (h >= 12 && h < 17) return 'Good afternoon. Welcome.';
  if (h >= 17 && h < 21) return 'Good evening. Still coding.';
  return 'Working late. Welcome.';
}

function getSectionIdleState(sectionId: string): CharacterState {
  switch (sectionId) {
    case 'projects': return 'typing';
    case 'experience': return 'phone';
    case 'skills': return 'thinking';
    case 'education': return 'thinking';
    case 'contact': return 'waving';
    default: return 'idle';
  }
}

function getChatbotPerch() {
  const chatWidth = window.innerWidth >= 640 ? 380 : 320;
  const chatRight = window.innerWidth - 24;
  const chatLeft = chatRight - chatWidth;
  const chatTop = window.innerHeight - 24 - 56 - 16 - 450;
  return { x: chatLeft + 15, y: chatTop - 40 };
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Avatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Physics refs
  const posXRef = useRef(120);
  const posYRef = useRef(200);
  const velocityXRef = useRef(0);
  const velocityYRef = useRef(0);
  const dirRef = useRef<Direction>('right');
  const stateRef = useRef<CharacterState>('walking');
  const walkPhaseRef = useRef(0);

  // Platform
  const activeSectionIdRef = useRef('hero');
  const platformBoundsRef = useRef({ left: 40, right: 600, y: 250 });

  // Cursor
  const cursorXRef = useRef(0);

  // Drag
  const isDraggingRef = useRef(false);
  const wasDraggedRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const mouseHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);

  // Portal
  const isTeleportingRef = useRef(false);
  const teleportTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Konami
  const konamiIndexRef = useRef(0);

  // Poke
  const pokeCountRef = useRef(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Chatbot integration refs ───────────────────────────────────────────────
  const chatbotPhaseRef = useRef<'approaching' | 'hopping-in' | 'active' | 'hopping-out' | null>(null);
  const chatbotAnimRef = useRef<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  const chatbotAnchorRef = useRef({ x: 0, y: 0 });
  const hopStartRef = useRef({ x: 0, y: 0, time: 0 });

  // React state
  const [characterState, setCharacterState] = useState<CharacterState>('walking');
  const [direction, setDirection] = useState<Direction>('right');
  const [walkPhase, setWalkPhase] = useState(0);
  const [cursorOffset, setCursorOffset] = useState(0);
  const [speech, setSpeech] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [characterOpacity, setCharacterOpacity] = useState(1);
  const [portalCoords, setPortalCoords] = useState({ x: 0, y: 0 });
  const [portalVisible, setPortalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inChatbotMode, setInChatbotMode] = useState(false);

  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Speech ─────────────────────────────────────────────────────────────────

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

  // ── Platform bounds ────────────────────────────────────────────────────────

  const updateActiveSection = useCallback(() => {
    const sections = ['hero', 'projects', 'experience', 'skills', 'education', 'contact'];
    const viewportMiddle = window.innerHeight * 0.45;
    let currentId = 'hero';
    let currentEl: HTMLElement | null = null;

    for (const id of sections) {
      const el = document.getElementById(id) || (id === 'hero' ? document.getElementById('main-content') : null);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= 100) { currentId = id; currentEl = el; break; }
      }
    }
    if (!currentEl) currentEl = document.getElementById('hero') || document.body;

    if (currentEl) {
      const rect = currentEl.getBoundingClientRect();
      const cRect = (currentEl.querySelector('.section') || currentEl).getBoundingClientRect();
      const left = Math.max(30, cRect.left + 20);
      const right = Math.min(window.innerWidth - 70, cRect.right - 70);
      const y = Math.min(window.innerHeight - 100, Math.max(120, rect.bottom - 60));
      platformBoundsRef.current = { left, right, y };
    }
    return currentId;
  }, []);

  // ── Teleport ───────────────────────────────────────────────────────────────

  const executePortalTeleport = useCallback((targetSectionId: string) => {
    if (isTeleportingRef.current || isDraggingRef.current || chatbotPhaseRef.current) return;
    isTeleportingRef.current = true;

    setPortalCoords({ x: posXRef.current + (dirRef.current === 'right' ? 30 : -30), y: posYRef.current });
    setPortalVisible(true);
    triggerSpeech('Teleporting...');

    teleportTimerRef.current = setTimeout(() => {
      setCharacterOpacity(0);
      setTimeout(() => {
        setPortalVisible(false);
        activeSectionIdRef.current = targetSectionId;
        const targetEl = document.getElementById(targetSectionId);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          updateActiveSection();
          const { left, right, y } = platformBoundsRef.current;
          const newX = left + (right - left) * 0.3;
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
            velocityXRef.current = 0;
            setTimeout(() => { setPortalVisible(false); triggerSectionSpeech(targetSectionId); }, 350);
          }, 250);
        }, 500);
      }, 400);
    }, 500);
  }, [triggerSpeech, triggerSectionSpeech, updateActiveSection]);

  // ── Interaction handlers ───────────────────────────────────────────────────

  const handleSingleClick = useCallback(() => {
    if (stateRef.current === 'dragged' || stateRef.current === 'dancing' || chatbotPhaseRef.current) return;
    pokeCountRef.current += 1;
    try { localStorage.setItem(POKE_STORAGE_KEY, String(pokeCountRef.current)); } catch { /* noop */ }
    const count = pokeCountRef.current;
    triggerSpeech(count % 5 === 0 ? `Poked ${count} times.` : POKE_REACTIONS[Math.floor(Math.random() * POKE_REACTIONS.length)]);
    if (['walking', 'idle', 'phone', 'typing', 'thinking', 'waving'].includes(stateRef.current)) {
      stateRef.current = 'jumping';
      setCharacterState('jumping');
      velocityYRef.current = -5;
      velocityXRef.current = 0;
    }
  }, [triggerSpeech]);

  const handleDance = useCallback(() => {
    if (stateRef.current === 'dragged' || chatbotPhaseRef.current) return;
    stateRef.current = 'dancing';
    setCharacterState('dancing');
    triggerSpeech('*dances*');
    setTimeout(() => { if (stateRef.current === 'dancing') { stateRef.current = 'walking'; setCharacterState('walking'); } }, 4000);
  }, [triggerSpeech]);

  const handleClick = useCallback(() => {
    if (wasDraggedRef.current) { wasDraggedRef.current = false; return; }
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(handleSingleClick, 220);
  }, [handleSingleClick]);

  const handleDoubleClick = useCallback(() => {
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    handleDance();
  }, [handleDance]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (chatbotPhaseRef.current) return; // no dragging during chatbot mode
    isDraggingRef.current = true;
    wasDraggedRef.current = false;
    dragOffsetRef.current = { x: e.clientX - posXRef.current, y: e.clientY - posYRef.current };
    mouseHistoryRef.current = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
    stateRef.current = 'dragged';
    setCharacterState('dragged');
    e.preventDefault();
  }, []);

  // ── Mobile check ───────────────────────────────────────────────────────────

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Poke count ─────────────────────────────────────────────────────────────

  useEffect(() => {
    try { pokeCountRef.current = parseInt(localStorage.getItem(POKE_STORAGE_KEY) || '0', 10) || 0; } catch { /* noop */ }
  }, []);

  // ── Mouse move + up (drag) ────────────────────────────────────────────────

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorXRef.current = e.clientX;
      if (isDraggingRef.current) {
        wasDraggedRef.current = true;
        posXRef.current = e.clientX - dragOffsetRef.current.x;
        posYRef.current = e.clientY - dragOffsetRef.current.y;
        mouseHistoryRef.current.push({ x: e.clientX, y: e.clientY, t: performance.now() });
        if (mouseHistoryRef.current.length > 6) mouseHistoryRef.current.shift();
      }
    };
    const onUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const hist = mouseHistoryRef.current;
      if (hist.length >= 2) {
        const first = hist[0], last = hist[hist.length - 1];
        const dt = (last.t - first.t) / 1000;
        if (dt > 0.01) {
          velocityXRef.current = ((last.x - first.x) / dt) * 0.15;
          velocityYRef.current = ((last.y - first.y) / dt) * 0.008;
        }
      }
      stateRef.current = 'falling';
      setCharacterState('falling');
      mouseHistoryRef.current = [];
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  // ── Konami code ────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiIndexRef.current]) {
        konamiIndexRef.current += 1;
        if (konamiIndexRef.current === KONAMI_CODE.length) {
          konamiIndexRef.current = 0;
          stateRef.current = 'dancing'; setCharacterState('dancing');
          triggerSpeech('CHEAT CODE ACTIVATED');
          setTimeout(() => { if (stateRef.current === 'dancing') { stateRef.current = 'walking'; setCharacterState('walking'); } }, 5000);
        }
      } else {
        konamiIndexRef.current = e.key === KONAMI_CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [triggerSpeech]);

  // ── Chatbot event listener ─────────────────────────────────────────────────

  useEffect(() => {
    const handle = (e: Event) => {
      const { state } = (e as CustomEvent).detail;

      switch (state) {
        case 'opened': {
          // Cancel any teleport in progress
          if (teleportTimerRef.current) clearTimeout(teleportTimerRef.current);
          isTeleportingRef.current = false;
          setPortalVisible(false);
          setCharacterOpacity(1);

          // Set perch target & start approach
          chatbotAnchorRef.current = getChatbotPerch();
          chatbotPhaseRef.current = 'approaching';
          chatbotAnimRef.current = 'idle';
          setInChatbotMode(true);
          triggerSpeech('On my way!');
          break;
        }
        case 'closed': {
          if (!chatbotPhaseRef.current) break;
          // Hop out
          hopStartRef.current = { x: posXRef.current, y: posYRef.current, time: performance.now() };
          chatbotPhaseRef.current = 'hopping-out';
          stateRef.current = 'jumping';
          setCharacterState('jumping');

          // Update platform for landing
          updateActiveSection();
          break;
        }
        case 'user-typing': {
          if (chatbotPhaseRef.current === 'active') {
            chatbotAnimRef.current = 'listening';
            stateRef.current = 'listening';
            setCharacterState('listening');
          }
          break;
        }
        case 'bot-responding': {
          if (chatbotPhaseRef.current === 'active') {
            chatbotAnimRef.current = 'thinking';
            stateRef.current = 'thinking';
            setCharacterState('thinking');
            triggerSpeech('Hmm, let me think...');
          }
          break;
        }
        case 'bot-done': {
          if (chatbotPhaseRef.current === 'active') {
            chatbotAnimRef.current = 'talking';
            stateRef.current = 'talking';
            setCharacterState('talking');
            triggerSpeech('Here you go.');
            setTimeout(() => {
              if (chatbotPhaseRef.current === 'active' && chatbotAnimRef.current === 'talking') {
                chatbotAnimRef.current = 'idle';
                stateRef.current = 'idle';
                setCharacterState('idle');
              }
            }, 3000);
          }
          break;
        }
        case 'idle': {
          if (chatbotPhaseRef.current === 'active') {
            chatbotAnimRef.current = 'idle';
            stateRef.current = 'idle';
            setCharacterState('idle');
          }
          break;
        }
      }
    };

    window.addEventListener('chatbot-state', handle);
    return () => window.removeEventListener('chatbot-state', handle);
  }, [triggerSpeech, updateActiveSection]);

  // ── Scroll + periodic teleport ─────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      const newSection = updateActiveSection();
      if (!isTeleportingRef.current && !isDraggingRef.current && !chatbotPhaseRef.current && newSection !== activeSectionIdRef.current) {
        activeSectionIdRef.current = newSection;
        executePortalTeleport(newSection);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    updateActiveSection();
    posXRef.current = platformBoundsRef.current.left + 50;
    posYRef.current = platformBoundsRef.current.y;
    triggerSpeech(getTimeGreeting());

    const interval = setInterval(() => {
      if (!isTeleportingRef.current && !isDraggingRef.current && !chatbotPhaseRef.current && Math.random() < 0.5) {
        const sections = ['hero', 'projects', 'experience', 'skills', 'education', 'contact'];
        executePortalTeleport(sections[Math.floor(Math.random() * sections.length)]);
      }
    }, 25000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveSection);
      clearInterval(interval);
      if (teleportTimerRef.current) clearTimeout(teleportTimerRef.current);
    };
  }, [updateActiveSection, executePortalTeleport, triggerSpeech]);

  // ── 60fps game loop ────────────────────────────────────────────────────────

  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const container = containerRef.current;
      if (!container) { animFrameRef.current = requestAnimationFrame(gameLoop); return; }

      const phase = chatbotPhaseRef.current;

      // ═══════════════════════════════════════════════════════════════════════
      // CHATBOT MODE
      // ═══════════════════════════════════════════════════════════════════════
      if (phase) {
        const anchor = chatbotAnchorRef.current;

        if (phase === 'approaching') {
          // Sprint toward the chatbot button area
          const runTargetX = window.innerWidth - 100;
          const dx = runTargetX - posXRef.current;
          const runSpeed = 250;

          walkPhaseRef.current += delta * 16; // fast walk anim

          dirRef.current = dx > 0 ? 'right' : 'left';
          setDirection(dirRef.current);
          stateRef.current = 'walking';
          setCharacterState('walking');

          // Move X toward target
          if (Math.abs(dx) > 30) {
            posXRef.current += Math.sign(dx) * runSpeed * delta;
          } else {
            // Close enough — begin hop arc to perch
            hopStartRef.current = { x: posXRef.current, y: posYRef.current, time: now };
            chatbotAnchorRef.current = getChatbotPerch(); // recalculate in case of resize
            chatbotPhaseRef.current = 'hopping-in';
            stateRef.current = 'jumping';
            setCharacterState('jumping');
            dirRef.current = 'right';
            setDirection('right');
          }

          // Keep Y on current platform while running
          const { y: groundY } = platformBoundsRef.current;
          const yDiff = groundY - posYRef.current;
          if (Math.abs(yDiff) > 1) posYRef.current += yDiff * 0.15;

        } else if (phase === 'hopping-in') {
          // Smooth arc from current position to chatbot perch
          const elapsed = (now - hopStartRef.current.time) / 1000;
          const duration = 0.7;
          const progress = Math.min(1, elapsed / duration);

          const start = hopStartRef.current;
          const end = anchor;
          const peakY = Math.min(start.y, end.y) - 100;

          // Linear X, quadratic bezier Y (arc)
          const eased = 1 - Math.pow(1 - progress, 2);
          posXRef.current = start.x + (end.x - start.x) * eased;
          const t = progress;
          posYRef.current = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * peakY + t * t * end.y;

          walkPhaseRef.current += delta * 4;

          if (progress >= 1) {
            posXRef.current = end.x;
            posYRef.current = end.y;
            chatbotPhaseRef.current = 'active';
            stateRef.current = 'idle';
            setCharacterState('idle');
            dirRef.current = 'left'; // face toward the chat content
            setDirection('left');
            triggerSpeech("I'm here! Ask away.");
          }

        } else if (phase === 'active') {
          // Stay anchored at perch, animate based on chatbot state
          posXRef.current = anchor.x;
          posYRef.current = anchor.y;

          const anim = chatbotAnimRef.current;
          if (anim === 'talking' || anim === 'listening') {
            walkPhaseRef.current += delta * 5;
          } else if (anim === 'thinking') {
            walkPhaseRef.current += delta * 2;
          } else {
            walkPhaseRef.current += delta * 1.5;
          }

        } else if (phase === 'hopping-out') {
          // Arc from perch back toward platform
          const elapsed = (now - hopStartRef.current.time) / 1000;
          const duration = 0.6;
          const progress = Math.min(1, elapsed / duration);

          const start = hopStartRef.current;
          const { left, right, y: groundY } = platformBoundsRef.current;
          const endX = Math.max(left, Math.min(right, start.x - 150));
          const endY = groundY;
          const peakY = Math.min(start.y, endY) - 80;

          const eased = 1 - Math.pow(1 - progress, 2);
          posXRef.current = start.x + (endX - start.x) * eased;
          const t = progress;
          posYRef.current = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * peakY + t * t * endY;

          walkPhaseRef.current += delta * 4;

          if (progress >= 1) {
            posXRef.current = endX;
            posYRef.current = endY;
            chatbotPhaseRef.current = null;
            chatbotAnimRef.current = 'idle';
            setInChatbotMode(false);
            stateRef.current = 'walking';
            setCharacterState('walking');
            dirRef.current = 'left';
            setDirection('left');
            triggerSpeech('Back to work.');
          }
        }

        container.style.transform = `translate3d(${posXRef.current}px, ${posYRef.current}px, 0)`;
        setWalkPhase(walkPhaseRef.current);
        const rawOffset = (cursorXRef.current - posXRef.current - 20) / (window.innerWidth * 0.4);
        setCursorOffset(Math.max(-1, Math.min(1, rawOffset)));
        animFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // NORMAL MODE
      // ═══════════════════════════════════════════════════════════════════════
      const { left, right, y: groundY } = platformBoundsRef.current;

      if (!isTeleportingRef.current && !isDraggingRef.current) {
        const st = stateRef.current;

        if (st === 'falling') {
          posXRef.current += velocityXRef.current * delta;
          velocityXRef.current *= 1 - 3 * delta;
          if (Math.abs(velocityXRef.current) < 0.5) velocityXRef.current = 0;
          posYRef.current += velocityYRef.current * delta * 120;
          velocityYRef.current += 15 * delta;
          if (posXRef.current < left) { posXRef.current = left; velocityXRef.current = Math.abs(velocityXRef.current) * 0.4; }
          if (posXRef.current > right) { posXRef.current = right; velocityXRef.current = -Math.abs(velocityXRef.current) * 0.4; }
          if (posYRef.current >= groundY) {
            posYRef.current = groundY;
            if (Math.abs(velocityYRef.current) > 2.5) { velocityYRef.current *= -0.35; }
            else { velocityYRef.current = 0; velocityXRef.current = 0; stateRef.current = 'walking'; setCharacterState('walking'); isTeleportingRef.current = false; }
          }
        } else if (st === 'jumping') {
          posYRef.current += velocityYRef.current * delta * 60;
          velocityYRef.current += 12 * delta;
          if (velocityYRef.current > 0) { stateRef.current = 'falling'; setCharacterState('falling'); }
        } else if (st === 'dancing') {
          walkPhaseRef.current += delta * 12;
          const yDiff = groundY - posYRef.current;
          if (Math.abs(yDiff) > 1) posYRef.current += yDiff * 0.1; else posYRef.current = groundY;
        } else if (st === 'waving' || st === 'typing' || st === 'thinking' || st === 'idle') {
          walkPhaseRef.current += delta * 3;
          const yDiff = groundY - posYRef.current;
          if (Math.abs(yDiff) > 1) posYRef.current += yDiff * 0.1; else posYRef.current = groundY;
        } else if (st === 'phone') {
          walkPhaseRef.current += delta * 2;
          const yDiff = groundY - posYRef.current;
          if (Math.abs(yDiff) > 1) posYRef.current += yDiff * 0.1; else posYRef.current = groundY;
        } else if (st === 'walking') {
          const walkSpeed = 55;
          walkPhaseRef.current += delta * 9;
          const yDiff = groundY - posYRef.current;
          if (Math.abs(yDiff) > 1) posYRef.current += yDiff * 0.1; else posYRef.current = groundY;

          if (dirRef.current === 'right') {
            posXRef.current += walkSpeed * delta;
            if (posXRef.current >= right) { posXRef.current = right; dirRef.current = 'left'; setDirection('left'); }
          } else {
            posXRef.current -= walkSpeed * delta;
            if (posXRef.current <= left) { posXRef.current = left; dirRef.current = 'right'; setDirection('right'); }
          }

          if (Math.random() < 0.001) {
            const idleState = getSectionIdleState(activeSectionIdRef.current);
            stateRef.current = idleState; setCharacterState(idleState);
            setTimeout(() => { if (stateRef.current === idleState) { stateRef.current = 'walking'; setCharacterState('walking'); } }, 4000);
          }
        }

        container.style.transform = `translate3d(${posXRef.current}px, ${posYRef.current}px, 0)`;
        setWalkPhase(walkPhaseRef.current);
        const rawOffset = (cursorXRef.current - posXRef.current - 20) / (window.innerWidth * 0.4);
        setCursorOffset(Math.max(-1, Math.min(1, rawOffset)));
      }

      // Drag rendering
      if (isDraggingRef.current) {
        walkPhaseRef.current += delta * 2;
        container.style.transform = `translate3d(${posXRef.current}px, ${posYRef.current}px, 0)`;
        setWalkPhase(walkPhaseRef.current);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [triggerSpeech]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isMobile) return null;

  return (
    <>
      {/* Portal */}
      <div
        className="fixed top-0 left-0 z-[100] pointer-events-none transition-all duration-400 ease-out"
        style={{ transform: `translate3d(${portalCoords.x}px, ${portalCoords.y}px, 0)`, opacity: portalVisible ? 1 : 0 }}
      >
        <div className="relative w-14 h-14 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="absolute inset-0 border-[3px] border-black animate-spin" style={{ animationDuration: '1.5s' }} />
          <div className="w-3 h-3 bg-black" />
        </div>
      </div>

      {/* Character container */}
      <div
        ref={containerRef}
        className={`fixed top-0 left-0 pointer-events-none transition-opacity duration-300 ${inChatbotMode ? 'z-[201]' : 'z-[100]'}`}
        style={{ opacity: characterOpacity, willChange: 'transform' }}
      >
        {/* Speech Bubble */}
        <div
          className={`absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-white border-2 border-black text-[10px] text-black font-bold uppercase tracking-wider transition-all duration-300 ${
            showSpeech ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ zIndex: 202 }}
        >
          {speech}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white border-r-2 border-b-2 border-black" />
        </div>

        {/* Ground shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 rounded-full blur-[2px]" />

        {/* Interactive character wrapper */}
        <div
          className="relative cursor-grab active:cursor-grabbing"
          style={{ pointerEvents: chatbotPhaseRef.current ? 'none' : 'auto' }}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
        >
          <AvatarCharacter
            state={characterState}
            direction={direction}
            walkPhase={walkPhase}
            cursorOffsetX={cursorOffset}
          />
        </div>
      </div>
    </>
  );
}
