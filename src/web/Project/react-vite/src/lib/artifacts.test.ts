import { describe, expect, it } from 'vitest';
import { buildBuddyStatementText, buildTimelineText, safeFilenamePart } from './artifacts';

describe('artifacts', () => {
  it('safeFilenamePart normalizes unsafe characters', () => {
    expect(safeFilenamePart('  John Doe  ')).toBe('John_Doe');
    expect(safeFilenamePart('A/B\\C:D*E?')).toBe('A_B_C_D_E_');
  });

  it('buildBuddyStatementText contains key sections', () => {
    const txt = buildBuddyStatementText({
      veteranName: 'Jane Veteran',
      witnessName: 'Sam Witness',
      witnessRelationship: 'Spouse',
      conditions: ['PTSD', 'Knee Condition'],
      observations: 'Observed nightmares and mobility limitations.',
      date: new Date('2026-01-01T00:00:00Z')
    });

    expect(txt).toContain('BUDDY / LAY STATEMENT');
    expect(txt).toContain('Veteran: Jane Veteran');
    expect(txt).toContain('Witness: Sam Witness');
    expect(txt).toContain('- PTSD');
    expect(txt).toContain('Observed nightmares');
  });

  it('buildTimelineText sorts by date (unknown dates first due to empty string sort)', () => {
    const txt = buildTimelineText({
      veteranName: 'Jane Veteran',
      generatedAt: new Date('2026-01-01T00:00:00Z'),
      events: [
        { id: '1', type: 'service', date: '2020-02-01', title: 'Deployed', notes: undefined },
        { id: '2', type: 'medical', date: '2019-01-05', title: 'Initial injury', notes: 'Knee during PT' }
      ]
    });

    // Ensure earliest dated event appears before later one
    expect(txt.indexOf('2019-01-05')).toBeLessThan(txt.indexOf('2020-02-01'));
    expect(txt).toContain('[MEDICAL]');
    expect(txt).toContain('Notes: Knee during PT');
  });
});


