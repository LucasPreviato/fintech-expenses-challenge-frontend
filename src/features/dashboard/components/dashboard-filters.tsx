import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldError } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { DashboardFiltersFormValues } from '../lib/dashboard-schemas';

interface DashboardFiltersProps {
  form: UseFormReturn<DashboardFiltersFormValues>;
  hasActiveFilters: boolean;
  isApplyingFilters: boolean;
  periodLabel?: string;
  onApplyFilters: FormEventHandler<HTMLFormElement>;
  onClearFilters: () => void;
}

export function DashboardFilters({
  form,
  hasActiveFilters,
  isApplyingFilters,
  periodLabel,
  onApplyFilters,
  onClearFilters,
}: DashboardFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Período</CardTitle>
        <CardDescription>
          Filtre os indicadores consolidados por intervalo de datas quando
          quiser analisar um recorte especifico.
        </CardDescription>
        {periodLabel ? (
          <p className="text-sm text-muted">
            Período analisado:{' '}
            <span className="font-medium text-foreground">{periodLabel}</span>
          </p>
        ) : null}
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={onApplyFilters}>
          <FieldError message={form.formState.errors.root?.message} />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dashboard-filter-start-date">Data inicial</Label>
              <Input
                id="dashboard-filter-start-date"
                type="date"
                {...form.register('startDate')}
              />
              <FieldError message={form.formState.errors.startDate?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboard-filter-end-date">Data final</Label>
              <Input
                id="dashboard-filter-end-date"
                type="date"
                {...form.register('endDate')}
              />
              <FieldError message={form.formState.errors.endDate?.message} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={isApplyingFilters} type="submit">
              {isApplyingFilters ? 'Atualizando...' : 'Aplicar filtros'}
            </Button>

            <Button
              disabled={isApplyingFilters && !hasActiveFilters}
              onClick={onClearFilters}
              type="button"
              variant="secondary"
            >
              Limpar filtros
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
