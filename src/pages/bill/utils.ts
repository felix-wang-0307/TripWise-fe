
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

export function isGoodResponse(response: IResponse | undefined): boolean {
  if (!response) {
    return false;
  }
  if (response.code && response.code.toString()[0] !== "2") {
    return false;
  }
  if (response.message && response.message !== "OK") {
    return false;
  }
  return true;
}

export const BadResponse = {
  code: 500,
  message: "Internal Server Error",
  data: null,
};