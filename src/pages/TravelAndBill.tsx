import { useState } from "react";
import Navbar from "./homepage/components/navBar";
import Travel from "./travel";
import Bill from "./bill";
import { Tab, Tabs } from "react-bootstrap";

export function TravelsAndBill () {
  const [activeTab, setActiveTab] = useState("travel");

  return (
    <>
      <Navbar />
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
    </>
  )
}