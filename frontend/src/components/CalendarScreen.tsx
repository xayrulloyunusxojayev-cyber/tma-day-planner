import React, { useState } from 'react';
import {
  Flame,
  TrendingUp,
  CheckCircle2,
  Award,
  ChevronLeft,
  ChevronRight,
  Check,
  Lightbulb,
  Droplets,
  BookOpen,
  Footprints,
  Moon
} from 'lucide-react';
import { Habit } from '../types';
import { triggerHaptic } from '../telegram';

interface CalendarScreenProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  habits,
  onToggleHabit,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <div className="px-4 pb-24 space-y-4">
      {/* Analytics Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase font-bold text-sanctuary-muted tracking-wider">
            Rhythm & Constancy
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900">
            🌾 Flowing state
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-sanctuary-dark">
          Consistency Analytics
        </h1>
        <p className="text-xs text-sanctuary-muted mt-1 leading-relaxed">
          Small daily rituals compounding into mindful transformations.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Current Streak */}
        <div className="sanctuary-card p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-sanctuary-muted">Current Streak</span>
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-sanctuary-dark">28 <span className="text-xs font-normal text-sanctuary-muted">Days</span></div>
          <div className="text-[10px] text-emerald-700 font-medium">↑ Personal best</div>
        </div>

        {/* Consistency */}
        <div className="sanctuary-card p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-sanctuary-muted">Consistency</span>
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-sanctuary-dark">92%</div>
          <div className="text-[10px] text-emerald-700 font-medium">+4.8% vs last month</div>
        </div>

        {/* Completed */}
        <div className="sanctuary-card p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-sanctuary-muted">Completed</span>
            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-sanctuary-dark">184 <span className="text-xs font-normal text-sanctuary-muted">habits</span></div>
          <div className="text-[10px] text-sanctuary-muted">Oct 1 - Oct 24</div>
        </div>

        {/* Best Month */}
        <div className="sanctuary-card p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-sanctuary-muted">Best Month</span>
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-amber-700" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-sanctuary-dark">October</div>
          <div className="text-[10px] text-amber-800 font-medium">+14% volume gain</div>
        </div>
      </div>

      {/* Filter Rituals */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-sanctuary-muted tracking-wider block px-1">
          Filter Rituals
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['All Habits', 'Meditation', 'Hydration', 'Reading'].map((f) => (
            <button
              key={f}
              onClick={() => {
                triggerHaptic('selection');
                setSelectedFilter(f.toLowerCase());
              }}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                selectedFilter === f.toLowerCase() || (f === 'All Habits' && selectedFilter === 'all')
                  ? 'bg-sanctuary-green text-white shadow-xs'
                  : 'bg-white text-sanctuary-muted hover:bg-black/5 border border-sanctuary-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Calendar View */}
      <div className="sanctuary-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-sanctuary-dark">October 2024</h3>
            <span className="w-2 h-2 rounded-full bg-sanctuary-green" />
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-lg hover:bg-black/5 text-sanctuary-muted">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-lg hover:bg-black/5 text-sanctuary-muted">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-sanctuary-muted">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Sample calendar numbers */}
          {[
            { num: 30, faded: true },
            { num: 1, dot: 'perfect' },
            { num: 2, dot: 'perfect' },
            { num: 3, dot: 'partial' },
            { num: 4, dot: 'perfect' },
            { num: 5, dot: 'perfect' },
            { num: 6, dot: 'rest' },
            { num: 7, dot: 'perfect' },
            { num: 8, dot: 'perfect' },
            { num: 9, dot: 'perfect' },
            { num: 10, dot: 'perfect' },
            { num: 11, dot: 'partial' },
            { num: 12, dot: 'perfect' },
            { num: 13, dot: 'perfect' },
            { num: 14, dot: 'perfect' },
            { num: 15, dot: 'perfect' },
            { num: 16, dot: 'perfect' },
            { num: 17, dot: 'rest' },
            { num: 18, dot: 'perfect' },
            { num: 19, dot: 'perfect' },
            { num: 20, dot: 'perfect' },
            { num: 21, dot: 'perfect' },
            { num: 22, dot: 'perfect' },
            { num: 23, dot: 'perfect' },
            { num: 24, today: true, dot: 'partial' },
            { num: 25, dot: 'rest' },
            { num: 26, dot: 'rest' },
            { num: 27, dot: 'rest' },
            { num: 28, dot: 'rest' },
            { num: 29, dot: 'rest' },
            { num: 30, dot: 'rest' },
            { num: 31, dot: 'rest' },
            { num: 1, faded: true },
            { num: 2, faded: true },
            { num: 3, faded: true },
          ].map((cell, idx) => (
            <div
              key={idx}
              className={`py-1.5 rounded-xl flex flex-col items-center justify-center relative ${
                cell.today
                  ? 'bg-emerald-100/80 font-bold text-sanctuary-dark'
                  : cell.faded
                  ? 'text-gray-300'
                  : 'text-sanctuary-dark font-medium'
              }`}
            >
              <span>{cell.num}</span>
              {cell.dot === 'perfect' && (
                <span className="w-1 h-1 rounded-full bg-sanctuary-green mt-0.5" />
              )}
              {cell.dot === 'partial' && (
                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
              )}
              {cell.dot === 'rest' && (
                <span className="w-1 h-1 rounded-full bg-gray-300 mt-0.5" />
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-sanctuary-border/60 text-[10px] text-sanctuary-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sanctuary-green" />
            <span>100% Perfect</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span>Rest</span>
          </div>
        </div>
      </div>

      {/* Today, Oct 24 List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-sanctuary-dark">📅 Today, Oct 24</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            4 of 5 Completed
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((h) => (
            <div
              key={h.id}
              className="sanctuary-card p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 flex items-center justify-center text-xs">
                  {h.icon === 'drop' ? '💧' : h.icon === 'meditate' ? '🧘' : h.icon === 'book' ? '📖' : h.icon === 'walk' ? '🌲' : '🌙'}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-sanctuary-dark">{h.title}</h4>
                  <p className="text-[10px] text-sanctuary-muted">{h.subtitle}</p>
                </div>
              </div>

              {h.isCompleted ? (
                <div className="w-7 h-7 rounded-full bg-sanctuary-green text-white flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <button
                  onClick={() => {
                    triggerHaptic('impact', 'medium');
                    onToggleHabit(h.id);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-sanctuary-green text-white text-[10px] font-bold hover:bg-sanctuary-greenHover transition"
                >
                  Mark Done
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-sanctuary-dark">Milestone Badges</span>
          <button className="text-[10px] text-sanctuary-muted hover:text-sanctuary-dark font-medium">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Consistency Club */}
          <div className="sanctuary-card p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                Gold
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-sanctuary-dark">Consistency Club</h4>
              <p className="text-[10px] text-sanctuary-muted mt-0.5">25+ days logged in a month</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold">
              <span>🌾 3</span>
            </div>
          </div>

          {/* 30-Day Zen Master */}
          <div className="sanctuary-card p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                28/30
              </span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-sanctuary-dark">30-Day Zen Master</h4>
              <p className="text-[10px] text-sanctuary-muted mt-0.5">2 days until completion</p>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sanctuary-green h-full rounded-full" style={{ width: '93%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Habit Tip */}
      <div className="bg-[#f5f1e9] rounded-2xl p-3.5 flex items-start gap-2.5 border border-[#eae3d5]">
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-amber-600 flex-shrink-0 shadow-xs">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-sanctuary-dark">Habit Tip of the Day</h4>
          <p className="text-[11px] text-sanctuary-muted leading-relaxed mt-0.5">
            Habits stick faster when paired with existing routines. You drink water right before meditating — an instinctive neural anchor.
          </p>
        </div>
      </div>
    </div>
  );
};
