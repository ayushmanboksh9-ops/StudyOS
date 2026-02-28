import { create } from "zustand";
import { toast } from "sonner";
import type {
  StudySession,
  Practice,
  WrongQuestion,
  Exam,
  WeeklyGoal,
  MonthlyGoal,
  DPP,
  Note,
} from "@/types";

interface DataStore {
  // Study Sessions
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, "id">) => void;
  updateSession: (id: string, updates: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  getSessions: (date: string) => StudySession[];

  // Question Practice
  practices: Practice[];
  addPractice: (practice: Omit<Practice, "id">) => void;

  // Wrong Questions
  wrongQuestions: WrongQuestion[];
  addWrongQuestion: (question: Omit<WrongQuestion, "id">) => void;
  markAsRepeated: (id: string) => void;

  // Exams
  exams: Exam[];
  addExam: (exam: Omit<Exam, "id">) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;

  // Weekly Goals
  weeklyGoals: WeeklyGoal[];
  addWeeklyGoal: (goal: Omit<WeeklyGoal, "id">) => void;
  toggleWeeklyGoal: (id: string) => void;

  // Monthly Goals
  monthlyGoals: MonthlyGoal[];
  addMonthlyGoal: (goal: Omit<MonthlyGoal, "id">) => void;
  toggleMonthlyGoal: (id: string) => void;

  // DPP
  dpps: DPP[];
  addDPP: (dpp: Omit<DPP, "id">) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, "id">) => void;
  deleteNote: (id: string) => void;

  // Load user data
  loadUserData: (userId: string) => void;
}

// Simple localStorage helpers
const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  getUserKey: (userId: string, type: string) => `studyos_${userId}_${type}`,
};

export const useDataStore = create<DataStore>((set, get) => ({
  sessions: [],
  practices: [],
  wrongQuestions: [],
  exams: [],
  weeklyGoals: [],
  monthlyGoals: [],
  dpps: [],
  notes: [],

  loadUserData: (userId: string) => {
    const sessions = storage.get<StudySession[]>(storage.getUserKey(userId, "sessions")) || [];
    const practices = storage.get<Practice[]>(storage.getUserKey(userId, "practices")) || [];
    const wrongQuestions = storage.get<WrongQuestion[]>(storage.getUserKey(userId, "wrongQuestions")) || [];
    const exams = storage.get<Exam[]>(storage.getUserKey(userId, "exams")) || [];
    const weeklyGoals = storage.get<WeeklyGoal[]>(storage.getUserKey(userId, "weeklyGoals")) || [];
    const monthlyGoals = storage.get<MonthlyGoal[]>(storage.getUserKey(userId, "monthlyGoals")) || [];
    const dpps = storage.get<DPP[]>(storage.getUserKey(userId, "dpps")) || [];
    const notes = storage.get<Note[]>(storage.getUserKey(userId, "notes")) || [];

    set({ sessions, practices, wrongQuestions, exams, weeklyGoals, monthlyGoals, dpps, notes });
  },

  addSession: (session) => {
    const newSession = { ...session, id: Date.now().toString() };
    const sessions = [...get().sessions, newSession];
    set({ sessions });
    storage.set(storage.getUserKey(session.userId, "sessions"), sessions);
    toast.success("Study session added!");
  },

  updateSession: (id, updates) => {
    const sessions = get().sessions.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    set({ sessions });
    const userId = sessions.find((s) => s.id === id)?.userId;
    if (userId) {
      storage.set(storage.getUserKey(userId, "sessions"), sessions);
    }
  },

  deleteSession: (id) => {
    const session = get().sessions.find((s) => s.id === id);
    const sessions = get().sessions.filter((s) => s.id !== id);
    set({ sessions });
    if (session) {
      storage.set(storage.getUserKey(session.userId, "sessions"), sessions);
      toast.success("Session deleted");
    }
  },

  getSessions: (date) => {
    return get().sessions.filter((s) => s.date === date);
  },

  addPractice: (practice) => {
    const newPractice = { ...practice, id: Date.now().toString() };
    const practices = [...get().practices, newPractice];
    set({ practices });
    storage.set(storage.getUserKey(practice.userId, "practices"), practices);
    toast.success("Practice logged!");
  },

  addWrongQuestion: (question) => {
    const newQuestion = { ...question, id: Date.now().toString() };
    const wrongQuestions = [...get().wrongQuestions, newQuestion];
    set({ wrongQuestions });
    storage.set(storage.getUserKey(question.userId, "wrongQuestions"), wrongQuestions);
    toast.success("Wrong question saved!");
  },

  markAsRepeated: (id) => {
    const wrongQuestions = get().wrongQuestions.map((q) =>
      q.id === id ? { ...q, repeated: true } : q
    );
    set({ wrongQuestions });
    const question = wrongQuestions.find((q) => q.id === id);
    if (question) {
      storage.set(storage.getUserKey(question.userId, "wrongQuestions"), wrongQuestions);
      toast.info("Marked as repeated mistake");
    }
  },

  addExam: (exam) => {
    const newExam = { ...exam, id: Date.now().toString() };
    const exams = [...get().exams, newExam];
    set({ exams });
    storage.set(storage.getUserKey(exam.userId, "exams"), exams);
    toast.success("Exam scheduled!");
  },

  updateExam: (id, updates) => {
    const exams = get().exams.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    set({ exams });
    const exam = exams.find((e) => e.id === id);
    if (exam) {
      storage.set(storage.getUserKey(exam.userId, "exams"), exams);
    }
  },

  addWeeklyGoal: (goal) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    const weeklyGoals = [...get().weeklyGoals, newGoal];
    set({ weeklyGoals });
    storage.set(storage.getUserKey(goal.userId, "weeklyGoals"), weeklyGoals);
    toast.success("Weekly goal added!");
  },

  toggleWeeklyGoal: (id) => {
    const weeklyGoals = get().weeklyGoals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    set({ weeklyGoals });
    const goal = weeklyGoals.find((g) => g.id === id);
    if (goal) {
      storage.set(storage.getUserKey(goal.userId, "weeklyGoals"), weeklyGoals);
    }
  },

  addMonthlyGoal: (goal) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    const monthlyGoals = [...get().monthlyGoals, newGoal];
    set({ monthlyGoals });
    storage.set(storage.getUserKey(goal.userId, "monthlyGoals"), monthlyGoals);
    toast.success("Monthly goal added!");
  },

  toggleMonthlyGoal: (id) => {
    const monthlyGoals = get().monthlyGoals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    set({ monthlyGoals });
    const goal = monthlyGoals.find((g) => g.id === id);
    if (goal) {
      storage.set(storage.getUserKey(goal.userId, "monthlyGoals"), monthlyGoals);
    }
  },

  addDPP: (dpp) => {
    const newDPP = { ...dpp, id: Date.now().toString() };
    const dpps = [...get().dpps, newDPP];
    set({ dpps });
    storage.set(storage.getUserKey(dpp.userId, "dpps"), dpps);
    toast.success("DPP result added!");
  },

  addNote: (note) => {
    const newNote = { ...note, id: Date.now().toString() };
    const notes = [...get().notes, newNote];
    set({ notes });
    storage.set(storage.getUserKey(note.userId, "notes"), notes);
    toast.success("Note saved!");
  },

  deleteNote: (id) => {
    const note = get().notes.find((n) => n.id === id);
    const notes = get().notes.filter((n) => n.id !== id);
    set({ notes });
    if (note) {
      storage.set(storage.getUserKey(note.userId, "notes"), notes);
      toast.success("Note deleted");
    }
  },
}));
