import React from "react";
import { Link } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/react";
import { LogoMarkSvg } from "../ui/Logo";
import { Button } from "../ui/Button";

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="bg-[#F3E75B] py-5 px-2.5 border-b-2 border-[#171614]">
      <div className="max-w-[1180px] mx-auto px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-[42px] h-[42px] bg-[#171614] rounded-xl flex items-center justify-center shrink-0">
            <LogoMarkSvg />
          </div>
          <div className="leading-[1.15]">
            <div className="font-cal-sans font-bold text-[19px] tracking-wide text-[#171614]">CALLY</div>
            <div className="text-[12px] font-medium text-[#2B2A27]/75">Scheduling, Simplified</div>
          </div>
        </Link>
        
        <nav className="flex items-center gap-7 font-semibold text-[15px] text-[#171614]">
          <Link to="/blogs" className="opacity-85 hover:opacity-100 transition-opacity">Blog</Link>
          <a href="/#features" className="opacity-85 hover:opacity-100 transition-opacity">Features</a>
          <a href="/#how" className="opacity-85 hover:opacity-100 transition-opacity">How It Works</a>
          
          {!isLoaded ? (
            <div className="w-20 h-8 opacity-0"></div>
          ) : isSignedIn ? (
            <>
              <Link to="/dashboard" className="text-md font-semibold text-[#171614] hover:opacity-100 opacity-85 transition-opacity">
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link to="/login" className="text-md font-bold tracking-wider text-[#171614] hover:opacity-100 opacity-85 transition-opacity">
                Sign In
              </Link>
              <Button to="/register" variant="primary" size="sm" rounded="full">
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
