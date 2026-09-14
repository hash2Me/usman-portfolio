export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-black">
      <div className="max-w-content mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-base text-white font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Usman Mubarak.
        </p>
        <div className="flex items-center gap-8">
          <a
            href="https://github.com/hash2Me"
            target="_blank"
            rel="noreferrer"
            className="text-base font-bold text-white uppercase tracking-widest hover:underline transition-all"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/usman-mubarak-software-engineer"
            target="_blank"
            rel="noreferrer"
            className="text-base font-bold text-white uppercase tracking-widest hover:underline transition-all"
          >
            LinkedIn
          </a>
          <a href="#top" className="text-base font-bold text-black bg-white px-4 py-2 uppercase tracking-widest hover:-translate-y-1 hover:shadow-hard-sm transition-transform">
            Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
