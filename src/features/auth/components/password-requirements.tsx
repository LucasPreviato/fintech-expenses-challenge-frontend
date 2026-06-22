import { cn } from '@/lib/utils';
import {
  getPasswordRequirementState,
  passwordStrengthRules,
} from '@/features/auth/lib/auth-schemas';
import { CheckCircle2, Dot, Sparkles } from 'lucide-react';

const requirementLabels = [
  {
    key: 'hasLowercase',
    label: '1 letra minúscula',
  },
  {
    key: 'hasUppercase',
    label: '1 letra maiúscula',
  },
  {
    key: 'hasNumber',
    label: '1 número',
  },
  {
    key: 'hasSpecialCharacter',
    label: '1 caractere especial',
  },
  {
    key: 'minLength',
    label: `mínimo de ${passwordStrengthRules.minLength} caracteres`,
  },
] as const;

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  const state = getPasswordRequirementState(password);
  const hasTypedPassword = password.length > 0;
  const completedCount = requirementLabels.filter(
    ({ key }) => state[key],
  ).length;

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-200/70 bg-linear-to-br from-emerald-50 via-white to-sky-50 shadow-[0_12px_32px_-24px_rgba(16,185,129,0.6)]">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-100/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Sua senha precisa atender
            </p>
            <p className="text-xs text-slate-500">
              {completedCount}/{requirementLabels.length} requisitos concluídos
            </p>
          </div>
        </div>
        <div className="h-2 w-20 overflow-hidden rounded-full bg-white/80">
          <div
            className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-300"
            style={{
              width: `${(completedCount / requirementLabels.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="grid gap-2 px-4 py-3 sm:grid-cols-2">
        {requirementLabels.map(({ key, label }) => {
          const isSatisfied = state[key];

          return (
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                isSatisfied
                  ? 'border-emerald-200 bg-emerald-100/70 text-emerald-800'
                  : hasTypedPassword
                    ? 'border-amber-200 bg-amber-50/80 text-amber-800'
                    : 'border-slate-200 bg-white/80 text-slate-500',
              )}
              key={key}
            >
              {isSatisfied ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <Dot className="h-4 w-4 shrink-0" />
              )}
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
