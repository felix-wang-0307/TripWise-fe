import React, { useEffect, useState } from "react";
import { getBillsByTravel } from "../services/billServices";
import { formatCurrency, formatDate, getBillPortion, isEqualNumber } from "../utils";
import { Alert, ListGroup } from "react-bootstrap";
import { useAppContext } from "../../../AppContext";
import { findUsernameById } from "../services/memberServices";
// import styles from "../bill.module.css";

const BillPortion = ({ portion, currency }: { portion: number; currency: string }) => {
  const portionText = portion > 0 ? "You owed" : "You lent";
  if (isEqualNumber(portion, 0)) {
    return <span></span>;
  }
  return (
    <span style={{ color: portion > 0 ? "red" : "green" }}>
      {portionText} {formatCurrency(Math.abs(portion), currency)}
    </span>
  );
}

const BillList = ({ travelId, handleUpdateBill }) => {
  const [bills, setBills] = useState<IBill[]>([]);
  const [error, setError] = useState(null);
  const { groupMembers, userId } = useAppContext();

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
        // setBills(mockBills);
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
    <ListGroup as="ul">
      {bills.map((bill) => {
        return <ListGroup.Item key={bill.billId} as="li" className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>{bill.description}</strong>
            <span className="text-muted">{formatDate(bill.expenseDate)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
                <em>{findUsernameById(groupMembers, bill.paidBy)}</em> 
              <span> paid </span>
              <strong>{formatCurrency(bill.amount, bill.currency ?? "USD")}</strong> 
            </span>
            <span>
              <BillPortion
                portion={getBillPortion(bill, userId)}
                currency={bill.currency ?? "USD"}
              />
            </span>
          </div>
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={() => handleUpdateBill(bill)}
          >
            Update
          </button>
        </ListGroup.Item>
    })}
    </ListGroup>
  );
};

export default BillList;
