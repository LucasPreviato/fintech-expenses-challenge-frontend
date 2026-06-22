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
import { Textarea } from '@/components/ui/textarea';
import { CategorySuggestionsPicker } from '@/features/categories/components/category-suggestions-picker';
import type { CategoryFormValues } from '@/features/categories/lib/category-schemas';
import type { CategorySuggestion } from '@/features/categories/types/category';
import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface CategoryFormProps {
  form: UseFormReturn<CategoryFormValues>;
  isEditing: boolean;
  isSubmitting: boolean;
  suggestions: CategorySuggestion[];
  addedSuggestionNames: Set<string>;
  onSuggestionSelect: (suggestion: CategorySuggestion) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancelEdit: () => void;
}

export function CategoryForm({
  form,
  isEditing,
  isSubmitting,
  suggestions,
  addedSuggestionNames,
  onSuggestionSelect,
  onSubmit,
  onCancelEdit,
}: CategoryFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar categoria' : 'Criar categoria'}
        </CardTitle>
        <CardDescription>
          Use uma sugestao como ponto de partida ou cadastre uma categoria do
          seu jeito.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <CategorySuggestionsPicker
          addedSuggestionNames={addedSuggestionNames}
          onSuggestionSelect={onSuggestionSelect}
          suggestions={suggestions}
        />

        <form className="space-y-4" onSubmit={onSubmit}>
          <FieldError message={form.formState.errors.root?.message} />

          <div className="space-y-2">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              placeholder="Ex.: Alimentacao"
              type="text"
              {...form.register('name')}
            />
            <FieldError message={form.formState.errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Descricao</Label>
            <Textarea
              id="category-description"
              placeholder="Descreva quando essa categoria deve ser usada."
              {...form.register('description')}
            />
            <FieldError message={form.formState.errors.description?.message} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? isEditing
                  ? 'Salvando...'
                  : 'Criando...'
                : isEditing
                  ? 'Salvar alteracoes'
                  : 'Criar categoria'}
            </Button>

            {isEditing ? (
              <Button
                disabled={isSubmitting}
                onClick={onCancelEdit}
                type="button"
                variant="secondary"
              >
                Cancelar edicao
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
