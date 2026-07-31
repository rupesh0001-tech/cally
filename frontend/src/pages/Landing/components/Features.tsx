import React from "react";

export function Features() {
  return (
    <section className="bg-[#FDFBF2] py-28 px-0 text-center" id="features">
      <div className="max-w-[1180px] mx-auto px-8">
        <h2 className="text-[26px] md:text-[38px] font-bold uppercase tracking-[-0.01em] text-[#171614]">
          Features that make booking effortless
        </h2>
        <p className="mt-3.5 text-[#2B2A27] text-base">
          Cally isn't just another calendar app. It's scheduling infrastructure built for how you actually work.
        </p>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6.5 text-left">
          <div className="bg-white border-2 border-[#171614] rounded-[20px] px-6.5 py-[30px] shadow-[5px_5px_0_#171614] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0_#171614] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#171614] flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F3E75B" strokeWidth="2" className="w-[22px] h-[22px]">
                <path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.5 1.5M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.5-1.5" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold mb-3 uppercase tracking-wider text-[#171614]">Smart Booking Links</h3>
            <p className="text-[14.5px] leading-[1.65] text-[#2B2A27]">Share one link and let people pick a time that works for both of you. No more email ping-pong.</p>
          </div>
          <div className="bg-white border-2 border-[#171614] rounded-[20px] px-6.5 py-[30px] shadow-[5px_5px_0_#171614] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0_#171614] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#8C7CF0] flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" className="w-[22px] h-[22px]">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold mb-3 uppercase tracking-wider text-[#171614]">Calendar Sync</h3>
            <p className="text-[14.5px] leading-[1.65] text-[#2B2A27]">Connect Google, Outlook, or iCloud calendars. Cally keeps your availability accurate, automatically.</p>
          </div>
          <div className="bg-white border-2 border-[#171614] rounded-[20px] px-6.5 py-[30px] shadow-[5px_5px_0_#171614] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0_#171614] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#7CEFC0] flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#171614" strokeWidth="2" className="w-[22px] h-[22px]">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold mb-3 uppercase tracking-wider text-[#171614]">Automated Reminders</h3>
            <p className="text-[14.5px] leading-[1.65] text-[#2B2A27]">Cut no-shows with email and SMS reminders sent automatically before every meeting.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Features;
