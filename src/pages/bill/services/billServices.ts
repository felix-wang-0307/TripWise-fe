/*
Basic CURD of bills
*/

const BACKEND = import.meta.env.VITE_APIURL || import.meta.env.BASE_URL;

export async function createBill(bill: IBill): Promise<IResponse> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  }).then((res) => res.json());
  if (res?.code?.toString()[0] !== "2") {
    throw new Error(res.message);
  }
  return res;
}

export async function getBillsByTravel(travelId: string): Promise<IBill[]> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills/travels/${travelId}`, {
    method: "GET",
  }).then((res) => res.json());
  if (res?.code?.toString()[0] !== "2") {
    throw new Error(res.message);
  }
  return res.expenses;
}

export async function deleteBill(billId: string): Promise<IResponse> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills/${billId}`, {
    method: "DELETE",
  }).then((res) => res.json());
  if (res?.code?.toString()[0] !== "2") {
    throw new Error(res.message);
  }
  return res;
}

export async function updateBill(billId: string, bill: IBill): Promise<IResponse> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills/${billId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  }).then((res) => res.json());
  if (res?.code?.toString()[0] !== "2") {
    throw new Error(res.message);
  }
  return res;
}

export async function getBillById(billId: string): Promise<IBill> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills/${billId}`, {
    method: "GET",
  }).then((res) => res.json());
  if (res?.code?.toString()[0] !== "2") {
    throw new Error(res.message);
  }
  return res.bill;
}