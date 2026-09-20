import React from 'react';
import { Compass, Calendar, Plus, Bell, Sliders } from 'lucide-react';
import { triggerHaptic } from '../telegram';

export type TabType = 'home' | 'calendar' | 'alarm' | 'settings';

interface BottomNavBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-sanctuary-border px-5 py-2.5 max-w-md mx-auto shadow-lg shadow-black/5">
      <div className="flex items-center justify-around relative">
        {/* Home */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onTabChange('home');
          }}
          className={`flex flex-col items-center gap-1 transition btn-press ${
            currentTab === 'home' ? 'text-sanctuary-green font-black' : 'text-sanctuary-subtle hover:text-sanctuary-muted font-bold'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.8]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight">Главная</span>
        </button>

        {/* Calendar */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onTabChange('calendar');
          }}
          className={`flex flex-col items-center gap-1 transition btn-press ${
            currentTab === 'calendar' ? 'text-sanctuary-green font-black' : 'text-sanctuary-subtle hover:text-sanctuary-muted font-bold'
          }`}
        >
          <Calendar className={`w-5 h-5 ${currentTab === 'calendar' ? 'stroke-[2.8]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight">Календарь</span>
        </button>

        {/* Central Add (+) Button */}
        <button
          onClick={() => {
            triggerHaptic('impact', 'medium');
            onOpenAddModal();
          }}
          className="w-13 h-13 -mt-6 rounded-full bg-sanctuary-green hover:bg-sanctuary-greenHover text-white flex items-center justify-center shadow-float-green transition btn-press border-4 border-[#fbf9f5]"
          title="Добавить ритуал"
        >
          <Plus className="w-6 h-6 stroke-[3.2]" />
        </button>

        {/* Alarm */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onTabChange('alarm');
          }}
          className={`flex flex-col items-center gap-1 transition btn-press ${
            currentTab === 'alarm' ? 'text-sanctuary-green font-black' : 'text-sanctuary-subtle hover:text-sanctuary-muted font-bold'
          }`}
        >
          <Bell className={`w-5 h-5 ${currentTab === 'alarm' ? 'stroke-[2.8]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight">Будильник</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onTabChange('settings');
          }}
          className={`flex flex-col items-center gap-1 transition btn-press ${
            currentTab === 'settings' ? 'text-sanctuary-green font-black' : 'text-sanctuary-subtle hover:text-sanctuary-muted font-bold'
          }`}
        >
          <Sliders className={`w-5 h-5 ${currentTab === 'settings' ? 'stroke-[2.8]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight">Настройки</span>
        </button>
      </div>
    </nav>
  );
};
