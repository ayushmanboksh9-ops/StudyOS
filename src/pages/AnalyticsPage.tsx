import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Target, Calendar, BarChart3, PieChartIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";

interface DailyData {
  date: string;
  sessions: number;
  hours: number;
  questions: number;
  correct_questions: number;
  wrong_questions: number;
}

interface SubjectData {
  subject: string;
  hours: number;
  questions: number;
}

interface AnalyticsData {
  daily: DailyData[];
  by_subject: SubjectData[];
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAnalyticsData();
    }
  }, [user?.id, period]);

  const loadAnalyticsData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data: analyticsData, error } = await supabase.rpc('get_analytics_data', {
        target_user_id: user.id,
        period,
      });

      if (error) throw error;

      setData(analyticsData as AnalyticsData);
    } catch (error: any) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const dailyChartData = data?.daily?.map((d) => ({
    date: format(new Date(d.date), 'MMM dd'),
    hours: Number(d.hours.toFixed(2)),
    questions: d.questions,
    accuracy: d.questions > 0 ? Number(((d.correct_questions / d.questions) * 100).toFixed(1)) : 0,
  })) || [];

  const weeklyChartData = data?.daily?.slice(-7).map((d) => ({
    day: format(new Date(d.date), 'EEE'),
    hours: Number(d.hours.toFixed(2)),
  })) || [];

  const subjectChartData = data?.by_subject?.map((s) => ({
    name: s.subject,
    value: Number(s.hours.toFixed(2)),
  })).filter((s) => s.value > 0) || [];

  const accuracyData = data?.daily?.reduce(
    (acc, d) => {
      acc.correct += d.correct_questions;
      acc.wrong += d.wrong_questions;
      return acc;
    },
    { correct: 0, wrong: 0 }
  ) || { correct: 0, wrong: 0 };

  const accuracyChartData = accuracyData.correct + accuracyData.wrong > 0
    ? [
        { name: 'Correct', value: accuracyData.correct },
        { name: 'Wrong', value: accuracyData.wrong },
      ]
    : [];

  // Calculate trends
  const totalHours = data?.daily?.reduce((sum, d) => sum + d.hours, 0) || 0;
  const totalQuestions = data?.daily?.reduce((sum, d) => sum + d.questions, 0) || 0;
  const overallAccuracy = totalQuestions > 0
    ? ((accuracyData.correct / totalQuestions) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your progress and identify areas for improvement</p>
        </div>

        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-auto">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 shadow-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Study Time</p>
                <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 shadow-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Questions Solved</p>
                <p className="text-3xl font-bold text-gray-900">{totalQuestions}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 shadow-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Accuracy</p>
                <p className="text-3xl font-bold text-gray-900">{overallAccuracy}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Progress Chart */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-600" />
            Daily Progress Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    name="Study Hours"
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="questions"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    name="Questions Solved"
                    dot={{ fill: '#06b6d4', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Bar Chart */}
        <Card className="border-2 border-gray-100 shadow-premium">
          <CardHeader>
            <CardTitle className="text-heading-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-600" />
              Weekly Study Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyChartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                    />
                    <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>No weekly data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accuracy Pie Chart */}
        <Card className="border-2 border-gray-100 shadow-premium">
          <CardHeader>
            <CardTitle className="text-heading-3 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-violet-600" />
              Accuracy Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accuracyChartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accuracyChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>No accuracy data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card className="border-2 border-gray-100 shadow-premium lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-heading-3 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-violet-600" />
              Time Allocation by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjectChartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {subjectChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>No subject data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
