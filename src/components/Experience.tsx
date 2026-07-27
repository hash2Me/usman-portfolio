import { experience } from '../data/experience';

export default function Experience() {
  return (
    <section id="experience" className="section relative border-t border-white/10">
      <div className="absolute top-1/2 left-0 w-1/3 h-1/3 bg-slate-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-2xl relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-white"></span>
          <p className="font-mono text-sm text-white uppercase tracking-widest">03 — Experience</p>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Work Experience</h2>
      </div>

      <ol className="relative border-l-2 border-white/20 pl-8 space-y-12 max-w-4xl relative z-10">
        {experience.map((item) => (
          <li key={item.org} className="relative group">
            <span className="absolute -left-[calc(2rem+9px)] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-white group-hover:bg-white transition-colors shadow-glow" />
            
            <div className="card p-6 md:p-8 ml-2 group-hover:border-white/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold text-white transition-colors">{item.role}</h3>
                <span className="font-mono text-sm text-slate-950 bg-white px-3 py-1 rounded-full">{item.period}</span>
              </div>
              <p className="text-base font-medium text-slate-400 mb-5">{item.org}</p>
              
              <ul className="space-y-3">
                {item.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <span className="text-white mt-0.5 shrink-0" aria-hidden="true">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
