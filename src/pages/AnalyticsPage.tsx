import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BookOpen, Target, X, FileText, BarChart3, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

interface ChartDataPoint {
  label: string;
  date: string;
  lectures: number;
  questions: number;
  wrong_questions: number;
  dpps: number;
}

interface AnalyticsData {
  chart_data: ChartDataPoint[];
  totals: {
    total_lectures: number;
    total_questions: number;
    total_wrong: number;
    total_dpps: number;
  };
}

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');
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

  const chartData = data?.chart_data || [];
  const totals = data?.totals || {
    total_lectures: 0,
    total_questions: 0,
    total_wrong: 0,
    total_dpps: 0,
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'day': return 'Last 7 Days';
      case 'week': return 'Last 6 Weeks';
      case 'month': return 'Last 12 Months';
      case 'all': return 'All Time';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Advanced Analytics
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive performance tracking with daily, weekly, monthly, and all-time views</p>
        </div>

        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-auto">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="day">Daily</TabsTrigger>
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-semibold mb-1">Lectures Completed</p>
                <p className="text-4xl font-bold text-gray-900">{totals.total_lectures}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-semibold mb-1">Questions Solved</p>
                <p className="text-4xl font-bold text-gray-900">{totals.total_questions}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Target className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-semibold mb-1">Wrong Questions</p>
                <p className="text-4xl font-bold text-gray-900">{totals.total_wrong}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <X className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-semibold mb-1">DPPs Completed</p>
                <p className="text-4xl font-bold text-gray-900">{totals.total_dpps}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <FileText className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lectures Progress Chart */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            📅 {getPeriodLabel()} - Lectures Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                    }}
                  />
                  <Bar dataKey="lectures" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Lectures" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No lecture data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions Progress Chart */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            📊 {getPeriodLabel()} - Questions Solved
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="questions"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Total Questions"
                    dot={{ fill: '#10b981', r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wrong_questions"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Wrong Questions"
                    dot={{ fill: '#ef4444', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No question data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DPPs Progress Chart */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            📘 {getPeriodLabel()} - DPPs Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                    }}
                  />
                  <Bar dataKey="dpps" fill="#f97316" radius={[8, 8, 0, 0]} name="DPPs Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No DPP data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Combined Overview Chart */}
      <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-premium-lg">
        <CardHeader>
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            🗓 {getPeriodLabel()} - Complete Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="lectures" stroke="#3b82f6" strokeWidth={2} name="Lectures" />
                  <Line type="monotone" dataKey="questions" stroke="#10b981" strokeWidth={2} name="Questions" />
                  <Line type="monotone" dataKey="wrong_questions" stroke="#ef4444" strokeWidth={2} name="Wrong" />
                  <Line type="monotone" dataKey="dpps" stroke="#f97316" strokeWidth={2} name="DPPs" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <p>No data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
