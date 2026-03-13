import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BookOpen, Target, X, FileText, BarChart3, TrendingUp, Clock, ArrowRight, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";

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

type MetricType = 'lectures' | 'questions' | 'wrong' | 'dpps' | 'overview';

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('overview');

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

  const metrics = [
    {
      id: 'lectures' as MetricType,
      title: 'Lectures Completed',
      value: totals.total_lectures,
      icon: BookOpen,
      color: 'blue',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      chartColor: '#3b82f6',
      description: 'Total study sessions completed',
    },
    {
      id: 'questions' as MetricType,
      title: 'Questions Solved',
      value: totals.total_questions,
      icon: Target,
      color: 'green',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      chartColor: '#10b981',
      description: 'Total practice questions attempted',
    },
    {
      id: 'wrong' as MetricType,
      title: 'Wrong Questions',
      value: totals.total_wrong,
      icon: X,
      color: 'red',
      bgColor: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      chartColor: '#ef4444',
      description: 'Questions that need review',
    },
    {
      id: 'dpps' as MetricType,
      title: 'DPPs Completed',
      value: totals.total_dpps,
      icon: FileText,
      color: 'orange',
      bgColor: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-200',
      chartColor: '#f97316',
      description: 'Daily practice papers solved',
    },
  ];

  const getChartDataForMetric = () => {
    switch (selectedMetric) {
      case 'lectures':
        return chartData.map(d => ({ label: d.label, value: d.lectures }));
      case 'questions':
        return chartData.map(d => ({ label: d.label, value: d.questions, wrong: d.wrong_questions }));
      case 'wrong':
        return chartData.map(d => ({ label: d.label, value: d.wrong_questions }));
      case 'dpps':
        return chartData.map(d => ({ label: d.label, value: d.dpps }));
      default:
        return chartData;
    }
  };

  const getAccuracyData = () => {
    if (totals.total_questions === 0) return [];
    const correct = totals.total_questions - totals.total_wrong;
    return [
      { name: 'Correct', value: correct, color: '#10b981' },
      { name: 'Wrong', value: totals.total_wrong, color: '#ef4444' },
    ];
  };

  const accuracyPercentage = totals.total_questions > 0 
    ? ((totals.total_questions - totals.total_wrong) / totals.total_questions * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-heading-2 flex items-center gap-3 leading-tight">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            Advanced Analytics
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Click on any metric to view detailed graphical analysis</p>
        </div>

        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="day" className="text-xs sm:text-sm">Daily</TabsTrigger>
            <TabsTrigger value="week" className="text-xs sm:text-sm">Weekly</TabsTrigger>
            <TabsTrigger value="month" className="text-xs sm:text-sm">Monthly</TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Interactive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric) => (
          <Card
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={`border-2 ${metric.borderColor} bg-gradient-to-br ${metric.bgColor} shadow-premium hover:shadow-premium-lg transition-all cursor-pointer group active:scale-95 ${
              selectedMetric === metric.id ? 'ring-4 ring-violet-200 scale-[1.02]' : ''
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-1 truncate">{metric.title}</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <metric.icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-${metric.color}-600`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 truncate">{metric.description}</p>
                <ArrowRight className={`w-4 h-4 text-${metric.color}-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overview Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setSelectedMetric('overview')}
          variant={selectedMetric === 'overview' ? 'default' : 'outline'}
          className={`h-11 px-6 font-semibold transition-all ${
            selectedMetric === 'overview'
              ? 'gradient-primary text-white shadow-premium-lg scale-105'
              : 'border-2 border-violet-200 text-violet-700 hover:bg-violet-50'
          }`}
        >
          <Activity className="w-4 h-4 mr-2" />
          View Complete Overview
        </Button>
      </div>

      {/* Dynamic Chart Display Based on Selected Metric */}
      {selectedMetric === 'lectures' && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-premium-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-heading-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              📚 {getPeriodLabel()} - Lectures Completed Analysis
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Track your study session completion trends</p>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-64 sm:h-80 lg:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorLectures" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '11px' }} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #3b82f6',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '14px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lectures" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="url(#colorLectures)"
                        name="Lectures"
                        dot={{ fill: '#3b82f6', r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border-2 border-blue-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{totals.total_lectures}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border-2 border-blue-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Average</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {chartData.length > 0 ? Math.round(totals.total_lectures / chartData.length) : 0}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border-2 border-blue-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Peak</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {Math.max(...chartData.map(d => d.lectures), 0)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No lecture data available for this period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedMetric === 'questions' && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-premium-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-heading-3 flex items-center gap-2">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              🎯 {getPeriodLabel()} - Questions Practice Analysis
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Monitor your question-solving performance and accuracy</p>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-64 sm:h-80 lg:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '11px' }} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #10b981',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '14px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="wrong_questions"
                        stroke="#ef4444"
                        strokeWidth={3}
                        name="Wrong Questions"
                        dot={{ fill: '#ef4444', r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs sm:text-sm text-gray-600">Overall Accuracy</p>
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-green-600">{accuracyPercentage}%</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border-2 border-green-200">
                    {getAccuracyData().length > 0 && (
                      <ResponsiveContainer width="100%" height={80}>
                        <PieChart>
                          <Pie
                            data={getAccuracyData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={20}
                            outerRadius={35}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {getAccuracyData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-600">Correct</p>
                        <p className="font-bold text-green-600">{totals.total_questions - totals.total_wrong}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Wrong</p>
                        <p className="font-bold text-red-600">{totals.total_wrong}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No question data available for this period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedMetric === 'wrong' && (
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-premium-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-heading-3 flex items-center gap-2">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              ⚠️ {getPeriodLabel()} - Wrong Questions Analysis
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Identify areas needing improvement and review patterns</p>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-64 sm:h-80 lg:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '11px' }} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #ef4444',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '14px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="wrong_questions" 
                        fill="#ef4444" 
                        radius={[8, 8, 0, 0]} 
                        name="Wrong Questions"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border-2 border-red-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Wrong</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">{totals.total_wrong}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border-2 border-red-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Error Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">
                      {totals.total_questions > 0 ? ((totals.total_wrong / totals.total_questions) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border-2 border-red-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Needs Review</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">{totals.total_wrong}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <X className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No wrong question data available for this period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedMetric === 'dpps' && (
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-premium-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-heading-3 flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              📝 {getPeriodLabel()} - Daily Practice Papers Analysis
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Track your DPP completion consistency and progress</p>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-64 sm:h-80 lg:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '11px' }} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #f97316',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '14px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="dpps" 
                        fill="#f97316" 
                        radius={[8, 8, 0, 0]} 
                        name="DPPs Completed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border-2 border-orange-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total DPPs</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">{totals.total_dpps}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border-2 border-orange-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Average</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">
                      {chartData.length > 0 ? (totals.total_dpps / chartData.length).toFixed(1) : 0}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border-2 border-orange-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Peak Day</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">
                      {Math.max(...chartData.map(d => d.dpps), 0)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No DPP data available for this period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedMetric === 'overview' && (
        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-premium-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-heading-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
              📊 {getPeriodLabel()} - Complete Performance Overview
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">Comprehensive view of all your study metrics in one place</p>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-72 sm:h-80 lg:h-[28rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" style={{ fontSize: '11px' }} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #8b5cf6',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '14px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '13px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="lectures" 
                        stroke="#3b82f6" 
                        strokeWidth={2.5} 
                        name="Lectures" 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="questions" 
                        stroke="#10b981" 
                        strokeWidth={2.5} 
                        name="Questions" 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="wrong_questions" 
                        stroke="#ef4444" 
                        strokeWidth={2.5} 
                        name="Wrong" 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="dpps" 
                        stroke="#f97316" 
                        strokeWidth={2.5} 
                        name="DPPs" 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-violet-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Performance Summary</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="text-center p-3 bg-gray-50 rounded-lg">
                        <metric.icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-${metric.color}-600`} />
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-xs text-gray-600 truncate">{metric.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No data available for this period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
