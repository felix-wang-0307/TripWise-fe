import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BillForm from "./components/BillForm";
import BillList from "./components/BillList";
import { Button } from "react-bootstrap";

function Bill() {
  const { activityId = "None" } = useParams<{ activityId: string }>();
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("userId") || "None";

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [updatingBill, setUpdatingBill] = useState<IBill | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddBill = () => {
    setUpdatingBill(undefined);
    setIsFormVisible(true);
  };

  const handleUpdateBill = (bill: IBill) => {
    setUpdatingBill(bill);
    setIsFormVisible(true);
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center mt-4">
        <div className="w-100 w-md-50 p-3 border rounded shadow">
          <BillList
            travelId={activityId}
            handleUpdateBill={handleUpdateBill}
            refreshKey={refreshKey}
          />
          <Button onClick={handleAddBill} className="w-100 w-md-25 mt-3">
            Add Bill
          </Button>
        </div>
        <div>
          <BillForm
            activityId={activityId}
            userId={userId}
            isUpdatingBill={!!updatingBill}
            updatingBill={updatingBill}
            isFormVisible={isFormVisible}
            setIsFormVisible={setIsFormVisible}
            setRefreshKey={setRefreshKey}
          />
        </div>
      </div>
    </>
  );
}

export default Bill;
