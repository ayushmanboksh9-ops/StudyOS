import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, BookOpen, Target, X, FileText, Clock, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import type { StudySession } from "@/types";

interface DailyStats {
  date: string;
  lectures_completed: number;
  questions_solved: number;
  wrong_questions: number;
  dpps_completed: number;
  study_hours: number;
}

interface SessionData {
  id: string;
  subject: string;
  chapter: string;
  lecture: string;
  start_time: string;
  end_time: string;
  completed: boolean;
}

export default function DailyHistoryViewer() {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDailyStats = async (date: string) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Load stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_daily_stats', {
        target_user_id: user.id,
        target_date: date,
      });

      if (statsError) throw statsError;

      // Load sessions for this date
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('id, subject, chapter, lecture, start_time, end_time, completed')
        .eq('user_id', user.id)
        .eq('date', date)
        .order('start_time', { ascending: true });

      if (sessionsError) throw sessionsError;

      setStats(statsData as DailyStats);
      setSessions(sessionsData || []);
    } catch (error: any) {
      console.error('Error loading daily stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    loadDailyStats(date);
  };

  return (
    <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-heading-3">
          <Calendar className="w-6 h-6 text-violet-600" />
          Dashboard History - Search by Date
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Picker */}
        <div>
          <Label htmlFor="history-date" className="text-sm font-semibold text-gray-700">
            Select Date to View Activity
          </Label>
          <div className="flex gap-3 mt-2">
            <Input
              id="history-date"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="h-12 text-base border-2 border-violet-200"
            />
            <Button
              onClick={() => handleDateChange(selectedDate)}
              disabled={loading}
              className="gradient-primary text-white h-12 px-8 font-semibold shadow-sm hover:shadow-md transition-all"
            >
              {loading ? "Loading..." : "View Stats"}
            </Button>
          </div>
        </div>

        {/* Stats Display */}
        {stats && (
          <div className="space-y-6 animate-fade-in">
            <div className="mb-3 pb-3 border-b-2 border-violet-200">
              <p className="text-sm font-semibold text-gray-700">
                Activity for {format(new Date(selectedDate), "MMMM dd, yyyy")}
              </p>
            </div>

            {/* Summary Stats - 2 Key Metrics */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Total Lectures Completed */}
              <div className="p-6 rounded-xl bg-white border-2 border-blue-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-700 block">Lectures Completed</span>
                    <span className="text-xs text-gray-500">Total study time: {stats.study_hours}h</span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900">{stats.lectures_completed}</div>
              </div>

              {/* 2. Total Questions Practiced */}
              <div className="p-6 rounded-xl bg-white border-2 border-green-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center">
                    <Target className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-700 block">Questions Practiced</span>
                    <span className="text-xs text-gray-500">
                      {stats.questions_solved > 0 
                        ? `${((stats.questions_solved - stats.wrong_questions) / stats.questions_solved * 100).toFixed(1)}% accuracy`
                        : "No practice data"}
                    </span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900">{stats.questions_solved}</div>
              </div>
            </div>

            {/* Lectures Completed - Detailed List */}
            {sessions.filter(s => s.completed).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  📚 Lectures You Completed ({sessions.filter(s => s.completed).length})
                </h4>
                <div className="grid gap-3">
                  {sessions.filter(s => s.completed).map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-bold text-gray-900">{session.subject}</h5>
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                              ✓ Done
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            Chapter {session.chapter}, Lecture {session.lecture}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">{session.start_time} - {session.end_time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions Practice Summary */}
            {stats.questions_solved > 0 && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">📝 Questions Practice Summary</h4>
                    <p className="text-sm text-gray-600">Your practice performance</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{stats.questions_solved}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Solved</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{stats.questions_solved - stats.wrong_questions}</div>
                    <div className="text-xs text-gray-600 mt-1">Correct</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-600">{stats.wrong_questions}</div>
                    <div className="text-xs text-gray-600 mt-1">Wrong</div>
                  </div>
                </div>
              </div>
            )}

            {/* All Study Sessions */}
            {sessions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-600" />
                  All Study Sessions ({sessions.length})
                </h4>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        session.completed
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {session.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-gray-900">{session.subject}</h5>
                            {session.completed ? (
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                Completed
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                                Planned
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Chapter {session.chapter}, Lecture {session.lecture}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            {session.start_time} - {session.end_time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {stats && 
         stats.lectures_completed === 0 && 
         stats.questions_solved === 0 && 
         stats.wrong_questions === 0 && 
         stats.dpps_completed === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-900 font-bold text-xl mb-2">📭 No Study Statistics</p>
            <p className="text-gray-600 text-base mb-1">
              You had no study activity on
            </p>
            <p className="text-gray-900 font-semibold text-lg">
              {format(new Date(selectedDate), "MMMM dd, yyyy")}
            </p>
            <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
              {selectedDate === format(new Date(), "yyyy-MM-dd") 
                ? "Start your study session today to track your progress!"
                : "No lectures completed, questions practiced, or DPPs solved on this day."}
            </p>
          </div>
        )}

        {/* Initial State */}
        {!stats && !loading && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-violet-600" />
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-1">Select a Date</p>
            <p className="text-sm text-gray-600">
              View your daily performance and track your progress
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
