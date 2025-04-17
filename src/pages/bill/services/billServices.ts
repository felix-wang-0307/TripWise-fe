/*
Basic CURD of bills
*/

import { BadResponse, isGoodResponse } from "../utils";

const BACKEND = import.meta.env.VITE_APIURL || import.meta.env.BASE_URL;

export async function createBill(bill: IBill): Promise<IResponse | undefined> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  }).then((res) => res.json());
  if (isGoodResponse(res)) {
    return res;
  }
  return BadResponse;
}

export async function getBillsByTravel(travelId: string): Promise<IBill[]> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills/travels/${travelId}`, {
    method: "GET",
  }).then((res) => res.json());
  if (isGoodResponse(res)) {
    return res.bills;
  }
  return [];
}

export async function deleteBill(billId: string): Promise<IResponse> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills/${billId}`, {
    method: "DELETE",
  }).then((res) => res.json());
  if (isGoodResponse(res)) {
    return res;
  }
  return BadResponse;
}

export async function updateBill(billId: string, bill: IBill): Promise<IResponse> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills/${billId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  }).then((res) => res.json());
  if (isGoodResponse(res)) {
    return res;
  }
  return BadResponse;
}

export async function getBillById(billId: string): Promise<IBill | undefined> {
  const res: IResponse = await fetch(`${BACKEND}/api/bills/${billId}`, {
    method: "GET",
  }).then((res) => res.json());
  if (isGoodResponse(res)) {
    return res.bill;
  }
}