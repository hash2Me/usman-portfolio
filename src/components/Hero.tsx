import { useEffect, useState } from 'react';

export default function Hero() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Stagger the entrance animations
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 md:pt-28 pb-16 md:pb-20 overflow-hidden bg-white">
      <div className="section relative max-w-4xl text-center z-10">
        {/* Status badge */}
        <div className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
          <div className="inline-flex items-center justify-center px-4 py-2 mb-8 border-2 border-black bg-white shadow-hard-sm">
            <span className="w-2 h-2 rounded-full bg-black mr-2 animate-pulse"></span>
            <p className="font-mono text-sm text-black font-bold uppercase tracking-wider">
              Available for new opportunities
            </p>
          </div>
        </div>

        {/* Name */}
        <h1 className={`text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter text-black mb-6 transition-all duration-700 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Hi, I'm{' '}
          <span className="inline-block hover:-translate-y-2 transition-transform duration-200">
            Usman Mubarak
          </span>
        </h1>

        {/* Description */}
        <p className={`mt-6 text-xl md:text-2xl text-slate-700 leading-relaxed max-w-3xl mx-auto font-medium transition-all duration-700 delay-400 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Software Engineering student building at the intersection of{' '}
          <span className="text-black font-black border-b-4 border-black hover:bg-black hover:text-white transition-colors cursor-default">core algorithms</span>{' '}
          and <span className="text-black font-black border-b-4 border-black hover:bg-black hover:text-white transition-colors cursor-default">production interfaces</span>.
          Crafting high-performance systems and stunning frontend experiences.
        </p>

        {/* Buttons */}
        <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all duration-700 delay-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a href="#projects" className="btn-primary w-full sm:w-auto px-8 py-4 text-base uppercase tracking-widest">
            View Projects
          </a>
          <a href="#contact" className="btn-secondary w-full sm:w-auto px-8 py-4 text-base uppercase tracking-widest">
            Get in Touch
          </a>
        </div>

        {/* Badges */}
        <div className={`mt-16 flex flex-wrap justify-center gap-3 transition-all duration-700 delay-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

        {/* Scroll indicator */}
        <div className={`mt-20 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-xs text-black font-bold uppercase tracking-widest">Scroll</span>
          <div className="w-0.5 h-12 bg-black origin-top animate-line-grow" />
        </div>
      </div>
    </section>
  );
}
