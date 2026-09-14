import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import Avatar from './components/Avatar';
import SectionDivider from './components/SectionDivider';

export default function App() {
  return (
    <div id="top" className="relative">
      {/* Skip link — first focusable element, visible on keyboard focus only */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:border-2 focus:border-black focus:text-black focus:font-bold focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Global animated background */}
      <AnimatedBackground />

      {/* CEO Avatar that walks around the portfolio */}
      <Avatar />

      <Navbar />

      <main id="main-content" className="relative z-10">
        <Hero />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Education />
        <SectionDivider />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
