'use client';

import React, { useState } from 'react';
import { useAuraCare } from '@/lib/context';
import {
  Layers,
  Bed,
  Wind,
  HeartPulse,
  Users,
  Clock,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  Minus,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { patients, resources, updateResources } = useAuraCare();

  const [isSurgeDeclared, setIsSurgeDeclared] = useState(false);

  // Compute live triage statistics
  const totalPatients = patients.length;
  const criticalCount = patients.filter((p) => p.triageResult?.triageLevel.includes('RED')).length;
  const moderateCount = patients.filter((p) => p.triageResult?.triageLevel.includes('YELLOW')).length;
  const stableCount = patients.filter((p) => p.triageResult?.triageLevel.includes('GREEN')).length;

  const redPct = totalPatients > 0 ? Math.round((criticalCount / totalPatients) * 100) : 0;
  const yellowPct = totalPatients > 0 ? Math.round((moderateCount / totalPatients) * 100) : 0;
  const greenPct = totalPatients > 0 ? Math.round((stableCount / totalPatients) * 100) : 0;

  // Occupancy percentages
  const generalBedPct = Math.round((resources.occupiedBeds / resources.totalBeds) * 100);
  const icuBedPct = Math.round((resources.icuBedsOccupied / resources.icuBedsTotal) * 100);
  const ventPct = Math.round((resources.ventilatorsOccupied / resources.ventilatorsTotal) * 100);
  const erBedPct = Math.round((resources.erBedsOccupied / resources.erBedsTotal) * 100);

  // Capacity alert threshold
  const isHighLoad = icuBedPct >= 80 || ventPct >= 80 || redPct > 40;

  const handleAdjustBed = (type: 'general' | 'icu' | 'vent' | 'er', delta: number) => {
    if (type === 'general') {
      const next = Math.max(0, Math.min(resources.totalBeds, resources.occupiedBeds + delta));
      updateResources({ occupiedBeds: next });
    } else if (type === 'icu') {
      const next = Math.max(0, Math.min(resources.icuBedsTotal, resources.icuBedsOccupied + delta));
      updateResources({ icuBedsOccupied: next });
    } else if (type === 'vent') {
      const next = Math.max(0, Math.min(resources.ventilatorsTotal, resources.ventilatorsOccupied + delta));
      updateResources({ ventilatorsOccupied: next });
    } else if (type === 'er') {
      const next = Math.max(0, Math.min(resources.erBedsTotal, resources.erBedsOccupied + delta));
      updateResources({ erBedsOccupied: next });
    }
  };

  // Mock hourly data for intake chart
  const hourlyData = [
    { time: '08:00', total: 4, red: 1 },
    { time: '10:00', total: 7, red: 2 },
    { time: '12:00', total: 11, red: 3 },
    { time: '14:00', total: 9, red: 1 },
    { time: '16:00', total: 14, red: 4 },
    { time: '18:00 (Now)', total: Math.max(totalPatients, 8), red: criticalCount }
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Hospital Command &amp; Resource Management
              </h1>
              <p className="text-xs text-slate-500">
                Real-time bed telemetry, ventilator utilization, and triage distribution analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Last Sync: <strong className="font-mono text-slate-700">{new Date(resources.lastUpdated).toLocaleTimeString()}</strong>
            </span>

            {isHighLoad && (
              <button
                type="button"
                onClick={() => setIsSurgeDeclared(!isSurgeDeclared)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  isSurgeDeclared
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{isSurgeDeclared ? 'Surge Protocol Active' : 'Declare Surge Alert'}</span>
              </button>
            )}
          </div>
        </div>

        {/* High Surge Alert Banner */}
        {isSurgeDeclared && (
          <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-lg animate-in fade-in flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold">EMERGENCY DEPARTMENT SURGE PROTOCOL ACTIVE</h3>
                <p className="text-xs text-rose-100">
                  Critical Care bed capacity exceeding normal parameters. Elective admissions placed on pause. Fast-track ambulatory triage active.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSurgeDeclared(false)}
              className="text-xs bg-white text-rose-700 font-bold px-3 py-1.5 rounded-lg shadow-xs hover:bg-rose-50"
            >
              Stand Down
            </button>
          </div>
        )}

        {/* Live Critical Resource Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* General Inpatient Beds */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">General Ward Beds</span>
              <Bed className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {resources.occupiedBeds}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ {resources.totalBeds} Occupied</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  generalBedPct >= 85 ? 'bg-rose-500' : generalBedPct >= 70 ? 'bg-amber-500' : 'bg-teal-600'
                }`}
                style={{ width: `${generalBedPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="font-semibold text-slate-600">{generalBedPct}% Capacity</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAdjustBed('general', -1)}
                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <button
                  onClick={() => handleAdjustBed('general', 1)}
                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* ICU Beds */}
          <div className={`p-5 rounded-2xl border bg-white shadow-xs transition-all ${
            icuBedPct >= 80 ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">ICU Beds (Critical Care)</span>
              <HeartPulse className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-3xl font-extrabold font-mono ${icuBedPct >= 80 ? 'text-rose-700' : 'text-slate-900'}`}>
                {resources.icuBedsOccupied}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ {resources.icuBedsTotal} Occupied</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  icuBedPct >= 80 ? 'bg-rose-600' : icuBedPct >= 60 ? 'bg-amber-500' : 'bg-teal-600'
                }`}
                style={{ width: `${icuBedPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="font-semibold text-slate-600">{icuBedPct}% Capacity</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAdjustBed('icu', -1)}
                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <button
                  onClick={() => handleAdjustBed('icu', 1)}
                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Mechanical Ventilators */}
          <div className={`p-5 rounded-2xl border bg-white shadow-xs transition-all ${
            ventPct >= 80 ? 'border-amber-300 ring-1 ring-amber-300' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Invasive Ventilators</span>
              <Wind className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {resources.ventilatorsOccupied}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ {resources.ventilatorsTotal} Active</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  ventPct >= 80 ? 'bg-amber-600' : 'bg-teal-600'
                }`}
                style={{ width: `${ventPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="font-semibold text-slate-600">{ventPct}% in Use</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAdjustBed('vent', -1)}
                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <button
                  onClick={() => handleAdjustBed('vent', 1)}
                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Resuscitation Bays */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">ER Resuscitation Bays</span>
              <Activity className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {resources.erBedsOccupied}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ {resources.erBedsTotal} Bays</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-rose-500 transition-all duration-500"
                style={{ width: `${erBedPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="font-semibold text-slate-600">{erBedPct}% Occupancy</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAdjustBed('er', -1)}
                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <button
                  onClick={() => handleAdjustBed('er', 1)}
                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Clinic Workload Distribution (Red / Yellow / Green Breakdown) */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-teal-700" />
                  <span>Clinic Triage Workload Stratification</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Percentage distribution of live intake cases across severity tiers
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Total: {totalPatients} Patients
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="w-full h-5 rounded-xl overflow-hidden flex shadow-inner bg-slate-100">
              <div
                className="bg-rose-600 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${redPct}%` }}
                title={`Critical (Red): ${redPct}%`}
              >
                {redPct > 8 && `${redPct}%`}
              </div>
              <div
                className="bg-amber-500 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-slate-950"
                style={{ width: `${yellowPct}%` }}
                title={`Moderate (Yellow): ${yellowPct}%`}
              >
                {yellowPct > 8 && `${yellowPct}%`}
              </div>
              <div
                className="bg-emerald-600 transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${greenPct}%` }}
                title={`Stable (Green): ${greenPct}%`}
              >
                {greenPct > 8 && `${greenPct}%`}
              </div>
            </div>

            {/* Breakdown Detail Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <div className="flex items-center justify-center gap-1.5 text-rose-700 text-xs font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span>Critical (Red)</span>
                </div>
                <div className="text-2xl font-black font-mono text-rose-800">{criticalCount}</div>
                <div className="text-[11px] text-rose-600 font-semibold">{redPct}% of total</div>
                <div className="text-[10px] text-slate-500 mt-1">Immediate (0-15m)</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Moderate (Yellow)</span>
                </div>
                <div className="text-2xl font-black font-mono text-amber-900">{moderateCount}</div>
                <div className="text-[11px] text-amber-700 font-semibold">{yellowPct}% of total</div>
                <div className="text-[10px] text-slate-500 mt-1">Urgent (30-60m)</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Stable (Green)</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-900">{stableCount}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">{greenPct}% of total</div>
                <div className="text-[10px] text-slate-500 mt-1">Routine (60-120m)</div>
              </div>
            </div>
          </div>

          {/* Card 2: Hourly Patient Arrival Timeline (SVG Bar Chart) */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-700" />
                  <span>Hourly Patient Intake &amp; Emergent Spike</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Surge patterns tracked by intake timestamp
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" /> High afternoon volume
              </span>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="pt-4">
              <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-slate-200 pb-2">
                {hourlyData.map((d, i) => {
                  const maxVal = 16;
                  const totalHeightPct = Math.min(100, Math.round((d.total / maxVal) * 100));
                  const redHeightPct = Math.min(100, Math.round((d.red / d.total) * totalHeightPct));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-teal-700">
                        {d.total}
                      </div>
                      <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg h-36 flex flex-col justify-end overflow-hidden p-0.5">
                        <div
                          className="w-full bg-teal-600 rounded-t-md transition-all duration-500 relative"
                          style={{ height: `${totalHeightPct}%` }}
                        >
                          {/* Crimson top indicator for critical cases */}
                          {d.red > 0 && (
                            <div
                              className="w-full bg-rose-600 absolute top-0 left-0 rounded-t-md"
                              style={{ height: `${Math.min(100, (d.red / d.total) * 100)}%` }}
                              title={`${d.red} Red Triage cases`}
                            />
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 text-center whitespace-nowrap">
                        {d.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-teal-600"></span> Total Admissions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-600"></span> Critical Red Cases
                  </span>
                </div>
                <span>Avg Wait: <strong className="text-slate-800">{resources.averageWaitTimeMin} min</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Staff & Shift Overview */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">Clinicians On Active Duty</h3>
            </div>
            <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              {resources.activeDoctorsOnDuty} Active Specialists
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900">Dr. Sarah Lin, MD</div>
              <div className="text-slate-500 text-[11px]">ER Lead Attending &bull; Trauma Bay 1-4</div>
              <div className="mt-1 text-emerald-700 font-semibold text-[10px] flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Responding to Code Red
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900">Dr. Michael Chang, MD</div>
              <div className="text-slate-500 text-[11px]">Internal Medicine &bull; Acute Observation</div>
              <div className="mt-1 text-blue-700 font-semibold text-[10px] flex items-center gap-1">
                <Activity className="w-3 h-3" /> 2 Consultations Pending
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900">Dr. Ananya Rao, MD</div>
              <div className="text-slate-500 text-[11px]">Pulmonary Critical Care &bull; ICU Pod B</div>
              <div className="mt-1 text-teal-700 font-semibold text-[10px] flex items-center gap-1">
                <Wind className="w-3 h-3" /> Ventilator Rounds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
