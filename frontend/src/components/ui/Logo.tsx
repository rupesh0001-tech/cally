import React from "react";
import { Link } from "react-router-dom";

export function LogoMarkSvg({ className = "w-[22px] h-[22px]", fill = "#F3E75B" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L14 9L21 11L14 13L12 20L10 13L3 11L10 9L12 2Z" fill={fill} />
    </svg>
  );
}

interface LogoProps {
  to?: string;
  className?: string;
  dark?: boolean;
}

export function Logo({ to = "/", className = "", dark = false }: LogoProps) {
  const containerClass = `flex items-center gap-3 font-cal-sans text-2xl font-bold tracking-tight text-[#171614] ${className}`;
  const markBgClass = `w-[34px] h-[34px] rounded-lg flex items-center justify-center flex-shrink-0 ${
    dark ? "bg-[#7CEFC0]" : "bg-[#171614]"
  }`;
  const fill = dark ? "#171614" : "#F3E75B";

  const content = (
    <>
      <div className={markBgClass}>
        <LogoMarkSvg fill={fill} />
      </div>
      <span className={`logo-text font-cal-sans text-lg font-bold tracking-wide ${dark ? "text-white" : "text-[#171614]"}`}>
        CALLY
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={containerClass}>
        {content}
      </Link>
    );
  }

  return <div className={containerClass}>{content}</div>;
}
