/**
 * VAULT DEM Engine — Custom React Hooks
 * Reusable hooks for calculations and state
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useClaimStore, useConditions } from '../stores/claimStore';
import { 
  calculateExactCombinedRating, 
  calculateCompensation,
  calculateRatingRange
} from '../utils/vasrdCalculator';
import { 
  checkTDIUEligibility, 
  checkSMCEligibility,
} from '../utils/tdiuSmcChecker';
import {
  analyzeEvidenceGaps,
} from '../utils/evidenceAnalyzer';
import type { RatingInput, CombinedRatingResult, CompensationResult, TDIUResult, SMCResult, EvidenceAnalysis } from '../types';

export interface DEMAnalysis {
  combined: CombinedRatingResult;
  compensation: CompensationResult;
  tdiu: TDIUResult;
  smc: SMCResult[];
  evidence: EvidenceAnalysis;
  demScore: number;
  ratingRange: { min: number; max: number };
}

export function useVASRDCalculator() {
  const { data } = useClaimStore();
  const conditions = useConditions();
  const { dependents } = data;

  const ratingInputs: RatingInput[] = useMemo(() => {
    return conditions.map(c => ({
      id: c.id,
      name: c.name,
      value: c.selectedRating || Math.max(...(c.ratings || [0])),
      isBilateral: c.isBilateral || c.bilateralEligible,
      side: c.side,
      limbType: c.limbType
    }));
  }, [conditions]);

  const combinedResult = useMemo(() => {
    return calculateExactCombinedRating(ratingInputs);
  }, [ratingInputs]);

  const compensationResult = useMemo(() => {
    return calculateCompensation(combinedResult.combined, dependents);
  }, [combinedResult.combined, dependents]);

  const tdiuResult = useMemo(() => {
    return checkTDIUEligibility(ratingInputs);
  }, [ratingInputs]);

  const smcResults = useMemo(() => {
    return checkSMCEligibility(conditions, ratingInputs);
  }, [conditions, ratingInputs]);

  const evidenceAnalysis = useMemo(() => {
    return analyzeEvidenceGaps(conditions, [], data.ocrResults);
  }, [conditions, data.ocrResults]);

  const ratingRange = useMemo(() => {
    if (conditions.length === 0) return { min: 0, max: 0 };
    return calculateRatingRange(
      conditions.map(c => ({ name: c.name, ratings: c.ratings }))
    );
  }, [conditions]);

  const demScore = useMemo(() => {
    let score = 0;
    score += (combinedResult.combined / 100) * 40;
    if (tdiuResult.eligible === true) score += 20;
    else if (tdiuResult.eligible === 'extrascheduler') score += 10;
    score += Math.min(smcResults.filter(s => s.eligible).length * 5, 15);
    score += (evidenceAnalysis.overallScore / 100) * 15;
    score += Math.min(conditions.length * 2, 10);
    return Math.round(Math.min(100, score));
  }, [combinedResult, tdiuResult, smcResults, evidenceAnalysis, conditions]);

  const analysis: DEMAnalysis = useMemo(() => ({
    combined: combinedResult,
    compensation: compensationResult,
    tdiu: tdiuResult,
    smc: smcResults,
    evidence: evidenceAnalysis,
    demScore,
    ratingRange
  }), [combinedResult, compensationResult, tdiuResult, smcResults, evidenceAnalysis, demScore, ratingRange]);

  const calculateCustom = useCallback((ratings: number[]) => {
    const inputs: RatingInput[] = ratings.map((value, i) => ({
      id: `custom-${i}`,
      name: `Rating ${i + 1}`,
      value
    }));
    return calculateExactCombinedRating(inputs);
  }, []);

  return {
    combined: combinedResult,
    compensation: compensationResult,
    tdiu: tdiuResult,
    smc: smcResults,
    evidence: evidenceAnalysis,
    demScore,
    ratingRange,
    analysis,
    calculateCustom,
    ratingInputs,
    conditions
  };
}

import { searchConditions } from '../data/bodySystems';

export function useConditionSearch(query: string) {
  const [results, setResults] = useState<ReturnType<typeof searchConditions>>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const found = searchConditions(query);
      setResults(found);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isSearching };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      // ignore
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)');

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, []);
  return { copy, copied };
}

export function useTimer() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const start = useCallback(() => setStartTime(Date.now()), []);
  const stop = useCallback(() => {
    if (startTime) {
      setElapsed(Date.now() - startTime);
      setStartTime(null);
    }
  }, [startTime]);
  const reset = useCallback(() => {
    setStartTime(null);
    setElapsed(0);
  }, []);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return {
    elapsed,
    isRunning: startTime !== null,
    start,
    stop,
    reset,
    formatted: formatTime(elapsed)
  };
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export default {
  useVASRDCalculator,
  useConditionSearch,
  useLocalStorage,
  useDebounce,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useClipboard,
  useTimer
};


