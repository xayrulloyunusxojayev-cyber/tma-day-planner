import React, { useState, useEffect } from 'react';
import {
  Clock,
  Volume2,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Music,
  Calendar as CalendarIcon,
  Play
} from 'lucide-react';
import { triggerHaptic, getTelegramUser } from '../telegram';
import { alarmAudio } from '../audio';
import { Language, translations } from '../i18n/translations';

export interface AlarmItem {
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

const SOUND_OPTIONS = [
  { id: 'apex', name: 'Tibetan Bowl (Apex)' },
  { id: 'energetic', name: 'Forest Birds (Energetic)' },
  { id: 'gentle', name: 'Gentle Chime' },
  { id: 'bell', name: 'Soft Bell' },
  { id: 'gong', name: 'Zen Gong' },
];

export const AlarmScreen: React.FC<AlarmScreenProps> = ({ onOpenAddHabit, lang }) => {
  const t = translations[lang];
  const user = getTelegramUser();

  const getInitialAlarms = (): AlarmItem[] => [
    {
      id: 'alarm_1',
      time: '07:00 - 07:30',
      title: lang === 'ru' ? 'Утренняя вода и зарядка' : lang === 'uz' ? 'Ertalabki suv va badantarbiya' : 'Morning Hydration & Stretch',
      schedule: t.everyday,
      sound: 'Tibetan Bowl (Apex)',
      icon: 'drop',
      enabled: true,
    },
    {
      id: 'alarm_2',
      time: '07:45 - 08:30',
      title: lang === 'ru' ? 'Медитация / Намаз' : lang === 'uz' ? 'Meditatsiya / Namoz' : 'Mindful Meditation',
      schedule: t.weekdays,
      sound: 'Forest Birds (Energetic)',
      icon: 'meditate',
      enabled: true,
    },
    {
      id: 'alarm_3',
      time: '14:00',
      title: lang === 'ru' ? 'Разминка и фокус' : lang === 'uz' ? 'Fokus va chigalyozdi' : 'Desk Stretch & Focus',
      schedule: t.weekdays,
      sound: 'Gentle Chime',
      icon: 'stretch',
      enabled: true,
    },
    {
      id: 'alarm_4',
      time: '18:00 - 19:30',
      title: lang === 'ru' ? 'Вечерняя прогулка (шаги)' : lang === 'uz' ? 'Kechki sayr (qadamlar)' : 'Evening Walk (steps)',
      schedule: t.everyday,
      sound: 'Soft Bell',
      icon: 'walk',
      enabled: true,
    },
    {
      id: 'alarm_5',
      time: '21:30',
      title: lang === 'ru' ? 'Чтение книги / Коран' : lang === 'uz' ? 'Kitob o\'qish / Qur\'on' : 'Deep Reading',
      schedule: t.everyday,
      sound: 'Zen Gong',
      icon: 'book',
      enabled: true,
    },
    {
      id: 'alarm_6',
      time: '22:30 - 23:00',
      title: lang === 'ru' ? 'Подготовка ко сну' : lang === 'uz' ? 'Uyquga tayyorgarlik' : 'Screen-Free Bedtime',
      schedule: t.everyday,
      sound: 'Gentle Chime',
      icon: 'phone',
      enabled: false,
    },
  ];

  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    const saved = localStorage.getItem('sanctuary_alarms_v2');
    return saved ? JSON.parse(saved) : getInitialAlarms();
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<AlarmItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for modal
  const [title, setTitle] = useState('');
  const [isRange, setIsRange] = useState(false);
  const [timeFrom, setTimeFrom] = useState('07:30');
  const [timeTo, setTimeTo] = useState('09:00');
  const [schedule, setSchedule] = useState(t.everyday);
  const [sound, setSound] = useState(SOUND_OPTIONS[0].name);

  // Save to localStorage and sync with backend
  useEffect(() => {
    localStorage.setItem('sanctuary_alarms_v2', JSON.stringify(alarms));

    const syncWithBackend = async () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tashkent';
        const activeList = alarms
          .filter((a) => a.enabled)
          .map((a) => ({
            habit_id: a.id,
            title: a.title,
            time_str: a.time,
            is_active: a.enabled,
          }));

        await fetch('/api/alarms/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            timezone: tz,
            alarms: activeList,
            source: 'alarms',
          }),
        });
      } catch (err) {
        console.warn('Failed to sync alarms:', err);
      }
    };

    syncWithBackend();
  }, [alarms, user.id]);

  const toggleAlarm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('impact', 'medium');
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleTestSound = (soundName?: string) => {
    triggerHaptic('impact', 'medium');
    setIsPlaying(true);
    const s = (soundName || sound).toLowerCase();
    const type = s.includes('energetic') ? 'energetic' : s.includes('gentle') ? 'gentle' : 'apex';
    alarmAudio.testTone(type);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  const openCreateModal = () => {
    triggerHaptic('impact', 'light');
    setEditingAlarm(null);
    setTitle('');
    setIsRange(false);
    setTimeFrom('07:30');
    setTimeTo('09:00');
    setSchedule(t.everyday);
    setSound(SOUND_OPTIONS[0].name);
    setIsModalOpen(true);
  };

  const openEditModal = (alarm: AlarmItem) => {
    triggerHaptic('impact', 'light');
    setEditingAlarm(alarm);
    setTitle(alarm.title);
    if (alarm.time.includes('-')) {
      setIsRange(true);
      const parts = alarm.time.split('-').map((p) => p.trim());
      setTimeFrom(parts[0] || '07:30');
      setTimeTo(parts[1] || '09:00');
    } else {
      setIsRange(false);
      setTimeFrom(alarm.time || '07:30');
      setTimeTo('09:00');
    }
    setSchedule(alarm.schedule || t.everyday);
    setSound(alarm.sound || SOUND_OPTIONS[0].name);
    setIsModalOpen(true);
  };

  const handleSaveAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    triggerHaptic('notification', 'success');
    const finalTime = isRange ? `${timeFrom} - ${timeTo}` : timeFrom;

    if (editingAlarm) {
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === editingAlarm.id
            ? {
                ...a,
                title: title.trim(),
                time: finalTime,
                schedule,
                sound,
              }
            : a
        )
      );
    } else {
      const newAlarm: AlarmItem = {
        id: `alarm_${Date.now()}`,
        title: title.trim(),
        time: finalTime,
        schedule,
        sound,
        icon: 'clock',
        enabled: true,
      };
      setAlarms((prev) => [newAlarm, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteAlarm = () => {
    if (!editingAlarm) return;
    if (window.confirm(t.deleteAlarmConfirm)) {
      triggerHaptic('notification', 'warning');
      setAlarms((prev) => prev.filter((a) => a.id !== editingAlarm.id));
      setIsModalOpen(false);
    }
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
          onClick={() => handleTestSound()}
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
            onClick={() => openEditModal(a)}
            className={`sanctuary-card p-4 flex items-center justify-between border-2 transition cursor-pointer active:scale-[0.99] ${
              a.enabled
                ? 'border-sanctuary-border bg-white shadow-card hover:border-sanctuary-green/40'
                : 'border-transparent bg-gray-50/70 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-2">
              <div className="w-12 h-12 rounded-[18px] bg-[#f4f1eb] border border-sanctuary-border flex items-center justify-center flex-shrink-0 shadow-inner-soft">
                <Clock className="w-5 h-5 text-sanctuary-green stroke-[2.3]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-sanctuary-dark font-mono leading-none tracking-tight">
                    {a.time}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-[10px] font-black text-amber-800">
                    {a.schedule}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-sanctuary-dark mt-1.5 leading-tight tracking-tight break-words">
                  {a.title}
                </h4>
                <span className="text-[10px] font-semibold text-sanctuary-muted block mt-0.5 truncate">
                  🎵 {a.sound}
                </span>
              </div>
            </div>

            {/* Actions: Edit + Toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(a);
                }}
                className="w-8 h-8 rounded-xl bg-gray-100/80 hover:bg-gray-200 border border-sanctuary-border/40 flex items-center justify-center text-sanctuary-muted hover:text-sanctuary-dark transition btn-press"
                title={t.editAlarmTitle}
              >
                <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={(e) => toggleAlarm(a.id, e)}
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
          </div>
        ))}
      </div>

      {/* Add Alarm Button */}
      <button
        onClick={openCreateModal}
        className="w-full py-4 rounded-2xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white font-black text-xs shadow-float-green transition btn-press flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>{t.addAlarmBtn}</span>
      </button>

      {/* MODAL: Add / Edit Alarm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] border-2 border-sanctuary-border shadow-modal overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b-2 border-sanctuary-border flex items-center justify-between bg-sanctuary-card">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sanctuary-muted">
                  {editingAlarm ? t.editAlarmTitle : t.newAlarmTitle}
                </span>
                <h3 className="text-xl font-black text-sanctuary-dark tracking-tight">
                  {editingAlarm ? editingAlarm.title : t.newAlarmTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-white border border-sanctuary-border flex items-center justify-center text-sanctuary-muted hover:text-sanctuary-dark transition btn-press"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAlarm} className="p-5 space-y-4 overflow-y-auto">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-muted block">
                  {t.habitTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={lang === 'ru' ? 'Например: Утренний подъем' : lang === 'uz' ? 'Masalan: Ertalabki uyg\'onish' : 'e.g. Morning Wake-up'}
                  className="w-full px-4 py-3 rounded-2xl bg-sanctuary-bg border-2 border-sanctuary-border text-sm font-bold text-sanctuary-dark focus:outline-hidden focus:border-sanctuary-green"
                />
              </div>

              {/* Time Mode Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-muted">
                    {t.reminderLabel}
                  </label>
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl border border-sanctuary-border/40">
                    <button
                      type="button"
                      onClick={() => setIsRange(false)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                        !isRange ? 'bg-white text-sanctuary-dark shadow-xs' : 'text-sanctuary-muted'
                      }`}
                    >
                      {lang === 'ru' ? 'Точное' : lang === 'uz' ? 'Aniq' : 'Exact'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRange(true)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition ${
                        isRange ? 'bg-white text-sanctuary-dark shadow-xs' : 'text-sanctuary-muted'
                      }`}
                    >
                      {t.timeRangeLabel}
                    </button>
                  </div>
                </div>

                {/* Time Inputs */}
                {!isRange ? (
                  <input
                    type="time"
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-sanctuary-bg border-2 border-sanctuary-border text-sm font-black text-sanctuary-dark font-mono focus:outline-hidden focus:border-sanctuary-green"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-sanctuary-muted">{t.timeFrom}</span>
                      <input
                        type="time"
                        value={timeFrom}
                        onChange={(e) => setTimeFrom(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-sanctuary-bg border-2 border-sanctuary-border text-sm font-black text-sanctuary-dark font-mono focus:outline-hidden focus:border-sanctuary-green"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-sanctuary-muted">{t.timeTo}</span>
                      <input
                        type="time"
                        value={timeTo}
                        onChange={(e) => setTimeTo(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-sanctuary-bg border-2 border-sanctuary-border text-sm font-black text-sanctuary-dark font-mono focus:outline-hidden focus:border-sanctuary-green"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-muted block">
                  {t.cadenceLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: t.everyday, label: t.everyday },
                    { key: t.weekdays, label: t.weekdays },
                    { key: lang === 'ru' ? 'Выходные' : lang === 'uz' ? 'Dam olish' : 'Weekends', label: lang === 'ru' ? 'Выходные' : lang === 'uz' ? 'Dam olish' : 'Weekends' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSchedule(item.label)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-black border-2 transition text-center btn-press ${
                        schedule === item.label
                          ? 'bg-sanctuary-card border-sanctuary-green text-sanctuary-green shadow-xs'
                          : 'bg-white border-sanctuary-border text-sanctuary-dark hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Selector with Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-sanctuary-muted">
                    {t.alarmSoundLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTestSound(sound)}
                    className="flex items-center gap-1 text-[11px] font-bold text-sanctuary-green hover:underline"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{t.testSoundBtn}</span>
                  </button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {SOUND_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSound(opt.name)}
                      className={`w-full p-2.5 rounded-xl text-left border-2 transition flex items-center justify-between btn-press ${
                        sound === opt.name
                          ? 'bg-sanctuary-card border-sanctuary-green text-sanctuary-dark font-black shadow-xs'
                          : 'bg-white border-sanctuary-border text-sanctuary-dark font-bold hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Music className={`w-3.5 h-3.5 ${sound === opt.name ? 'text-sanctuary-green' : 'text-sanctuary-muted'}`} />
                        <span className="text-xs">{opt.name}</span>
                      </div>
                      {sound === opt.name && <Check className="w-4 h-4 text-sanctuary-green stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-sanctuary-green hover:bg-sanctuary-greenHover text-white font-black text-xs shadow-float-green transition btn-press flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingAlarm ? t.saveChangesBtn : t.addAlarmBtn}</span>
                </button>

                {editingAlarm && (
                  <button
                    type="button"
                    onClick={handleDeleteAlarm}
                    className="w-full py-3 rounded-2xl bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-600 font-black text-xs transition btn-press flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    <span>{t.deleteAlarmBtn}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
