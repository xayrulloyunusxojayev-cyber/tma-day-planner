export type HabitCategory = 'Mindfulness' | 'Fitness' | 'Productivity' | 'Health' | 'Sleep';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  timeOfDay: TimeOfDay;
  subtitle: string; // e.g. "1,000ml water • Wellness"
  streak: number; // e.g. 14
  isCompleted: boolean;
  icon: string; // 'drop' | 'meditate' | 'book' | 'walk' | 'moon' | 'heart' | 'plant'
  color: string; // 'sage' | 'terracotta' | 'gold' | 'olive' | 'sand'
  targetValue?: number; // e.g. 5000
  currentValue?: number; // e.g. 3800
  unit?: string; // 'steps' | 'ml' | 'pages' | 'min'
  alarmTime?: string; // "07:30 - 09:00" or "07:00"
  alarmSound?: string; // "Tibetan Bowl"
  alarmEnabled?: boolean;
}

export interface DayOfWeekStatus {
  day: string;
  date: number;
  isCompleted: boolean;
  isToday: boolean;
}

export interface SanctuaryUser {
  name: string;
  avatarUrl?: string;
  activeStreak: number;
  overallScore: number;
  isPro: boolean;
}
