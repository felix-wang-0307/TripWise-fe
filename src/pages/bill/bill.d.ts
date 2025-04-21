
interface IUser {
  // Equivalent to the Member in Travel page
  userId: number;
  username: string;
  role?: string;
}

interface IBillForm {
  travelId: number; // Aka. groupId
  userId: number; // Creator's userId
  description?: string;
  amount: number;  // Default in USD
  currency?: "USD" | "CNY" | "EUR" | "JPY" | "GBP" | (string & {});
  paidBy?: number; // Payer's userId. If not provided, default to the creator of the bill
  participants?: number[]; // List of userIds who share the bill. If not provided, default to all members in the group
  expenseDate?: string; // Date of the expense in YYYY-MM-DD format
  splitType?: "equal" | "unequal"; // Default to equal
  split?: IBillSplit[]; // If unequal, provide the split details
}

interface IBill extends IBillForm {
  expenseId?: number; // Unique identifier for the bill. Aka. billId
  billId?: number; // Unique identifier for the bill. Aka. expenseId
  createdAt?: string; // Date when the bill was created
  updatedAt?: string; // Date when the bill was last updated
}

interface IBillSplit {
  userId: number;
  amount: number;
}

interface IDebt {
  debtorId: number; // UserId of the debtor
  creditorId: number; // UserId of the creditor
  amount: number; // Amount owed
  description?: string; // Description of the debt
  expenseId?: number; // Unique identifier for the bill associated with the debt
  travelId?: number; // Unique identifier for the travel associated with the debt
}

interface IDebtSettlePlan {
  debtorId: number; // UserId of the debtor
  creditorId: number; // UserId of the creditor
  amount: number; // Amount to be settled
}