const CONTACT_LINKS = [
  { label: 'Email', value: 'princeme296@gmail.com', href: 'mailto:princeme296@gmail.com' },
  { label: 'Phone', value: '+92 313 0560539', href: 'tel:+923130560539' },
  { label: 'GitHub', value: 'github.com/hash2Me', href: 'https://github.com/hash2Me' },
  {
    label: 'LinkedIn',
    value: 'in/usman-mubarak-software-engineer',
    href: 'https://www.linkedin.com/in/usman-mubarak-software-engineer',
  },
];

import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="contact" className="section relative border-t border-white/10 pb-32">
      <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-2xl relative z-10 mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`h-px bg-white transition-all duration-1000 ${isVisible ? 'w-8' : 'w-0'}`}></span>
            <p className="font-mono text-sm text-white uppercase tracking-widest">06 — Contact</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Connect</h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Open to frontend engineering roles and internships where I can apply
            both systems-level thinking and production React experience. Feel
            free to reach out directly.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl relative z-10">
          {CONTACT_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className={`card p-6 flex flex-col gap-2 hover:border-white hover:-translate-y-2 hover:shadow-glow transition-all duration-300 group ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
              style={{ transitionDelay: isVisible ? `${(i + 1) * 100}ms` : '0ms' }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">{link.label}</span>
              <span className="text-base text-white transition-colors">{link.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
