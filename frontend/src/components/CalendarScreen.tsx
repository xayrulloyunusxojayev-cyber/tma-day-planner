import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar as CalendarIcon,
  Download,
  Share2
} from 'lucide-react';
import { Habit } from '../types';
import { triggerHaptic } from '../telegram';
import { getMonthDays, formatMonthYear, downloadIcsCalendar, formatDateKey } from '../utils/calendar';
import { Language, translations } from '../i18n/translations';

interface CalendarScreenProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  lang: Language;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  habits,
  onToggleHabit,
  lang,
}) => {
  const t = translations[lang];
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  const monthDays = getMonthDays(year, monthIndex);
  const selectedDateKey = formatDateKey(selectedDate);
  const todayKey = formatDateKey(new Date());

  const handlePrevMonth = () => {
    triggerHaptic('selection');
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    triggerHaptic('selection');
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const handleSelectDay = (d: Date) => {
    triggerHaptic('selection');
    setSelectedDate(d);
  };

  const handleExportToCalendar = () => {
    triggerHaptic('notification', 'success');
    downloadIcsCalendar(habits);
  };

  const completedCount = habits.filter((h) => h.isCompleted).length;
  const locale = lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-US' : 'ru-RU';

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* Calendar Header & Export */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-sanctuary-muted block mb-1">
            {t.interactiveCalendarSubtitle}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-sanctuary-dark">
            {t.calendarTitle}
          </h1>
        </div>

        {/* Export Button to Real Phone Calendar */}
        <button
          onClick={handleExportToCalendar}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white text-xs font-black shadow-sm btn-press"
          title="Экспортировать в Календарь телефона (iCal / Google / Apple)"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{t.exportToCalendarBtn}</span>
        </button>
      </div>

      {/* Real Month View (Bold & Clean) */}
      <div className="sanctuary-card p-5 space-y-4 border-2 border-sanctuary-border">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-sanctuary-dark capitalize tracking-tight">
            {formatMonthYear(year, monthIndex, lang)}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl hover:bg-black/5 text-sanctuary-dark transition btn-press border border-sanctuary-border"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl hover:bg-black/5 text-sanctuary-dark transition btn-press border border-sanctuary-border"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Weekday Names */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black text-sanctuary-muted uppercase tracking-wider">
          {t.weekDays.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
          {monthDays.map((cell, idx) => {
            const isSelected = formatDateKey(cell.date) === selectedDateKey;

            return (
              <button
                key={idx}
                onClick={() => handleSelectDay(cell.date)}
                className={`py-2.5 rounded-xl flex flex-col items-center justify-center transition btn-press ${
                  isSelected
                    ? 'bg-sanctuary-green text-white font-black shadow-md shadow-sanctuary-green/25 scale-[1.05]'
                    : cell.isToday
                    ? 'bg-emerald-100/90 text-sanctuary-dark font-black border border-emerald-300'
                    : cell.isCurrentMonth
                    ? 'text-sanctuary-dark font-bold hover:bg-black/5'
                    : 'text-gray-300 font-medium'
                }`}
              >
                <span className="font-mono text-sm">{cell.dayNumber}</span>
                {cell.isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sanctuary-green mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-black text-sanctuary-dark text-sm tracking-tight">
            {t.scheduleFor}{' '}
            {selectedDate.toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
            })}
          </span>
          <span className="text-sanctuary-muted font-bold text-xs bg-gray-100 px-2 py-0.5 rounded-md">
            {t.completedTasksCount.replace('{completed}', completedCount.toString()).replace('{total}', habits.length.toString())}
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((h) => (
            <div
              key={h.id}
              className={`sanctuary-card p-3.5 flex items-center justify-between border-2 transition ${
                h.isCompleted
                  ? 'border-sanctuary-green/20 bg-[#fafcfb]'
                  : 'border-sanctuary-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f4f1eb] border border-sanctuary-border flex items-center justify-center text-xs shadow-inner-soft">
                  {h.icon === 'drop'
                    ? '💧'
                    : h.icon === 'meditate'
                    ? '🧘'
                    : h.icon === 'book'
                    ? '📖'
                    : h.icon === 'walk'
                    ? '🌲'
                    : '🌙'}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-sanctuary-dark tracking-tight">{h.title}</h4>
                  <p className="text-[11px] font-medium text-sanctuary-muted">
                    {h.alarmTime || h.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('impact', 'medium');
                  onToggleHabit(h.id);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition btn-press ${
                  h.isCompleted
                    ? 'bg-sanctuary-green text-white shadow-xs'
                    : 'border-2 border-gray-300 bg-white'
                }`}
              >
                {h.isCompleted && <Check className="w-4 h-4 stroke-[3.5]" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
