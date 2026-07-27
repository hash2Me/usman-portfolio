import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="top">
      {/* Skip link — first focusable element, visible on keyboard focus only */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:border focus:border-slate-300 focus:text-sm"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
