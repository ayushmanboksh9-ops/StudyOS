import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { BADGES } from '@/constants/badges';
import { toast } from 'sonner';

interface UserStats {
  total_hours: number;
  total_questions: number;
  correct_questions: number;
  overall_accuracy: number;
  week_accuracy: number;
  completed_sessions: number;
  study_days: number;
  current_streak: number;
}

interface Achievement {
  id: string;
  badge_id: string;
  unlocked_at: string;
  progress: any;
}

export const useAchievements = () => {
  const { user } = useAuthStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load achievements and stats
  useEffect(() => {
    if (user?.id) {
      loadAchievements();
      loadStats();
      
      // Set up real-time subscription for automatic updates
      const interval = setInterval(() => {
        loadStats();
        checkAndUnlockAchievements();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const loadAchievements = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error: any) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadStats = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_user_stats', {
        target_user_id: user.id,
      });

      if (error) throw error;

      const userStats = data as UserStats;
      setStats(userStats);
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  const checkAndUnlockAchievements = async () => {
    if (!user?.id || !stats) return;

    const unlockedBadgeIds = achievements.map((a) => a.badge_id);
    const newUnlocks: string[] = [];

    // Check each badge
    BADGES.forEach((badge) => {
      // Skip if already unlocked
      if (unlockedBadgeIds.includes(badge.id)) return;

      let shouldUnlock = false;

      // Check conditions based on badge type
      switch (badge.id) {
        // Study Hours
        case 'first_hour':
          shouldUnlock = stats.total_hours >= 1;
          break;
        case 'ten_hours':
          shouldUnlock = stats.total_hours >= 10;
          break;
        case 'fifty_hours':
          shouldUnlock = stats.total_hours >= 50;
          break;
        case 'hundred_hours':
          shouldUnlock = stats.total_hours >= 100;
          break;
        case 'five_hundred_hours':
          shouldUnlock = stats.total_hours >= 500;
          break;

        // Questions
        case 'hundred_questions':
          shouldUnlock = stats.total_questions >= 100;
          break;
        case 'five_hundred_questions':
          shouldUnlock = stats.total_questions >= 500;
          break;
        case 'thousand_questions':
          shouldUnlock = stats.total_questions >= 1000;
          break;
        case 'five_thousand_questions':
          shouldUnlock = stats.total_questions >= 5000;
          break;
        case 'ten_thousand_questions':
          shouldUnlock = stats.total_questions >= 10000;
          break;

        // Accuracy
        case 'accuracy_80':
          shouldUnlock = stats.week_accuracy >= 80 && stats.total_questions >= 50;
          break;
        case 'accuracy_90':
          shouldUnlock = stats.week_accuracy >= 90 && stats.total_questions >= 100;
          break;
        case 'accuracy_95':
          shouldUnlock = stats.week_accuracy >= 95 && stats.total_questions >= 200;
          break;
        case 'perfect_week':
          shouldUnlock = stats.week_accuracy === 100 && stats.total_questions >= 50;
          break;

        // Streaks
        case 'streak_3':
          shouldUnlock = stats.current_streak >= 3;
          break;
        case 'streak_7':
          shouldUnlock = stats.current_streak >= 7;
          break;
        case 'streak_14':
          shouldUnlock = stats.current_streak >= 14;
          break;
        case 'streak_30':
          shouldUnlock = stats.current_streak >= 30;
          break;
        case 'streak_100':
          shouldUnlock = stats.current_streak >= 100;
          break;

        // Sessions
        case 'first_session':
          shouldUnlock = stats.completed_sessions >= 1;
          break;
        case 'ten_sessions':
          shouldUnlock = stats.completed_sessions >= 10;
          break;
        case 'hundred_sessions':
          shouldUnlock = stats.completed_sessions >= 100;
          break;
        case 'five_hundred_sessions':
          shouldUnlock = stats.completed_sessions >= 500;
          break;

        default:
          break;
      }

      if (shouldUnlock) {
        newUnlocks.push(badge.id);
      }
    });

    // Unlock new achievements
    for (const badgeId of newUnlocks) {
      await unlockAchievement(badgeId);
    }
  };

  const unlockAchievement = async (badgeId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.from('user_achievements').insert({
        user_id: user.id,
        badge_id: badgeId,
        unlocked_at: new Date().toISOString(),
      });

      if (error) {
        // Ignore duplicate errors (already unlocked)
        if (error.code !== '23505') {
          throw error;
        }
        return;
      }

      // Show toast notification
      const badge = BADGES.find((b) => b.id === badgeId);
      if (badge) {
        toast.success(`🎉 Achievement Unlocked: ${badge.name}!`, {
          description: badge.description,
          duration: 5000,
        });
      }

      // Reload achievements
      await loadAchievements();
    } catch (error: any) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const getProgressToNextBadge = (category: string) => {
    if (!stats) return null;

    const categoryBadges = BADGES.filter((b) => b.category === category).sort(
      (a, b) => a.requirement - b.requirement
    );

    const unlockedBadgeIds = achievements.map((a) => a.badge_id);
    const nextBadge = categoryBadges.find((b) => !unlockedBadgeIds.includes(b.id));

    if (!nextBadge) return null;

    let current = 0;
    if (category === 'hours') current = stats.total_hours;
    else if (category === 'questions') current = stats.total_questions;
    else if (category === 'accuracy') current = stats.week_accuracy;
    else if (category === 'streak') current = stats.current_streak;
    else if (category === 'sessions') current = stats.completed_sessions;

    return {
      badge: nextBadge,
      current,
      required: nextBadge.requirement,
      progress: Math.min((current / nextBadge.requirement) * 100, 100),
    };
  };

  // Helper function to check if a badge is unlocked
  const isUnlocked = (badgeId: string) => {
    return achievements.some((a) => a.badge_id === badgeId);
  };

  // Get all unlocked badges with their details
  const getUnlockedBadges = () => {
    return BADGES.filter((badge) => isUnlocked(badge.id));
  };

  // Get next badges to unlock (up to 3)
  const getNextBadges = () => {
    const unlocked = achievements.map((a) => a.badge_id);
    return BADGES.filter((b) => !unlocked.includes(b.id))
      .sort((a, b) => a.requirement - b.requirement)
      .slice(0, 3);
  };

  // Get progress for a specific badge
  const getProgress = (badge: any) => {
    if (!stats) return 0;

    let current = 0;
    const category = badge.category;

    if (category === 'hours') current = stats.total_hours;
    else if (category === 'questions') current = stats.total_questions;
    else if (category === 'accuracy') current = stats.week_accuracy;
    else if (category === 'streak') current = stats.current_streak;
    else if (category === 'sessions') current = stats.completed_sessions;

    return Math.min((current / badge.requirement) * 100, 100);
  };

  return {
    achievements,
    stats,
    userStats: stats,
    loading,
    reload: () => {
      loadAchievements();
      loadStats();
    },
    getProgressToNextBadge,
    checkAndUnlockAchievements,
    isUnlocked,
    getUnlockedBadges,
    getNextBadges,
    getProgress,
  };
};
