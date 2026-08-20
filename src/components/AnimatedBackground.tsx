/**
 * AnimatedBackground — Subtle floating geometric shapes and particles
 * that drift across the viewport. Keeps the minimalist monochrome palette.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Large soft glowing orbs */}
      <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-white/[0.02] rounded-full filter blur-[120px] animate-blob" />
      <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] bg-slate-400/[0.03] rounded-full filter blur-[100px] animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[15%] left-[40%] w-[350px] h-[350px] bg-white/[0.02] rounded-full filter blur-[80px] animate-blob" style={{ animationDelay: '6s' }} />

      {/* Floating geometric shapes */}
      {/* Small ring */}
      <div className="absolute top-[20%] right-[20%] w-6 h-6 border border-white/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      {/* Square */}
      <div className="absolute top-[45%] left-[8%] w-4 h-4 border border-white/[0.08] rotate-45 animate-float-slow" style={{ animationDelay: '1s' }} />
      {/* Dot */}
      <div className="absolute top-[70%] right-[30%] w-2 h-2 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      {/* Cross */}
      <div className="absolute top-[30%] left-[50%] animate-drift opacity-[0.06]">
        <div className="relative w-6 h-6">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white -translate-y-1/2" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-white -translate-x-1/2" />
        </div>
      </div>
      {/* Triangle */}
      <div className="absolute top-[55%] left-[75%] animate-float-slow opacity-[0.06]" style={{ animationDelay: '4s' }}>
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-white" />
      </div>
      {/* Small ring 2 */}
      <div className="absolute top-[80%] left-[20%] w-3 h-3 border border-white/[0.08] rounded-full animate-float" style={{ animationDelay: '5s' }} />
      {/* Dot 2 */}
      <div className="absolute top-[15%] left-[70%] w-1.5 h-1.5 bg-white/[0.08] rounded-full animate-float-slow" style={{ animationDelay: '3s' }} />
      {/* Square 2 */}
      <div className="absolute top-[85%] right-[15%] w-3 h-3 border border-white/[0.06] rotate-12 animate-drift" style={{ animationDelay: '7s' }} />

      {/* Subtle horizontal scan lines effect */}
      <div className="absolute inset-0 opacity-[0.015]" 
        style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
          backgroundSize: '100% 4px'
        }} 
      />
    </div>
  );
}
