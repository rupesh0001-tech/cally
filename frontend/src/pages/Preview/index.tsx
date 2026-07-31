import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, Globe, MapPin, Video, ChevronLeft, ChevronRight, ArrowLeft, Sparkles, Check, Heart } from "lucide-react";

interface HostDetails {
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  username: string;
}

interface EventType {
  title: string;
  duration: number;
  price: number;
  locationType: string;
  locationDetails: string;
  bookingFields: Array<{ id: string; label: string; type: string; status: "Hidden" | "Optional" | "Required"; editable: boolean }>;
}

export default function DemoPreviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract query params
  const initialTheme = searchParams.get("theme") || "classic";
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const [activeTheme, setActiveTheme] = useState(initialTheme);
  const [step, setStep] = useState<"dateTime" | "form" | "success">("dateTime");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Form Inputs State
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Month selector calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sync state if query param changes
  useEffect(() => {
    const t = searchParams.get("theme");
    if (t && t !== activeTheme) {
      setActiveTheme(t);
    }
  }, [searchParams]);

  const handleThemeChange = (newTheme: string) => {
    setActiveTheme(newTheme);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("theme", newTheme);
    setSearchParams(newParams);
  };

  // Mock Data
  const host: HostDetails = {
    firstName: "Alex",
    lastName: "Rivera",
    imageUrl: null,
    username: "alexrivera",
  };

  const eventType: EventType = {
    title: "30 Minute Strategy Session",
    duration: 30,
    price: 49.00,
    locationType: "Video",
    locationDetails: "Google Meet",
    bookingFields: [
      { id: "name", label: "Full Name", type: "Short Text", status: "Required", editable: false },
      { id: "email", label: "Email Address", type: "Short Text", status: "Required", editable: false },
      { id: "phone", label: "Phone Number", type: "Phone", status: "Optional", editable: true },
      { id: "goal", label: "What is your main goal for this call?", type: "Long Text", status: "Required", editable: true },
    ],
  };

  // --- CALENDAR GENERATION HELPERS ---
  const getDaysInMonth = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayIndex = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth();
    let idx = new Date(year, month, 1).getDay();
    return idx === 0 ? 6 : idx - 1; // Mon-Sun
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDaySelectable = (dayNum: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
    
    // Selectable if in future and not a weekend
    if (checkDate < today) return false;
    const day = checkDate.getDay();
    return day !== 0 && day !== 6; // Mon-Fri enabled
  };

  // Set default selectable date on mount
  useEffect(() => {
    const today = new Date();
    let defaultDate = new Date(today);
    for (let offset = 0; offset < 30; offset++) {
      const checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      if (checkDate.getDay() !== 0 && checkDate.getDay() !== 6) {
        defaultDate = checkDate;
        break;
      }
    }
    setSelectedDate(defaultDate);
    setCurrentMonth(defaultDate);
  }, []);

  // --- TIME SLOTS ---
  const mockSlots = ["09:00", "10:00", "11:30", "13:30", "15:00", "16:30"];

  const formatTimeSlotLabel = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  // --- THEMES STYLES (MATCHES BOOKING/INDEX.TSX) ---
  const getThemeStyles = () => {
    switch (activeTheme) {
      case "minimal":
        return {
          wrapper: "bg-[#FAFAFA] min-h-[calc(100vh-64px)] text-gray-800 font-sans flex items-center justify-center p-4 md:p-8 transition-all",
          card: "bg-white border border-gray-200 rounded-xl shadow-sm",
          accentText: "text-blue-600",
          accentBg: "bg-blue-600 hover:bg-blue-700 text-white font-bold",
          buttonSelected: "bg-blue-50 text-blue-600 border-blue-200",
          tagBg: "bg-gray-100 text-gray-700",
          
          textMain: "text-gray-900",
          textMuted: "text-gray-500",
          textFaded: "text-gray-400",
          bgMain: "bg-white",
          bgSub: "bg-gray-55",
          borderMain: "border-gray-200",
          borderSub: "border-gray-100",
          inputBg: "bg-white",
          inputText: "text-gray-800",
          inputPlaceholder: "placeholder:text-gray-400/70",
          inputBorder: "border-gray-250 hover:border-gray-300",
          inputFocus: "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          dayHover: "hover:bg-gray-50",
          timeSlotBg: "bg-white",
          timeSlotHover: "hover:bg-gray-50 hover:border-gray-300",
          dayBg: "bg-white",
          dayDisabledText: "text-gray-200",
        };
      case "dark":
        return {
          wrapper: "bg-[#09090B] min-h-[calc(100vh-64px)] text-[#F4F4F5] font-sans flex items-center justify-center p-4 md:p-8 transition-all",
          card: "bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl",
          accentText: "text-[#7CEFC0]",
          accentBg: "bg-[#7CEFC0] hover:bg-[#58D9A6] text-[#09090B] font-extrabold shadow-[2px_2px_0_rgba(124,239,192,0.15)]",
          buttonSelected: "bg-[#7CEFC0] text-[#09090B] border-[#7CEFC0] shadow-[2px_2px_0_rgba(124,239,192,0.15)]",
          tagBg: "bg-[#27272A] text-[#E4E4E7] border border-[#3F3F46]",
          
          textMain: "text-[#F4F4F5]",
          textMuted: "text-[#A1A1AA]",
          textFaded: "text-[#71717A]",
          bgMain: "bg-[#18181B]",
          bgSub: "bg-[#27272A]/40",
          borderMain: "border-[#27272A]",
          borderSub: "border-[#27272A]/60",
          inputBg: "bg-[#121214]",
          inputText: "text-[#F4F4F5]",
          inputPlaceholder: "placeholder:text-zinc-500",
          inputBorder: "border-zinc-800 hover:border-zinc-700",
          inputFocus: "focus:border-[#7CEFC0] focus:ring-2 focus:ring-[#7CEFC0]/20",
          dayHover: "hover:bg-[#27272A] hover:text-white",
          timeSlotBg: "bg-[#09090B]",
          timeSlotHover: "hover:bg-[#27272A] hover:border-[#3F3F46]",
          dayBg: "bg-[#09090B]",
          dayDisabledText: "text-[#71717A]/25",
        };
      case "sage":
        return {
          wrapper: "bg-[#F4F7F4] min-h-[calc(100vh-64px)] text-[#1E2E1F] font-sans flex items-center justify-center p-4 md:p-8 transition-all",
          card: "bg-white border border-[#E1EDE1] rounded-2xl shadow-md",
          accentText: "text-emerald-800",
          accentBg: "bg-emerald-700 hover:bg-emerald-800 text-white font-bold",
          buttonSelected: "bg-emerald-50 text-emerald-800 border-emerald-200",
          tagBg: "bg-emerald-50 text-emerald-900",
          
          textMain: "text-[#1E2E1F]",
          textMuted: "text-[#3D4F3E]",
          textFaded: "text-[#3D4F3E]/60",
          bgMain: "bg-white",
          bgSub: "bg-[#F4F7F4]/40",
          borderMain: "border-[#E1EDE1]",
          borderSub: "border-[#E1EDE1]/60",
          inputBg: "bg-white",
          inputText: "text-[#1E2E1F]",
          inputPlaceholder: "placeholder:text-[#3D4F3E]/40",
          inputBorder: "border-emerald-100 hover:border-emerald-250",
          inputFocus: "focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50",
          dayHover: "hover:bg-[#F4F7F4]",
          timeSlotBg: "bg-white",
          timeSlotHover: "hover:bg-[#F4F7F4] hover:border-emerald-200",
          dayBg: "bg-white",
          dayDisabledText: "text-[#3D4F3E]/20",
        };
      case "classic":
      default:
        return {
          wrapper: "bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px] min-h-[calc(100vh-64px)] text-[#171614] font-sans flex items-center justify-center p-4 md:p-8 transition-all",
          card: "bg-white border border-[#E4E1D4] rounded-2xl shadow-[3px_3px_0_rgba(23,22,20,0.08)]",
          accentText: "text-[#171614]",
          accentBg: "bg-[#7CEFC0] hover:bg-[#58D9A6] text-[#171614] border border-[#171614]/15 shadow-[2px_2px_0_rgba(23,22,20,0.15)]",
          buttonSelected: "bg-[#7CEFC0] text-[#171614] border-[#171614]/15 shadow-[2px_2px_0_rgba(23,22,20,0.08)]",
          tagBg: "bg-[#B7ACF7]/25 text-[#171614] border border-[#171614]/10",
          
          textMain: "text-[#171614]",
          textMuted: "text-[#2B2A27]/70",
          textFaded: "text-[#2B2A27]/40",
          bgMain: "bg-white",
          bgSub: "bg-[#FDFBF2]/30",
          borderMain: "border-[#E4E1D4]",
          borderSub: "border-[#E4E1D4]/60",
          inputBg: "bg-white",
          inputText: "text-[#171614]",
          inputPlaceholder: "placeholder:text-[#2B2A27]/35",
          inputBorder: "border-[#E4E1D4] hover:border-[#171614]/30",
          inputFocus: "focus:border-[#171614] focus:ring-2 focus:ring-[#171614]/5",
          dayHover: "hover:bg-[#FDFBF2]",
          timeSlotBg: "bg-white",
          timeSlotHover: "hover:bg-[#FDFBF2] hover:border-[#171614]/20",
          dayBg: "bg-white",
          dayDisabledText: "text-[#2B2A27]/20",
        };
    }
  };

  const theme = getThemeStyles();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission lag
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
    }, 800);
  };

  const handleResetDemo = () => {
    setStep("dateTime");
    setAttendeeName("");
    setAttendeeEmail("");
    setAttendeePhone("");
    setCustomGoal("");
    setSelectedTime(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Premium Controls Sticky Header */}
      <header className={`sticky top-0 z-50 h-16 border-b px-6 flex items-center justify-between transition-all duration-300 select-none ${
        activeTheme === "dark"
          ? "bg-[#09090B] border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          : "bg-white border-[#E4E1D4] shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      }`}>
        
        {/* Back button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(returnTo)}
            className={`p-2 border rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              activeTheme === "dark"
                ? "border-zinc-800 hover:border-zinc-750 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
                : "border-[#E4E1D4] hover:border-[#171614] hover:bg-[#FDFBF2] text-[#171614]"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Exit Preview
          </button>
          <div className={`h-6 w-[1px] ${activeTheme === "dark" ? "bg-zinc-800" : "bg-[#E4E1D4]"}`}></div>
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${activeTheme === "dark" ? "text-zinc-400" : "text-[#171614]"}`} />
            <span className={`text-xs font-black uppercase tracking-wider ${activeTheme === "dark" ? "text-zinc-200" : "text-[#171614]"}`}>Live Layout Sandbox</span>
          </div>
        </div>

        {/* Live Theme Swapper */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wide mr-2 hidden md:inline ${
            activeTheme === "dark" ? "text-zinc-400" : "text-[#2B2A27]/55"
          }`}>
            Active Layout Design:
          </span>
          <div className={`flex border p-1 rounded-xl gap-1 ${
            activeTheme === "dark"
              ? "bg-zinc-950 border-zinc-800"
              : "bg-[#F4F2E6] border-[#E4E1D4]"
          }`}>
            {[
              { id: "classic", name: "Classic" },
              { id: "minimal", name: "Minimal" },
              { id: "dark", name: "Dark" },
              { id: "sage", name: "Cozy Sage" },
            ].map((t) => {
              const active = activeTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? activeTheme === "dark"
                        ? "bg-zinc-800 text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                        : "bg-white border border-[#171614]/10 text-[#171614] shadow-[1px_1px_2px_rgba(0,0,0,0.05)]"
                      : activeTheme === "dark"
                      ? "text-zinc-400 hover:text-white"
                      : "text-[#2B2A27]/70 hover:text-[#171614]"
                  }`}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>

      </header>

      {/* Main Preview Container */}
      <div className={theme.wrapper}>
        <div className={`w-full max-w-4xl ${theme.card} flex flex-col md:flex-row overflow-hidden transition-all duration-300`}>
          
          {/* Left Column: host & session details */}
          <div className={`p-6 md:p-8 border-b md:border-b-0 md:border-r ${theme.borderSub} w-full md:w-80 shrink-0 space-y-5 bg-[#FDFBF2]/10`}>
            {step === "form" && (
              <button
                onClick={() => setStep("dateTime")}
                className={`mb-4 flex items-center gap-1.5 text-xs font-bold hover:underline ${theme.textMuted} hover:${theme.textMain} cursor-pointer`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {/* Host info */}
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full bg-[#B7ACF7] border ${theme.borderMain} flex items-center justify-center font-bold text-[#171614]`}>
                A
              </div>
              <div className="leading-tight">
                <span className={`text-[10px] font-bold ${theme.textFaded} uppercase tracking-wide`}>Hosted by</span>
                <h4 className={`text-xs font-bold ${theme.textMain}`}>
                  {host.firstName} {host.lastName}
                </h4>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-2">
              <h1 className={`font-cal-sans text-xl font-bold uppercase tracking-wider ${theme.textMain}`}>
                {eventType.title}
              </h1>
              <div className="flex items-center gap-2">
                <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md ${theme.tagBg}`}>
                  ${eventType.price}.00
                </span>
              </div>
            </div>

            {/* Icons list */}
            <div className={`space-y-3.5 text-xs font-semibold ${theme.textMuted}`}>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4.5 h-4.5 text-current opacity-70" />
                <span>{eventType.duration} Minutes</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <Video className="w-4.5 h-4.5 text-current opacity-70" />
                <span>{eventType.locationType} ({eventType.locationDetails})</span>
              </div>

              {selectedDate && (
                <div className="flex items-center gap-2.5 text-[#23C585] font-bold animate-in fade-in duration-200">
                  <CalendarIcon className="w-4.5 h-4.5 text-[#23C585]" />
                  <span>
                    {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {selectedTime && ` @ ${formatTimeSlotLabel(selectedTime)}`}
                  </span>
                </div>
              )}

              <div className={`flex items-center gap-2.5 ${theme.textFaded}`}>
                <Globe className="w-4.5 h-4.5 text-current opacity-70" />
                <span>Coordinated Universal Time (UTC)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Steps rendering */}
          <div className={`flex-1 ${theme.bgMain} flex flex-col md:flex-row min-h-[420px]`}>
            
            {/* STEP 1: Date & Time Picker */}
            {step === "dateTime" && (
              <>
                {/* Calendar Pane */}
                <div className="flex-1 p-6 md:p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className={`font-cal-sans text-sm font-bold ${theme.textMain} uppercase tracking-wider`}>
                      Select Date & Time
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevMonth}
                        className={`p-1.5 border ${theme.borderMain} hover:${theme.dayHover} rounded-lg cursor-pointer ${theme.textMuted}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className={`p-1.5 border ${theme.borderMain} hover:${theme.dayHover} rounded-lg cursor-pointer ${theme.textMuted}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className={`text-center font-bold text-xs ${theme.textMain} mb-2 uppercase tracking-wide`}>
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>

                  {/* Weekday labels */}
                  <div className={`grid grid-cols-7 gap-1 text-center font-bold text-[10px] ${theme.textFaded} uppercase`}>
                    {daysOfWeek.map((day) => (
                      <div key={day} className="py-1">{day}</div>
                    ))}
                  </div>

                  {/* Month days */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: getFirstDayIndex(currentMonth) }).map((_, i) => (
                      <div key={`offset-${i}`} className="py-2" />
                    ))}

                    {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                      const dayNum = i + 1;
                      const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
                      const isSelectable = isDaySelectable(dayNum);
                      const isSelected = selectedDate?.getDate() === dayNum &&
                                         selectedDate?.getMonth() === currentMonth.getMonth() &&
                                         selectedDate?.getFullYear() === currentMonth.getFullYear();

                      return (
                        <button
                          type="button"
                          key={dayNum}
                          disabled={!isSelectable}
                          onClick={() => {
                            setSelectedDate(checkDate);
                            setSelectedTime(null);
                          }}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? theme.buttonSelected
                              : isSelectable
                              ? `${theme.dayBg} ${theme.borderMain} ${theme.textMain} ${theme.dayHover}`
                              : `bg-transparent border-transparent cursor-not-allowed select-none ${theme.dayDisabledText}`
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots Side Pane */}
                <div className={`w-full md:w-56 p-6 md:p-8 md:border-l ${theme.borderSub} ${theme.bgSub} flex flex-col`}>
                  <div className={`text-xs font-bold ${theme.textMain} uppercase mb-4 tracking-wider text-center md:text-left`}>
                    Available Slots
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
                    {selectedDate ? (
                      mockSlots.map((slot) => {
                        const isTimeSelected = selectedTime === slot;
                        return (
                          <div key={slot} className="space-y-1.5 animate-in fade-in duration-150">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTime(slot);
                                setStep("form");
                              }}
                              className={`w-full py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                isTimeSelected
                                  ? theme.buttonSelected
                                  : `${theme.timeSlotBg} ${theme.borderMain} ${theme.textMain} ${theme.timeSlotHover} shadow-sm`
                              }`}
                            >
                              {formatTimeSlotLabel(slot)}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className={`text-center py-10 text-xs font-semibold ${theme.textFaded} italic`}>
                        Select a date.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: Booking Form */}
            {step === "form" && (
              <form onSubmit={handleBookingSubmit} className={`flex-1 p-6 md:p-8 space-y-5 ${theme.bgMain}`}>
                <h3 className={`font-cal-sans text-sm font-bold ${theme.textMain} uppercase tracking-wider pb-3 border-b ${theme.borderSub}`}>
                  Attendee Details
                </h3>

                <div className="space-y-4">
                  {eventType.bookingFields.map((field) => {
                    const isRequired = field.status === "Required";
                    if (field.id === "name") {
                      return (
                        <div key={field.id} className="space-y-1.5">
                          <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                            {field.label} {isRequired && <span className="text-[#E5484D]">*</span>}
                          </label>
                          <input
                            type="text"
                            required={isRequired}
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            placeholder="e.g. Alex Rivera"
                            className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                          />
                        </div>
                      );
                    }

                    if (field.id === "email") {
                      return (
                        <div key={field.id} className="space-y-1.5">
                          <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                            {field.label} {isRequired && <span className="text-[#E5484D]">*</span>}
                          </label>
                          <input
                            type="email"
                            required={isRequired}
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            placeholder="alex@example.com"
                            className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                          />
                        </div>
                      );
                    }

                    if (field.id === "phone") {
                      return (
                        <div key={field.id} className="space-y-1.5">
                          <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                            {field.label} {isRequired && <span className="text-[#E5484D]">*</span>}
                          </label>
                          <input
                            type="tel"
                            required={isRequired}
                            value={attendeePhone}
                            onChange={(e) => setAttendeePhone(e.target.value)}
                            placeholder="e.g. +1 (555) 019-2834"
                            className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                          />
                        </div>
                      );
                    }

                    if (field.id === "goal") {
                      return (
                        <div key={field.id} className="space-y-1.5">
                          <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                            {field.label} {isRequired && <span className="text-[#E5484D]">*</span>}
                          </label>
                          <textarea
                            required={isRequired}
                            rows={3}
                            value={customGoal}
                            onChange={(e) => setCustomGoal(e.target.value)}
                            placeholder="Please share details..."
                            className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                          />
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>

                <div className={`pt-4 border-t ${theme.borderSub} flex justify-end`}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${theme.accentBg}`}
                  >
                    {isSubmitting ? "Processing..." : "Book Session"}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Success Confirmation Screen */}
            {step === "success" && (
              <div className={`flex-1 p-8 flex flex-col justify-center items-center text-center space-y-6 animate-in zoom-in-95 duration-300`}>
                <div className="w-16 h-16 bg-[#23C585]/10 border border-[#23C585]/40 rounded-full flex items-center justify-center text-[#23C585]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                
                <div className="space-y-2">
                  <h2 className={`font-cal-sans text-2xl font-bold uppercase tracking-wider ${theme.textMain}`}>
                    Booking Confirmed!
                  </h2>
                  <p className={`text-xs font-semibold max-w-sm ${theme.textMuted}`}>
                    This strategy call has been scheduled. A Google Meet invitation link was sent to your email address.
                  </p>
                </div>

                {/* Scheduled details card */}
                <div className={`border ${theme.borderMain} rounded-2xl p-5 w-full max-w-sm text-left bg-[#FDFBF2]/20 space-y-3`}>
                  <div className="text-xs font-bold text-[#23C585] flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <div className={`text-xs font-semibold ${theme.textMuted} flex items-center gap-1.5`}>
                    <Clock className="w-4 h-4" />
                    <span>
                      {selectedTime && formatTimeSlotLabel(selectedTime)} - {selectedTime && formatTimeSlotLabel(
                        `${(Number(selectedTime.split(":")[0]) + (eventType.duration === 30 ? 0.5 : 1)).toString().replace(".5", ":30").split(":")[0]}:${selectedTime.split(":")[1] === "00" && eventType.duration === 30 ? "30" : "00"}`
                      )} (UTC)
                    </span>
                  </div>
                  <div className={`text-xs font-semibold ${theme.textMuted} flex items-center gap-1.5`}>
                    <Video className="w-4 h-4" />
                    <span>Google Meet Integration Link</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetDemo}
                    className="px-5 py-2.5 bg-[#171614] hover:bg-[#171614]/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Test Again
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
