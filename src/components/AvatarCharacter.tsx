/**
 * CSS-drawn pixel-art businessman character.
 * No images = no background issues. Full control over walk/idle/jump/fall animations.
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

  // Walk cycle leg angles (swing from -30° to 30°)
  const leftLegAngle = isWalking ? Math.sin(walkPhase) * 30 : 0;
  const rightLegAngle = isWalking ? Math.sin(walkPhase + Math.PI) * 30 : 0;

  // Arm swing (opposite to legs)
  const leftArmAngle = isWalking ? Math.sin(walkPhase + Math.PI) * 25 : (isPhone ? 70 : 5);
  const rightArmAngle = isWalking ? Math.sin(walkPhase) * 25 : (isPhone ? 60 : -5);

  // Body bob
  const bodyBob = isWalking ? Math.abs(Math.sin(walkPhase * 2)) * 2 : 0;

  // Jump/fall squash-stretch
  const scaleX = isJumping ? 0.9 : isFalling ? 1.1 : 1;
  const scaleY = isJumping ? 1.15 : isFalling ? 0.9 : 1;

  // Body lean while walking
  const bodyLean = isWalking ? Math.sin(walkPhase) * 2 : 0;

  return (
    <div
      className="relative"
      style={{
        width: 32,
        height: 56,
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
          className="absolute rounded-full"
          style={{
            width: 14,
            height: 14,
            top: 0,
            left: 9,
            background: '#d4a574', // skin
            boxShadow: 'inset -2px -1px 0 rgba(0,0,0,0.15)',
          }}
        >
          {/* Hair */}
          <div
            className="absolute rounded-t-full"
            style={{
              width: 14,
              height: 7,
              top: 0,
              left: 0,
              background: '#1a1a2e',
              borderRadius: '7px 7px 0 0',
            }}
          />
          {/* Eye */}
          <div
            className="absolute rounded-full"
            style={{
              width: 2,
              height: 2,
              top: 7,
              right: 3,
              background: '#1a1a2e',
            }}
          />
        </div>

        {/* TORSO (white shirt) */}
        <div
          className="absolute"
          style={{
            width: 16,
            height: 18,
            top: 13,
            left: 8,
            background: '#f0f0f0',
            borderRadius: '3px 3px 1px 1px',
            boxShadow: 'inset -2px 0 0 rgba(0,0,0,0.08)',
          }}
        >
          {/* Tie */}
          <div
            className="absolute"
            style={{
              width: 4,
              height: 14,
              top: 1,
              left: 6,
              background: '#1a1a2e',
              clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)',
            }}
          />
          {/* Collar left */}
          <div className="absolute" style={{ width: 5, height: 4, top: 0, left: 1, background: '#e0e0e0', clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
          {/* Collar right */}
          <div className="absolute" style={{ width: 5, height: 4, top: 0, right: 1, background: '#e0e0e0', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        </div>

        {/* LEFT ARM */}
        <div
          className="absolute"
          style={{
            width: 5,
            height: 16,
            top: 14,
            left: 3,
            transformOrigin: 'top center',
            transform: `rotate(${leftArmAngle}deg)`,
          }}
        >
          {/* Upper arm (shirt sleeve) */}
          <div style={{ width: 5, height: 8, background: '#f0f0f0', borderRadius: 2 }} />
          {/* Hand */}
          <div className="rounded-full" style={{ width: 4, height: 4, marginTop: 0, marginLeft: 0.5, background: '#d4a574' }} />
          {/* Coffee cup (only when walking or idle) */}
          {(state === 'walking' || state === 'idle') && (
            <div style={{ width: 5, height: 6, marginTop: -1, marginLeft: -0.5, background: '#8B6914', borderRadius: '0 0 2px 2px', border: '1px solid #6B4F12' }}>
              {/* Steam */}
              <div className="absolute -top-2 left-1 text-[6px] opacity-50 animate-pulse">~</div>
            </div>
          )}
          {/* Phone (when on phone) */}
          {isPhone && (
            <div style={{ width: 4, height: 7, marginTop: -1, background: '#222', borderRadius: 1 }}>
              <div style={{ width: 3, height: 4, margin: '1px auto 0', background: '#4af', borderRadius: 0.5 }} />
            </div>
          )}
        </div>

        {/* RIGHT ARM */}
        <div
          className="absolute"
          style={{
            width: 5,
            height: 14,
            top: 14,
            right: 3,
            transformOrigin: 'top center',
            transform: `rotate(${rightArmAngle}deg)`,
          }}
        >
          <div style={{ width: 5, height: 8, background: '#f0f0f0', borderRadius: 2 }} />
          <div className="rounded-full" style={{ width: 4, height: 4, marginTop: 0, marginLeft: 0.5, background: '#d4a574' }} />
        </div>

        {/* LEFT LEG */}
        <div
          className="absolute"
          style={{
            width: 6,
            height: 20,
            top: 30,
            left: 9,
            transformOrigin: 'top center',
            transform: `rotate(${leftLegAngle}deg)`,
          }}
        >
          {/* Pants */}
          <div style={{ width: 6, height: 14, background: '#1a1a2e', borderRadius: 2 }} />
          {/* Shoe */}
          <div style={{ width: 8, height: 4, marginLeft: -1, background: '#111', borderRadius: '2px 4px 2px 2px' }} />
        </div>

        {/* RIGHT LEG */}
        <div
          className="absolute"
          style={{
            width: 6,
            height: 20,
            top: 30,
            left: 17,
            transformOrigin: 'top center',
            transform: `rotate(${rightLegAngle}deg)`,
          }}
        >
          <div style={{ width: 6, height: 14, background: '#1a1a2e', borderRadius: 2 }} />
          <div style={{ width: 8, height: 4, marginLeft: -1, background: '#111', borderRadius: '2px 4px 2px 2px' }} />
        </div>
      </div>
    </div>
  );
}
