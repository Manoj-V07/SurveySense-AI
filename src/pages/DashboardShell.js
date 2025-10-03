import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const DashboardShell = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div>Header and Sidebar will go here.</div>
    </div>
  );
};

export default DashboardShell;
