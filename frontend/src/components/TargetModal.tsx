import React, { useState } from 'react';
import { X, DollarSign, Target, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../telegram';

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: number;
  currentCurrency: string;
  onSaveTarget: (target: number, currency: string) => void;
}

const PRESETS = [50, 100, 250, 500, 1000];

export const TargetModal: React.FC<TargetModalProps> = ({
  isOpen,
  onClose,
  currentTarget,
  currentCurrency,
  onSaveTarget,
}) => {
  const [target, setTarget] = useState<string>(currentTarget.toString());
  const [currency, setCurrency] = useState(currentCurrency || 'USD');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('notification', 'success');
    onSaveTarget(parseFloat(target) || 100, currency);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md bg-dark-800 border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent-green/20 text-accent-green">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base text-white">Дневная финансовая цель</h3>
          </div>
          <button
            onClick={() => {
              triggerHaptic('impact', 'light');
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Target Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Сколько ты хочешь заработать сегодня?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-accent-green font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-3 text-lg font-bold text-white focus:outline-none focus:border-accent-green"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Быстрый выбор:</span>
            <div className="flex items-center gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setTarget(p.toString());
                  }}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition ${
                    target === p.toString()
                      ? 'bg-accent-emerald text-dark-900 border-accent-emerald shadow-glow-green'
                      : 'bg-dark-900/60 border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>

          {/* Currency selection */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Валюта учета
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'USD', label: 'USD ($)' },
                { id: 'UZS', label: 'UZS (сум)' },
                { id: 'RUB', label: 'RUB (₽)' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setCurrency(c.id);
                  }}
                  className={`py-2 rounded-xl border text-xs font-semibold transition ${
                    currency === c.id
                      ? 'bg-accent-green/20 border-accent-green/50 text-accent-green shadow-glow-green'
                      : 'bg-dark-900/60 border-white/5 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Motivation Note */}
          <div className="p-3 rounded-xl bg-dark-900 border border-white/5 text-xs text-slate-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Фокус на конкретной цифре каждый день активирует ретикулярную формацию мозга: ты перестаешь тратить время на пустую рутину и концентрируешься только на DPA (Dollar-Productive Activities).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-dark-700/50 hover:bg-dark-700 text-xs font-medium text-slate-300 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-accent-emerald hover:bg-accent-green text-dark-900 font-bold text-xs shadow-glow-green transition active:scale-98"
            >
              Зафиксировать цель
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
