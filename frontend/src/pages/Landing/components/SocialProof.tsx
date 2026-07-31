import React from "react";

export function SocialProof() {
  return (
    <section className="bg-[#F3E75B] py-28 px-0 text-center">
      <div className="max-w-[1180px] mx-auto px-8">
        <h2 className="text-[28px] md:text-[44px] font-bold text-[#171614]">50,000+ Teams Already</h2>
        <div className="inline-block bg-[#171614] text-[#FDFBF2] text-[28px] md:text-[52px] font-bold font-cal-sans uppercase px-[30px] pt-2 pb-[14px] rounded-2xl my-3 mb-[18px]">
          Book Smarter With Cally
        </div>
        <p className="text-base text-[#2B2A27]">Join teams saving hours every week with effortless scheduling</p>

        <div className="flex justify-center gap-5 flex-wrap mt-12">
          <div className="border-2 border-[#171614] rounded-[20px] px-[30px] py-5 min-w-[150px] shadow-[3px_3px_0_#171614] bg-[#8C7CF0] text-white">
            <div className="font-cal-sans text-[26px] font-bold">50K+</div>
            <div className="text-[11px] font-bold tracking-wider uppercase mt-1 opacity-80">Active Teams</div>
          </div>
          <div className="border-2 border-[#171614] rounded-[20px] px-[30px] py-5 min-w-[150px] shadow-[3px_3px_0_#171614] bg-white text-[#171614]">
            <div className="font-cal-sans text-[26px] font-bold">2M+</div>
            <div className="text-[11px] font-bold tracking-wider uppercase mt-1 opacity-80">Meetings Booked</div>
          </div>
          <div className="border-2 border-[#171614] rounded-[20px] px-[30px] py-5 min-w-[150px] shadow-[3px_3px_0_#171614] bg-[#7CEFC0] text-[#171614]">
            <div className="font-cal-sans text-[26px] font-bold">4.9★</div>
            <div className="text-[11px] font-bold tracking-wider uppercase mt-1 opacity-80">App Rating</div>
          </div>
          <div className="border-2 border-[#171614] rounded-[20px] px-[30px] py-5 min-w-[150px] shadow-[3px_3px_0_#171614] bg-white text-[#171614]">
            <div className="font-cal-sans text-[26px] font-bold">5hrs+</div>
            <div className="text-[11px] font-bold tracking-wider uppercase mt-1 opacity-80">Saved Weekly</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 text-left">
          <div className="rounded-[20px] border-2 border-[#171614] px-[24px] py-[26px] shadow-[3px_3px_0_#171614] bg-white text-[#171614] relative">
            <span className="absolute -top-3.5 left-[22px] bg-[#8C7CF0] text-white text-[12px] font-bold px-3 py-1 rounded-full border-2 border-[#171614]">01</span>
            <p className="text-[15px] leading-1.6 mt-3 font-medium">"Cally killed our scheduling emails overnight. Booking a call now takes 10 seconds! 🚀"</p>
            <div className="flex items-center gap-2.5 mt-[22px]">
              <div className="w-[34px] h-[34px] rounded-full bg-[#B7ACF7] shrink-0"></div>
              <div>
                <div className="text-[13px] font-bold">Alex Rivera</div>
                <div className="text-[11px] opacity-65">Product Designer</div>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] border-2 border-[#171614] px-[24px] py-[26px] shadow-[3px_3px_0_#171614] bg-[#171614] text-[#FDFBF2] relative">
            <span className="absolute -top-3.5 left-[22px] bg-[#F3E75B] text-[#171614] text-[12px] font-bold px-3 py-1 rounded-full border-2 border-[#171614]">02</span>
            <p className="text-[15px] leading-1.6 mt-3 font-medium">"Best booking tool I've used. Calendar sync just works, every time. 💪"</p>
            <div className="flex items-center gap-2.5 mt-[22px]">
              <div className="w-[34px] h-[34px] rounded-full bg-[#B7ACF7] shrink-0"></div>
              <div>
                <div className="text-[13px] font-bold text-white">Sarah Chen</div>
                <div className="text-[11px] opacity-65 text-white/80">Freelance Dev</div>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] border-2 border-[#171614] px-[24px] py-[26px] shadow-[3px_3px_0_#171614] bg-white text-[#171614] relative">
            <span className="absolute -top-3.5 left-[22px] bg-[#8C7CF0] text-white text-[12px] font-bold px-3 py-1 rounded-full border-2 border-[#171614]">03</span>
            <p className="text-[15px] leading-1.6 mt-3 font-medium">"No-shows dropped to almost zero once we turned on reminders. Huge win. 💚"</p>
            <div className="flex items-center gap-2.5 mt-[22px]">
              <div className="w-[34px] h-[34px] rounded-full bg-[#B7ACF7] shrink-0"></div>
              <div>
                <div className="text-[13px] font-bold">Maya Johnson</div>
                <div className="text-[11px] opacity-65">Content Creator</div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-[34px] text-[13px] text-[#2B2A27]">Real teams, real time saved, zero scheduling chaos</p>
      </div>
    </section>
  );
}
export default SocialProof;
