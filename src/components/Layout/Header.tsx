import React from 'react';
import { Menu, Calculator } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/40 dark:border-white/10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-elevation-1 lg:hidden">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                OmniCalc
              </h1>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
