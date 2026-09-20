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

interface CalendarScreenProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  habits,
  onToggleHabit,
}) => {
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

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* Calendar Header & Export */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-sanctuary-muted font-medium block">
            Интерактивный календарь
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-sanctuary-dark">
            Календарь
          </h1>
        </div>

        {/* Export Button to Real Phone Calendar */}
        <button
          onClick={handleExportToCalendar}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white text-xs font-semibold shadow-xs transition active:scale-95"
          title="Экспортировать в Календарь телефона (iCal / Google / Apple)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>В календарь</span>
        </button>
      </div>

      {/* Real Month View */}
      <div className="sanctuary-card p-4 space-y-3">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-sanctuary-dark capitalize">
            {formatMonthYear(year, monthIndex)}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-black/5 text-sanctuary-muted transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-black/5 text-sanctuary-muted transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Names */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-sanctuary-muted">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {monthDays.map((cell, idx) => {
            const isSelected = formatDateKey(cell.date) === selectedDateKey;

            return (
              <button
                key={idx}
                onClick={() => handleSelectDay(cell.date)}
                className={`py-2 rounded-xl flex flex-col items-center justify-center transition ${
                  isSelected
                    ? 'bg-sanctuary-green text-white font-bold shadow-xs'
                    : cell.isToday
                    ? 'bg-emerald-100/80 text-sanctuary-dark font-bold'
                    : cell.isCurrentMonth
                    ? 'text-sanctuary-dark hover:bg-black/5'
                    : 'text-gray-300'
                }`}
              >
                <span>{cell.dayNumber}</span>
                {cell.isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-sanctuary-green mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-sanctuary-dark">
            Расписание на{' '}
            {selectedDate.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
            })}
          </span>
          <span className="text-sanctuary-muted text-[11px]">
            {completedCount} из {habits.length} выполнено
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((h) => (
            <div
              key={h.id}
              className="sanctuary-card p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-xs">
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
                  <h4 className="font-bold text-xs text-sanctuary-dark">{h.title}</h4>
                  <p className="text-[10px] text-sanctuary-muted">
                    {h.alarmTime || h.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('impact', 'medium');
                  onToggleHabit(h.id);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                  h.isCompleted
                    ? 'bg-sanctuary-green text-white shadow-xs'
                    : 'border-2 border-gray-300 bg-transparent'
                }`}
              >
                {h.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
