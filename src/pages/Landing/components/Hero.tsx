import React from "react";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { HeroLaptop } from "./HeroLaptop";
import { HeroPhone } from "./HeroPhone";
import clsx from "clsx";

export function Hero() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleCreateLink = () => {
    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="bg-[#F3E75B] relative pt-[70px] pb-0">
      <div className={clsx('max-w-[820px]', 'mx-auto', 'px-8', 'text-center', 'relative', 'z-10')}>
        <span className={clsx('inline-flex', 'items-center', 'gap-1.5', 'text-[13px]', 'font-bold', 'tracking-wider', 'bg-[#171614]', 'text-[#F3E75B]', 'px-[18px]', 'py-2', 'rounded-full', 'mb-[26px]')}>
          ✦ Cally — Open Calendar & Scheduling Application
        </span>
        <h1 className={clsx('text-[34px]', 'md:text-[58px]', 'font-bold', 'leading-[1.08]', 'tracking-[-0.01em]', 'uppercase', 'text-[#171614]')}>
          Cally: Open Calendar & Meeting Scheduling Infrastructure
        </h1>
        <p className={clsx('mt-[26px]', 'text-[17px]', 'leading-1.6', 'text-[#2B2A27]', 'max-w-[680px]', 'mx-auto', 'font-medium')}>
          <strong>Cally</strong> is an automated scheduling application that syncs with your Google Calendar to manage availability, eliminate double-bookings, and instantly schedule meetings onto your Google Calendar.
        </p>

        <div className={clsx('mt-[34px]', 'flex', 'justify-center')}>
          <Button
            onClick={handleCreateLink}
            variant="primary"
            size="lg"
            rounded="full"
          >
            Create Your Link
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={clsx('w-4', 'h-4', 'ml-2')}
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="hidden md:block max-w-[1100px] mx-auto px-4 md:px-8 mt-10">
        <div className="flex items-end justify-center gap-4 md:gap-8">
          {/* Laptop — 76% width */}
          <div className="w-[76%] shrink-0">
            <HeroLaptop />
          </div>
          {/* Phone — remaining ~24%, aligned to bottom of laptop */}
          <div className="w-[22%] shrink-0">
            <HeroPhone />
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
