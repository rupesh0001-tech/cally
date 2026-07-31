import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { CreateEventModal } from "../pages/Dashboard/components/CreateEventModal";
import { useApi } from "../lib/api";
import clsx from "clsx";

export function DashboardLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnboardingChecked, setIsOnboardingChecked] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const api = useApi();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        navigate("/login");
      } else {
        // Fetch current user and verify username is set
        api.get("/auth/me")
          .then((res) => {
            const user = res.data.user;
            if (!user || !user.username) {
              navigate("/onboard");
            } else {
              setUsername(user.username);
              setIsOnboardingChecked(true);
            }
          })
          .catch((err) => {
            console.error("DashboardLayout auth check failed:", err);
            // Default to proceed on network error to prevent hard locks
            setIsOnboardingChecked(true);
          });
      }
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || !isSignedIn || !isOnboardingChecked) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px]">
        <div className="w-12 h-12 rounded-full border-4 border-[#171614] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const navNames: Record<string, string> = {
    "/dashboard": "Event Types",
    "/dashboard/bookings": "Bookings",
    "/dashboard/availability": "Availability",
    "/dashboard/calendar": "Calendar",
    "/dashboard/settings": "Settings",
  };
  
  const title = navNames[location.pathname] || "Dashboard";

  return (
    <div className="flex h-screen bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px] overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-[#171614]/30 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar with thin right border */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with thin bottom border */}
        <Header
          title={title}
          showActions={location.pathname === "/dashboard"}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onCreateClick={() => setIsCreateModalOpen(true)}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />
        
        <main className={clsx("flex-1 overflow-y-auto p-4 md:p-8", location.pathname === "/dashboard/analytics" && "no-scrollbar")}>
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>
      </div>

      {/* Create Event Type Overlay Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        username={username}
      />
    </div>
  );
}
export default DashboardLayout;
