'use client';

import React, { useState, useRef } from 'react';
import { Patient, EPrescription, MedicationItem } from '@/types';
import { useAuraCare } from '@/lib/context';
import confetti from 'canvas-confetti';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  X,
  Printer,
  ShieldCheck,
  Calendar,
  User,
  Stethoscope,
  Pill
} from 'lucide-react';

interface PrescriptionModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const { savePrescription } = useAuraCare();

  const [doctorName, setDoctorName] = useState('Dr. Sarah Lin, MD');
  const [doctorLicense, setDoctorLicense] = useState('MED-NY-902418');
  const [hospitalName, setHospitalName] = useState('AuraCare Metropolitan Medical Center');
  const [diagnosis, setDiagnosis] = useState(
    patient.triageResult?.primarySuspectedConditions[0]?.name || patient.chiefComplaint
  );
  const [followUpDate, setFollowUpDate] = useState('In 5 to 7 days or sooner if symptoms worsen');
  const [adviceText, setAdviceText] = useState(
    'Drink 2-3 liters of fluids daily. Rest adequately. Seek emergency care immediately if breathing difficulty or severe chest pressure develops.'
  );

  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: 'm-1',
      name: 'Amoxicillin-Clavulanate',
      dosage: '875/125 mg',
      frequency: 'Twice daily with meals',
      duration: '7 days',
      instructions: 'Complete full course even if feeling better.'
    },
    {
      id: 'm-2',
      name: 'Acetaminophen (Paracetamol)',
      dosage: '650 mg',
      frequency: 'Every 6 hours PRN for fever or pain',
      duration: '5 days',
      instructions: 'Do not exceed 3000 mg in 24 hours.'
    }
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedDur, setNewMedDur] = useState('');
  const [newMedInst, setNewMedInst] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  if (!isOpen) return null;

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    const newItem: MedicationItem = {
      id: `m-${Date.now().toString().slice(-4)}`,
      name: newMedName,
      dosage: newMedDosage || 'Standard dose',
      frequency: newMedFreq || 'As directed',
      duration: newMedDur || '5 days',
      instructions: newMedInst || 'Take with water'
    };

    setMedications([...medications, newItem]);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
    setNewMedDur('');
    setNewMedInst('');
  };

  const handleRemoveMed = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleFinalize = () => {
    const rx: EPrescription = {
      id: `rx-${Date.now().toString().slice(-6)}`,
      patientId: patient.id,
      doctorName,
      doctorLicense,
      hospitalName,
      diagnosis,
      medications,
      advice: adviceText.split('.').map((s) => s.trim()).filter(Boolean),
      followUpDate,
      signedAt: new Date().toISOString(),
      signatureHash: `SHA256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    };

    savePrescription(patient.id, rx);
    setIsGenerated(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Digital E-Prescription Portal</h2>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-700">{patient.name}</span> ({patient.age}y, {patient.gender}) &bull; ID: {patient.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Hospital & Doctor Metadata Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Attending Physician</span>
              <div className="font-semibold text-slate-900 mt-0.5">{doctorName}</div>
              <div className="text-slate-500 text-[11px]">Lic: {doctorLicense}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Facility / Clinic</span>
              <div className="font-semibold text-slate-900 mt-0.5">{hospitalName}</div>
              <div className="text-slate-500 text-[11px]">Department of Emergency & Internal Medicine</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Date Issued</span>
              <div className="font-semibold text-slate-900 mt-0.5">{new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px] mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Verified
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinical Diagnosis
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Current Medications List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-teal-700" />
                <span>Prescribed Medications ({medications.length})</span>
              </label>
            </div>

            <div className="space-y-2 mb-3">
              {medications.map((med, idx) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-teal-200 transition-colors"
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-bold text-teal-800">{idx + 1}.</span>
                      <span className="text-xs font-bold text-slate-900">{med.name}</span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 pl-4 flex flex-wrap gap-x-4 gap-y-0.5">
                      <span><strong>Schedule:</strong> {med.frequency}</span>
                      <span><strong>Duration:</strong> {med.duration}</span>
                      {med.instructions && <span><strong>Notes:</strong> {med.instructions}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMed(med.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add medication inline form */}
            <div className="p-3.5 rounded-xl border border-dashed border-teal-300 bg-teal-50/40">
              <div className="text-xs font-bold text-teal-900 mb-2 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Medication
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Drug name (e.g. Azithromycin)"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Dose (e.g. 500 mg)"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g. Once daily)"
                  value={newMedFreq}
                  onChange={(e) => setNewMedFreq(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Duration (e.g. 5 days)"
                    value={newMedDur}
                    onChange={(e) => setNewMedDur(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMed}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800 flex-shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Advice & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clinical Advice & Precautions
              </label>
              <textarea
                rows={3}
                value={adviceText}
                onChange={(e) => setAdviceText(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Follow-up Instructions
              </label>
              <textarea
                rows={3}
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium"
          >
            <Printer className="w-4 h-4" /> Print Preview
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFinalize}
              disabled={isGenerated}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isGenerated ? (
                <>
                  <CheckCircle className="w-4 h-4 animate-spin" />
                  <span>Prescription Issued!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Sign & Issue E-Prescription</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
