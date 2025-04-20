import React, { useState } from "react";
import { createBill, updateBill } from "../services/billServices";
// import styles from "../bill.module.css";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useAppContext } from "../../../AppContext";

export const BillFormBody = ({
  activityId,
  userId,
  onSuccess,
  isUpdatingBill = false,
  updatingBill = undefined,
  toast,
}: {
  activityId: number;
  userId: number;
  onSuccess: () => void;
  isUpdatingBill?: boolean;
  updatingBill?: IBill;
  toast: (message: string, toastType?: string, delay?: number) => void;
}) => {
  const [formData, setFormData] = useState<IBillForm>(
    isUpdatingBill
      ? {
          ...updatingBill,
          expenseDate: updatingBill.expenseDate?.split("T")[0],
          travelId: activityId,
          userId,
        }
      : {
          travelId: activityId,
          userId,
          description: "",
          amount: 0,
          currency: "USD",
          paidBy: userId,
          participants: [],
          expenseDate: new Date().toISOString().split("T")[0],
          splitType: "equal",
        }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { groupMembers } = useAppContext();

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [amountDisplay, setAmountDisplay] = useState<string>("");

  const getFieldError = (field: string): string | null => {
    switch (field) {
      case "description":
        return !formData.description?.trim()
          ? "Description is required."
          : null;
      case "amount":
        if (formData.amount === undefined || formData.amount <= 0)
          return "Amount must be greater than 0.";
        if (!/^\d+(\.\d{1,2})?$/.test(formData.amount.toString()))
          return "Amount must have at most 2 decimal places.";
        return null;
      case "expenseDate":
        return !formData.expenseDate ? "Expense date is required." : null;
      case "participants":
        return formData.participants.length === 0
          ? "Select at least one participant."
          : null;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    ["description", "amount", "expenseDate", "participants"].forEach(
      (field) => {
        const error = getFieldError(field);
        if (error) newErrors[field] = error;
      }
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData({ ...formData, [name]: value });
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast("Please fix the errors in the form.", "danger");
      return;
    }

    try {
      const billData: IBill = {
        ...formData,
        userId,
        travelId: activityId,
        updatedAt: new Date().toISOString(),
      };

      if (isUpdatingBill) {
        await updateBill(updatingBill.expenseId, billData);
      } else {
        billData.createdAt = new Date().toISOString();
        await createBill(billData);
      }

      onSuccess();
    } catch (error) {
      toast(`Failed to ${isUpdatingBill ? "update" : "create"} bill`, "danger");
      console.error("Error creating bill:", error);
    }
  };

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    const isValid = /^\d+(\.\d*)?$/.test(value);
    setTouched((prev) => ({ ...prev, amount: true }));
    if (isValid) {
      if (value.includes(".")) {
        const decimalPart = value.split(".")[1];
        if (decimalPart.length > 2) {
          value = value.slice(0, value.indexOf(".") + 3);
        }
      } 
      setAmountDisplay(value);
      setFormData((prevFormData: IBillForm) => ({
        ...prevFormData,
        amount: parseFloat(value),
      }));
    } else {
      setFormData((prevFormData: IBillForm) => ({
        ...prevFormData,
        amount: 0,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        amount: "Amount must be a valid number.",
      }));
    }
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={
                !!touched.description && !!getFieldError("description")
              }
              placeholder="Enter description"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={6}>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              value={amountDisplay}
              onChange={handleAmountChange}
              isInvalid={!!touched.amount && !!getFieldError("amount")}
              placeholder="Enter amount"
              required
              className="mt-2"
            />
            <Form.Control.Feedback type="invalid">
              {errors.amount}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="currency">
            <Form.Label>Currency</Form.Label>
            <Form.Select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="mt-2"
            >
              <option value="USD">USD</option>
              <option value="CNY">CNY</option>
              <option value="EUR">EUR</option>
              <option value="JPY">JPY</option>
              <option value="GBP">GBP</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={6}>
          <Form.Group controlId="expenseDate">
            <Form.Label>Expense Date</Form.Label>
            <Form.Control
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              isInvalid={
                !!touched.expenseDate && !!getFieldError("expenseDate")
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.expenseDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}></Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group controlId="participants">
            <Form.Label>Split By:</Form.Label>
            {groupMembers.map((participant) => (
              <Form.Check
                key={participant.userId}
                type="checkbox"
                label={participant.username}
                value={participant.userId}
                checked={formData.participants.includes(
                  Number(participant.userId)
                )}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const { checked } = e.target;
                  setTouched((prev) => ({ ...prev, participants: true }));
                  setFormData((prevFormData: IBillForm) => {
                    const updatedParticipants = checked
                      ? [...prevFormData.participants, id]
                      : prevFormData.participants.filter((pid) => pid !== id);
                    return {
                      ...prevFormData,
                      participants: updatedParticipants,
                    };
                  });
                }}
              />
            ))}
            {touched.participants && getFieldError("participants") && (
              <div className="text-danger mt-1">
                {getFieldError("participants")}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className="d-flex justify-content-end">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export const BillForm = ({
  activityId,
  userId,
  isFormVisible,
  setIsFormVisible,
  setRefreshKey,
  isUpdatingBill = false,
  updatingBill = undefined,
  toast,
}: {
  activityId: number;
  userId: number;
  isFormVisible: boolean;
  setIsFormVisible: (isVisible: boolean) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  isUpdatingBill?: boolean;
  updatingBill?: IBill;
  toast: (message: string, toastType?: string, delay?: number) => void;
}) => {
  return (
    <Modal show={isFormVisible} onHide={() => setIsFormVisible(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{isUpdatingBill ? "Edit Bill" : "Add Bill"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BillFormBody
          activityId={activityId}
          userId={userId}
          onSuccess={() => {
            setIsFormVisible(false);
            setRefreshKey((prev) => prev + 1);
            toast(`Bill ${isUpdatingBill ? "updated" : "added"} successfully!`);
          }}
          isUpdatingBill={isUpdatingBill}
          updatingBill={updatingBill}
          toast={toast}
        />
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={() => setIsFormVisible(false)}>
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="bill-form" // Add form ID to link the button to the form
        >
          Submit
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default BillForm;
