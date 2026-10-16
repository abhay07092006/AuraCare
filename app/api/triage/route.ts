import { NextRequest, NextResponse } from 'next/server';
import { runAIEvaluation } from '@/lib/triage-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      age,
      gender,
      chiefComplaint,
      symptomsDescription,
      symptomDuration,
      severity,
      allergies,
      preExistingConditions,
      currentMedications,
      vitals,
      uploadedReportsText,
      apiKey
    } = body;

    if (!chiefComplaint || !vitals) {
      return NextResponse.json(
        { error: 'Missing required triage input fields: chiefComplaint and vitals are mandatory' },
        { status: 400 }
      );
    }

    const evaluationResult = await runAIEvaluation(
      {
        name: name || 'Anonymous Patient',
        age: Number(age) || 35,
        gender: gender || 'unspecified',
        chiefComplaint,
        symptomsDescription: symptomsDescription || chiefComplaint,
        symptomDuration: symptomDuration || 'Acute onset',
        severity: Number(severity) || 5,
        allergies: allergies || [],
        preExistingConditions: preExistingConditions || [],
        currentMedications: currentMedications || [],
        vitals: {
          systolicBP: Number(vitals.systolicBP) || 120,
          diastolicBP: Number(vitals.diastolicBP) || 80,
          heartRate: Number(vitals.heartRate) || 75,
          oxygenSat: Number(vitals.oxygenSat) || 98,
          temperature: Number(vitals.temperature) || 98.6,
          respiratoryRate: Number(vitals.respiratoryRate) || 16
        },
        uploadedReportsText: uploadedReportsText || []
      },
      apiKey
    );

    return NextResponse.json({
      success: true,
      result: evaluationResult
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown clinical evaluation error';
    console.error('Triage API Error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal triage evaluation failure', details: errorMessage },
      { status: 500 }
    );
  }
}
