import { skillGroups } from '../data/skills';

export default function Skills() {
  return (
    <section id="skills" className="section relative border-t border-white/5">
      <div className="max-w-2xl relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-accent"></span>
          <p className="font-mono text-sm text-accent uppercase tracking-widest">04 — Skills</p>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Technical Skills</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 relative z-10">
        {skillGroups.map((group) => (
          <div key={group.category} className="card p-8 group">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                {'</>'}
              </span>
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <span key={item} className="badge hover:bg-accent hover:text-white transition-colors cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
