import { useEffect, useRef, useState } from 'react';
import walkingImg from '../assets/avatar/walking.jpg';
import phoneImg from '../assets/avatar/phone.jpg';
import sittingImg from '../assets/avatar/sitting.jpg';

/* ───────────────────────── Types & Constants ───────────────────────── */

type Pose = 'walking' | 'phone' | 'sitting';
type Direction = 'left' | 'right';

const POSE_IMAGES: Record<Pose, string> = {
  walking: walkingImg,
  phone: phoneImg,
  sitting: sittingImg,
};

/** Section-aware speech lines — avatar says relevant things based on what's nearby */
const SECTION_SPEECH: Record<string, string[]> = {
  hero: [
    "Welcome to my portfolio! ☕",
    "Take your time looking around!",
    "Scroll down for the good stuff!",
    "I built all of this myself 💪",
  ],
  projects: [
    "Check out these projects!",
    "This one's my favorite ↑",
    "Built with blood, sweat & code 💻",
    "Real engineering, real results.",
  ],
  experience: [
    "Here's where I've worked!",
    "Every role taught me something new.",
    "Production code, every single day.",
    "Shipping features since day one 🚀",
  ],
  skills: [
    "These are my tools of the trade 🛠️",
    "C++ is where the magic happens.",
    "React? I dream in JSX.",
    "Always learning something new!",
  ],
  education: [
    "Software Engineering, baby! 🎓",
    "DSA is my bread and butter.",
    "Theory meets practice here.",
    "The foundation of everything.",
  ],
  contact: [
    "Let's connect! Don't be shy 👋",
    "Drop me a message anytime.",
    "I respond fast, promise!",
    "Looking for my next opportunity.",
  ],
};

const IDLE_SPEECH: Record<Pose, string[]> = {
  walking: [
    "Coffee keeps the code flowing ☕",
    "Let me show you around!",
    "Nothing like a good walk & think.",
  ],
  phone: [
    "Just checking my GitHub...",
    "Another PR merged! 🎉",
    "Hmm, interesting article...",
    "Debugging is an art form 🖌️",
    "Stack Overflow saves lives 😅",
  ],
  sitting: [
    "Time for a strategy break 💼",
    "CEO mode: activated 😎",
    "Architecture decisions happen here.",
    "Great code needs great planning.",
    "Sometimes you gotta sit & think...",
  ],
};

const STAIR_HEIGHT = 25;
const MAX_STAIR_STEPS = 3;
const AVATAR_SIZE = 64;
const SITTING_WIDTH = 110;
const SITTING_HEIGHT = 72;
const SPEED = 0.8;

/* ────────────────────── Helper: detect visible section ────────────── */

function getVisibleSection(): string {
  const sections = ['hero', 'projects', 'experience', 'skills', 'education', 'contact'];
  const scrollY = window.scrollY + window.innerHeight * 0.7;
  for (let i = sections.length - 1; i >= 0; i--) {
    const id = sections[i];
    const el = document.getElementById(id) || (i === 0 ? document.getElementById('main-content') : null);
    if (el && scrollY >= el.offsetTop) return id;
  }
  return 'hero';
}

/* ────────────────────────── Avatar Component ──────────────────────── */

export default function Avatar() {
  // All mutable animation state lives in refs to avoid re-renders and effect restarts
  const posXRef = useRef(0);
  const posYRef = useRef(0);
  const targetYRef = useRef(0);
  const dirRef = useRef<Direction>('right');
  const stairStepRef = useRef(0);
  const isMovingRef = useRef(true);
  const idleCounterRef = useRef(0);
  const stairCounterRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const poseTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Only these trigger re-renders (for UI changes)
  const [pose, setPose] = useState<Pose>('walking');
  const [direction, setDirection] = useState<Direction>('right');
  const [speech, setSpeech] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // ── Speech bubble ──
  const showSpeechBubble = (text: string) => {
    setSpeech(text);
    setShowSpeech(true);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => setShowSpeech(false), 4500);
  };

  const showRandomSpeech = (p: Pose) => {
    const section = getVisibleSection();
    // 50% chance to say something section-relevant, 50% idle chatter
    const pool = Math.random() < 0.5 && SECTION_SPEECH[section]
      ? SECTION_SPEECH[section]
      : IDLE_SPEECH[p];
    showSpeechBubble(pool[Math.floor(Math.random() * pool.length)]);
  };

  // ── Idle system ──
  const goIdle = () => {
    const idlePoses: Pose[] = ['phone', 'sitting'];
    const newPose = idlePoses[Math.floor(Math.random() * idlePoses.length)];
    isMovingRef.current = false;
    setPose(newPose);
    showRandomSpeech(newPose);

    // Resume walking after 5-9 seconds
    if (poseTimeoutRef.current) clearTimeout(poseTimeoutRef.current);
    poseTimeoutRef.current = setTimeout(() => {
      isMovingRef.current = true;
      setPose('walking');
      showRandomSpeech('walking');
    }, 5000 + Math.random() * 4000);
  };

  // ── Main animation loop (runs once, never restarts) ──
  useEffect(() => {
    // Entrance: start off-screen left, become visible after 1.5s
    posXRef.current = -80;
    const introTimer = setTimeout(() => setIsVisible(true), 1500);

    const IDLE_THRESHOLD = 400 + Math.floor(Math.random() * 300);

    const animate = () => {
      const el = containerRef.current;
      if (!el) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const maxX = window.innerWidth - 90;

      // ── Idle check ──
      if (!isMovingRef.current) {
        // Smoothly interpolate Y toward target (for stair transitions)
        const currentY = posYRef.current;
        const diff = targetYRef.current - currentY;
        if (Math.abs(diff) > 0.5) {
          posYRef.current += diff * 0.1;
        }
        el.style.left = `${posXRef.current}px`;
        el.style.bottom = `${20 + posYRef.current}px`;
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      idleCounterRef.current++;
      stairCounterRef.current++;

      // ── Random idle trigger ──
      if (idleCounterRef.current > IDLE_THRESHOLD && Math.random() < 0.004) {
        idleCounterRef.current = 0;
        goIdle();
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // ── Movement ──
      if (dirRef.current === 'right') {
        posXRef.current += SPEED;
        if (posXRef.current >= maxX) {
          dirRef.current = 'left';
          setDirection('left');
        }
      } else {
        posXRef.current -= SPEED;
        if (posXRef.current <= 0) {
          dirRef.current = 'right';
          setDirection('right');
        }
      }

      // ── Stairs ──
      if (stairCounterRef.current > 250 && Math.random() < 0.002) {
        stairCounterRef.current = 0;
        if (stairStepRef.current < MAX_STAIR_STEPS && Math.random() > 0.35) {
          stairStepRef.current++;
        } else if (stairStepRef.current > 0) {
          stairStepRef.current--;
        }
        targetYRef.current = stairStepRef.current * STAIR_HEIGHT;
      }

      // ── Smooth Y interpolation for stair climbing ──
      const currentY = posYRef.current;
      const diff = targetYRef.current - currentY;
      if (Math.abs(diff) > 0.5) {
        posYRef.current += diff * 0.08;
      } else {
        posYRef.current = targetYRef.current;
      }

      // ── Random walking speech ──
      if (Math.random() < 0.0008) {
        showRandomSpeech('walking');
      }

      // ── Apply position directly to DOM (no re-render) ──
      el.style.left = `${posXRef.current}px`;
      el.style.bottom = `${20 + posYRef.current}px`;

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(introTimer);
      cancelAnimationFrame(animFrameRef.current);
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (poseTimeoutRef.current) clearTimeout(poseTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty — runs once, all state is in refs

  if (!isVisible) return null;

  const isSitting = pose === 'sitting';
  const imgW = isSitting ? SITTING_WIDTH : AVATAR_SIZE;
  const imgH = isSitting ? SITTING_HEIGHT : AVATAR_SIZE;

  return (
    <div
      ref={containerRef}
      className={`fixed z-[60] pointer-events-none transition-opacity duration-1000 hidden md:block ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ left: 0, bottom: 20 }}
      aria-hidden="true"
    >
      {/* Speech bubble */}
      <div
        className={`absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-lg text-xs text-white font-medium shadow-lg transition-all duration-400 ${
          showSpeech
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        {speech}
        {/* Tail */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-slate-900/90 border-r border-b border-white/15" />
      </div>

      {/* Ground shadow */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/5 blur-sm"
        style={{ width: isSitting ? 90 : 40, height: 6 }}
      />

      {/* Stair steps */}
      {stairStepRef.current > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center">
          {Array.from({ length: stairStepRef.current }).map((_, i) => (
            <div
              key={i}
              className="bg-white/[0.04] border border-white/[0.08] rounded-sm"
              style={{
                width: 28 + i * 6,
                height: 3,
                marginTop: 1,
              }}
            />
          ))}
        </div>
      )}

      {/* Avatar character */}
      <div
        className="relative"
        style={{
          transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          transition: 'transform 0.15s ease',
        }}
      >
        {/* Walking bobble — gentle 2px bounce */}
        <div
          style={{
            animation: pose === 'walking'
              ? 'avatarBobble 0.4s ease-in-out infinite alternate'
              : 'none',
          }}
        >
          <img
            src={POSE_IMAGES[pose]}
            alt=""
            style={{
              width: imgW,
              height: imgH,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              mixBlendMode: 'screen',
            }}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Walking bobble keyframe (injected once) */}
      <style>{`
        @keyframes avatarBobble {
          0% { transform: translateY(0); }
          100% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
