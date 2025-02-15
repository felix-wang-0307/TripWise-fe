import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/homepage";
import Login from "./pages/login";
import Travel from "./pages/travel";
import Bill from "./pages/bill";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/bill" element={<Bill />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;