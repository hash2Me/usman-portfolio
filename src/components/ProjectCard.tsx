import type { Project } from '../data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card p-6 md:p-8 group">
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white transition-colors">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-400 font-medium">{project.tagline}</p>
        </div>
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-xs px-4 py-2 shrink-0 border-white/20 hover:border-white/50"
          >
            View Repo →
          </a>
        )}
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="badge">{tech}</span>
        ))}
      </div>

      <p className="relative z-10 mt-6 text-slate-300 leading-relaxed text-base">{project.description}</p>

      <ul className="relative z-10 mt-5 space-y-3">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
            <span className="text-white mt-0.5 shrink-0 animate-pulse" aria-hidden="true">▸</span>
            {h}
          </li>
        ))}
      </ul>

      {project.technical && (
        <div className="relative z-10 mt-8 overflow-x-auto bg-slate-950/50 rounded-xl p-4 border border-white/10">
          <table className="w-full text-sm border-collapse">
            <caption className="text-left text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Data structures implemented
            </caption>
            <thead>
              <tr className="border-b border-white/20">
                <th scope="col" className="text-left font-medium text-slate-300 py-2 pr-4">Concept</th>
                <th scope="col" className="text-left font-medium text-slate-300 py-2 pr-4">Implementation</th>
                <th scope="col" className="text-left font-medium text-slate-300 py-2">Used For</th>
              </tr>
            </thead>
            <tbody>
              {project.technical.map((row) => (
                <tr key={row.concept} className="border-b border-white/5 last:border-0 hover:bg-white/10 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-white">{row.concept}</td>
                  <td className="py-3 pr-4 text-slate-400">{row.implementation}</td>
                  <td className="py-3 text-slate-400">{row.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
