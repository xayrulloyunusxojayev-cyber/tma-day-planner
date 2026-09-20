import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { DayPlannerTable } from './components/DayPlannerTable';
import { TaskModal } from './components/TaskModal';
import { AlarmModal } from './components/AlarmModal';
import { TargetModal } from './components/TargetModal';
import { AlarmRingingModal } from './components/AlarmRingingModal';
import { Task, AlarmSettings, DayStats } from './types';
import { initTelegram, getTelegramUser, triggerHaptic } from './telegram';
import { Plus } from 'lucide-react';

const DEFAULT_ALARM: AlarmSettings = {
  user_id: 123456789,
  wake_time: '07:00',
  is_active: true,
  days: [0, 1, 2, 3, 4, 5, 6],
  sound_type: 'apex',
  vibrate: true,
};

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    user_id: 123456789,
    date: new Date().toISOString().split('T')[0],
    slot: '07:00',
    title: 'Подъем, холодный душ и чашка эспрессо',
    revenue_impact: 0,
    category: 'routine',
    is_completed: true,
  },
  {
    id: '2',
    user_id: 123456789,
    date: new Date().toISOString().split('T')[0],
    slot: '09:00',
    title: 'Созвон с клиентом #1 — закрытие контракта на внедрение',
    revenue_impact: 150,
    category: 'dpa',
    is_completed: false,
  },
  {
    id: '3',
    user_id: 123456789,
    date: new Date().toISOString().split('T')[0],
    slot: '11:00',
    title: 'Разработка ключевой фичи Mini App для релиза',
    revenue_impact: 0,
    category: 'focus',
    is_completed: false,
  },
  {
    id: '4',
    user_id: 123456789,
    date: new Date().toISOString().split('T')[0],
    slot: '14:00',
    title: 'Отправка коммерческих предложений 5 теплым лидам',
    revenue_impact: 200,
    category: 'dpa',
    is_completed: false,
  },
];

export function App() {
  const user = useMemo(() => getTelegramUser(), []);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('apex_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [alarm, setAlarm] = useState<AlarmSettings>(() => {
    const saved = localStorage.getItem('apex_alarm');
    return saved ? JSON.parse(saved) : { ...DEFAULT_ALARM, user_id: user.id };
  });

  const [targetRevenue, setTargetRevenue] = useState<number>(() => {
    const saved = localStorage.getItem('apex_target');
    return saved ? parseFloat(saved) : 350;
  });

  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('apex_currency') || 'USD';
  });

  // Modals state
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedSlotForNewTask, setSelectedSlotForNewTask] = useState('09:00');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [hasAlarmRungToday, setHasAlarmRungToday] = useState(false);

  // Initialize Telegram
  useEffect(() => {
    initTelegram();
  }, []);

  // Save to LocalStorage & Sync with Backend
  useEffect(() => {
    localStorage.setItem('apex_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('apex_alarm', JSON.stringify(alarm));
    // Send to backend API
    fetch('/api/alarm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alarm),
    }).catch(() => {
      // Backend might be offline in pure dev mode
    });
  }, [alarm]);

  useEffect(() => {
    localStorage.setItem('apex_target', targetRevenue.toString());
    localStorage.setItem('apex_currency', currency);
  }, [targetRevenue, currency]);

  // Load backend data on start if available
  useEffect(() => {
    fetch(`/api/data?user_id=${user.id}&date=${todayStr}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
        if (data && data.alarm) {
          setAlarm(data.alarm);
        }
        if (data && data.target) {
          setTargetRevenue(data.target.target_amount);
          setCurrency(data.target.currency);
        }
      })
      .catch(() => {
        // Fallback to local state
      });
  }, [user.id, todayStr]);

  // Alarm clock checker
  useEffect(() => {
    const checkAlarm = () => {
      if (!alarm.is_active || hasAlarmRungToday) return;

      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      // Telegram/JS day: 0=Sun, 1=Mon... convert to 0=Mon, 6=Sun
      const dayIndex = (now.getDay() + 6) % 7;

      if (alarm.days.includes(dayIndex) && currentTimeStr === alarm.wake_time) {
        setIsAlarmRinging(true);
        setHasAlarmRungToday(true);
      }
    };

    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [alarm, hasAlarmRungToday]);

  // Calculate stats
  const stats: DayStats = useMemo(() => {
    let earned = 0;
    let pending = 0;
    let completedCount = 0;
    let dpaCount = 0;
    let dpaCompleted = 0;

    tasks.forEach((t) => {
      if (t.is_completed) {
        earned += t.revenue_impact;
        completedCount += 1;
        if (t.category === 'dpa') dpaCompleted += 1;
      } else {
        pending += t.revenue_impact;
      }
      if (t.category === 'dpa') dpaCount += 1;
    });

    return {
      target_revenue: targetRevenue,
      earned_revenue: earned,
      pending_revenue: pending,
      total_tasks: tasks.length,
      completed_tasks: completedCount,
      dpa_tasks_count: dpaCount,
      dpa_completed_count: dpaCompleted,
      currency,
    };
  }, [tasks, targetRevenue, currency]);

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, is_completed: !t.is_completed };
          // Sync with backend
          fetch('/api/tasks/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task_id: taskId, is_completed: updated.is_completed }),
          }).catch(() => {});
          return updated;
        }
        return t;
      })
    );
  };

  const handleOpenAddTask = (slot: string) => {
    setTaskToEdit(null);
    setSelectedSlotForNewTask(slot);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setSelectedSlotForNewTask(task.slot);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskToEdit) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToEdit.id ? ({ ...t, ...taskData } as Task) : t))
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        user_id: user.id,
        date: todayStr,
        slot: taskData.slot || selectedSlotForNewTask,
        title: taskData.title || '',
        category: taskData.category || 'dpa',
        revenue_impact: taskData.revenue_impact || 0,
        is_completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col justify-between max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-white/5">
      {/* Header with profile, date, alarm and revenue target */}
      <Header
        user={user}
        alarm={alarm}
        onOpenAlarm={() => setIsAlarmModalOpen(true)}
        onOpenTarget={() => setIsTargetModalOpen(true)}
        targetRevenue={targetRevenue}
        earnedRevenue={stats.earned_revenue}
        currency={currency}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Revenue Progress Bar & Metrics */}
        <StatsBar stats={stats} />

        {/* Schedule & Revenue Table */}
        <DayPlannerTable
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onAddTask={handleOpenAddTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={handleDeleteTask}
          currency={currency}
        />
      </main>

      {/* Floating Action Button (Add Task) */}
      <div className="fixed bottom-5 right-5 z-20">
        <button
          onClick={() => {
            triggerHaptic('impact', 'medium');
            handleOpenAddTask('10:00');
          }}
          className="w-13 h-13 p-3.5 rounded-2xl bg-accent-emerald hover:bg-accent-green text-dark-900 shadow-glow-green border border-accent-green/40 flex items-center justify-center transition active:scale-95 group"
          title="Быстро добавить задачу"
        >
          <Plus className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialSlot={selectedSlotForNewTask}
        taskToEdit={taskToEdit}
        currency={currency}
      />

      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        alarm={alarm}
        onSaveAlarm={(newAlarm) => setAlarm(newAlarm)}
      />

      <TargetModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentTarget={targetRevenue}
        currentCurrency={currency}
        onSaveTarget={(t, c) => {
          setTargetRevenue(t);
          setCurrency(c);
        }}
      />

      <AlarmRingingModal
        isOpen={isAlarmRinging}
        onDismiss={() => setIsAlarmRinging(false)}
        soundType={alarm.sound_type}
        targetRevenue={targetRevenue}
        currency={currency}
        topTasks={tasks.filter((t) => !t.is_completed)}
      />
    </div>
  );
}

export default App;
