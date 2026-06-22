import { SelectMenu } from '@/components/ui/select-menu';
import type { CategorySuggestion } from '@/features/categories/types/category';
import { useMemo } from 'react';

interface CategorySuggestionsPickerProps {
  suggestions: CategorySuggestion[];
  addedSuggestionNames: Set<string>;
  onSuggestionSelect: (suggestion: CategorySuggestion) => void;
}

export function CategorySuggestionsPicker({
  suggestions,
  addedSuggestionNames,
  onSuggestionSelect,
}: CategorySuggestionsPickerProps) {
  const availableSuggestions = useMemo(
    () =>
      suggestions.filter(
        (suggestion) =>
          !addedSuggestionNames.has(suggestion.name.toLocaleLowerCase('pt-BR')),
      ),
    [addedSuggestionNames, suggestions],
  );
  const suggestionOptions = useMemo(
    () =>
      availableSuggestions.map((suggestion) => ({
        value: suggestion.name,
        label: `${suggestion.name} • ${suggestion.group}`,
      })),
    [availableSuggestions],
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Sugestoes rapidas</p>
        <p className="text-sm text-muted">
          Um clique preenche o formulario. A criacao so acontece quando voce
          confirmar.
        </p>
      </div>

      <div className="space-y-2">
        <SelectMenu
          id="category-suggestion"
          name="categorySuggestion"
          onChange={(value) => {
            const suggestion = availableSuggestions.find(
              (item) => item.name === value,
            );

            if (suggestion) {
              onSuggestionSelect(suggestion);
            }
          }}
          options={suggestionOptions}
          placeholder={
            suggestionOptions.length > 0
              ? 'Selecione uma sugestao pronta'
              : 'Todas as sugestoes ja foram adicionadas'
          }
          value=""
          disabled={suggestionOptions.length === 0}
        />

        {suggestionOptions.length === 0 ? (
          <p className="text-sm text-muted">
            Todas as sugestoes disponiveis ja foram usadas nas suas categorias.
          </p>
        ) : null}
      </div>
    </div>
  );
}
