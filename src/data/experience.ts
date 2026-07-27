export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: 'Frontend Engineer (UI/UX)',
    org: 'Quantum Logic Limited',
    period: '2026 — Present',
    points: [
      'Engineered and maintained responsive web interfaces, ensuring cross-browser compatibility and performance',
      'Debugged UI issues and optimized frontend code to support overall software stability',
      'Collaborated with cross-functional teams to translate product requirements into deployable features',
      'Managed version control with Git — consistent code review and PR-based feature integration',
    ],
  },
];
