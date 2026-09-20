import React, { useState } from 'react';
import { X, Clock, Volume2, Check } from 'lucide-react';
import { AlarmSettings } from '../types';
import { triggerHaptic } from '../telegram';
import { alarmAudio } from '../audio';

interface NotionAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarm: AlarmSettings;
  onSaveAlarm: (settings: AlarmSettings) => void;
}

const DAYS = [
  { id: 0, label: 'Пн' },
  { id: 1, label: 'Вт' },
  { id: 2, label: 'Ср' },
  { id: 3, label: 'Чт' },
  { id: 4, label: 'Пт' },
  { id: 5, label: 'Сб' },
  { id: 6, label: 'Вс' },
];

export const NotionAlarmModal: React.FC<NotionAlarmModalProps> = ({
  isOpen,
  onClose,
  alarm,
  onSaveAlarm,
}) => {
  const [wakeTime, setWakeTime] = useState(alarm.wake_time || '05:30');
  const [isActive, setIsActive] = useState(alarm.is_active);
  const [selectedDays, setSelectedDays] = useState<number[]>(alarm.days || [0, 1, 2, 3, 4, 5, 6]);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    triggerHaptic('selection');
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId].sort());
    }
  };

  const handleTest = () => {
    triggerHaptic('impact', 'medium');
    alarmAudio.testTone('gentle');
  };

  const handleSave = () => {
    triggerHaptic('notification', 'success');
    onSaveAlarm({
      ...alarm,
      wake_time: wakeTime,
      is_active: isActive,
      days: selectedDays,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in text-notion-text">
      <div className="w-full max-w-sm bg-white border border-notion-border rounded-xl p-5 shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-notion-border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-sm text-notion-text">Настройка будильника</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-notion-hover text-notion-muted hover:text-notion-text transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* Time & Active */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#fafaf9] border border-notion-border">
            <div>
              <span className="text-notion-muted block mb-1">Время подъема</span>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="bg-transparent text-2xl font-bold font-mono text-notion-text outline-none cursor-pointer"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('impact', 'light');
                setIsActive(!isActive);
              }}
              className={`px-3 py-1.5 rounded-md font-medium text-xs border transition ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              {isActive ? 'Включен' : 'Выключен'}
            </button>
          </div>

          {/* Days */}
          <div>
            <span className="text-notion-muted block mb-1.5">Дни недели</span>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => {
                const isSelected = selectedDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    className={`py-1.5 rounded text-center font-medium transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#f7f7f5] text-notion-muted hover:bg-notion-hover'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Sound */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleTest}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Проверить звук</span>
            </button>
            <span className="text-[10px] text-notion-muted">Web Audio HD</span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-notion-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded hover:bg-notion-hover text-notion-muted transition"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition active:scale-95 shadow-sm"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
