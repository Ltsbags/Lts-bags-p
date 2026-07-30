'use client';

import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only' | 'text-only';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  showIcon?: boolean;
}

export default function Logo({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  className = '',
  showSubtitle = true,
  showIcon = false,
}: LogoProps) {
  // Dimension classes
  const iconSizes = {
    sm: 'w-8 h-9',
    md: 'w-10 h-11',
    lg: 'w-14 h-16',
    xl: 'w-20 h-22',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl',
  };

  const subtitleSizes = {
    sm: 'text-[7px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  };

  const ltsTextColor = theme === 'dark' ? 'text-slate-200' : 'text-slate-600';
  const bagsTextColor = 'text-sky-500'; // Brand Sky Blue
  const subtitleColor = theme === 'dark' ? 'text-sky-400/90' : 'text-slate-500';
  const lColor = theme === 'dark' ? '#94A3B8' : '#64748B'; // Grey for L
  const bColor = '#38BDF8'; // Sky Blue for B

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* High-Precision SVG Monogram Emblem (L + B) */}
      {showIcon && (
        <div className={`relative shrink-0 ${iconSizes[size]} flex items-center justify-center transition-transform group-hover:scale-105`}>
          <svg
            viewBox="0 0 160 180"
            className="w-full h-full drop-shadow-xs"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* L in Steel Grey */}
            <path
              d="M 12 12 L 52 12 L 52 132 L 80 132 L 80 168 L 12 168 Z"
              fill={lColor}
            />
            {/* B in Sky Blue */}
            <path
              d="M 52 12 L 112 12 C 140 12 156 28 156 52 C 156 68 146 80 132 86 C 150 92 160 108 160 128 C 160 156 140 168 112 168 L 80 168 L 80 132 L 110 132 C 124 132 130 124 130 112 C 130 100 122 92 106 92 L 52 92 Z M 52 48 L 106 48 C 120 48 126 54 126 64 C 126 74 120 80 106 80 L 52 80 Z"
              fill={bColor}
            />
          </svg>
        </div>
      )}

      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-start font-black font-sans tracking-tight">
            <span className={`${titleSizes[size]} ${ltsTextColor} tracking-wider font-extrabold`}>LTS</span>
            <span className={`${titleSizes[size]} ${bagsTextColor} tracking-wider font-extrabold ml-1.5`}>BAGS</span>
            <span className="text-[9px] sm:text-[10px] text-sky-500 font-extrabold -mt-0.5 ml-0.5 border border-sky-500 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center leading-none">
              R
            </span>
          </div>
          {showSubtitle && (
            <span className={`${subtitleSizes[size]} uppercase tracking-widest font-extrabold ${subtitleColor} mt-1`}>
              PRIVATE LIMITED
            </span>
          )}
        </div>
      )}
    </div>
  );
}

