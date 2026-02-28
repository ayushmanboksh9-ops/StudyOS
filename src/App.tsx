
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import DailyPlanner from "@/pages/DailyPlanner";
import QuestionTracker from "@/pages/QuestionTracker";
import ExamsPage from "@/pages/ExamsPage";
import WeeklyPlanner from "@/pages/WeeklyPlanner";
import MonthlyPlanner from "@/pages/MonthlyPlanner";
import DPPPage from "@/pages/DPPPage";
import NotesPage from "@/pages/NotesPage";
import WrongQuestionsPage from "@/pages/WrongQuestionsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import CommunityOverview from "@/pages/CommunityOverview";
import AchievementsPage from "@/pages/AchievementsPage";
import ManageSubjectsPage from "@/pages/ManageSubjectsPage";

function App() {
  const { isAuthenticated, loading } = useAuthStore();

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <p className="text-gray-600 font-medium">Loading StudyOS...</p>
        </div>
      </div>
    );
  } // Added closing brace for the `if (loading)` block

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
          />
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/" />}
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="daily-planner" element={<DailyPlanner />} />
            <Route path="question-tracker" element={<QuestionTracker />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="weekly-planner" element={<WeeklyPlanner />} />
            <Route path="monthly-planner" element={<MonthlyPlanner />} />
            <Route path="dpp" element={<DPPPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="wrong-questions" element={<WrongQuestionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="community" element={<CommunityOverview />} />
            <Route path="manage-subjects" element={<ManageSubjectsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
