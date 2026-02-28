import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Target, BookOpen, TrendingUp, Award } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

interface DailyStats {
  date: string;
  sessions: {
    total: number;
    completed: number;
    hours: number;
  };
  questions: {
    total: number;
    correct: number;
    wrong: number;
    accuracy: number;
  };
  dpps: {
    count: number;
    marks: number;
    max_marks: number;
    percentage: number;
  };
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
          Daily History Viewer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Picker */}
        <div>
          <Label htmlFor="history-date">Select Date</Label>
          <div className="flex gap-3 mt-1.5">
            <Input
              id="history-date"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
              className="h-11"
            />
            <Button
              onClick={() => handleDateChange(selectedDate)}
              disabled={loading}
              className="gradient-primary text-white h-11 px-6 font-semibold"
            >
              {loading ? "Loading..." : "View Stats"}
            </Button>
          </div>
        </div>

        {/* Stats Display */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            {/* Study Sessions */}
            <div className="p-4 rounded-xl bg-white border-2 border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Study Time</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.sessions.hours}h</div>
              <div className="text-xs text-gray-600 mt-1">
                {stats.sessions.completed}/{stats.sessions.total} sessions completed
              </div>
            </div>

            {/* Questions */}
            <div className="p-4 rounded-xl bg-white border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Questions</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.questions.total}</div>
              <div className="text-xs text-gray-600 mt-1">
                {stats.questions.correct} correct • {stats.questions.wrong} wrong
              </div>
            </div>

            {/* Accuracy */}
            <div className="p-4 rounded-xl bg-white border-2 border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.questions.accuracy}%</div>
              <div className="text-xs text-gray-600 mt-1">
                {stats.questions.total > 0 ? "Based on solved questions" : "No data"}
              </div>
            </div>

            {/* DPP */}
            <div className="p-4 rounded-xl bg-white border-2 border-orange-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">DPP Score</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.dpps.count > 0 ? `${stats.dpps.percentage}%` : "N/A"}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {stats.dpps.count} DPP{stats.dpps.count !== 1 ? "s" : ""} completed
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {stats && stats.sessions.total === 0 && stats.questions.total === 0 && stats.dpps.count === 0 && (
          <div className="text-center py-8 bg-white rounded-xl border-2 border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No activity recorded for this date</p>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(selectedDate), "MMMM dd, yyyy")}
            </p>
          </div>
        )}

        {/* Info */}
        {!stats && !loading && (
          <div className="text-center py-8 bg-white rounded-xl border-2 border-gray-200">
            <Award className="w-12 h-12 mx-auto mb-3 text-violet-400" />
            <p className="text-gray-600 font-medium">Select a date to view your daily performance</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
