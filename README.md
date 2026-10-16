# 🩺 AuraCare — AI-Powered Smart Triage & Remote Patient Monitoring

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-0f766e?style=for-the-badge&logo=github)](https://abhay07092006.github.io/AuraCare/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/abhay07092006/AuraCare)
[![Next.js 14](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

> **Live Public URL:** **[https://abhay07092006.github.io/AuraCare/](https://abhay07092006.github.io/AuraCare/)**  
> **Source Repository:** **[https://github.com/abhay07092006/AuraCare](https://github.com/abhay07092006/AuraCare)**

---

## 🌟 Overview & Problem Statement
Emergency rooms and healthcare clinics are facing unprecedented patient backlogs, causing prolonged wait times, clinician burnout, and delayed interventions for time-critical conditions (such as Acute Coronary Syndrome, Septic Shock, and Stroke). 

**AuraCare** accelerates medical triage through:
1. **Multimodal Patient Intake:** Low-friction symptom entry via multilingual Speech-to-Text (Web Speech API) and vision OCR for lab reports and prescriptions.
2. **AI Risk Assessment Engine:** Computes an Emergency Severity Index (ESI) & National Early Warning Score (NEWS2) to assign an **Urgency Priority Score (0–100)** and categorizes patients into **CRITICAL (RED)**, **MODERATE (YELLOW)**, or **STABLE (GREEN)**.
3. **Doctor Clinical Triage Dashboard:** Real-time priority queue sorting patients algorithmically by urgency, interactive patient profile drawers, automated pharmacovigilance (drug-drug interaction checking), and 1-click digital E-Prescriptions with printable formatting.
4. **Hospital Resource & Surge Management:** Real-time bed and ventilator utilization tracker, interactive capacity sliders, hourly emergency intake charts, and ED surge alerts.

---

## 🏗️ Architecture & Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React Icons, Canvas Confetti.
- **Backend / APIs:** Next.js Serverless Route Handlers:
  - `/api/triage`: Clinical risk evaluation endpoint returning structured JSON.
  - `/api/ocr`: Vision document parsing endpoint for lab chemistry and radiology reports.
- **AI Triage Engine (`/lib/triage-engine.ts`):**
  - **OpenAI GPT-4o / GPT-4o-mini:** Zero-temperature structured JSON schema mode for deep reasoning.
  - **Clinical Heuristics Fallback Engine:** Built-in zero-config emergency triage engine based on ESI & NEWS2 protocols. Guarantees 100% uptime even without an API key during live demos.
- **State Management (`/lib/context.tsx`):** React Context API with LocalStorage synchronization for seamless data persistence across all patient, doctor, and admin portals.

---

## 🚀 Getting Started

### 1. Set Active Workspace
Ensure your workspace is pointed to:
```
C:\Users\LENOVO\.gemini\antigravity\scratch\auracare
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

*(The production build is pre-compiled and can also be served via `npm run start -- -p 3000`)*

---

## 🔑 AI Configuration (Optional)
AuraCare operates out-of-the-box with full fidelity without requiring an API key. 
To enable live GPT-4o inference:
1. Click the **"AI Engine"** button in the top navigation bar.
2. Paste your OpenAI API Key (`sk-...`).
3. Or add `OPENAI_API_KEY=sk-...` into a `.env.local` file.

---

## 🏥 Clinical Demo Walkthrough for Judges

### Scenario A: Critical Cardiac Case (RED Alert)
1. Navigate to **Patient Intake** (`/patient`).
2. Click the top demo preset: **"🚨 Critical Red: Cardiac STEMI"**.
3. Notice that vitals automatically populate (BP 86/54, HR 114, SpO2 88%), and a Troponin I lab report is attached.
4. Click **"Run AI Clinical Risk Assessment"**.
5. The system computes **Urgency Score: 98–99**, categorizes as **CRITICAL (RED) - ESI Level 1**, flags cardiogenic shock risk, and outlines catheterization protocols.
6. Click **"Open in Doctor Triage Dashboard"** (`/doctor`).
7. Notice the patient is pinned to the top of the queue with an audible chime and pulsing crimson badge.
8. Click **"Review"** to inspect the Patient Drawer, review drug interactions, and click **"Escalate to ER"** or **"Generate E-Prescription"**.

### Scenario B: Moderate Lobar Pneumonia (YELLOW Alert)
1. Click **"⚠️ Moderate Yellow: Pneumonia"** preset in Patient Intake.
2. Vitals show SpO2 92%, Temp 102.6°F, with CXR consolidation.
3. Evaluates to **MODERATE (YELLOW) - ESI Level 3**, Urgency ~68.
4. In Doctor Dashboard, review CXR findings and approve acute observation admission.

### Scenario C: Mild Outpatient URI (GREEN Alert)
1. Click **"🟢 Stable Green: Mild Viral"** preset.
2. Evaluates to **STABLE (GREEN) - ESI Level 5**, Urgency ~16.
3. Open Patient Drawer and click **"Generate E-Prescription"** to issue and print digital medication orders.

### Scenario D: Hospital Surge Management
1. Navigate to **Admin & Capacity** (`/admin`).
2. Adjust General Bed and ICU occupancy using the `+` / `-` controls.
3. Notice that if ICU or ventilator capacity crosses 80%, the **"Emergency Department Surge Protocol"** activates.

---

## 📂 File Structure

```
auracare/
├── app/
│   ├── page.tsx                  # Home landing page with live telemetry & portal gateways
│   ├── layout.tsx                # Root layout with Navbar & AuraCareProvider
│   ├── globals.css               # Clinical styling, scrollbars & print styles
│   ├── patient/
│   │   └── page.tsx              # 5-step intake, speech recognition & AI result summary
│   ├── doctor/
│   │   └── page.tsx              # Triage queue, list/kanban view & search/filters
│   ├── admin/
│   │   └── page.tsx              # Bed/ventilator telemetry & case distribution charts
│   └── api/
│       ├── triage/route.ts       # Structured JSON clinical triage evaluation API
│       └── ocr/route.ts          # Lab report vision OCR extraction API
├── components/
│   ├── layout/
│   │   └── Navbar.tsx            # Navigation header, emergency red banner & controls
│   ├── doctor/
│   │   ├── PatientDrawer.tsx     # Slide-in deep-dive clinical profile
│   │   └── PrescriptionModal.tsx # Digital e-prescription generator & printer
│   └── ui/
│       ├── TriageBadge.tsx       # Glowing pulse red/yellow/green badges
│       ├── UrgencyMeter.tsx      # Visual urgency score (0-100) meter
│       ├── VitalsCard.tsx        # Bedside vitals cards with normal/abnormal highlights
│       ├── VoiceInput.tsx        # Web Speech API real-time dictation in 6 languages
│       └── ApiKeyModal.tsx       # AI engine settings modal
├── lib/
│   ├── ai-prompts.ts             # System prompts for ESI triage, pharmacovigilance & OCR
│   ├── triage-engine.ts          # NEWS2 scoring, drug checks, GPT & fallback logic
│   ├── mock-data.ts              # Realistic pre-seeded emergency patients & lab tests
│   └── context.tsx               # State management with LocalStorage sync
└── types/
    └── index.ts                  # TypeScript definitions for Vitals, Patient, Triage
```

---

## 🛡️ Clinical Triage Standards Implemented
- **Emergency Severity Index (ESI):** 5-tier triage algorithm distinguishing acuity and anticipated resource utilization.
- **National Early Warning Score 2 (NEWS2):** Standardized scoring of physiological parameters (Respiration, SpO2, Systolic BP, Heart Rate, Temperature).
- **Pharmacovigilance Checking:** Real-time screening for dangerous interactions (e.g., Warfarin + NSAID bleeding risks, ACE-I + K-sparing hyperkalemia, Metformin + radiocontrast).

---

## 📄 License
MIT License. Created for healthcare innovation and emergency relief.
