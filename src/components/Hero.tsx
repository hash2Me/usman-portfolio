import { useEffect, useState, useRef } from 'react';

export default function Hero() {
  const [show, setShow] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const tiltWrapperRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Stagger the entrance animations
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // 3D tilt tracking cursor over the hero section (disabled under prefers-reduced-motion or touch)
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const updateTilt = () => {
      currentRotX += (targetRotX - currentRotX) * 0.1;
      currentRotY += (targetRotY - currentRotY) * 0.1;

      if (tiltWrapperRef.current) {
        tiltWrapperRef.current.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      }

      if (Math.abs(targetRotX - currentRotX) > 0.01 || Math.abs(targetRotY - currentRotY) > 0.01) {
        rafIdRef.current = requestAnimationFrame(updateTilt);
      } else {
        rafIdRef.current = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Ignore if on small/touch screens
      if (window.innerWidth < 1024) return;

      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      // Subtle tilt max 6 degrees toward pointer
      targetRotX = -y * 12; // tilt vertically
      targetRotY = x * 12;  // tilt horizontally

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(updateTilt);
      }
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(updateTilt);
      }
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center pt-8 md:pt-14 pb-14 md:pb-20 overflow-hidden bg-white">
      <div className="section relative w-full max-w-7xl mx-auto z-10 !pt-2 md:!pt-4">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-8">
          
          {/* Left Column: Hero Text Content */}
          <div className="w-full lg:w-[55%] text-left">
            {/* Status badge */}
            <div className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
              <div className="inline-flex items-center justify-center px-4 py-2 mb-6 border-2 border-black bg-white shadow-hard-sm">
                <span className="w-2 h-2 rounded-full bg-black mr-2 animate-pulse"></span>
                <p className="font-mono text-sm text-black font-bold uppercase tracking-wider">
                  Available for new opportunities
                </p>
              </div>
            </div>

            {/* Name */}
            <h1 className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-black mb-6 transition-all duration-700 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Hi, I'm{' '}
              <span className="inline-block hover:-translate-y-2 transition-transform duration-200">
                Usman Mubarak
              </span>
            </h1>

            {/* Description */}
            <p className={`mt-6 text-xl md:text-2xl text-slate-700 leading-relaxed max-w-2xl font-medium transition-all duration-700 delay-400 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Software Engineering student building at the intersection of{' '}
              <span className="text-black font-black border-b-4 border-black hover:bg-black hover:text-white transition-colors cursor-default">core algorithms</span>{' '}
              and <span className="text-black font-black border-b-4 border-black hover:bg-black hover:text-white transition-colors cursor-default">production interfaces</span>.
              Crafting high-performance systems and stunning frontend experiences.
            </p>

            {/* Buttons */}
            <div className={`mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 transition-all duration-700 delay-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a href="#projects" className="btn-primary px-8 py-4 text-base uppercase tracking-widest text-center">
                View Projects
              </a>
              <a href="#contact" className="btn-secondary px-8 py-4 text-base uppercase tracking-widest text-center">
                Get in Touch
              </a>
            </div>

            {/* Badges */}
            <div className={`mt-12 flex flex-wrap gap-3 transition-all duration-700 delay-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {['C++', 'React.js', 'Java', 'Python', 'DSA', 'React Native'].map((tag, i) => (
                <span 
                  key={tag} 
                  className="badge hover:bg-black hover:text-white hover:-translate-y-1 transition-transform duration-200 cursor-default"
                  style={{ transitionDelay: show ? `${700 + i * 80}ms` : '0ms' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Borderless Portrait (45% on desktop, max-w-280px on mobile) */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end items-center relative z-20">
            {/* Tilt Wrapper (receives mouse tilt transform) */}
            <div 
              ref={tiltWrapperRef}
              className="will-change-transform transition-transform duration-150 ease-out"
            >
              {/* Float Wrapper (6s idle float) */}
              <div className="portrait-float">
                {/* 
                  TUNABLE GLASSES POSITIONING VARIABLES:
                  Edit the values below to nudge the glasses overlay without touching markup.
                  --glasses-x: Horizontal center offset from left edge (percentage or px)
                  --glasses-y: Vertical center offset from top edge (percentage or px)
                  --glasses-w: Width of glasses relative to portrait (percentage or px)
                  --glasses-rotate: Rotation angle in degrees (e.g. 0deg, -2deg, 3deg)
                */}
                <div 
                  className="relative portrait-hatch select-none max-w-[280px] lg:max-w-none w-full"
                  style={{
                    '--glasses-x': '50%',
                    '--glasses-y': '47.5%',
                    '--glasses-w': '42%',
                    '--glasses-rotate': '0deg',
                  } as React.CSSProperties}
                >
                  {/* Portrait image with sketch treatment and bottom soft fade */}
                  <img
                    src="/usman.png"
                    onError={(e) => {
                      // Graceful fallback to SVG sketch illustration if /usman.png is not yet present
                      (e.currentTarget as HTMLImageElement).src = '/usman-placeholder.svg';
                    }}
                    alt="Usman Mubarak portrait"
                    className="w-full h-auto min-h-[380px] sm:min-h-[420px] lg:min-h-[480px] object-contain pointer-events-none block"
                    style={{
                      filter: 'grayscale(1) contrast(1.35) brightness(1.05)',
                      maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    }}
                  />

                  {/* Inline SVG Square Glasses Overlay */}
                  <svg
                    viewBox="0 0 160 55"
                    fill="none"
                    aria-hidden="true"
                    className="absolute pointer-events-none z-30 glasses-draw"
                    style={{
                      left: 'var(--glasses-x)',
                      top: 'var(--glasses-y)',
                      width: 'var(--glasses-w)',
                      transform: 'translate(-50%, -50%) rotate(var(--glasses-rotate))',
                    }}
                  >
                    {/* Left Temple Arm */}
                    <path
                      d="M 5 24 L 20 22"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="text-black"
                    />
                    {/* Left Square Lens */}
                    <rect
                      x="20"
                      y="10"
                      width="46"
                      height="38"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      className="text-black"
                    />
                    {/* Bridge */}
                    <path
                      d="M 66 22 Q 80 19 94 22"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      className="text-black"
                    />
                    {/* Right Square Lens */}
                    <rect
                      x="94"
                      y="10"
                      width="46"
                      height="38"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      className="text-black"
                    />
                    {/* Right Temple Arm */}
                    <path
                      d="M 140 22 L 155 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="text-black"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className={`mt-16 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-xs text-black font-bold uppercase tracking-widest">Scroll</span>
          <div className="w-0.5 h-12 bg-black origin-top animate-line-grow" />
        </div>
      </div>
    </section>
  );
}

