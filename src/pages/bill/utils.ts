/* Format date to MM/DD */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}`;
}

/* Format currency to '$1,234.56' */
export function formatCurrency(amount: number, currency = "USD"): string {
  return Intl.NumberFormat(currency === "CNY" ? "zh-CN" : "en-US", {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function isGoodResponse(response: IResponse | undefined): boolean {
  function isBadCode(code: string | number): boolean {
    if (typeof code === "string") {
      return code[0] !== "2";
    }
    if (typeof code === "number") {
      return code.toString()[0] !== "2";
    }
    return false;
  }
  if (!response) {
    return false;
  }
  if (response.code && isBadCode(response.code)) {
    return false;
  }
  if (response.status && isBadCode(response.status)) {
    return false;
  }
  if (response.error) {
    return false;
  }
  return true;
}

export const BadResponse = {
  code: 500,
  message: "Internal Server Error",
  data: null,
};

export function isEqualNumber(a: number, b: number): boolean {
  return Math.abs(a - b) < 5 * Number.EPSILON;
}

export function getBillPortion(bill: IBill, userId: number): number {
  // Check if paid by the user
  let portion = 0;
  if (bill.paidBy === userId) {
    portion -= bill.amount;
  }
  // Check if the user is a participant
  if (bill.participants && bill.participants.includes(userId)) {
    // If splitType is unequal, find the user's portion
    if (bill.splitType && bill.splitType === "unequal") {
      const split = bill.split.find((s) => s.userId === userId);
      if (split) {
        portion += split.amount;
      }
    }
    // If splitType is equal, divide the amount by the number of participants
    else {
      portion += bill.amount / bill.participants.length;
    }
  }
  // Positive portion means the user owes money
  // Negative portion means the user is owed money
  return portion;
}
