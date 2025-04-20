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
  // console.log("Updating Bill:", updatingBill);
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
          userId: userId,
          description: "",
          amount: 0,
          currency: "USD",
          paidBy: userId,
          participants: [],
          expenseDate: "",
          splitType: "equal",
        }
  );

  const { groupMembers } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted with data:", formData);
    e.preventDefault();
    try {
      const billData: IBill = {
        ...formData,
        userId,
        travelId: activityId,
        updatedAt: new Date().toISOString(),
      };
      if (isUpdatingBill) {
        // Update existing bill
        await updateBill(updatingBill.expenseId, billData);
      } else {
        // Create new bill
        billData.createdAt = new Date().toISOString();
        await createBill(billData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={styles.billForm}>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
            />
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
              placeholder="Enter amount"
              required
            />
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
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          {/* <Form.Group controlId="splitType">
            <Form.Label>Split Type</Form.Label>
            <Form.Select
              name="splitType"
              value={formData.splitType}
              onChange={handleChange}
            >
              <option value="equal">Equal</option>
              <option value="unequal">Unequal</option>
            </Form.Select>
          </Form.Group> */}
        </Col>
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
                  const { value, checked } = e.target;
                  const participantId = Number(value);
                  setFormData((prevFormData: IBillForm) => {
                    const updatedParticipants = checked
                      ? [...prevFormData.participants, participantId]
                      : prevFormData.participants.filter((id) => id !== participantId);
                    return {
                      ...prevFormData,
                      participants: updatedParticipants,
                    };
                  });
                }}
              />
            ))}
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
