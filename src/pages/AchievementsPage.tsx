import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAchievements } from '@/hooks/useAchievements';
import { useAuthStore } from '@/stores/authStore';
import { BADGES, Badge } from '@/constants/badges';
import BadgeCard from '@/components/features/BadgeCard';
import ShareableAchievementCard from '@/components/features/ShareableAchievementCard';
import { Trophy, Award, Target, TrendingUp, Star, Zap } from 'lucide-react';

export default function AchievementsPage() {
  const { user } = useAuthStore();
  const {
    achievements,
    userStats,
    loading,
    checkAndUnlockAchievements,
    getProgress,
    isUnlocked,
    getUnlockedBadges,
    getNextBadges,
  } = useAchievements();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

  useEffect(() => {
    checkAndUnlockAchievements();
  }, [userStats]);

  const handleShareBadge = (badge: Badge) => {
    const achievement = achievements.find((a) => a.badge_id === badge.id);
    setSelectedBadge(badge);
    setSelectedAchievement(achievement);
    setShareModalOpen(true);
  };

  const unlockedBadges = getUnlockedBadges();
  const nextBadges = getNextBadges();

  const stats = [
    {
      label: 'Total Achievements',
      value: unlockedBadges.length,
      total: BADGES.filter((b) => b.requirement.type !== 'special').length,
      icon: Trophy,
      color: 'text-violet-600',
      bg: 'bg-violet-100',
    },
    {
      label: 'Legendary Badges',
      value: unlockedBadges.filter((b) => b.tier === 'legendary').length,
      total: BADGES.filter((b) => b.tier === 'legendary').length,
      icon: Star,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Study Hours',
      value: userStats?.total_hours.toFixed(0) || '0',
      total: '∞',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Questions Solved',
      value: userStats?.total_questions || 0,
      total: '∞',
      icon: Target,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-heading-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          Achievements
        </h1>
        <p className="text-gray-600 mt-2">
          Track your progress and unlock badges by hitting study milestones
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-2 border-gray-100 shadow-premium">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                    <span className="text-lg text-gray-400 ml-1">/ {stat.total}</span>
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Achievements */}
      {nextBadges.length > 0 && (
        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 shadow-premium-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heading-3">
              <Zap className="w-6 h-6 text-violet-600" />
              Up Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {nextBadges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  unlocked={false}
                  progress={getProgress(badge)}
                  size="md"
                  showProgress={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Badges */}
      <Card className="border-2 border-gray-100 shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heading-3">
            <Award className="w-6 h-6 text-violet-600" />
            All Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="bronze">Bronze</TabsTrigger>
              <TabsTrigger value="silver">Silver</TabsTrigger>
              <TabsTrigger value="gold">Gold</TabsTrigger>
              <TabsTrigger value="platinum">Platinum</TabsTrigger>
              <TabsTrigger value="legendary">Legendary</TabsTrigger>
            </TabsList>

            {['all', 'bronze', 'silver', 'gold', 'platinum', 'legendary'].map((tier) => (
              <TabsContent key={tier} value={tier}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {BADGES.filter((b) => tier === 'all' || b.tier === tier).map((badge) => {
                    const unlocked = isUnlocked(badge.id);
                    return (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        unlocked={unlocked}
                        progress={getProgress(badge)}
                        size="md"
                        showProgress={!unlocked}
                        onShare={unlocked ? () => handleShareBadge(badge) : undefined}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Recently Unlocked */}
      {unlockedBadges.length > 0 && (
        <Card className="border-2 border-gray-100 shadow-premium">
          <CardHeader>
            <CardTitle className="text-heading-3">Recently Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {unlockedBadges.slice(0, 6).map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  unlocked={true}
                  size="sm"
                  showProgress={false}
                  onShare={() => handleShareBadge(badge)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Modal */}
      {shareModalOpen && selectedBadge && selectedAchievement && (
        <ShareableAchievementCard
          open={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedBadge(null);
            setSelectedAchievement(null);
          }}
          badge={selectedBadge}
          userName={user?.name || 'Student'}
          unlockedAt={selectedAchievement.unlocked_at}
        />
      )}
    </div>
  );
}
