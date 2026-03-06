import { create } from "zustand";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
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
  addSession: (session: Omit<StudySession, "id">) => Promise<void>;
  updateSession: (id: string, updates: Partial<StudySession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  getSessions: (date: string) => StudySession[];
  loadSessions: (userId: string) => Promise<void>;

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

  loadSessions: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Convert database format to app format
      const sessions: StudySession[] = (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        subject: item.subject,
        chapter: item.chapter,
        lecture: item.lecture,
        date: item.date,
        startTime: item.start_time,
        endTime: item.end_time,
        completed: item.completed,
        reminder: item.reminder,
        extended: item.extended || 0,
      }));

      set({ sessions });
    } catch (error: any) {
      console.error('Error loading sessions:', error);
    }
  },

  loadUserData: (userId: string) => {
    // Load sessions from database
    get().loadSessions(userId);
    
    // Load other data from localStorage for now
    const practices = storage.get<Practice[]>(storage.getUserKey(userId, "practices")) || [];
    const wrongQuestions = storage.get<WrongQuestion[]>(storage.getUserKey(userId, "wrongQuestions")) || [];
    const exams = storage.get<Exam[]>(storage.getUserKey(userId, "exams")) || [];
    const weeklyGoals = storage.get<WeeklyGoal[]>(storage.getUserKey(userId, "weeklyGoals")) || [];
    const monthlyGoals = storage.get<MonthlyGoal[]>(storage.getUserKey(userId, "monthlyGoals")) || [];
    const dpps = storage.get<DPP[]>(storage.getUserKey(userId, "dpps")) || [];
    const notes = storage.get<Note[]>(storage.getUserKey(userId, "notes")) || [];

    set({ practices, wrongQuestions, exams, weeklyGoals, monthlyGoals, dpps, notes });
  },

  addSession: async (session) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: session.userId,
          subject: session.subject,
          chapter: session.chapter,
          lecture: session.lecture,
          date: session.date,
          start_time: session.startTime,
          end_time: session.endTime,
          completed: session.completed || false,
          reminder: session.reminder || true,
          extended: session.extended || 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Convert database format to app format
      const newSession: StudySession = {
        id: data.id,
        userId: data.user_id,
        subject: data.subject,
        chapter: data.chapter,
        lecture: data.lecture,
        date: data.date,
        startTime: data.start_time,
        endTime: data.end_time,
        completed: data.completed,
        reminder: data.reminder,
        extended: data.extended,
      };

      const sessions = [...get().sessions, newSession];
      set({ sessions });
      toast.success("Study session added!");
    } catch (error: any) {
      console.error('Error adding session:', error);
      toast.error('Failed to add session');
    }
  },

  updateSession: async (id, updates) => {
    try {
      // Convert camelCase to snake_case for database
      const dbUpdates: any = {};
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.startTime) dbUpdates.start_time = updates.startTime;
      if (updates.endTime) dbUpdates.end_time = updates.endTime;
      if (updates.extended !== undefined) dbUpdates.extended = updates.extended;
      if (updates.reminder !== undefined) dbUpdates.reminder = updates.reminder;
      
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('study_sessions')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      const sessions = get().sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      );
      set({ sessions });
    } catch (error: any) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
    }
  },

  deleteSession: async (id) => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const sessions = get().sessions.filter((s) => s.id !== id);
      set({ sessions });
      toast.success("Session deleted");
    } catch (error: any) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
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
