import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Droplets,
  BookOpen,
  Footprints,
  Moon,
  Heart,
  Flower2,
  Clock,
  Minus,
  Plus,
  Trash2
} from 'lucide-react';
import { Habit, HabitCategory } from '../types';
import { triggerHaptic } from '../telegram';
import { Language, translations } from '../i18n/translations';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Partial<Habit>) => void;
  onDelete?: (habitId: string) => void;
  habitToEdit?: Habit | null;
  lang: Language;
}

const ICONS = [
  { id: 'drop', icon: <Droplets className="w-5 h-5 stroke-[2.3]" /> },
  { id: 'book', icon: <BookOpen className="w-5 h-5 stroke-[2.3]" /> },
  { id: 'walk', icon: <Footprints className="w-5 h-5 stroke-[2.3]" /> },
  { id: 'moon', icon: <Moon className="w-5 h-5 stroke-[2.3]" /> },
  { id: 'meditate', icon: <span className="text-base">🧘</span> },
  { id: 'plant', icon: <Flower2 className="w-5 h-5 stroke-[2.3]" /> },
  { id: 'heart', icon: <Heart className="w-5 h-5 stroke-[2.3]" /> },
];

const COLORS = [
  { id: 'sage', bg: 'bg-[#234a31]' },
  { id: 'terracotta', bg: 'bg-[#a85b42]' },
  { id: 'gold', bg: 'bg-[#b88228]' },
  { id: 'olive', bg: 'bg-[#4e735b]' },
  { id: 'sand', bg: 'bg-[#62806b]' },
];

const CATEGORIES: HabitCategory[] = ['Mindfulness', 'Fitness', 'Productivity', 'Health', 'Sleep'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  habitToEdit,
  lang,
}) => {
  const t = translations[lang];

  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('drop');
  const [selectedColor, setSelectedColor] = useState('sage');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('Health');
  const [cadence, setCadence] = useState<'everyday' | 'weekdays'>('everyday');
  const [targetGoal, setTargetGoal] = useState(15);
  const [targetUnit, setTargetUnit] = useState('ml');
  const [isTimeRange, setIsTimeRange] = useState(true);
  const [timeFrom, setTimeFrom] = useState('07:30');
  const [timeTo, setTimeTo] = useState('09:00');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setSelectedIcon(habitToEdit.icon || 'drop');
      setSelectedColor(habitToEdit.color || 'sage');
      setSelectedCategory(habitToEdit.category || 'Health');
      setTargetGoal(habitToEdit.targetValue || 15);
      setTargetUnit(habitToEdit.unit || 'ml');

      if (habitToEdit.alarmTime) {
        if (habitToEdit.alarmTime.includes('-')) {
          const parts = habitToEdit.alarmTime.split('-').map((p) => p.trim());
          setTimeFrom(parts[0] || '07:30');
          setTimeTo(parts[1] || '09:00');
          setIsTimeRange(true);
        } else {
          setTimeFrom(habitToEdit.alarmTime);
          setTimeTo('09:00');
          setIsTimeRange(false);
        }
      }
    } else {
      setTitle(lang === 'ru' ? 'Пить воду' : lang === 'uz' ? 'Suv ichish' : 'Drink Water');
      setSelectedIcon('drop');
      setSelectedColor('sage');
      setSelectedCategory('Health');
      setTargetGoal(15);
      setTargetUnit('ml');
      setTimeFrom('07:30');
      setTimeTo('09:00');
      setIsTimeRange(true);
    }
  }, [habitToEdit, isOpen, lang]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    triggerHaptic('notification', 'success');

    const formattedTime = isTimeRange ? `${timeFrom} - ${timeTo}` : timeFrom;

    onSave({
      id: habitToEdit ? habitToEdit.id : undefined,
      title: title.trim(),
      category: selectedCategory,
      timeOfDay: 'Morning',
      subtitle: `${targetGoal}${targetUnit} • ${selectedCategory}`,
      icon: selectedIcon,
      color: selectedColor,
      targetValue: targetGoal,
      currentValue: habitToEdit ? habitToEdit.currentValue : 0,
      unit: targetUnit,
      alarmTime: formattedTime,
      alarmEnabled: true,
    });
    onClose();
  };

  const handleDelete = () => {
    if (habitToEdit && onDelete) {
      if (confirm(t.deleteConfirm)) {
        triggerHaptic('notification', 'warning');
        onDelete(habitToEdit.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:max-w-md bg-[#fbf9f5] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl relative max-h-[94vh] overflow-y-auto space-y-4 text-sanctuary-dark border-t-2 border-sanctuary-border">
        {/* Header with Cancel and Save */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-sanctuary-border">
          <button
            onClick={onClose}
            className="text-xs font-extrabold text-sanctuary-muted hover:text-sanctuary-dark flex items-center gap-1 btn-press"
          >
            <X className="w-4 h-4 stroke-[2.5]" /> {t.cancelBtn}
          </button>
          <div className="w-12 h-1.5 rounded-full bg-[#ded8ce]" />
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-full bg-sanctuary-green hover:bg-sanctuary-greenHover text-white text-xs font-black flex items-center gap-1 shadow-sm btn-press"
          >
            <span>{habitToEdit ? t.saveChangesBtn : t.saveBtn}</span> <Check className="w-3.5 h-3.5 stroke-[3.5]" />
          </button>
        </div>

        {/* Title Card */}
        <div className="sanctuary-card p-5 space-y-3.5 border-2 border-sanctuary-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[18px] bg-sanctuary-green text-white flex items-center justify-center shadow-md shadow-sanctuary-green/20">
                <Droplets className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-sanctuary-green tracking-wider block">
                  {habitToEdit ? t.editRitualTitle : t.newRitualTitle}
                </span>
                <h3 className="font-black text-base text-sanctuary-dark tracking-tight">{title || t.habitNamePlaceholder}</h3>
              </div>
            </div>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-950 border border-emerald-300">
              {selectedCategory}
            </span>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-black text-sanctuary-muted tracking-wider mb-1.5">
              {t.habitTitleLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.habitNamePlaceholder}
                className="w-full bg-[#f4f1eb] rounded-xl px-4 py-3 text-sm font-extrabold text-sanctuary-dark outline-none border border-sanctuary-border focus:border-sanctuary-green pr-9"
              />
              {title && (
                <button
                  type="button"
                  onClick={() => setTitle('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>

          {/* Inspirations */}
          {!habitToEdit && (
            <div>
              <span className="text-[11px] font-black text-sanctuary-muted block mb-1.5 uppercase tracking-wider">{t.inspirationsLabel}</span>
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-extrabold pb-1">
                {[
                  { title: lang === 'ru' ? 'Пить воду' : lang === 'uz' ? 'Suv ichish' : 'Drink Water', icon: '💧' },
                  { title: lang === 'ru' ? 'Читать книгу' : lang === 'uz' ? 'Kitob o\'qish' : 'Read Book', icon: '📖' },
                  { title: lang === 'ru' ? 'Бег 3 км' : lang === 'uz' ? 'Yugurish 3km' : 'Run 3km', icon: '👟' },
                ].map((insp) => (
                  <button
                    key={insp.title}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setTitle(insp.title);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#f4f1eb] hover:bg-[#ede8df] text-sanctuary-dark border border-sanctuary-border transition flex items-center gap-1.5 whitespace-nowrap btn-press"
                  >
                    <span>{insp.icon}</span> {insp.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Time & Interval Card */}
        <div className="sanctuary-card p-5 space-y-3.5 border-2 border-sanctuary-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sanctuary-green stroke-[2.5]" />
              <h4 className="text-sm font-black text-sanctuary-dark tracking-tight">{t.reminderLabel}</h4>
            </div>

            {/* Range toggle */}
            <div className="flex items-center bg-[#f4f1eb] p-1 rounded-full text-xs font-black border border-sanctuary-border">
              <button
                type="button"
                onClick={() => setIsTimeRange(false)}
                className={`px-3 py-1 rounded-full transition ${
                  !isTimeRange ? 'bg-sanctuary-green text-white shadow-xs' : 'text-sanctuary-muted'
                }`}
              >
                Точное
              </button>
              <button
                type="button"
                onClick={() => setIsTimeRange(true)}
                className={`px-3 py-1 rounded-full transition ${
                  isTimeRange ? 'bg-sanctuary-green text-white shadow-xs' : 'text-sanctuary-muted'
                }`}
              >
                Интервал
              </button>
            </div>
          </div>

          {/* Time pickers */}
          {isTimeRange ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f4f1eb] rounded-2xl p-3 border border-sanctuary-border">
                <span className="text-[11px] font-black text-sanctuary-muted block mb-1 uppercase tracking-wider">{t.timeFrom}</span>
                <input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  className="w-full bg-white border border-sanctuary-border rounded-xl px-3 py-2 text-base font-black font-mono text-sanctuary-dark outline-none text-center cursor-pointer shadow-2xs"
                />
              </div>
              <div className="bg-[#f4f1eb] rounded-2xl p-3 border border-sanctuary-border">
                <span className="text-[11px] font-black text-sanctuary-muted block mb-1 uppercase tracking-wider">{t.timeTo}</span>
                <input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                  className="w-full bg-white border border-sanctuary-border rounded-xl px-3 py-2 text-base font-black font-mono text-sanctuary-dark outline-none text-center cursor-pointer shadow-2xs"
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#f4f1eb] rounded-2xl p-3.5 border border-sanctuary-border flex items-center justify-between">
              <span className="text-xs font-black text-sanctuary-dark">Время начала</span>
              <input
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                className="bg-white border border-sanctuary-border rounded-xl px-4 py-2 text-base font-black font-mono text-sanctuary-dark outline-none cursor-pointer shadow-2xs"
              />
            </div>
          )}
        </div>

        {/* Aesthetic & Symbol */}
        <div className="sanctuary-card p-5 space-y-3.5 border-2 border-sanctuary-border">
          <div>
            <h4 className="text-sm font-black text-sanctuary-dark tracking-tight">{t.aestheticTitle}</h4>
            <p className="text-[11px] font-semibold text-sanctuary-muted">{t.aestheticSubtitle}</p>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            {ICONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedIcon(item.id);
                }}
                className={`w-11 h-11 rounded-[16px] flex items-center justify-center transition btn-press ${
                  selectedIcon === item.id
                    ? 'bg-sanctuary-green text-white shadow-md shadow-sanctuary-green/30 scale-105'
                    : 'bg-[#f4f1eb] text-sanctuary-dark hover:bg-gray-200 border border-sanctuary-border'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3.5 pt-1">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedColor(c.id);
                }}
                className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center text-white transition btn-press ${
                  selectedColor === c.id ? 'ring-3 ring-offset-2 ring-sanctuary-green scale-110 shadow-sm' : ''
                }`}
              >
                {selectedColor === c.id && <Check className="w-4 h-4 stroke-[4]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Category Realm */}
        <div className="sanctuary-card p-5 space-y-2.5 border-2 border-sanctuary-border">
          <h4 className="text-sm font-black text-sanctuary-dark tracking-tight">{t.categoryLabel}</h4>
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition btn-press ${
                  selectedCategory === cat
                    ? 'bg-sanctuary-green text-white shadow-sm'
                    : 'bg-[#f4f1eb] text-sanctuary-dark hover:bg-gray-200 border border-sanctuary-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Target Goal */}
        <div className="sanctuary-card p-5 space-y-3.5 border-2 border-sanctuary-border">
          <h4 className="text-sm font-black text-sanctuary-dark tracking-tight">{t.targetGoalLabel}</h4>

          <div className="flex items-center justify-between bg-[#f4f1eb] rounded-2xl p-2.5 px-5 border border-sanctuary-border">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('impact', 'light');
                setTargetGoal(Math.max(1, targetGoal - 5));
              }}
              className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-sanctuary-dark shadow-xs btn-press border border-sanctuary-border"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>
            <span className="text-2xl font-black text-sanctuary-dark font-mono">{targetGoal}</span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('impact', 'light');
                setTargetGoal(targetGoal + 5);
              }}
              className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-sanctuary-dark shadow-xs btn-press border border-sanctuary-border"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-sanctuary-muted">{t.unitLabel}</span>
            <select
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value)}
              className="bg-[#f4f1eb] border border-sanctuary-border rounded-xl px-3.5 py-1.5 text-xs font-black text-sanctuary-dark outline-none cursor-pointer"
            >
              <option value="ml">ml</option>
              <option value="steps">steps</option>
              <option value="pages">pages</option>
              <option value="min">min</option>
              <option value="times">times</option>
            </select>
          </div>
        </div>

        {/* Save & Delete Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white font-black text-sm shadow-float-green transition btn-press flex items-center justify-center gap-2"
          >
            <span>✍️</span>
            <span>{habitToEdit ? t.saveChangesBtn : t.createHabitBtn}</span>
          </button>

          {habitToEdit && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs border-2 border-rose-200 transition btn-press flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
              <span>{t.deleteHabitBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
