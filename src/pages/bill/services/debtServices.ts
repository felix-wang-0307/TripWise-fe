
import { isGoodResponse } from "../utils";

const BACKEND = import.meta.env.VITE_APIURL || import.meta.env.BASE_URL;

export async function getAllDebtsInTravel(
  travelId: number,
): Promise<IDebt[]> {
  const res = await fetch(`${BACKEND}/api/bills/debts/travels/${travelId}`, {
    method: "GET",
  }).then((res) => res.json());
  if (isGoodResponse(res)) {
    return res.debts;
  }
  return [];
}

export async function getDebtsByUserId(
  userId: number,
  travelId: number = -1,
  // travelId is -1 means fetch all debts of the user
): Promise<IDebt[]> {
  const res = await fetch(`${BACKEND}/api/bills/debts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  if (isGoodResponse(res)) {
    if (travelId !== -1) {
      // Filter the debts by travelId
      return res.debts.filter((debt: IDebt) => debt.travelId === travelId);
    }
    // If travelId is -1, return all debts
    return res.debts;
  }
  return []; 
}

export function calcUserBalanceOfDebts(
  debts: IDebt[],
  userId: number,
): number {
  let totalDebt = 0;
  let totalCredit = 0;

  for (const debt of debts) {
    if (debt.debtorId === userId) {
      totalDebt += debt.amount;
    } else if (debt.creditorId === userId) {
      totalCredit += debt.amount;
    }
  }
  // Positive balance means the user is a creditor (is owed money)
  // Negative balance means the user is a debtor (owes money)
  return totalCredit - totalDebt;
}

export function calcSettlePlans(debts: IDebt[]): IDebtSettlePlan[] {
  const balances: Map<number, number> = new Map();

  for (const debt of debts) {
    balances.set(debt.debtorId, (balances.get(debt.debtorId) || 0) - debt.amount);
    balances.set(debt.creditorId, (balances.get(debt.creditorId) || 0) + debt.amount);
  }

  const creditors: { userId: number; balance: number }[] = [];
  const debtors: { userId: number; balance: number }[] = [];

  let total = 0;

  for (const [userId, balance] of balances.entries()) {
    total += balance;
    if (balance > 0) {
      creditors.push({ userId, balance });
    } else if (balance < 0) {
      debtors.push({ userId, balance });
    }
  }

  if (Math.abs(total) > 0.01) {
    console.error("💥 DEBTS DON'T ADD UP TO ZERO! Check your bill calculations.");
  }

  // Sort creditors and debtors
  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => a.balance - b.balance); // more negative first

  const settlePlans: IDebtSettlePlan[] = [];

  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amountToSettle = Math.min(
      Math.abs(debtor.balance),
      creditor.balance
    );

    if (amountToSettle > 0.01) {
      settlePlans.push({
        debtorId: debtor.userId,
        creditorId: creditor.userId,
        amount: parseFloat(amountToSettle.toFixed(2)),
      });

      // Update balances
      debtor.balance += amountToSettle;
      creditor.balance -= amountToSettle;
    }

    if (Math.abs(debtor.balance) < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }

  return settlePlans;
}
