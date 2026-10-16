'use client';

import React from 'react';
import { TriageLevel } from '@/types';

interface TriageBadgeProps {
  level: TriageLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const TriageBadge: React.FC<TriageBadgeProps> = ({
  level,
  size = 'md',
  showPulse = true
}) => {
  const isRed = level.includes('RED') || level.includes('CRITICAL');
  const isYellow = level.includes('YELLOW') || level.includes('MODERATE');
  const isGreen = level.includes('GREEN') || level.includes('STABLE');

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs font-semibold px-3 py-1',
    lg: 'text-sm font-bold px-4 py-1.5'
  }[size];

  if (isRed) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-sm ${sizeClasses}`}>
        {showPulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
        )}
        <span className="tracking-wide">CRITICAL (RED)</span>
      </span>
    );
  }

  if (isYellow) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-sm ${sizeClasses}`}>
        {showPulse && <span className="h-2 w-2 rounded-full bg-amber-500"></span>}
        <span className="tracking-wide">MODERATE (YELLOW)</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm ${sizeClasses}`}>
      {showPulse && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
      <span className="tracking-wide">STABLE (GREEN)</span>
    </span>
  );
};
