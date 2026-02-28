import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubjectSelector from "@/components/features/SubjectSelector";
import { useCustomSubjects } from "@/hooks/useCustomSubjects";
import { Plus, Trash2, Clock, CheckCircle2, AlertCircle, Bell, Calendar } from "lucide-react";
import { format, parse, addMinutes } from "date-fns";
import { toast } from "sonner";
import type { StudySession } from "@/types";
import { useSessionAlerts } from "@/hooks/useSessionAlerts";
import SessionCompletionModal from "@/components/features/SessionCompletionModal";
import SessionStartAlert from "@/components/features/SessionStartAlert";

export default function DailyPlanner() {
  const { user } = useAuthStore();
  const { sessions, addSession, updateSession, deleteSession, getSessions } = useDataStore();
  const { customSubjects, addCustomSubject } = useCustomSubjects();
  const today = format(new Date(), "yyyy-MM-dd");
  const todaySessions = getSessions(today);

  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [lecture, setLecture] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reminder, setReminder] = useState(true);

  // Session alerts
  const { activeAlert, dismissAlert, markSessionCompleted } = useSessionAlerts(todaySessions);

  const calculateTotalHours = () => {
    let totalMinutes = 0;
    todaySessions.forEach((session) => {
      try {
        const start = parse(session.startTime, "HH:mm", new Date());
        const end = parse(session.endTime, "HH:mm", new Date());
        const diff = (end.getTime() - start.getTime()) / (1000 * 60);
        totalMinutes += diff;
      } catch (error) {
        console.error("Error calculating time:", error);
      }
    });
    return (totalMinutes / 60).toFixed(1);
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validation
    if (!subject || !chapter || !lecture || !startTime || !endTime) {
      toast.error("Please fill all fields");
      return;
    }

    const start = parse(startTime, "HH:mm", new Date());
    const end = parse(endTime, "HH:mm", new Date());

    if (end <= start) {
      toast.error("End time must be after start time");
      return;
    }

    // Check if total time exceeds 24 hours
    const sessionMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const currentTotalMinutes = todaySessions.reduce((sum, s) => {
      const sStart = parse(s.startTime, "HH:mm", new Date());
      const sEnd = parse(s.endTime, "HH:mm", new Date());
      return sum + (sEnd.getTime() - sStart.getTime()) / (1000 * 60);
    }, 0);

    if (currentTotalMinutes + sessionMinutes > 24 * 60) {
      toast.error("⚠️ Total study time cannot exceed 24 hours!", {
        description: "Please adjust your session times",
      });
      return;
    }

    addSession({
      userId: user.id,
      subject,
      chapter,
      lecture,
      date: today,
      startTime,
      endTime,
      completed: false,
      reminder,
    });

    // Reset form
    setSubject("");
    setChapter("");
    setLecture("");
    setStartTime("");
    setEndTime("");
    setReminder(true);
  };

  const handleCompleteSession = (sessionId: string) => {
    updateSession(sessionId, { completed: true });
    markSessionCompleted(sessionId);
    toast.success("Session completed! Great work! 🎉");
  };

  const handleExtendSession = (sessionId: string, minutes: number) => {
    const session = todaySessions.find((s) => s.id === sessionId);
    if (!session) return;

    try {
      // Calculate new end time
      const currentEnd = parse(session.endTime, "HH:mm", new Date());
      const newEnd = addMinutes(currentEnd, minutes);
      const newEndTime = format(newEnd, "HH:mm");

      // Update this session
      updateSession(sessionId, {
        endTime: newEndTime,
        extended: (session.extended || 0) + minutes,
      });

      // Shift all subsequent sessions
      const sessionEndMinutes = currentEnd.getHours() * 60 + currentEnd.getMinutes();
      todaySessions.forEach((s) => {
        if (s.id === sessionId) return;
        
        const sStart = parse(s.startTime, "HH:mm", new Date());
        const sStartMinutes = sStart.getHours() * 60 + sStart.getMinutes();
        
        if (sStartMinutes >= sessionEndMinutes) {
          const adjustedStart = addMinutes(sStart, minutes);
          const sEnd = parse(s.endTime, "HH:mm", new Date());
          const adjustedEnd = addMinutes(sEnd, minutes);
          
          updateSession(s.id, {
            startTime: format(adjustedStart, "HH:mm"),
            endTime: format(adjustedEnd, "HH:mm"),
          });
        }
      });

      markSessionCompleted(sessionId);
      toast.success(`Extended by ${minutes} minutes. Remaining sessions adjusted! ⏰`);
    } catch (error) {
      console.error("Error extending session:", error);
      toast.error("Failed to extend session");
    }
  };

  const totalHours = calculateTotalHours();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alerts */}
      {activeAlert?.type === 'start' && (
        <SessionStartAlert
          open={true}
          onClose={dismissAlert}
          session={activeAlert.session}
        />
      )}

      {activeAlert?.type === 'end' && (
        <SessionCompletionModal
          open={true}
          onClose={dismissAlert}
          session={activeAlert.session}
          onComplete={() => handleCompleteSession(activeAlert.session.id)}
          onExtend={(minutes) => handleExtendSession(activeAlert.session.id, minutes)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-2">Daily Planner</h1>
          <p className="text-gray-600 mt-1">
            Plan your study sessions for {format(new Date(), "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
          <Clock className="w-5 h-5 text-violet-600" />
          <span className="font-semibold text-gray-900">
            {totalHours}h / 24h
          </span>
        </div>
      </div>

      {/* Add Session Form */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heading-3">
            <Plus className="w-5 h-5 text-violet-600" />
            Add Study Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSession} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <SubjectSelector
                  value={subject}
                  onChange={setSubject}
                  customSubjects={customSubjects}
                  onAddCustomSubject={addCustomSubject}
                  placeholder="Select subject"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="chapter">Chapter Number</Label>
                <Input
                  id="chapter"
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g., 5"
                  className="mt-1.5 h-11"
                />
              </div>

              <div>
                <Label htmlFor="lecture">Lecture Number</Label>
                <Input
                  id="lecture"
                  type="text"
                  value={lecture}
                  onChange={(e) => setLecture(e.target.value)}
                  placeholder="e.g., 2"
                  className="mt-1.5 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1.5 h-11"
                />
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1.5 h-11"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 w-full cursor-pointer hover:bg-gray-100 transition-smooth">
                  <Checkbox
                    id="reminder"
                    checked={reminder}
                    onCheckedChange={(checked) => setReminder(checked as boolean)}
                  />
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    <Bell className="w-4 h-4" />
                    Enable Alerts
                  </span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto gradient-primary text-white font-semibold h-11 px-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Today's Sessions */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="text-heading-3">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {todaySessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No sessions planned yet</p>
              <p className="text-sm text-gray-500 mt-1">Add your first session above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySessions
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-smooth ${
                      session.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200 hover:border-violet-200 hover:shadow-premium"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        session.completed ? "bg-green-500" : "bg-violet-500"
                      } shadow-sm`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{session.subject}</h3>
                        {session.extended && (
                          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                            +{session.extended}m
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Chapter {session.chapter}, Lecture {session.lecture}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600 font-medium whitespace-nowrap flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {session.startTime} - {session.endTime}
                      </div>

                      {session.reminder && !session.completed && (
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-violet-600" />
                        </div>
                      )}

                      {!session.completed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteSession(session.id)}
                          className="border-green-300 text-green-600 hover:bg-green-50 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSession(session.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Warning */}
      {parseFloat(totalHours) > 20 && (
        <Card className="border-2 border-orange-200 bg-orange-50 shadow-premium">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900">High study load detected</p>
              <p className="text-sm text-orange-700 mt-0.5">
                You've planned {totalHours} hours today. Remember to take breaks and stay hydrated! 💧
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
