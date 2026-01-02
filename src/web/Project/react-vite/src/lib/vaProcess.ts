/**
 * VAULT DEM Engine — VA process transparency (offline, deterministic)
 */
import type { MissionType } from '../types';

export type WaitEstimate = {
  label: string;
  rangeDays: [number, number];
  notes: string;
};

export const VA_WAIT_TIME_ESTIMATES: Record<MissionType, WaitEstimate> = {
  INITIAL: { label: 'Initial Claim', rangeDays: [120, 180], notes: 'Typical end-to-end range. Complex claims can take longer.' },
  INCREASE: { label: 'Increased Rating', rangeDays: [60, 120], notes: 'Often faster if current evidence is strong and recent.' },
  SECONDARY: { label: 'Secondary Condition', rangeDays: [90, 150], notes: 'A medical nexus opinion can materially reduce delays.' },
  SUPPLEMENTAL: { label: 'Supplemental Claim', rangeDays: [60, 90], notes: 'New and relevant evidence should directly address prior denial reason.' },
  HLR: { label: 'Higher-Level Review', rangeDays: [60, 90], notes: 'No new evidence. Best for clear VA errors in the record.' },
  BDD: { label: 'Benefits Delivery at Discharge', rangeDays: [30, 90], notes: 'Designed to complete near separation when filed 180–90 days out.' }
};

export type ProcessStep = {
  name: string;
  duration: string;
  description: string;
};

export const VA_CLAIM_PROCESS_STEPS: ProcessStep[] = [
  { name: 'Claim Received', duration: '1–3 days', description: 'VA acknowledges receipt and assigns a processor.' },
  { name: 'Initial Review', duration: '7–14 days', description: 'Checks completeness; identifies needed evidence.' },
  { name: 'Evidence Gathering', duration: '30–60 days', description: 'Requests STRs/records; you may upload evidence.' },
  { name: 'C&P Scheduling', duration: '14–30 days', description: 'If needed, VA schedules C&P exam(s).' },
  { name: 'C&P Examination', duration: '1–2 hours', description: 'Examiner documents severity and service connection factors.' },
  { name: 'Rating Decision', duration: '14–30 days', description: 'RVSR assigns disability percentages.' },
  { name: 'Notification', duration: '7–10 days', description: 'Decision letter is generated and sent.' }
];

export function formatRangeDays([min, max]: [number, number]): string {
  const toWeeks = (d: number) => Math.round((d / 7) * 10) / 10;
  const toMonths = (d: number) => Math.round((d / 30) * 10) / 10;
  return `${min}–${max} days (~${toWeeks(min)}–${toWeeks(max)} weeks, ~${toMonths(min)}–${toMonths(max)} months)`;
}


