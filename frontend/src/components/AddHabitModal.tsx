import React, { useState } from 'react';
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
  Sparkles,
  Minus,
  Plus
} from 'lucide-react';
import { Habit, HabitCategory } from '../types';
import { triggerHaptic } from '../telegram';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Partial<Habit>) => void;
}

const ICONS = [
  { id: 'drop', icon: <Droplets className="w-5 h-5" /> },
  { id: 'book', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'walk', icon: <Footprints className="w-5 h-5" /> },
  { id: 'moon', icon: <Moon className="w-5 h-5" /> },
  { id: 'meditate', icon: <span className="text-base">🧘</span> },
  { id: 'plant', icon: <Flower2 className="w-5 h-5" /> },
  { id: 'heart', icon: <Heart className="w-5 h-5" /> },
];

const COLORS = [
  { id: 'sage', bg: 'bg-emerald-800' },
  { id: 'terracotta', bg: 'bg-[#b06c53]' },
  { id: 'gold', bg: 'bg-[#b5893d]' },
  { id: 'olive', bg: 'bg-[#5a7c66]' },
  { id: 'sand', bg: 'bg-[#6b8c75]' },
];

const CATEGORIES: HabitCategory[] = ['Mindfulness', 'Fitness', 'Productivity', 'Health', 'Sleep'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('Drink Water');
  const [selectedIcon, setSelectedIcon] = useState('drop');
  const [selectedColor, setSelectedColor] = useState('sage');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('Health');
  const [cadence, setCadence] = useState<'everyday' | 'weekdays' | 'custom'>('everyday');
  const [targetGoal, setTargetGoal] = useState(15);
  const [targetUnit, setTargetUnit] = useState('ml');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('07:30');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    triggerHaptic('notification', 'success');
    onSave({
      title: title.trim(),
      category: selectedCategory,
      timeOfDay: 'Morning',
      subtitle: `${targetGoal}${targetUnit} • ${selectedCategory}`,
      streak: 1,
      isCompleted: false,
      icon: selectedIcon,
      color: selectedColor,
      targetValue: targetGoal,
      currentValue: 0,
      unit: targetUnit,
      alarmTime: `${reminderTime} AM`,
      alarmEnabled: reminderEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="w-full sm:max-w-md bg-[#fbf9f5] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl relative max-h-[94vh] overflow-y-auto space-y-4 text-sanctuary-dark">
        {/* Header with Cancel and Save */}
        <div className="flex items-center justify-between pb-2 border-b border-sanctuary-border/60">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-sanctuary-muted hover:text-sanctuary-dark flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <div className="w-10 h-1 rounded-full bg-gray-300" />
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded-full bg-sanctuary-green hover:bg-sanctuary-greenHover text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
          >
            Save <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* Title Input Card */}
        <div className="sanctuary-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-sanctuary-green text-white flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-sanctuary-green tracking-wider block">
                  New Ritual
                </span>
                <h3 className="font-bold text-sm text-sanctuary-dark">{title || 'Habit Name'}</h3>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
              {selectedCategory}
            </span>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-sanctuary-muted tracking-wider mb-1">
              Habit Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#f6f3eb] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-sanctuary-dark outline-none focus:ring-1 focus:ring-sanctuary-green pr-8"
              />
              {title && (
                <button
                  type="button"
                  onClick={() => setTitle('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Inspirations */}
          <div>
            <span className="text-[10px] font-medium text-sanctuary-muted block mb-1.5">Inspirations</span>
            <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-medium">
              {[
                { title: 'Drink Water', icon: '💧' },
                { title: 'Read Book', icon: '📖' },
                { title: 'Run 3km', icon: '👟' },
              ].map((insp) => (
                <button
                  key={insp.title}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setTitle(insp.title);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#f5f1e9] hover:bg-[#ede7db] text-sanctuary-dark border border-sanctuary-border/60 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{insp.icon}</span> {insp.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Aesthetic & Symbol */}
        <div className="sanctuary-card p-4 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-sanctuary-dark">Aesthetic & Symbol</h4>
            <p className="text-[10px] text-sanctuary-muted">Select tactile talisman and visual hue</p>
          </div>

          {/* Icon Selection */}
          <div className="flex items-center justify-between">
            {ICONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedIcon(item.id);
                }}
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition ${
                  selectedIcon === item.id
                    ? 'bg-sanctuary-green text-white shadow-xs'
                    : 'bg-[#f6f3eb] text-sanctuary-dark hover:bg-gray-200'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>

          {/* Color Selection */}
          <div className="flex items-center gap-3 pt-1">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedColor(c.id);
                }}
                className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center text-white transition ${
                  selectedColor === c.id ? 'ring-2 ring-offset-2 ring-sanctuary-green' : ''
                }`}
              >
                {selectedColor === c.id && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Category Realm */}
        <div className="sanctuary-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-sanctuary-dark">Category Realm</h4>
            <span className="text-[10px] text-sanctuary-muted">Organize daily flow</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-sanctuary-green text-white font-bold'
                    : 'bg-[#f6f3eb] text-sanctuary-dark hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cadence & Cycle */}
        <div className="sanctuary-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-sanctuary-dark">Cadence & Cycle</h4>
              <p className="text-[10px] text-sanctuary-muted">When does this ritual live?</p>
            </div>
            <div className="flex items-center bg-[#f6f3eb] p-0.5 rounded-full text-[10px]">
              <button
                type="button"
                onClick={() => setCadence('everyday')}
                className={`px-2 py-0.5 rounded-full transition ${
                  cadence === 'everyday' ? 'bg-sanctuary-green text-white font-bold' : 'text-sanctuary-muted'
                }`}
              >
                Every day
              </button>
              <button
                type="button"
                onClick={() => setCadence('weekdays')}
                className={`px-2 py-0.5 rounded-full transition ${
                  cadence === 'weekdays' ? 'bg-sanctuary-green text-white font-bold' : 'text-sanctuary-muted'
                }`}
              >
                Weekdays
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div
                key={i}
                className="w-full py-2 rounded-xl bg-sanctuary-green text-white text-center flex flex-col items-center justify-center text-[10px] font-bold"
              >
                <span>{d}</span>
                <Check className="w-2.5 h-2.5 stroke-[3] mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Target Goal */}
        <div className="sanctuary-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-sanctuary-dark">Target Goal</h4>
            <span>🚩</span>
          </div>

          <div className="flex items-center justify-between bg-[#f6f3eb] rounded-2xl p-2 px-4">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('impact', 'light');
                setTargetGoal(Math.max(1, targetGoal - 5));
              }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sanctuary-dark shadow-xs"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold text-sanctuary-dark">{targetGoal}</span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('impact', 'light');
                setTargetGoal(targetGoal + 5);
              }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sanctuary-dark shadow-xs"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-sanctuary-muted">Unit Metric</span>
            <select
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value)}
              className="bg-[#f6f3eb] rounded-xl px-3 py-1 text-xs font-bold text-sanctuary-dark outline-none"
            >
              <option value="ml">ml</option>
              <option value="steps">steps</option>
              <option value="pages">pages</option>
              <option value="min">min</option>
              <option value="times">times</option>
            </select>
          </div>
        </div>

        {/* Reminder */}
        <div className="sanctuary-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span>🔔</span>
              <h4 className="text-xs font-bold text-sanctuary-dark">Reminder</h4>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('impact', 'light');
                setReminderEnabled(!reminderEnabled);
              }}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                reminderEnabled ? 'bg-sanctuary-green' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                  reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#f6f3eb] rounded-xl p-2.5 px-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sanctuary-dark">
              <Clock className="w-3.5 h-3.5 text-sanctuary-green" />
              <span>Morning Call</span>
            </div>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-white rounded-lg px-2 py-0.5 text-xs font-bold font-mono text-sanctuary-dark outline-none"
            />
          </div>
          <p className="text-[10px] text-sanctuary-muted">Quiet haptic nudge to maintain flow.</p>
        </div>

        {/* Mindful Foundation Quote */}
        <div className="bg-[#f5f1e9] rounded-2xl p-3 flex items-start gap-2.5 border border-[#eae3d5]">
          <span className="text-base">🌱</span>
          <div>
            <h5 className="font-bold text-xs text-sanctuary-dark">Mindful Foundation</h5>
            <p className="text-[10px] text-sanctuary-muted mt-0.5">
              Small atomic repetitions shape lasting serenity and sustainable focus.
            </p>
          </div>
        </div>

        {/* Create Habit Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white font-bold text-xs shadow-float transition active:scale-98 flex items-center justify-center gap-2"
        >
          <span>✍️</span>
          <span>Create Habit</span>
        </button>
      </div>
    </div>
  );
};
