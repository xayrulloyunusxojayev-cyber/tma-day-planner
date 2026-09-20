import React from 'react';
import { Bell, DollarSign, Flame, Clock } from 'lucide-react';
import { AlarmSettings } from '../types';
import { TelegramUser, triggerHaptic } from '../telegram';

interface HeaderProps {
  user: TelegramUser;
  alarm: AlarmSettings;
  onOpenAlarm: () => void;
  onOpenTarget: () => void;
  targetRevenue: number;
  earnedRevenue: number;
  currency: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  alarm,
  onOpenAlarm,
  onOpenTarget,
  targetRevenue,
  earnedRevenue,
  currency,
}) => {
  const today = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/5 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* User & Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-green/30 to-accent-blue/30 border border-white/10 flex items-center justify-center font-bold text-accent-green text-sm shadow-glow-green">
            {user.first_name ? user.first_name[0].toUpperCase() : 'A'}
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight text-white flex items-center gap-1.5">
              {user.first_name}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            </h1>
            <p className="text-[11px] text-slate-400 capitalize flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {today}
            </p>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2">
          {/* Target Revenue Button */}
          <button
            onClick={() => {
              triggerHaptic('impact', 'light');
              onOpenTarget();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-card hover:bg-white/5 border border-white/5 text-xs transition active:scale-95"
            title="Настроить цель заработка"
          >
            <DollarSign className="w-3.5 h-3.5 text-accent-green" />
            <span className="font-semibold text-slate-200">
              {currency === 'USD' ? '$' : ''}{earnedRevenue}/{targetRevenue}
              {currency !== 'USD' ? ` ${currency}` : ''}
            </span>
          </button>

          {/* Alarm Badge Button */}
          <button
            onClick={() => {
              triggerHaptic('impact', 'medium');
              onOpenAlarm();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition active:scale-95 ${
              alarm.is_active
                ? 'bg-accent-emerald/15 border-accent-green/30 text-accent-green shadow-glow-green'
                : 'glass-card border-white/5 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${alarm.is_active ? 'fill-accent-green text-accent-green animate-bounce' : ''}`} />
            <span>{alarm.wake_time}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
