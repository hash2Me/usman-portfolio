import { useEffect, useState } from 'react';

export default function Hero() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Stagger the entrance animations
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 md:pt-28 pb-16 md:pb-20 overflow-hidden">
      {/* Monochrome glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>

      <div className="section relative max-w-4xl text-center">
        {/* Status badge */}
        <div className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
          <div className="inline-flex items-center justify-center px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse shadow-glow"></span>
            <p className="font-mono text-sm text-slate-300">
              Available for new opportunities
            </p>
          </div>
        </div>

        {/* Name */}
        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 transition-all duration-1000 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Hi, I'm{' '}
          <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] inline-block hover:scale-105 transition-transform duration-300">
            Usman Mubarak
          </span>
        </h1>

        {/* Description */}
        <p className={`mt-6 text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-light transition-all duration-1000 delay-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Software Engineering student building at the intersection of{' '}
          <span className="text-white font-medium hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all cursor-default">core algorithms</span>{' '}
          and <span className="text-white font-medium hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all cursor-default">production interfaces</span>.
          Crafting high-performance systems and stunning frontend experiences.
        </p>

        {/* Buttons */}
        <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all duration-1000 delay-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a href="#projects" className="btn-primary w-full sm:w-auto px-8 py-4 text-base group">
            <span className="group-hover:tracking-wider transition-all duration-300">View Projects</span>
          </a>
          <a href="#contact" className="btn-secondary w-full sm:w-auto px-8 py-4 text-base group">
            <span className="group-hover:tracking-wider transition-all duration-300">Get in Touch</span>
          </a>
        </div>

        {/* Badges */}
        <div className={`mt-16 flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-1000 ${show ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {['C++', 'React.js', 'Java', 'Python', 'DSA', 'React Native'].map((tag, i) => (
            <span 
              key={tag} 
              className="badge hover:bg-white hover:text-slate-950 hover:scale-110 transition-all duration-200 cursor-default"
              style={{ transitionDelay: show ? `${1000 + i * 80}ms` : '0ms' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className={`mt-20 flex flex-col items-center gap-2 transition-all duration-1000 delay-[1500ms] ${show ? 'opacity-60' : 'opacity-0'}`}>
          <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-white/20 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
