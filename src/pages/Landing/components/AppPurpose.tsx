import React from "react";
import { ShieldCheck, Calendar, RefreshCw, CheckCircle2, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function AppPurpose() {
  return (
    <section id="app-purpose" className="py-16 bg-white border-y-2 border-[#171614] px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7CEFC0] text-[#171614] text-xs font-bold uppercase tracking-wider mb-3 border border-[#171614]/15">
            <ShieldCheck className="w-4 h-4" /> Official Application Overview
          </div>
          <h2 className="font-cal-sans text-3xl md:text-4xl font-bold text-[#171614] uppercase tracking-tight">
            Application Purpose & Google Calendar Sync
          </h2>
          <p className="mt-3 text-base text-[#2B2A27]/80 max-w-2xl mx-auto font-medium">
            <strong>Cally</strong> is designed to streamline meeting scheduling by connecting directly to your Google Calendar.
          </p>
        </div>

        {/* Main Purpose Card */}
        <div className="bg-[#FDFBF2] border-2 border-[#171614] rounded-2xl p-6 md:p-10 shadow-[6px_6px_0_#171614] space-y-8">
          <div>
            <h3 className="font-cal-sans text-xl font-bold text-[#171614] mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#171614]" /> What is the Purpose of Cally?
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-[#2B2A27]/90">
              <strong>Cally</strong> is an open scheduling web application that eliminates back-and-forth emails when booking appointments, consultations, and team meetings. Users connect their Google Calendar to Cally to automate availability checks and instant meeting creation.
            </p>
          </div>

          {/* Key Google Calendar Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#171614]/15">
            <div className="bg-white border-2 border-[#171614] rounded-xl p-5 shadow-[3px_3px_0_#171614] space-y-2">
              <div className="w-9 h-9 bg-[#B7ACF7]/30 rounded-lg flex items-center justify-center font-bold text-[#171614]">1</div>
              <h4 className="font-cal-sans font-bold text-base text-[#171614]">Read Availability</h4>
              <p className="text-xs md:text-sm text-[#2B2A27]/80 leading-relaxed">
                Cally queries your Google Calendar in real time to read free and busy slots, ensuring clients only book times when you are truly available.
              </p>
            </div>

            <div className="bg-white border-2 border-[#171614] rounded-xl p-5 shadow-[3px_3px_0_#171614] space-y-2">
              <div className="w-9 h-9 bg-[#7CEFC0]/40 rounded-lg flex items-center justify-center font-bold text-[#171614]">2</div>
              <h4 className="font-cal-sans font-bold text-base text-[#171614]">Create & Update Events</h4>
              <p className="text-xs md:text-sm text-[#2B2A27]/80 leading-relaxed">
                When an appointment is confirmed, Cally creates a Google Calendar event on your primary calendar with Google Meet video links and attendee details.
              </p>
            </div>

            <div className="bg-white border-2 border-[#171614] rounded-xl p-5 shadow-[3px_3px_0_#171614] space-y-2">
              <div className="w-9 h-9 bg-[#F3E75B] rounded-lg flex items-center justify-center font-bold text-[#171614]">3</div>
              <h4 className="font-cal-sans font-bold text-base text-[#171614]">Data Protection</h4>
              <p className="text-xs md:text-sm text-[#2B2A27]/80 leading-relaxed">
                Your Google Calendar data is strictly used for scheduling. We never sell your data, display ads, or use calendar details for AI training.
              </p>
            </div>
          </div>

          {/* Links & Verification Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t-2 border-[#171614] gap-4 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2 text-[#171614]">
              <Lock className="w-4 h-4" /> App Name: <span className="underline font-extrabold text-[#171614]">Cally</span> (cally.rupeshhh.in)
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:underline text-[#171614]">
                Read Privacy Policy &rarr;
              </Link>
              <Link to="/terms" className="hover:underline text-[#171614]">
                Read Terms of Service &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default AppPurpose;
