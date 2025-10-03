import React from "react";

const Sidebar = () => {
  return (
    <aside style={{ padding: "1rem", background: "#f5f5f5", width: "200px" }}>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>Dashboard</li>
          <li>Builder</li>
          <li>Reports</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
