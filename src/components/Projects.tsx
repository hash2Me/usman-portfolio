import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Projects() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="projects" className="section relative border-t border-white/10">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>

      <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`h-px bg-white transition-all duration-1000 ${isVisible ? 'w-8' : 'w-0'}`}></span>
            <p className="font-mono text-sm text-white uppercase tracking-widest">02 — Projects</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Engineering Work</h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Ranked by technical depth — from custom data structure implementations
            in C++ to production-facing React systems.
          </p>
        </div>

        <div className="mt-16 grid gap-8 relative z-10">
          {projects.map((p, i) => (
            <div key={p.slug} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : '0ms' }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
