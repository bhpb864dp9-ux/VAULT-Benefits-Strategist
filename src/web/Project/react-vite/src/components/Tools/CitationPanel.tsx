/**
 * VAULT DEM Engine — Citation Panel
 * Real-time display of legal statutes, VA policy, and VBA policy
 *
 * @vault-feature VAULT-F-LC-002 Real-time Citation Display
 */
import { useMemo } from 'react';
import { Scale, BookOpen, ExternalLink, Gavel, Building2 } from 'lucide-react';
import {
  type LegalCitation,
  type EvidenceRecord,
  getCitationsForEvidenceType,
  getCitationsForCondition,
  CONGRESSIONAL_STATUTES,
  CFR_REGULATIONS
} from '../../lib/legalCitations';

interface CitationPanelProps {
  /** Evidence records being used */
  evidenceRecords?: EvidenceRecord[];
  /** Condition names or IDs */
  conditions?: string[];
  /** Additional manual citations to show */
  additionalCitations?: LegalCitation[];
  /** Title for the panel */
  title?: string;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

function CitationBadge({ type }: { type: LegalCitation['type'] }) {
  const config = {
    statute: { icon: Gavel, label: 'Statute', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    regulation: { icon: Scale, label: 'CFR', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    policy: { icon: Building2, label: 'VBA', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    case_law: { icon: BookOpen, label: 'Case', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
  };
  const { icon: Icon, label, color } = config[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function CitationCard({ citation, compact }: { citation: LegalCitation; compact?: boolean }) {
  return (
    <div className={`group p-3 bg-slate-900/40 border border-slate-700/50 rounded-xl backdrop-blur-sm transition-all hover:border-slate-600/70 ${compact ? 'p-2' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CitationBadge type={citation.type} />
            <span className="text-xs text-slate-500 truncate">{citation.shortTitle}</span>
          </div>
          <h4 className={`font-medium text-slate-200 ${compact ? 'text-xs' : 'text-sm'}`}>
            {citation.title}
          </h4>
          {!compact && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {citation.summary}
            </p>
          )}
        </div>
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 text-slate-500 hover:text-brass transition-colors rounded-lg hover:bg-slate-800/50"
            aria-label={`Open ${citation.reference} in new tab`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function CitationPanel({
  evidenceRecords = [],
  conditions = [],
  additionalCitations = [],
  title = 'Legal Authority',
  compact = false
}: CitationPanelProps) {
  const citations = useMemo(() => {
    const allCitations: LegalCitation[] = [];
    const seen = new Set<string>();

    // Get citations from evidence records
    evidenceRecords.forEach(record => {
      getCitationsForEvidenceType(record.type).forEach(c => {
        if (!seen.has(c.id)) {
          seen.add(c.id);
          allCitations.push(c);
        }
      });
    });

    // Get citations from conditions
    conditions.forEach(condition => {
      getCitationsForCondition(condition).forEach(c => {
        if (!seen.has(c.id)) {
          seen.add(c.id);
          allCitations.push(c);
        }
      });
    });

    // Add any additional citations
    additionalCitations.forEach(c => {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        allCitations.push(c);
      }
    });

    // Sort by type: statutes first, then regulations, then policy
    const typeOrder = { statute: 0, regulation: 1, policy: 2, case_law: 3 };
    return allCitations.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
  }, [evidenceRecords, conditions, additionalCitations]);

  const grouped = useMemo(() => ({
    statutes: citations.filter(c => c.type === 'statute'),
    regulations: citations.filter(c => c.type === 'regulation'),
    policies: citations.filter(c => c.type === 'policy')
  }), [citations]);

  if (citations.length === 0) {
    // Show default important citations if none are selected
    return (
      <div className="glass-panel">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-brass" />
          <h3 className={`font-medium text-slate-200 ${compact ? 'text-sm' : 'text-lg'}`}>
            {title}
          </h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Add conditions or upload evidence to see applicable legal citations.
        </p>
        <div className="space-y-2">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Core Legal Framework</div>
          <CitationCard citation={CONGRESSIONAL_STATUTES.find(c => c.id === 'USC-1110')!} compact={compact} />
          <CitationCard citation={CFR_REGULATIONS.find(c => c.id === 'CFR-3.303')!} compact={compact} />
          <CitationCard citation={CONGRESSIONAL_STATUTES.find(c => c.id === 'USC-5107')!} compact={compact} />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-brass" />
          <h3 className={`font-medium text-slate-200 ${compact ? 'text-sm' : 'text-lg'}`}>
            {title}
          </h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">
          {citations.length} citation{citations.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {grouped.statutes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gavel className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">
                Congressional Law (38 U.S.C.)
              </span>
            </div>
            <div className="space-y-2">
              {grouped.statutes.map(c => (
                <CitationCard key={c.id} citation={c} compact={compact} />
              ))}
            </div>
          </div>
        )}

        {grouped.regulations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                VA Regulations (38 CFR)
              </span>
            </div>
            <div className="space-y-2">
              {grouped.regulations.map(c => (
                <CitationCard key={c.id} citation={c} compact={compact} />
              ))}
            </div>
          </div>
        )}

        {grouped.policies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">
                VBA Policy (M21-1)
              </span>
            </div>
            <div className="space-y-2">
              {grouped.policies.map(c => (
                <CitationCard key={c.id} citation={c} compact={compact} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500">
          These citations support your claim and should be referenced in supporting documentation.
          All features in VAULT are backed by applicable law and VA/VBA policy.
        </p>
      </div>
    </div>
  );
}

export { CitationCard, CitationBadge };

