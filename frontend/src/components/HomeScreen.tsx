import React, { useState } from 'react';
import {
  Droplets,
  BookOpen,
  Footprints,
  Moon,
  Check,
  Flame,
  Plus
} from 'lucide-react';
import { Habit } from '../types';
import { triggerHaptic } from '../telegram';
import { alarmAudio } from '../audio';
import { getCurrentWeekDays } from '../utils/calendar';

interface HomeScreenProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onIncrementSteps: (id: string) => void;
  userName?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  habits,
  onToggleHabit,
  onIncrementSteps,
  userName = 'Hayrullo',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const weekDays = getCurrentWeekDays();

  const todayStr = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const filteredHabits = habits.filter((h) => {
    if (activeFilter === 'morning') return h.timeOfDay === 'Morning';
    if (activeFilter === 'afternoon') return h.timeOfDay === 'Afternoon';
    if (activeFilter === 'evening') return h.timeOfDay === 'Evening';
    return true;
  });

  const completedCount = habits.filter((h) => h.isCompleted).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'drop':
        return <Droplets className="w-5 h-5 text-emerald-700" />;
      case 'meditate':
        return <span className="text-base">🧘</span>;
      case 'book':
        return <BookOpen className="w-5 h-5 text-amber-700" />;
      case 'walk':
        return <Footprints className="w-5 h-5 text-emerald-800" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-slate-600" />;
      default:
        return <span className="text-base">✨</span>;
    }
  };

  return (
    <div className="px-4 pb-24 space-y-3.5">
      {/* Date & Greeting */}
      <div className="pt-2">
        <span className="text-[11px] text-sanctuary-muted font-medium capitalize block mb-0.5">
          {todayStr}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-sanctuary-dark">
          Привет, {userName} 👋
        </h1>
      </div>

      {/* Harmony in Motion Card (Clean) */}
      <div className="sanctuary-card p-4 flex items-center justify-between">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
            <Flame className="w-3 h-3 text-amber-600 fill-amber-500" /> Серия: 14 дней
          </span>
          <h2 className="text-base font-bold text-sanctuary-dark pt-0.5">
            Прогресс на сегодня
          </h2>
          <p className="text-xs text-sanctuary-muted">
            Выполнено {completedCount} из {totalCount} дел ({progressPercent}%)
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-sanctuary-green transition-all duration-500 ease-out"
              strokeDasharray={`${progressPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-xs font-bold text-sanctuary-dark">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Real Current Week Row */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium px-1">
          <span className="font-bold text-sanctuary-dark">Текущая неделя</span>
          <span className="text-emerald-700 font-semibold text-[11px]">Реальное время</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 bg-white p-2.5 rounded-2xl border border-sanctuary-border shadow-xs">
          {weekDays.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center py-2 rounded-xl transition ${
                item.isToday
                  ? 'bg-sanctuary-green text-white shadow-sm'
                  : 'text-sanctuary-dark'
              }`}
            >
              <span className={`text-[10px] font-semibold mb-0.5 ${item.isToday ? 'text-emerald-100' : 'text-sanctuary-muted'}`}>
                {item.day}
              </span>
              <span className="text-xs font-bold">{item.date}</span>
              {item.isToday ? (
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveFilter('all');
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition ${
            activeFilter === 'all'
              ? 'bg-sanctuary-dark text-white'
              : 'bg-white text-sanctuary-muted border border-sanctuary-border'
          }`}
        >
          Все ({habits.length})
        </button>
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveFilter('morning');
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition ${
            activeFilter === 'morning'
              ? 'bg-sanctuary-dark text-white'
              : 'bg-white text-sanctuary-muted border border-sanctuary-border'
          }`}
        >
          Утро
        </button>
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveFilter('afternoon');
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition ${
            activeFilter === 'afternoon'
              ? 'bg-sanctuary-dark text-white'
              : 'bg-white text-sanctuary-muted border border-sanctuary-border'
          }`}
        >
          День
        </button>
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveFilter('evening');
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition ${
            activeFilter === 'evening'
              ? 'bg-sanctuary-dark text-white'
              : 'bg-white text-sanctuary-muted border border-sanctuary-border'
          }`}
        >
          Вечер
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-2 pt-1">
        {filteredHabits.map((habit) => (
          <div
            key={habit.id}
            className="sanctuary-card p-3.5 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gray-100/80 flex items-center justify-center flex-shrink-0">
                {renderIcon(habit.icon)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-sanctuary-dark truncate">
                    {habit.title}
                  </h3>
                  {habit.alarmTime && (
                    <span className="text-[10px] font-mono text-sanctuary-muted bg-gray-100 px-1.5 py-0.2 rounded">
                      {habit.alarmTime}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-sanctuary-muted truncate mt-0.5">
                  {habit.subtitle}
                </p>

                {habit.targetValue && habit.currentValue !== undefined && (
                  <div className="mt-1.5 space-y-1">
                    <div className="w-32 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sanctuary-green h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (habit.currentValue / habit.targetValue) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-sanctuary-muted font-medium">
                      {habit.currentValue} / {habit.targetValue} {habit.unit}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {habit.targetValue && (
                <button
                  onClick={() => {
                    triggerHaptic('impact', 'medium');
                    onIncrementSteps(habit.id);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-sanctuary-green text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition active:scale-95"
                >
                  <Plus className="w-3 h-3" /> 500
                </button>
              )}

              <button
                onClick={() => {
                  triggerHaptic('notification', 'success');
                  alarmAudio.playTone(880, 0.15, 0, 'sine');
                  onToggleHabit(habit.id);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  habit.isCompleted
                    ? 'bg-sanctuary-green text-white shadow-xs'
                    : 'border-2 border-gray-300 hover:border-sanctuary-green bg-transparent'
                }`}
              >
                {habit.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
