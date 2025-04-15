
interface IUser {
  // Equivalent to the Member in Travel page
  userId: string;
  username: string;
  role?: string;
}

interface IBillForm {
  travelId: string; // Aka. groupId
  userId: string; // Creator's userId
  description?: string;
  amount: number;  // Default in USD
  currency?: "USD" | "CNY" | "EUR" | "JPY" | "GBP" | (string & {});
  paidBy?: string; // Payer's userId. If not provided, default to the creator of the bill
  participants?: string[]; // List of userIds who share the bill. If not provided, default to all members in the group
  expenseDate?: string; // Date of the expense
  splitType?: "equal" | "unequal"; // Default to equal
  split?: IBillSplit[]; // If unequal, provide the split details
}

interface IBill extends IBillForm {
  billId?: string; // Unique identifier for the bill. Aka. expenseId
  createdAt?: string; // Date when the bill was created
  updatedAt?: string; // Date when the bill was last updated
}

interface IBillSplit {
  userId: string;
  amount: number;
}
