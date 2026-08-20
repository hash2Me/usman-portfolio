/**
 * CSS-drawn pixel-art businessman character.
 * High contrast, responsive scaling, bright white shirt, tie, and drop shadow for maximum visibility.
 */

type CharacterState = 'idle' | 'walking' | 'jumping' | 'falling' | 'phone' | 'sitting';
type Direction = 'left' | 'right';

interface Props {
  state: CharacterState;
  direction: Direction;
  walkPhase: number; // 0 to 2π continuous cycle
}

export default function AvatarCharacter({ state, direction, walkPhase }: Props) {
  const isWalking = state === 'walking';
  const isJumping = state === 'jumping';
  const isFalling = state === 'falling';
  const isPhone = state === 'phone';

  // Walk cycle leg angles (swing from -28° to 28°)
  const leftLegAngle = isWalking ? Math.sin(walkPhase) * 28 : 0;
  const rightLegAngle = isWalking ? Math.sin(walkPhase + Math.PI) * 28 : 0;

  // Arm swing (opposite to legs)
  const leftArmAngle = isWalking ? Math.sin(walkPhase + Math.PI) * 22 : (isPhone ? 70 : 5);
  const rightArmAngle = isWalking ? Math.sin(walkPhase) * 22 : (isPhone ? 60 : -5);

  // Body bob
  const bodyBob = isWalking ? Math.abs(Math.sin(walkPhase * 2)) * 3 : 0;

  // Jump/fall squash-stretch
  const scaleX = isJumping ? 0.85 : isFalling ? 1.15 : 1;
  const scaleY = isJumping ? 1.2 : isFalling ? 0.85 : 1;

  // Body lean while walking
  const bodyLean = isWalking ? Math.sin(walkPhase) * 3 : 0;

  return (
    <div
      className="relative drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
      style={{
        width: 42,
        height: 70,
        transform: `scaleX(${direction === 'left' ? -scaleX : scaleX}) scaleY(${scaleY})`,
        transition: 'transform 0.15s ease',
      }}
    >
      {/* Body container with bob and lean */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${-bodyBob}px) rotate(${bodyLean}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* HEAD */}
        <div
          className="absolute rounded-full border border-black/20"
          style={{
            width: 18,
            height: 18,
            top: 0,
            left: 12,
            background: '#ffcc99', // bright skin tone
            boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.2)',
          }}
        >
          {/* Hair */}
          <div
            className="absolute rounded-t-full"
            style={{
              width: 18,
              height: 9,
              top: 0,
              left: 0,
              background: '#0f172a',
              borderRadius: '9px 9px 0 0',
            }}
          />
          {/* Eye */}
          <div
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              top: 9,
              right: 4,
              background: '#0f172a',
            }}
          />
        </div>

        {/* TORSO (crisp white shirt) */}
        <div
          className="absolute border border-black/10"
          style={{
            width: 20,
            height: 24,
            top: 17,
            left: 11,
            background: '#ffffff',
            borderRadius: '4px 4px 2px 2px',
            boxShadow: '0 2px 8px rgba(255,255,255,0.2), inset -3px 0 0 rgba(0,0,0,0.1)',
          }}
        >
          {/* Tie */}
          <div
            className="absolute"
            style={{
              width: 5,
              height: 18,
              top: 1,
              left: 7.5,
              background: '#3b82f6', // vibrant blue tie
              clipPath: 'polygon(30% 0%, 70% 0%, 90% 100%, 10% 100%)',
            }}
          />
          {/* Collar left */}
          <div className="absolute" style={{ width: 6, height: 5, top: 0, left: 1, background: '#e2e8f0', clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
          {/* Collar right */}
          <div className="absolute" style={{ width: 6, height: 5, top: 0, right: 1, background: '#e2e8f0', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        </div>

        {/* LEFT ARM */}
        <div
          className="absolute"
          style={{
            width: 6,
            height: 20,
            top: 18,
            left: 5,
            transformOrigin: 'top center',
            transform: `rotate(${leftArmAngle}deg)`,
          }}
        >
          {/* Upper arm (shirt sleeve) */}
          <div style={{ width: 6, height: 10, background: '#ffffff', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }} />
          {/* Hand */}
          <div className="rounded-full" style={{ width: 5, height: 5, marginTop: 0, marginLeft: 0.5, background: '#ffcc99' }} />
          {/* Coffee cup */}
          {(state === 'walking' || state === 'idle') && (
            <div style={{ width: 7, height: 8, marginTop: -2, marginLeft: -1, background: '#d97706', borderRadius: '0 0 3px 3px', border: '1px solid #b45309' }}>
              <div className="absolute -top-3 left-1 text-[8px] text-white font-bold opacity-80 animate-pulse">~</div>
            </div>
          )}
          {/* Phone */}
          {isPhone && (
            <div style={{ width: 6, height: 10, marginTop: -2, background: '#0f172a', borderRadius: 2, border: '1px solid #38bdf8' }}>
              <div style={{ width: 4, height: 6, margin: '1px auto 0', background: '#38bdf8', borderRadius: 1 }} />
            </div>
          )}
        </div>

        {/* RIGHT ARM */}
        <div
          className="absolute"
          style={{
            width: 6,
            height: 18,
            top: 18,
            right: 5,
            transformOrigin: 'top center',
            transform: `rotate(${rightArmAngle}deg)`,
          }}
        >
          <div style={{ width: 6, height: 10, background: '#ffffff', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }} />
          <div className="rounded-full" style={{ width: 5, height: 5, marginTop: 0, marginLeft: 0.5, background: '#ffcc99' }} />
        </div>

        {/* LEFT LEG */}
        <div
          className="absolute"
          style={{
            width: 7,
            height: 26,
            top: 40,
            left: 12,
            transformOrigin: 'top center',
            transform: `rotate(${leftLegAngle}deg)`,
          }}
        >
          {/* Pants */}
          <div style={{ width: 7, height: 19, background: '#1e293b', borderRadius: 2 }} />
          {/* Shoe */}
          <div style={{ width: 10, height: 5, marginLeft: -1, background: '#020617', borderRadius: '2px 5px 2px 2px' }} />
        </div>

        {/* RIGHT LEG */}
        <div
          className="absolute"
          style={{
            width: 7,
            height: 26,
            top: 40,
            left: 23,
            transformOrigin: 'top center',
            transform: `rotate(${rightLegAngle}deg)`,
          }}
        >
          <div style={{ width: 7, height: 19, background: '#1e293b', borderRadius: 2 }} />
          <div style={{ width: 10, height: 5, marginLeft: -1, background: '#020617', borderRadius: '2px 5px 2px 2px' }} />
        </div>
      </div>
    </div>
  );
}
