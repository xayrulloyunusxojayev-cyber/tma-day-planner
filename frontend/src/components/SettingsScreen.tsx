import React, { useState } from 'react';
import {
  Volume2,
  Vibrate,
  RotateCcw,
  Globe,
  Flame,
  Check,
  Award
} from 'lucide-react';
import { triggerHaptic } from '../telegram';
import { Language, translations } from '../i18n/translations';

interface SettingsScreenProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  userName?: string;
  avatarUrl?: string;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentLang,
  onLanguageChange,
  userName = 'Sophia Laurent',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
}) => {
  const t = translations[currentLang];
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleResetData = () => {
    if (confirm(t.resetConfirm)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="px-4 pb-28 space-y-4">
      {/* Header */}
      <div className="pt-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-sanctuary-muted block mb-1">
          {t.settingsSubtitle}
        </span>
        <h1 className="text-3xl font-black tracking-tight text-sanctuary-dark">
          {t.settingsTitle}
        </h1>
      </div>

      {/* Profile Card (Luxury) */}
      <div className="sanctuary-card p-5 space-y-3.5 border-2 border-sanctuary-border bg-gradient-to-b from-white to-[#fcfaf7]">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={userName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-sanctuary-border shadow-xs"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sanctuary-green text-white flex items-center justify-center text-[10px] shadow-xs">
              🍃
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black text-sanctuary-dark tracking-tight leading-snug">{userName}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300 mt-1">
              {t.memberBadge}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-sanctuary-border">
          <div className="bg-[#f5f2eb] rounded-2xl p-3 flex items-center gap-2.5 border border-sanctuary-border">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-black text-sanctuary-dark block leading-none">14 дней</span>
              <span className="text-[10px] font-bold text-sanctuary-muted">{t.activeStreak}</span>
            </div>
          </div>

          <div className="bg-[#f5f2eb] rounded-2xl p-3 flex items-center gap-2.5 border border-sanctuary-border">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
              <Award className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-black text-sanctuary-dark block leading-none">84%</span>
              <span className="text-[10px] font-bold text-sanctuary-muted">{t.overallScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-1">
          <Globe className="w-3.5 h-3.5 text-sanctuary-green stroke-[2.5]" />
          <span className="text-[11px] uppercase font-black text-sanctuary-muted tracking-wider">
            {t.languageSection}
          </span>
        </div>

        <div className="sanctuary-card p-4 space-y-2.5 border-2 border-sanctuary-border">
          <h4 className="text-xs font-black text-sanctuary-dark uppercase tracking-wider">{t.languageSelectTitle}</h4>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: 'ru', label: 'Русский', flag: '🇷🇺' },
              { code: 'en', label: 'English', flag: '🇬🇧' },
              { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
            ].map((langItem) => {
              const isSelected = currentLang === langItem.code;
              return (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => {
                    triggerHaptic('notification', 'success');
                    onLanguageChange(langItem.code as Language);
                  }}
                  className={`py-3 px-2 rounded-2xl text-xs font-black transition btn-press flex flex-col items-center justify-center gap-1.5 border-2 ${
                    isSelected
                      ? 'bg-sanctuary-green text-white border-sanctuary-green shadow-md shadow-sanctuary-green/25 scale-[1.03]'
                      : 'bg-[#f5f2eb] text-sanctuary-dark border-sanctuary-border hover:border-sanctuary-borderStrong'
                  }`}
                >
                  <span className="text-xl leading-none">{langItem.flag}</span>
                  <span className="tracking-tight">{langItem.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5] text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preferences Card */}
      <div className="sanctuary-card divide-y-2 divide-sanctuary-border border-2 border-sanctuary-border">
        {/* Sound Effects */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#f5f2eb] border border-sanctuary-border flex items-center justify-center text-sanctuary-dark shadow-2xs">
              <Volume2 className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-sanctuary-dark tracking-tight">{t.soundEffectsTitle}</h4>
              <p className="text-[11px] font-medium text-sanctuary-muted">{t.soundEffectsSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('impact', 'light');
              setSoundEffects(!soundEffects);
            }}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors btn-press ${
              soundEffects ? 'bg-sanctuary-green' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                soundEffects ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Haptic Feedback */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#f5f2eb] border border-sanctuary-border flex items-center justify-center text-sanctuary-dark shadow-2xs">
              <Vibrate className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-sanctuary-dark tracking-tight">{t.hapticsTitle}</h4>
              <p className="text-[11px] font-medium text-sanctuary-muted">{t.hapticsSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('impact', 'light');
              setHapticFeedback(!hapticFeedback);
            }}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors btn-press ${
              hapticFeedback ? 'bg-sanctuary-green' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                hapticFeedback ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reset Data */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shadow-2xs">
              <RotateCcw className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-rose-700 tracking-tight">{t.resetDataTitle}</h4>
              <p className="text-[11px] font-medium text-sanctuary-muted">{t.resetDataSubtitle}</p>
            </div>
          </div>
          <button
            onClick={handleResetData}
            className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 text-xs font-black hover:bg-rose-50 transition btn-press"
          >
            {t.resetDataBtn}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 text-center space-y-1">
        <p className="text-xs text-sanctuary-dark font-black tracking-tight">
          Daily Sanctuary • v2.1
        </p>
        <p className="text-[11px] text-sanctuary-muted font-medium">
          RU • EN • UZ Multilingual Edition
        </p>
      </div>
    </div>
  );
};
