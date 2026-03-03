import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Clock, Plus } from 'lucide-react';
import type { StudySession } from '@/types';

interface SessionCompletionModalProps {
  open: boolean;
  onClose: () => void;
  session: StudySession;
  onComplete: () => void;
  onExtend: (minutes: number) => void;
}

export default function SessionCompletionModal({
  open,
  onClose,
  session,
  onComplete,
  onExtend,
}: SessionCompletionModalProps) {
  const [extendMinutes, setExtendMinutes] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play alert sound when modal opens
  useEffect(() => {
    if (open) {
      playAlertSound();
    }
  }, [open]);

  const playAlertSound = () => {
    try {
      // Create a simple alert tone using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for the alert sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure sound: pleasant bell-like tone
      oscillator.frequency.value = 800; // Hz
      oscillator.type = 'sine';
      
      // Fade in and out for smooth sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Play a second beep after a short pause
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.value = 900;
        oscillator2.type = 'sine';
        
        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode2.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
      }, 200);
      
      console.log('✅ Alert sound played successfully');
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleExtend = () => {
    if (extendMinutes > 0) {
      onExtend(extendMinutes);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg animate-bounce">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">🎉 Session Complete!</DialogTitle>
          <DialogDescription className="text-center text-base">
            <span className="font-semibold text-gray-900">{session.subject}</span>
            <br />
            Chapter {session.chapter}, Lecture {session.lecture}
            <br />
            <span className="text-sm text-gray-600 mt-1 block">
              {session.startTime} - {session.endTime}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <p className="text-gray-900 font-semibold text-lg">🔔 Your lecture session has ended!</p>
            <p className="text-gray-600 text-sm mt-1">
              Did you complete studying this lecture?
            </p>
          </div>

          {/* Complete Button */}
          <Button
            onClick={handleComplete}
            className="w-full h-14 gradient-primary text-white hover:opacity-90 transition-smooth text-base font-semibold shadow-md hover:shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Yes, Mark as Complete
          </Button>

          {/* Extend Section */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-medium">Need More Time?</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="extend-time" className="text-sm font-medium">
              Extend by (minutes)
            </Label>
            <div className="flex gap-2">
              <Input
                id="extend-time"
                type="number"
                min="5"
                max="180"
                step="5"
                value={extendMinutes}
                onChange={(e) => setExtendMinutes(Number(e.target.value))}
                className="h-12 text-base"
              />
              <Button
                onClick={handleExtend}
                variant="outline"
                className="h-12 px-6 border-2 border-violet-300 hover:bg-violet-50 text-violet-600 font-semibold"
              >
                <Plus className="w-5 h-5 mr-1" />
                Extend
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              💡 Extending will automatically adjust remaining sessions for today
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Remind Me Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
