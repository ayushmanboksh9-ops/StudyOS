// Comprehensive subject catalog organized by academic streams

export const SCIENCE_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Computer Science",
  "Information Technology",
  "Biotechnology",
  "Environmental Science",
  "Electronics",
  "Statistics",
];

export const COMMERCE_SUBJECTS = [
  "Accountancy",
  "Business Studies",
  "Economics",
  "Mathematics",
  "Statistics",
  "Entrepreneurship",
  "Financial Markets",
  "Banking",
  "Insurance",
  "Marketing",
];

export const ARTS_HUMANITIES_SUBJECTS = [
  "History",
  "Political Science",
  "Geography",
  "Sociology",
  "Psychology",
  "Literature",
  "English",
  "Philosophy",
  "Economics",
  "Home Science",
  "Fine Arts",
  "Music",
  "Physical Education",
];

export const ENGINEERING_SUBJECTS = [
  "Engineering Mathematics",
  "Engineering Physics",
  "Engineering Chemistry",
  "Engineering Mechanics",
  "Thermodynamics",
  "Fluid Mechanics",
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "Computer Networks",
  "Database Management",
  "Software Engineering",
];

export const MEDICAL_SUBJECTS = [
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pharmacology",
  "Pathology",
  "Microbiology",
  "Forensic Medicine",
  "Community Medicine",
  "Surgery",
  "Medicine",
];

export const LAW_SUBJECTS = [
  "Constitutional Law",
  "Criminal Law",
  "Civil Law",
  "Contract Law",
  "Corporate Law",
  "International Law",
  "Family Law",
  "Environmental Law",
  "Intellectual Property",
  "Legal Methods",
];

// Subject streams for organized selection
export const SUBJECT_STREAMS = {
  Science: SCIENCE_SUBJECTS,
  Commerce: COMMERCE_SUBJECTS,
  "Arts & Humanities": ARTS_HUMANITIES_SUBJECTS,
  Engineering: ENGINEERING_SUBJECTS,
  Medical: MEDICAL_SUBJECTS,
  Law: LAW_SUBJECTS,
} as const;

// All subjects combined (for search/autocomplete)
export const ALL_SUBJECTS = [
  ...SCIENCE_SUBJECTS,
  ...COMMERCE_SUBJECTS,
  ...ARTS_HUMANITIES_SUBJECTS,
  ...ENGINEERING_SUBJECTS,
  ...MEDICAL_SUBJECTS,
  ...LAW_SUBJECTS,
];

// Remove duplicates
export const UNIQUE_SUBJECTS = Array.from(new Set(ALL_SUBJECTS)).sort();

// Legacy exports for backward compatibility
export const JEE_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Mathematics",
];

export const NEET_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Biology",
];

// Exam-specific subject mapping
export const EXAM_SUBJECTS = {
  JEE: JEE_SUBJECTS,
  NEET: NEET_SUBJECTS,
  "JEE Advanced": JEE_SUBJECTS,
  "JEE Mains": JEE_SUBJECTS,
  BITSAT: [...JEE_SUBJECTS, "English", "Logical Reasoning"],
  "CUET Science": SCIENCE_SUBJECTS,
  "CUET Commerce": COMMERCE_SUBJECTS,
  "CUET Arts": ARTS_HUMANITIES_SUBJECTS,
  GATE: ENGINEERING_SUBJECTS,
  CAT: ["Quantitative Aptitude", "Verbal Ability", "Data Interpretation", "Logical Reasoning"],
  "CA Foundation": ["Accounting", "Business Laws", "Economics", "Quantitative Aptitude"],
  CLAT: ["English", "Logical Reasoning", "Legal Aptitude", "General Knowledge", "Mathematics"],
} as const;

// Exam options
export const EXAMS = [
  "JEE Main",
  "JEE Advanced",
  "NEET UG",
  "BITSAT",
  "CUET Science",
  "CUET Commerce",
  "CUET Arts",
  "GATE",
  "CAT",
  "CLAT",
  "CA Foundation",
  "Other",
];

export const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "Study while others are sleeping; work while others are loafing.",
  "Your future is created by what you do today, not tomorrow.",
  "The difference between ordinary and extraordinary is practice.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success doesn't come from what you do occasionally. It comes from what you do consistently.",
  "The only way to learn mathematics is to do mathematics.",
  "Education is not preparation for life; education is life itself.",
  "The beautiful thing about learning is that no one can take it away from you.",
];

export const PERFORMANCE_MESSAGES = {
  improvement: [
    "Excellent progress! Keep up the momentum! 🚀",
    "You're on fire! Your hard work is paying off! 🔥",
    "Amazing growth! Keep pushing forward! ⭐",
  ],
  decline: [
    "Don't worry! Every setback is a setup for a comeback. 💪",
    "This is just a small dip. You've got what it takes! 🌟",
    "Remember why you started. You're stronger than this! 💫",
    "Great things take time. Keep working, success is near! 🎯",
  ],
};
