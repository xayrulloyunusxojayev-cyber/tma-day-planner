import React, { useState } from 'react';
import {
  Clock,
  Play,
  Volume2,
  Droplets,
  BookOpen,
  Footprints,
  Smartphone,
  Plus
} from 'lucide-react';
import { triggerHaptic } from '../telegram';
import { alarmAudio } from '../audio';

interface AlarmItem {
  id: string;
  time: string;
  title: string;
  schedule: string;
  sound: string;
  icon: string;
  enabled: boolean;
}

const INITIAL_ALARMS: AlarmItem[] = [
  {
    id: '1',
    time: '07:00',
    title: 'Утренняя вода и зарядка',
    schedule: 'Каждый день',
    sound: 'Tibetan Bowl',
    icon: 'drop',
    enabled: true,
  },
  {
    id: '2',
    time: '07:45',
    title: 'Медитация / Намаз',
    schedule: 'Пн-Пт',
    sound: 'Forest Birds',
    icon: 'meditate',
    enabled: true,
  },
  {
    id: '3',
    time: '14:00',
    title: 'Разминка и фокус',
    schedule: 'Пн-Пт',
    sound: 'Gentle Chime',
    icon: 'stretch',
    enabled: true,
  },
  {
    id: '4',
    time: '18:00',
    title: 'Вечерняя прогулка (шаги)',
    schedule: 'Каждый день',
    sound: 'Soft Bell',
    icon: 'walk',
    enabled: true,
  },
  {
    id: '5',
    time: '21:30',
    title: 'Чтение книги / Коран',
    schedule: 'Каждый день',
    sound: 'Zen Gong',
    icon: 'book',
    enabled: true,
  },
  {
    id: '6',
    time: '22:30',
    title: 'Подготовка ко сну',
    schedule: 'Каждый день',
    sound: 'Gentle',
    icon: 'phone',
    enabled: false,
  },
];

interface AlarmScreenProps {
  onOpenAddHabit: () => void;
}

export const AlarmScreen: React.FC<AlarmScreenProps> = ({ onOpenAddHabit }) => {
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    const saved = localStorage.getItem('sanctuary_alarms_simple');
    return saved ? JSON.parse(saved) : INITIAL_ALARMS;
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAlarm = (id: string) => {
    triggerHaptic('impact', 'medium');
    setAlarms((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
      localStorage.setItem('sanctuary_alarms_simple', JSON.stringify(updated));
      return updated;
    });
  };

  const handleTestSound = () => {
    triggerHaptic('impact', 'medium');
    setIsPlaying(true);
    alarmAudio.testTone('gentle');
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <div className="px-4 pb-28 space-y-4">
      {/* Header */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-sanctuary-muted block mb-1">
            Напоминания и подъем
          </span>
          <h1 className="text-3xl font-black tracking-tight text-sanctuary-dark">
            Будильники
          </h1>
        </div>

        {/* Test Sound Button */}
        <button
          onClick={handleTestSound}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-sanctuary-border text-xs font-black text-sanctuary-dark shadow-xs hover:bg-gray-50 transition btn-press"
        >
          <Volume2 className={`w-4 h-4 stroke-[2.5] ${isPlaying ? 'text-sanctuary-green animate-pulse' : ''}`} />
          <span>Тест звука</span>
        </button>
      </div>

      {/* Alarms List */}
      <div className="space-y-2.5">
        {alarms.map((a) => (
          <div
            key={a.id}
            className={`sanctuary-card p-4 flex items-center justify-between border-2 transition ${
              a.enabled
                ? 'border-sanctuary-border bg-white shadow-card'
                : 'border-transparent bg-gray-50/70 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-[18px] bg-[#f4f1eb] border border-sanctuary-border flex items-center justify-center flex-shrink-0 shadow-inner-soft">
                <Clock className="w-5 h-5 text-sanctuary-green stroke-[2.3]" />
              </div>
              <div>
                <div className="text-lg font-black text-sanctuary-dark font-mono leading-none tracking-tight">
                  {a.time}
                </div>
                <h4 className="font-extrabold text-xs text-sanctuary-dark mt-1.5 leading-tight tracking-tight">
                  {a.title}
                </h4>
                <span className="text-[11px] font-semibold text-sanctuary-muted block mt-0.5">
                  {a.schedule}
                </span>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              onClick={() => toggleAlarm(a.id)}
              className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center btn-press ${
                a.enabled ? 'bg-sanctuary-green' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                  a.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Add Alarm Button */}
      <button
        onClick={() => {
          triggerHaptic('impact', 'medium');
          onOpenAddHabit();
        }}
        className="w-full py-4 rounded-2xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white font-black text-xs shadow-float-green transition btn-press flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Добавить напоминание</span>
      </button>
    </div>
  );
};
