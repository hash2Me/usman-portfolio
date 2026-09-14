import { education } from '../data/education';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Education() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="education" className="section relative border-t-4 border-black bg-white">
      <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl relative z-10 mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`h-1 bg-black transition-all duration-1000 ${isVisible ? 'w-12' : 'w-0'}`}></span>
            <p className="font-mono text-sm font-bold text-black uppercase tracking-widest">05 — Education</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black mb-6 uppercase tracking-tighter">Education</h2>
        </div>

        <div className="grid gap-8 relative z-10">
          {education.map((item, i) => (
            <div key={item.institution} className={`card p-6 md:p-8 hover:bg-slate-50 transition-colors duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isVisible ? `${(i + 1) * 200}ms` : '0ms' }}>
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-4">
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">
                  {item.institution}
                </h3>
                <span className="font-mono text-xs font-bold text-white bg-black px-3 py-1.5 uppercase tracking-widest border-2 border-black">{item.detail}</span>
              </div>
              <p className="text-xl font-bold text-black mb-8 uppercase tracking-wider">{item.program}</p>

              <div className="flex flex-wrap gap-2">
                {item.courses.map((course) => (
                  <span key={course} className="badge hover:bg-black hover:text-white transition-colors">
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
