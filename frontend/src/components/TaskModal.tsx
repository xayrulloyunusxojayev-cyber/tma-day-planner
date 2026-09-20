import React, { useState, useEffect } from 'react';
import { X, DollarSign, Zap, Coffee, Clock } from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { triggerHaptic } from '../telegram';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  initialSlot: string;
  taskToEdit?: Task | null;
  currency: string;
}

const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSlot,
  taskToEdit,
  currency,
}) => {
  const [slot, setSlot] = useState(initialSlot || '09:00');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('dpa');
  const [revenueImpact, setRevenueImpact] = useState<string>('0');

  useEffect(() => {
    if (taskToEdit) {
      setSlot(taskToEdit.slot);
      setTitle(taskToEdit.title);
      setCategory(taskToEdit.category);
      setRevenueImpact(taskToEdit.revenue_impact.toString());
    } else {
      setSlot(initialSlot || '09:00');
      setTitle('');
      setCategory('dpa');
      setRevenueImpact('0');
    }
  }, [taskToEdit, initialSlot, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    triggerHaptic('impact', 'medium');
    onSave({
      slot,
      title: title.trim(),
      category,
      revenue_impact: parseFloat(revenueImpact) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md bg-dark-800 border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-semibold text-base text-white">
            {taskToEdit ? 'Редактировать задачу' : 'Запланировать слот'}
          </h3>
          <button
            onClick={() => {
              triggerHaptic('impact', 'light');
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Time Slot Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent-green" /> Время слота
            </label>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent-green"
            >
              {TIME_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s} - {(parseInt(s) + 1).toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Название задачи
            </label>
            <input
              type="text"
              required
              placeholder="Например: Закрыть сделку с клиентом"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-accent-green"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Категория ценности
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* DPA */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setCategory('dpa');
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  category === 'dpa'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-glow-green'
                    : 'bg-dark-900/60 border-white/5 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-semibold mb-0.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> DPA
                </div>
                <div className="text-[10px] opacity-80 leading-tight">Прямой доход</div>
              </button>

              {/* Focus */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setCategory('focus');
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  category === 'focus'
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-glow-blue'
                    : 'bg-dark-900/60 border-white/5 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-semibold mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-blue-400" /> Фокус
                </div>
                <div className="text-[10px] opacity-80 leading-tight">Проект / Код</div>
              </button>

              {/* Routine */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setCategory('routine');
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  category === 'routine'
                    ? 'bg-slate-700/50 border-slate-500 text-slate-200'
                    : 'bg-dark-900/60 border-white/5 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-semibold mb-0.5">
                  <Coffee className="w-3.5 h-3.5 text-slate-400" /> Рутина
                </div>
                <div className="text-[10px] opacity-80 leading-tight">Быт / Отдых</div>
              </button>
            </div>
          </div>

          {/* Revenue Impact */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Потенциал дохода ({currency})</span>
              <span className="text-[10px] text-accent-green">Сколько приносит задача</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm font-semibold">
                {currency === 'USD' ? '$' : currency}
              </div>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={revenueImpact}
                onChange={(e) => setRevenueImpact(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-accent-green"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-dark-700/50 hover:bg-dark-700 text-xs font-medium text-slate-300 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-accent-emerald hover:bg-accent-green text-dark-900 font-bold text-xs shadow-glow-green transition active:scale-98"
            >
              {taskToEdit ? 'Сохранить' : 'Добавить в план'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
