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
import { toast } from "sonner";
import { Bell } from "lucide-react";

export default function SessionAlertManager() {
  const { user } = useAuthStore();
  const { sessions, updateSession } = useDataStore();
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [extensionMinutes, setExtensionMinutes] = useState("15");

  useEffect(() => {
    const checkSessions = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const today = now.toISOString().split("T")[0];

      sessions.forEach((session) => {
        if (
          session.date === today &&
          session.endTime === currentTime &&
          !session.completed &&
          session.userId === user?.id
        ) {
          // Trigger alert
          setActiveAlert(session.id);

          // Play sound (browser notification sound)
          const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIGWi77eefTRAMUKfj8LZjHAY4ktfyyH0zCCN0xPDajj0JFWG16+miUxELTKHf8sFsIAUrlc7y2Yo3CBlou+3nn00QDFCn4/C2YxwGOJLX8sh9MwgjdMTw2o49CRVhtevpolMRC0yh3/LBbCAFK5XO8tmKNwgZaLvt559NEAxQp+PwtmMcBjiS1/LIfTMII3TE8NqOPQkVYbXr6aJTEQtMod/ywWwgBSuVzvLZijcIGWi77eefTRAMUKfj8LZjHAY4ktfyyH0zCCN0xPDajj0JFWG16+miUxELTKHf8sFsIAUrlc7y2Yo3CBloAAA=");
          audio.play().catch(() => {
            // Fallback if audio doesn't play
            console.log("Audio notification blocked");
          });

          // Browser notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Study Session Complete!", {
              body: `${session.subject} - Ch ${session.chapter}, Lec ${session.lecture} session has ended!`,
              icon: "/vite.svg",
            });
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkSessions, 60000);
    checkSessions(); // Initial check

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, [sessions, user]);

  const handleComplete = () => {
    if (activeAlert) {
      updateSession(activeAlert, { completed: true });
      setActiveAlert(null);
      toast.success("Great job! Session marked as complete! 🎉");
    }
  };

  const handleExtend = () => {
    if (activeAlert) {
      const session = sessions.find((s) => s.id === activeAlert);
      if (session) {
        // Calculate new end time
        const [hours, minutes] = session.endTime.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + parseInt(extensionMinutes);
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;
        const newEndTime = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;

        updateSession(activeAlert, {
          endTime: newEndTime,
          extended: (session.extended || 0) + 1,
        });

        toast.info(`Session extended by ${extensionMinutes} minutes`);
        setActiveAlert(null);
        setExtensionMinutes("15");
      }
    }
  };

  const session = sessions.find((s) => s.id === activeAlert);

  return (
    <Dialog open={!!activeAlert} onOpenChange={(open) => !open && setActiveAlert(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-violet-600 animate-pulse" />
            Session Complete!
          </DialogTitle>
          <DialogDescription>
            Your study session has ended. Did you complete it?
          </DialogDescription>
        </DialogHeader>

        {session && (
          <div className="py-4">
            <div className="p-4 rounded-lg bg-violet-50 border border-violet-200">
              <div className="font-semibold text-gray-900">
                {session.subject} - Chapter {session.chapter}, Lecture {session.lecture}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Scheduled: {session.startTime} - {session.endTime}
              </div>
            </div>

            <div className="mt-4">
              <Label>Extend by (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="120"
                value={extensionMinutes}
                onChange={(e) => setExtensionMinutes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={handleComplete} className="gradient-primary text-white w-full sm:w-auto">
            Mark Complete
          </Button>
          <Button onClick={handleExtend} variant="outline" className="w-full sm:w-auto">
            Extend Time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
