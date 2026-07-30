import React from "react";
import { Link } from "react-router-dom";
import { Shield, Calendar, Lock, Eye, RefreshCw, FileText } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "July 30, 2026";

  return (
    <div className="min-h-screen bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7CEFC0] text-[#171614] text-xs font-bold uppercase tracking-wider mb-4 border border-[#171614]/15">
            <Shield className="w-4 h-4" /> Legal & Privacy
          </div>
          <h1 className="font-cal-sans text-4xl sm:text-5xl font-bold text-[#171614] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm font-medium text-[#2B2A27]/70">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border-2 border-[#171614] rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0_#171614] space-y-8 text-[#171614]">
          
          {/* Key Notice Box */}
          <div className="bg-[#B7ACF7]/20 border-2 border-[#171614] rounded-xl p-5 space-y-2">
            <h3 className="font-cal-sans font-bold text-lg flex items-center gap-2 text-[#171614]">
              <Calendar className="w-5 h-5 text-[#171614]" /> Google Calendar Data Access Disclosure
            </h3>
            <p className="text-sm leading-relaxed text-[#2B2A27]">
              Cally connects to your Google Calendar to read your availability and automatically schedule meetings. We <strong>only</strong> access calendar data required to check conflicts and insert scheduled events onto your calendar. We <strong>never</strong> store your private event descriptions, sell your data, or use calendar information for advertising or AI model training.
            </p>
          </div>

          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2">
              1. Overview & Information We Collect
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              Cally ("we", "our", or "us") provides open scheduling infrastructure allowing users to manage meeting availability and accept appointments. To deliver this service, we collect limited personal data:
            </p>
            <ul className="list-disc pl-6 text-sm space-y-2 text-[#2B2A27]/90">
              <li><strong>Account Profile Information:</strong> Email address, name, avatar image, and timezone provided during authentication.</li>
              <li><strong>Scheduling Preferences:</strong> Working hours, availability slots, buffer times, and event type configurations.</li>
              <li><strong>Booking Details:</strong> Attendee names, email addresses, meeting notes, and selected time slots provided when an appointment is scheduled.</li>
              <li><strong>Connected Third-Party Calendars:</strong> OAuth authorization tokens and event metadata from Google Calendar, Microsoft Outlook, or Apple iCloud.</li>
            </ul>
          </section>

          {/* Section 2: How We Use Google Calendar Data */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2 flex items-center gap-2">
              <Eye className="w-6 h-6 text-[#171614]" /> 2. How We Use Google Calendar Data
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              When you connect your Google Account to Cally, you grant us permission to access Google Calendar APIs under the following scopes:
            </p>
            <div className="bg-[#FDFBF2] border border-[#171614]/20 rounded-xl p-4 space-y-3 text-xs sm:text-sm font-mono">
              <p><strong>`https://www.googleapis.com/auth/calendar.events`</strong> — Read and write access to calendar events.</p>
              <p><strong>`https://www.googleapis.com/auth/calendar.readonly`</strong> — Read access to view busy/free time slots.</p>
            </div>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              Specifically, we use this access to:
            </p>
            <ol className="list-decimal pl-6 text-sm space-y-2 text-[#2B2A27]/90">
              <li><strong>Check Busy Time Ranges:</strong> Query your primary Google Calendar in real time to calculate free/busy slots and prevent double bookings on your public scheduling link.</li>
              <li><strong>Create Scheduled Events:</strong> Automatically insert confirmed meetings onto your primary Google Calendar, including Google Meet video call links and attendee details.</li>
              <li><strong>Update or Cancel Events:</strong> Modify or remove calendar invitations if a meeting is rescheduled or cancelled by you or the attendee.</li>
            </ol>
          </section>

          {/* Section 3: Data Protection & Google Limited Use Policy */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2 flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#171614]" /> 3. Google API Services User Data Policy
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              Cally's use and transfer of information received from Google APIs to any other app adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="underline font-bold text-[#171614]">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>
            <ul className="list-disc pl-6 text-sm space-y-2 text-[#2B2A27]/90">
              <li>We <strong>do not</strong> transfer Google user data to third parties unless necessary to provide or improve user-facing features.</li>
              <li>We <strong>do not</strong> use Google user data for serving advertisements.</li>
              <li>We <strong>do not</strong> allow humans to read Google user data unless authorized for security troubleshooting or required by applicable law.</li>
              <li>We <strong>do not</strong> use Google Calendar data to train artificial intelligence or machine learning models.</li>
            </ul>
          </section>

          {/* Section 4: Data Retention & Revocation */}
          <section className="space-y-3">
            <h2 className="font-cal-sans text-2xl font-bold border-b-2 border-[#171614] pb-2 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-[#171614]" /> 4. Data Security & Revocation Rights
            </h2>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              Your Google OAuth tokens are stored in encrypted databases using industry-standard AES-256 encryption protocols.
            </p>
            <p className="text-sm leading-relaxed text-[#2B2A27]/90">
              You retain full ownership and control over your calendar connection. You can disconnect your Google Calendar at any time from your Cally Account Settings or by revoking access directly via <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="underline font-bold text-[#171614]">Google Security Account Permissions</a>. Upon disconnection, your OAuth tokens are permanently deleted from our servers.
            </p>
          </section>

          {/* Section 5: Contact Us */}
          <section className="space-y-3 pt-4 border-t border-[#171614]/15">
            <h2 className="font-cal-sans text-xl font-bold">5. Contact Us</h2>
            <p className="text-sm text-[#2B2A27]/80 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our calendar data handling practices, please contact us:
            </p>
            <div className="bg-[#FDFBF2] border border-[#171614]/20 rounded-xl p-4 text-sm font-medium">
              <p>Email: <a href="mailto:support@rupeshhh.in" className="font-bold underline text-[#171614]">support@rupeshhh.in</a></p>
              <p>Website: <a href="https://cally.rupeshhh.in" className="font-bold underline text-[#171614]">https://cally.rupeshhh.in</a></p>
            </div>
          </section>

          {/* Footer links back */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-[#171614] text-xs font-bold uppercase tracking-wider">
            <Link to="/terms" className="hover:underline text-[#171614]">
              View Terms of Service &rarr;
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
