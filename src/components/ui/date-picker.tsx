import { cn } from '@/lib/utils';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  type FocusEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface DatePickerProps {
  id: string;
  name: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

const weekdayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function parseDateParts(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, month: month - 1, day };
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatDisplayDate(value?: string) {
  const parts = parseDateParts(value);
  if (!parts) return '';
  return `${String(parts.day).padStart(2, '0')}/${String(parts.month + 1).padStart(2, '0')}/${parts.year}`;
}

function buildCalendarDays(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: 42 }, (_, index) => {
    const dayOffset = index - firstDay + 1;
    const currentDate = new Date(year, month, dayOffset);
    const isCurrentMonth = currentDate.getMonth() === month;
    const displayDay = isCurrentMonth
      ? dayOffset
      : dayOffset <= 0
        ? daysInPrevMonth + dayOffset
        : dayOffset - daysInMonth;

    return {
      key: currentDate.toISOString(),
      day: displayDay,
      value: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
      isCurrentMonth,
    };
  });
}

export function DatePicker({
  id,
  name,
  value = '',
  placeholder = 'dd/mm/aaaa',
  disabled = false,
  onChange,
  onBlur,
}: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedParts = parseDateParts(value);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    selectedParts
      ? new Date(selectedParts.year, selectedParts.month, 1)
      : new Date(),
  );

  const days = useMemo(() => buildCalendarDays(viewDate), [viewDate]);

  useEffect(() => {
    const nextParts = parseDateParts(value);
    if (!nextParts) return;
    setViewDate(new Date(nextParts.year, nextParts.month, 1));
  }, [value]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <input name={name} onBlur={onBlur} type="hidden" value={value} />

      <button
        aria-controls={`${id}-calendar`}
        aria-expanded={open}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-left text-sm text-foreground transition outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
          !value && 'text-muted',
        )}
        disabled={disabled}
        id={id}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>{formatDisplayDate(value) || placeholder}</span>
        <CalendarDays
          className="size-4 shrink-0 text-muted"
          strokeWidth={1.75}
        />
      </button>

      {open ? (
        <div
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-[18rem] overflow-hidden rounded-xl border border-border/80 bg-card shadow-lg shadow-slate-900/10"
          id={`${id}-calendar`}
        >
          <div className="flex items-center justify-between border-b px-3 py-3">
            <button
              className="rounded-md p-1.5 text-muted transition hover:bg-muted-surface hover:text-foreground"
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1),
                )
              }
              type="button"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-medium capitalize text-foreground">
              {formatMonthLabel(viewDate)}
            </p>
            <button
              className="rounded-md p-1.5 text-muted transition hover:bg-muted-surface hover:text-foreground"
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1),
                )
              }
              type="button"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="p-3">
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted">
              {weekdayLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isSelected = day.value === value;
                return (
                  <button
                    className={cn(
                      'flex h-9 items-center justify-center rounded-md text-sm transition',
                      day.isCurrentMonth
                        ? 'text-foreground hover:bg-muted-surface'
                        : 'text-muted hover:bg-muted-surface/70',
                      isSelected &&
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                    )}
                    key={day.key}
                    onClick={() => {
                      onChange(day.value);
                      setOpen(false);
                    }}
                    type="button"
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                className="text-sm font-medium text-muted transition hover:text-foreground"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                type="button"
              >
                Limpar data
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
