'use client';

import React, { useState, useMemo } from 'react';
import { useAuraCare } from '@/lib/context';
import { Patient, TriageLevel, PatientStatus } from '@/types';
import { TriageBadge } from '@/components/ui/TriageBadge';
import { UrgencyMeter } from '@/components/ui/UrgencyMeter';
import { VitalsCard } from '@/components/ui/VitalsCard';
import { PatientDrawer } from '@/components/doctor/PatientDrawer';
import {
  Stethoscope,
  Search,
  Filter,
  Flame,
  Clock,
  Activity,
  AlertTriangle,
  Ambulance,
  FileText,
  User,
  ArrowUpDown,
  LayoutGrid,
  ListFilter,
  CheckCircle,
  Eye,
  ShieldAlert,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const {
    patients,
    selectedPatient,
    setSelectedPatient,
    isDrawerOpen,
    setIsDrawerOpen,
    updatePatientStatus,
    escalatePatientToER
  } = useAuraCare();

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Filter & sort patients by Urgency Score descending
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            p.chiefComplaint.toLowerCase().includes(q) ||
            (p.triageResult?.primarySuspectedConditions[0]?.name || '').toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Triage level filter
        if (levelFilter !== 'ALL') {
          if (!p.triageResult?.triageLevel.includes(levelFilter)) return false;
        }

        // Status filter
        if (statusFilter !== 'ALL') {
          if (p.status !== statusFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Put critical/highest urgency score first
        const scoreA = a.triageResult?.urgencyScore || 0;
        const scoreB = b.triageResult?.urgencyScore || 0;
        return scoreB - scoreA;
      });
  }, [patients, searchQuery, levelFilter, statusFilter]);

  const handleOpenDrawer = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDrawerOpen(true);
  };

  const criticalCount = patients.filter(
    (p) => p.status !== 'discharged' && p.triageResult?.triageLevel === 'CRITICAL (RED)'
  ).length;

  const moderateCount = patients.filter(
    (p) => p.status !== 'discharged' && p.triageResult?.triageLevel === 'MODERATE (YELLOW)'
  ).length;

  const stableCount = patients.filter(
    (p) => p.status !== 'discharged' && p.triageResult?.triageLevel === 'STABLE (GREEN)'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/70 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Top Header & Metrics Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Emergency Doctor Triage &amp; Clinical Command
                </h1>
                <p className="text-xs text-slate-500">
                  Real-time algorithmic risk-sorted queue based on Emergency Severity Index (ESI) &amp; NEWS2
                </p>
              </div>
            </div>
          </div>

          {/* Quick Counter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLevelFilter(levelFilter === 'RED' ? 'ALL' : 'RED')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                levelFilter === 'RED'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span>{criticalCount} Critical (RED)</span>
            </button>

            <button
              onClick={() => setLevelFilter(levelFilter === 'YELLOW' ? 'ALL' : 'YELLOW')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                levelFilter === 'YELLOW'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>{moderateCount} Moderate (YELLOW)</span>
            </button>

            <button
              onClick={() => setLevelFilter(levelFilter === 'GREEN' ? 'ALL' : 'GREEN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                levelFilter === 'GREEN'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>{stableCount} Stable (GREEN)</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient name, ID, symptom, or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              />
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="ALL">All Care Statuses</option>
                <option value="waiting">Waiting in Queue</option>
                <option value="in-review">Under Review</option>
                <option value="consulting">Active Consultation</option>
                <option value="escalated_er">🚨 Escalated to ER</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('list')}
                title="Priority List View"
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-xs text-teal-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Priority List</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                title="Clinical Kanban View"
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white shadow-xs text-teal-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban Board</span>
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: Priority Risk-Sorted List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredPatients.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No patients match the selected filter criteria.
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isRed = patient.triageResult?.triageLevel.includes('RED');
                const isYellow = patient.triageResult?.triageLevel.includes('YELLOW');
                const urgency = patient.triageResult?.urgencyScore || 0;

                return (
                  <div
                    key={patient.id}
                    onClick={() => handleOpenDrawer(patient)}
                    className={`p-4 sm:p-5 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all cursor-pointer group ${
                      isRed
                        ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                        : isYellow
                        ? 'border-amber-200 hover:border-amber-300'
                        : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Left: Patient info & complaint */}
                      <div className="flex-1 space-y-1.5 min-w-[280px]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {patient.name}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {patient.age}y &bull; {patient.gender}
                          </span>
                          <span className="text-xs font-mono text-slate-400">#{patient.id}</span>

                          {patient.triageResult && (
                            <TriageBadge level={patient.triageResult.triageLevel} size="sm" />
                          )}

                          {patient.status === 'escalated_er' && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                              <Ambulance className="w-3 h-3" /> ER Resuscitation Active
                            </span>
                          )}

                          {patient.ePrescription && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Rx Issued
                            </span>
                          )}
                        </div>

                        {/* Chief complaint */}
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {patient.chiefComplaint}
                        </p>

                        {/* Differential diagnosis */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          {patient.triageResult?.primarySuspectedConditions[0] && (
                            <span>
                              <strong>AI Differential:</strong>{' '}
                              <span className="text-teal-900 font-semibold">
                                {patient.triageResult.primarySuspectedConditions[0].name} (
                                {patient.triageResult.primarySuspectedConditions[0].probability}%)
                              </span>
                            </span>
                          )}
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Waiting {patient.symptomDuration}
                          </span>
                        </div>

                        {/* Red flags indicator */}
                        {patient.triageResult?.medicalRedFlags && patient.triageResult.medicalRedFlags.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-rose-700 font-semibold pt-0.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {patient.triageResult.medicalRedFlags[0]}
                              {patient.triageResult.medicalRedFlags.length > 1 &&
                                ` (+${patient.triageResult.medicalRedFlags.length - 1} more red flags)`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Middle: Compact Vitals */}
                      <div className="w-full lg:w-auto lg:min-w-[340px]">
                        <VitalsCard vitals={patient.vitals} compact />
                      </div>

                      {/* Right: Urgency Score & Inspect button */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-2 lg:pt-0">
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Urgency Score</div>
                          <div className="flex items-baseline gap-1 justify-end">
                            <span
                              className={`text-2xl font-black font-mono ${
                                urgency >= 75
                                  ? 'text-rose-600'
                                  : urgency >= 45
                                  ? 'text-amber-600'
                                  : 'text-emerald-600'
                              }`}
                            >
                              {urgency}
                            </span>
                            <span className="text-[10px] text-slate-400">/100</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawer(patient);
                            }}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold transition-colors"
                          >
                            <span>Review</span>
                            <ChevronRight className="w-3.5 h-3.5 text-teal-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* VIEW 2: Clinical Kanban Board */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {[
              {
                id: 'waiting',
                title: 'Triage Waiting Queue',
                color: 'border-t-amber-500',
                badgeBg: 'bg-amber-100 text-amber-800'
              },
              {
                id: 'in-review',
                title: 'Under Clinical Review',
                color: 'border-t-blue-500',
                badgeBg: 'bg-blue-100 text-blue-800'
              },
              {
                id: 'consulting',
                title: 'Active Consultation',
                color: 'border-t-teal-600',
                badgeBg: 'bg-teal-100 text-teal-800'
              },
              {
                id: 'escalated_er',
                title: '🚨 Escalated to ER Bay',
                color: 'border-t-rose-600',
                badgeBg: 'bg-rose-100 text-rose-800'
              }
            ].map((col) => {
              const colPatients = filteredPatients.filter((p) => p.status === col.id);

              return (
                <div
                  key={col.id}
                  className={`bg-white rounded-2xl border border-slate-200 border-t-4 ${col.color} p-3.5 shadow-xs flex flex-col min-h-[500px]`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">{col.title}</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                      {colPatients.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colPatients.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400 italic">
                        No patients in this column
                      </div>
                    ) : (
                      colPatients.map((patient) => {
                        const isRed = patient.triageResult?.triageLevel.includes('RED');
                        const isYellow = patient.triageResult?.triageLevel.includes('YELLOW');

                        return (
                          <div
                            key={patient.id}
                            onClick={() => handleOpenDrawer(patient)}
                            className={`p-3 rounded-xl border bg-white shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-2 ${
                              isRed
                                ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20'
                                : isYellow
                                ? 'border-amber-200'
                                : 'border-slate-200 hover:border-teal-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {patient.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                  (patient.triageResult?.urgencyScore || 0) >= 75
                                    ? 'bg-rose-100 text-rose-800'
                                    : (patient.triageResult?.urgencyScore || 0) >= 45
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {patient.triageResult?.urgencyScore || 0}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {patient.chiefComplaint}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                              <span>
                                {patient.vitals.systolicBP}/{patient.vitals.diastolicBP} mmHg &bull; {patient.vitals.heartRate} bpm
                              </span>
                              <span className="font-semibold text-teal-700">Open &rarr;</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-in Patient Profile Drawer */}
      <PatientDrawer
        patient={selectedPatient}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
