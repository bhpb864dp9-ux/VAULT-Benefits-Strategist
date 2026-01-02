/**
 * VAULT DEM Engine — Phase: Veteran Identity
 * Collect basic veteran information (stored locally only)
 *
 * @vault-feature VAULT-F-BB-001 Blue Button Upload → Identity Autofill
 * @vault-feature VAULT-F-PF-001 Identity Capture (Name/DOB/Contact/Service)
 * @vault-feature VAULT-F-VC-001 Representation (POA) capture
 * @vault-feature VAULT-F-VC-002 Battle Buddy Mode
 */

import { useBattleBuddy, useClaimStore, useIdentity, usePOA } from '../../stores/claimStore';
import { Lock, AlertTriangle, Upload, FileText, Users, FileSignature, Info } from 'lucide-react';
import type { POAInfo, VeteranIdentity } from '../../types';
import { extractIdentityFromBlueButton } from '../../lib/blueButton';
import DatePicker from '../UI/DatePicker';

const BRANCHES = [
  'Army',
  'Navy',
  'Air Force',
  'Marine Corps',
  'Coast Guard',
  'Space Force'
] as const;

const VSO_ORGS = [
  'American Legion',
  'Veterans of Foreign Wars (VFW)',
  'Disabled American Veterans (DAV)',
  'Vietnam Veterans of America (VVA)',
  'AMVETS',
  'Paralyzed Veterans of America (PVA)',
  'Military Order of the Purple Heart (MOPH)'
] as const;

export default function PhaseIdentity() {
  const { setIdentity, showToast, addAudit, setPOA, setBattleBuddy } = useClaimStore();
  const identity = useIdentity();
  const poa = usePOA();
  const battleBuddy = useBattleBuddy() || { enabled: false };

  const missingName = !identity.name?.trim();

  const handleChange = (field: keyof VeteranIdentity, value: string | boolean) => {
    setIdentity({ [field]: value } as Partial<VeteranIdentity>);
  };

  const handleBlueButtonUpload = async (file: File) => {
    try {
      showToast('Processing Blue Button file...', 'info');
      const content = await file.text();
      const extracted = extractIdentityFromBlueButton(content);

      const filled: string[] = [];
      const patch: Partial<VeteranIdentity> = {};

      const maybeFill = <K extends keyof VeteranIdentity>(key: K, value: VeteranIdentity[K] | undefined) => {
        if (value === undefined || value === null) return;
        const current = identity[key];
        const isEmpty =
          current === undefined ||
          current === null ||
          (typeof current === 'string' && current.trim().length === 0);
        if (isEmpty) {
          patch[key] = value;
          filled.push(String(key));
        }
      };

      maybeFill('name', extracted.name);
      maybeFill('dob', extracted.dob);
      maybeFill('email', extracted.email);
      maybeFill('phone', extracted.phone);

      if (filled.length) {
        setIdentity(patch);
        addAudit('Blue Button Upload', `${file.name} (filled: ${filled.join(', ')})`);
        showToast(`Blue Button loaded — auto-filled: ${filled.join(', ')}. Please verify.`, 'success');
      } else {
        addAudit('Blue Button Upload', `${file.name} (no autofill)`);
        showToast('Blue Button loaded. No new fields to autofill — please verify manually.', 'warning');
      }
    } catch {
      addAudit('Blue Button Upload', `${file.name} (error)`);
      showToast('Error parsing Blue Button file. Please enter information manually.', 'error');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Phase 2</span>
        <h2 className="text-3xl font-serif text-slate-50 mt-2">Veteran Information</h2>
        <p className="text-slate-400 mt-2">
          Basic information to pre-fill your VA forms. This data never leaves your device.
        </p>
      </div>

      <div className="mb-8 p-4 bg-success/5 border border-success/20 flex items-start gap-3">
        <Lock className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-success font-medium">100% Private & Offline</p>
          <p className="text-slate-400 mt-1">
            All information is stored in your browser&apos;s local storage only. We never transmit any data to external servers.
          </p>
        </div>
      </div>

      <div className="max-w-2xl space-y-8">
        <div className="card border-blue-500/30">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-blue-200 font-medium text-sm uppercase tracking-wider">
                Quick Start: Upload Blue Button Record
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Download your records from{' '}
                <a className="text-brass hover:underline" href="https://www.myhealth.va.gov" target="_blank" rel="noreferrer">
                  My HealtheVet
                </a>{' '}
                and upload to auto-fill your information.
              </p>

              <div className="mt-4">
                <label className="btn btn-va-blue w-full sm:w-auto">
                  <Upload className="w-4 h-4" />
                  UPLOAD BLUE BUTTON FILE
                  <input
                    type="file"
                    accept=".xml,.json,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      void handleBlueButtonUpload(f);
                      e.currentTarget.value = '';
                    }}
                  />
                </label>
                <p className="text-xs text-slate-500 mt-3">
                  Or enter your information manually below
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-3">
            <FileSignature className="w-5 h-5 text-brass mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-serif text-slate-100">Representation (POA) — optional</h3>
              <p className="text-sm text-slate-400 mt-1">
                If you plan to use a VSO/attorney/agent, capture it now so VA Form 21-22/21-22a can be generated consistently later.
              </p>

              <div className="mt-5 grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="label">Representative Type</label>
                  <select
                    className="input"
                    value={poa?.type || 'None'}
                    onChange={(e) => {
                      const type = e.target.value as POAInfo['type'];
                      if (type === 'None') {
                        setPOA(null);
                        addAudit('POA Set', 'None');
                        return;
                      }
                      setPOA({
                        type,
                        organizationName: type === 'VSO' ? (poa?.organizationName || '') : poa?.organizationName,
                        representativeName: poa?.representativeName,
                        email: poa?.email,
                        phone: poa?.phone
                      });
                    }}
                  >
                    <option value="None">No Representative (Self-Representation)</option>
                    <option value="VSO">Veterans Service Organization (VSO)</option>
                    <option value="Attorney">Accredited Attorney</option>
                    <option value="Agent">Accredited Claims Agent</option>
                    <option value="VBIO">VBIO / Professional</option>
                    <option value="Family">Family Member (with POA)</option>
                  </select>
                </div>

                {poa?.type === 'VSO' && (
                  <div className="form-group">
                    <label className="label">VSO Organization</label>
                    <select
                      className="input"
                      value={poa.organizationName || ''}
                      onChange={(e) => setPOA({ ...(poa || { type: 'VSO' }), organizationName: e.target.value })}
                    >
                      <option value="">Select organization…</option>
                      {VSO_ORGS.map((org) => (
                        <option key={org} value={org}>{org}</option>
                      ))}
                    </select>
                  </div>
                )}

                {poa?.type && poa.type !== 'None' && (
                  <>
                    <div className="form-group">
                      <label className="label">Representative Name (optional)</label>
                      <input
                        className="input"
                        placeholder="Full name"
                        value={poa?.representativeName || ''}
                        onChange={(e) => setPOA({ ...(poa as POAInfo), representativeName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Contact (optional)</label>
                      <input
                        className="input"
                        placeholder="Email or phone"
                        value={(poa?.email || poa?.phone) || ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          const looksEmail = v.includes('@');
                          setPOA({
                            ...(poa as POAInfo),
                            email: looksEmail ? v : undefined,
                            phone: looksEmail ? undefined : v
                          });
                        }}
                      />
                    </div>
                    <div className="md:col-span-2 text-xs text-slate-500 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
                      <span>
                        Tip: You can find accredited reps at{' '}
                        <a className="text-brass hover:underline" href="https://www.va.gov/vso/" target="_blank" rel="noreferrer">
                          VA.gov/VSO
                        </a>
                        . VAULT never transmits this info.
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-brass mt-0.5" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-lg font-serif text-slate-100">Battle Buddy Mode</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Let a spouse/caregiver/trusted friend assist with narratives and timelines — still 100% local.
                  </p>
                </div>
                <label className="inline-flex items-center gap-3 select-none">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">
                    {battleBuddy.enabled ? 'On' : 'Off'}
                  </span>
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded-lg border-slate-600 text-brass focus:ring-brass bg-slate-800"
                    checked={battleBuddy.enabled}
                    onChange={(e) => setBattleBuddy({ enabled: e.target.checked })}
                  />
                </label>
              </div>

              {battleBuddy.enabled && (
                <div className="mt-5 grid md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="label">Battle Buddy Name</label>
                    <input
                      className="input"
                      placeholder="Helper's name"
                      value={battleBuddy.name || ''}
                      onChange={(e) => setBattleBuddy({ name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Relationship</label>
                    <input
                      className="input"
                      placeholder="Spouse, caregiver, battle buddy, etc."
                      value={battleBuddy.relation || ''}
                      onChange={(e) => setBattleBuddy({ relation: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 text-xs text-slate-500">
                    This is for your internal workflow only. VAULT does not share or upload anything.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Full Legal Name *</label>
          <input
            type="text"
            className={`input-underline ${missingName ? 'border-b border-error' : ''}`}
            placeholder="As shown on your DD-214"
            value={identity.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            aria-invalid={missingName}
          />
          {missingName && (
            <p className="mt-2 text-xs text-warning">
              Required to continue to the next phase.
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="label">
            Social Security Number
            <span className="text-slate-500 font-normal ml-2">(optional)</span>
          </label>
          <div className="flex items-start gap-3">
            <input
              type="password"
              className="input-underline"
              placeholder="XXX-XX-XXXX"
              value={identity.ssn || ''}
              onChange={(e) => handleChange('ssn', e.target.value)}
              maxLength={11}
            />
          </div>
          <div className="mt-2 flex items-start gap-2 text-xs text-warning">
            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>
              Only enter if comfortable. Used for form pre-fill only. Consider entering just last 4 digits for your records.
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Date of Birth</label>
          <DatePicker
            value={identity.dob || ''}
            onChange={(v) => handleChange('dob', v)}
            max={new Date().toISOString().slice(0, 10)}
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-lg font-serif text-slate-100 mb-6">Service Information</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="label">Branch of Service</label>
              <select className="input" value={identity.branch || ''} onChange={(e) => handleChange('branch', e.target.value)}>
                <option value="">Select branch</option>
                {BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">MOS / Rating / AFSC</label>
              <input className="input" placeholder="e.g., 11B, HM, 3D0X1" value={identity.mos || ''} onChange={(e) => handleChange('mos', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="label">Entry Date</label>
              <input type="date" className="input" value={identity.entryDate || ''} onChange={(e) => handleChange('entryDate', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="label">Separation Date</label>
              <input type="date" className="input" value={identity.separationDate || ''} onChange={(e) => handleChange('separationDate', e.target.value)} />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-600 text-brass focus:ring-brass bg-slate-800"
                checked={identity.combatVeteran || false}
                onChange={(e) => handleChange('combatVeteran', e.target.checked)}
              />
              <span className="text-slate-300 group-hover:text-slate-100 transition-colors">
                I am a combat veteran (deployed to combat zone)
              </span>
            </label>
            <p className="mt-2 ml-8 text-xs text-slate-500">
              Combat veterans have relaxed evidence requirements for PTSD claims
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-lg font-serif text-slate-100 mb-6">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="your@email.com" value={identity.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Phone</label>
              <input type="tel" className="input" placeholder="(555) 555-5555" value={identity.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


