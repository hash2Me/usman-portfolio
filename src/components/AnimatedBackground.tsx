/**
 * AnimatedBackground — Subtle grid pattern for the minimalist brutalist design.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} 
      />
    </div>
  );
}
