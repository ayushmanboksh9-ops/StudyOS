import { useRef } from 'react';
import { Badge } from '@/constants/badges';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface ShareableAchievementCardProps {
  open: boolean;
  onClose: () => void;
  badge: Badge;
  userName: string;
  unlockedAt: string;
}

export default function ShareableAchievementCard({
  open,
  onClose,
  badge,
  userName,
  unlockedAt,
}: ShareableAchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `studyos-achievement-${badge.id}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success('Achievement card downloaded!');
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Failed to download card');
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `achievement-${badge.id}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Achievement Unlocked: ${badge.name}`,
            text: badge.description,
            files: [file],
          });
        } else {
          // Fallback to download
          handleDownload();
        }
      });
    } catch (error) {
      console.error('Error sharing card:', error);
      toast.error('Sharing not supported. Card downloaded instead.');
      handleDownload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Share Your Achievement
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Shareable Card */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="relative w-[400px] h-[500px] rounded-3xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${badge.color.from}, ${badge.color.to})`,
              }}
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
                {/* Logo */}
                <div className="absolute top-6 left-6">
                  <div className="text-xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white">S</span>
                    </div>
                    StudyOS
                  </div>
                </div>

                {/* Badge Icon */}
                <div className="mb-6">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/30">
                    <span className="text-7xl filter drop-shadow-2xl">{badge.icon}</span>
                  </div>
                </div>

                {/* Text */}
                <div className="text-center space-y-3">
                  <div className="text-sm font-medium uppercase tracking-widest opacity-90">
                    Achievement Unlocked
                  </div>
                  <h2 className="text-4xl font-bold">{badge.name}</h2>
                  <p className="text-lg opacity-90 max-w-sm">{badge.description}</p>

                  {/* Requirement */}
                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-sm font-semibold">{badge.requirement.description}</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-75">Earned by</div>
                      <div className="text-xl font-bold">{userName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-75">
                        {new Date(unlockedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-xs opacity-60 uppercase tracking-wide">
                        {badge.tier} Tier
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleDownload} variant="outline" className="flex-1 h-11">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleShare} className="flex-1 h-11 gradient-primary text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Share your achievement on social media to inspire others! 🎉
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
