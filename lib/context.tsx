'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, HospitalResource, PatientStatus, EPrescription, TriageResult, UploadedDocument } from '@/types';
import { INITIAL_PATIENTS, INITIAL_HOSPITAL_RESOURCES } from './mock-data';

interface AuraCareContextType {
  patients: Patient[];
  resources: HospitalResource;
  currentRole: 'patient' | 'doctor' | 'admin';
  setCurrentRole: (role: 'patient' | 'doctor' | 'admin') => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;
  
  // Actions
  addNewPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Patient;
  updatePatientStatus: (patientId: string, status: PatientStatus, note?: string) => void;
  escalatePatientToER: (patientId: string, note?: string) => void;
  savePrescription: (patientId: string, prescription: EPrescription) => void;
  addDoctorNote: (patientId: string, note: string) => void;
  updateResources: (updater: Partial<HospitalResource>) => void;
  resetAllData: () => void;
}

const AuraCareContext = createContext<AuraCareContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PATIENTS = 'auracare_patients_v1';
const LOCAL_STORAGE_KEY_RESOURCES = 'auracare_resources_v1';
const LOCAL_STORAGE_KEY_API_KEY = 'auracare_custom_api_key';

export function AuraCareProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [resources, setResources] = useState<HospitalResource>(INITIAL_HOSPITAL_RESOURCES);
  const [currentRole, setCurrentRole] = useState<'patient' | 'doctor' | 'admin'>('doctor');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [customApiKey, setCustomApiKeyState] = useState('');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem(LOCAL_STORAGE_KEY_PATIENTS);
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
      const storedResources = localStorage.getItem(LOCAL_STORAGE_KEY_RESOURCES);
      if (storedResources) {
        setResources(JSON.parse(storedResources));
      }
      const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY_API_KEY);
      if (storedKey) {
        setCustomApiKeyState(storedKey);
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to persist patients', e);
    }
  }, [patients, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.error('Failed to persist resources', e);
    }
  }, [resources, isInitialized]);

  const setCustomApiKey = (key: string) => {
    setCustomApiKeyState(key);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_API_KEY, key);
    } catch (e) {
      console.error('Failed to persist api key', e);
    }
  };

  const playBeepAlert = () => {
    if (!audioAlertsEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const addNewPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Patient => {
    const newId = `pt-${Date.now().toString().slice(-4)}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPatients(prev => [newPatient, ...prev]);

    // Update queue length
    setResources(prev => ({
      ...prev,
      triageQueueLength: prev.triageQueueLength + 1,
      lastUpdated: new Date().toISOString()
    }));

    if (newPatient.triageResult?.triageLevel === 'CRITICAL (RED)') {
      playBeepAlert();
    }

    return newPatient;
  };

  const updatePatientStatus = (patientId: string, status: PatientStatus, note?: string) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        const notes = p.doctorNotes ? [...p.doctorNotes] : [];
        if (note) notes.push(note);
        return {
          ...p,
          status,
          doctorNotes: notes,
          updatedAt: new Date().toISOString()
        };
      })
    );

    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => (prev ? { ...prev, status } : null));
    }
  };

  const escalatePatientToER = (patientId: string, note?: string) => {
    updatePatientStatus(
      patientId,
      'escalated_er',
      note || 'Stat ER Escalation: Immediate ambulance/trauma bay allocation activated by attending physician.'
    );

    setResources(prev => ({
      ...prev,
      erBedsOccupied: Math.min(prev.erBedsTotal, prev.erBedsOccupied + 1),
      lastUpdated: new Date().toISOString()
    }));

    playBeepAlert();
  };

  const savePrescription = (patientId: string, prescription: EPrescription) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        const notes = p.doctorNotes ? [...p.doctorNotes] : [];
        notes.push(`E-Prescription issued with ${prescription.medications.length} medication(s). Follow-up: ${prescription.followUpDate}`);
        return {
          ...p,
          ePrescription: prescription,
          status: 'discharged',
          doctorNotes: notes,
          updatedAt: new Date().toISOString()
        };
      })
    );

    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev =>
        prev
          ? {
              ...prev,
              ePrescription: prescription,
              status: 'discharged'
            }
          : null
      );
    }
  };

  const addDoctorNote = (patientId: string, note: string) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        const notes = p.doctorNotes ? [...p.doctorNotes, note] : [note];
        return {
          ...p,
          doctorNotes: notes,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const updateResources = (updater: Partial<HospitalResource>) => {
    setResources(prev => ({
      ...prev,
      ...updater,
      lastUpdated: new Date().toISOString()
    }));
  };

  const resetAllData = () => {
    setPatients(INITIAL_PATIENTS);
    setResources(INITIAL_HOSPITAL_RESOURCES);
    setSelectedPatient(null);
    setIsDrawerOpen(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PATIENTS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_RESOURCES);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuraCareContext.Provider
      value={{
        patients,
        resources,
        currentRole,
        setCurrentRole,
        selectedPatient,
        setSelectedPatient,
        isDrawerOpen,
        setIsDrawerOpen,
        customApiKey,
        setCustomApiKey,
        audioAlertsEnabled,
        setAudioAlertsEnabled,
        addNewPatient,
        updatePatientStatus,
        escalatePatientToER,
        savePrescription,
        addDoctorNote,
        updateResources,
        resetAllData
      }}
    >
      {children}
    </AuraCareContext.Provider>
  );
}

export function useAuraCare() {
  const context = useContext(AuraCareContext);
  if (!context) {
    throw new Error('useAuraCare must be used within an AuraCareProvider');
  }
  return context;
}
