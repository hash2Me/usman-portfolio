/**
 * Client-side assistant knowledge engine.
 * Ensures the chatbot immediately and accurately responds even if the backend,
 * Vercel serverless functions, or external API keys are unavailable.
 */

export function getClientAssistantReply(rawQuery: string): string {
  const q = rawQuery.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|sup|yo|greetings|howdy|hoi)\b/i.test(q)) {
    return "Hey there! 👋 I'm Usman's portfolio AI buddy. Want to check out his C++ Zombie game or his work at Quantum Logic?";
  }

  // Who is Usman / About
  if (q.includes('who is') || q.includes('about usman') || q.includes('who are you') || q.includes('introduce')) {
    return "Usman is a Software Engineering student at COMSATS Lahore and a Frontend Engineer at Quantum Logic Limited! He loves building slick React interfaces and coding low-level DSA in C++. What would you like to explore?";
  }

  // Zombie Maze Siege / Games
  if (q.includes('zombie') || q.includes('maze') || q.includes('siege') || q.includes('game')) {
    return "Zombie Maze Siege is Usman's standout 2D survival game built in C++17 & SFML! Instead of using standard STL containers, he coded 6 custom data structures from scratch (Queue, Stack, Linked List, Max-Heap, Hash Map, Graph) with BFS zombie AI. Pretty cool, right?";
  }

  // Projects general
  if (q.includes('project') || q.includes('build') || q.includes('portfolio') || q.includes('work done') || q.includes('created')) {
    return "Usman's main projects are:\n• **Zombie Maze Siege**: 2D C++17 survival game with 6 custom DSA structures & BFS AI.\n• **E-Commerce Dashboard**: Live REST React dashboard with custom hooks.\n• **Task Manager**: Cross-platform web & mobile app with Context API.\n\nWant the technical details on any of these?";
  }

  // Tech stack / Skills / Languages
  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('dsa') || q.includes('react') || q.includes('c++')) {
    return "His core languages are **C++, Java, Python, and JavaScript**. On the frontend, he rocks **React.js, React Native, and Tailwind CSS**, backed by deep custom DSA expertise! Curious about his frontend work or DSA?";
  }

  // Experience / Job / Company / Quantum Logic
  if (q.includes('experience') || q.includes('job') || q.includes('work') || q.includes('company') || q.includes('quantum') || q.includes('role')) {
    return "Usman works as a **Frontend Engineer (UI/UX)** at **Quantum Logic Limited** (2026 — Present), building responsive web interfaces, optimizing UI performance, and working in agile Git workflows. Want to hear more about his day-to-day?";
  }

  // Education / University / Degree
  if (q.includes('education') || q.includes('university') || q.includes('college') || q.includes('degree') || q.includes('comsats') || q.includes('study') || q.includes('semester')) {
    return "Usman is studying for his **BS in Software Engineering** at **COMSATS University Islamabad (Lahore Campus)**, currently in his 3rd semester tackling Data Structures, SQA, and calculus! Want to know about his coursework?";
  }

  // Contact / Hire / Socials
  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('github') || q.includes('linkedin')) {
    return "You can reach Usman right down in the Contact section, or connect with him via his GitHub (@hash2Me) and LinkedIn! Ready to get in touch?";
  }

  // Default friendly fallback
  return "Usman is a Software Engineering student & Frontend Engineer specializing in custom DSA (C++) and responsive React apps! Feel free to ask about his Zombie Maze Siege game, tech stack, or work experience!";
}
