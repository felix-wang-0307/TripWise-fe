import React, { useEffect, useMemo, useState } from "react";
// import styles from "../bill.module.css";
import { Button, Row, Col } from "react-bootstrap";
import { useAppContext } from "../../../AppContext";

import {
  getAllDebtsInTravel,
  calcSettlePlans,
  calcUserBalanceOfDebts,
} from "../services/debtServices";

import { findUsernameById } from "../services/memberServices";
import { formatCurrency } from "../utils";

function BalanceDisplay({ balance }: { balance: number }) {
  if (balance > 0) {
    return (
      <span style={{ color: "green", fontWeight: "bold" }}>
        Overall, you are owed {formatCurrency(balance)}{" "}
      </span>
    );
  } else if (balance < 0) {
    return (
      <span style={{ color: "red", fontWeight: "bold" }}>
        Overall, you owe {formatCurrency(Math.abs(balance))}{" "}
      </span>
    );
  } else {
    return <span>You are all settled!</span>;
  }
}

function SettlementPlan({
  plan,
  groupMembers,
}: {
  plan: IDebtSettlePlan;
  groupMembers: IUser[];
}) {
  return (
    <div>
      <i>{findUsernameById(groupMembers, plan.debtorId)} </i>
      <span> should pay </span>
      <i>{findUsernameById(groupMembers, plan.creditorId)} </i>
      <span> {formatCurrency(Math.abs(plan.amount))} </span>
      <span> in total.</span>
    </div>
  );
}

export default function BillSettlement({
  refreshKey,
}: {
  refreshKey?: number;
}) {
  const { userId, activityId, groupMembers } = useAppContext();
  // const [settlePlans, setSettlePlans] = useState<IDebtSettlePlan[]>([]);
  const [allDebts, setAllDebts] = useState<IDebt[]>([]);
  // const [userBalance, setUserBalance] = useState(0);
  const [showSettlement, setShowSettlement] = useState(false);

  useEffect(() => {
    const fetchAllDebts = async () => {
      try {
        const debts = await getAllDebtsInTravel(activityId);
        setAllDebts(debts);
      } catch (error) {
        console.error("Error fetching all debts:", error);
      }
    };

    fetchAllDebts();
  }, [activityId, userId, refreshKey]);

  const userBalance = useMemo(() => {
    const balance = calcUserBalanceOfDebts(allDebts, Number(userId));
    return balance;
  }, [allDebts, userId]);

  const settlePlans = useMemo(() => {
    const plans = calcSettlePlans(allDebts);
    return plans;
  }, [allDebts]);

  // const userDebts = useMemo(() => {
  //   return allDebts.filter(
  //     (debt) => debt.debtorId === userId || debt.creditorId === userId
  //   );
  // }, [allDebts, userId]);

  return (
    <div className="container mb-4">
      <h3>Bill Settlement</h3>
      <Row>
        <Col>
          <BalanceDisplay balance={userBalance} />
        </Col>
      </Row>
      {settlePlans.length > 0 && (
        <Row>
          <Col>
            <Button
              onClick={() => setShowSettlement(!showSettlement)}
              className="mt-2 mb-2"
            >
              {showSettlement ? "Hide" : "Show"} Settlement Plans
            </Button>
          </Col>
        </Row>
      )}
      {showSettlement && (
        <Row as={"ul"} className="list-group">
          {settlePlans.map((plan, index) => (
            <Col as={"li"} key={index} className="mb-2 ms-4">
              <SettlementPlan plan={plan} groupMembers={groupMembers} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
