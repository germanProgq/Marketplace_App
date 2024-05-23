import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar";
import Footer from "../footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="container">
        <Outlet />
        </div>       
      </div>
      <Footer />
    </>
  );
};

export default Layout;