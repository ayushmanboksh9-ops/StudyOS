import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import type { StudySession } from '@/types';

interface SessionStartAlertProps {
  open: boolean;
  onClose: () => void;
  session: StudySession;
}

export default function SessionStartAlert({ open, onClose, session }: SessionStartAlertProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-pulse">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">Session Starting Soon! ⏰</DialogTitle>
          <DialogDescription className="text-center text-base">
            Your next study session begins in <span className="font-bold text-violet-600">2 minutes</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl p-5 border border-violet-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{session.subject}</h3>
                <p className="text-gray-600 mb-2">
                  Chapter {session.chapter}, Lecture {session.lecture}
                </p>
                <p className="text-sm font-semibold text-violet-600">
                  {session.startTime} - {session.endTime}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Get ready! Make sure you have all your materials prepared.
          </div>

          <Button
            onClick={onClose}
            className="w-full h-12 gradient-primary text-white hover:opacity-90 transition-smooth text-base font-semibold"
          >
            Got It, I'm Ready!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
