import React, { useState } from 'react';
import {
  Flame,
  RotateCcw,
  Sliders,
  Volume2,
  Vibrate,
  Umbrella,
  Moon,
  Heart,
  Cloud,
  Download,
  BookOpen,
  Star,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Check
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

export const SettingsScreen: React.FC = () => {
  const [firstDay, setFirstDay] = useState<'Mon' | 'Sun'>('Mon');
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [vacationMode, setVacationMode] = useState(false);
  const [theme, setTheme] = useState<'sage' | 'oat' | 'dusk'>('sage');

  return (
    <div className="px-4 pb-28 space-y-4">
      {/* Profile Card */}
      <div className="sanctuary-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Sophia"
              className="w-14 h-14 rounded-full object-cover border-2 border-sanctuary-border"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sanctuary-green text-white flex items-center justify-center text-[10px]">
              🍃
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-sanctuary-dark">Sophia Laurent</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 mt-1">
              Habit Pro Member ✨
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sanctuary-border/60">
          <div className="bg-[#f7f5ef] rounded-2xl p-2.5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-black text-sanctuary-dark block">14 Days</span>
              <span className="text-[10px] text-sanctuary-muted">Active Streak</span>
            </div>
          </div>

          <div className="bg-[#f7f5ef] rounded-2xl p-2.5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-black text-sanctuary-dark block">84%</span>
              <span className="text-[10px] text-sanctuary-muted">Overall Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Habit Flow & Feedback */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-[10px] uppercase font-bold text-sanctuary-muted tracking-wider">
            Habit Flow & Feedback
          </span>
          <Sliders className="w-3.5 h-3.5 text-sanctuary-muted" />
        </div>

        <div className="sanctuary-card divide-y divide-sanctuary-border/60">
          {/* First Day of Week */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                📅
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">First Day of Week</h4>
                <p className="text-[10px] text-sanctuary-muted">Calibrate your weekly view</p>
              </div>
            </div>
            <div className="flex items-center bg-[#f6f3eb] p-0.5 rounded-full text-[10px]">
              <button
                onClick={() => {
                  triggerHaptic('selection');
                  setFirstDay('Mon');
                }}
                className={`px-2.5 py-0.5 rounded-full transition ${
                  firstDay === 'Mon' ? 'bg-white font-bold text-sanctuary-dark shadow-2xs' : 'text-sanctuary-muted'
                }`}
              >
                Mon
              </button>
              <button
                onClick={() => {
                  triggerHaptic('selection');
                  setFirstDay('Sun');
                }}
                className={`px-2.5 py-0.5 rounded-full transition ${
                  firstDay === 'Sun' ? 'bg-white font-bold text-sanctuary-dark shadow-2xs' : 'text-sanctuary-muted'
                }`}
              >
                Sun
              </button>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Habit Sound Effects</h4>
                <p className="text-[10px] text-sanctuary-muted">Soft chimes on completion</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic('impact', 'light');
                setSoundEffects(!soundEffects);
              }}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                soundEffects ? 'bg-sanctuary-green' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                  soundEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic Feedback */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                <Vibrate className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Haptic Feedback</h4>
                <p className="text-[10px] text-sanctuary-muted">Tactile subtle pulses</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic('impact', 'light');
                setHapticFeedback(!hapticFeedback);
              }}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                hapticFeedback ? 'bg-sanctuary-green' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                  hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vacation Mode */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                <Umbrella className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Vacation / Pause Mode</h4>
                <p className="text-[10px] text-sanctuary-muted">Freeze current streaks while on holiday</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic('impact', 'light');
                setVacationMode(!vacationMode);
              }}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                vacationMode ? 'bg-sanctuary-green' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                  vacationMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance & Atmosphere */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-sanctuary-muted tracking-wider block px-1">
          Appearance & Atmosphere
        </span>

        <div className="sanctuary-card p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                🎨
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Palette Theme</h4>
                <p className="text-[10px] text-sanctuary-muted">Beige & Sage Green (Organic)</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-800" />
              <span className="w-3 h-3 rounded-full bg-amber-700" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sage', label: 'Organic Sage' },
              { id: 'oat', label: 'Oat Minimal' },
              { id: 'dusk', label: 'Nordic Dusk' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  triggerHaptic('selection');
                  setTheme(p.id as any);
                }}
                className={`py-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                  theme === p.id
                    ? 'bg-sanctuary-green text-white shadow-xs'
                    : 'bg-[#f6f3eb] text-sanctuary-dark hover:bg-gray-200'
                }`}
              >
                {theme === p.id && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-sanctuary-border/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Dark Mode</h4>
                <p className="text-[10px] text-sanctuary-muted">Sync with device system preference</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#f6f3eb] text-[10px] font-bold text-sanctuary-dark">
              System
            </span>
          </div>
        </div>
      </div>

      {/* Integrations & Data */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-sanctuary-muted tracking-wider block px-1">
          Integrations & Data Sanctuary
        </span>

        <div className="sanctuary-card divide-y divide-sanctuary-border/60">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Apple Health</h4>
                <p className="text-[10px] text-sanctuary-muted">Mindful minutes & activity auto-sync</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> Connected
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Cloud Backup</h4>
                <p className="text-[10px] text-sanctuary-muted">Last synced 2 mins ago</p>
              </div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-black/5 text-sanctuary-dark">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Export Data</h4>
                <p className="text-[10px] text-sanctuary-muted">Complete history in CSV / JSON format</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-sanctuary-muted" />
          </div>
        </div>
      </div>

      {/* Sanctuary & Community */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-sanctuary-muted tracking-wider block px-1">
          Sanctuary & Community
        </span>

        <div className="sanctuary-card divide-y divide-sanctuary-border/60">
          <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Streak Guide & Philosophy</h4>
                <p className="text-[10px] text-sanctuary-muted">The psychology of organic rituals</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-sanctuary-muted" />
          </div>

          <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Rate Habit Pro</h4>
                <p className="text-[10px] text-sanctuary-muted">Share love on the App Store</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-sanctuary-muted" />
          </div>

          <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sanctuary-dark">Privacy Policy & Terms</h4>
                <p className="text-[10px] text-sanctuary-muted">Your biometric & wellness data stays local</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-sanctuary-muted" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 text-center space-y-1">
        <div className="w-8 h-8 rounded-xl bg-[#edeae3] flex items-center justify-center mx-auto text-sanctuary-dark">
          🌱
        </div>
        <p className="text-[11px] text-sanctuary-muted font-medium">
          Habit Pro v2.4.1 (Build 108) • Crafted with care
        </p>
        <p className="text-[10px] text-sanctuary-subtle">
          A mindful sanctuary for your daily presence
        </p>
      </div>
    </div>
  );
};
