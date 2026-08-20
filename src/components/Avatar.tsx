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
  const posXRef = useRef(-80);
  const posYRef = useRef(0);
  const targetYRef = useRef(0);
  const dirRef = useRef<Direction>('right');
  const stairStepRef = useRef(0);
  const isMovingRef = useRef(true);
  const idleCounterRef = useRef(0);
  const stairCounterRef = useRef(0);
  const animFrameRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarImgRef = useRef<HTMLDivElement>(null);
  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const poseTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Walk cycle physics
  const walkCycleRef = useRef(0);       // Continuous walk phase (radians)
  const currentSpeedRef = useRef(0);     // Smoothed speed (eases in/out)
  const targetSpeedRef = useRef(0.9);    // Desired speed

  const [pose, setPose] = useState<Pose>('walking');
  const [direction, setDirection] = useState<Direction>('right');
  const [speech, setSpeech] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // ── Speech ──
  const showSpeechBubble = (text: string) => {
    setSpeech(text);
    setShowSpeech(true);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => setShowSpeech(false), 4500);
  };

  const showRandomSpeech = (p: Pose) => {
    const section = getVisibleSection();
    const pool = Math.random() < 0.5 && SECTION_SPEECH[section]
      ? SECTION_SPEECH[section]
      : IDLE_SPEECH[p];
    showSpeechBubble(pool[Math.floor(Math.random() * pool.length)]);
  };

  // ── Idle ──
  const goIdle = () => {
    const idlePoses: Pose[] = ['phone', 'sitting'];
    const newPose = idlePoses[Math.floor(Math.random() * idlePoses.length)];
    isMovingRef.current = false;
    targetSpeedRef.current = 0; // Decelerate to stop
    setPose(newPose);
    showRandomSpeech(newPose);

    if (poseTimeoutRef.current) clearTimeout(poseTimeoutRef.current);
    poseTimeoutRef.current = setTimeout(() => {
      isMovingRef.current = true;
      targetSpeedRef.current = 0.7 + Math.random() * 0.4; // Slightly varied speed
      setPose('walking');
      showRandomSpeech('walking');
    }, 5000 + Math.random() * 4000);
  };

  // ── Main animation loop ──
  useEffect(() => {
    const introTimer = setTimeout(() => setIsVisible(true), 1500);
    const IDLE_THRESHOLD = 400 + Math.floor(Math.random() * 300);

    const animate = () => {
      const el = containerRef.current;
      const avatarEl = avatarImgRef.current;
      if (!el || !avatarEl) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const maxX = window.innerWidth - 90;

      // ── Smooth speed interpolation (ease in/out of movement) ──
      const speedDiff = targetSpeedRef.current - currentSpeedRef.current;
      currentSpeedRef.current += speedDiff * 0.04; // Gentle acceleration/deceleration
      const speed = currentSpeedRef.current;
      const isEffectivelyMoving = Math.abs(speed) > 0.05;

      // ── Walk cycle ──
      if (isEffectivelyMoving) {
        walkCycleRef.current += speed * 0.12; // Walk phase advances with speed
        idleCounterRef.current++;
        stairCounterRef.current++;
      }

      // ── Idle trigger ──
      if (isMovingRef.current && idleCounterRef.current > IDLE_THRESHOLD && Math.random() < 0.004) {
        idleCounterRef.current = 0;
        goIdle();
      }

      // ── X movement ──
      if (isMovingRef.current) {
        if (dirRef.current === 'right') {
          posXRef.current += speed;
          if (posXRef.current >= maxX) {
            dirRef.current = 'left';
            setDirection('left');
          }
        } else {
          posXRef.current -= speed;
          if (posXRef.current <= 0) {
            dirRef.current = 'right';
            setDirection('right');
          }
        }
      }

      // ── Stairs ──
      if (isMovingRef.current && stairCounterRef.current > 250 && Math.random() < 0.002) {
        stairCounterRef.current = 0;
        if (stairStepRef.current < MAX_STAIR_STEPS && Math.random() > 0.35) {
          stairStepRef.current++;
        } else if (stairStepRef.current > 0) {
          stairStepRef.current--;
        }
        targetYRef.current = stairStepRef.current * STAIR_HEIGHT;
      }

      // ── Smooth Y interpolation ──
      const yDiff = targetYRef.current - posYRef.current;
      if (Math.abs(yDiff) > 0.3) {
        posYRef.current += yDiff * 0.06;
      } else {
        posYRef.current = targetYRef.current;
      }

      // ── Natural walk physics applied to avatar image ──
      const phase = walkCycleRef.current;

      // Vertical bob: up-down with each step (sinusoidal)
      const bobY = isEffectivelyMoving ? Math.sin(phase * 2) * 3 : 0;

      // Body lean: slight tilt in walk direction
      const lean = isEffectivelyMoving ? Math.sin(phase) * 1.5 : 0;

      // Shoulder sway: subtle horizontal micro-shift
      const swayX = isEffectivelyMoving ? Math.cos(phase) * 1.2 : 0;

      // Apply natural walk transforms to the avatar image
      avatarEl.style.transform = `translateY(${-bobY}px) translateX(${swayX}px) rotate(${lean}deg)`;

      // ── Random speech ──
      if (isMovingRef.current && Math.random() < 0.0008) {
        showRandomSpeech('walking');
      }

      // ── Apply container position ──
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
  }, []);

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
      style={{ left: -80, bottom: 20 }}
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
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-slate-900/90 border-r border-b border-white/15" />
      </div>

      {/* Ground shadow — moves & stretches with walk cycle */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/[0.04] blur-sm transition-all duration-200"
        style={{ width: isSitting ? 90 : 44, height: 5 }}
      />

      {/* Avatar character wrapper — handles direction flip */}
      <div
        style={{
          transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        {/* Inner wrapper — walk physics applied here via ref */}
        <div ref={avatarImgRef} style={{ transition: pose !== 'walking' ? 'transform 0.4s ease' : 'none' }}>
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
    </div>
  );
}
