'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuraCare } from '@/lib/context';
import { ApiKeyModal } from '@/components/ui/ApiKeyModal';
import {
  HeartPulse,
  Stethoscope,
  Activity,
  Layers,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Sliders,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    patients,
    resources,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    resetAllData,
    customApiKey
  } = useAuraCare();

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Calculate critical patients waiting
  const criticalCount = patients.filter(
    (p) => p.status !== 'discharged' && p.triageResult?.triageLevel === 'CRITICAL (RED)'
  ).length;

  const handleReset = () => {
    resetAllData();
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 1500);
  };

  const navLinks = [
    {
      href: '/patient',
      label: 'Patient Intake',
      icon: UserCheck,
      description: 'Intake form & AI assessment'
    },
    {
      href: '/doctor',
      label: 'Doctor Triage',
      icon: Stethoscope,
      badge: criticalCount > 0 ? `${criticalCount} RED` : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
      description: 'Clinical priority queue'
    },
    {
      href: '/admin',
      label: 'Admin & Capacity',
      icon: Layers,
      description: 'Beds, ventilators & analytics'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        {/* Top Emergency Triage Alert Bar (if critical cases exist) */}
        {criticalCount > 0 && (
          <div className="bg-rose-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span>
                HIGH-PRIORITY CLINICAL ALERT: {criticalCount} patient{criticalCount > 1 ? 's' : ''} classified under CRITICAL (RED) triage requiring immediate emergency room intervention!
              </span>
            </div>
            <Link
              href="/doctor"
              className="text-xs underline font-bold hover:text-rose-100 transition-colors ml-2"
            >
              View in Doctor Dashboard &rarr;
            </Link>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-500 text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900">
                    Aura<span className="text-teal-700">Care</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                    AI Triage
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Smart Triage & Remote Patient Monitoring
                </p>
              </div>
            </Link>

            {/* Main Navigation Tabs */}
            <nav className="flex items-center gap-1 sm:gap-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-800'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2">
              {/* Audio Alarm Toggle */}
              <button
                type="button"
                onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
                title={audioAlertsEnabled ? 'Audio alerts active' : 'Audio alerts muted'}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  audioAlertsEnabled
                    ? 'bg-slate-50 border-slate-200 text-teal-700 hover:bg-slate-100'
                    : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Engine / API Key Settings */}
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(true)}
                title="Configure AI API Key / Model"
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
                  customApiKey
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden md:inline">
                  {customApiKey ? 'GPT-4o Connected' : 'AI Engine'}
                </span>
              </button>

              {/* Reset Data Button */}
              <button
                type="button"
                onClick={handleReset}
                title="Reset to pre-seeded clinical demo patients"
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium transition-colors"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetConfirm ? 'animate-spin text-teal-700' : ''}`} />
                <span className="hidden lg:inline">
                  {resetConfirm ? 'Resetting...' : 'Demo Data'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </>
  );
};
