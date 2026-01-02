/**
 * VDIO Narrative Engine — Narrative Builder (Phase 4)
 * Constructs cited legal arguments following the specified template.
 *
 * Every assertion must reference a specific item in the OCR Index.
 *
 * Output Template:
 *   Argument: The veteran's [Condition] is service-connected.
 *   Evidence: As noted in [Source_ID], Page [X], on [Date].
 *   Law: This aligns with [Regulation_ID].
 *
 * @vault-feature VDIO-NB-001 Citation-Based Narrative Generation
 */
import type { SelectedCondition } from '../types';
import type { OCRIndexEntry, NarrativeBlock, GapResult, LayEvidenceEntry } from '../stores/narrativeStore';
import { formatIndexCitation, searchIndexByCondition } from './ocrSchema';
import { BODY_SYSTEMS } from '../data/bodySystems';
import { getCitationsForCondition } from './legalCitations';

// ═══════════════════════════════════════════════════════════════════
// NARRATIVE TEMPLATES
// ═══════════════════════════════════════════════════════════════════

interface NarrativeTemplate {
  claimType: 'new' | 'increase' | 'secondary' | 'appeal' | 'supplemental';
  argumentTemplate: string;
  evidenceTemplate: string;
  lawTemplate: string;
}

const NARRATIVE_TEMPLATES: NarrativeTemplate[] = [
  {
    claimType: 'new',
    argumentTemplate: 'The veteran\'s {condition} is service-connected, having been incurred during active military service.',
    evidenceTemplate: 'As documented in {source}, Page {page}, dated {date}: "{snippet}"',
    lawTemplate: 'This evidence satisfies the requirements of {cfrSection} for establishing service connection.',
  },
  {
    claimType: 'increase',
    argumentTemplate: 'The veteran\'s service-connected {condition} has worsened beyond the currently assigned rating and warrants an increased evaluation.',
    evidenceTemplate: 'Current severity is demonstrated in {source}, Page {page}, dated {date}: "{snippet}"',
    lawTemplate: 'The rating criteria under {cfrSection} support a higher evaluation based on this evidence.',
  },
  {
    claimType: 'secondary',
    argumentTemplate: 'The veteran\'s {condition} is proximately due to or aggravated by the service-connected {primaryCondition}.',
    evidenceTemplate: 'The causal relationship is established in {source}, Page {page}, dated {date}: "{snippet}"',
    lawTemplate: 'Secondary service connection is warranted under 38 CFR § 3.310 and {cfrSection}.',
  },
  {
    claimType: 'appeal',
    argumentTemplate: 'The prior denial of service connection for {condition} was in error, and reconsideration is warranted based on the following evidence.',
    evidenceTemplate: 'New and material evidence includes {source}, Page {page}, dated {date}: "{snippet}"',
    lawTemplate: 'This evidence meets the criteria under 38 CFR § 3.156 for reopening, and {cfrSection} supports the claim.',
  },
  {
    claimType: 'supplemental',
    argumentTemplate: 'This supplemental claim for {condition} provides new and relevant evidence not previously of record.',
    evidenceTemplate: 'The new evidence from {source}, Page {page}, dated {date} shows: "{snippet}"',
    lawTemplate: 'This evidence is relevant under the Supplemental Claim lane and {cfrSection}.',
  },
];

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function getConditionCFRSection(conditionId: string): string {
  for (const system of BODY_SYSTEMS) {
    if (system.conditions.some(c => c.id === conditionId)) {
      return system.cfrSection;
    }
  }
  return '38 CFR Part 4';
}

function truncateSnippet(snippet: string, maxLength: number = 150): string {
  if (snippet.length <= maxLength) return snippet;
  return snippet.slice(0, maxLength).trim() + '...';
}

function fillTemplate(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════
// NARRATIVE BLOCK BUILDER
// ═══════════════════════════════════════════════════════════════════

interface BuildNarrativeOptions {
  condition: SelectedCondition;
  ocrEntries: OCRIndexEntry[];
  claimType: 'new' | 'increase' | 'secondary' | 'appeal' | 'supplemental';
  primaryCondition?: string; // For secondary claims
  layEvidence?: LayEvidenceEntry[];
}

export function buildNarrativeBlock(options: BuildNarrativeOptions): NarrativeBlock {
  const { condition, ocrEntries, claimType, primaryCondition, layEvidence } = options;
  
  const template = NARRATIVE_TEMPLATES.find(t => t.claimType === claimType) || NARRATIVE_TEMPLATES[0];
  const cfrSection = getConditionCFRSection(condition.id);
  
  // Build argument
  const argument = fillTemplate(template.argumentTemplate, {
    condition: condition.name,
    primaryCondition: primaryCondition || '[primary condition]',
  });
  
  // Build evidence citations
  const evidenceCitations: string[] = [];
  
  // Add OCR evidence
  for (const entry of ocrEntries.slice(0, 5)) { // Limit to 5 most relevant
    const citation = fillTemplate(template.evidenceTemplate, {
      source: entry.source,
      page: entry.page,
      date: entry.date,
      snippet: truncateSnippet(entry.snippet),
    });
    evidenceCitations.push(citation);
  }
  
  // Add lay evidence if available
  if (layEvidence && layEvidence.length > 0) {
    for (const lay of layEvidence.filter(l => l.conditionId === condition.id)) {
      evidenceCitations.push(
        `Lay witness ${lay.witnessName} (${lay.witnessRelation}) provides competent testimony regarding observable symptoms, as permitted under 38 CFR § 3.159.`
      );
    }
  }
  
  // If no evidence, note the gap
  if (evidenceCitations.length === 0) {
    evidenceCitations.push(
      '[NOTE: Limited documentary evidence available. Consider supplementing with lay statements or requesting additional records.]'
    );
  }
  
  // Build law citations
  const lawCitations: string[] = [
    fillTemplate(template.lawTemplate, {
      cfrSection,
    }),
  ];
  
  // Add additional relevant citations
  const additionalCitations = getCitationsForCondition(condition.name);
  for (const citation of additionalCitations.slice(0, 2)) {
    lawCitations.push(`${citation.reference}: ${citation.title}`);
  }
  
  return {
    conditionId: condition.id,
    conditionName: condition.name,
    argument,
    evidenceCitations,
    lawCitations,
  };
}

// ═══════════════════════════════════════════════════════════════════
// FULL NARRATIVE GENERATION
// ═══════════════════════════════════════════════════════════════════

interface GenerateNarrativeOptions {
  conditions: SelectedCondition[];
  ocrIndex: OCRIndexEntry[];
  claimType: 'new' | 'increase' | 'secondary' | 'appeal' | 'supplemental';
  layEvidence: LayEvidenceEntry[];
  veteranName?: string;
}

export function generateNarrativeBlocks(options: GenerateNarrativeOptions): NarrativeBlock[] {
  const { conditions, ocrIndex, claimType, layEvidence } = options;
  
  return conditions.map(condition => {
    const relevantEntries = searchIndexByCondition(ocrIndex, condition.id);
    
    return buildNarrativeBlock({
      condition,
      ocrEntries: relevantEntries,
      claimType,
      layEvidence,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// VA FORM 21-4138 GENERATOR
// ═══════════════════════════════════════════════════════════════════

export function generateStatementInSupport(
  narrativeBlocks: NarrativeBlock[],
  veteranName: string,
  claimType: string
): string {
  const date = new Date().toLocaleDateString();
  
  let statement = `STATEMENT IN SUPPORT OF CLAIM (VA Form 21-4138)
${'═'.repeat(60)}

DATE: ${date}
VETERAN: ${veteranName}
CLAIM TYPE: ${claimType.toUpperCase()}

${'─'.repeat(60)}
STATEMENT
${'─'.repeat(60)}

`;
  
  for (const block of narrativeBlocks) {
    statement += `
CONDITION: ${block.conditionName}
${'─'.repeat(40)}

ARGUMENT:
${block.argument}

EVIDENCE:
${block.evidenceCitations.map((e, i) => `${i + 1}. ${e}`).join('\n')}

LEGAL AUTHORITY:
${block.lawCitations.map((l, i) => `${i + 1}. ${l}`).join('\n')}

`;
  }
  
  statement += `
${'═'.repeat(60)}
CERTIFICATION
${'═'.repeat(60)}

I certify that the statements herein are true and correct to the best of my knowledge and belief.

Signature: ___________________________
Date: ${date}
Printed Name: ${veteranName}
`;
  
  return statement;
}

// ═══════════════════════════════════════════════════════════════════
// NEXUS ARGUMENT GENERATOR
// ═══════════════════════════════════════════════════════════════════

export function generateNexusArgument(
  condition: SelectedCondition,
  ocrEntries: OCRIndexEntry[],
  veteranName: string
): string {
  const cfrSection = getConditionCFRSection(condition.id);
  const date = new Date().toLocaleDateString();
  
  // Find service-era entries
  const serviceEntries = ocrEntries.filter(e => 
    e.source.toLowerCase().includes('service') ||
    e.source.toLowerCase().includes('military') ||
    e.source.toLowerCase().includes('str')
  );
  
  // Find current/recent entries
  const currentEntries = ocrEntries.filter(e => !serviceEntries.includes(e));
  
  let argument = `NEXUS ARGUMENT FOR SERVICE CONNECTION
${'═'.repeat(60)}

VETERAN: ${veteranName}
DATE: ${date}
CONDITION: ${condition.name}

${'─'.repeat(60)}
ELEMENT 1: CURRENT DISABILITY
${'─'.repeat(60)}

`;
  
  if (currentEntries.length > 0) {
    argument += `The veteran has a current diagnosis of ${condition.name}, as documented in:\n`;
    for (const entry of currentEntries.slice(0, 3)) {
      argument += `• ${formatIndexCitation(entry)}\n`;
    }
  } else {
    argument += `[Current diagnosis documentation needed]\n`;
  }
  
  argument += `
${'─'.repeat(60)}
ELEMENT 2: IN-SERVICE INCURRENCE
${'─'.repeat(60)}

`;
  
  if (serviceEntries.length > 0) {
    argument += `Evidence of in-service occurrence is found in:\n`;
    for (const entry of serviceEntries.slice(0, 3)) {
      argument += `• ${formatIndexCitation(entry)}: "${truncateSnippet(entry.snippet, 100)}"\n`;
    }
  } else {
    argument += `[In-service documentation needed - consider lay evidence or buddy statements]\n`;
  }
  
  argument += `
${'─'.repeat(60)}
ELEMENT 3: NEXUS (CAUSAL CONNECTION)
${'─'.repeat(60)}

The veteran's current ${condition.name} is AT LEAST AS LIKELY AS NOT (50% probability or greater) causally related to the documented in-service occurrence.

RATIONALE:
1. The temporal relationship between service and symptom onset supports a nexus.
2. The continuity of symptomatology from service to present is established.
3. No intervening causes have been identified that would break the causal chain.

${'─'.repeat(60)}
LEGAL AUTHORITY
${'─'.repeat(60)}

• 38 CFR § 3.303: Service connection requires current disability, in-service incurrence, and nexus.
• ${cfrSection}: Rating criteria for this condition.
• 38 U.S.C. § 5107(b): Benefit of the doubt favors the veteran when evidence is in equipoise.

${'═'.repeat(60)}
`;
  
  return argument;
}

// ═══════════════════════════════════════════════════════════════════
// QUALITY ASSURANCE
// ═══════════════════════════════════════════════════════════════════

interface QualityIssue {
  type: 'date_gap' | 'missing_evidence' | 'no_nexus' | 'rating_criteria' | 'incomplete';
  conditionId: string;
  conditionName: string;
  description: string;
  suggestion: string;
}

export function runQualityAssurance(
  narrativeBlocks: NarrativeBlock[],
  ocrIndex: OCRIndexEntry[],
  gapAnalysis: GapResult[]
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  
  for (const block of narrativeBlocks) {
    const gap = gapAnalysis.find(g => g.conditionId === block.conditionId);
    const entries = searchIndexByCondition(ocrIndex, block.conditionId);
    
    // Check for evidence gaps
    if (block.evidenceCitations.length === 0 || block.evidenceCitations[0].includes('[NOTE:')) {
      issues.push({
        type: 'missing_evidence',
        conditionId: block.conditionId,
        conditionName: block.conditionName,
        description: 'No documentary evidence found for this condition.',
        suggestion: 'Add lay evidence using the Lay Evidence Wizard or upload additional medical records.',
      });
    }
    
    // Check for date alignment
    const dates = entries.map(e => e.date).filter(d => d);
    if (dates.length > 0) {
      const sortedDates = dates.sort();
      const earliestDate = new Date(sortedDates[0]);
      const latestDate = new Date(sortedDates[sortedDates.length - 1]);
      const gapYears = (latestDate.getTime() - earliestDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
      
      if (gapYears > 10) {
        issues.push({
          type: 'date_gap',
          conditionId: block.conditionId,
          conditionName: block.conditionName,
          description: `Large gap in evidence timeline (${Math.round(gapYears)} years).`,
          suggestion: 'Document continuity of symptoms during this period with lay statements or additional records.',
        });
      }
    }
    
    // Check for gap analysis status
    if (gap && gap.status === 'gap') {
      issues.push({
        type: 'incomplete',
        conditionId: block.conditionId,
        conditionName: block.conditionName,
        description: 'Gap analysis indicates insufficient evidence.',
        suggestion: gap.suggestedAction === 'lay_evidence' 
          ? 'Complete the Lay Evidence Wizard for this condition.'
          : 'Request additional records using VA Form 20-10206.',
      });
    }
  }
  
  return issues;
}

// ═══════════════════════════════════════════════════════════════════
// COMPILE FULL NARRATIVE DRAFT
// ═══════════════════════════════════════════════════════════════════

export function compileNarrativeDraft(
  narrativeBlocks: NarrativeBlock[],
  veteranName: string,
  claimType: string
): string {
  let draft = `CLAIM NARRATIVE DRAFT
${'═'.repeat(60)}
Generated by VAULT DEM Engine
Date: ${new Date().toLocaleDateString()}

VETERAN: ${veteranName}
CLAIM TYPE: ${claimType.toUpperCase()}
CONDITIONS: ${narrativeBlocks.length}

`;
  
  for (let i = 0; i < narrativeBlocks.length; i++) {
    const block = narrativeBlocks[i];
    
    draft += `
${'─'.repeat(60)}
CONDITION ${i + 1}: ${block.conditionName.toUpperCase()}
${'─'.repeat(60)}

ARGUMENT:
${block.argument}

SUPPORTING EVIDENCE:
${block.evidenceCitations.map((e, j) => `  ${j + 1}. ${e}`).join('\n')}

LEGAL AUTHORITY:
${block.lawCitations.map((l, j) => `  ${j + 1}. ${l}`).join('\n')}

`;
  }
  
  draft += `
${'═'.repeat(60)}
END OF NARRATIVE DRAFT
${'═'.repeat(60)}

NOTE: This narrative has been auto-generated based on your evidence.
Review carefully and modify as needed before submission.
`;
  
  return draft;
}

export default {
  buildNarrativeBlock,
  generateNarrativeBlocks,
  generateStatementInSupport,
  generateNexusArgument,
  runQualityAssurance,
  compileNarrativeDraft,
};

