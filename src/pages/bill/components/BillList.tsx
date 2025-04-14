import React, { useEffect, useState } from "react";
import { getBillsByTravel } from "../services/billServices";
import { formatDate } from "../utils";
import { Alert, ListGroup } from "react-bootstrap";
import styles from "../bill.module.css";

const mockBills: IBill[] = [
  {
    billId: "1",
    travelId: "1",
    userId: "1",
    description: "Dinner",
    amount: 50,
    currency: "USD",
    paidBy: "1",
    participants: ["1", "2"],
    expenseDate: new Date().toISOString(),
    splitType: "equal",
    split: [
      { userId: "1", amount: 25 },
      { userId: "2", amount: 25 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    billId: "2",
    travelId: "1",
    userId: "2",
    description: "Taxi",
    amount: 30,
    currency: "USD",
    paidBy: "2",
    participants: ["1", "2"],
    expenseDate: new Date().toISOString(),
    splitType: "equal",
    split: [
      { userId: "1", amount: 15 },
      { userId: "2", amount: 15 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    billId: "3",
    travelId: "1",
    userId: "1",
    description: "Lunch",
    amount: 40,
    currency: "USD",
    paidBy: "1",
    participants: ["1", "2"],
    expenseDate: new Date().toISOString(),
    splitType: "equal",
    split: [
      { userId: "1", amount: 20 },
      { userId: "2", amount: 20 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const BillList = ({ travelId, handleUpdateBill }) => {
  const [bills, setBills] = useState<IBill[]>(mockBills);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const bills = await getBillsByTravel(travelId);
        if (Array.isArray(bills)) {
          setBills(bills);
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching bills:", err);
        setBills(mockBills);
      }
    };

    fetchBills();
  }, [travelId]);

  if (error) {
    return (
      <Alert variant="danger">
        {error.message || "Oops! An error happens. Try refreshing the page :("}
      </Alert>
    );
  }

  return bills.length === 0 ? (
    <Alert variant="info">
      No bills found for this travel. Please add some bills.
    </Alert>
  ) : (
    <ListGroup className={styles["bill-list"]} as={"ul"}>
      {bills.map((bill) => (
        <ListGroup.Item
          key={bill.billId}
          className={styles["bill-item"]}
          as={"li"}
        >
          <div className={styles["bill-item-header"]}>
            <strong>{bill.description}</strong>
            <span className={styles["bill-item-date"]}>
              {formatDate(bill.expenseDate)}
            </span>
          </div>
          <div className={styles["bill-item-details"]}>
            <span>
              Amount: {bill.amount} {bill.currency}
            </span>
            <span>Paid by: {bill.paidBy}</span>
          </div>
          <button
            className={styles["update-button"]}
            onClick={() => handleUpdateBill(bill)}
          >
            Update
          </button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default BillList;
