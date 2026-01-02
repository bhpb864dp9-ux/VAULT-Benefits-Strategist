/**
 * VAULT DEM Engine — VA Form Generator
 * Minimal PDF generation using pdf-lib for auto-filled VA forms
 */

import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';
import type { 
  VAFormId, 
  VAFormTemplate, 
  GeneratedForm, 
  ClaimData
} from '../types';

export const VA_FORM_TEMPLATES: Record<VAFormId, VAFormTemplate> = {
  '21-526EZ': { id: '21-526EZ', name: 'Application for Disability Compensation and Related Benefits', description: 'Primary form for initial claims and increased ratings', pages: 13, fields: ['veteranInfo', 'serviceInfo', 'disabilities'] },
  '21-4138': { id: '21-4138', name: 'Statement in Support of Claim', description: 'Personal statement supporting your claim', pages: 2, fields: ['veteranInfo', 'statementText', 'signature', 'date'] },
  '21-8940': { id: '21-8940', name: 'Application for Increased Compensation Based on Unemployability (TDIU)', description: 'For veterans unable to work due to service-connected disabilities', pages: 4, fields: ['veteranInfo', 'employmentHistory', 'educationHistory'] },
  '20-0995': { id: '20-0995', name: 'Decision Review Request: Supplemental Claim', description: 'Submit new and relevant evidence for a previously decided claim', pages: 2, fields: ['veteranInfo', 'priorDecision', 'newEvidence'] },
  '20-0996': { id: '20-0996', name: 'Decision Review Request: Higher-Level Review', description: 'Request a senior reviewer examine your existing decision', pages: 2, fields: ['veteranInfo', 'priorDecision'] },
  '21-2680': { id: '21-2680', name: 'Examination for Housebound Status or Aid and Attendance', description: 'For SMC-L, SMC-S, or housebound benefits', pages: 4, fields: ['veteranInfo', 'medicalConditions'] },
  '21-0781': { id: '21-0781', name: 'Statement in Support of Claim for PTSD', description: 'PTSD stressor statement form', pages: 4, fields: ['veteranInfo', 'stressorEvents'] },
  '21-0781a': { id: '21-0781a', name: 'Statement in Support of Claim for PTSD Secondary to Personal Assault', description: 'For MST and personal assault claims', pages: 4, fields: ['veteranInfo', 'incidentDetails'] },
  '21-22': { id: '21-22', name: "Appointment of Veterans Service Organization as Claimant's Representative", description: 'Appoint a VSO to represent you', pages: 2, fields: ['veteranInfo', 'vsoInfo'] },
  '21-22a': { id: '21-22a', name: "Appointment of Individual as Claimant's Representative", description: 'Appoint an attorney or claims agent', pages: 2, fields: ['veteranInfo', 'representativeInfo'] }
};

export async function generateFormPDF(formId: VAFormId, data: ClaimData): Promise<GeneratedForm> {
  const template = VA_FORM_TEMPLATES[formId];
  if (!template) throw new Error(`Unknown form: ${formId}`);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let completionPercentage = 20;
  switch (formId) {
    case '21-526EZ':
      completionPercentage = await generate526EZ(pdfDoc, font, boldFont, data);
      break;
    case '21-4138':
      completionPercentage = await generate4138(pdfDoc, font, boldFont, data);
      break;
    default:
      completionPercentage = await generateGeneric(pdfDoc, font, boldFont, formId, data);
  }

  const pdfBytes = await pdfDoc.save();
  // pdf-lib may return a Uint8Array backed by SharedArrayBuffer in some envs; normalize to ArrayBuffer-backed bytes
  const safeBytes = new Uint8Array(pdfBytes);
  const pdfBlob = new Blob([safeBytes], { type: 'application/pdf' });

  return {
    formId,
    formName: template.name,
    generatedAt: new Date().toISOString(),
    fields: extractFieldData(formId, data),
    completionPercentage,
    status: completionPercentage >= 90 ? 'ready' : completionPercentage >= 50 ? 'incomplete' : 'draft',
    pdfBlob
  };
}

export async function generateAllForms(data: ClaimData): Promise<GeneratedForm[]> {
  const formsToGenerate: VAFormId[] = ['21-526EZ', '21-4138'];

  const hasPTSD = data.selectedConditions.some(c => c.name.toLowerCase().includes('ptsd'));
  const hasMST = data.selectedConditions.some(c => c.name.toLowerCase().includes('mst') || c.name.toLowerCase().includes('military sexual trauma'));
  if (hasMST) formsToGenerate.push('21-0781a');
  else if (hasPTSD) formsToGenerate.push('21-0781');

  const maxRating = Math.max(...data.selectedConditions.map(c => Math.max(...(c.ratings || [0]))), 0);
  if (maxRating >= 40) formsToGenerate.push('21-8940');

  if (data.mission === 'SUPPLEMENTAL') formsToGenerate.push('20-0995');
  if (data.mission === 'HLR') formsToGenerate.push('20-0996');

  const forms: GeneratedForm[] = [];
  for (const id of formsToGenerate) {
    try {
      forms.push(await generateFormPDF(id, data));
    } catch (e) {
      console.error(`Failed to generate ${id}:`, e);
    }
  }
  return forms;
}

async function generate526EZ(doc: PDFDocument, font: PDFFont, bold: PDFFont, data: ClaimData): Promise<number> {
  let completed = 0;
  const total = 10;

  const page1 = doc.addPage([612, 792]);
  let y = 750;
  page1.drawText('VA FORM 21-526EZ', { x: 50, y, font: bold, size: 16 });
  page1.drawText('Application for Disability Compensation', { x: 50, y: y - 20, font, size: 12 });
  page1.drawText('DRAFT - GENERATED BY VAULT DEM ENGINE', { x: 50, y: y - 35, font, size: 10, color: rgb(0.8, 0, 0) });
  y -= 70;

  page1.drawText('SECTION I - VETERAN INFORMATION', { x: 50, y, font: bold, size: 12 });
  y -= 25;

  if (data.identity.name) {
    page1.drawText(`Name: ${data.identity.name}`, { x: 50, y, font, size: 11 });
    completed++;
  } else {
    page1.drawText('Name: _______________________________', { x: 50, y, font, size: 11 });
  }
  y -= 20;

  const ssnDisplay = data.identity.ssn ? `XXX-XX-${data.identity.ssn.slice(-4)}` : '___-__-____';
  page1.drawText(`SSN: ${ssnDisplay}`, { x: 50, y, font, size: 11 });
  if (data.identity.ssn) completed++;
  y -= 20;

  if (data.identity.dob) {
    page1.drawText(`Date of Birth: ${data.identity.dob}`, { x: 50, y, font, size: 11 });
    completed++;
  } else {
    page1.drawText('Date of Birth: ____/____/________', { x: 50, y, font, size: 11 });
  }

  const page2 = doc.addPage([612, 792]);
  y = 750;
  page2.drawText('SECTION III - DISABILITIES', { x: 50, y, font: bold, size: 12 });
  y -= 25;
  if (data.selectedConditions.length > 0) {
    data.selectedConditions.forEach((c, idx) => {
      if (y < 100) return;
      page2.drawText(`${idx + 1}. ${c.name}`, { x: 50, y, font, size: 11 });
      y -= 18;
    });
    completed++;
  }

  return Math.round((completed / total) * 100);
}

async function generate4138(doc: PDFDocument, font: PDFFont, bold: PDFFont, data: ClaimData): Promise<number> {
  const page = doc.addPage([612, 792]);
  let y = 750;
  let completed = 0;

  page.drawText('VA FORM 21-4138', { x: 50, y, font: bold, size: 16 });
  page.drawText('Statement in Support of Claim', { x: 50, y: y - 20, font, size: 12 });
  page.drawText('DRAFT - GENERATED BY VAULT DEM ENGINE', { x: 50, y: y - 35, font, size: 10, color: rgb(0.8, 0, 0) });
  y -= 70;

  if (data.identity.name) {
    page.drawText(`Veteran Name: ${data.identity.name}`, { x: 50, y, font, size: 11 });
    completed++;
  }
  y -= 30;

  page.drawText('STATEMENT:', { x: 50, y, font: bold, size: 12 });
  y -= 25;
  if (data.narrative) {
    page.drawText(data.narrative.slice(0, 900), { x: 50, y, font, size: 10, lineHeight: 14 });
    completed++;
  } else {
    page.drawText('[Personal statement will be inserted here]', { x: 50, y, font, size: 10, color: rgb(0.5, 0.5, 0.5) });
  }

  return Math.round((completed / 3) * 100);
}

async function generateGeneric(doc: PDFDocument, font: PDFFont, bold: PDFFont, formId: VAFormId, data: ClaimData): Promise<number> {
  const template = VA_FORM_TEMPLATES[formId];
  const page = doc.addPage([612, 792]);
  let y = 750;
  page.drawText(`VA FORM ${formId}`, { x: 50, y, font: bold, size: 16 });
  page.drawText(template.name, { x: 50, y: y - 20, font, size: 12 });
  page.drawText('DRAFT - GENERATED BY VAULT DEM ENGINE', { x: 50, y: y - 35, font, size: 10, color: rgb(0.8, 0, 0) });
  y -= 70;
  if (data.identity.name) page.drawText(`Veteran Name: ${data.identity.name}`, { x: 50, y, font, size: 11 });
  return 20;
}

function extractFieldData(formId: VAFormId, data: ClaimData): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    veteranName: data.identity.name,
    ssnLast4: data.identity.ssn?.slice(-4),
    dob: data.identity.dob,
    branch: data.identity.branch,
    conditions: data.selectedConditions.map(c => c.name),
    generatedAt: new Date().toISOString()
  };
  if (formId === '21-4138') fields.statement = data.narrative;
  return fields;
}

export function downloadForm(form: GeneratedForm): void {
  if (!form.pdfBlob) return;
  const url = URL.createObjectURL(form.pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${form.formId}_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default {
  generateFormPDF,
  generateAllForms,
  downloadForm,
  VA_FORM_TEMPLATES
};


