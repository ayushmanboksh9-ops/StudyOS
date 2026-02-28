import { Badge } from '@/constants/badges';
import { Lock, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  onShare?: () => void;
}

export default function BadgeCard({
  badge,
  unlocked,
  progress = 0,
  size = 'md',
  showProgress = true,
  onShare,
}: BadgeCardProps) {
  const sizeClasses = {
    sm: 'w-20 h-20 text-3xl',
    md: 'w-28 h-28 text-5xl',
    lg: 'w-40 h-40 text-7xl',
  };

  const tierGradients = {
    bronze: 'from-orange-200 to-amber-300',
    silver: 'from-gray-300 to-slate-400',
    gold: 'from-yellow-300 to-orange-400',
    platinum: 'from-cyan-200 to-blue-300',
    legendary: 'from-purple-400 to-pink-500',
  };

  return (
    <div className="relative group">
      {/* Badge Icon */}
      <div
        className={cn(
          'relative rounded-2xl transition-all duration-300',
          unlocked
            ? `bg-gradient-to-br ${tierGradients[badge.tier]} shadow-premium hover:shadow-premium-lg hover:scale-105`
            : 'bg-gray-100 opacity-50 grayscale',
          sizeClasses[size],
          'flex items-center justify-center'
        )}
        style={
          unlocked
            ? {
                boxShadow: `0 8px 24px ${badge.color.glow}`,
              }
            : undefined
        }
      >
        <span className="filter drop-shadow-lg">{badge.icon}</span>

        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 rounded-2xl">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}

        {unlocked && onShare && (
          <button
            onClick={onShare}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <Share2 className="w-4 h-4 text-violet-600" />
          </button>
        )}
      </div>

      {/* Badge Info */}
      <div className="mt-3 text-center">
        <h3
          className={cn(
            'font-bold mb-1',
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base',
            unlocked ? 'text-gray-900' : 'text-gray-500'
          )}
        >
          {badge.name}
        </h3>
        <p
          className={cn(
            'text-gray-600 leading-tight',
            size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'
          )}
        >
          {badge.description}
        </p>

        {/* Tier Badge */}
        <div className="mt-2 inline-flex">
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
              badge.tier === 'legendary'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : badge.tier === 'platinum'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : badge.tier === 'gold'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : badge.tier === 'silver'
                ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
                : 'bg-gradient-to-r from-orange-400 to-amber-600 text-white'
            )}
          >
            {badge.tier}
          </span>
        </div>

        {/* Progress Bar */}
        {!unlocked && showProgress && progress > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">{Math.round(progress)}% complete</p>
          </div>
        )}
      </div>
    </div>
  );
}
