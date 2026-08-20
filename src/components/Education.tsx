import { education } from '../data/education';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Education() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="education" className="section relative border-t border-white/10">
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl relative z-10 mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`h-px bg-white transition-all duration-1000 ${isVisible ? 'w-8' : 'w-0'}`}></span>
            <p className="font-mono text-sm text-white uppercase tracking-widest">05 — Education</p>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Education</h2>
        </div>

        <div className="grid gap-6 relative z-10">
          {education.map((item, i) => (
            <div key={item.institution} className={`card p-6 md:p-8 hover:border-white/30 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isVisible ? `${(i + 1) * 200}ms` : '0ms' }}>
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                <h3 className="text-xl font-bold text-white transition-colors">
                  {item.institution}
                </h3>
                <span className="font-mono text-sm text-slate-950 bg-white px-3 py-1 rounded-full">{item.detail}</span>
              </div>
              <p className="text-base text-slate-400 font-medium mb-6">{item.program}</p>

              <div className="flex flex-wrap gap-2">
                {item.courses.map((course) => (
                  <span key={course} className="badge hover:bg-white hover:text-slate-950 transition-colors">
                    {course}
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
