import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BillForm from "./components/BillForm";
import BillList from "./components/BillList";
import { Button, Toast } from "react-bootstrap";
import { deleteBill } from "./services/billServices";
import BillSettlement from "./components/BillSettlement";

function Bill() {
  const { activityId } = useParams<{ activityId: string }>();
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("userId") || "None";

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [updatingBill, setUpdatingBill] = useState<IBill | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const toast = (message: string, toastType = "success", delay = 3000) => {
    setToastMessage(message);
    setShowToast(true);
    setToastType(toastType);
    setTimeout(() => {
      setShowToast(false);
    }, delay);
  }

  const hideToast = () => toast("", "", 0);

  const handleAddBill = () => {
    setUpdatingBill(undefined);
    setIsFormVisible(true);
  };

  const handleUpdateBill = (bill: IBill) => {
    setUpdatingBill(bill);
    setIsFormVisible(true);
  };

  const handleDeleteBill = (billId: number) => {
    deleteBill(billId)
      .then(() => {
        setRefreshKey((prev) => prev + 1);
        toast("Bill deleted successfully!", "success");
      })
      .catch((error) => {
        console.error("Error deleting bill:", error);
        toast("Failed to delete bill", "danger");
      });
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center mt-4">
        <div className="w-100 w-md-50 p-3">
          <BillSettlement refreshKey={refreshKey}/>
          <BillList
            travelId={activityId}
            handleUpdateBill={handleUpdateBill}
            handleDeleteBill={handleDeleteBill}
            refreshKey={refreshKey}
          />
          <Button onClick={handleAddBill} className="w-100 w-md-25 mt-3">
            Add Bill
          </Button>
        </div>
        <div>
          <BillForm
            activityId={parseInt(activityId)}
            userId={parseInt(userId)}
            isUpdatingBill={!!updatingBill}
            updatingBill={updatingBill}
            isFormVisible={isFormVisible}
            setIsFormVisible={setIsFormVisible}
            setRefreshKey={setRefreshKey}
            toast={toast}
          />
        </div>
      </div>

      <Toast
        show={showToast}
        onClose={hideToast}
        delay={3000}
        autohide
        bg={toastType === "success" ? "success" : "danger"}
        style={{
          position: "fixed",
          top: 20,
          left: 100,
          zIndex: 999,
        }}
        className="text-white"
        onClick={hideToast}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
}

export default Bill;
