'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, PRESET_THEMES, PresetThemeId } from './ThemeProvider';
import { Palette, Check, Moon, Sun, X, Sparkles, Shield, Leaf, Flame, Award } from 'lucide-react';

export default function ThemeSelectorModal({
  variant = 'button',
}: {
  variant?: 'button' | 'compact' | 'floating';
}) {
  const { theme, presetTheme, toggleTheme, setPresetTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getThemeIcon = (id: PresetThemeId) => {
    switch (id) {
      case 'corporate-sky':
        return <Sparkles className="w-4 h-4 text-sky-400" />;
      case 'royal-sapphire':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'emerald-eco':
        return <Leaf className="w-4 h-4 text-emerald-400" />;
      case 'crimson-bold':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'obsidian-gold':
        return <Award className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={modalRef}>
      {/* Trigger Button */}
      {variant === 'floating' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 dark:bg-slate-800 text-white p-3.5 rounded-full shadow-2xl border border-slate-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
          title="Customize Theme & Colors"
          aria-label="Customize Theme & Colors"
        >
          <Palette className="w-5 h-5 text-sky-400 group-hover:rotate-45 transition-transform" />
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            5 Premium Themes
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          aria-label="Choose Theme Option"
          title="Choose Theme Option (5 Themes Available)"
        >
          <Palette className="w-4 h-4 text-sky-500" />
          <span className="hidden md:inline-block">Theme</span>
        </button>
      )}

      {/* Modal / Popover */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20">
                  <Palette className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Select Website Theme</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      5 Premium Presets
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose a luxury color palette for LTS Bags website
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Light / Dark Mode Quick Switch */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-100/50 dark:bg-slate-900/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Appearance Mode:
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sky-500 transition-all shadow-2xs"
              >
                {theme === 'light' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode Active</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Dark Mode Active</span>
                  </>
                )}
              </button>
            </div>

            {/* 5 Theme Cards */}
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {PRESET_THEMES.map((preset) => {
                const isSelected = preset.id === presetTheme;

                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setPresetTheme(preset.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative flex items-center justify-between group ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-2 ring-sky-500/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Color Preview Swatch Circle */}
                      <div
                        className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-md border border-white/20"
                        style={{
                          backgroundColor: preset.primaryHex,
                          backgroundImage: `linear-gradient(135deg, ${preset.primaryHex}, ${preset.accentHex})`,
                        }}
                      >
                        {getThemeIcon(preset.id)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {preset.name}
                          </h3>
                          <span
                            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs"
                            style={{ backgroundColor: preset.primaryHex }}
                          >
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    {/* Active Checkmark */}
                    <div className="ml-3 shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-sky-400 transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Theme auto-saved</span>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
