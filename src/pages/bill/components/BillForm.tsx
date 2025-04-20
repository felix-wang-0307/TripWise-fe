import React, { useState } from "react";
import { createBill, updateBill } from "../services/billServices";
import styles from "../bill.module.css";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useAppContext } from "../../../AppContext";

export const BillFormBody = ({
  activityId,
  userId,
  onSuccess,
  isUpdatingBill = false,
  updatingBill = undefined,
}: {
  activityId: number;
  userId: number;
  onSuccess: () => void;
  isUpdatingBill?: boolean;
  updatingBill?: IBill;
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
          expenseDate: "",
          splitType: "equal",
        }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { groupMembers } = useAppContext();

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required.";
    }

    if (formData.amount === undefined || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount.toString())) {
      newErrors.amount = "Amount must have at most 2 decimal places.";
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = "Expense date is required.";
    }

    if (!formData.participants || formData.participants.length === 0) {
      newErrors.participants = "Select at least one participant.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
      setFormData({ ...formData, [name]: value });
      validateForm();
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

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
      console.error("Error creating bill:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={styles.billForm} noValidate>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
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
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              isInvalid={!!errors.amount}
              placeholder="Enter amount"
              required
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
              isInvalid={!!errors.expenseDate}
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
                checked={formData.participants.includes(Number(participant.userId))}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const { checked } = e.target;
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
            {errors.participants && (
              <div className="text-danger mt-1">{errors.participants}</div>
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
}: {
  activityId: number;
  userId: number;
  isFormVisible: boolean;
  setIsFormVisible: (isVisible: boolean) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  isUpdatingBill?: boolean;
  updatingBill?: IBill;
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
          }}
          isUpdatingBill={isUpdatingBill}
          updatingBill={updatingBill}
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
