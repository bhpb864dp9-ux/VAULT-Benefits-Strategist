export type Season = 'winter' | 'spring' | 'summer' | 'fall';

export type SeasonalHeroCopy = {
  season: Season;
  periodIndex: number; // increments every 2 weeks
  headline: string;
  subhead: string;
};

function getSeason(d: Date): Season {
  const m = d.getMonth(); // 0-11
  if (m === 11 || m === 0 || m === 1) return 'winter';
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  return 'fall';
}

function getBiweeklyPeriodIndex(d: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const day = Math.floor(d.getTime() / MS_PER_DAY);
  return Math.floor(day / 14);
}

const COPY: Record<Season, Array<Pick<SeasonalHeroCopy, 'headline' | 'subhead'>>> = {
  winter: [
    {
      headline: 'You earned every percent.',
      subhead: 'Start the year with a clean, evidence-first claim — fully on-device.'
    },
    {
      headline: 'Every percent is earned.',
      subhead: 'Make the record undeniable: conditions, evidence, and forms — offline.'
    },
    {
      headline: 'You earned it. Document it.',
      subhead: 'Fast VASRD math, stronger narratives, and artifacts ready to submit.'
    },
    {
      headline: 'Your service counts. So does every percent.',
      subhead: 'Quiet confidence: organize, calculate, and export — no data leaves your device.'
    }
  ],
  spring: [
    {
      headline: 'You earned every percent.',
      subhead: 'Spring reset: tighten your evidence chain and claim strategy.'
    },
    {
      headline: 'Every percent is earned.',
      subhead: 'Refresh the file: clean timelines, clearer narratives, stronger submissions.'
    },
    {
      headline: 'You earned it. Claim it with clarity.',
      subhead: 'Deterministic calculations + local-first evidence intelligence.'
    },
    {
      headline: 'Make the record bloom — not the drama.',
      subhead: 'Structured facts, calm workflow, and exportable artifacts.'
    }
  ],
  summer: [
    {
      headline: 'You earned every percent.',
      subhead: 'Stay mission-focused: quick inputs, instant math, clean outputs.'
    },
    {
      headline: 'Every percent is earned.',
      subhead: 'Build momentum: conditions → evidence → narrative → ready-to-submit.'
    },
    {
      headline: 'You earned it. Keep it simple.',
      subhead: 'On-device tools that move fast — without cutting corners.'
    },
    {
      headline: 'Less friction. More signal.',
      subhead: 'Make the VA’s job easy: organized documentation and consistent forms.'
    }
  ],
  fall: [
    {
      headline: 'You earned every percent.',
      subhead: 'Fall check: verify evidence, strengthen secondaries, and export clean packets.'
    },
    {
      headline: 'Every percent is earned.',
      subhead: 'Review and refine: better language, better structure, better outcomes.'
    },
    {
      headline: 'You earned it. Make it provable.',
      subhead: 'Deterministic strategy with an audit-friendly trail — local-first.'
    },
    {
      headline: 'Precision beats persuasion.',
      subhead: 'Evidence chains and exact math — not vibes.'
    }
  ]
};

export function getBiweeklySeasonalHeroCopy(date = new Date()): SeasonalHeroCopy {
  const season = getSeason(date);
  const periodIndex = getBiweeklyPeriodIndex(date);
  const options = COPY[season];
  const pick = options[periodIndex % options.length];
  return { season, periodIndex, ...pick };
}


