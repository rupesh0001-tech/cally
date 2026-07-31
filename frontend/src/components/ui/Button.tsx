import React from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonRounded = "full" | "xl" | "14px" | "lg" | "md" | "none";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  shadow?: "none" | "sm" | "md";
  href?: string; // If provided, renders an <a> link
  to?: string;   // If provided, renders a React Router <Link>
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  rounded = "full",
  shadow = "md",
  href,
  to,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-bold transition-all select-none cursor-pointer border-2 disabled:opacity-65 disabled:cursor-not-allowed";

  // Variant classes
  const variantClasses = {
    primary: "bg-[#171614] text-[#FDFBF2] border-[#171614]",
    secondary: "bg-white text-[#171614] border-[#171614] hover:bg-[#F3E75B]",
    accent: "bg-[#F3E75B] text-[#171614] border-[#171614]",
    ghost: "bg-transparent text-[#171614] border-transparent hover:bg-[#171614]/5",
  }[variant];

  // Size classes
  const sizeClasses = {
    xs: "text-xs px-3 py-1.5",
    sm: "text-xs px-4 py-2",
    md: "text-sm px-5 py-3",
    lg: "text-[15px] px-[26px] py-3.5",
  }[size];

  // Rounded classes
  const roundedClasses = {
    full: "rounded-full",
    xl: "rounded-xl",
    "14px": "rounded-[14px]",
    lg: "rounded-lg",
    md: "rounded-md",
    none: "rounded-none",
  }[rounded];

  // Shadow classes
  const shadowClasses = shadow === "none"
    ? ""
    : shadow === "sm"
    ? "shadow-[2px_2px_0_#171614] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#171614]"
    : "shadow-[3px_3px_0_#171614] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#171614]";

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${roundedClasses} ${shadowClasses} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} onClick={onClick as any} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick as any} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses}>
      {children}
    </button>
  );
}
