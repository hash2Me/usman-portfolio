import { skillGroups } from '../data/skills';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Skills() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="skills" className="section relative border-t-4 border-black bg-white">
      <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl relative z-10 mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`h-1 bg-black transition-all duration-1000 ${isVisible ? 'w-12' : 'w-0'}`}></span>
            <p className="font-mono text-sm font-bold text-black uppercase tracking-widest">04 — Skills</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black mb-6 uppercase tracking-tighter">Technical Skills</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 relative z-10">
          {skillGroups.map((group, i) => (
            <div key={group.category} className={`card p-8 group transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: isVisible ? `${(i + 1) * 150}ms` : '0ms' }}>
              <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-4 uppercase tracking-wider">
                <span className="w-12 h-12 bg-black flex items-center justify-center text-white border-2 border-black group-hover:-rotate-12 transition-transform duration-300 shadow-hard-sm">
                  {'</>'}
                </span>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <span key={item} className="badge hover:bg-black hover:text-white hover:-translate-y-1 transition-transform duration-200 cursor-default">
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
