'use client';

import React from 'react';

interface UrgencyMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const UrgencyMeter: React.FC<UrgencyMeterProps> = ({
  score,
  size = 'md',
  showLabel = true
}) => {
  const clamped = Math.min(Math.max(score, 0), 100);

  let colorClass = 'text-emerald-600 bg-emerald-500';
  let badgeText = 'Stable';
  let borderClass = 'border-emerald-200';

  if (clamped >= 75) {
    colorClass = 'text-rose-600 bg-rose-600';
    badgeText = 'Critical Emergency';
    borderClass = 'border-rose-300';
  } else if (clamped >= 45) {
    colorClass = 'text-amber-600 bg-amber-500';
    badgeText = 'Moderate Priority';
    borderClass = 'border-amber-300';
  }

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colorClass.split(' ')[1]}`}
            style={{ width: `${clamped}%` }}
          />
        </div>
        <span className={`text-xs font-bold font-mono ${colorClass.split(' ')[0]}`}>{clamped}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl bg-white border ${borderClass} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Calculated Urgency Score
        </span>
        {showLabel && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            clamped >= 75 ? 'bg-rose-100 text-rose-800' : clamped >= 45 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-3xl font-extrabold font-mono tracking-tight ${colorClass.split(' ')[0]}`}>
          {clamped}
        </span>
        <span className="text-xs text-slate-400 font-medium">/ 100</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass.split(' ')[1]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
        <span>0 (Routine)</span>
        <span>50 (Moderate)</span>
        <span>100 (Immediate Resuscitation)</span>
      </div>
    </div>
  );
};
