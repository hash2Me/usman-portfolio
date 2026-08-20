import { skillGroups } from '../data/skills';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Skills() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="skills" className="section relative border-t border-white/10">
      <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl relative z-10 mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`h-px bg-white transition-all duration-1000 ${isVisible ? 'w-8' : 'w-0'}`}></span>
            <p className="font-mono text-sm text-white uppercase tracking-widest">04 — Skills</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Technical Skills</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 relative z-10">
          {skillGroups.map((group, i) => (
            <div key={group.category} className={`card p-8 group transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : '0ms' }}>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  {'</>'}
                </span>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <span key={item} className="badge hover:bg-white hover:text-slate-950 hover:scale-110 transition-all duration-200 cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
