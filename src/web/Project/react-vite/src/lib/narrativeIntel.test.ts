import { describe, expect, it } from 'vitest';
import { suggestRelatedConditions } from './narrativeIntel';

describe('narrativeIntel.suggestRelatedConditions', () => {
  it('suggests common related conditions from selected names', () => {
    const out = suggestRelatedConditions(['PTSD'], 20);
    const ids = new Set(out.map((c) => c.id));

    // From BodySystems secondary mappings: MDD, GAD, Insomnia list PTSD as secondary
    expect(ids.has('mdd')).toBe(true);
    expect(ids.has('gad')).toBe(true);
    expect(ids.has('insomnia')).toBe(true);
  });
});


