import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/homepage/homepage.tsx";
import Login from "./pages/login";
import Travel from "./pages/travel";
import Bill from "./pages/bill";
import App from "./App";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/index" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/travel/:groupId" element={<Travel />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/bill/:groupId" element={<Bill />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;