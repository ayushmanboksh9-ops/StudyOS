import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { useAchievements } from "@/hooks/useAchievements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Target, TrendingUp, Clock, ArrowRight, Trophy } from "lucide-react";
import BadgeCard from "@/components/features/BadgeCard";
import DailyHistoryViewer from "@/components/features/DailyHistoryViewer";
import { MOTIVATIONAL_QUOTES } from "@/constants/subjects";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { sessions, practices, exams, loadUserData } = useDataStore();
  const { getUnlockedBadges, checkAndUnlockAchievements, userStats } = useAchievements();

  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    }
  }, [user?.id, loadUserData]);

  useEffect(() => {
    if (userStats) {
      checkAndUnlockAchievements();
    }
  }, [sessions, practices]);

  const today = format(new Date(), "yyyy-MM-dd");
  const todaySessions = sessions.filter((s) => s.date === today);
  const upcomingExams = exams
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalQuestions = practices.reduce((sum, p) => sum + p.totalQuestions, 0);
  const totalWrong = practices.reduce((sum, p) => sum + p.wrongQuestions, 0);
  const accuracy = totalQuestions > 0 ? ((totalQuestions - totalWrong) / totalQuestions * 100).toFixed(1) : 0;

  const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  const recentBadges = getUnlockedBadges().slice(0, 3);

  const nextExam = upcomingExams[0];
  const daysUntilExam = nextExam
    ? Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-white p-8 rounded-2xl border border-violet-100 shadow-premium">
        <h1 className="text-heading-2 text-gray-900 mb-3">
          Welcome back, <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{user?.name?.split(" ")[0]}</span>! 👋
        </h1>
        <p className="text-lg text-gray-600 italic font-medium">&ldquo;{randomQuote}&rdquo;</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-gray-100 hover:border-violet-200 hover:shadow-premium-lg transition-smooth group">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Today's Sessions</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">{todaySessions.length}</div>
            <p className="text-sm text-gray-500 font-medium">
              {todaySessions.filter((s) => s.completed).length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 hover:border-blue-200 hover:shadow-premium-lg transition-smooth group">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Questions Solved</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">{totalQuestions}</div>
            <p className="text-sm text-gray-500 font-medium">{accuracy}% accuracy</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 hover:border-green-200 hover:shadow-premium-lg transition-smooth group">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Accuracy Rate</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 mb-1">{accuracy}%</div>
            <p className="text-sm text-gray-500 font-medium">{totalWrong} wrong answers</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 hover:shadow-premium-lg transition-smooth group">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Next Exam</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Clock className="w-5 h-5 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            {nextExam ? (
              <>
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">{daysUntilExam}d</div>
                <p className="text-sm text-gray-700 font-semibold">{nextExam.name}</p>
              </>
            ) : (
              <div className="text-sm text-gray-500 font-medium">No upcoming exams</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule & Upcoming Exams */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-2 border-gray-100 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-heading-3">Today's Schedule</span>
              <Link to="/daily-planner">
                <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 font-medium">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-3">No sessions planned for today</p>
                <Link to="/daily-planner">
                  <Button variant="outline" className="border-violet-300 text-violet-600 hover:bg-violet-50 font-medium">
                    Plan Your Day
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-smooth border border-gray-100"
                  >
                    <div className={`w-3 h-3 rounded-full ${session.completed ? "bg-green-500" : "bg-violet-500"} shadow-sm`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{session.subject}</div>
                      <div className="text-sm text-gray-500 font-medium">
                        Ch {session.chapter}, Lec {session.lecture}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
                      {session.startTime} - {session.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-100 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-heading-3">Upcoming Exams</span>
              <Link to="/exams">
                <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 font-medium">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-3">No upcoming exams</p>
                <Link to="/exams">
                  <Button variant="outline" className="border-violet-300 text-violet-600 hover:bg-violet-50 font-medium">
                    Schedule an Exam
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExams.slice(0, 5).map((exam) => {
                  const days = Math.ceil(
                    (new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div
                      key={exam.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 hover:border-violet-200 transition-smooth"
                    >
                      <div className="w-16 h-16 rounded-xl bg-white flex flex-col items-center justify-center shadow-sm">
                        <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{days}</div>
                        <div className="text-xs text-gray-600 font-semibold">days</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{exam.name}</div>
                        <div className="text-sm text-gray-600 font-medium">
                          {format(new Date(exam.date), "MMM dd, yyyy")} {exam.time && `at ${exam.time}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily History Viewer */}
      <DailyHistoryViewer />

      {/* Recent Achievements */}
      {recentBadges.length > 0 && (
        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-premium-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-heading-3 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-violet-600" />
                Recent Achievements
              </span>
              <Link to="/achievements">
                <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50/50 font-medium">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {recentBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} unlocked={true} size="md" showProgress={false} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="text-heading-3">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.to}>
                <Button 
                  variant="outline" 
                  className="w-full h-24 flex-col gap-3 border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-smooth group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const quickActions = [
  { to: "/daily-planner", icon: Calendar, label: "Plan Today" },
  { to: "/question-tracker", icon: Target, label: "Log Practice" },
  { to: "/wrong-questions", icon: Target, label: "Wrong Questions" },
  { to: "/analytics", icon: TrendingUp, label: "Analytics" },
];
