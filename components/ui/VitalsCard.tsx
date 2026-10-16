'use client';

import React from 'react';
import { Vitals } from '@/types';
import { Activity, Heart, Wind, Thermometer, Gauge } from 'lucide-react';

interface VitalsCardProps {
  vitals: Vitals;
  compact?: boolean;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ vitals, compact = false }) => {
  const isBPCritical = vitals.systolicBP < 90 || vitals.systolicBP >= 180;
  const isBPWarning = (vitals.systolicBP >= 140 && vitals.systolicBP < 180) || (vitals.systolicBP >= 90 && vitals.systolicBP < 100);

  const isHRCritical = vitals.heartRate < 45 || vitals.heartRate > 125;
  const isHRWarning = (vitals.heartRate >= 101 && vitals.heartRate <= 125) || (vitals.heartRate >= 45 && vitals.heartRate < 60);

  const isSpO2Critical = vitals.oxygenSat < 90;
  const isSpO2Warning = vitals.oxygenSat >= 90 && vitals.oxygenSat <= 94;

  const isTempCritical = vitals.temperature > 103.0 || vitals.temperature < 95.0;
  const isTempWarning = vitals.temperature >= 100.4 && vitals.temperature <= 103.0;

  const isRRCritical = vitals.respiratoryRate > 25 || vitals.respiratoryRate < 9;
  const isRRWarning = vitals.respiratoryRate >= 21 && vitals.respiratoryRate <= 25;

  if (compact) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <div className={`p-2 rounded-lg border ${isBPCritical ? 'bg-rose-50 border-rose-200 text-rose-800' : isBPWarning ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">BP</div>
          <div className="font-bold font-mono">{vitals.systolicBP}/{vitals.diastolicBP} <span className="text-[9px] font-normal">mmHg</span></div>
        </div>

        <div className={`p-2 rounded-lg border ${isHRCritical ? 'bg-rose-50 border-rose-200 text-rose-800' : isHRWarning ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Pulse</div>
          <div className="font-bold font-mono">{vitals.heartRate} <span className="text-[9px] font-normal">bpm</span></div>
        </div>

        <div className={`p-2 rounded-lg border ${isSpO2Critical ? 'bg-rose-50 border-rose-200 text-rose-800' : isSpO2Warning ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">SpO2</div>
          <div className="font-bold font-mono">{vitals.oxygenSat}%</div>
        </div>

        <div className={`p-2 rounded-lg border ${isTempCritical ? 'bg-rose-50 border-rose-200 text-rose-800' : isTempWarning ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Temp</div>
          <div className="font-bold font-mono">{vitals.temperature}°F</div>
        </div>

        <div className={`p-2 rounded-lg border ${isRRCritical ? 'bg-rose-50 border-rose-200 text-rose-800' : isRRWarning ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Resp Rate</div>
          <div className="font-bold font-mono">{vitals.respiratoryRate} <span className="text-[9px] font-normal">/min</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {/* Blood Pressure */}
      <div className={`p-3.5 rounded-xl border transition-all ${
        isBPCritical ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300' :
        isBPWarning ? 'bg-amber-50/70 border-amber-300' :
        'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
          <span className="font-medium">Blood Pressure</span>
          <Activity className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono text-slate-900">{vitals.systolicBP}/{vitals.diastolicBP}</span>
          <span className="text-[10px] text-slate-500 font-medium">mmHg</span>
        </div>
        <div className="mt-1 text-[11px] font-medium">
          {isBPCritical ? <span className="text-rose-700">Crisis Range</span> :
           isBPWarning ? <span className="text-amber-700">Borderline</span> :
           <span className="text-emerald-700">Normal</span>}
        </div>
      </div>

      {/* Heart Rate */}
      <div className={`p-3.5 rounded-xl border transition-all ${
        isHRCritical ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300' :
        isHRWarning ? 'bg-amber-50/70 border-amber-300' :
        'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
          <span className="font-medium">Heart Rate</span>
          <Heart className={`w-3.5 h-3.5 ${isHRCritical ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono text-slate-900">{vitals.heartRate}</span>
          <span className="text-[10px] text-slate-500 font-medium">bpm</span>
        </div>
        <div className="mt-1 text-[11px] font-medium">
          {isHRCritical ? <span className="text-rose-700">Abnormal Pulse</span> :
           isHRWarning ? <span className="text-amber-700">Elevated</span> :
           <span className="text-emerald-700">Normal Sinus</span>}
        </div>
      </div>

      {/* Oxygen Saturation */}
      <div className={`p-3.5 rounded-xl border transition-all ${
        isSpO2Critical ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300' :
        isSpO2Warning ? 'bg-amber-50/70 border-amber-300' :
        'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
          <span className="font-medium">SpO2 Oxygen</span>
          <Wind className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-bold font-mono ${isSpO2Critical ? 'text-rose-700' : 'text-slate-900'}`}>{vitals.oxygenSat}%</span>
        </div>
        <div className="mt-1 text-[11px] font-medium">
          {isSpO2Critical ? <span className="text-rose-700 font-semibold">Critical Hypoxia</span> :
           isSpO2Warning ? <span className="text-amber-700">Mild Hypoxemia</span> :
           <span className="text-emerald-700">Optimal (≥95%)</span>}
        </div>
      </div>

      {/* Body Temp */}
      <div className={`p-3.5 rounded-xl border transition-all ${
        isTempCritical ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300' :
        isTempWarning ? 'bg-amber-50/70 border-amber-300' :
        'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
          <span className="font-medium">Temperature</span>
          <Thermometer className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono text-slate-900">{vitals.temperature}</span>
          <span className="text-[10px] text-slate-500 font-medium">°F</span>
        </div>
        <div className="mt-1 text-[11px] font-medium">
          {isTempCritical ? <span className="text-rose-700">High Pyrexia</span> :
           isTempWarning ? <span className="text-amber-700">Febrile</span> :
           <span className="text-emerald-700">Normothermic</span>}
        </div>
      </div>

      {/* Respiratory Rate */}
      <div className={`p-3.5 rounded-xl border transition-all ${
        isRRCritical ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300' :
        isRRWarning ? 'bg-amber-50/70 border-amber-300' :
        'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
          <span className="font-medium">Resp Rate</span>
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono text-slate-900">{vitals.respiratoryRate}</span>
          <span className="text-[10px] text-slate-500 font-medium">/min</span>
        </div>
        <div className="mt-1 text-[11px] font-medium">
          {isRRCritical ? <span className="text-rose-700">Severe Tachypnea</span> :
           isRRWarning ? <span className="text-amber-700">Tachypneic</span> :
           <span className="text-emerald-700">Eupneic</span>}
        </div>
      </div>
    </div>
  );
};
