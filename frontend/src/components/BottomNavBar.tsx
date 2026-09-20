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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sanctuary-border px-4 py-2 max-w-md mx-auto">
      <div className="flex items-center justify-around relative">
        {/* Home */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onTabChange('home');
          }}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'home' ? 'text-sanctuary-green font-semibold' : 'text-sanctuary-subtle hover:text-sanctuary-muted'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Calendar */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onTabChange('calendar');
          }}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'calendar' ? 'text-sanctuary-green font-semibold' : 'text-sanctuary-subtle hover:text-sanctuary-muted'
          }`}
        >
          <Calendar className={`w-5 h-5 ${currentTab === 'calendar' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Calendar</span>
        </button>

        {/* Central Add (+) Button */}
        <button
          onClick={() => {
            triggerHaptic('impact', 'medium');
            onOpenAddModal();
          }}
          className="w-12 h-12 -mt-5 rounded-full bg-sanctuary-green hover:bg-sanctuary-greenHover text-white flex items-center justify-center shadow-float transition active:scale-95 border-4 border-sanctuary-bg"
          title="Add New Ritual"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Alarm */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onTabChange('alarm');
          }}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'alarm' ? 'text-sanctuary-green font-semibold' : 'text-sanctuary-subtle hover:text-sanctuary-muted'
          }`}
        >
          <Bell className={`w-5 h-5 ${currentTab === 'alarm' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Alarm</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onTabChange('settings');
          }}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'settings' ? 'text-sanctuary-green font-semibold' : 'text-sanctuary-subtle hover:text-sanctuary-muted'
          }`}
        >
          <Sliders className={`w-5 h-5 ${currentTab === 'settings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Settings</span>
        </button>
      </div>
    </nav>
  );
};
