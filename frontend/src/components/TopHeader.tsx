import React from 'react';
import { Search } from 'lucide-react';
import { triggerHaptic } from '../telegram';

interface TopHeaderProps {
  subtitle: string;
  userName?: string;
  avatarUrl?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  subtitle,
  userName = 'Sophia',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
}) => {
  return (
    <header className="px-5 pt-4 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Logo circle */}
        <div className="w-9 h-9 rounded-full bg-sanctuary-green flex items-center justify-center text-white shadow-sm">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <div>
          <span className="text-[11px] font-medium text-sanctuary-muted block leading-none mb-0.5">
            Daily Sanctuary
          </span>
          <h2 className="text-base font-bold text-sanctuary-dark leading-tight capitalize">
            {subtitle}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => triggerHaptic('impact', 'light')}
          className="p-2 rounded-full hover:bg-black/5 text-sanctuary-dark transition"
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-sanctuary-border shadow-xs">
          <img
            src={avatarUrl}
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
