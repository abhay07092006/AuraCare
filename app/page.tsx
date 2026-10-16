'use client';

import React from 'react';
import Link from 'next/link';
import { useAuraCare } from '@/lib/context';
import {
  HeartPulse,
  Stethoscope,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Mic,
  FileText,
  Clock,
  Sparkles,
  Bed,
  CheckCircle,
  AlertTriangle,
  BrainCircuit,
  Ambulance,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const { patients, resources } = useAuraCare();

  const criticalCount = patients.filter(
    (p) => p.status !== 'discharged' && p.triageResult?.triageLevel === 'CRITICAL (RED)'
  ).length;

  const totalPatients = patients.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide shadow-xs animate-in fade-in">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>Next-Generation Healthcare AI Triage &amp; RPM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Relieving Overburdened Clinics with{' '}
            <span className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 bg-clip-text text-transparent">
              AI-Powered Smart Triage
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            AuraCare empowers patients to log symptoms via multilingual voice or text, analyzes lab reports with vision OCR, and computes physiological NEWS2 &amp; ESI emergency risk scores to ensure urgent cases receive immediate care.
          </p>

          {/* Quick System Telemetry Pill Banner */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>{totalPatients} Active Triage Cases</span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-2xs ${
              criticalCount > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${criticalCount > 0 ? 'bg-rose-600 animate-ping' : 'bg-emerald-500'}`} />
              <span>{criticalCount} Critical (RED) Alerts</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <Bed className="w-3.5 h-3.5 text-teal-600" />
              <span>{resources.occupiedBeds}/{resources.totalBeds} Inpatient Beds</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>{resources.averageWaitTimeMin} min Avg Wait</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Portals Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Three Integrated Clinical Portals</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Select a workspace below to experience the complete AuraCare end-to-end workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Patient Intake */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-teal-400">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6 text-teal-700" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">Patient Facing</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Symptom &amp; Triage Intake Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Interactive multi-step intake with multilingual real-time speech dictation, bedside vitals capture, and automated lab report vision OCR extraction.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Web Speech API multilingual voice input</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Automated lab OCR (Troponin, CXR, CBC)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Instant ESI Urgency Score (0 to 100)</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/patient"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Launch Patient Intake</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Doctor Dashboard */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-teal-400 relative overflow-hidden">
            {criticalCount > 0 && (
              <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-xs">
                {criticalCount} Red Alert{criticalCount > 1 ? 's' : ''}
              </div>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6 text-teal-700" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">Clinical Attending</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Doctor Triage &amp; Queue Command</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Risk-sorted priority queue with Red alert pin, patient profile drawers, drug-drug interaction alerts, and one-click digital E-Prescription issuing.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Algorithmic urgency sorting (Red on top)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Deep-dive patient drawer &amp; drug checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>1-click E-Prescription with print formatting</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/doctor"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Enter Doctor Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Admin & Capacity */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-teal-400">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6 text-teal-700" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">Operations &amp; Admin</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Admin Analytics &amp; Bed Telemetry</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Real-time bed and ventilator utilization tracker, interactive capacity sliders, hourly emergency intake charts, and ED surge alerts.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>General ward, ICU, and ventilator capacity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Visual case distribution (Red / Yellow / Green)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Surge protocol trigger for hospital lead</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/admin"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-300 text-teal-900 hover:bg-teal-100 text-xs font-bold transition-all"
              >
                <span>Open Admin Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Architecture Flow */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-900">How AuraCare Triages Patients</h2>
          <p className="text-xs text-slate-500 mt-1">Four-stage clinical intelligence pipeline</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <span className="font-mono text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded">01</span>
            <h4 className="font-bold text-slate-900 mt-2">Multimodal Intake</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Patient enters symptoms via multilingual speech recognition or text, inputting bedside telemetry and uploading lab documents.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <span className="font-mono text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded">02</span>
            <h4 className="font-bold text-slate-900 mt-2">ESI-NEWS2 Scoring</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Algorithmic engine computes National Early Warning Score (NEWS2) from SpO2, BP, and HR, scanning for acute medical red flags.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <span className="font-mono text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded">03</span>
            <h4 className="font-bold text-slate-900 mt-2">Pharmacovigilance</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Scans pre-existing medications against newly prescribed drugs to detect CYP2C19, anticoagulant synergism, or hyperkalemia risks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <span className="font-mono text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded">04</span>
            <h4 className="font-bold text-slate-900 mt-2">Clinical Action</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Immediate prioritized display for ER attendings: one-click consultation approval, trauma escalation, or cryptographically signed e-prescription.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
        <p>AuraCare &bull; AI-Powered Smart Triage &amp; Remote Patient Monitoring &bull; Production Ready Prototype</p>
      </footer>
    </div>
  );
}
