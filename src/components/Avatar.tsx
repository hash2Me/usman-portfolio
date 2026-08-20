import { useEffect, useState, useCallback, useRef } from 'react';
import walkingImg from '../assets/avatar/walking.jpg';
import phoneImg from '../assets/avatar/phone.jpg';
import sittingImg from '../assets/avatar/sitting.jpg';

/**
 * Avatar poses and their corresponding images + speech lines
 */
type Pose = 'walking' | 'phone' | 'sitting';

const POSE_IMAGES: Record<Pose, string> = {
  walking: walkingImg,
  phone: phoneImg,
  sitting: sittingImg,
};

/** Speech bubbles the avatar says in each pose */
const SPEECH_LINES: Record<Pose, string[]> = {
  walking: [
    "Welcome to my portfolio! ☕",
    "Take your time browsing around!",
    "I built this with React & Tailwind.",
    "Coffee keeps the code flowing ☕",
    "Let me show you around!",
    "Scroll down for the good stuff!",
  ],
  phone: [
    "Just checking my GitHub notifications...",
    "Another PR merged! 🎉",
    "Reviewing some code real quick...",
    "Hmm, interesting tech article...",
    "Debugging is an art form 🖌️",
    "Stack Overflow saves lives 😅",
  ],
  sitting: [
    "Time for a strategy break 💼",
    "Planning the next big feature...",
    "CEO mode: activated 😎",
    "Sometimes you gotta sit and think...",
    "Architecture decisions happen here.",
    "Great code needs great planning.",
  ],
};

/** Movement directions */
type Direction = 'left' | 'right';

/** Stair step config */
const STAIR_HEIGHT = 30; // px per step
const MAX_STAIR_STEPS = 3;

export default function Avatar() {
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [direction, setDirection] = useState<Direction>('right');
  const [pose, setPose] = useState<Pose>('walking');
  const [speech, setSpeech] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [stairStep, setStairStep] = useState(0);
  const [isMoving, setIsMoving] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const animRef = useRef<number | null>(null);
  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const poseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get viewport width for bounds
  const getMaxX = useCallback(() => {
    return typeof window !== 'undefined' ? window.innerWidth - 90 : 1000;
  }, []);

  // Show a random speech bubble for the current pose
  const showRandomSpeech = useCallback((currentPose: Pose) => {
    const lines = SPEECH_LINES[currentPose];
    const line = lines[Math.floor(Math.random() * lines.length)];
    setSpeech(line);
    setShowSpeech(true);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setShowSpeech(false);
    }, 4000);
  }, []);

  // Switch to a random idle pose (phone or sitting)
  const switchToIdlePose = useCallback(() => {
    const idlePoses: Pose[] = ['phone', 'sitting'];
    const newPose = idlePoses[Math.floor(Math.random() * idlePoses.length)];
    setPose(newPose);
    setIsMoving(false);
    showRandomSpeech(newPose);

    // Stay idle for 5-8 seconds, then resume walking
    if (poseTimeoutRef.current) clearTimeout(poseTimeoutRef.current);
    const idleDuration = 5000 + Math.random() * 3000;
    poseTimeoutRef.current = setTimeout(() => {
      setPose('walking');
      setIsMoving(true);
      showRandomSpeech('walking');
    }, idleDuration);
  }, [showRandomSpeech]);

  // Main movement loop
  useEffect(() => {
    // Delay initial appearance
    const introTimeout = setTimeout(() => setIsVisible(true), 2000);

    const speed = 1.2; // px per frame
    let frameDir: Direction = 'right';
    let frameX = 0;
    let frameY = 0;
    let frameStairStep = 0;
    let frameMoving = true;
    let stairChance = 0;
    let idleCounter = 0;
    const IDLE_THRESHOLD = 300 + Math.floor(Math.random() * 200); // frames before idle

    const animate = () => {
      if (!frameMoving) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const maxX = getMaxX();
      idleCounter++;

      // Randomly go idle
      if (idleCounter > IDLE_THRESHOLD && Math.random() < 0.005) {
        frameMoving = false;
        setIsMoving(false);
        idleCounter = 0;
        switchToIdlePose();
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      // Movement
      if (frameDir === 'right') {
        frameX += speed;
        if (frameX >= maxX) {
          frameDir = 'left';
          setDirection('left');
        }
      } else {
        frameX -= speed;
        if (frameX <= 0) {
          frameDir = 'right';
          setDirection('right');
        }
      }

      // Stairs: randomly go up or down
      stairChance++;
      if (stairChance > 200 && Math.random() < 0.003) {
        stairChance = 0;
        if (frameStairStep < MAX_STAIR_STEPS && Math.random() > 0.4) {
          // Go up
          frameStairStep++;
          frameY = frameStairStep * STAIR_HEIGHT;
          setStairStep(frameStairStep);
        } else if (frameStairStep > 0) {
          // Go down
          frameStairStep--;
          frameY = frameStairStep * STAIR_HEIGHT;
          setStairStep(frameStairStep);
        }
      }

      // Randomly show walking speech
      if (Math.random() < 0.001) {
        showRandomSpeech('walking');
      }

      setPosX(frameX);
      setPosY(frameY);
      animRef.current = requestAnimationFrame(animate);
    };

    // Subscribe to pose changes from idle system
    const syncMoving = setInterval(() => {
      // Re-sync frameMoving with react state (for when idle ends)
      frameMoving = true; // will be overridden by the idle callback
    }, 100);

    // Use a MutationObserver-style trick: watch isMoving via a ref
    // Actually, let's just listen for pose changes
    animRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(introTimeout);
      clearInterval(syncMoving);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (poseTimeoutRef.current) clearTimeout(poseTimeoutRef.current);
    };
  }, [getMaxX, switchToIdlePose, showRandomSpeech]);

  // When pose changes back to walking, update the animation flag
  useEffect(() => {
    if (pose === 'walking') {
      setIsMoving(true);
    }
  }, [pose]);

  if (!isVisible) return null;

  const avatarSize = pose === 'sitting' ? { width: 100, height: 70 } : { width: 70, height: 70 };

  return (
    <div
      className="fixed z-[60] pointer-events-none transition-opacity duration-1000"
      style={{
        left: `${posX}px`,
        bottom: `${20 + posY}px`,
        opacity: isVisible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      {/* Speech bubble */}
      <div
        className={`absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs text-white font-medium transition-all duration-300 ${
          showSpeech ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {speech}
        {/* Speech bubble tail */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white/10 border-r border-b border-white/20" />
      </div>

      {/* Stair steps visualization */}
      {stairStep > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2" aria-hidden="true">
          {Array.from({ length: stairStep }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10"
              style={{
                width: `${30 + i * 8}px`,
                height: '4px',
                marginBottom: '1px',
                marginLeft: `${-i * 4}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Avatar image */}
      <div
        className={`transition-transform duration-200 ${
          isMoving ? 'animate-[float_0.6s_ease-in-out_infinite]' : ''
        }`}
        style={{
          transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        <img
          src={POSE_IMAGES[pose]}
          alt=""
          style={{
            width: avatarSize.width,
            height: avatarSize.height,
            objectFit: 'contain',
            imageRendering: 'pixelated',
          }}
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] rounded-lg"
        />
      </div>
    </div>
  );
}
