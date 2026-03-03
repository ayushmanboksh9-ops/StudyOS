import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, BookOpen, Target, X, FileText } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

interface DailyStats {
  date: string;
  lectures_completed: number;
  questions_solved: number;
  wrong_questions: number;
  dpps_completed: number;
  study_hours: number;
}

export default function DailyHistoryViewer() {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDailyStats = async (date: string) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_daily_stats', {
        target_user_id: user.id,
        target_date: date,
      });

      if (error) throw error;

      setStats(data as DailyStats);
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

        {/* Stats Display - ONLY 4 Metrics */}
        {stats && (
          <div className="space-y-3 animate-fade-in">
            <div className="mb-3 pb-3 border-b-2 border-violet-200">
              <p className="text-sm font-semibold text-gray-700">
                Activity for {format(new Date(selectedDate), "MMMM dd, yyyy")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Total Lectures Completed */}
              <div className="p-5 rounded-xl bg-white border-2 border-blue-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Lectures Completed</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.lectures_completed}</div>
                <div className="text-xs text-gray-600 mt-1.5">
                  Total study time: {stats.study_hours}h
                </div>
              </div>

              {/* 2. Total Questions Solved */}
              <div className="p-5 rounded-xl bg-white border-2 border-green-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Questions Solved</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.questions_solved}</div>
                <div className="text-xs text-gray-600 mt-1.5">
                  Practice questions attempted
                </div>
              </div>

              {/* 3. Total Wrong Questions */}
              <div className="p-5 rounded-xl bg-white border-2 border-red-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Wrong Questions</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.wrong_questions}</div>
                <div className="text-xs text-gray-600 mt-1.5">
                  {stats.questions_solved > 0 
                    ? `${((stats.questions_solved - stats.wrong_questions) / stats.questions_solved * 100).toFixed(1)}% accuracy`
                    : "No data"}
                </div>
              </div>

              {/* 4. Total DPPs Solved */}
              <div className="p-5 rounded-xl bg-white border-2 border-orange-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">DPPs Completed</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.dpps_completed}</div>
                <div className="text-xs text-gray-600 mt-1.5">
                  Daily Practice Problems
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats && 
         stats.lectures_completed === 0 && 
         stats.questions_solved === 0 && 
         stats.wrong_questions === 0 && 
         stats.dpps_completed === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-1">No Activity Recorded</p>
            <p className="text-sm text-gray-600">
              for {format(new Date(selectedDate), "MMMM dd, yyyy")}
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
