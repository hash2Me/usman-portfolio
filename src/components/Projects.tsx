import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Projects() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="projects" className="section relative bg-white">
      <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`h-1 bg-black transition-all duration-1000 ${isVisible ? 'w-12' : 'w-0'}`}></span>
            <p className="font-mono text-sm font-bold text-black uppercase tracking-widest">02 — Projects</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black mb-6 uppercase tracking-tighter">Engineering Work</h2>
          <p className="text-xl text-black font-medium leading-relaxed">
            Ranked by technical depth — from custom data structure implementations
            in C++ to production-facing React systems.
          </p>
        </div>

        <div className="mt-16 grid gap-12 relative z-10">
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
