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
    <div className="px-4 pb-28 space-y-3.5">
      {/* Header */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-sanctuary-muted font-medium block">
            Напоминания и подъем
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-sanctuary-dark">
            Будильники
          </h1>
        </div>

        {/* Test Sound Button */}
        <button
          onClick={handleTestSound}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sanctuary-border text-xs font-semibold text-sanctuary-dark shadow-2xs hover:bg-gray-50 transition active:scale-95"
        >
          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-sanctuary-green' : ''}`} />
          <span>Проверить звук</span>
        </button>
      </div>

      {/* Alarms List */}
      <div className="space-y-2">
        {alarms.map((a) => (
          <div
            key={a.id}
            className="sanctuary-card p-3.5 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-sanctuary-green" />
              </div>
              <div>
                <div className="text-base font-black text-sanctuary-dark font-mono leading-none">
                  {a.time}
                </div>
                <h4 className="font-bold text-xs text-sanctuary-dark mt-1 leading-tight">
                  {a.title}
                </h4>
                <span className="text-[10px] text-sanctuary-muted block mt-0.5">
                  {a.schedule}
                </span>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              onClick={() => toggleAlarm(a.id)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                a.enabled ? 'bg-sanctuary-green' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
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
        className="w-full py-3.5 rounded-2xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white font-bold text-xs shadow-float transition active:scale-98 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Добавить напоминание</span>
      </button>
    </div>
  );
};
