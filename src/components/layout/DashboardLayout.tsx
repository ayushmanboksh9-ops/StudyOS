import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import SessionAlertManager from "@/components/features/SessionAlertManager";
import ExamReminderManager from "@/components/features/ExamReminderManager";

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const { loadUserData } = useDataStore();

  useEffect(() => {
    if (user) {
      loadUserData(user.id);
    }
  }, [user, loadUserData]);

  return (
    <div className="min-h-screen paper-texture">
      <Header />
      <div className="flex">
        <Sidebar />
        {/* Mobile: full width with bottom padding for floating action button */}
        {/* Desktop: offset by sidebar */}
        <main className="flex-1 w-full lg:ml-64 mt-16 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>
      
      {/* Background managers for alerts and reminders */}
      <SessionAlertManager />
      <ExamReminderManager />
    </div>
  );
}
