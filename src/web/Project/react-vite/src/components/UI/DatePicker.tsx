import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

type DatePickerProps = {
  value: string; // YYYY-MM-DD (or '')
  onChange: (next: string) => void;
  placeholder?: string;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  disabled?: boolean;
};

function parseYmd(s?: string): Date | null {
  if (!s) return null;
  try {
    const d = parseISO(s);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

function toYmd(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

export default function DatePicker({ value, onChange, placeholder = 'YYYY-MM-DD', min, max, disabled }: DatePickerProps) {
  const selected = useMemo(() => parseYmd(value), [value]);
  const minDate = useMemo(() => parseYmd(min), [min]);
  const maxDate = useMemo(() => parseYmd(max), [max]);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => selected || new Date());
  const [draft, setDraft] = useState<string>(value || '');

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDraft(value || '');
    if (selected) setView(selected);
  }, [value, selected]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(view), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(view), { weekStartsOn: 0 });
    const days: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
    const out: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) out.push(days.slice(i, i + 7));
    return out;
  }, [view]);

  const isDisabledDay = (d: Date) => {
    if (minDate && isBefore(d, minDate)) return true;
    if (maxDate && isAfter(d, maxDate)) return true;
    return false;
  };

  const commitDraft = () => {
    const next = draft.trim();
    if (!next) {
      onChange('');
      return;
    }
    const d = parseYmd(next);
    if (!d || isDisabledDay(d)) return;
    onChange(toYmd(d));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={clsx(
          'input flex items-center justify-between gap-3',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className={clsx('text-sm', value ? 'text-slate-100' : 'text-slate-500')}>
          {value || placeholder}
        </span>
        <Calendar className="w-4 h-4 text-slate-400" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose date"
          className="absolute z-50 mt-3 w-[320px] max-w-[90vw] rounded-3xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm px-3 py-2"
                onClick={() => setView((v) => addMonths(v, -1))}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-sm font-medium text-slate-100">
                {format(view, 'MMMM yyyy')}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm px-3 py-2"
                onClick={() => setView((v) => addMonths(v, 1))}
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button type="button" className="btn btn-ghost btn-sm px-3 py-2" onClick={() => setOpen(false)} aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-[11px] text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center py-1">{d}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {weeks.flat().map((d) => {
              const inMonth = isSameMonth(d, view);
              const selectedDay = selected ? isSameDay(d, selected) : false;
              const disabledDay = isDisabledDay(d);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => {
                    if (disabledDay) return;
                    onChange(toYmd(d));
                    setOpen(false);
                  }}
                  className={clsx(
                    'h-10 rounded-2xl text-sm transition-colors',
                    inMonth ? 'text-slate-100' : 'text-slate-600',
                    !disabledDay && 'hover:bg-slate-800/70',
                    disabledDay && 'opacity-40 cursor-not-allowed',
                    selectedDay && 'bg-brass text-slate-950 hover:bg-brass'
                  )}
                  aria-label={format(d, 'yyyy-MM-dd')}
                >
                  {format(d, 'd')}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2 items-center">
            <input
              className="input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              inputMode="numeric"
              aria-label="Enter date (YYYY-MM-DD)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitDraft();
              }}
            />
            <button type="button" className="btn btn-primary btn-sm px-4 py-3" onClick={commitDraft}>
              Set
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm px-4 py-3"
              onClick={() => {
                setDraft('');
                onChange('');
              }}
            >
              Clear
            </button>
          </div>

          {(min || max) && (
            <p className="mt-3 text-xs text-slate-500">
              {min ? `Min: ${min}` : ''}
              {min && max ? ' • ' : ''}
              {max ? `Max: ${max}` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


