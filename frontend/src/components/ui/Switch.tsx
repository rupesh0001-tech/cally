import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  className?: string;
}

export function Switch({ checked, onChange, ariaLabel = "Toggle Switch", className = "" }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-[44px] h-[26px] rounded-full border border-[#171614]/15 transition-colors duration-200 focus:outline-none cursor-pointer ${
        checked ? "bg-[#7CEFC0]" : "bg-[#E4E1D4]"
      } ${className}`}
      aria-label={ariaLabel}
    >
      <div
        className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full border border-[#171614]/10 bg-white transition-transform duration-200 ${
          checked ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}
