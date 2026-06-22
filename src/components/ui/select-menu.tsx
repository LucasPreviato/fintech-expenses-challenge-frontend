import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import {
  type FocusEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface SelectMenuOption {
  value: string;
  label: string;
}

interface SelectMenuProps {
  id: string;
  name: string;
  value?: string;
  placeholder: string;
  options: SelectMenuOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export function SelectMenu({
  id,
  name,
  value = '',
  placeholder,
  options,
  disabled = false,
  onChange,
  onBlur,
}: SelectMenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
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
        aria-controls={`${id}-menu`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-left text-sm text-foreground transition outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
          !selectedOption && 'text-muted',
        )}
        disabled={disabled}
        id={id}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted transition-transform',
            open && 'rotate-180',
          )}
          strokeWidth={1.75}
        />
      </button>

      {open ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-border/80 bg-card shadow-lg shadow-slate-900/10"
          id={`${id}-menu`}
        >
          <button
            className={cn(
              'flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-muted-surface',
              !selectedOption && 'bg-primary/5 text-foreground',
            )}
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            type="button"
          >
            <span>{placeholder}</span>
            {!selectedOption ? <Check className="size-4 text-primary" /> : null}
          </button>

          <div className="max-h-64 overflow-y-auto py-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-muted-surface',
                    isSelected && 'bg-primary/5 text-foreground',
                  )}
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  type="button"
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <Check className="size-4 text-primary" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
