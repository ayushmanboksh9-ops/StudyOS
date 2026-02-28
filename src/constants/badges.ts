export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  requirement: {
    type: 'hours' | 'questions' | 'accuracy' | 'streak' | 'sessions' | 'special';
    target: number;
    description: string;
  };
  color: {
    from: string;
    to: string;
    text: string;
    glow: string;
  };
}

export const BADGES: Badge[] = [
  // Study Hours Badges
  {
    id: 'first_hour',
    name: 'First Steps',
    description: 'Complete your first hour of study',
    icon: '🌱',
    tier: 'bronze',
    requirement: {
      type: 'hours',
      target: 1,
      description: '1 hour studied',
    },
    color: {
      from: '#CD7F32',
      to: '#8B4513',
      text: '#8B4513',
      glow: 'rgba(205, 127, 50, 0.3)',
    },
  },
  {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Study for 10 hours',
    icon: '📚',
    tier: 'bronze',
    requirement: {
      type: 'hours',
      target: 10,
      description: '10 hours studied',
    },
    color: {
      from: '#CD7F32',
      to: '#8B4513',
      text: '#8B4513',
      glow: 'rgba(205, 127, 50, 0.3)',
    },
  },
  {
    id: 'study_warrior',
    name: 'Study Warrior',
    description: 'Complete 50 hours of focused study',
    icon: '⚔️',
    tier: 'silver',
    requirement: {
      type: 'hours',
      target: 50,
      description: '50 hours studied',
    },
    color: {
      from: '#C0C0C0',
      to: '#A8A8A8',
      text: '#6B7280',
      glow: 'rgba(192, 192, 192, 0.4)',
    },
  },
  {
    id: 'century_scholar',
    name: 'Century Scholar',
    description: 'Achieve 100 hours of study time',
    icon: '💯',
    tier: 'gold',
    requirement: {
      type: 'hours',
      target: 100,
      description: '100 hours studied',
    },
    color: {
      from: '#FFD700',
      to: '#FFA500',
      text: '#D97706',
      glow: 'rgba(255, 215, 0, 0.5)',
    },
  },
  {
    id: 'elite_grinder',
    name: 'Elite Grinder',
    description: 'Study for 250 hours',
    icon: '🏆',
    tier: 'platinum',
    requirement: {
      type: 'hours',
      target: 250,
      description: '250 hours studied',
    },
    color: {
      from: '#E5E4E2',
      to: '#B9F2FF',
      text: '#0891B2',
      glow: 'rgba(185, 242, 255, 0.5)',
    },
  },
  {
    id: 'legendary_scholar',
    name: 'Legendary Scholar',
    description: 'Master 500+ hours of study',
    icon: '👑',
    tier: 'legendary',
    requirement: {
      type: 'hours',
      target: 500,
      description: '500 hours studied',
    },
    color: {
      from: '#9333EA',
      to: '#EC4899',
      text: '#9333EA',
      glow: 'rgba(147, 51, 234, 0.6)',
    },
  },

  // Questions Solved Badges
  {
    id: 'problem_solver',
    name: 'Problem Solver',
    description: 'Solve your first 100 questions',
    icon: '🎯',
    tier: 'bronze',
    requirement: {
      type: 'questions',
      target: 100,
      description: '100 questions solved',
    },
    color: {
      from: '#CD7F32',
      to: '#8B4513',
      text: '#8B4513',
      glow: 'rgba(205, 127, 50, 0.3)',
    },
  },
  {
    id: 'question_master',
    name: 'Question Master',
    description: 'Solve 500 questions',
    icon: '🧠',
    tier: 'silver',
    requirement: {
      type: 'questions',
      target: 500,
      description: '500 questions solved',
    },
    color: {
      from: '#C0C0C0',
      to: '#A8A8A8',
      text: '#6B7280',
      glow: 'rgba(192, 192, 192, 0.4)',
    },
  },
  {
    id: 'thousand_solver',
    name: 'Thousand Solver',
    description: 'Complete 1000 practice questions',
    icon: '🚀',
    tier: 'gold',
    requirement: {
      type: 'questions',
      target: 1000,
      description: '1000 questions solved',
    },
    color: {
      from: '#FFD700',
      to: '#FFA500',
      text: '#D97706',
      glow: 'rgba(255, 215, 0, 0.5)',
    },
  },
  {
    id: 'question_champion',
    name: 'Question Champion',
    description: 'Solve 2500 questions',
    icon: '💎',
    tier: 'platinum',
    requirement: {
      type: 'questions',
      target: 2500,
      description: '2500 questions solved',
    },
    color: {
      from: '#E5E4E2',
      to: '#B9F2FF',
      text: '#0891B2',
      glow: 'rgba(185, 242, 255, 0.5)',
    },
  },
  {
    id: 'unstoppable_force',
    name: 'Unstoppable Force',
    description: 'Conquer 5000+ questions',
    icon: '⚡',
    tier: 'legendary',
    requirement: {
      type: 'questions',
      target: 5000,
      description: '5000 questions solved',
    },
    color: {
      from: '#9333EA',
      to: '#EC4899',
      text: '#9333EA',
      glow: 'rgba(147, 51, 234, 0.6)',
    },
  },

  // Accuracy Badges
  {
    id: 'precision_seeker',
    name: 'Precision Seeker',
    description: 'Achieve 80% accuracy for a week',
    icon: '🎪',
    tier: 'silver',
    requirement: {
      type: 'accuracy',
      target: 80,
      description: '80% accuracy (7 days)',
    },
    color: {
      from: '#C0C0C0',
      to: '#A8A8A8',
      text: '#6B7280',
      glow: 'rgba(192, 192, 192, 0.4)',
    },
  },
  {
    id: 'accuracy_expert',
    name: 'Accuracy Expert',
    description: 'Maintain 90% accuracy for a week',
    icon: '🎯',
    tier: 'gold',
    requirement: {
      type: 'accuracy',
      target: 90,
      description: '90% accuracy (7 days)',
    },
    color: {
      from: '#FFD700',
      to: '#FFA500',
      text: '#D97706',
      glow: 'rgba(255, 215, 0, 0.5)',
    },
  },
  {
    id: 'perfect_precision',
    name: 'Perfect Precision',
    description: 'Achieve 95% accuracy for a week',
    icon: '✨',
    tier: 'platinum',
    requirement: {
      type: 'accuracy',
      target: 95,
      description: '95% accuracy (7 days)',
    },
    color: {
      from: '#E5E4E2',
      to: '#B9F2FF',
      text: '#0891B2',
      glow: 'rgba(185, 242, 255, 0.5)',
    },
  },

  // Streak Badges
  {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Study for 7 days in a row',
    icon: '🔥',
    tier: 'bronze',
    requirement: {
      type: 'streak',
      target: 7,
      description: '7-day streak',
    },
    color: {
      from: '#CD7F32',
      to: '#8B4513',
      text: '#8B4513',
      glow: 'rgba(205, 127, 50, 0.3)',
    },
  },
  {
    id: 'dedication_master',
    name: 'Dedication Master',
    description: 'Maintain a 30-day study streak',
    icon: '🔥',
    tier: 'gold',
    requirement: {
      type: 'streak',
      target: 30,
      description: '30-day streak',
    },
    color: {
      from: '#FFD700',
      to: '#FFA500',
      text: '#D97706',
      glow: 'rgba(255, 215, 0, 0.5)',
    },
  },
  {
    id: 'unstoppable_streak',
    name: 'Unstoppable',
    description: 'Study for 100 consecutive days',
    icon: '🌟',
    tier: 'legendary',
    requirement: {
      type: 'streak',
      target: 100,
      description: '100-day streak',
    },
    color: {
      from: '#9333EA',
      to: '#EC4899',
      text: '#9333EA',
      glow: 'rgba(147, 51, 234, 0.6)',
    },
  },

  // Session Badges
  {
    id: 'session_starter',
    name: 'Session Starter',
    description: 'Complete 10 study sessions',
    icon: '▶️',
    tier: 'bronze',
    requirement: {
      type: 'sessions',
      target: 10,
      description: '10 sessions completed',
    },
    color: {
      from: '#CD7F32',
      to: '#8B4513',
      text: '#8B4513',
      glow: 'rgba(205, 127, 50, 0.3)',
    },
  },
  {
    id: 'session_pro',
    name: 'Session Pro',
    description: 'Complete 100 study sessions',
    icon: '⏱️',
    tier: 'silver',
    requirement: {
      type: 'sessions',
      target: 100,
      description: '100 sessions completed',
    },
    color: {
      from: '#C0C0C0',
      to: '#A8A8A8',
      text: '#6B7280',
      glow: 'rgba(192, 192, 192, 0.4)',
    },
  },
  {
    id: 'session_legend',
    name: 'Session Legend',
    description: 'Complete 500 study sessions',
    icon: '🎖️',
    tier: 'platinum',
    requirement: {
      type: 'sessions',
      target: 500,
      description: '500 sessions completed',
    },
    color: {
      from: '#E5E4E2',
      to: '#B9F2FF',
      text: '#0891B2',
      glow: 'rgba(185, 242, 255, 0.5)',
    },
  },

  // Special Badges
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Study before 6 AM',
    icon: '🌅',
    tier: 'silver',
    requirement: {
      type: 'special',
      target: 1,
      description: 'Complete a session before 6 AM',
    },
    color: {
      from: '#C0C0C0',
      to: '#A8A8A8',
      text: '#6B7280',
      glow: 'rgba(192, 192, 192, 0.4)',
    },
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Study after 10 PM',
    icon: '🦉',
    tier: 'silver',
    requirement: {
      type: 'special',
      target: 1,
      description: 'Complete a session after 10 PM',
    },
    color: {
      from: '#C0C0C0',
      to: '#A8A8A8',
      text: '#6B7280',
      glow: 'rgba(192, 192, 192, 0.4)',
    },
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Study on both Saturday and Sunday',
    icon: '⚡',
    tier: 'bronze',
    requirement: {
      type: 'special',
      target: 1,
      description: 'Study on weekend days',
    },
    color: {
      from: '#CD7F32',
      to: '#8B4513',
      text: '#8B4513',
      glow: 'rgba(205, 127, 50, 0.3)',
    },
  },
];

export const getBadgeById = (id: string): Badge | undefined => {
  return BADGES.find((badge) => badge.id === id);
};

export const getBadgesByTier = (tier: Badge['tier']): Badge[] => {
  return BADGES.filter((badge) => badge.tier === tier);
};
