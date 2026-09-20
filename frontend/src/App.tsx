import React, { useState, useEffect } from 'react';
import { NotionTableView } from './components/NotionTableView';
import { NotionAlarmModal } from './components/NotionAlarmModal';
import { NotionTask, AlarmSettings } from './types';
import { initTelegram, getTelegramUser, triggerHaptic } from './telegram';
import { alarmAudio } from './audio';

const INITIAL_NOTION_TASKS: NotionTask[] = [
  {
    id: '1',
    name: 'Read Namaz at the Time',
    time: '24/7',
    status: 'In progress',
    due_date: '08/27/2026',
    is_completed: false,
    revenue: 0,
  },
  {
    id: '2',
    name: 'School',
    time: '8.00-13.00',
    status: 'Done',
    due_date: '08/27/2026',
    is_completed: true,
    revenue: 0,
  },
  {
    id: '3',
    name: 'Koran',
    time: '13.00-15.00',
    status: 'Done',
    due_date: '08/27/2026',
    is_completed: true,
    revenue: 0,
  },
  {
    id: '4',
    name: 'Antigravity (Заработок & Разработка)',
    time: '15.00-18.00',
    status: 'In progress',
    due_date: '08/27/2026',
    is_completed: false,
    revenue: 250,
  },
  {
    id: '5',
    name: 'Koran',
    time: '18.15-19.00',
    status: 'Not started',
    due_date: '08/27/2026',
    is_completed: false,
    revenue: 0,
  },
  {
    id: '6',
    name: 'Sleep',
    time: '20.20-5.30',
    status: 'Not started',
    due_date: '08/27/2026',
    is_completed: false,
    revenue: 0,
  },
];

const DEFAULT_ALARM: AlarmSettings = {
  user_id: 123456789,
  wake_time: '05:30',
  is_active: true,
  days: [0, 1, 2, 3, 4, 5, 6],
  sound_type: 'gentle',
};

export function App() {
  const user = getTelegramUser();

  const [tasks, setTasks] = useState<NotionTask[]>(() => {
    const saved = localStorage.getItem('notion_tasks_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTION_TASKS;
  });

  const [alarm, setAlarm] = useState<AlarmSettings>(() => {
    const saved = localStorage.getItem('notion_alarm_v2');
    return saved ? JSON.parse(saved) : { ...DEFAULT_ALARM, user_id: user.id };
  });

  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  useEffect(() => {
    initTelegram();
  }, []);

  useEffect(() => {
    localStorage.setItem('notion_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('notion_alarm_v2', JSON.stringify(alarm));
    fetch('/api/alarm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alarm),
    }).catch(() => {});
  }, [alarm]);

  const handleUpdateTask = (updatedTask: NotionTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleAddTask = (newTaskData: Partial<NotionTask>) => {
    const newTask: NotionTask = {
      id: Date.now().toString(),
      name: newTaskData.name || 'Новая задача',
      time: newTaskData.time || '10.00-12.00',
      status: newTaskData.status || 'Not started',
      due_date: newTaskData.due_date || '08/27/2026',
      is_completed: false,
      revenue: newTaskData.revenue || 0,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-white text-notion-text selection:bg-blue-100 selection:text-blue-900">
      <NotionTableView
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onOpenAlarm={() => setIsAlarmModalOpen(true)}
        alarmTime={alarm.wake_time}
        isAlarmActive={alarm.is_active}
      />

      <NotionAlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        alarm={alarm}
        onSaveAlarm={(newAlarm) => setAlarm(newAlarm)}
      />
    </div>
  );
}

export default App;
