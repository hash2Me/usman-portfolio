import { experience } from '../data/experience';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Experience() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="experience" className="section relative border-t-4 border-black bg-white">
      <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl relative z-10 mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`h-1 bg-black transition-all duration-1000 ${isVisible ? 'w-12' : 'w-0'}`}></span>
            <p className="font-mono text-sm font-bold text-black uppercase tracking-widest">03 — Experience</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black mb-6 uppercase tracking-tighter">Work Experience</h2>
        </div>

        <ol className="relative border-l-4 border-black pl-8 md:pl-12 space-y-16 max-w-4xl relative z-10">
          {experience.map((item, i) => (
            <li key={item.org} className={`relative group transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`} style={{ transitionDelay: isVisible ? `${(i + 1) * 200}ms` : '0ms' }}>
              <span className="absolute -left-[calc(2rem+11px)] md:-left-[calc(3rem+11px)] top-2 w-5 h-5 bg-white border-4 border-black group-hover:bg-black transition-colors" />
              
              <div className="card p-6 md:p-8 ml-2">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-4">
                  <h3 className="text-2xl font-black text-black uppercase tracking-tight">{item.role}</h3>
                  <span className="font-mono text-xs font-bold text-white bg-black px-3 py-1.5 uppercase tracking-widest border-2 border-black">{item.period}</span>
                </div>
                <p className="text-lg font-bold text-black mb-6 uppercase tracking-wider">{item.org}</p>
                
                <ul className="space-y-4">
                  {item.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-base text-slate-700 leading-relaxed font-medium">
                      <span className="text-black mt-0.5 shrink-0" aria-hidden="true">■</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
