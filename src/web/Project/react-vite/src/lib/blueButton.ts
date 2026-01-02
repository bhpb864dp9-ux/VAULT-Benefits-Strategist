/**
 * VAULT DEM Engine — Blue Button (My HealtheVet) best-effort parser
 *
 * Goal: extract a small set of identity fields from common Blue Button exports
 * (CCDA XML, plain text, or simple JSON exports) without any network calls.
 */
import type { VeteranIdentity } from '../types';

function normalizeDob(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;

  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const compact = v.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`;

  const us = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) {
    const mm = us[1].padStart(2, '0');
    const dd = us[2].padStart(2, '0');
    return `${us[3]}-${mm}-${dd}`;
  }

  return undefined;
}

function normalizePhone(value: string): string | undefined {
  const digits = value.replace(/[^\d]/g, '');
  if (digits.length < 10) return undefined;
  const d = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (d.length !== 10) return undefined;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function tryParseXml(text: string): Partial<VeteranIdentity> | null {
  try {
    if (!text.includes('<') || !text.includes('>')) return null;
    const doc = new DOMParser().parseFromString(text, 'text/xml');

    const given = doc.querySelector('patientRole patient name given')?.textContent?.trim() || '';
    const family = doc.querySelector('patientRole patient name family')?.textContent?.trim() || '';
    const name = [given, family].filter(Boolean).join(' ').trim();

    const birth = doc.querySelector('patientRole patient birthTime')?.getAttribute('value')?.trim()
      || '';
    const dob = normalizeDob(birth);

    const telecoms = Array.from(doc.querySelectorAll('patientRole telecom'))
      .map((n) => n.getAttribute('value') || '')
      .filter(Boolean);

    const emailRaw = telecoms.find((t) => t.toLowerCase().startsWith('mailto:'));
    const email = emailRaw ? emailRaw.replace(/^mailto:/i, '').trim() : undefined;

    const phoneRaw = telecoms.find((t) => t.toLowerCase().startsWith('tel:'));
    const phone = phoneRaw ? normalizePhone(phoneRaw.replace(/^tel:/i, '')) : undefined;

    const out: Partial<VeteranIdentity> = {};
    if (name) out.name = name;
    if (dob) out.dob = dob;
    if (email) out.email = email;
    if (phone) out.phone = phone;
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

function tryParseJson(text: string): Partial<VeteranIdentity> | null {
  try {
    const t = text.trim();
    if (!t.startsWith('{') && !t.startsWith('[')) return null;
    const data: any = JSON.parse(t);
    const patient = data?.patient || data?.beneficiary || data?.demographics || data?.[0]?.patient;
    const name =
      patient?.name?.full ||
      [patient?.name?.given, patient?.name?.family].filter(Boolean).join(' ') ||
      patient?.fullName ||
      patient?.patientName;

    const dob = normalizeDob(patient?.dob || patient?.dateOfBirth || patient?.birthDate || '');
    const email = patient?.email || patient?.contact?.email;
    const phone = normalizePhone(patient?.phone || patient?.contact?.phone || '');

    const out: Partial<VeteranIdentity> = {};
    if (typeof name === 'string' && name.trim()) out.name = name.trim();
    if (dob) out.dob = dob;
    if (typeof email === 'string' && email.trim()) out.email = email.trim();
    if (phone) out.phone = phone;
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

function tryParseText(text: string): Partial<VeteranIdentity> | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 400);

  const matchFirst = (patterns: RegExp[]) => {
    for (const line of lines) {
      for (const re of patterns) {
        const m = line.match(re);
        if (m?.[1]) return m[1].trim();
      }
    }
    return undefined;
  };

  const name = matchFirst([
    /^Patient Name:\s*(.+)$/i,
    /^Veteran Name:\s*(.+)$/i,
    /^Beneficiary Name:\s*(.+)$/i,
    /^Name:\s*(.+)$/i
  ]);

  const dobRaw = matchFirst([
    /^Date of Birth:\s*(.+)$/i,
    /^DOB:\s*(.+)$/i,
    /^Birth Date:\s*(.+)$/i
  ]);

  const email = matchFirst([/^Email:\s*(.+)$/i, /^E-mail:\s*(.+)$/i]);
  const phoneRaw = matchFirst([/^Phone:\s*(.+)$/i, /^Telephone:\s*(.+)$/i]);

  const out: Partial<VeteranIdentity> = {};
  if (name) out.name = name.replace(/\s{2,}/g, ' ');
  const dob = dobRaw ? normalizeDob(dobRaw) : undefined;
  if (dob) out.dob = dob;
  if (email) out.email = email;
  const phone = phoneRaw ? normalizePhone(phoneRaw) : undefined;
  if (phone) out.phone = phone;

  return Object.keys(out).length ? out : null;
}

export function extractIdentityFromBlueButton(content: string): Partial<VeteranIdentity> {
  return (
    tryParseXml(content) ||
    tryParseJson(content) ||
    tryParseText(content) ||
    {}
  );
}


