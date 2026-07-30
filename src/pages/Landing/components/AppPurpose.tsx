import React from "react";
import { ShieldCheck, Calendar, Lock, CheckCircle2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function AppPurpose() {
  return (
    <section id="app-purpose" className="py-16 bg-white border-y-2 border-[#171614] px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7CEFC0] text-[#171614] text-xs font-bold uppercase tracking-wider mb-3 border border-[#171614]/15">
            <ShieldCheck className="w-4 h-4" /> Application Overview & Google Integration
          </div>
          <h2 className="font-cal-sans text-4xl md:text-5xl font-bold text-[#171614] tracking-tight">
            cally
          </h2>
          <p className="mt-2 text-base md:text-lg text-[#2B2A27] font-semibold">
            AI-Powered Calendar & Scheduling Assistant
          </p>
        </div>

        {/* Main Purpose Box */}
        <div className="bg-[#FDFBF2] border-2 border-[#171614] rounded-2xl p-6 md:p-10 shadow-[6px_6px_0_#171614] space-y-8">
          
          {/* Section: Application Purpose */}
          <div className="space-y-3">
            <h3 className="font-cal-sans text-xl font-bold text-[#171614] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#171614]" /> Purpose of cally
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-[#2B2A27]/90">
              <strong>cally</strong> is an automated scheduling and calendar assistant that helps users manage meetings, appointments, and events without back-and-forth emails.
            </p>
          </div>

          {/* Section: Why Google Sign-In & Google Calendar Scopes */}
          <div className="bg-white border-2 border-[#171614] rounded-xl p-6 shadow-[4px_4px_0_#171614] space-y-4">
            <h4 className="font-cal-sans font-bold text-lg text-[#171614] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#171614]" /> Why Google Sign-In?
            </h4>
            <p className="text-sm text-[#2B2A27]/90 leading-relaxed">
              We use <strong>Google Sign-In</strong> to securely access your Google Calendar after your permission. This allows <strong>cally</strong> to perform the following features:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium text-[#171614]">
              <li className="flex items-center gap-2.5 bg-[#FDFBF2] p-3 rounded-lg border border-[#171614]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7CEFC0]"></span> View calendar availability (read busy/free time)
              </li>
              <li className="flex items-center gap-2.5 bg-[#FDFBF2] p-3 rounded-lg border border-[#171614]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7CEFC0]"></span> Create events on your Google Calendar
              </li>
              <li className="flex items-center gap-2.5 bg-[#FDFBF2] p-3 rounded-lg border border-[#171614]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7CEFC0]"></span> Update events when rescheduled
              </li>
              <li className="flex items-center gap-2.5 bg-[#FDFBF2] p-3 rounded-lg border border-[#171614]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7CEFC0]"></span> Delete events when requested
              </li>
            </ul>
          </div>

          {/* Section: Privacy & Data Protection */}
          <div className="space-y-2">
            <h4 className="font-cal-sans font-bold text-lg text-[#171614] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#171614]" /> Privacy & Data Security
            </h4>
            <p className="text-sm text-[#2B2A27]/90 leading-relaxed">
              Your Google Calendar data is only used to provide calendar functionality. We do not sell your data, display advertisements, or use calendar details for AI model training.
            </p>
          </div>

          {/* Footer Verification Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t-2 border-[#171614] gap-4 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2 text-[#171614]">
              <Mail className="w-4 h-4" /> Contact Support: <a href="mailto:support@rupeshhh.in" className="underline font-extrabold text-[#171614]">support@rupeshhh.in</a>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:underline text-[#171614]">
                Privacy Policy &rarr;
              </Link>
              <Link to="/terms" className="hover:underline text-[#171614]">
                Terms of Service &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
export default AppPurpose;
