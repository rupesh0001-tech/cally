import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF2]">
      {/* Cally Header/Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px]">
        <Outlet />
      </main>

      {/* Cally Footer */}
      <Footer />
    </div>
  );
}
export default PublicLayout;
