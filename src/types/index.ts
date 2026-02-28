import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
  createdAt?: string;
  exam?: string;
  subjects?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface StudySession {
  id: string;
  userId: string;
  subject: string;
  chapter: string;
  lecture: string;
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  reminder: boolean;
  extended?: number;
}

export interface Practice {
  id: string;
  userId: string;
  subject: string;
  date: string;
  totalQuestions: number;
  wrongQuestions: number;
}

export interface WrongQuestion {
  id: string;
  userId: string;
  subject: string;
  date: string;
  imageUrl?: string;
  notes?: string;
  repeated?: boolean;
}

export interface Exam {
  id: string;
  userId: string;
  name: string;
  date: string;
  time?: string;
  resultDate?: string;
  feedbackGiven?: boolean;
  lastReminderDate?: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  examId: string;
  marks: Record<string, number>;
  totalMarks: number;
  date: string;
}

export interface WeeklyGoal {
  id: string;
  userId: string;
  goal: string;
  startDate?: string;
  endDate?: string;
  completed: boolean;
}

export interface MonthlyGoal {
  id: string;
  userId: string;
  goal: string;
  month: string;
  progress: number;
}

export interface DPP {
  id: string;
  userId: string;
  subject: string;
  date: string;
  marks: number;
  totalMarks: number;
}

export interface Note {
  id: string;
  userId: string;
  subject: string;
  chapter: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
}

export interface DataState {
  sessions: StudySession[];
  practices: Practice[];
  wrongQuestions: WrongQuestion[];
  exams: Exam[];
  examResults: ExamResult[];
  weeklyGoals: WeeklyGoal[];
  monthlyGoals: MonthlyGoal[];
  dpps: DPP[];
  notes: Note[];
  
  addSession: (session: Omit<StudySession, 'id'>) => void;
  updateSession: (id: string, data: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  
  addPractice: (practice: Omit<Practice, 'id'>) => void;
  addWrongQuestion: (question: Omit<WrongQuestion, 'id'>) => void;
  
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, data: Partial<Exam>) => void;
  addExamResult: (result: Omit<ExamResult, 'id'>) => void;
  
  addWeeklyGoal: (goal: Omit<WeeklyGoal, 'id'>) => void;
  toggleWeeklyGoal: (id: string) => void;
  
  addMonthlyGoal: (goal: Omit<MonthlyGoal, 'id'>) => void;
  updateMonthlyGoal: (id: string, progress: number) => void;
  
  addDPP: (dpp: Omit<DPP, 'id'>) => void;
  addNote: (note: Omit<Note, 'id'>) => void;
}
