import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage/homepage.tsx";
import Layout from "./pages/login/Layout.tsx";
import Login from "./pages/login";
// import Travel from "./pages/travel";
import Bill from "./pages/bill/index.tsx";
import App from "./App";

import Signup from "./pages/login/component/Signup";
import { TravelsAndBill } from "./pages/TravelAndBill.tsx";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/index" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* Signup Page */}
          <Route path="/travel" element={<TravelsAndBill />} />
          <Route path="/travel/:activityId" element={<TravelsAndBill />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/bill/:groupId" element={<Bill />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
