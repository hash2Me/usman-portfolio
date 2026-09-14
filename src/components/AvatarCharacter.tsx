/**
 * CSS-drawn monochrome character — matches the brutalist B&W portfolio theme.
 * All colors are strictly black / white / grays — no color accents.
 */

type CharacterState = 'idle' | 'walking' | 'jumping' | 'falling' | 'phone' | 'sitting';
type Direction = 'left' | 'right';

interface Props {
  state: CharacterState;
  direction: Direction;
  walkPhase: number;
}

export default function AvatarCharacter({ state, direction, walkPhase }: Props) {
  const isWalking = state === 'walking';
  const isJumping = state === 'jumping';
  const isFalling = state === 'falling';
  const isPhone = state === 'phone';

  // Walk cycle
  const leftLegAngle = isWalking ? Math.sin(walkPhase) * 26 : 0;
  const rightLegAngle = isWalking ? Math.sin(walkPhase + Math.PI) * 26 : 0;
  const leftArmAngle = isWalking ? Math.sin(walkPhase + Math.PI) * 20 : (isPhone ? 70 : 4);
  const rightArmAngle = isWalking ? Math.sin(walkPhase) * 20 : (isPhone ? 60 : -4);
  const bodyBob = isWalking ? Math.abs(Math.sin(walkPhase * 2)) * 2.5 : 0;
  const bodyLean = isWalking ? Math.sin(walkPhase) * 2.5 : 0;

  // Jump/fall squash-stretch
  const scaleX = isJumping ? 0.88 : isFalling ? 1.12 : 1;
  const scaleY = isJumping ? 1.15 : isFalling ? 0.88 : 1;

  return (
    <div
      style={{
        width: 40,
        height: 68,
        transform: `scaleX(${direction === 'left' ? -scaleX : scaleX}) scaleY(${scaleY})`,
        transition: 'transform 0.15s ease',
        position: 'relative',
      }}
    >
      {/* Body container with bob & lean */}
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
          style={{
            width: 16,
            height: 16,
            position: 'absolute',
            top: 0,
            left: 12,
            background: '#e5e5e5',
            borderRadius: '50%',
            border: '2px solid #000',
          }}
        >
          {/* Hair — flat cap style */}
          <div
            style={{
              width: 18,
              height: 8,
              position: 'absolute',
              top: -2,
              left: -2,
              background: '#000',
              borderRadius: '9px 9px 0 0',
            }}
          />
          {/* Eye */}
          <div
            style={{
              width: 3,
              height: 3,
              position: 'absolute',
              top: 9,
              right: 3,
              background: '#000',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* TORSO */}
        <div
          style={{
            width: 18,
            height: 22,
            position: 'absolute',
            top: 16,
            left: 11,
            background: '#fff',
            border: '2px solid #000',
            borderRadius: '3px 3px 1px 1px',
          }}
        >
          {/* Tie — black */}
          <div
            style={{
              width: 4,
              height: 16,
              position: 'absolute',
              top: 1,
              left: 6,
              background: '#000',
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>

        {/* LEFT ARM */}
        <div
          style={{
            width: 6,
            height: 19,
            position: 'absolute',
            top: 17,
            left: 5,
            transformOrigin: 'top center',
            transform: `rotate(${leftArmAngle}deg)`,
          }}
        >
          {/* Sleeve */}
          <div style={{ width: 6, height: 10, background: '#fff', border: '1.5px solid #000', borderRadius: 2 }} />
          {/* Hand */}
          <div style={{ width: 5, height: 5, marginLeft: 0.5, background: '#e5e5e5', border: '1px solid #000', borderRadius: '50%' }} />
          {/* Coffee mug — monochrome */}
          {(state === 'walking' || state === 'idle') && (
            <div style={{ width: 7, height: 7, marginTop: -1, marginLeft: -1, background: '#fff', border: '2px solid #000', borderRadius: '0 0 3px 3px' }}>
              <div style={{ position: 'absolute', top: -6, left: 2, fontSize: 7, color: '#000', fontWeight: 'bold', opacity: 0.5 }}>~</div>
            </div>
          )}
          {/* Phone — monochrome */}
          {isPhone && (
            <div style={{ width: 6, height: 10, marginTop: -1, background: '#000', borderRadius: 2, border: '1px solid #555' }}>
              <div style={{ width: 4, height: 6, margin: '1px auto 0', background: '#ccc', borderRadius: 1 }} />
            </div>
          )}
        </div>

        {/* RIGHT ARM */}
        <div
          style={{
            width: 6,
            height: 17,
            position: 'absolute',
            top: 17,
            right: 5,
            transformOrigin: 'top center',
            transform: `rotate(${rightArmAngle}deg)`,
          }}
        >
          <div style={{ width: 6, height: 10, background: '#fff', border: '1.5px solid #000', borderRadius: 2 }} />
          <div style={{ width: 5, height: 5, marginLeft: 0.5, background: '#e5e5e5', border: '1px solid #000', borderRadius: '50%' }} />
        </div>

        {/* LEFT LEG */}
        <div
          style={{
            width: 7,
            height: 24,
            position: 'absolute',
            top: 37,
            left: 12,
            transformOrigin: 'top center',
            transform: `rotate(${leftLegAngle}deg)`,
          }}
        >
          {/* Pants */}
          <div style={{ width: 7, height: 17, background: '#000', borderRadius: 2 }} />
          {/* Shoe */}
          <div style={{ width: 10, height: 5, marginLeft: -1, background: '#000', borderRadius: '2px 5px 2px 2px', border: '1px solid #333' }} />
        </div>

        {/* RIGHT LEG */}
        <div
          style={{
            width: 7,
            height: 24,
            position: 'absolute',
            top: 37,
            left: 22,
            transformOrigin: 'top center',
            transform: `rotate(${rightLegAngle}deg)`,
          }}
        >
          <div style={{ width: 7, height: 17, background: '#000', borderRadius: 2 }} />
          <div style={{ width: 10, height: 5, marginLeft: -1, background: '#000', borderRadius: '2px 5px 2px 2px', border: '1px solid #333' }} />
        </div>
      </div>
    </div>
  );
}
