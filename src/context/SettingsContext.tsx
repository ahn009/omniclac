import React, { createContext, useContext, useEffect, ReactNode } from 'react';

// Mock localStorage hook for now - replace with actual implementation when available
const useLocalStorage = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
};

interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  sound: boolean;
  autoSave: boolean;
  precision: number;
  defaultCurrency: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  toggleTheme: () => void;
  toggleSetting: (setting: keyof Settings) => void;
}

const defaultSettings: Settings = {
  theme: 'light',
  notifications: true,
  sound: true,
  autoSave: true,
  precision: 2,
  defaultCurrency: 'USD',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('omnicalc-settings', defaultSettings);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev: Settings) => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setSettings((prev: Settings) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const toggleSetting = (setting: keyof Settings) => {
    setSettings((prev: Settings) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    toggleTheme,
    toggleSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};