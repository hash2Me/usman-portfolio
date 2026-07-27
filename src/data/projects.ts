export type Project = {
  slug: string;
  name: string;
  tagline: string;
  stack: string[];
  description: string;
  highlights: string[];
  technical?: { concept: string; implementation: string; usage: string }[];
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: 'zombie-maze-siege',
    name: 'Zombie Maze Siege',
    tagline: 'DSA-driven 2D multiplayer survival game',
    stack: ['C++17', 'SFML 2.6', 'CMake'],
    description:
      'A two-player survival game where six custom-built data structures — not STL containers — drive every core system: pathfinding, maze generation, fog of war, and the leaderboard.',
    highlights: [
      'Procedural maze generation via Recursive Backtracker, scaling from 11×11 to 27×27 across 5 levels',
      'AI-controlled zombies use BFS pathfinding to hunt the player in real time',
      'Fog of War implemented with a custom open-addressing hash map for O(1) revealed-cell lookups',
      'Persistent leaderboard backed by a hand-built max-heap, top-10 retrieval in O(10 log n)',
    ],
    technical: [
      { concept: 'Queue', implementation: 'Circular array FIFO', usage: 'BFS pathfinding, event queue' },
      { concept: 'Stack', implementation: 'Dynamic array LIFO', usage: 'Maze generation (DFS), move history' },
      { concept: 'Linked List', implementation: 'Singly linked + iterator', usage: 'Replay logger' },
      { concept: 'Max-Heap', implementation: 'Array-backed binary heap', usage: 'Leaderboard, top-10 in O(10 log n)' },
      { concept: 'Hash Map', implementation: 'Open addressing, linear probing', usage: 'Fog of War cell tracking' },
      { concept: 'Graph', implementation: 'Adjacency list', usage: 'Maze cell connectivity' },
    ],
    repoUrl: 'https://github.com/hash2Me/Zombie-Maze-Siege',
  },
  {
    slug: 'ecommerce-dashboard',
    name: 'E-Commerce Frontend Dashboard',
    tagline: 'Scalable product dashboard with live REST data',
    stack: ['React.js', 'CSS'],
    description:
      'A product dashboard built on functional components and custom hooks, integrating external REST APIs with explicit error and loading states rather than happy-path-only rendering.',
    highlights: [
      'Custom hooks encapsulate data-fetching and state logic, kept out of presentational components',
      'Explicit loading/error/empty states for every async boundary',
      'Fully responsive grid layout tested across mobile and desktop breakpoints',
    ],
  },
  {
    slug: 'task-manager',
    name: 'Task Management Application',
    tagline: 'Cross-platform task tracker',
    stack: ['React.js', 'React Native'],
    description:
      'A cross-platform workflow tracker sharing state logic between web and mobile via Context API, translating UI/UX wireframes into accessible, reusable components.',
    highlights: [
      'React Context API for global state shared across create/edit/organize flows',
      'Component structure designed for reuse across React and React Native targets',
      'Accessibility considered at the component level during wireframe translation',
    ],
  },
  {
    slug: 'pf-project',
    name: 'PF-Project',
    tagline: 'Console-based survival game — core programming foundations',
    stack: ['C++'],
    description:
      'An earlier console game built with plain functions, arrays, and file handling — no classes, no libraries beyond the standard basics. The starting point before moving into OOP and custom DSA.',
    highlights: [
      'Resource-management game logic built entirely with functions and arrays',
      'File handling used for persistent data (receipts/records)',
      'Foundational step preceding the OOP + DSA work in Zombie Maze Siege',
    ],
    repoUrl: 'https://github.com/hash2Me/PF-Project',
  },
];
