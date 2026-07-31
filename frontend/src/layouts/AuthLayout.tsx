import React from "react";
import { Outlet } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";

export function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px]">
      {/* Mini Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b-2 border-[#171614] bg-white">
        <Logo />
        <Button to="/" variant="secondary" size="sm" rounded="xl" shadow="sm">
          Back to Home
        </Button>
      </header>

      {/* Auth container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="bg-white border-2 border-[#171614] rounded-2xl p-4 shadow-[6px_6px_0_#171614] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#171614] transition-all">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
export default AuthLayout;
