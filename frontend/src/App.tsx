import React, { useState, useEffect } from 'react';
import { TopHeader } from './components/TopHeader';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { AlarmScreen } from './components/AlarmScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AddHabitModal } from './components/AddHabitModal';
import { Habit } from './types';
import { initTelegram, getTelegramUser, triggerHaptic } from './telegram';

const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Morning Hydration',
    category: 'Health',
    timeOfDay: 'Morning',
    subtitle: '1,000ml water • Wellness',
    streak: 14,
    isCompleted: true,
    icon: 'drop',
    color: 'sage',
    alarmTime: '07:00 AM',
    alarmSound: 'Tibetan Bowl',
    alarmEnabled: true,
  },
  {
    id: '2',
    title: 'Mindful Meditation',
    category: 'Mindfulness',
    timeOfDay: 'Morning',
    subtitle: '15 minutes • Mind',
    streak: 9,
    isCompleted: true,
    icon: 'meditate',
    color: 'terracotta',
    alarmTime: '07:45 AM',
    alarmSound: 'Forest Birds',
    alarmEnabled: true,
  },
  {
    id: '3',
    title: 'Deep Reading',
    category: 'Productivity',
    timeOfDay: 'Morning',
    subtitle: '20 pages read • Growth',
    streak: 21,
    isCompleted: true,
    icon: 'book',
    color: 'gold',
    alarmTime: '12:30 PM',
    alarmSound: 'Soft Bell',
    alarmEnabled: true,
  },
  {
    id: '4',
    title: 'Evening Nature Walk',
    category: 'Fitness',
    timeOfDay: 'Evening',
    subtitle: 'Target: 5,000 steps • Body',
    streak: 0,
    isCompleted: false,
    icon: 'walk',
    color: 'olive',
    targetValue: 5000,
    currentValue: 3800,
    unit: 'steps',
    alarmTime: '06:00 PM',
    alarmSound: 'Soft Bell',
    alarmEnabled: true,
  },
  {
    id: '5',
    title: 'Digital Wind-Down',
    category: 'Sleep',
    timeOfDay: 'Evening',
    subtitle: 'By 10:00 PM • Rest & Sleep',
    streak: 0,
    isCompleted: false,
    icon: 'moon',
    color: 'sand',
    alarmTime: '10:00 PM',
    alarmSound: 'Muted',
    alarmEnabled: false,
  },
];

export function App() {
  const user = getTelegramUser();
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('sanctuary_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  useEffect(() => {
    initTelegram();
  }, []);

  useEffect(() => {
    localStorage.setItem('sanctuary_habits', JSON.stringify(habits));
  }, [habits]);

  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const next = !h.isCompleted;
          return {
            ...h,
            isCompleted: next,
            streak: next ? (h.streak || 0) + 1 : Math.max(0, (h.streak || 1) - 1),
            currentValue: next && h.targetValue ? h.targetValue : h.currentValue,
          };
        }
        return h;
      })
    );
  };

  const handleIncrementSteps = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id && h.currentValue !== undefined && h.targetValue) {
          const nextVal = Math.min(h.targetValue, h.currentValue + 500);
          return {
            ...h,
            currentValue: nextVal,
            isCompleted: nextVal >= h.targetValue,
          };
        }
        return h;
      })
    );
  };

  const handleSaveHabit = (newHabitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitData.title || 'New Ritual',
      category: newHabitData.category || 'Mindfulness',
      timeOfDay: newHabitData.timeOfDay || 'Morning',
      subtitle: newHabitData.subtitle || 'Wellness',
      streak: 1,
      isCompleted: false,
      icon: newHabitData.icon || 'drop',
      color: newHabitData.color || 'sage',
      targetValue: newHabitData.targetValue,
      currentValue: 0,
      unit: newHabitData.unit || 'times',
      alarmTime: newHabitData.alarmTime || '07:00 AM',
      alarmEnabled: true,
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const getHeaderSubtitle = () => {
    switch (currentTab) {
      case 'home':
        return 'Home';
      case 'calendar':
        return 'Calendar';
      case 'alarm':
        return 'Alarm';
      case 'settings':
        return 'Settings';
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-sanctuary-dark max-w-md mx-auto shadow-2xl relative flex flex-col justify-between">
      {/* Top Header */}
      <TopHeader
        subtitle={getHeaderSubtitle()}
        userName={user.first_name || 'Sophia'}
      />

      {/* Main Screen Content */}
      <main className="flex-1 overflow-y-auto">
        {currentTab === 'home' && (
          <HomeScreen
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onIncrementSteps={handleIncrementSteps}
            userName={user.first_name || 'Sophia'}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarScreen
            habits={habits}
            onToggleHabit={handleToggleHabit}
          />
        )}

        {currentTab === 'alarm' && (
          <AlarmScreen
            onOpenAddHabit={() => setIsAddModalOpen(true)}
          />
        )}

        {currentTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNavBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Add Habit Modal (Screen 4) */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveHabit}
      />
    </div>
  );
}

export default App;
