export type TaskStatus = 'Not started' | 'In progress' | 'Done';

export interface NotionTask {
  id: string;
  name: string;
  time: string; // e.g. "8.00-13.00", "15.00-18.00", "24/7"
  status: TaskStatus;
  due_date: string; // e.g. "08/27/2026"
  is_completed: boolean;
  revenue: number; // earnings from this task
  category?: string;
}

export interface AlarmSettings {
  user_id: number;
  wake_time: string; // "05:30"
  is_active: boolean;
  days: number[];
  sound_type: 'apex' | 'gentle';
}
