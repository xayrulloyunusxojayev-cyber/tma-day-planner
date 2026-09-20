import React, { useState } from 'react';
import {
  Volume2,
  Vibrate,
  Moon,
  RotateCcw,
  Check
} from 'lucide-react';
import { triggerHaptic } from '../telegram';

export const SettingsScreen: React.FC = () => {
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [theme, setTheme] = useState<'sage' | 'oat'>('sage');

  const handleResetData = () => {
    if (confirm('Сбросить все данные к исходным?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="px-4 pb-28 space-y-4">
      {/* Header */}
      <div className="pt-2">
        <span className="text-[11px] text-sanctuary-muted font-medium block">
          Параметры приложения
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-sanctuary-dark">
          Настройки
        </h1>
      </div>

      {/* Main Settings Card */}
      <div className="sanctuary-card divide-y divide-sanctuary-border/60">
        {/* Sound Effects */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sanctuary-dark">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-sanctuary-dark">Звуковые сигналы</h4>
              <p className="text-[10px] text-sanctuary-muted">Звук колокольчика при выполнении</p>
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
              <h4 className="text-xs font-bold text-sanctuary-dark">Виброотклик (Haptics)</h4>
              <p className="text-[10px] text-sanctuary-muted">Тактильная отдача Telegram</p>
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

        {/* Reset Data */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-600">Сброс данных</h4>
              <p className="text-[10px] text-sanctuary-muted">Очистить локальное хранилище</p>
            </div>
          </div>
          <button
            onClick={handleResetData}
            className="px-3 py-1 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition active:scale-95"
          >
            Сброс
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 text-center space-y-1">
        <p className="text-[11px] text-sanctuary-muted font-medium">
          Daily Sanctuary • v2.0
        </p>
        <p className="text-[10px] text-sanctuary-subtle">
          Чистый и простой планировщик дня
        </p>
      </div>
    </div>
  );
};
