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

export default function Contact() {
  return (
    <section id="contact" className="section relative border-t border-white/5 pb-32">
      <div className="max-w-2xl relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-accent"></span>
          <p className="font-mono text-sm text-accent uppercase tracking-widest">06 — Contact</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Connect</h2>
        <p className="text-lg text-slate-400 leading-relaxed">
          Open to frontend engineering roles and internships where I can apply
          both systems-level thinking and production React experience. Feel
          free to reach out directly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl relative z-10">
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
            className="card p-6 flex flex-col gap-2 hover:border-accent hover:-translate-y-1 hover:shadow-glow transition-all duration-300 group"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">{link.label}</span>
            <span className="text-base text-white group-hover:text-accent-subtle transition-colors">{link.value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
