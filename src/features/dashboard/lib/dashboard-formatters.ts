const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value: string): string {
  const parsedValue = Number.parseFloat(value);

  if (Number.isNaN(parsedValue)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(parsedValue);
}

export function formatPeriodLabel(
  startDate?: string | null,
  endDate?: string | null,
): string {
  if (startDate && endDate) {
    return `${startDate} ate ${endDate}`;
  }

  if (startDate) {
    return `A partir de ${startDate}`;
  }

  if (endDate) {
    return `Ate ${endDate}`;
  }

  return 'Todo o historico';
}
