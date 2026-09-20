import React, { useEffect } from 'react';
import { Bell, Flame, CheckCircle2, DollarSign, Zap } from 'lucide-react';
import { alarmAudio } from '../audio';
import { triggerHaptic } from '../telegram';
import { Task } from '../types';

interface AlarmRingingModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  soundType: 'apex' | 'energetic' | 'gentle';
  targetRevenue: number;
  currency: string;
  topTasks: Task[];
}

export const AlarmRingingModal: React.FC<AlarmRingingModalProps> = ({
  isOpen,
  onDismiss,
  soundType,
  targetRevenue,
  currency,
  topTasks,
}) => {
  useEffect(() => {
    if (isOpen) {
      alarmAudio.startAlarm(soundType);
      const hapticInterval = setInterval(() => {
        triggerHaptic('notification', 'warning');
      }, 1500);

      return () => {
        clearInterval(hapticInterval);
        alarmAudio.stopAlarm();
      };
    }
  }, [isOpen, soundType]);

  if (!isOpen) return null;

  const handleWakeUp = () => {
    alarmAudio.stopAlarm();
    triggerHaptic('notification', 'success');
    onDismiss();
  };

  const currPrefix = currency === 'USD' ? '$' : '';
  const currSuffix = currency !== 'USD' ? ` ${currency}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-dark-800 border-2 border-accent-green/40 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Pulsing visual glow */}
        <div className="w-24 h-24 rounded-full bg-accent-green/20 border border-accent-green/40 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Bell className="w-12 h-12 text-accent-green animate-pulse" />
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-1">
          Время побеждать!
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Будильник активен. Твой день расписан на победу.
        </p>

        {/* Target Reminder */}
        <div className="glass-card rounded-2xl p-3.5 mb-4 border border-emerald-500/30 text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-emerald-400 block">
              Сегодняшняя цель по заработку:
            </span>
            <span className="text-lg font-black text-white">
              {currPrefix}{targetRevenue}{currSuffix}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-accent-green/20 text-accent-green">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Top Focus Tasks */}
        {topTasks.length > 0 && (
          <div className="mb-5 text-left">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              Первые задачи дня:
            </span>
            <div className="space-y-1.5">
              {topTasks.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="px-3 py-2 rounded-xl bg-dark-900/90 border border-white/5 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-200 truncate pr-2">
                    {t.slot} — {t.title}
                  </span>
                  {t.revenue_impact > 0 && (
                    <span className="text-accent-green font-bold flex-shrink-0">
                      +{currPrefix}{t.revenue_impact}{currSuffix}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wake Up Dismiss Button */}
        <button
          onClick={handleWakeUp}
          className="w-full py-4 rounded-2xl bg-accent-green hover:bg-accent-emerald text-dark-900 font-extrabold text-sm shadow-glow-green uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Flame className="w-5 h-5 fill-dark-900" />
          <span>Я проснулся! В бой</span>
        </button>
      </div>
    </div>
  );
};
