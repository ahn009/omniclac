import React from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">OmniCalc</h1>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">OmniCalc</h1>
              </div>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
