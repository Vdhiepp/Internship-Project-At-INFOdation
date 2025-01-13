import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "../styles/AppLayout.css"
import Footer from "../components/footer";
import Header from "../components/header";

const AppLayout = () => {

  const idToken = localStorage.getItem("id_token");
  if (!idToken) {
    window.location.href = "/login";
    return null;
  }

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        {/* <Menu isOpen={isSidebarOpen} setIsOpen={setSidebarOpen}/> */}
        <main className="flex-grow-1">
          <Outlet context={{ isSidebarOpen, toggleSidebar }} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
