export type TriageLevel = 'CRITICAL (RED)' | 'MODERATE (YELLOW)' | 'STABLE (GREEN)';

export type PatientStatus = 'waiting' | 'in-review' | 'consulting' | 'escalated_er' | 'discharged';

export interface Vitals {
  systolicBP: number;       // mmHg (e.g. 120)
  diastolicBP: number;      // mmHg (e.g. 80)
  heartRate: number;        // bpm (e.g. 72)
  oxygenSat: number;        // % (e.g. 98)
  temperature: number;      // °F (e.g. 98.6)
  respiratoryRate: number;  // breaths/min (e.g. 16)
}

export interface SuspectedCondition {
  name: string;
  probability: number;      // 0 - 100%
  rationale: string;
  icd10Code?: string;
}

export interface DrugInteraction {
  drugs: string[];
  severity: 'high' | 'moderate' | 'low';
  description: string;
}

export interface TriageResult {
  urgencyScore: number;     // 0 - 100
  triageLevel: TriageLevel;
  primarySuspectedConditions: SuspectedCondition[];
  medicalRedFlags: string[];
  vitalsAbnormalities: string[];
  drugInteractions: DrugInteraction[];
  recommendedNextSteps: string[];
  clinicalSummary: string;
  recommendedSpecialty: string;
  evaluatedAt: string;
  aiConfidence: number;     // 0 - 100%
  modelUsed: string;
  esiCategory?: number;     // Emergency Severity Index 1 (resuscitation) to 5 (non-urgent)
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: 'lab_report' | 'prescription' | 'ecg' | 'imaging' | 'discharge_summary';
  size: string;
  extractedText?: string;
  extractedKeyValues?: Record<string, string | number>;
  findings?: string[];
  uploadedAt: string;
  previewUrl?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface EPrescription {
  id: string;
  patientId: string;
  doctorName: string;
  doctorLicense: string;
  hospitalName: string;
  diagnosis: string;
  medications: MedicationItem[];
  advice: string[];
  followUpDate: string;
  signedAt: string;
  signatureHash: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email?: string;
  bloodGroup?: string;
  chiefComplaint: string;
  symptomsDescription: string;
  symptomDuration: string;
  severity: number;         // 1 - 10 scale
  allergies: string[];
  preExistingConditions: string[];
  currentMedications: string[];
  vitals: Vitals;
  uploadedReports: UploadedDocument[];
  triageResult?: TriageResult;
  status: PatientStatus;
  assignedDoctor?: string;
  ePrescription?: EPrescription;
  doctorNotes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HospitalResource {
  totalBeds: number;
  occupiedBeds: number;
  icuBedsTotal: number;
  icuBedsOccupied: number;
  ventilatorsTotal: number;
  ventilatorsOccupied: number;
  erBedsTotal: number;
  erBedsOccupied: number;
  activeDoctorsOnDuty: number;
  triageQueueLength: number;
  averageWaitTimeMin: number;
  lastUpdated: string;
}

export interface TriageAnalytics {
  totalPatientsToday: number;
  criticalCasesCount: number;
  moderateCasesCount: number;
  stableCasesCount: number;
  avgUrgencyScore: number;
  erEscalationsToday: number;
  prescriptionsGeneratedToday: number;
  hourlyIntake: Array<{ hour: string; count: number; redCount: number }>;
  specialtyDistribution: Array<{ specialty: string; count: number }>;
}
