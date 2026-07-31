import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import { AppRoutes } from "./routes";
import "./index.css";

const isProductionHost = typeof window !== "undefined" && (
  window.location.hostname.includes("cally.rupeshhh.in") ||
  (!window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1"))
);

const CLERK_PUBLISHABLE_KEY =
  (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY ||
  (typeof window !== "undefined" && (window as any).process?.env?.VITE_CLERK_PUBLISHABLE_KEY) ||
  (isProductionHost
    ? "pk_live_Y2xlcmsucnVwZXNoaGguaW4k"
    : "pk_test_d29ydGh5LWRhc3NpZS01Ny5jbGVyay5hY2NvdW50cy5kZXYk");

export function App() {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FDFBF2] text-[#171614] font-medium p-4 text-center">
        Authentication configuration missing. Please check VITE_CLERK_PUBLISHABLE_KEY.
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
