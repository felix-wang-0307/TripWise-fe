// Layout.tsx
import React, { useState } from "react";
import Navbar from "../homepage/components/navBar";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  const [userId, setUserId] = useState("");

  return (
    <div>
      <Navbar onUserIdLoaded={setUserId} />
      <Outlet context={{ userId }} />
    </div>
  );
};

export default Layout;
