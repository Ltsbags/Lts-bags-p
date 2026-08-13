'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Mode = 'light' | 'dark';

export type PresetThemeId = 
  | 'corporate-sky'
  | 'royal-sapphire'
  | 'emerald-eco'
  | 'crimson-bold'
  | 'obsidian-gold';

export interface PresetThemeInfo {
  id: PresetThemeId;
  name: string;
  subtitle: string;
  badge: string;
  primaryHex: string;
  accentHex: string;
  bgPreview: string;
  description: string;
}

export const PRESET_THEMES: PresetThemeInfo[] = [
  {
    id: 'corporate-sky',
    name: 'Corporate Sky Blue',
    subtitle: 'Classic B2B Executive',
    badge: 'DEFAULT',
    primaryHex: '#0284c7',
    accentHex: '#38bdf8',
    bgPreview: 'from-sky-600 to-slate-900',
    description: 'Clean, crisp, high-contrast B2B manufacturing standard theme.',
  },
  {
    id: 'royal-sapphire',
    name: 'Royal Sapphire & Gold',
    subtitle: 'Luxury Premium Edition',
    badge: 'ROYAL',
    primaryHex: '#2563eb',
    accentHex: '#f59e0b',
    bgPreview: 'from-blue-600 to-amber-500',
    description: 'Deep royal sapphire tones paired with warm metallic gold accents.',
  },
  {
    id: 'emerald-eco',
    name: 'Emerald Eco Industrial',
    subtitle: 'Sustainable Manufacturing',
    badge: 'ECO CHOICE',
    primaryHex: '#059669',
    accentHex: '#34d399',
    bgPreview: 'from-emerald-600 to-teal-900',
    description: 'Fresh emerald green & mint teal for eco-conscious export manufacturing.',
  },
  {
    id: 'crimson-bold',
    name: 'Crimson Onyx Red',
    subtitle: 'High Impact Bold',
    badge: 'EXECUTIVE',
    primaryHex: '#dc2626',
    accentHex: '#f87171',
    bgPreview: 'from-red-600 to-slate-950',
    description: 'Energetic crimson red with rich onyx slate background elements.',
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Amber Gold',
    subtitle: 'Bespoke Craftsmanship',
    badge: 'LUXURY CRAFT',
    primaryHex: '#d97706',
    accentHex: '#fbbf24',
    bgPreview: 'from-amber-600 to-yellow-500',
    description: 'Warm obsidian amber gold for custom leathercraft and luxury bag production.',
  },
];

interface ThemeContextType {
  theme: Mode;
  presetTheme: PresetThemeId;
  toggleTheme: () => void;
  setTheme: (theme: Mode) => void;
  setPresetTheme: (preset: PresetThemeId) => void;
  currentPresetInfo: PresetThemeInfo;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Mode>('light');
  const [presetTheme, setPresetThemeState] = useState<PresetThemeId>('corporate-sky');

  useEffect(() => {
    // 1. Mode Initialization (light / dark)
    const savedTheme = localStorage.getItem('lts_theme') as Mode | null;
    let initialTheme: Mode = 'light';
    if (savedTheme === 'dark' || savedTheme === 'light') {
      initialTheme = savedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialTheme = 'dark';
    }
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Preset Theme Initialization (5 options)
    const savedPreset = localStorage.getItem('lts_preset_theme') as PresetThemeId | null;
    const initialPreset = PRESET_THEMES.some((p) => p.id === savedPreset)
      ? (savedPreset as PresetThemeId)
      : 'corporate-sky';

    document.documentElement.setAttribute('data-preset-theme', initialPreset);

    requestAnimationFrame(() => {
      setThemeState(initialTheme);
      setPresetThemeState(initialPreset);
    });
  }, []);

  const setTheme = (newTheme: Mode) => {
    setThemeState(newTheme);
    localStorage.setItem('lts_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setPresetTheme = (preset: PresetThemeId) => {
    setPresetThemeState(preset);
    localStorage.setItem('lts_preset_theme', preset);
    document.documentElement.setAttribute('data-preset-theme', preset);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const currentPresetInfo = PRESET_THEMES.find((p) => p.id === presetTheme) || PRESET_THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        presetTheme,
        toggleTheme,
        setTheme,
        setPresetTheme,
        currentPresetInfo,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

