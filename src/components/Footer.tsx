export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-content mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-slate-500 font-medium">
          © {new Date().getFullYear()} Usman Mubarak. Built with React &amp; Tailwind CSS.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/hash2Me"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/usman-mubarak-software-engineer"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a href="#top" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
