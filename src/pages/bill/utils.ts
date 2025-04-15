
/* Format date to MM/DD */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}`;
}

/* Format currency to '$1,234.56' */
export function formatCurrency(amount: number, currency: string): string {
  return Intl.NumberFormat(currency === 'CNY' ? 'zh-CN' : 'en-US', {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

