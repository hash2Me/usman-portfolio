export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: 'Core Languages',
    items: ['C++', 'Java', 'Python', 'JavaScript (ES6+)'],
  },
  {
    category: 'Data Structures & Algorithms',
    items: [
      'Queues',
      'Stacks',
      'Linked Lists',
      'Heaps',
      'Hash Maps',
      'Graphs',
      'BFS Traversal',
      'Recursive Backtracking',
      'OOP Design',
    ],
  },
  {
    category: 'Frontend',
    items: ['React.js', 'React Native', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    category: 'Tools & Workflow',
    items: ['Git', 'GitHub', 'REST APIs', 'CMake', 'State Management (Hooks, Context API)'],
  },
];
