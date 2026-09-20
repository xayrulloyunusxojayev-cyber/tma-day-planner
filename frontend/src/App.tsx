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
import { Language, translations } from './i18n/translations';

const getInitialHabits = (lang: Language): Habit[] => [
  {
    id: '1',
    title: lang === 'ru' ? 'Утренняя вода' : lang === 'uz' ? 'Ertalabki suv' : 'Morning Hydration',
    category: 'Health',
    timeOfDay: 'Morning',
    subtitle: '1,000ml • Wellness',
    streak: 14,
    isCompleted: true,
    icon: 'drop',
    color: 'sage',
    alarmTime: '07:00 - 07:30',
    alarmSound: 'Tibetan Bowl',
    alarmEnabled: true,
  },
  {
    id: '2',
    title: lang === 'ru' ? 'Медитация / Намаз' : lang === 'uz' ? 'Meditatsiya / Namoz' : 'Mindful Meditation',
    category: 'Mindfulness',
    timeOfDay: 'Morning',
    subtitle: '15 min • Mind',
    streak: 9,
    isCompleted: true,
    icon: 'meditate',
    color: 'terracotta',
    alarmTime: '07:45 - 08:30',
    alarmSound: 'Forest Birds',
    alarmEnabled: true,
  },
  {
    id: '3',
    title: lang === 'ru' ? 'Чтение книги / Коран' : lang === 'uz' ? 'Kitob o\'qish / Qur\'on' : 'Deep Reading',
    category: 'Productivity',
    timeOfDay: 'Morning',
    subtitle: '20 pages • Growth',
    streak: 21,
    isCompleted: true,
    icon: 'book',
    color: 'gold',
    alarmTime: '12:30 - 13:30',
    alarmSound: 'Soft Bell',
    alarmEnabled: true,
  },
  {
    id: '4',
    title: lang === 'ru' ? 'Вечерняя прогулка' : lang === 'uz' ? 'Kechki sayr' : 'Evening Nature Walk',
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
    alarmTime: '18:00 - 19:30',
    alarmSound: 'Soft Bell',
    alarmEnabled: true,
  },
  {
    id: '5',
    title: lang === 'ru' ? 'Подготовка ко сну' : lang === 'uz' ? 'Uyquga tayyorgarlik' : 'Digital Wind-Down',
    category: 'Sleep',
    timeOfDay: 'Evening',
    subtitle: 'Rest & Sleep',
    streak: 0,
    isCompleted: false,
    icon: 'moon',
    color: 'sand',
    alarmTime: '22:30 - 23:00',
    alarmSound: 'Muted',
    alarmEnabled: false,
  },
];

export function App() {
  const user = getTelegramUser();
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('sanctuary_lang') as Language;
    if (saved && (saved === 'ru' || saved === 'en' || saved === 'uz')) {
      return saved;
    }
    return 'ru';
  });

  const t = translations[lang];
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('sanctuary_habits_v4');
    return saved ? JSON.parse(saved) : getInitialHabits(lang);
  });

  useEffect(() => {
    initTelegram();
  }, []);

  useEffect(() => {
    localStorage.setItem('sanctuary_habits_v4', JSON.stringify(habits));
  }, [habits]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('sanctuary_lang', newLang);
  };

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

  const handleOpenAdd = () => {
    setHabitToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsAddModalOpen(true);
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (habitToEdit) {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitToEdit.id ? ({ ...h, ...habitData } as Habit) : h
        )
      );
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        title: habitData.title || t.newRitualTitle,
        category: habitData.category || 'Mindfulness',
        timeOfDay: habitData.timeOfDay || 'Morning',
        subtitle: habitData.subtitle || 'Wellness',
        streak: 1,
        isCompleted: false,
        icon: habitData.icon || 'drop',
        color: habitData.color || 'sage',
        targetValue: habitData.targetValue,
        currentValue: 0,
        unit: habitData.unit || 'times',
        alarmTime: habitData.alarmTime || '07:30 - 09:00',
        alarmEnabled: true,
      };
      setHabits((prev) => [newHabit, ...prev]);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const getHeaderSubtitle = () => {
    switch (currentTab) {
      case 'home':
        return t.navHome;
      case 'calendar':
        return t.navCalendar;
      case 'alarm':
        return t.navAlarm;
      case 'settings':
        return t.navSettings;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-sanctuary-dark max-w-md mx-auto shadow-2xl relative flex flex-col justify-between">
      {/* Top Header */}
      <TopHeader
        subtitle={getHeaderSubtitle()}
        userName={user.first_name || 'Hayrullo'}
        lang={lang}
      />

      {/* Main Screen Content */}
      <main className="flex-1 overflow-y-auto">
        {currentTab === 'home' && (
          <HomeScreen
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onIncrementSteps={handleIncrementSteps}
            onEditHabit={handleOpenEdit}
            userName={user.first_name || 'Hayrullo'}
            lang={lang}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarScreen
            habits={habits}
            onToggleHabit={handleToggleHabit}
            lang={lang}
          />
        )}

        {currentTab === 'alarm' && (
          <AlarmScreen
            onOpenAddHabit={handleOpenAdd}
            lang={lang}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            currentLang={lang}
            onLanguageChange={handleLanguageChange}
            userName={user.first_name || 'Hayrullo'}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNavBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={handleOpenAdd}
        lang={lang}
      />

      {/* Add / Edit Habit Modal */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setHabitToEdit(null);
        }}
        onSave={handleSaveHabit}
        onDelete={handleDeleteHabit}
        habitToEdit={habitToEdit}
        lang={lang}
      />
    </div>
  );
}

export default App;
