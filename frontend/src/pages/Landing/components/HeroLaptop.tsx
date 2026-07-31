import React from "react";
import dashboardPc from "../../../public/dashboard-pc.png";

export function HeroLaptop() {
  return (
    <div className="relative" style={{ filter: "drop-shadow(0 28px 60px rgba(0,0,0,0.45))" }}>
      {/* Screen lid */}
      <div className="rounded-t-[14px] rounded-b-[4px] border-[10px] border-b-[6px] border-[#1c1b19] bg-[#1c1b19] overflow-hidden">
        {/* Webcam dot */}
        <div className="flex justify-center py-1.5 bg-[#1c1b19]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#333230]" />
        </div>
        <img
          src={dashboardPc}
          className="w-full h-auto block select-none"
          alt="Cally Dashboard"
          draggable={false}
        />
      </div>
      {/* Hinge */}
      <div className="h-[3px] bg-[#111010]" />
      {/* Keyboard base */}
      <div className="bg-gradient-to-b from-[#2a2826] to-[#1e1d1b] rounded-b-[10px] pt-[10px] pb-[14px] px-6">
        <div className="mx-auto w-[26%] h-[24px] rounded-[6px] border border-[#3a3835] bg-[#232120]" />
      </div>
      {/* Ground shadow */}
      <div className="h-[10px] bg-black/15 rounded-full blur-md mx-8 mt-1" />
    </div>
  );
}
export default HeroLaptop;
