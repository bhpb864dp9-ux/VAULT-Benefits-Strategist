/**
 * VDIO Narrative Engine — Red Team Protocol
 * Phase 3: Active search for contradictory evidence to prevent denial.
 *
 * The Red Team Protocol inverts search queries to find risk keywords
 * that could be used against the veteran's claim.
 *
 * @vault-feature VDIO-RT-001 Contradiction Detection
 */
import type { OCRIndexEntry, RedTeamFlag } from '../stores/narrativeStore';

// ═══════════════════════════════════════════════════════════════════
// RISK KEYWORD DATABASE
// ═══════════════════════════════════════════════════════════════════

interface RiskKeyword {
  phrase: string;
  severity: 'warning' | 'critical';
  category: 'denial_language' | 'normal_finding' | 'credibility' | 'pre_existing' | 'non_compliance';
  mitigation: string;
}

const RISK_KEYWORDS: RiskKeyword[] = [
  // Denial Language
  { phrase: 'denies pain', severity: 'critical', category: 'denial_language', mitigation: 'Clarify that denial may have been situational or due to stoicism. Provide lay statements documenting pain at other times.' },
  { phrase: 'denies symptoms', severity: 'critical', category: 'denial_language', mitigation: 'Document current symptoms with specificity. Explain circumstances of prior denial.' },
  { phrase: 'no complaints', severity: 'warning', category: 'denial_language', mitigation: 'Absence of documented complaints ≠ absence of condition. Provide buddy statements and personal statement.' },
  { phrase: 'not service connected', severity: 'critical', category: 'denial_language', mitigation: 'If this is from a prior VA decision, address the specific reasoning with new evidence or argument.' },
  { phrase: 'less likely than not', severity: 'critical', category: 'denial_language', mitigation: 'Obtain a favorable nexus opinion that addresses the same medical question with supporting rationale.' },
  
  // Normal Findings
  { phrase: 'normal range of motion', severity: 'warning', category: 'normal_finding', mitigation: 'Document painful motion and functional loss per DeLuca factors. ROM may be normal but painful.' },
  { phrase: 'within normal limits', severity: 'warning', category: 'normal_finding', mitigation: 'Address whether testing captured flare-ups or worst-case presentation. Document variability.' },
  { phrase: 'unremarkable', severity: 'warning', category: 'normal_finding', mitigation: 'Explain what specific aspects are claimed as disabling despite "unremarkable" findings on imaging/exam.' },
  { phrase: 'negative for', severity: 'warning', category: 'normal_finding', mitigation: 'If relevant to your claim, explain why this test may not capture your condition or symptoms.' },
  { phrase: 'no abnormalities', severity: 'warning', category: 'normal_finding', mitigation: 'Some conditions (pain, mental health) don\'t show on standard imaging. Document functional impact.' },
  { phrase: 'no objective findings', severity: 'critical', category: 'normal_finding', mitigation: 'For conditions like pain or mental health, lay evidence and symptom documentation is crucial.' },
  
  // Credibility Attacks
  { phrase: 'malingering', severity: 'critical', category: 'credibility', mitigation: 'This is a serious accusation. Obtain records showing consistent symptom reporting over time.' },
  { phrase: 'exaggerating', severity: 'critical', category: 'credibility', mitigation: 'Provide objective evidence and consistent treatment history to counter this characterization.' },
  { phrase: 'symptom magnification', severity: 'critical', category: 'credibility', mitigation: 'Document consistent symptoms across multiple providers and settings.' },
  { phrase: 'inconsistent', severity: 'warning', category: 'credibility', mitigation: 'Explain any perceived inconsistencies (flare-ups, good days vs. bad days, etc.).' },
  { phrase: 'not credible', severity: 'critical', category: 'credibility', mitigation: 'Provide corroborating evidence from multiple sources (medical, lay, documentary).' },
  
  // Pre-existing Conditions
  { phrase: 'pre-existing', severity: 'critical', category: 'pre_existing', mitigation: 'If condition existed before service, focus on aggravation beyond natural progression (38 CFR 3.306).' },
  { phrase: 'prior to service', severity: 'warning', category: 'pre_existing', mitigation: 'Document that condition was asymptomatic before service or worsened due to service.' },
  { phrase: 'congenital', severity: 'warning', category: 'pre_existing', mitigation: 'Congenital defects can still be aggravated by service. Focus on superimposed injury or aggravation.' },
  { phrase: 'developmental', severity: 'warning', category: 'pre_existing', mitigation: 'Similar to congenital—document any service-related aggravation.' },
  
  // Non-Compliance
  { phrase: 'non-compliant', severity: 'warning', category: 'non_compliance', mitigation: 'Explain barriers to compliance (access, side effects, mental health). Document current compliance.' },
  { phrase: 'failed to attend', severity: 'warning', category: 'non_compliance', mitigation: 'Explain why appointments were missed and document subsequent compliance.' },
  { phrase: 'missed appointment', severity: 'warning', category: 'non_compliance', mitigation: 'Provide context for missed appointments and show pattern of engagement with care.' },
  { phrase: 'no follow up', severity: 'warning', category: 'non_compliance', mitigation: 'Document any barriers to follow-up care and current treatment status.' },
  
  // Resolution Language
  { phrase: 'resolved', severity: 'warning', category: 'denial_language', mitigation: 'Document that condition has recurred or never fully resolved despite prior notation.' },
  { phrase: 'improved', severity: 'warning', category: 'normal_finding', mitigation: 'Improvement does not mean cured. Document remaining limitations and symptoms.' },
  { phrase: 'stable', severity: 'warning', category: 'normal_finding', mitigation: 'Stable can still be disabling. Document functional impact of stable but chronic condition.' },
];

// ═══════════════════════════════════════════════════════════════════
// CONTRADICTION SCANNER
// ═══════════════════════════════════════════════════════════════════

/**
 * Extract surrounding context for a found keyword
 */
function extractContext(text: string, keyword: string, contextChars: number = 100): string {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);
  
  if (index === -1) return '';
  
  const start = Math.max(0, index - contextChars);
  const end = Math.min(text.length, index + keyword.length + contextChars);
  
  let context = text.slice(start, end).trim();
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';
  
  return context;
}

/**
 * Scan OCR index for contradictory evidence
 */
export function scanForContradictions(ocrIndex: OCRIndexEntry[]): RedTeamFlag[] {
  const flags: RedTeamFlag[] = [];
  const seenSnippets = new Set<string>();
  
  for (const entry of ocrIndex) {
    const lowerSnippet = entry.snippet.toLowerCase();
    
    for (const risk of RISK_KEYWORDS) {
      if (lowerSnippet.includes(risk.phrase.toLowerCase())) {
        // Avoid duplicate flags for same snippet
        const key = `${entry.source}_${entry.page}_${risk.phrase}`;
        if (seenSnippets.has(key)) continue;
        seenSnippets.add(key);
        
        // Extract context around the risk phrase
        const context = extractContext(entry.snippet, risk.phrase);
        
        flags.push({
          id: `rt_${entry.id}_${risk.phrase.replace(/\s/g, '_')}`,
          source: entry.source,
          page: entry.page,
          snippet: context || entry.snippet,
          keyword: risk.phrase,
          severity: risk.severity,
          mitigation: risk.mitigation,
        });
        
        // Mark the original entry as having a contradiction
        entry.riskFlag = 'contradiction';
      }
    }
  }
  
  // Sort by severity (critical first)
  return flags.sort((a, b) => {
    if (a.severity === 'critical' && b.severity === 'warning') return -1;
    if (a.severity === 'warning' && b.severity === 'critical') return 1;
    return 0;
  });
}

/**
 * Scan raw text for contradictions (before indexing)
 */
export function scanTextForContradictions(
  text: string,
  source: string,
  page: string = '—'
): RedTeamFlag[] {
  const flags: RedTeamFlag[] = [];
  const lowerText = text.toLowerCase();
  
  for (const risk of RISK_KEYWORDS) {
    if (lowerText.includes(risk.phrase.toLowerCase())) {
      const context = extractContext(text, risk.phrase);
      
      flags.push({
        id: `rt_${source}_${page}_${risk.phrase.replace(/\s/g, '_')}_${Date.now().toString(36)}`,
        source,
        page,
        snippet: context,
        keyword: risk.phrase,
        severity: risk.severity,
        mitigation: risk.mitigation,
      });
    }
  }
  
  return flags;
}

// ═══════════════════════════════════════════════════════════════════
// ANALYSIS & REPORTING
// ═══════════════════════════════════════════════════════════════════

/**
 * Get summary of red team findings
 */
export function getRedTeamSummary(flags: RedTeamFlag[]): {
  criticalCount: number;
  warningCount: number;
  totalCount: number;
  byCategory: Record<string, number>;
  riskLevel: 'low' | 'medium' | 'high';
} {
  const criticalCount = flags.filter(f => f.severity === 'critical').length;
  const warningCount = flags.filter(f => f.severity === 'warning').length;
  
  // Count by inferred category
  const byCategory: Record<string, number> = {};
  for (const flag of flags) {
    const risk = RISK_KEYWORDS.find(r => r.phrase === flag.keyword);
    if (risk) {
      byCategory[risk.category] = (byCategory[risk.category] || 0) + 1;
    }
  }
  
  // Determine overall risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (criticalCount >= 3 || (criticalCount >= 1 && warningCount >= 3)) {
    riskLevel = 'high';
  } else if (criticalCount >= 1 || warningCount >= 3) {
    riskLevel = 'medium';
  }
  
  return {
    criticalCount,
    warningCount,
    totalCount: flags.length,
    byCategory,
    riskLevel,
  };
}

/**
 * Generate mitigation strategy report
 */
export function generateMitigationReport(flags: RedTeamFlag[]): string {
  if (flags.length === 0) {
    return 'No contradictory evidence detected. Your evidence package appears clean.';
  }
  
  let report = `RED TEAM ANALYSIS REPORT
${'═'.repeat(50)}
${flags.length} potential issue(s) identified in your evidence.

`;
  
  // Group by severity
  const critical = flags.filter(f => f.severity === 'critical');
  const warning = flags.filter(f => f.severity === 'warning');
  
  if (critical.length > 0) {
    report += `⛔ CRITICAL ISSUES (${critical.length})
${'─'.repeat(50)}
These require immediate attention before filing:

`;
    for (const flag of critical) {
      report += `• "${flag.keyword}" found in ${flag.source}, Page ${flag.page}
  Context: "${flag.snippet.slice(0, 100)}..."
  Mitigation: ${flag.mitigation}

`;
    }
  }
  
  if (warning.length > 0) {
    report += `⚠️ WARNINGS (${warning.length})
${'─'.repeat(50)}
These should be addressed if possible:

`;
    for (const flag of warning) {
      report += `• "${flag.keyword}" found in ${flag.source}, Page ${flag.page}
  Mitigation: ${flag.mitigation}

`;
    }
  }
  
  report += `
${'═'.repeat(50)}
RECOMMENDED ACTIONS:
1. Address all CRITICAL issues before submitting
2. Prepare rebuttal statements for WARNING items
3. Consider obtaining additional favorable evidence
`;
  
  return report;
}

/**
 * Get risk keywords for reference
 */
export function getRiskKeywords(): RiskKeyword[] {
  return [...RISK_KEYWORDS];
}

export default {
  scanForContradictions,
  scanTextForContradictions,
  getRedTeamSummary,
  generateMitigationReport,
  getRiskKeywords,
};

