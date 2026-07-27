export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 md:pt-28 pb-16 md:pb-20 overflow-hidden">
      {/* Monochrome glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>

      <div className="section relative max-w-4xl text-center motion-safe:animate-[fadeUp_0.8s_ease-out]">
        <div className="inline-flex items-center justify-center px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse shadow-glow"></span>
          <p className="font-mono text-sm text-slate-300">
            Available for new opportunities
          </p>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
          Hi, I'm{' '}
          <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Usman Mubarak
          </span>
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-light">
          Software Engineering student building at the intersection of{' '}
          <span className="text-white font-medium">core algorithms</span>{' '}
          and <span className="text-white font-medium">production interfaces</span>.
          Crafting high-performance systems and stunning frontend experiences.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a href="#projects" className="btn-primary w-full sm:w-auto px-8 py-4 text-base">
            View Projects
          </a>
          <a href="#contact" className="btn-secondary w-full sm:w-auto px-8 py-4 text-base">
            Get in Touch
          </a>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
          {['C++', 'React.js', 'Java', 'Python', 'DSA', 'React Native'].map((tag) => (
            <span key={tag} className="badge">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
