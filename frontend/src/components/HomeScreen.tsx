import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  BookOpen,
  Footprints,
  Moon,
  Check,
  ChevronRight,
  Flame,
  Plus,
  Hourglass
} from 'lucide-react';
import { Habit } from '../types';
import { triggerHaptic } from '../telegram';
import { alarmAudio } from '../audio';

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
  userName = 'Sophia',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  // Filter habits
  const filteredHabits = habits.filter((h) => {
    if (activeFilter === 'morning') return h.timeOfDay === 'Morning';
    if (activeFilter === 'afternoon') return h.timeOfDay === 'Afternoon';
    if (activeFilter === 'evening') return h.timeOfDay === 'Evening';
    return true;
  });

  const completedCount = habits.filter((h) => h.isCompleted).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const renderHabitIcon = (icon: string) => {
    switch (icon) {
      case 'drop':
        return <Droplets className="w-5 h-5 text-emerald-700" />;
      case 'meditate':
        return (
          <span className="text-base">🧘</span>
        );
      case 'book':
        return <BookOpen className="w-5 h-5 text-amber-700" />;
      case 'walk':
        return <Footprints className="w-5 h-5 text-emerald-800" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-slate-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-700" />;
    }
  };

  const getIconBg = (color: string) => {
    switch (color) {
      case 'sage':
        return 'bg-emerald-100/70';
      case 'terracotta':
        return 'bg-rose-100/70';
      case 'gold':
        return 'bg-amber-100/70';
      case 'olive':
        return 'bg-emerald-200/50';
      default:
        return 'bg-slate-100';
    }
  };

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* Date & Greeting */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs text-sanctuary-muted font-medium mb-1">
          <span>🌅 Thursday, Oct 24</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-sanctuary-dark">
            Good morning, {userName}
          </h1>
          <div className="w-8 h-8 rounded-full bg-rose-100/80 flex items-center justify-center text-rose-600 text-sm">
            🌸
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="bg-[#f4efe6] rounded-2xl px-3.5 py-2 text-xs text-sanctuary-dark/80 italic flex items-center gap-2 border border-[#eae3d5]">
        <span className="text-sm">❝</span>
        <span>Small mindful steps cultivate enduring peace.</span>
      </div>

      {/* Harmony in Motion Card */}
      <div className="sanctuary-card p-5 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-500" /> 14-Day Streak!
            </span>
            <h2 className="text-lg font-bold text-sanctuary-dark pt-1">
              Harmony in Motion
            </h2>
            <p className="text-xs text-sanctuary-muted">
              {completedCount} of {totalCount} rituals completed today
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-emerald-700">{progressPercent}% Done</span>
              <span className="text-[11px] text-sanctuary-subtle">•</span>
              <span className="text-xs text-sanctuary-muted">
                {totalCount - completedCount} ritual remaining
              </span>
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative w-18 h-18 flex items-center justify-center">
            <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-sanctuary-green transition-all duration-700 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-sanctuary-dark leading-none">
                {completedCount}/{totalCount}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-sanctuary-muted mt-0.5">
                Rituals
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-4 pt-3 border-t border-sanctuary-border/60 flex items-center justify-between text-xs text-sanctuary-dark font-medium cursor-pointer hover:opacity-80 transition">
          <div className="flex items-center gap-1.5">
            <span>🍃</span>
            <span>Almost at complete daily balance</span>
          </div>
          <ChevronRight className="w-4 h-4 text-sanctuary-muted" />
        </div>
      </div>

      {/* This Week Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium px-1">
          <span className="font-bold text-sanctuary-dark">This Week</span>
          <span className="text-emerald-700 font-semibold">Perfect Pace</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 bg-white p-2.5 rounded-2xl border border-sanctuary-border/60 shadow-xs">
          {[
            { day: 'M', date: 21, done: true, today: false },
            { day: 'T', date: 22, done: true, today: false },
            { day: 'W', date: 23, done: true, today: false },
            { day: 'T', date: 24, done: false, today: true },
            { day: 'F', date: 25, done: false, today: false },
            { day: 'S', date: 26, done: false, today: false },
            { day: 'S', date: 27, done: false, today: false },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center py-2 rounded-xl transition ${
                item.today
                  ? 'bg-sanctuary-green text-white shadow-sm'
                  : 'text-sanctuary-dark'
              }`}
            >
              <span className="text-[10px] text-sanctuary-muted font-medium mb-0.5" style={{ color: item.today ? '#e8efe9' : undefined }}>
                {item.day}
              </span>
              <span className="text-xs font-bold mb-1.5">{item.date}</span>
              {item.done ? (
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              ) : item.today ? (
                <div className="w-3.5 h-3.5 text-white flex items-center justify-center">
                  <Hourglass className="w-3 h-3" />
                </div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 my-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveFilter('all');
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition ${
            activeFilter === 'all'
              ? 'bg-sanctuary-dark text-white'
              : 'bg-white text-sanctuary-muted hover:bg-black/5 border border-sanctuary-border'
          }`}
        >
          All (5)
        </button>
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveFilter('morning');
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition ${
            activeFilter === 'morning'
              ? 'bg-sanctuary-dark text-white'
              : 'bg-white text-sanctuary-muted hover:bg-black/5 border border-sanctuary-border'
          }`}
        >
          Morning (3)
        </button>
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveFilter('afternoon');
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition ${
            activeFilter === 'afternoon'
              ? 'bg-sanctuary-dark text-white'
              : 'bg-white text-sanctuary-muted hover:bg-black/5 border border-sanctuary-border'
          }`}
        >
          Afternoon (1)
        </button>
        <button
          onClick={() => {
            triggerHaptic('selection');
            setActiveFilter('evening');
          }}
          className={`px-3 py-1.5 rounded-full font-medium transition ${
            activeFilter === 'evening'
              ? 'bg-sanctuary-dark text-white'
              : 'bg-white text-sanctuary-muted hover:bg-black/5 border border-sanctuary-border'
          }`}
        >
          Evening (2)
        </button>
      </div>

      {/* Today's Habits List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-sanctuary-dark">Today's Habits</span>
          <span className="text-sanctuary-muted">Tap to update</span>
        </div>

        {filteredHabits.map((habit) => (
          <div
            key={habit.id}
            className="sanctuary-card p-3.5 flex items-center justify-between transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Habit Icon */}
              <div
                className={`w-11 h-11 rounded-2xl ${getIconBg(
                  habit.color
                )} flex items-center justify-center flex-shrink-0`}
              >
                {renderHabitIcon(habit.icon)}
              </div>

              {/* Habit Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-xs text-sanctuary-dark truncate">
                    {habit.title}
                  </h3>
                  {habit.streak > 0 && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-amber-100 text-amber-800">
                      🔥 {habit.streak}d
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-sanctuary-muted truncate mt-0.5">
                  {habit.subtitle}
                </p>

                {/* Progress bar for steps */}
                {habit.targetValue && habit.currentValue !== undefined && (
                  <div className="mt-2 space-y-1">
                    <div className="w-36 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sanctuary-green h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (habit.currentValue / habit.targetValue) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-sanctuary-muted font-medium">
                      {habit.currentValue.toLocaleString()} / {habit.targetValue.toLocaleString()} {habit.unit}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Checkbox / Step Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {habit.targetValue && (
                <button
                  onClick={() => {
                    triggerHaptic('impact', 'medium');
                    onIncrementSteps(habit.id);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-sanctuary-green text-white text-[10px] font-bold flex items-center gap-1 shadow-xs hover:bg-sanctuary-greenHover transition active:scale-95"
                >
                  <Plus className="w-3 h-3" /> 500 {habit.unit}
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

      {/* Mindful Reflection Card */}
      <div className="sanctuary-card p-3.5 flex items-center gap-3 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&auto=format&fit=crop&q=80"
          alt="Mindful"
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
        <div>
          <span className="text-[9px] uppercase font-bold text-sanctuary-green tracking-wider block">
            Mindful Reflection
          </span>
          <h4 className="text-xs font-bold text-sanctuary-dark mt-0.5 leading-snug">
            Rest is a conscious choice
          </h4>
          <p className="text-[11px] text-sanctuary-muted leading-tight mt-0.5">
            Prepare your space for serene evening and deep restorative silence.
          </p>
        </div>
      </div>
    </div>
  );
};
