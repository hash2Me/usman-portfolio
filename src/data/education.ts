export type EducationItem = {
  institution: string;
  program: string;
  detail: string;
  courses: string[];
};

export const education: EducationItem[] = [
  {
    institution: 'COMSATS University Islamabad, Lahore Campus',
    program: 'Bachelor of Science, Software Engineering',
    detail: '3rd Semester — in progress',
    courses: [
      'Data Structures (CSC211)',
      'Software Quality Assurance (CSC291)',
      'Software Project Management',
      'Statistics & Probability Theory (MTH-262)',
      'Calculus (MTH104)',
    ],
  },
];
