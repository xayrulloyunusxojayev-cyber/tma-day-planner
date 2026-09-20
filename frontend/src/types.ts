export type TaskCategory = 'dpa' | 'focus' | 'routine';

export interface Task {
  id: string;
  user_id: number;
  date: string; // YYYY-MM-DD
  slot: string; // "07:00", "08:00", etc.
  title: string;
  revenue_impact: number; // Potential or realized earnings ($ or other currency)
  category: TaskCategory;
  is_completed: boolean;
  notes?: string;
  created_at?: string;
}

export interface DailyTarget {
  user_id: number;
  date: string;
  target_amount: number;
  currency: 'USD' | 'UZS' | 'RUB';
}

export interface AlarmSettings {
  user_id: number;
  wake_time: string; // "07:00"
  is_active: boolean;
  days: number[]; // 0=Mon, 1=Tue, ..., 6=Sun
  sound_type: 'apex' | 'energetic' | 'gentle';
  vibrate: boolean;
}

export interface DayStats {
  target_revenue: number;
  earned_revenue: number;
  pending_revenue: number;
  total_tasks: number;
  completed_tasks: number;
  dpa_tasks_count: number;
  dpa_completed_count: number;
  currency: string;
}
