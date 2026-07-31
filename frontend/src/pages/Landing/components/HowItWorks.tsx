import React from "react";
import bookingPage from "../../../public/phone-dashboard.png";

export function HowItWorks() {
  return (
    <section className="bg-[#171614] text-[#FDFBF2] py-28" id="how">
      <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] gap-[60px] items-center">
        <div className="text-left">
          <h2 className="text-[26px] md:text-[38px] font-bold uppercase mb-[44px] text-white">How Cally works?</h2>
          <div className="flex gap-5 mb-[34px]">
            <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center font-bold font-cal-sans text-[15px] shrink-0 bg-[#8C7CF0] border-2 border-[#8C7CF0] text-white">01</div>
            <div>
              <h3 className="text-base font-bold uppercase mb-2 tracking-wide text-white">Share your booking link</h3>
              <p className="text-sm leading-1.6 opacity-70 max-w-[360px]">Send your personal link via email, Slack, or embed it on your own website. No signup required to book.</p>
            </div>
          </div>
          <div className="flex gap-5 mb-[34px]">
            <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center font-bold font-cal-sans text-[15px] shrink-0 bg-[#FDFBF2] text-[#171614] border-2 border-[#FDFBF2]">02</div>
            <div>
              <h3 className="text-base font-bold uppercase mb-2 tracking-wide text-white">They pick a time</h3>
              <p className="text-sm leading-1.6 opacity-70 max-w-[360px]">Invitees see your real-time availability across all connected calendars and book instantly — no back and forth.</p>
            </div>
          </div>
          <div className="flex gap-5 mb-[34px]">
            <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center font-bold font-cal-sans text-[15px] shrink-0 bg-[#8C7CF0] border-2 border-[#8C7CF0] text-white">03</div>
            <div>
              <h3 className="text-base font-bold uppercase mb-2 tracking-wide text-white">It's on every calendar</h3>
              <p className="text-sm leading-1.6 opacity-70 max-w-[360px]">Cally confirms the meeting and syncs it automatically, with reminders sent so nobody forgets.</p>
            </div>
          </div>
        </div>
        <div className="relative h-[520px] mt-10 md:mt-0 md:flex hidden items-center justify-center">
          <div className="absolute w-[34px] h-[34px] border-[5px] border-[#8C7CF0] rounded-full top-5 right-[6%] opacity-90"></div>
          <div className="absolute w-[90px] h-[90px] bg-[radial-gradient(#FDFBF2_1.6px,transparent_1.6px)] bg-[length:12px_12px] opacity-50 bottom-2.5 right-0"></div>

          {/* Booking page screenshot in phone frame */}
          <div className="relative mx-auto w-[260px] h-[500px] rounded-[38px] border-[8px] border-[#2a2926] bg-[#141311] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-[#141311] rounded-full z-10" />
            <img
              src={bookingPage}
              className="w-full h-full object-cover object-top select-none rounded-[30px]"
              alt="Cally Booking Page"
            />
          </div>

          {/* Floating confirmation badge */}
          <div className="absolute bottom-16 -left-4 bg-[#7CEFC0] text-[#171614] border-2 border-[#171614] rounded-2xl px-4 py-3 shadow-[3px_3px_0_#171614] text-left">
            <div className="text-[11px] font-extrabold uppercase tracking-wider">✓ Booking Confirmed</div>
            <div className="text-[10px] font-semibold opacity-70 mt-0.5">Cal invite sent to both</div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HowItWorks;

