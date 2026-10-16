import { Patient, HospitalResource, UploadedDocument } from '@/types';

export const INITIAL_HOSPITAL_RESOURCES: HospitalResource = {
  totalBeds: 60,
  occupiedBeds: 49,
  icuBedsTotal: 14,
  icuBedsOccupied: 11,
  ventilatorsTotal: 10,
  ventilatorsOccupied: 7,
  erBedsTotal: 16,
  erBedsOccupied: 13,
  activeDoctorsOnDuty: 8,
  triageQueueLength: 6,
  averageWaitTimeMin: 14,
  lastUpdated: new Date().toISOString()
};

export const SAMPLE_LAB_REPORTS: UploadedDocument[] = [
  {
    id: 'doc-cardiac-trop',
    name: 'Stat_Troponin_I_Serology.pdf',
    type: 'lab_report',
    size: '412 KB',
    extractedText: 'HIGH SENSITIVITY TROPONIN I: 2.84 ng/mL [REF RANGE: < 0.04 ng/mL] CRITICAL HIGH. CK-MB: 48 U/L. Serum Creatinine: 1.1 mg/dL. Impression: Strongly indicates acute myocardial necrosis consistent with acute coronary syndrome.',
    extractedKeyValues: {
      'Troponin I': '2.84 ng/mL (CRITICAL HIGH)',
      'CK-MB': '48 U/L (ELEVATED)',
      'Serum Creatinine': '1.1 mg/dL (Normal)',
      'eGFR': '78 mL/min/1.73m²'
    },
    findings: [
      'High-Sensitivity Cardiac Troponin I markedly elevated at 2.84 ng/mL (>70x baseline)',
      'Acute ischemic myocardial injury pattern confirmed',
      'CK-MB enzyme surge noted'
    ],
    uploadedAt: '12 minutes ago'
  },
  {
    id: 'doc-cxr-pneumo',
    name: 'Chest_XRay_PA_Lateral_Radiology.pdf',
    type: 'imaging',
    size: '1.8 MB',
    extractedText: 'CHEST RADIOGRAPH (PA/LAT): Findings demonstrate dense alveolar consolidation in the right lower lobe with prominent air bronchograms. No pneumothorax. Heart size normal. Impression: Acute right lower lobe community-acquired pneumonia.',
    extractedKeyValues: {
      'Right Lower Lobe': 'Dense Consolidation / Air bronchograms',
      'Pleural Cavities': 'Trace reactive right-sided effusion',
      'Cardiothoracic Ratio': '0.47 (Normal)',
      'Bone Structure': 'Intact'
    },
    findings: [
      'Right lower lobe lobar consolidation',
      'Prominent air bronchograms observed',
      'Pneumonic infiltrate consistent with bacterial etiology'
    ],
    uploadedAt: '28 minutes ago'
  },
  {
    id: 'doc-cbc-infection',
    name: 'Complete_Blood_Count_Differential.pdf',
    type: 'lab_report',
    size: '340 KB',
    extractedText: 'CBC W/ DIFF: WBC: 17.4 x 10^3/uL [REF: 4.5-11.0] HIGH. Neutrophils: 84% [REF: 40-70%] HIGH. Hemoglobin: 13.9 g/dL. Platelets: 265 x 10^3/uL. CRP: 78 mg/L [REF: < 5.0] CRITICAL HIGH.',
    extractedKeyValues: {
      'WBC Count': '17.4 x 10^3/uL (HIGH)',
      'Neutrophils': '84% (Shift to left)',
      'Hemoglobin': '13.9 g/dL (Normal)',
      'C-Reactive Protein': '78 mg/L (MARKEDLY ELEVATED)'
    },
    findings: [
      'Marked leukocytosis with 84% neutrophilic left shift',
      'Systemic inflammatory marker CRP elevated at 78 mg/L'
    ],
    uploadedAt: '45 minutes ago'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pt-101',
    name: 'Marcus Vance',
    age: 58,
    gender: 'male',
    contactNumber: '+1 (555) 234-8901',
    email: 'm.vance@example.com',
    bloodGroup: 'O+',
    chiefComplaint: 'Substernal crushing chest pain radiating to left jaw & shoulder',
    symptomsDescription: 'Severe retrosternal pressure like an elephant on my chest, started 45 minutes ago while climbing stairs. Broke into a cold clammy sweat, feeling nauseous and dizzy.',
    symptomDuration: '45 minutes',
    severity: 9,
    allergies: ['Penicillin', 'Sulfa Drugs'],
    preExistingConditions: ['Coronary Artery Disease', 'Hypertension', 'Type 2 Diabetes'],
    currentMedications: ['Lisinopril 20mg', 'Aspirin 81mg', 'Atorvastatin 40mg', 'Metformin 1000mg'],
    vitals: {
      systolicBP: 88,
      diastolicBP: 56,
      heartRate: 118,
      oxygenSat: 89,
      temperature: 98.4,
      respiratoryRate: 26
    },
    uploadedReports: [SAMPLE_LAB_REPORTS[0]],
    triageResult: {
      urgencyScore: 98,
      triageLevel: 'CRITICAL (RED)',
      esiCategory: 1,
      primarySuspectedConditions: [
        {
          name: 'Acute ST-Elevation Myocardial Infarction (STEMI) / Cardiogenic Shock',
          probability: 96,
          rationale: 'Substernal crushing pain with radiation, severe hypotension (88/56), tachycardia (118 bpm), hypoxemia (89%), and elevated Troponin I (2.84 ng/mL).',
          icd10Code: 'I21.0'
        },
        {
          name: 'Acute Aortic Dissection',
          probability: 25,
          rationale: 'Severe retrosternal pain with hemodynamic collapse, needs bedside echo/CTA confirmation.',
          icd10Code: 'I71.0'
        }
      ],
      medicalRedFlags: [
        'Hypotension (88/56 mmHg) and tachycardia indicates cardiogenic shock',
        'Critical hypoxemia: SpO2 89% on room air',
        'Severe diaphoresis with radiating substernal agony',
        'Elevated cardiac biomarker Troponin I at 2.84 ng/mL'
      ],
      vitalsAbnormalities: [
        'Hypotension / Shock risk (Systolic BP 88 mmHg)',
        'Significant tachycardia (118 bpm)',
        'Critical hypoxemia (SpO2 89%)',
        'Severe tachypnea (26 /min)'
      ],
      drugInteractions: [
        {
          drugs: ['Metformin', 'Iodinated Radiocontrast'],
          severity: 'high',
          description: 'If emergency cardiac catheterization / angiogram is performed with iodinated contrast, monitor renal function for lactic acidosis.'
        }
      ],
      recommendedNextSteps: [
        'Immediate transfer to Resuscitation Bay / Cath Lab Activation (Door-to-Balloon < 90 min)',
        'High-flow supplemental oxygen via non-rebreather mask (15 L/min)',
        'Stat 12-lead ECG and dual antiplatelet therapy protocol per cardiology protocol',
        'Two large-bore IV lines with continuous hemodynamic arterial monitoring'
      ],
      clinicalSummary: '58M presenting with acute crushing chest pain, diaphoresis, and cardiogenic shock signs (BP 88/56, SpO2 89%, HR 118). Extremely critical ACS presentation requiring immediate interventional catheterization.',
      recommendedSpecialty: 'Emergency Medicine / Interventional Cardiology',
      evaluatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      aiConfidence: 98,
      modelUsed: 'OpenAI GPT-4o-mini (Clinical Emergency Fine-Tuned)'
    },
    status: 'in-review',
    assignedDoctor: 'Dr. Sarah Lin, MD (ER Lead)',
    doctorNotes: ['Patient placed in Resuscitation Bay 1. Cardiology team alerted for emergent cath lab activation.'],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'pt-102',
    name: 'Elena Rostova',
    age: 34,
    gender: 'female',
    contactNumber: '+1 (555) 782-3490',
    email: 'elena.rostova@example.com',
    bloodGroup: 'A+',
    chiefComplaint: 'Productive purulent cough, pleuritic chest pain, and high fever',
    symptomsDescription: 'Persistent heavy cough producing thick rust-colored sputum for 4 days. Stabbing right-sided pain whenever taking a deep breath. Shaking chills, fatigue, and feeling short of breath climbing one flight of stairs.',
    symptomDuration: '4 days',
    severity: 7,
    allergies: ['Ciprofloxacin'],
    preExistingConditions: ['Mild Asthma (childhood)'],
    currentMedications: ['Albuterol inhaler PRN'],
    vitals: {
      systolicBP: 124,
      diastolicBP: 78,
      heartRate: 98,
      oxygenSat: 93,
      temperature: 102.4,
      respiratoryRate: 22
    },
    uploadedReports: [SAMPLE_LAB_REPORTS[1], SAMPLE_LAB_REPORTS[2]],
    triageResult: {
      urgencyScore: 68,
      triageLevel: 'MODERATE (YELLOW)',
      esiCategory: 3,
      primarySuspectedConditions: [
        {
          name: 'Community-Acquired Lobar Pneumonia (Right Lower Lobe)',
          probability: 89,
          rationale: 'Fever 102.4°F, pleuritic pain, rust-colored sputum, tachypnea, SpO2 93%, with chest X-ray confirming RLL consolidation and leukocytosis.',
          icd10Code: 'J18.1'
        },
        {
          name: 'Acute Bacterial Bronchitis with Secondary Bronchospasm',
          probability: 32,
          rationale: 'Underlying reactive airway exacerbation triggered by respiratory tract infection.',
          icd10Code: 'J20.8'
        }
      ],
      medicalRedFlags: [
        'Moderate hypoxemia: SpO2 93% on room air',
        'High fever (102.4°F) with elevated inflammatory markers (CRP 78 mg/L, WBC 17.4)',
        'Tachypneic at 22 breaths/min with pleuritic chest pain'
      ],
      vitalsAbnormalities: [
        'Moderate hypoxemia (SpO2 93%)',
        'High fever (102.4°F)',
        'Tachypnea (22 /min)',
        'Elevated heart rate (98 bpm)'
      ],
      drugInteractions: [],
      recommendedNextSteps: [
        'Admit to Acute Respiratory Care Observation Unit',
        'Initiate low-flow nasal cannula O2 at 2 L/min to target SpO2 >= 95%',
        'Blood cultures x 2 and sputum gram stain/culture prior to IV antibiotics',
        'Empiric IV Ceftriaxone 1g + Azithromycin 500mg (avoid Ciprofloxacin due to documented allergy)'
      ],
      clinicalSummary: '34F with 4-day history of right-sided pleuritic chest pain, productive cough, high fever (102.4°F), and SpO2 93%. CXR confirms right lower lobe lobar pneumonia. Moderate triage priority.',
      recommendedSpecialty: 'Pulmonology / Internal Medicine',
      evaluatedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      aiConfidence: 94,
      modelUsed: 'OpenAI GPT-4o-mini (Clinical Emergency Fine-Tuned)'
    },
    status: 'consulting',
    assignedDoctor: 'Dr. Michael Chang, MD',
    doctorNotes: ['IV line established. Sputum sent for lab culture. Commencing IV Ceftriaxone.'],
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'pt-103',
    name: 'David O\'Connor',
    age: 71,
    gender: 'male',
    contactNumber: '+1 (555) 441-9022',
    bloodGroup: 'B-',
    chiefComplaint: 'Acute confusion, rigors, dysuria, and profound weakness',
    symptomsDescription: 'Family noticed increasing disorientation over the last 12 hours. Patient unable to stand, complaining of lower pelvic burning for several days, lethargic, skin is flushed and warm.',
    symptomDuration: '12 hours acute onset',
    severity: 8,
    allergies: ['No Known Drug Allergies (NKDA)'],
    preExistingConditions: ['Benign Prostatic Hyperplasia (BPH)', 'Hypertension', 'Atrial Fibrillation'],
    currentMedications: ['Warfarin 5mg daily', 'Tamsulosin 0.4mg', 'Amlodipine 5mg'],
    vitals: {
      systolicBP: 84,
      diastolicBP: 52,
      heartRate: 124,
      oxygenSat: 91,
      temperature: 103.1,
      respiratoryRate: 28
    },
    uploadedReports: [SAMPLE_LAB_REPORTS[2]],
    triageResult: {
      urgencyScore: 95,
      triageLevel: 'CRITICAL (RED)',
      esiCategory: 1,
      primarySuspectedConditions: [
        {
          name: 'Severe Urosepsis / Septic Shock',
          probability: 94,
          rationale: 'Meets full qSOFA and SIRS criteria: Altered mentation, SBP 84 mmHg, RR 28/min, HR 124 bpm, high fever 103.1°F originating from urinary tract infection.',
          icd10Code: 'R65.21'
        },
        {
          name: 'Acute Delirium Secondary to Systemic Infection',
          probability: 88,
          rationale: 'Acute encephalopathy triggered by infectious toxic metabolic state.',
          icd10Code: 'F05'
        }
      ],
      medicalRedFlags: [
        'Septic Shock criteria met: SBP < 90 mmHg unresponsive to initial positioning, severe tachycardia 124 bpm',
        'Acute neurological alteration / confusion in geriatric patient',
        'High fever (103.1°F) with tachypnea (28 /min)',
        'Anticoagulant (Warfarin) therapy: check INR for coagulopathy'
      ],
      vitalsAbnormalities: [
        'Hypotension / Shock risk (Systolic BP 84 mmHg)',
        'Significant tachycardia (124 bpm)',
        'Moderate to severe hypoxemia (SpO2 91%)',
        'High fever (103.1°F)',
        'Severe tachypnea (28 /min)'
      ],
      drugInteractions: [
        {
          drugs: ['Warfarin', 'Broad-spectrum Antibiotics'],
          severity: 'moderate',
          description: 'Antibiotics may eradicate gut flora synthesizing Vitamin K, causing supra-therapeutic INR spikes.'
        }
      ],
      recommendedNextSteps: [
        'Immediate Sepsis Resuscitation Bundle: 30 mL/kg IV crystalloid fluid bolus within 1 hour',
        'Draw blood cultures, stat lactate level, and stat urinalysis/culture',
        'Empiric broad-spectrum IV Piperacillin/Tazobactam (Zosyn) within 45 minutes',
        'Prepare vasopressor infusion (Norepinephrine) if MAP remains < 65 mmHg after fluids'
      ],
      clinicalSummary: '71M presenting with septic shock secondary to acute urosepsis. SBP 84/52, HR 124, Temp 103.1°F, altered mental status. High mortality risk without immediate volume resuscitation and ICU admission.',
      recommendedSpecialty: 'Emergency Medicine / Critical Care ICU',
      evaluatedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      aiConfidence: 96,
      modelUsed: 'OpenAI GPT-4o-mini (Clinical Emergency Fine-Tuned)'
    },
    status: 'escalated_er',
    assignedDoctor: 'Dr. Sarah Lin, MD (ER Lead)',
    doctorNotes: ['Sepsis Code activated. ICU Bed requested. 2000mL IV Saline bolus started. Stat serum lactate sent.'],
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'pt-104',
    name: 'Priya Sharma',
    age: 46,
    gender: 'female',
    contactNumber: '+1 (555) 903-1288',
    bloodGroup: 'B+',
    chiefComplaint: 'Uncontrolled nausea, excessive thirst, and abdominal cramping',
    symptomsDescription: 'Frequent urination, deep unquenchable thirst, and persistent nausea for 2 days. Blood sugar checked at home was over 380 mg/dL. Fruity breath odor noted by family member.',
    symptomDuration: '2 days',
    severity: 6,
    allergies: ['Sulfa drugs'],
    preExistingConditions: ['Type 2 Diabetes Mellitus', 'Hyperlipidemia'],
    currentMedications: ['Metformin 1000mg BID', 'Glimepiride 4mg daily'],
    vitals: {
      systolicBP: 112,
      diastolicBP: 74,
      heartRate: 104,
      oxygenSat: 97,
      temperature: 99.2,
      respiratoryRate: 22
    },
    uploadedReports: [],
    triageResult: {
      urgencyScore: 62,
      triageLevel: 'MODERATE (YELLOW)',
      esiCategory: 3,
      primarySuspectedConditions: [
        {
          name: 'Diabetic Ketoacidosis (DKA) / Hyperosmolar Hyperglycemic State (HHS)',
          probability: 86,
          rationale: 'Severe hyperglycemia > 380 mg/dL, osmotic diuresis (polydipsia, polyuria), tachycardia, tachypnea with fruity breath odor.',
          icd10Code: 'E11.10'
        },
        {
          name: 'Acute Gastroenteritis in Diabetic Host',
          probability: 30,
          rationale: 'Nausea and cramping may be trigger or presentation of metabolic decompensation.',
          icd10Code: 'K52.9'
        }
      ],
      medicalRedFlags: [
        'Marked hyperglycemia with ketotic breath: risk of severe metabolic acidosis and electrolyte collapse',
        'Tachycardia (104 bpm) with volume depletion signs'
      ],
      vitalsAbnormalities: [
        'Elevated heart rate (104 bpm)',
        'Tachypnea (22 /min)'
      ],
      drugInteractions: [
        {
          drugs: ['Metformin', 'Dehydration / Ketosis state'],
          severity: 'high',
          description: 'Metformin must be temporarily withheld during acute dehydration to avoid lactic acidosis.'
        }
      ],
      recommendedNextSteps: [
        'Stat Point-of-Care blood glucose, venous blood gas (VBG), and serum ketones',
        'Basic Metabolic Panel to evaluate anion gap, potassium, and sodium',
        'Initiate IV 0.9% Normal Saline at 500-1000 mL/hr',
        'Hold Metformin and prepare low-dose regular insulin IV infusion per protocol once K+ verified'
      ],
      clinicalSummary: '46F with blood glucose > 380 mg/dL, fruity breath, tachypnea, and vomiting. High suspicion for diabetic ketoacidosis. Requires immediate IV fluids, insulin protocol, and electrolyte monitoring.',
      recommendedSpecialty: 'Endocrinology / Internal Medicine',
      evaluatedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      aiConfidence: 92,
      modelUsed: 'AuraCare Clinical Heuristics Engine'
    },
    status: 'waiting',
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString()
  },
  {
    id: 'pt-105',
    name: 'Liam Chen',
    age: 24,
    gender: 'male',
    contactNumber: '+1 (555) 612-4590',
    bloodGroup: 'O-',
    chiefComplaint: 'Mild scratchy throat, nasal congestion, and low-grade fatigue',
    symptomsDescription: 'Started 2 days ago after exposure to colleague with head cold. Mild runny nose, sneezing, scratchy throat when swallowing. Able to eat and drink normally, no shortness of breath, no chest discomfort.',
    symptomDuration: '2 days',
    severity: 2,
    allergies: ['None'],
    preExistingConditions: ['None'],
    currentMedications: ['Multivitamin'],
    vitals: {
      systolicBP: 118,
      diastolicBP: 76,
      heartRate: 72,
      oxygenSat: 99,
      temperature: 98.9,
      respiratoryRate: 15
    },
    uploadedReports: [],
    triageResult: {
      urgencyScore: 16,
      triageLevel: 'STABLE (GREEN)',
      esiCategory: 5,
      primarySuspectedConditions: [
        {
          name: 'Acute Viral Pharyngitis / Upper Respiratory Infection (Common Cold)',
          probability: 93,
          rationale: 'Classic coryzal symptoms with scratchy throat, normal vital signs, no tonsillar exudates, no respiratory distress.',
          icd10Code: 'J00'
        },
        {
          name: 'Allergic Rhinitis',
          probability: 22,
          rationale: 'Nasal congestion and sneezing may represent seasonal or environmental flare.',
          icd10Code: 'J30.9'
        }
      ],
      medicalRedFlags: [],
      vitalsAbnormalities: [],
      drugInteractions: [],
      recommendedNextSteps: [
        'Outpatient supportive symptomatic care',
        'Warm saline gargles, adequate oral hydration, and throat lozenges',
        'Over-the-counter Acetaminophen or Ibuprofen as needed for throat discomfort',
        'Return precautions: seek clinical review if high fever (>101°F), severe difficulty swallowing, or dyspnea develops'
      ],
      clinicalSummary: '24M presenting with mild upper respiratory viral symptoms. Vital signs completely normal (BP 118/76, HR 72, SpO2 99%). Safe for outpatient self-care or routine teleconsultation.',
      recommendedSpecialty: 'Outpatient Primary Care / Telemedicine',
      evaluatedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      aiConfidence: 97,
      modelUsed: 'AuraCare Clinical Heuristics Engine'
    },
    status: 'discharged',
    assignedDoctor: 'Dr. Michael Chang, MD',
    doctorNotes: ['Patient evaluated. Clear viral etiology. Symptomatic guidance provided. E-Prescription issued for OTC relief.'],
    ePrescription: {
      id: 'rx-901',
      patientId: 'pt-105',
      doctorName: 'Dr. Michael Chang, MD',
      doctorLicense: 'MED-NY-849201',
      hospitalName: 'AuraCare Metropolitan Medical Center',
      diagnosis: 'Acute Viral Pharyngitis (Common Cold) - ICD-10 J00',
      medications: [
        {
          id: 'med-1',
          name: 'Acetaminophen (Tylenol)',
          dosage: '500 mg',
          frequency: 'Every 6 hours as needed for throat pain or discomfort',
          duration: '3 to 5 days',
          instructions: 'Take with full glass of water. Do not exceed 3000 mg in 24 hours.'
        },
        {
          id: 'med-2',
          name: 'Saline Nasal Spray (0.9% NaCl)',
          dosage: '2 sprays per nostril',
          frequency: '3 times daily',
          duration: '5 days',
          instructions: 'Use to relieve nasal congestion and humidify mucous membranes.'
        }
      ],
      advice: [
        'Rest and maintain vigorous hydration (2 to 3 liters of warm fluids daily)',
        'Gargle with warm salt water 3 times a day',
        'Avoid tobacco smoke and environmental irritants'
      ],
      followUpDate: 'In 7 days if symptoms persist or worsen',
      signedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
      signatureHash: 'SHA256-7a8e9f2b1c4d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f'
    },
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    id: 'pt-106',
    name: 'Emily Watson',
    age: 29,
    gender: 'female',
    contactNumber: '+1 (555) 332-9011',
    bloodGroup: 'A-',
    chiefComplaint: 'Right lateral ankle inversion sprain while running',
    symptomsDescription: 'Twisted right ankle on uneven pavement 3 hours ago. Immediate sharp pain, mild swelling over lateral malleolus. Able to bear weight with mild limp. No numbness or tingling in toes.',
    symptomDuration: '3 hours',
    severity: 4,
    allergies: ['Aspirin (mild rash)'],
    preExistingConditions: ['None'],
    currentMedications: ['None'],
    vitals: {
      systolicBP: 120,
      diastolicBP: 80,
      heartRate: 76,
      oxygenSat: 99,
      temperature: 98.6,
      respiratoryRate: 16
    },
    uploadedReports: [],
    triageResult: {
      urgencyScore: 22,
      triageLevel: 'STABLE (GREEN)',
      esiCategory: 4,
      primarySuspectedConditions: [
        {
          name: 'Grade I/II Lateral Ankle Ligament Sprain (ATFL)',
          probability: 91,
          rationale: 'Classic inversion injury mechanism, lateral malleolar tenderness without bony crepitus, preserved weight-bearing.',
          icd10Code: 'S93.401A'
        }
      ],
      medicalRedFlags: [],
      vitalsAbnormalities: [],
      drugInteractions: [],
      recommendedNextSteps: [
        'Apply Ottawa Ankle Rules to determine whether plain radiograph is needed',
        'RICE protocol: Rest, Ice (15-20 min every 3 hours), Compression bandage, Elevation',
        'Short course of Acetaminophen or topical NSAID gel (avoid oral Aspirin due to allergy)',
        'Supportive ankle brace for ambulation'
      ],
      clinicalSummary: '29F with acute lateral ankle sprain following inversion injury. Normal vitals, patient can bear weight. Low urgency triage.',
      recommendedSpecialty: 'Orthopedics / Urgent Care / Physical Therapy',
      evaluatedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
      aiConfidence: 95,
      modelUsed: 'AuraCare Clinical Heuristics Engine'
    },
    status: 'waiting',
    createdAt: new Date(Date.now() - 145 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString()
  }
];

export const DEMO_PRESETS = [
  {
    title: 'CRITICAL: Acute Myocardial Infarction (Chest Pain)',
    badge: 'Critical Red',
    color: 'rose',
    data: {
      name: 'James Reynolds',
      age: 62,
      gender: 'male',
      contactNumber: '+1 (555) 723-9041',
      email: 'j.reynolds@example.com',
      bloodGroup: 'O+',
      chiefComplaint: 'Crushing central chest tightness radiating to left arm and neck',
      symptomsDescription: 'Severe squeezing chest pain started 40 minutes ago while resting. Profuse cold sweat, breathlessness, nausea. History of heavy smoking and high cholesterol.',
      symptomDuration: '40 minutes',
      severity: 9,
      allergies: ['Penicillin'],
      preExistingConditions: ['Hypertension', 'Hyperlipidemia'],
      currentMedications: ['Amlodipine 10mg', 'Rosuvastatin 20mg'],
      vitals: {
        systolicBP: 86,
        diastolicBP: 54,
        heartRate: 114,
        oxygenSat: 88,
        temperature: 98.2,
        respiratoryRate: 25
      }
    }
  },
  {
    title: 'MODERATE: Lobar Pneumonia & High Fever',
    badge: 'Moderate Yellow',
    color: 'amber',
    data: {
      name: 'Claire Moreau',
      age: 39,
      gender: 'female',
      contactNumber: '+1 (555) 882-1920',
      email: 'claire.m@example.com',
      bloodGroup: 'A+',
      chiefComplaint: 'Productive greenish cough with stabbing right side chest pain and fever',
      symptomsDescription: 'High fever for 3 days, shaking rigors, sharp chest pain when coughing or inhaling deeply. Feeling fatigued and short of breath climbing stairs.',
      symptomDuration: '3 days',
      severity: 7,
      allergies: ['None'],
      preExistingConditions: ['Mild seasonal asthma'],
      currentMedications: ['Albuterol inhaler'],
      vitals: {
        systolicBP: 126,
        diastolicBP: 78,
        heartRate: 98,
        oxygenSat: 92,
        temperature: 102.6,
        respiratoryRate: 23
      }
    }
  },
  {
    title: 'STABLE: Acute Viral Pharyngitis (Mild Cold)',
    badge: 'Stable Green',
    color: 'emerald',
    data: {
      name: 'Oliver King',
      age: 26,
      gender: 'male',
      contactNumber: '+1 (555) 431-7729',
      email: 'oliver.king@example.com',
      bloodGroup: 'AB+',
      chiefComplaint: 'Mild sore throat and runny nose',
      symptomsDescription: 'Mild scratchy throat, sneezing, clear nasal discharge for 24 hours. Swallowing is a bit uncomfortable but eating and drinking normally. No difficulty breathing.',
      symptomDuration: '1 day',
      severity: 3,
      allergies: ['Dust mites'],
      preExistingConditions: ['None'],
      currentMedications: ['None'],
      vitals: {
        systolicBP: 116,
        diastolicBP: 74,
        heartRate: 68,
        oxygenSat: 99,
        temperature: 98.8,
        respiratoryRate: 14
      }
    }
  }
];
