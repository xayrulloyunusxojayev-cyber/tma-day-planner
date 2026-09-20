import React, { useState } from 'react';
import { X, Bell, Volume2, Sparkles, Check, Play, Square } from 'lucide-react';
import { AlarmSettings } from '../types';
import { triggerHaptic } from '../telegram';
import { alarmAudio } from '../audio';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarm: AlarmSettings;
  onSaveAlarm: (settings: AlarmSettings) => void;
}

const DAYS = [
  { id: 0, label: 'Пн' },
  { id: 1, label: 'Вт' },
  { id: 2, label: 'Ср' },
  { id: 3, label: 'Чт' },
  { id: 4, label: 'Пт' },
  { id: 5, label: 'Сб' },
  { id: 6, label: 'Вс' },
];

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  onClose,
  alarm,
  onSaveAlarm,
}) => {
  const [wakeTime, setWakeTime] = useState(alarm.wake_time || '07:00');
  const [isActive, setIsActive] = useState(alarm.is_active);
  const [selectedDays, setSelectedDays] = useState<number[]>(alarm.days || [0, 1, 2, 3, 4]);
  const [soundType, setSoundType] = useState<'apex' | 'energetic' | 'gentle'>(alarm.sound_type || 'apex');
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    triggerHaptic('selection');
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId].sort());
    }
  };

  const handleTestSound = (type: 'apex' | 'energetic' | 'gentle') => {
    triggerHaptic('impact', 'medium');
    setSoundType(type);
    alarmAudio.testTone(type);
    setIsPlayingTest(true);
    setTimeout(() => setIsPlayingTest(false), 800);
  };

  const handleSave = () => {
    triggerHaptic('notification', 'success');
    onSaveAlarm({
      ...alarm,
      wake_time: wakeTime,
      is_active: isActive,
      days: selectedDays,
      sound_type: soundType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md bg-dark-800 border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent-green/20 text-accent-green">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base text-white">Умный Будильник</h3>
          </div>
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

        <div className="mt-4 space-y-5">
          {/* Main Toggle & Time Picker */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-dark-900 border border-white/5">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Время подъема</span>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="bg-transparent text-3xl font-extrabold text-white tracking-wider focus:outline-none cursor-pointer mt-1"
              />
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('impact', 'medium');
                setIsActive(!isActive);
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center ${
                isActive ? 'bg-accent-green' : 'bg-dark-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  isActive ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Дни срабатывания
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`py-2 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-accent-emerald text-dark-900 shadow-glow-green'
                        : 'bg-dark-900/80 border border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Type Selection & Test */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center justify-between">
              <span>Мелодия пробуждения</span>
              <span className="text-[10px] text-accent-green flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Web Audio HD
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'apex', name: 'Apex Prime', desc: 'Энергичный аккорд' },
                { id: 'energetic', name: 'Pulse', desc: 'Бодрый ритм' },
                { id: 'gentle', name: 'Sunrise', desc: 'Мягкий перезвон' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleTestSound(s.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    soundType === s.id
                      ? 'bg-accent-green/20 border-accent-green/50 text-white shadow-glow-green'
                      : 'bg-dark-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                    <span>{s.name}</span>
                    <Play className="w-3 h-3 text-accent-green" />
                  </div>
                  <div className="text-[10px] text-slate-400">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bot Guarantee Note */}
          <div className="p-3 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 text-xs text-slate-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-accent-green">Двойная гарантия:</strong> В{' '}
              <span className="font-bold text-white">{wakeTime}</span> Telegram-бот пришлет серию
              настойчивых уведомлений, а при открытии Mini App запустится ритуал пробуждения с ТОП-задачами.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-dark-700/50 hover:bg-dark-700 text-xs font-medium text-slate-300 transition"
            >
              Закрыть
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-accent-emerald hover:bg-accent-green text-dark-900 font-bold text-xs shadow-glow-green transition active:scale-98"
            >
              Сохранить будильник
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
