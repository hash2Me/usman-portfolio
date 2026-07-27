import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on Escape for keyboard accessibility
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/70 backdrop-blur-md border-b border-white/10 shadow-glass py-2' : 'bg-transparent py-4'
      }`}
    >
      <nav
        className="max-w-content mx-auto px-6 md:px-10 flex items-center justify-between"
        aria-label="Primary"
      >
        <a
          href="#top"
          className="font-mono text-base font-bold text-white tracking-tight hover:scale-105 transition-transform"
        >
          usman<span className="text-white animate-pulse">_</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-6">
          <a
            href="https://github.com/hash2Me"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a href="#contact" className="btn-primary py-2 px-5 text-xs">
            Contact
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-slate-300 hover:text-white transition-colors"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <ul className="flex flex-col px-6 py-6 gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg px-4 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/hash2Me"
                target="_blank"
                rel="noreferrer"
                className="block py-3 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg px-4 transition-colors"
              >
                GitHub
              </a>
            </li>
            <li className="pt-4 px-4">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
