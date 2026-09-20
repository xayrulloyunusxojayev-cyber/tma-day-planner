import React, { useState } from 'react';
import { Plus, Check, DollarSign, Zap, Coffee, Clock, Trash2, Edit3, ArrowUpRight } from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { triggerHaptic } from '../telegram';

interface DayPlannerTableProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (slot: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  currency: string;
}

// Generate hourly slots from 06:00 to 23:00
const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export const DayPlannerTable: React.FC<DayPlannerTableProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  currency,
}) => {
  const [filter, setFilter] = useState<'all' | 'dpa' | 'active'>('all');

  const currPrefix = currency === 'USD' ? '$' : '';
  const currSuffix = currency !== 'USD' ? ` ${currency}` : '';

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'dpa') return t.category === 'dpa';
    if (filter === 'active') return !t.is_completed;
    return true;
  });

  const getCategoryBadge = (cat: TaskCategory) => {
    switch (cat) {
      case 'dpa':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="w-2.5 h-2.5" /> DPA
          </span>
        );
      case 'focus':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Zap className="w-2.5 h-2.5" /> Фокус
          </span>
        );
      case 'routine':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/40 text-slate-400 border border-slate-600/30">
            <Coffee className="w-2.5 h-2.5" /> Рутина
          </span>
        );
    }
  };

  return (
    <section className="px-4 py-2 pb-24">
      {/* Table Header & Filters */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-green" />
          <h2 className="font-semibold text-sm text-white">Расписание & Доход</h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-dark-800/80 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => {
              triggerHaptic('selection');
              setFilter('all');
            }}
            className={`px-2 py-0.5 rounded-lg text-xs transition ${
              filter === 'all'
                ? 'bg-dark-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => {
              triggerHaptic('selection');
              setFilter('dpa');
            }}
            className={`px-2 py-0.5 rounded-lg text-xs transition flex items-center gap-1 ${
              filter === 'dpa'
                ? 'bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💰 DPA
          </button>
          <button
            onClick={() => {
              triggerHaptic('selection');
              setFilter('active');
            }}
            className={`px-2 py-0.5 rounded-lg text-xs transition ${
              filter === 'active'
                ? 'bg-dark-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            В работе
          </button>
        </div>
      </div>

      {/* Slots List / Table */}
      <div className="space-y-2">
        {TIME_SLOTS.map((slot) => {
          const slotTasks = filteredTasks.filter((t) => t.slot === slot);

          return (
            <div
              key={slot}
              className="flex items-start gap-2 group transition-all"
            >
              {/* Slot Time Label */}
              <div className="w-14 pt-2.5 text-right flex-shrink-0">
                <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition">
                  {slot}
                </span>
              </div>

              {/* Slot Content */}
              <div className="flex-1 min-w-0">
                {slotTasks.length > 0 ? (
                  <div className="space-y-1.5">
                    {slotTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`rounded-xl p-3 border transition-all duration-200 ${
                          task.is_completed
                            ? 'bg-dark-800/40 border-white/5 opacity-60'
                            : task.category === 'dpa'
                            ? 'glass-card border-emerald-500/30 shadow-glow-green/20'
                            : 'glass-card border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Complete Checkbox */}
                          <button
                            onClick={() => {
                              triggerHaptic('impact', 'medium');
                              onToggleTask(task.id);
                            }}
                            className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-all ${
                              task.is_completed
                                ? 'bg-accent-green border-accent-green text-dark-900 shadow-glow-green'
                                : 'border-slate-600 hover:border-accent-green bg-dark-800'
                            }`}
                          >
                            {task.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          {/* Title & Badge */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => onEditTask(task)}
                          >
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {getCategoryBadge(task.category)}
                              {task.revenue_impact > 0 && (
                                <span
                                  className={`text-xs font-bold ${
                                    task.is_completed
                                      ? 'text-accent-green'
                                      : 'text-amber-400'
                                  }`}
                                >
                                  +{currPrefix}{task.revenue_impact}{currSuffix}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs font-medium leading-snug break-words ${
                                task.is_completed
                                  ? 'line-through text-slate-500'
                                  : 'text-slate-100'
                              }`}
                            >
                              {task.title}
                            </p>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={() => onEditTask(task)}
                              className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition"
                              title="Редактировать"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                triggerHaptic('impact', 'light');
                                onDeleteTask(task.id);
                              }}
                              className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty Slot - Add Task button */
                  <button
                    onClick={() => {
                      triggerHaptic('selection');
                      onAddTask(slot);
                    }}
                    className="w-full text-left py-2 px-3 rounded-xl border border-dashed border-white/5 hover:border-accent-green/30 bg-transparent hover:bg-dark-800/40 text-[11px] text-slate-500 hover:text-accent-green transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Свободно • Добавить задачу</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
