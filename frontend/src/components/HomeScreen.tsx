import React, { useState } from 'react';
import {
  Droplets,
  BookOpen,
  Footprints,
  Moon,
  Check,
  Flame,
  Plus,
  Sparkles,
  Edit2
} from 'lucide-react';
import { Habit } from '../types';
import { triggerHaptic } from '../telegram';
import { alarmAudio } from '../audio';
import { getCurrentWeekDays } from '../utils/calendar';
import { Language, translations } from '../i18n/translations';

interface HomeScreenProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onIncrementSteps: (id: string) => void;
  onEditHabit: (habit: Habit) => void;
  userName?: string;
  lang: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  habits,
  onToggleHabit,
  onIncrementSteps,
  onEditHabit,
  userName = 'Hayrullo',
  lang,
}) => {
  const t = translations[lang];
  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const weekDays = getCurrentWeekDays(lang);

  const locale = lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-US' : 'ru-RU';
  const todayStr = new Date().toLocaleDateString(locale, {
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
        return <Droplets className="w-5 h-5 text-emerald-800 stroke-[2.3]" />;
      case 'meditate':
        return <span className="text-lg">🧘</span>;
      case 'book':
        return <BookOpen className="w-5 h-5 text-amber-800 stroke-[2.3]" />;
      case 'walk':
        return <Footprints className="w-5 h-5 text-emerald-900 stroke-[2.3]" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-slate-700 stroke-[2.3]" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-800 stroke-[2.3]" />;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning;
    if (hour < 18) return t.greetingDay;
    return t.greetingEvening;
  };

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* Date & Greeting */}
      <div className="pt-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-sanctuary-muted block mb-1">
          {todayStr}
        </span>
        <h1 className="text-3xl font-black tracking-tight text-sanctuary-dark">
          {getGreeting()}, {userName}
        </h1>
      </div>

      {/* Harmony in Motion Card (Premium Bold) */}
      <div className="sanctuary-card p-5 relative overflow-hidden bg-gradient-to-b from-white to-[#fcfaf7]">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-100/90 text-amber-950 border border-amber-300/60 shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> 14 {t.streakDays}
            </span>
            <h2 className="text-xl font-black text-sanctuary-dark pt-0.5 tracking-tight">
              {t.todayProgressTitle}
            </h2>
            <p className="text-xs font-semibold text-sanctuary-muted">
              {t.completedOf.replace('{completed}', completedCount.toString()).replace('{total}', totalCount.toString())}
            </p>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-20 h-20 transform -rotate-90 drop-shadow-xs" viewBox="0 0 36 36">
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
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-sanctuary-dark tracking-tight">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Current Week Row (Bold & Clean) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold px-1">
          <span className="text-sanctuary-dark font-black tracking-tight uppercase text-[11px]">
            {t.thisWeekTitle}
          </span>
          <span className="text-sanctuary-green font-extrabold text-[11px] bg-emerald-100/70 px-2 py-0.5 rounded-full">
            {t.liveCalendarBadge}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 bg-white p-2.5 rounded-[22px] border-2 border-sanctuary-border shadow-card">
          {weekDays.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center py-2.5 rounded-xl transition ${
                item.isToday
                  ? 'bg-sanctuary-green text-white shadow-md shadow-sanctuary-green/20 scale-[1.04]'
                  : 'text-sanctuary-dark hover:bg-black/5'
              }`}
            >
              <span
                className={`text-[10px] font-black uppercase mb-1 ${
                  item.isToday ? 'text-emerald-100' : 'text-sanctuary-muted'
                }`}
              >
                {item.day}
              </span>
              <span className="text-sm font-black font-mono">{item.date}</span>
              {item.isToday ? (
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shadow-xs" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
        {[
          { id: 'all', label: `${t.filterAll} (${habits.length})` },
          { id: 'morning', label: t.filterMorning },
          { id: 'afternoon', label: t.filterAfternoon },
          { id: 'evening', label: t.filterEvening },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              triggerHaptic('selection');
              setActiveFilter(tab.id as any);
            }}
            className={`px-3.5 py-1.5 rounded-full font-black text-[11px] transition btn-press border-2 ${
              activeFilter === tab.id
                ? 'bg-sanctuary-dark text-white border-sanctuary-dark shadow-sm'
                : 'bg-white text-sanctuary-muted border-sanctuary-border hover:border-sanctuary-borderStrong'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Habits List (Clean & Responsive layout without text truncation) */}
      <div className="space-y-2.5 pt-1">
        {filteredHabits.map((habit) => (
          <div
            key={habit.id}
            className={`sanctuary-card p-4 flex flex-col gap-2.5 border-2 transition ${
              habit.isCompleted
                ? 'border-sanctuary-green/25 bg-[#fafcfb]'
                : 'border-sanctuary-border hover:border-sanctuary-borderStrong'
            }`}
          >
            {/* Top row: Icon, Title & Time, Edit & Checkbox */}
            <div className="flex items-start justify-between gap-2.5">
              {/* Clickable Area for Editing */}
              <div
                onClick={() => {
                  triggerHaptic('impact', 'light');
                  onEditHabit(habit);
                }}
                className="flex items-start gap-3 min-w-0 flex-1 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-[18px] bg-[#f4f1eb] border border-sanctuary-border flex items-center justify-center flex-shrink-0 shadow-inner-soft group-hover:scale-105 transition">
                  {renderIcon(habit.icon)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-extrabold text-sm text-sanctuary-dark tracking-tight leading-snug group-hover:text-sanctuary-green transition">
                      {habit.title}
                    </h3>
                    {habit.alarmTime && (
                      <span className="text-[10px] font-mono font-black text-sanctuary-muted bg-[#f4f1eb] px-2 py-0.5 rounded-md border border-sanctuary-border whitespace-nowrap">
                        {habit.alarmTime}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-sanctuary-muted mt-0.5">
                    {habit.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Edit, +500, Checkbox */}
              <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                {/* Edit Button */}
                <button
                  onClick={() => {
                    triggerHaptic('impact', 'light');
                    onEditHabit(habit);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sanctuary-muted hover:text-sanctuary-dark hover:bg-black/5 transition btn-press"
                  title="Редактировать или удалить"
                >
                  <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                {/* +500 Steps button */}
                {habit.targetValue && (
                  <button
                    onClick={() => {
                      triggerHaptic('impact', 'medium');
                      onIncrementSteps(habit.id);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white text-[10px] font-black flex items-center gap-1 shadow-sm btn-press whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" /> 500
                  </button>
                )}

                {/* Complete Checkbox */}
                <button
                  onClick={() => {
                    triggerHaptic('notification', 'success');
                    alarmAudio.playTone(880, 0.15, 0, 'sine');
                    onToggleHabit(habit.id);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition btn-press ${
                    habit.isCompleted
                      ? 'bg-sanctuary-green text-white shadow-md shadow-sanctuary-green/30 scale-105'
                      : 'border-2 border-gray-300 hover:border-sanctuary-green bg-white'
                  }`}
                >
                  {habit.isCompleted && <Check className="w-4 h-4 stroke-[3.5]" />}
                </button>
              </div>
            </div>

            {/* Progress bar if steps/metric exists */}
            {habit.targetValue && habit.currentValue !== undefined && (
              <div className="pl-15 pr-1 space-y-1">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200/50">
                  <div
                    className="bg-gradient-to-r from-sanctuary-green to-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (habit.currentValue / habit.targetValue) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] font-bold text-sanctuary-dark flex items-center justify-between">
                  <span>{habit.currentValue} / {habit.targetValue} {habit.unit}</span>
                  <span className="text-[10px] font-black text-sanctuary-green">
                    {Math.round((habit.currentValue / habit.targetValue) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
