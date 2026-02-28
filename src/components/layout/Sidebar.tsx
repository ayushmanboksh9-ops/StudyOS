
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Target,
  CalendarDays,
  CalendarRange,
  FileText,
  BookOpen,
  XCircle,
  BarChart3,
  Settings,
  GraduationCap,
  Menu,
  X,
  Users,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/daily-planner", icon: Calendar, label: "Daily Planner" },
  { to: "/question-tracker", icon: Target, label: "Question Tracker" },
  { to: "/exams", icon: GraduationCap, label: "Exams" },
  { to: "/weekly-planner", icon: CalendarDays, label: "Weekly Planner" },
  { to: "/monthly-planner", icon: CalendarRange, label: "Monthly Planner" },
  { to: "/dpp", icon: FileText, label: "DPP" },
  { to: "/notes", icon: BookOpen, label: "Notes" },
  { to: "/wrong-questions", icon: XCircle, label: "Wrong Questions" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/achievements", icon: Trophy, label: "Achievements", highlight: true },
  { to: "/community", icon: Users, label: "Community Overview" },
  { to: "/manage-subjects", icon: BookOpen, label: "Manage Subjects" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative",
                  isActive
                    ? item.highlight
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium shadow-premium"
                      : "bg-violet-100 text-violet-700 font-medium shadow-sm"
                    : item.highlight
                    ? "text-violet-700 hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100 border-2 border-violet-200"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.highlight && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full shadow-sm" />
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
