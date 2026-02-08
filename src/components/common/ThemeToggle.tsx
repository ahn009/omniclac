import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            p-2 rounded-md transition-all
            ${theme === value 
              ? 'bg-white dark:bg-slate-700 shadow-sm' 
              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
            }
          `}
          aria-label={`Switch to ${label} theme`}
          title={`${label} theme`}
        >
          <Icon className={`w-4 h-4 ${
            theme === value 
              ? 'text-slate-900 dark:text-slate-100' 
              : 'text-slate-600 dark:text-slate-400'
          }`} />
        </button>
      ))}
    </div>
  );
};
