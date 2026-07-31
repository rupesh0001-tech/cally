import React from "react";
import phoneDashboard from "../../../public/phone-dashboard.png";

export function HeroPhone() {
  return (
    <div className="relative" style={{ filter: "drop-shadow(0 28px 60px rgba(0,0,0,0.45))" }}>
      {/* Phone frame */}
      <div className="relative rounded-[36px] border-[9px] border-[#1c1b19] bg-[#1c1b19] overflow-visible">

        {/* Volume buttons (left) */}
        <div className="absolute left-[-12px] top-[64px] w-[4px] h-[22px] bg-[#2a2826] rounded-l-[3px]" />
        <div className="absolute left-[-12px] top-[94px] w-[4px] h-[22px] bg-[#2a2826] rounded-l-[3px]" />
        {/* Power button (right) */}
        <div className="absolute right-[-12px] top-[78px] w-[4px] h-[32px] bg-[#2a2826] rounded-r-[3px]" />

        {/* Dynamic island */}
        <div className="flex justify-center py-2.5 bg-[#1c1b19]">
          <div className="w-[46px] h-[12px] bg-[#111010] rounded-full" />
        </div>

        {/* Screenshot with curved corners */}
        <div className="overflow-hidden rounded-b-[28px]">
          <img
            src={phoneDashboard}
            className="w-full h-auto block select-none rounded-b-[28px]"
            alt="Cally Mobile"
            draggable={false}
          />
        </div>

      </div>

      {/* Ground shadow */}
      <div className="h-[8px] bg-black/15 rounded-full blur-md mx-2 mt-1" />
    </div>
  );
}
export default HeroPhone;
