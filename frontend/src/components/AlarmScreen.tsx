import React, { useState } from 'react';
import {
  Clock,
  Play,
  Volume2,
  Plus
} from 'lucide-react';
import { triggerHaptic } from '../telegram';
import { alarmAudio } from '../audio';
import { Language, translations } from '../i18n/translations';

interface AlarmItem {
  id: string;
  time: string;
  title: string;
  schedule: string;
  sound: string;
  icon: string;
  enabled: boolean;
}

interface AlarmScreenProps {
  onOpenAddHabit: () => void;
  lang: Language;
}

export const AlarmScreen: React.FC<AlarmScreenProps> = ({ onOpenAddHabit, lang }) => {
  const t = translations[lang];

  const getInitialAlarms = (): AlarmItem[] => [
    {
      id: '1',
      time: '07:00',
      title: lang === 'ru' ? 'Утренняя вода и зарядка' : lang === 'uz' ? 'Ertalabki suv va badantarbiya' : 'Morning Hydration & Stretch',
      schedule: t.everyday,
      sound: 'Tibetan Bowl',
      icon: 'drop',
      enabled: true,
    },
    {
      id: '2',
      time: '07:45',
      title: lang === 'ru' ? 'Медитация / Намаз' : lang === 'uz' ? 'Meditatsiya / Namoz' : 'Mindful Meditation',
      schedule: t.weekdays,
      sound: 'Forest Birds',
      icon: 'meditate',
      enabled: true,
    },
    {
      id: '3',
      time: '14:00',
      title: lang === 'ru' ? 'Разминка и фокус' : lang === 'uz' ? 'Fokus va chigalyozdi' : 'Desk Stretch & Focus',
      schedule: t.weekdays,
      sound: 'Gentle Chime',
      icon: 'stretch',
      enabled: true,
    },
    {
      id: '4',
      time: '18:00',
      title: lang === 'ru' ? 'Вечерняя прогулка (шаги)' : lang === 'uz' ? 'Kechki sayr (qadamlar)' : 'Evening Walk (steps)',
      schedule: t.everyday,
      sound: 'Soft Bell',
      icon: 'walk',
      enabled: true,
    },
    {
      id: '5',
      time: '21:30',
      title: lang === 'ru' ? 'Чтение книги / Коран' : lang === 'uz' ? 'Kitob o\'qish / Qur\'on' : 'Deep Reading',
      schedule: t.everyday,
      sound: 'Zen Gong',
      icon: 'book',
      enabled: true,
    },
    {
      id: '6',
      time: '22:30',
      title: lang === 'ru' ? 'Подготовка ко сну' : lang === 'uz' ? 'Uyquga tayyorgarlik' : 'Screen-Free Bedtime',
      schedule: t.everyday,
      sound: 'Gentle',
      icon: 'phone',
      enabled: false,
    },
  ];

  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    return getInitialAlarms();
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAlarm = (id: string) => {
    triggerHaptic('impact', 'medium');
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
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
            {t.alarmSubtitle}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-sanctuary-dark">
            {t.alarmTitle}
          </h1>
        </div>

        {/* Test Sound Button */}
        <button
          onClick={handleTestSound}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border-2 border-sanctuary-border text-xs font-black text-sanctuary-dark shadow-xs hover:bg-gray-50 transition btn-press"
        >
          <Volume2 className={`w-4 h-4 stroke-[2.5] ${isPlaying ? 'text-sanctuary-green animate-pulse' : ''}`} />
          <span>{t.testSoundBtn}</span>
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
        <span>{t.addAlarmBtn}</span>
      </button>
    </div>
  );
};
