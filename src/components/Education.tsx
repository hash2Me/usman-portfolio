import { education } from '../data/education';

export default function Education() {
  return (
    <section id="education" className="section relative border-t border-white/5">
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-2xl relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-accent"></span>
          <p className="font-mono text-sm text-accent uppercase tracking-widest">05 — Education</p>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Education</h2>
      </div>

      <div className="grid gap-6 relative z-10">
        {education.map((item) => (
          <div key={item.institution} className="card p-6 md:p-8 hover:border-white/20 transition-all">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
              <h3 className="text-xl font-bold text-white group-hover:text-accent-subtle transition-colors">
                {item.institution}
              </h3>
              <span className="font-mono text-sm text-accent bg-accent/10 px-3 py-1 rounded-full">{item.detail}</span>
            </div>
            <p className="text-base text-slate-400 font-medium mb-6">{item.program}</p>

            <div className="flex flex-wrap gap-2">
              {item.courses.map((course) => (
                <span key={course} className="badge">
                  {course}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
