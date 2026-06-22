import type { CategorySuggestion } from '@/features/categories/types/category';

interface CategorySuggestionsPickerProps {
  suggestions: CategorySuggestion[];
  addedSuggestionNames: Set<string>;
  onSuggestionSelect: (suggestion: CategorySuggestion) => void;
}

const suggestionGroups = ['Do desafio', 'Outras ideias'] as const;

export function CategorySuggestionsPicker({
  suggestions,
  addedSuggestionNames,
  onSuggestionSelect,
}: CategorySuggestionsPickerProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Sugestoes rapidas</p>
        <p className="text-sm text-muted">
          Um clique preenche o formulario. A criacao so acontece quando voce
          confirmar.
        </p>
      </div>

      <div className="space-y-4">
        {suggestionGroups.map((group) => {
          const groupSuggestions = suggestions.filter(
            (suggestion) => suggestion.group === group,
          );

          return (
            <div className="space-y-3" key={group}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {group}
              </p>

              <div className="flex flex-wrap gap-2">
                {groupSuggestions.map((suggestion) => {
                  const isAdded = addedSuggestionNames.has(
                    suggestion.name.toLocaleLowerCase('pt-BR'),
                  );

                  return (
                    <button
                      className="rounded-full border px-3 py-2 text-left text-sm transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:border-border disabled:text-muted"
                      disabled={isAdded}
                      key={suggestion.name}
                      onClick={() => onSuggestionSelect(suggestion)}
                      type="button"
                    >
                      <span className="font-medium">{suggestion.name}</span>
                      <span className="ml-2 text-xs">
                        {isAdded ? 'Ja adicionada' : 'Usar sugestao'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
