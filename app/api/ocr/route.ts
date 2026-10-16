import { NextRequest, NextResponse } from 'next/server';
import { UploadedDocument } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File | null;
    const documentType = (data.get('type') as string) || 'lab_report';

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    const fileName = file.name;
    const fileSize = `${(file.size / 1024).toFixed(1)} KB`;

    // Simulated intelligent OCR analysis based on filename and typical report signatures
    let extractedText = '';
    let extractedKeyValues: Record<string, string | number> = {};
    let findings: string[] = [];

    const lowerName = fileName.toLowerCase();

    if (lowerName.includes('trop') || lowerName.includes('card') || lowerName.includes('ecg')) {
      extractedText = 'SEROLOGY PANEL: High-Sensitivity Troponin-I: 2.15 ng/mL (Ref < 0.04 ng/mL). Creatine Kinase MB: 38 U/L. ECG rhythm demonstrates ST segment depression in leads V4-V6 with T-wave inversion.';
      extractedKeyValues = {
        'Troponin I': '2.15 ng/mL (CRITICAL HIGH)',
        'CK-MB': '38 U/L (ELEVATED)',
        'ECG Finding': 'ST depression V4-V6',
        'Serum K+': '4.2 mEq/L (Normal)'
      };
      findings = [
        'Marked cardiac Troponin I elevation indicates ongoing myocardial ischemic injury',
        'ECG shows subendocardial ischemic pattern'
      ];
    } else if (lowerName.includes('xray') || lowerName.includes('chest') || lowerName.includes('lung') || lowerName.includes('cxr')) {
      extractedText = 'CHEST RADIOGRAPHY REPORT: Patchy airspace consolidation identified in the right mid and lower lung zones. Costophrenic angles preserved. Heart size normal. Impression: Lobar bronchopneumonia.';
      extractedKeyValues = {
        'Lung Fields': 'Consolidation in RML / RLL',
        'Pleural Space': 'No overt pneumothorax or large effusion',
        'Impression': 'Acute Bacterial Pneumonia'
      };
      findings = [
        'Right lung consolidation compatible with bacterial pneumonia',
        'Normal cardiac silhouette'
      ];
    } else if (lowerName.includes('blood') || lowerName.includes('cbc') || lowerName.includes('panel')) {
      extractedText = 'COMPLETE BLOOD COUNT: WBC: 15.6 x 10^3/uL (Ref: 4.0-11.0) HIGH. Platelet Count: 210 x 10^3/uL. Hemoglobin: 12.8 g/dL. CRP: 64 mg/L. BUN: 18 mg/dL. Creatinine: 0.9 mg/dL.';
      extractedKeyValues = {
        'WBC': '15.6 x 10^3/uL (ELEVATED)',
        'C-Reactive Protein': '64 mg/L (HIGH)',
        'Hemoglobin': '12.8 g/dL (Normal)',
        'Platelets': '210 x 10^3/uL (Normal)'
      };
      findings = [
        'Leukocytosis with acute inflammatory response',
        'Significantly elevated C-reactive protein'
      ];
    } else {
      extractedText = `DOCUMENT OCR SCAN: Extracted from ${fileName}. Patient diagnostic metrics within observed clinical thresholds. No acute toxicological or biochemical crisis flagged.`;
      extractedKeyValues = {
        'Document Processed': fileName,
        'Status': 'Verified OCR Digitize',
        'Quality Score': '98.5%'
      };
      findings = [
        'Clinical document parsed successfully',
        'Standard anatomical/biochemical reference range match'
      ];
    }

    const docResult: UploadedDocument = {
      id: `doc-${Date.now().toString().slice(-5)}`,
      name: fileName,
      type: documentType as UploadedDocument['type'],
      size: fileSize,
      extractedText,
      extractedKeyValues,
      findings,
      uploadedAt: 'Just now'
    };

    return NextResponse.json({
      success: true,
      document: docResult
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'File parsing error';
    return NextResponse.json({ error: 'Failed to process document OCR', details: message }, { status: 500 });
  }
}
