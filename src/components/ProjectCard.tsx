import type { Project } from '../data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card p-6 md:p-8 group">
      <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black text-black uppercase tracking-tight">{project.name}</h3>
          <p className="mt-2 text-base text-black font-bold uppercase tracking-wider">{project.tagline}</p>
        </div>
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-xs px-4 py-2 shrink-0 uppercase tracking-widest"
          >
            View Repo
          </a>
        )}
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="badge">{tech}</span>
        ))}
      </div>

      <p className="relative z-10 mt-6 text-black font-medium leading-relaxed text-lg">{project.description}</p>

      <ul className="relative z-10 mt-5 space-y-3">
        {project.highlights.map((h) => (
          <li key={h} className="flex gap-3 text-base text-slate-700 leading-relaxed font-medium">
            <span className="text-black mt-0.5 shrink-0" aria-hidden="true">■</span>
            {h}
          </li>
        ))}
      </ul>

      {project.technical && (
        <div className="relative z-10 mt-8 overflow-x-auto bg-white border-2 border-black p-4">
          <table className="w-full text-sm border-collapse">
            <caption className="text-left text-xs font-black text-black uppercase tracking-widest mb-4 border-b-2 border-black pb-2">
              Data structures implemented
            </caption>
            <thead>
              <tr className="border-b-2 border-black">
                <th scope="col" className="text-left font-black text-black py-2 pr-4 uppercase tracking-wider">Concept</th>
                <th scope="col" className="text-left font-black text-black py-2 pr-4 uppercase tracking-wider">Implementation</th>
                <th scope="col" className="text-left font-black text-black py-2 uppercase tracking-wider">Used For</th>
              </tr>
            </thead>
            <tbody>
              {project.technical.map((row) => (
                <tr key={row.concept} className="border-b border-black last:border-0 hover:bg-slate-100 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs font-bold text-black">{row.concept}</td>
                  <td className="py-3 pr-4 text-black font-medium">{row.implementation}</td>
                  <td className="py-3 text-black font-medium">{row.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
