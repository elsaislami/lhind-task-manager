import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="container">
      <h1> layout</h1>

      <Outlet />
    </div>
  );
};

export default Layout;
