'use client';

import React, { useState } from 'react';
import { Patient, PatientStatus } from '@/types';
import { useAuraCare } from '@/lib/context';
import { TriageBadge } from '@/components/ui/TriageBadge';
import { UrgencyMeter } from '@/components/ui/UrgencyMeter';
import { VitalsCard } from '@/components/ui/VitalsCard';
import { PrescriptionModal } from './PrescriptionModal';
import {
  X,
  AlertTriangle,
  Stethoscope,
  FileText,
  Activity,
  Heart,
  Pill,
  Clock,
  ShieldAlert,
  CheckCircle,
  Ambulance,
  Send,
  Download,
  Eye,
  FileCheck2,
  ExternalLink,
  Info
} from 'lucide-react';

interface PatientDrawerProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientDrawer: React.FC<PatientDrawerProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const { updatePatientStatus, escalatePatientToER, addDoctorNote } = useAuraCare();

  const [activeTab, setActiveTab] = useState<'clinical' | 'ai_triage' | 'vitals' | 'reports' | 'notes'>('clinical');
  const [newNote, setNewNote] = useState('');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [showEscalateConfirm, setShowEscalateConfirm] = useState(false);
  const [selectedDocView, setSelectedDocView] = useState<string | null>(null);

  if (!isOpen || !patient) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addDoctorNote(patient.id, `Dr. Note [${new Date().toLocaleTimeString()}]: ${newNote.trim()}`);
    setNewNote('');
  };

  const handleStatusChange = (newStatus: PatientStatus) => {
    updatePatientStatus(patient.id, newStatus);
  };

  const handleEscalateConfirm = () => {
    escalatePatientToER(patient.id, 'Stat ER Escalation: Rapid response team alerted.');
    setShowEscalateConfirm(false);
  };

  const isCritical = patient.triageResult?.triageLevel === 'CRITICAL (RED)';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className={`p-4 sm:p-5 border-b ${isCritical ? 'bg-rose-50/80 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{patient.name}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {patient.age}y, {patient.gender}
                </span>
                {patient.bloodGroup && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {patient.bloodGroup}
                  </span>
                )}
                {patient.triageResult && (
                  <TriageBadge level={patient.triageResult.triageLevel} size="sm" />
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>ID: <code className="font-mono text-slate-700">{patient.id}</code></span>
                <span>&bull;</span>
                <span>Contact: {patient.contactNumber}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick status bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Current Status:</span>
              <select
                value={patient.status}
                onChange={(e) => handleStatusChange(e.target.value as PatientStatus)}
                className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none transition-colors ${
                  patient.status === 'escalated_er'
                    ? 'bg-rose-100 border-rose-300 text-rose-800'
                    : patient.status === 'consulting'
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : patient.status === 'discharged'
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-amber-100 border-amber-300 text-amber-800'
                }`}
              >
                <option value="waiting">Waiting in Queue</option>
                <option value="in-review">Under Review</option>
                <option value="consulting">Active Consultation</option>
                <option value="escalated_er">🚨 Escalated to ER</option>
                <option value="discharged">Discharged / Completed</option>
              </select>
            </div>

            {patient.assignedDoctor && (
              <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                {patient.assignedDoctor}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'clinical', label: 'Clinical History', count: null },
            { id: 'ai_triage', label: 'AI Risk Stratification', count: patient.triageResult?.medicalRedFlags.length ? '!' : null },
            { id: 'vitals', label: 'Bedside Vitals', count: null },
            { id: 'reports', label: 'Lab Reports / OCR', count: patient.uploadedReports.length },
            { id: 'notes', label: 'Doctor Notes', count: patient.doctorNotes?.length || 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  tab.count === '!' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: Clinical History */}
          {activeTab === 'clinical' && (
            <div className="space-y-4">
              {/* Chief Complaint */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Chief Complaint</span>
                <p className="text-sm font-bold text-slate-900 mt-1">{patient.chiefComplaint}</p>
                <div className="mt-2 text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-700">Detailed Patient Description:</span>
                  <p className="mt-1">{patient.symptomsDescription}</p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span><strong>Duration:</strong> {patient.symptomDuration}</span>
                  <span>&bull;</span>
                  <span><strong>Pain Severity Scale:</strong> <span className={`font-bold ${patient.severity >= 8 ? 'text-rose-600' : patient.severity >= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>{patient.severity} / 10</span></span>
                </div>
              </div>

              {/* Medical History Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Allergies
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {patient.allergies && patient.allergies.length > 0 ? (
                      patient.allergies.map((all, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          {all}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No known drug allergies (NKDA)</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-teal-600" /> Pre-existing Conditions
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {patient.preExistingConditions && patient.preExistingConditions.length > 0 ? (
                      patient.preExistingConditions.map((cond, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {cond}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None reported</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5 text-teal-600" /> Current Medications
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {patient.currentMedications && patient.currentMedications.length > 0 ? (
                    patient.currentMedications.map((med, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                        {med}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None reported</span>
                  )}
                </div>
              </div>

              {/* E-Prescription Preview if already issued */}
              {patient.ePrescription && (
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" /> E-Prescription Active
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700">{patient.ePrescription.id}</span>
                  </div>
                  <p className="text-xs text-slate-700"><strong>Diagnosis:</strong> {patient.ePrescription.diagnosis}</p>
                  <p className="text-xs text-slate-600 mt-1">Prescribed: {patient.ePrescription.medications.map(m => m.name).join(', ')}</p>
                  <div className="mt-2 text-[11px] text-emerald-800">
                    Signed by {patient.ePrescription.doctorName} on {new Date(patient.ePrescription.signedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI Risk Stratification */}
          {activeTab === 'ai_triage' && patient.triageResult && (
            <div className="space-y-4">
              {/* Urgency Score Card */}
              <UrgencyMeter score={patient.triageResult.urgencyScore} size="lg" />

              {/* Clinical AI Summary Callout */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
                <div className="flex items-center justify-between text-xs font-bold text-teal-900 mb-1">
                  <span>AI Clinical Assessment</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-200 text-teal-900">
                    {patient.triageResult.aiConfidence}% Confidence &bull; {patient.triageResult.modelUsed}
                  </span>
                </div>
                <p className="text-xs text-teal-950 leading-relaxed font-medium">
                  {patient.triageResult.clinicalSummary}
                </p>
                <div className="mt-2.5 text-xs text-teal-800 flex items-center gap-1.5">
                  <strong>Recommended Specialty:</strong>
                  <span className="px-2 py-0.5 rounded bg-white border border-teal-300 font-semibold">
                    {patient.triageResult.recommendedSpecialty}
                  </span>
                </div>
              </div>

              {/* Red Flags Alert Box */}
              {patient.triageResult.medicalRedFlags.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
                    <span>Clinical Red Flags Detected ({patient.triageResult.medicalRedFlags.length})</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-900">
                    {patient.triageResult.medicalRedFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold mt-0.5">&bull;</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suspected Conditions */}
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Differential Diagnoses &amp; Suspected Conditions
                </h4>
                <div className="space-y-3">
                  {patient.triageResult.primarySuspectedConditions.map((cond, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{cond.name}</span>
                        <div className="flex items-center gap-2">
                          {cond.icd10Code && (
                            <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-200">
                              {cond.icd10Code}
                            </span>
                          )}
                          <span className="font-extrabold text-teal-800 font-mono">{cond.probability}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div
                          className="bg-teal-700 h-1.5 rounded-full"
                          style={{ width: `${cond.probability}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-600 italic">{cond.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drug-Drug Interactions */}
              {patient.triageResult.drugInteractions.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Drug-Drug Interaction Warnings ({patient.triageResult.drugInteractions.length})</span>
                  </div>
                  <div className="space-y-2">
                    {patient.triageResult.drugInteractions.map((inter, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-white/80 border border-amber-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
                          <span>{inter.drugs.join(' + ')}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                            {inter.severity} Risk
                          </span>
                        </div>
                        <p className="text-amber-800 text-[11px]">{inter.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Steps */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Immediate Clinical Protocol &amp; Next Steps
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 font-medium">
                  {patient.triageResult.recommendedNextSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: Bedside Vitals */}
          {activeTab === 'vitals' && (
            <div className="space-y-4">
              <VitalsCard vitals={patient.vitals} />

              {/* Vitals Flags Alert */}
              {patient.triageResult?.vitalsAbnormalities && patient.triageResult.vitalsAbnormalities.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span>Vitals Anomalies Out of Normal Range</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-amber-800">
                    {patient.triageResult.vitalsAbnormalities.map((va, idx) => (
                      <li key={idx}>{va}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800">Reference Clinical Ranges (Adult):</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>&bull; Blood Pressure: 100-135 / 60-85 mmHg</div>
                  <div>&bull; Heart Rate: 60 - 100 bpm</div>
                  <div>&bull; SpO2: 95% - 100% (Ambient Air)</div>
                  <div>&bull; Temperature: 97.5°F - 99.5°F</div>
                  <div>&bull; Respiratory Rate: 12 - 20 breaths/min</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Uploaded Lab Reports / OCR */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {patient.uploadedReports && patient.uploadedReports.length > 0 ? (
                patient.uploadedReports.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-700" />
                        <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {doc.size}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{doc.uploadedAt}</span>
                    </div>

                    {/* Extracted Key Values */}
                    {doc.extractedKeyValues && Object.keys(doc.extractedKeyValues).length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">
                          Vision OCR Extracted Biomarkers &amp; Metrics
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(doc.extractedKeyValues).map(([key, val]) => (
                            <div key={key} className="flex items-baseline justify-between p-2 rounded bg-white border border-slate-200 text-xs">
                              <span className="text-slate-500 font-medium">{key}:</span>
                              <span className={`font-mono font-bold ${
                                String(val).includes('CRITICAL') || String(val).includes('HIGH') ? 'text-rose-600' : 'text-slate-900'
                              }`}>
                                {val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Findings list */}
                    {doc.findings && doc.findings.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Clinical OCR Impression:</span>
                        <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-0.5">
                          {doc.findings.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Raw extracted text snippet */}
                    {doc.extractedText && (
                      <details className="mt-3 text-xs text-slate-500">
                        <summary className="cursor-pointer text-teal-700 font-medium hover:underline">
                          View Raw Extracted Text
                        </summary>
                        <pre className="mt-2 p-2.5 rounded bg-slate-100 text-[11px] font-mono whitespace-pre-wrap text-slate-800">
                          {doc.extractedText}
                        </pre>
                      </details>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No diagnostic files or lab reports uploaded for this intake.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Doctor Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Add Clinical Note</label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record patient observations, physical exam findings, or orders..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              {/* Past notes */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Clinical Timeline ({patient.doctorNotes?.length || 0})
                </span>
                {patient.doctorNotes && patient.doctorNotes.length > 0 ? (
                  patient.doctorNotes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800">
                      {note}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">No notes recorded yet.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* ER Escalation Button */}
          <button
            type="button"
            onClick={() => setShowEscalateConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Ambulance className="w-4 h-4 animate-pulse" />
            <span>Escalate to ER</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Consultation status toggle */}
            <button
              type="button"
              onClick={() => handleStatusChange('consulting')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-teal-300 bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-semibold"
            >
              <CheckCircle className="w-3.5 h-3.5 text-teal-700" />
              <span>Approve Consultation</span>
            </button>

            {/* Generate E-Prescription */}
            <button
              type="button"
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Generate E-Prescription</span>
            </button>
          </div>
        </div>
      </div>

      {/* ER Escalation Confirmation Modal */}
      {showEscalateConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-rose-300">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2.5 rounded-xl bg-rose-100">
                <Ambulance className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm ER Resuscitation Escalation</h3>
                <p className="text-xs text-slate-500">Patient: {patient.name} ({patient.id})</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              This action triggers an immediate Code Red alert to the Emergency Department, assigns a trauma resuscitation bay, and alerts the attending ER physician.
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEscalateConfirm(false)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscalateConfirm}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md"
              >
                🚨 Confirm Stat Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Prescription Modal */}
      <PrescriptionModal
        patient={patient}
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
      />
    </>
  );
};
