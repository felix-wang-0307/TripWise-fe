import { useEffect, useState } from "react";
import Navbar from "./homepage/components/navBar";
import Travel from "./travel";
import Bill from "./bill";
import { Tab, Tabs } from "react-bootstrap";
import { AppProvider } from "../AppContext";
import { useParams } from "react-router";

const BACKEND = import.meta.env.VITE_APIURL || import.meta.env.BASE_URL;

export function TravelsAndBill() {
  const [activeTab, setActiveTab] = useState("travel");
  const [groupMembers, setGroupMembers] = useState<IUser[]>([]);
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("userId") || "None";
  const { activityId = "None" } = useParams<{ activityId: string }>();

  useEffect(() => {
    const fetchGroupMembers = async () => {
      const response = await fetch(
        `${BACKEND}/api/travels/${activityId}/members`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userId}`,
          },
        }
      ).then((res) => res.json());
      return response;
    };
    fetchGroupMembers()
      .then((data) => {
        if (data) {
          setGroupMembers(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching group members:", error);
      });
  }, [userId, activityId]);

  return (
    <AppProvider value={{ groupMembers }}>
      <div className="container d-flex justify-content-center align-items-center mt-4">
        <div className="w-100 w-md-50 p-3 rounded shadow">
          <Tabs
            id="travel-and-bill-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "travel")}
            className="mb-3"
          >
            <Tab eventKey="travel" title="Travels">
              <Travel />
            </Tab>
            <Tab eventKey="bill" title="Bills">
              <Bill />
            </Tab>
          </Tabs>
        </div>
      </div>
    </AppProvider>
  );
}
