import React from "react";
import { Link } from "react-router-dom";
import { FileText, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "July 30, 2026";

  return (
    <div className="min-h-screen bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B7ACF7] text-[#171614] text-xs font-bold uppercase tracking-wider mb-4 border border-[#171614]/15">
            <FileText className="w-4 h-4" /> Legal & Terms
          </div>
          <h1 className="font-cal-sans text-4xl sm:text-5xl font-bold text-[#171614] tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-[#2B2A27]/70">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border-2 border-[#171614] rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0_#171614] space-y-8 text-[#171614]">

          {/* Key Notice Box */}
          <div className="bg-[#7CEFC0]/25 border-2 border-[#171614] rounded-xl p-5 space-y-2">
            <h3 className="font-cal-sans font-bold text-lg flex items-center gap-2 text-[#171614]">
              <Calendar className="w-5 h-5 text-[#171614]" /> Service Summary & Calendar Integration Terms
            </h3>
            <p className="text-sm leading-relaxed text-[#2B2A27]">
              By creating an account or using Cally, you authorize our platform to interact with your connected calendars (including Google Calendar) to synchronize meeting availability, block out busy times, and create scheduled calendar events on your behalf.
            </p>
          </div>

          {/* Section 1: Acceptance of Terms */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              Welcome to Cally ("Service"). By accessing or using our website, scheduling links, or platform services located at <a href="https://cally.rupeshhh.in" className="font-bold underline text-[#171614]">https://cally.rupeshhh.in</a>, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all terms, you may not access or use the Service.
            </p>
          </section>

          {/* Section 2: User Account Responsibilities */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#171614]" /> 2. User Accounts & Responsibilities
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              When creating a Cally account, you must provide accurate and complete registration information. You are responsible for maintaining the security of your authentication sessions and for all activities that occur under your account or custom scheduling links.
            </p>
            <ul className="list-disc pl-6 text-sm space-y-2 text-[#2B2A27]/90">
              <li>You agree not to use the Service for spamming, fraudulent bookings, or unauthorized commercial solicitations.</li>
              <li>You agree not to impersonate another individual, organization, or brand when selecting custom scheduling slugs or account usernames.</li>
            </ul>
          </section>

          {/* Section 3: Third-Party Calendar Authorization */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#171614]" /> 3. Third-Party Calendar Integrations
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              Cally integrates with third-party providers (such as Google Calendar, Microsoft Outlook, and Apple iCloud) via OAuth2 authentication.
            </p>
            <ul className="list-disc pl-6 text-sm space-y-2 text-[#2B2A27]/90">
              <li><strong>Calendar Access Rights:</strong> You explicitly grant Cally authorization to read free/busy status from your linked calendars and write scheduled appointment entries directly onto your calendar.</li>
              <li><strong>Data Accuracy:</strong> While Cally uses real-time API syncing to calculate availability, we are not liable for scheduling conflicts resulting from third-party API downtime, un-synced external events, or user timezone misconfigurations.</li>
              <li><strong>Revocation:</strong> You can disconnect third-party calendar access at any time through your Cally Dashboard or your third-party provider security settings.</li>
            </ul>
          </section>

          {/* Section 4: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[#171614]" /> 4. Limitation of Liability & Disclaimer
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. CALLY DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              IN NO EVENT SHALL CALLY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES RESULTING FROM MISSED MEETINGS OR SCHEDULING DISRUPTIONS.
            </p>
          </section>

          {/* Section 5: Modifications & Termination */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2">
              5. Modifications & Termination
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              We reserve the right to modify these Terms or suspend/terminate user accounts that violate our policies or misuse scheduling features. We will notify users of material changes via email or dashboard announcements.
            </p>
          </section>

          {/* Section 6: Contact Us */}
          <section className="space-y-3 pt-4 border-t border-[#171614]/15">
            <h2 className="font-cal-sans text-xl font-bold">6. Contact Us</h2>
            <p className="text-sm text-[#2B2A27]/80 leading-relaxed">
              If you have any questions regarding these Terms of Service, please contact us:
            </p>
            <div className="bg-[#FDFBF2] border border-[#171614]/20 rounded-xl p-4 text-sm font-medium">
              <p>Email: <a href="mailto:support@rupeshhh.in" className="font-bold underline text-[#171614]">support@rupeshhh.in</a></p>
              <p>Website: <a href="https://cally.rupeshhh.in" className="font-bold underline text-[#171614]">https://cally.rupeshhh.in</a></p>
            </div>
          </section>

          {/* Footer links back */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-[#171614] text-xs font-bold uppercase tracking-wider">
            <Link to="/privacy" className="hover:underline text-[#171614]">
              View Privacy Policy &rarr;
            </Link>
            <Link to="/" className="hover:underline text-[#171614]">
              &larr; Return Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
