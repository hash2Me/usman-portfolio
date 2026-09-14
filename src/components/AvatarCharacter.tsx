/**
 * CSS-drawn monochrome character — brutalist B&W theme.
 * Supports: idle, walking, jumping, falling, phone, waving, dancing,
 *           typing, thinking, dragged, listening, talking, sitting.
 * Eye tracks cursor via cursorOffsetX prop.
 */

type CharacterState = 'idle' | 'walking' | 'jumping' | 'falling' | 'phone' | 'waving' | 'dancing' | 'typing' | 'thinking' | 'dragged' | 'listening' | 'talking' | 'sitting';
type Direction = 'left' | 'right';

interface Props {
  state: CharacterState;
  direction: Direction;
  walkPhase: number;
  cursorOffsetX?: number;
}

export default function AvatarCharacter({ state, direction, walkPhase, cursorOffsetX = 0 }: Props) {
  const isJumping = state === 'jumping';
  const isFalling = state === 'falling';

  let leftArmAngle = 4;
  let rightArmAngle = -4;
  let leftLegAngle = 0;
  let rightLegAngle = 0;
  let bodyBob = 0;
  let bodyLean = 0;
  let showCoffee = false;
  let showPhone = false;

  switch (state) {
    case 'walking':
      leftLegAngle = Math.sin(walkPhase) * 26;
      rightLegAngle = Math.sin(walkPhase + Math.PI) * 26;
      leftArmAngle = Math.sin(walkPhase + Math.PI) * 20;
      rightArmAngle = Math.sin(walkPhase) * 20;
      bodyBob = Math.abs(Math.sin(walkPhase * 2)) * 2.5;
      bodyLean = Math.sin(walkPhase) * 2.5;
      showCoffee = true;
      break;
    case 'idle':
      showCoffee = true;
      bodyBob = Math.sin(walkPhase * 0.8) * 0.5;
      break;
    case 'phone':
      leftArmAngle = 70;
      rightArmAngle = 60;
      showPhone = true;
      bodyBob = Math.sin(walkPhase * 0.5) * 0.3;
      break;
    case 'waving':
      rightArmAngle = -80 + Math.sin(walkPhase * 4) * 25;
      leftArmAngle = 4;
      bodyBob = Math.sin(walkPhase * 2) * 1;
      break;
    case 'dancing':
      leftLegAngle = Math.sin(walkPhase * 2) * 35;
      rightLegAngle = Math.sin(walkPhase * 2 + Math.PI) * 35;
      leftArmAngle = Math.sin(walkPhase * 2) * 50;
      rightArmAngle = Math.sin(walkPhase * 2 + Math.PI) * 50;
      bodyBob = Math.abs(Math.sin(walkPhase * 4)) * 5;
      bodyLean = Math.sin(walkPhase * 2) * 8;
      break;
    case 'typing':
      leftArmAngle = 40 + Math.sin(walkPhase * 6) * 5;
      rightArmAngle = -(40 + Math.sin(walkPhase * 6 + 2) * 5);
      bodyBob = Math.sin(walkPhase) * 0.5;
      bodyLean = Math.sin(walkPhase * 3) * 1;
      break;
    case 'thinking':
      rightArmAngle = -75;
      leftArmAngle = 8;
      bodyLean = -3;
      bodyBob = Math.sin(walkPhase * 0.6) * 0.8;
      break;
    case 'dragged':
      leftArmAngle = Math.sin(walkPhase * 0.8) * 8;
      rightArmAngle = Math.sin(walkPhase * 0.8 + 1) * 8;
      leftLegAngle = Math.sin(walkPhase * 0.5) * 10;
      rightLegAngle = Math.sin(walkPhase * 0.5 + 1.5) * 10;
      bodyLean = Math.sin(walkPhase * 0.3) * 5;
      break;
    case 'listening':
      rightArmAngle = -55; // hand cupped near ear
      leftArmAngle = 8;
      bodyLean = -4; // leaning forward
      bodyBob = Math.sin(walkPhase * 0.8) * 1;
      break;
    case 'talking':
      leftArmAngle = 30 + Math.sin(walkPhase * 3) * 18;
      rightArmAngle = -(20 + Math.sin(walkPhase * 3 + Math.PI) * 18);
      bodyBob = Math.abs(Math.sin(walkPhase * 2)) * 2.5;
      bodyLean = Math.sin(walkPhase * 1.5) * 3;
      break;
    case 'sitting':
      leftLegAngle = 70;
      rightLegAngle = 65;
      leftArmAngle = 10;
      rightArmAngle = -10;
      bodyBob = Math.sin(walkPhase * 0.5) * 0.5;
      break;
    case 'jumping':
    case 'falling':
      leftArmAngle = -20;
      rightArmAngle = 20;
      break;
  }

  const scaleX = isJumping ? 0.88 : isFalling ? 1.12 : 1;
  const scaleY = isJumping ? 1.15 : isFalling ? 0.88 : 1;
  const eyeShift = (direction === 'left' ? -1 : 1) * cursorOffsetX * 1.5;

  return (
    <div
      style={{
        width: 40, height: 68,
        transform: `scaleX(${direction === 'left' ? -scaleX : scaleX}) scaleY(${scaleY})`,
        transition: 'transform 0.15s ease',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          transform: `translateY(${-bodyBob}px) rotate(${bodyLean}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* HEAD */}
        <div style={{ width: 16, height: 16, position: 'absolute', top: 0, left: 12, background: '#e5e5e5', borderRadius: '50%', border: '2px solid #000' }}>
          <div style={{ width: 18, height: 8, position: 'absolute', top: -2, left: -2, background: '#000', borderRadius: '9px 9px 0 0' }} />
          <div style={{ width: 3, height: 3, position: 'absolute', top: 9, right: Math.max(1, Math.min(5, 3 - eyeShift)), background: '#000', borderRadius: '50%', transition: 'right 0.15s ease' }} />
        </div>

        {/* TORSO */}
        <div style={{ width: 18, height: 22, position: 'absolute', top: 16, left: 11, background: '#fff', border: '2px solid #000', borderRadius: '3px 3px 1px 1px' }}>
          <div style={{ width: 4, height: 16, position: 'absolute', top: 1, left: 6, background: '#000', clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)' }} />
        </div>

        {/* LEFT ARM */}
        <div style={{ width: 6, height: 19, position: 'absolute', top: 17, left: 5, transformOrigin: 'top center', transform: `rotate(${leftArmAngle}deg)` }}>
          <div style={{ width: 6, height: 10, background: '#fff', border: '1.5px solid #000', borderRadius: 2 }} />
          <div style={{ width: 5, height: 5, marginLeft: 0.5, background: '#e5e5e5', border: '1px solid #000', borderRadius: '50%' }} />
          {showCoffee && (
            <div style={{ width: 7, height: 7, marginTop: -1, marginLeft: -1, background: '#fff', border: '2px solid #000', borderRadius: '0 0 3px 3px' }}>
              <div style={{ position: 'absolute', top: -6, left: 2, fontSize: 7, color: '#000', fontWeight: 'bold', opacity: 0.5 }}>~</div>
            </div>
          )}
          {showPhone && (
            <div style={{ width: 6, height: 10, marginTop: -1, background: '#000', borderRadius: 2, border: '1px solid #555' }}>
              <div style={{ width: 4, height: 6, margin: '1px auto 0', background: '#ccc', borderRadius: 1 }} />
            </div>
          )}
        </div>

        {/* RIGHT ARM */}
        <div style={{ width: 6, height: 17, position: 'absolute', top: 17, right: 5, transformOrigin: 'top center', transform: `rotate(${rightArmAngle}deg)` }}>
          <div style={{ width: 6, height: 10, background: '#fff', border: '1.5px solid #000', borderRadius: 2 }} />
          <div style={{ width: 5, height: 5, marginLeft: 0.5, background: '#e5e5e5', border: '1px solid #000', borderRadius: '50%' }} />
        </div>

        {/* LEFT LEG */}
        <div style={{ width: 7, height: 24, position: 'absolute', top: 37, left: 12, transformOrigin: 'top center', transform: `rotate(${leftLegAngle}deg)` }}>
          <div style={{ width: 7, height: 17, background: '#000', borderRadius: 2 }} />
          <div style={{ width: 10, height: 5, marginLeft: -1, background: '#000', borderRadius: '2px 5px 2px 2px', border: '1px solid #333' }} />
        </div>

        {/* RIGHT LEG */}
        <div style={{ width: 7, height: 24, position: 'absolute', top: 37, left: 22, transformOrigin: 'top center', transform: `rotate(${rightLegAngle}deg)` }}>
          <div style={{ width: 7, height: 17, background: '#000', borderRadius: 2 }} />
          <div style={{ width: 10, height: 5, marginLeft: -1, background: '#000', borderRadius: '2px 5px 2px 2px', border: '1px solid #333' }} />
        </div>
      </div>
    </div>
  );
}
