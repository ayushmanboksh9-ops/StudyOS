import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Clock,
  Target,
  TrendingUp,
  Award,
  Search,
  Trophy,
  Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CommunityUser {
  user_id: string;
  username: string;
  avatar_url: string | null;
  exam_target: string | null;
  study_minutes: number;
  questions_solved: number;
  accuracy_rate: number;
  sessions_completed: number;
}

export default function CommunityOverview() {
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("today");
  const [sortBy, setSortBy] = useState<"study_time" | "accuracy" | "questions">("study_time");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCommunityStats();
  }, [timeFilter, sortBy]);

  const loadCommunityStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_community_stats", {
        time_filter: timeFilter,
        sort_by: sortBy,
        limit_count: 50,
      });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error loading community stats:", error);
      toast.error("Failed to load community data");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredUsers.slice(0, 3);
  const otherUsers = filteredUsers.slice(3);

  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getFilterLabel = () => {
    switch (timeFilter) {
      case "today":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      default:
        return "Today";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            Community Overview
          </h1>
          <p className="text-gray-600 mt-2">
            See how other students are progressing • {getFilterLabel()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Select value={timeFilter} onValueChange={(v: any) => setTimeFilter(v)}>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-48 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study_time">Study Time</SelectItem>
                  <SelectItem value="accuracy">Accuracy Rate</SelectItem>
                  <SelectItem value="questions">Questions Solved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Leaderboard */}
      {topThree.length > 0 && (
        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-premium-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heading-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {topThree.map((user, index) => (
                <div
                  key={user.user_id}
                  className="relative bg-white rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-smooth group"
                >
                  {/* Rank Badge */}
                  <div
                    className={cn(
                      "absolute -top-3 -right-3 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg",
                      index === 0
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                        : index === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                        : "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                    )}
                  >
                    #{index + 1}
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                      <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {user.username}
                    </h3>
                    {user.exam_target && (
                      <p className="text-sm text-gray-600 mb-4">{user.exam_target}</p>
                    )}

                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between px-3 py-2 bg-violet-50 rounded-lg">
                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Study Time
                        </span>
                        <span className="font-bold text-violet-600">
                          {formatStudyTime(user.study_minutes)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg">
                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                          <Target className="w-4 h-4" />
                          Questions
                        </span>
                        <span className="font-bold text-blue-600">
                          {user.questions_solved}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg">
                        <span className="text-sm text-gray-600 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4" />
                          Accuracy
                        </span>
                        <span className="font-bold text-green-600">
                          {user.accuracy_rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Active Users */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heading-3">
            <Zap className="w-6 h-6 text-violet-600" />
            Active Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center animate-pulse">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Loading community data...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-2">No active users found</p>
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Start studying to appear in the community!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {otherUsers.map((user, index) => (
                <div
                  key={user.user_id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-smooth group"
                >
                  {/* Rank Number */}
                  <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                    {topThree.length + index + 1}
                  </div>

                  {/* Avatar & Info */}
                  <Avatar className="w-12 h-12 border-2 border-gray-200 shadow-sm">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
                      {user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{user.username}</h3>
                    {user.exam_target && (
                      <p className="text-sm text-gray-600">{user.exam_target}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Study Time
                      </div>
                      <div className="font-bold text-violet-600">
                        {formatStudyTime(user.study_minutes)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Questions
                      </div>
                      <div className="font-bold text-blue-600">{user.questions_solved}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Accuracy
                      </div>
                      <div className="font-bold text-green-600">{user.accuracy_rate}%</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Sessions
                      </div>
                      <div className="font-bold text-gray-900">{user.sessions_completed}</div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center px-2 py-1 bg-violet-50 rounded">
                      <div className="font-semibold text-violet-600">
                        {formatStudyTime(user.study_minutes)}
                      </div>
                      <div className="text-gray-600">Time</div>
                    </div>
                    <div className="text-center px-2 py-1 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">{user.accuracy_rate}%</div>
                      <div className="text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-2 border-blue-200 bg-blue-50 shadow-premium">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-blue-900 mb-1">Privacy & Visibility</p>
            <p className="text-sm text-blue-700 leading-relaxed">
              Only users who have enabled public profile visibility appear here. You can control
              your visibility in Settings. No personal data or study details are shared publicly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
