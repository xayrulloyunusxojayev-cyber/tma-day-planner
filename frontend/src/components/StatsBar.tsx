import React from 'react';
import { TrendingUp, CheckCircle2, Zap, Target } from 'lucide-react';
import { DayStats } from '../types';

interface StatsBarProps {
  stats: DayStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const percent = stats.target_revenue > 0
    ? Math.min(100, Math.round((stats.earned_revenue / stats.target_revenue) * 100))
    : 0;

  const curr = stats.currency === 'USD' ? '$' : ` ${stats.currency}`;
  const prefix = stats.currency === 'USD' ? '$' : '';
  const suffix = stats.currency !== 'USD' ? ` ${stats.currency}` : '';

  return (
    <section className="px-4 pt-4 pb-2">
      <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-green/10 rounded-full blur-2xl pointer-events-none" />

        {/* Progress Bar & Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent-green/20 text-accent-green">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-400">Цель по доходу</span>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <span>{prefix}{stats.earned_revenue}{suffix}</span>
                <span className="text-xs font-normal text-slate-400">/ {prefix}{stats.target_revenue}{suffix}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent-green/20 text-accent-green border border-accent-green/30">
              {percent}%
            </span>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-dark-700/80 rounded-full h-2 mb-3.5 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-accent-emerald to-accent-green h-full rounded-full transition-all duration-500 ease-out shadow-glow-green"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
          {/* Earned */}
          <div className="bg-dark-800/60 rounded-xl p-2.5 border border-white/5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
              В кассе
            </span>
            <span className="text-xs font-bold text-accent-green block">
              +{prefix}{stats.earned_revenue}{suffix}
            </span>
          </div>

          {/* Pending */}
          <div className="bg-dark-800/60 rounded-xl p-2.5 border border-white/5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
              В планах
            </span>
            <span className="text-xs font-bold text-amber-400 block">
              {prefix}{stats.pending_revenue}{suffix}
            </span>
          </div>

          {/* DPA Focus */}
          <div className="bg-dark-800/60 rounded-xl p-2.5 border border-white/5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5 flex items-center justify-center gap-1">
              <Zap className="w-2.5 h-2.5 text-accent-green" /> DPA
            </span>
            <span className="text-xs font-bold text-slate-200 block">
              {stats.dpa_completed_count}/{stats.dpa_tasks_count}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
