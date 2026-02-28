import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDataStore } from "@/stores/dataStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Simple localStorage helper
const storage = {
  get: <T,>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  getUserKey: (userId: string, type: string) => `studyos_${userId}_${type}`,
};

export default function ExamReminderManager() {
  const { user } = useAuthStore();
  const { exams, updateExam } = useDataStore();
  const [activeExam, setActiveExam] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<"feedback" | "result" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [marks, setMarks] = useState<Record<string, { marks: string; total: string }>>({});

  useEffect(() => {
    const checkExams = () => {
      const today = new Date().toISOString().split("T")[0];
      const askedToday = storage.get<string[]>(storage.getUserKey(user?.id || "", "exams_asked_today")) || [];

      exams.forEach((exam) => {
        // Check for feedback after exam
        if (exam.date === today && !exam.feedback && !askedToday.includes(`feedback_${exam.id}`)) {
          setActiveExam(exam.id);
          setDialogType("feedback");
          askedToday.push(`feedback_${exam.id}`);
          storage.set(storage.getUserKey(user?.id || "", "exams_asked_today"), askedToday);
        }

        // Check for result on result date
        if (exam.resultDate === today && !exam.marks && !exam.resultAsked && !askedToday.includes(`result_${exam.id}`)) {
          setActiveExam(exam.id);
          setDialogType("result");
          askedToday.push(`result_${exam.id}`);
          storage.set(storage.getUserKey(user?.id || "", "exams_asked_today"), askedToday);
        }
      });
    };

    checkExams();
    const interval = setInterval(checkExams, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [exams, user]);

  const handleSaveFeedback = () => {
    if (activeExam && feedback && resultDate) {
      updateExam(activeExam, { feedback, resultDate });
      setActiveExam(null);
      setDialogType(null);
      setFeedback("");
      setResultDate("");
    }
  };

  const handleSaveResult = () => {
    if (activeExam) {
      const subjectMarks = Object.entries(marks).map(([subject, data]) => ({
        subject,
        marks: parseInt(data.marks),
        totalMarks: parseInt(data.total),
      }));

      updateExam(activeExam, { marks: subjectMarks, resultAsked: true });
      setActiveExam(null);
      setDialogType(null);
      setMarks({});
    }
  };

  const handleIgnore = () => {
    if (activeExam && dialogType === "result") {
      updateExam(activeExam, { resultAsked: true });
    }
    setActiveExam(null);
    setDialogType(null);
  };

  const exam = exams.find((e) => e.id === activeExam);
  const subjects = user?.subjects || [];

  return (
    <>
      {/* Feedback Dialog */}
      <Dialog open={dialogType === "feedback"} onOpenChange={(open) => !open && handleIgnore()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How was your exam?</DialogTitle>
            <DialogDescription>
              Share your feedback about {exam?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Your Feedback</Label>
              <Textarea
                placeholder="How did it go? Any challenging sections?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label>When will results be announced?</Label>
              <Input
                type="date"
                value={resultDate}
                onChange={(e) => setResultDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSaveFeedback} className="gradient-primary text-white">
              Save Feedback
            </Button>
            <Button onClick={handleIgnore} variant="outline">
              Skip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={dialogType === "result"} onOpenChange={(open) => !open && handleIgnore()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enter Your Results</DialogTitle>
            <DialogDescription>
              Results for {exam?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            {subjects.map((subject) => (
              <div key={subject} className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{subject} - Marks Obtained</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 85"
                    value={marks[subject]?.marks || ""}
                    onChange={(e) =>
                      setMarks({
                        ...marks,
                        [subject]: { ...marks[subject], marks: e.target.value },
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>{subject} - Total Marks</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 100"
                    value={marks[subject]?.total || ""}
                    onChange={(e) =>
                      setMarks({
                        ...marks,
                        [subject]: { ...marks[subject], total: e.target.value },
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={handleSaveResult} className="gradient-primary text-white">
              Save Results
            </Button>
            <Button onClick={handleIgnore} variant="outline">
              I'll Add Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
