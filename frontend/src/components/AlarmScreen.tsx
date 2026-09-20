import React, { useState } from 'react';
import {
  Clock,
  Play,
  Volume2,
  Bell,
  Droplets,
  BookOpen,
  Footprints,
  Smartphone,
  Check,
  Music
} from 'lucide-react';
import { triggerHaptic } from '../telegram';
import { alarmAudio } from '../audio';

interface AlarmItem {
  id: string;
  time: string;
  period: 'AM' | 'PM';
  title: string;
  schedule: string;
  sound: string;
  icon: string;
  enabled: boolean;
  category: 'morning' | 'afternoon' | 'evening';
}

const INITIAL_ALARMS: AlarmItem[] = [
  {
    id: '1',
    time: '07:00',
    period: 'AM',
    title: 'Morning Hydration',
    schedule: 'Daily',
    sound: 'Tibetan Bowl',
    icon: 'drop',
    enabled: true,
    category: 'morning',
  },
  {
    id: '2',
    time: '07:45',
    period: 'AM',
    title: 'Mindful Meditation',
    schedule: 'Mon-Fri',
    sound: 'Forest Birds',
    icon: 'meditate',
    enabled: true,
    category: 'morning',
  },
  {
    id: '3',
    time: '02:00',
    period: 'PM',
    title: 'Desk Stretch & Water',
    schedule: 'Mon-Fri',
    sound: 'Gentle Chime',
    icon: 'stretch',
    enabled: true,
    category: 'afternoon',
  },
  {
    id: '4',
    time: '06:00',
    period: 'PM',
    title: 'Evening Nature Walk',
    schedule: 'Daily',
    sound: 'Soft Bell',
    icon: 'walk',
    enabled: true,
    category: 'evening',
  },
  {
    id: '5',
    time: '09:30',
    period: 'PM',
    title: 'Read 20 Pages',
    schedule: 'Daily',
    sound: 'Zen Gong',
    icon: 'book',
    enabled: true,
    category: 'evening',
  },
  {
    id: '6',
    time: '10:00',
    period: 'PM',
    title: 'Screen-Free Bedtime',
    schedule: 'Sun-Thu',
    sound: 'Muted',
    icon: 'phone',
    enabled: false,
    category: 'evening',
  },
];

interface AlarmScreenProps {
  onOpenAddHabit: () => void;
}

export const AlarmScreen: React.FC<AlarmScreenProps> = ({ onOpenAddHabit }) => {
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [smartAlarms, setSmartAlarms] = useState(true);
  const [persistentAlarm, setPersistentAlarm] = useState(true);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const toggleAlarm = (id: string) => {
    triggerHaptic('impact', 'medium');
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handlePreviewSound = () => {
    triggerHaptic('impact', 'medium');
    setIsPlayingSound(true);
    alarmAudio.testTone('gentle');
    setTimeout(() => setIsPlayingSound(false), 1200);
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'drop':
        return <Droplets className="w-4 h-4 text-emerald-700" />;
      case 'meditate':
        return <span className="text-xs">🧘</span>;
      case 'stretch':
        return <span className="text-xs">🤸</span>;
      case 'walk':
        return <Footprints className="w-4 h-4 text-emerald-800" />;
      case 'book':
        return <BookOpen className="w-4 h-4 text-amber-700" />;
      case 'phone':
        return <Smartphone className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-emerald-700" />;
    }
  };

  const renderGroup = (
    title: string,
    subtitle: string,
    icon: string,
    category: 'morning' | 'afternoon' | 'evening'
  ) => {
    const groupAlarms = alarms.filter((a) => a.category === category);
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-sanctuary-dark flex items-center gap-1.5">
            <span>{icon}</span> {title}
          </span>
          <span className="text-[10px] text-sanctuary-muted">{subtitle}</span>
        </div>

        <div className="space-y-2">
          {groupAlarms.map((a) => (
            <div
              key={a.id}
              className="sanctuary-card p-3.5 flex items-center justify-between transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-sanctuary-border/60 flex items-center justify-center flex-shrink-0">
                  {renderIcon(a.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-sanctuary-dark font-mono">
                      {a.time}
                    </span>
                    <span className="text-[10px] font-bold text-sanctuary-muted">
                      {a.period}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-sanctuary-dark leading-tight mt-0.5">
                    {a.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-sanctuary-muted mt-0.5">
                    <span>{a.schedule}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Volume2 className="w-2.5 h-2.5" /> {a.sound}
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
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
      </div>
    );
  };

  return (
    <div className="px-4 pb-28 space-y-4">
      {/* Upcoming Ritual Banner */}
      <div className="sanctuary-card p-3.5 bg-gradient-to-r from-emerald-50/60 to-white flex items-center justify-between border-emerald-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider block">
              Upcoming Ritual
            </span>
            <h4 className="text-xs font-bold text-sanctuary-dark">
              Evening Nature Walk
            </h4>
            <p className="text-[10px] text-sanctuary-muted">
              06:00 PM • Daily sanctuary step
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
          In 42 min
        </span>
      </div>

      {/* Top 2 Control Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Smart Alarms */}
        <div className="sanctuary-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">✨</span>
              <span className="text-xs font-bold text-sanctuary-dark">Smart Alarms</span>
            </div>
            <button
              onClick={() => {
                triggerHaptic('impact', 'light');
                setSmartAlarms(!smartAlarms);
              }}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                smartAlarms ? 'bg-sanctuary-green' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                  smartAlarms ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <p className="text-[10px] text-sanctuary-muted">Adaptive timing</p>
        </div>

        {/* Gentle Chimes Preview */}
        <div className="sanctuary-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🌾</span>
              <span className="text-xs font-bold text-sanctuary-dark">Gentle Chimes</span>
            </div>
            <button
              onClick={handlePreviewSound}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-sanctuary-dark flex items-center justify-center transition active:scale-95"
            >
              <Play className={`w-3 h-3 ${isPlayingSound ? 'text-sanctuary-green fill-sanctuary-green' : ''}`} />
            </button>
          </div>
          <p className="text-[10px] text-sanctuary-muted">Preview soundscape</p>
        </div>
      </div>

      {/* Alarm Groups */}
      {renderGroup('MORNING ROUTINES', '2 alarms', '🌅', 'morning')}
      {renderGroup('AFTERNOON FOCUS', '1 alarm', '☀️', 'afternoon')}
      {renderGroup('EVENING WIND-DOWN', '3 alarms', '🌙', 'evening')}

      {/* Sound & Routine Settings */}
      <div className="sanctuary-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sanctuary-dark pb-1 border-b border-sanctuary-border/60">
          <span>🎛</span> Sound & Routine Settings
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <h4 className="text-xs font-bold text-sanctuary-dark">Notification Sound</h4>
            <p className="text-[10px] text-sanctuary-muted">Gentle Zen Chimes (Default)</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sanctuary-dark">
            <Music className="w-3.5 h-3.5 text-emerald-800" />
          </div>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-sanctuary-border/40">
          <div>
            <h4 className="text-xs font-bold text-sanctuary-dark">Persistent Alarm Mode</h4>
            <p className="text-[10px] text-sanctuary-muted">Ring until habit is marked complete</p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('impact', 'light');
              setPersistentAlarm(!persistentAlarm);
            }}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
              persistentAlarm ? 'bg-sanctuary-green' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                persistentAlarm ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Set New Reminder Button */}
      <button
        onClick={() => {
          triggerHaptic('impact', 'medium');
          onOpenAddHabit();
        }}
        className="w-full py-3.5 rounded-2xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white font-bold text-xs shadow-float transition active:scale-98 flex items-center justify-center gap-2"
      >
        <Clock className="w-4 h-4" />
        <span>Set New Reminder</span>
      </button>
    </div>
  );
};
