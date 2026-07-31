import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Calendar as CalendarIcon, Clock, Globe, MapPin, Video, CheckCircle2, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import clsx from "clsx";

const API_BASE: string =
  (import.meta as any).env?.VITE_API_URL ||
  (typeof window !== "undefined" && (window as any).process?.env?.VITE_API_URL) ||
  "http://localhost:5001/api";

interface HostDetails {
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  username: string;
  timezone: string;
}

interface EventType {
  id: string;
  title: string;
  slug: string;
  duration: number;
  price: number;
  currency?: string;
  isActive: boolean;
  locationType: string;
  locationDetails: string;
  availability: Array<{ day: string; enabled: boolean; slots: Array<{ startTime: string; endTime: string }> }>;
  bookingFields: Array<{ id: string; label: string; type: string; status: "Hidden" | "Optional" | "Required"; editable: boolean }>;
  appearance: string;
  seatsEnabled?: boolean;
  seatsMax?: number;
  seatsShareInfo?: boolean;
  seatsShowCount?: boolean;
  slotInterval?: number | null;
  showOnlyFirstAvailableSlot?: boolean;
  rescheduleEnabled?: boolean;
  cancelEnabled?: boolean;
  rescheduleNotice?: number;
  cancelNotice?: number;
  cancellationPolicy?: string;
  limitFutureBookings?: any;
  minimumNotice?: number;
  beforeBuffer?: number;
  afterBuffer?: number;
  user?: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    username: string;
    timezone: string;
  };
}

interface BookedSlot {
  startTime: string;
  endTime: string;
}

const TIMEZONES = [
  { value: "UTC", label: "UTC (GMT+0)" },
  { value: "Asia/Kolkata", label: "Kolkata (GMT+5:30)" },
  { value: "America/New_York", label: "New York (GMT-4)" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT-7)" },
  { value: "America/Chicago", label: "Chicago (GMT-5)" },
  { value: "America/Denver", label: "Denver (GMT-6)" },
  { value: "Europe/London", label: "London (GMT+1)" },
  { value: "Europe/Paris", label: "Paris (GMT+2)" },
  { value: "Europe/Berlin", label: "Berlin (GMT+2)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
  { value: "Asia/Dubai", label: "Dubai (GMT+4)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+10)" },
];

/** Build a "YYYY-MM-DD" string using LOCAL date components, not UTC.
 *  This prevents midnight IST (e.g. July 24 00:00 IST = July 23 18:30 UTC)
 *  from rolling back to the previous day when serialised via toISOString(). */
const localDateStr = (d: Date): string => {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
};

export default function BookingPage({ action }: { action?: "cancel" | "reschedule" } = {}) {
  const { username: paramUsername, slug: paramSlug, bookingId } = useParams<{ username?: string; slug?: string; bookingId?: string }>();
  const navigate = useNavigate();

  // Search parameters for deep linking & step routing
  const [searchParams, setSearchParams] = useSearchParams();
  const stepParam = searchParams.get("step");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");

  // Public data from API
  const [host, setHost] = useState<HostDetails | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Booking Flow States
  const [step, setStep] = useState<"dateTime" | "form" | "success" | "cancel" | "cancelled">("dateTime");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // "09:30"
  
  const [originalBooking, setOriginalBooking] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");

  const username = paramUsername || host?.username || "";
  const slug = paramSlug || eventType?.slug || "";
  
  // Month selector calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Form Inputs State
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, string>>({});
  const [attendeeTimezone, setAttendeeTimezone] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tzParam = urlParams.get("timezone");
      if (tzParam) return tzParam;
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch (e) {
      return "UTC";
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<any>(null);
  const [successBookingToken, setSuccessBookingToken] = useState("");

  // Load Razorpay Script dynamically on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Load public event details
  useEffect(() => {
    async function loadEventData() {
      try {
        setIsLoading(true);
        setErrorMsg("");
        
        let fetchedHost: HostDetails;
        let fetchedEventType: EventType;
        
        if (bookingId) {
          // Public details for reschedule/cancel
          const tokenParam = searchParams.get("token") || "";
          const res = await axios.get(`${API_BASE}/bookings/${bookingId}/public?token=${tokenParam}`);
          const booking = res.data.booking;
          setOriginalBooking(booking);
          
          fetchedEventType = booking.eventType;
          fetchedHost = booking.eventType.user;
          
          setAttendeeName(booking.attendeeName);
          setAttendeeEmail(booking.attendeeEmail);
          setAttendeePhone(booking.attendeePhone || "");
          
          // Verify notice windows
          const now = Date.now();
          const startMs = new Date(booking.startTime).getTime();
          if (action === "cancel") {
            const cancelNotice = fetchedEventType.cancelNotice ?? 60;
            if (startMs - cancelNotice * 60 * 1000 < now) {
              const text = cancelNotice % 1440 === 0
                ? `${cancelNotice / 1440} day(s)`
                : cancelNotice % 60 === 0
                  ? `${cancelNotice / 60} hour(s)`
                  : `${cancelNotice} minute(s)`;
              throw new Error(`Cancellation policy violation: cancellation is not allowed less than ${text} before start time.`);
            }
            if (booking.status === "cancelled") {
              throw new Error("This booking has already been cancelled.");
            }
          }
          if (action === "reschedule") {
            const rescheduleNotice = fetchedEventType.rescheduleNotice ?? 60;
            if (startMs - rescheduleNotice * 60 * 1000 < now) {
              const text = rescheduleNotice % 1440 === 0
                ? `${rescheduleNotice / 1440} day(s)`
                : rescheduleNotice % 60 === 0
                  ? `${rescheduleNotice / 60} hour(s)`
                  : `${rescheduleNotice} minute(s)`;
              throw new Error(`Rescheduling policy violation: rescheduling is not allowed less than ${text} before start time.`);
            }
            if (booking.status === "cancelled") {
              throw new Error("Cannot reschedule a cancelled booking.");
            }
          }
        } else {
          // Standard booking page
          if (!paramUsername || !paramSlug) return;
          const res = await axios.get(`${API_BASE}/bookings/public/${paramUsername}/${paramSlug}`);
          fetchedHost = res.data.host;
          fetchedEventType = res.data.eventType;
          
          // Load saved form data from localStorage
          const savedName = localStorage.getItem("cally_attendeeName");
          const savedEmail = localStorage.getItem("cally_attendeeEmail");
          const savedPhone = localStorage.getItem("cally_attendeePhone");
          const savedCustom = localStorage.getItem("cally_customFieldsData");

          if (savedName) setAttendeeName(savedName);
          if (savedEmail) setAttendeeEmail(savedEmail);
          if (savedPhone) setAttendeePhone(savedPhone);
          if (savedCustom) {
            try {
              setCustomFieldsData(JSON.parse(savedCustom));
            } catch (e) {}
          }
        }
        
        setHost(fetchedHost);
        setEventType(fetchedEventType);

        // Auto-select first available date starting from today so calendar and slots are shown at the same time
        if (!dateParam) {
          const today = new Date();
          let defaultDate = new Date(today);
          let found = false;
          
          for (let offset = 0; offset < 30; offset++) {
            const checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
            const weekdayName = checkDate.toLocaleDateString("en-US", { weekday: "long" });
            const dayConfig = fetchedEventType.availability?.find((a: any) => a.day === weekdayName);
            
            if (dayConfig?.enabled) {
              defaultDate = checkDate;
              found = true;
              break;
            }
          }
          
          if (found) {
            setSelectedDate(defaultDate);
            setCurrentMonth(defaultDate);
          }
        }
      } catch (err: any) {
        console.error("Public event details fetch failed:", err);
        setErrorMsg(err.response?.data?.error || err.message || "This booking link seems invalid or expired.");
      } finally {
        setIsLoading(false);
      }
    }
    loadEventData();
  }, [paramUsername, paramSlug, bookingId, action]);

  // Sync step and date/time parameters with browser query strings
  useEffect(() => {
    if (eventType) {
      if (action === "cancel") {
        setStep("cancel");
        return;
      }

      const successSessionKey = bookingId 
        ? `booking_success_reschedule_${bookingId}`
        : `booking_success_${username}_${slug}`;

      // If we are back to step 1 (calendar page) and successBooking exists,
      // we clear successBooking so they can select a new date/time slot.
      if (successBooking && (!stepParam || stepParam === "1")) {
        setSuccessBooking(null);
        sessionStorage.removeItem(successSessionKey);
        // Let execution flow continue to setup dateTime step
      } else if (successBooking) {
        if (stepParam !== "3" && stepParam !== "success") {
          setSearchParams({ step: "3" }, { replace: true });
        }
        setStep("success");
        return;
      }

      if (stepParam === "3" || stepParam === "success") {
        // Try to load booking success details from sessionStorage on refresh
        const savedDataStr = sessionStorage.getItem(successSessionKey);
        if (savedDataStr) {
          try {
            const savedData = JSON.parse(savedDataStr);
            setSuccessBooking(savedData.successBooking);
            if (savedData.selectedTime) setSelectedTime(savedData.selectedTime);
            if (savedData.attendeeName) setAttendeeName(savedData.attendeeName);
            if (savedData.attendeeEmail) setAttendeeEmail(savedData.attendeeEmail);
            if (savedData.token) setSuccessBookingToken(savedData.token);
            setStep("success");
            return;
          } catch (e) {
            console.error("Failed to parse saved success booking details:", e);
          }
        }
        setStep("success");
      } else if (stepParam === "2" && dateParam && timeParam) {
        // Parse "YYYY-MM-DD" as LOCAL midnight so July 24 stays July 24
        const parts = dateParam.split("-");
        const yr = Number(parts[0]) || new Date().getFullYear();
        const mo = Number(parts[1]) || 1;
        const dy = Number(parts[2]) || 1;
        const parsedDate = new Date(yr, mo - 1, dy);
        setSelectedDate(parsedDate);
        setCurrentMonth(parsedDate);
        setSelectedTime(timeParam);
        setStep("form");
      } else {
        setStep("dateTime");
        // Pre-select first date initially
        if (!selectedDate && eventType.availability) {
          const today = new Date();
          for (let offset = 0; offset < 30; offset++) {
            const checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
            const weekdayName = checkDate.toLocaleDateString("en-US", { weekday: "long" });
            const dayConfig = eventType.availability.find((a) => a.day === weekdayName);
            if (dayConfig?.enabled) {
              setSelectedDate(checkDate);
              setCurrentMonth(checkDate);
              break;
            }
          }
        }
        
        // Push step=1 to query params if not set
        if (!searchParams.get("step")) {
          const params: Record<string, string> = { step: "1" };
          if (selectedDate) {
            params.date = localDateStr(selectedDate);
          }
          setSearchParams(params);
        }
      }
    }
  }, [eventType, stepParam, dateParam, timeParam, successBooking, searchParams, setSearchParams, username, slug, action, bookingId]);

  // Load booked slots when a date is selected
  useEffect(() => {
    async function loadBookedSlots() {
      if (!username || !slug || !selectedDate) return;
      try {
        const dateStr = localDateStr(selectedDate);
        const res = await axios.get(`${API_BASE}/bookings/public/${username}/${slug}?date=${dateStr}&timezone=${attendeeTimezone}`);
        setBookedSlots(res.data.bookedSlots || []);
      } catch (err) {
        console.error("Failed to load booked slots for date:", err);
      }
    }
    loadBookedSlots();
  }, [selectedDate, username, slug, attendeeTimezone]);

  // Update query parameters when slot selection is updated
  const handleSelectDateTime = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    const dateStr = localDateStr(date);
    setSearchParams({ step: "2", date: dateStr, time });
    setStep("form");
  };

  const handleBackToDateTime = () => {
    setSelectedTime(null);
    const params: Record<string, string> = { step: "1" };
    if (selectedDate) {
      params.date = localDateStr(selectedDate);
    }
    setSearchParams(params);
    setStep("dateTime");
  };

  if (isLoading) {
    return (
      <div className={clsx('flex', 'h-screen', 'w-screen', 'items-center', 'justify-center', 'bg-[#FDFBF2]')}>
        <div className={clsx('w-12', 'h-12', 'rounded-full', 'border-4', 'border-[#171614]', 'border-t-transparent', 'animate-spin')}></div>
      </div>
    );
  }

  if (errorMsg || !eventType || !host) {
    return (
      <div className={clsx('min-h-screen', 'bg-[#FDFBF2]', 'flex', 'flex-col', 'justify-center', 'items-center', 'p-6', 'text-center')}>
        <div className={clsx('bg-white', 'border', 'border-[#E4E1D4]', 'rounded-2xl', 'p-8', 'max-w-md', 'shadow-lg', 'space-y-4')}>
          <h3 className={clsx('font-cal-sans', 'text-xl', 'font-bold', 'text-[#E5484D]')}>Link Unavailable</h3>
          <p className={clsx('text-sm', 'font-semibold', 'text-[#2B2A27]/70')}>{errorMsg || "The requested scheduling page is not active."}</p>
          <Button onClick={() => navigate("/")} variant="primary" size="sm">Go Home</Button>
        </div>
      </div>
    );
  }

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
    return idx === 0 ? 6 : idx - 1;
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
    if (checkDate < today) return false;

    // Check limitFutureBookings if enabled
    if (eventType?.limitFutureBookings) {
      const config = eventType.limitFutureBookings as any;
      if (config.enabled && config.days) {
        const maxFutureDate = new Date(today.getTime() + config.days * 24 * 60 * 60 * 1000);
        if (checkDate > maxFutureDate) return false;
      }
    }

    const weekdayName = checkDate.toLocaleDateString("en-US", { weekday: "long" });
    const dayConfig = eventType.availability?.find((a) => a.day === weekdayName);
    
    return !!dayConfig?.enabled;
  };

  // --- TIME SLOT GENERATION ---
  // Helper: given a "HH:MM" slot string and a local date, build a UTC timestamp
  // treating the slot time as being in the chosen attendeeTimezone.
  const slotToUTC = (localDateStr: string, slotTimeStr: string, tz: string): number => {
    try {
      // Build a fake ISO string and parse it as if it were in tz
      const fakeISO = `${localDateStr}T${slotTimeStr}:00`;
      // Intl lets us find the offset by formatting a known UTC time and comparing
      const testDate = new Date(fakeISO + "Z"); // treat as UTC first
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false,
      }).formatToParts(testDate);
      const p = (key: string) => parts.find((x) => x.type === key)?.value ?? "00";
      const tzDate = new Date(`${p("year")}-${p("month")}-${p("day")}T${p("hour").padStart(2,"0")}:${p("minute")}:${p("second")}Z`);
      const offsetMs = tzDate.getTime() - testDate.getTime();
      // The actual UTC ms for when slotTimeStr occurs in tz on localDateStr
      return new Date(`${localDateStr}T${slotTimeStr}:00Z`).getTime() - offsetMs;
    } catch {
      return new Date(`${localDateStr}T${slotTimeStr}:00Z`).getTime();
    }
  };

  const getPartsInTimezone = (timestamp: number, tz: string) => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
      const parts = formatter.formatToParts(new Date(timestamp));
      const p = (key: string) => parts.find((x) => x.type === key)?.value ?? "0";
      return {
        weekday: p("weekday"),
        hour: parseInt(p("hour")) % 24,
        minute: parseInt(p("minute")),
      };
    } catch (e) {
      const d = new Date(timestamp);
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return {
        weekday: weekdays[d.getUTCDay()],
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
      };
    }
  };

  const generateAvailableTimeSlots = () => {
    if (!selectedDate || !eventType || !host) return [];

    const slots: string[] = [];

    // Use LOCAL date components so July 20 IST stays "2026-07-20" not "2026-07-19"
    const y = selectedDate.getFullYear();
    const mo = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${mo}-${d}`;

    // Get the start of the selected date in the attendee's selected timezone
    const dayStartUtc = slotToUTC(dateStr, "00:00", attendeeTimezone);

    // Check notice period buffer
    const noticeMinutes = eventType.minimumNotice ?? 120;
    const minTimeWindow = Date.now() + noticeMinutes * 60 * 1000;

    const beforeBuffer = eventType.beforeBuffer ?? 0;
    const afterBuffer = eventType.afterBuffer ?? 0;

    const step = eventType.slotInterval && eventType.slotInterval > 0 
      ? eventType.slotInterval 
      : eventType.duration;

    const hostTimezone = host.timezone || "UTC";

    // Loop through 24 hours of the selected date in the attendee's timezone
    for (let offsetMinutes = 0; offsetMinutes <= 1440 - eventType.duration; offsetMinutes += step) {
      const candidateUtc = dayStartUtc + offsetMinutes * 60 * 1000;

      // Only skip past slots or those violating minimum notice
      if (candidateUtc < minTimeWindow) {
        continue;
      }

      // Convert candidateUtc to host's local timezone details to check availability
      const hostParts = getPartsInTimezone(candidateUtc, hostTimezone);
      const hostDayConfig = eventType.availability?.find((a) => a.day === hostParts.weekday);

      if (!hostDayConfig || !hostDayConfig.enabled || !hostDayConfig.slots) {
        continue;
      }

      const hostStartMins = hostParts.hour * 60 + hostParts.minute;
      const hostEndMins = hostStartMins + eventType.duration;

      const fits = hostDayConfig.slots.some((range) => {
        const rangeStartMins = timeToMinutes(range.startTime);
        const rangeEndMins = timeToMinutes(range.endTime);
        return hostStartMins >= rangeStartMins && hostEndMins <= rangeEndMins;
      });

      if (!fits) {
        continue;
      }

      // Check conflict with bookedSlots
      let isBusy = false;
      if (eventType.seatsEnabled) {
        // Count bookings sharing exact start time
        const count = bookedSlots.filter(
          (b) => new Date(b.startTime).getTime() === candidateUtc
        ).length;
        if (count >= (eventType.seatsMax ?? 1)) {
          isBusy = true;
        }
      } else {
        // Standard overlap check with buffers
        isBusy = bookedSlots.some((booked) => {
          const bStart = new Date(booked.startTime).getTime();
          const bEnd = new Date(booked.endTime).getTime();
          
          const combinedAfterBuffer = afterBuffer * 60 * 1000;
          const combinedBeforeBuffer = beforeBuffer * 60 * 1000;

          return (
            candidateUtc < bEnd + combinedAfterBuffer &&
            (candidateUtc + eventType.duration * 60 * 1000) > bStart - combinedBeforeBuffer
          );
        });
      }

      if (!isBusy) {
        // If showOnlyFirstAvailableSlot is enabled, only take the first slot of the day
        if (eventType.showOnlyFirstAvailableSlot && slots.length > 0) {
          break;
        }
        slots.push(minutesToTime(offsetMinutes));
      }
    }

    return slots;
  };

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number) => {
    const h = Math.floor(min / 60).toString().padStart(2, "0");
    const m = (min % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const formatTimeSlotLabel = (timeStr: string) => {
    // The slot time string (e.g. "09:00") represents a time in the attendee's timezone.
    // Just display it directly as 12-hour format — no UTC conversion needed.
    try {
      const [h, m] = timeStr.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      const hr = h % 12 === 0 ? 12 : h % 12;
      return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  // --- APPEARANCE THEMES DESIGN SYSTEM ---
  const getThemeStyles = () => {
    switch (eventType.appearance) {
      case "minimal":
        return {
          wrapper: "bg-[#FAFAFA] min-h-screen text-gray-800 font-sans flex items-center justify-center p-4 md:p-8",
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
          wrapper: "bg-[#09090B] min-h-screen text-[#F4F4F5] font-sans flex items-center justify-center p-4 md:p-8",
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
          wrapper: "bg-[#F4F7F4] min-h-screen text-[#1E2E1F] font-sans flex items-center justify-center p-4 md:p-8",
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
          wrapper: "bg-[#FDFBF2] bg-[radial-gradient(#E4E1D4_1.5px,transparent_1.5px)] bg-[length:24px_24px] min-h-screen text-[#171614] font-sans flex items-center justify-center p-4 md:p-8",
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



  const getRemainingSeatsForSlot = (slotTimeStr: string) => {
    if (!eventType?.seatsEnabled || !selectedDate) return null;
    const y = selectedDate.getFullYear();
    const mo = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${mo}-${d}`;

    const sStart = slotToUTC(dateStr, slotTimeStr, attendeeTimezone);
    const taken = bookedSlots.filter((b) => new Date(b.startTime).getTime() === sStart).length;
    return Math.max(0, (eventType.seatsMax || 1) - taken);
  };

  const theme = getThemeStyles();
  const availableSlots = generateAvailableTimeSlots();

  // --- SUBMISSION ---
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    const y = selectedDate.getFullYear();
    const mo = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${mo}-${d}`;
    const startTimeUtcMs = slotToUTC(dateStr, selectedTime, attendeeTimezone);
    const ISOstartTime = new Date(startTimeUtcMs).toISOString();

    try {
      if (action === "reschedule") {
        const tokenParam = searchParams.get("token") || "";
        const res = await axios.post(`${API_BASE}/bookings/${bookingId}/reschedule`, {
          newStartTime: ISOstartTime,
          token: tokenParam,
        });

        // Clear local storage
        localStorage.removeItem("cally_attendeeName");
        localStorage.removeItem("cally_attendeeEmail");
        localStorage.removeItem("cally_attendeePhone");
        localStorage.removeItem("cally_customFieldsData");

        const booking = res.data.booking;
        setSuccessBooking(booking);
        const successToken = searchParams.get("token") || "";
        setSuccessBookingToken(successToken);
        const successData = {
          successBooking: booking,
          selectedTime,
          attendeeName,
          attendeeEmail,
          token: successToken,
        };
        sessionStorage.setItem(`booking_success_reschedule_${bookingId}`, JSON.stringify(successData));
        setSearchParams({ step: "3" }, { replace: true });
        setStep("success");
        setIsSubmitting(false);
        return;
      }

      const res = await axios.post(`${API_BASE}/bookings`, {
        eventTypeId: eventType.id,
        startTime: ISOstartTime,
        attendeeName,
        attendeeEmail,
        attendeePhone: attendeePhone || undefined,
        bookingFieldsData: {
          ...customFieldsData,
          timezone: attendeeTimezone,
        },
      });

      // Clear local storage
      localStorage.removeItem("cally_attendeeName");
      localStorage.removeItem("cally_attendeeEmail");
      localStorage.removeItem("cally_attendeePhone");
      localStorage.removeItem("cally_customFieldsData");

      // Paid Booking handler
      if (res.data.razorpayOrder) {
        const orderData = res.data.razorpayOrder;
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Avora Pay",
          description: `Booking payment for ${eventType.title}`,
          order_id: orderData.id,
          handler: async (response: any) => {
            try {
              setIsSubmitting(true);
              const verifyRes = await axios.post(`${API_BASE}/bookings/payment/verify`, {
                bookingId: res.data.booking.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              const booking = verifyRes.data.booking;
              setSuccessBooking(booking);
              const tokenVal = res.data.token || "";
              setSuccessBookingToken(tokenVal);
              const successData = {
                successBooking: booking,
                selectedTime,
                attendeeName,
                attendeeEmail,
                token: tokenVal,
              };
              sessionStorage.setItem(`booking_success_${username}_${slug}`, JSON.stringify(successData));
              setSearchParams({ step: "3" }, { replace: true });
              setStep("success");
            } catch (verifyErr: any) {
              setErrorMsg(verifyErr.response?.data?.error || "Payment verification failed.");
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: attendeeName,
            email: attendeeEmail,
            contact: attendeePhone || "",
          },
          theme: {
            color: "#7CEFC0",
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
              setErrorMsg("Payment process was cancelled by user.");
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Free booking directly transitions to success step
        const booking = res.data.booking;
        setSuccessBooking(booking);
        const tokenVal = res.data.token || "";
        setSuccessBookingToken(tokenVal);
        const successData = {
          successBooking: booking,
          selectedTime,
          attendeeName,
          attendeeEmail,
          token: tokenVal,
        };
        sessionStorage.setItem(`booking_success_${username}_${slug}`, JSON.stringify(successData));
        setSearchParams({ step: "3" }, { replace: true });
        setStep("success");
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      setErrorMsg(err.response?.data?.error || "Booking failed. Please try a different slot.");
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const tokenParam = searchParams.get("token") || "";
      await axios.post(`${API_BASE}/bookings/${bookingId}/cancel`, {
        reason: cancelReason,
        token: tokenParam,
      });
      setStep("cancelled");
    } catch (err: any) {
      console.error("Cancellation failed:", err);
      setErrorMsg(err.response?.data?.error || "Failed to cancel booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomFieldChange = (fieldId: string, val: string) => {
    const updated = { ...customFieldsData, [fieldId]: val };
    setCustomFieldsData(updated);
    localStorage.setItem("cally_customFieldsData", JSON.stringify(updated));
  };

  return (
    <div className={theme.wrapper}>
      <div className={`w-full max-w-4xl ${theme.card} flex flex-col md:flex-row overflow-hidden`}>
        
        {/* Left column: Host & Meeting details */}
        <div className={`p-6 md:p-8 border-b md:border-b-0 md:border-r ${theme.borderSub} w-full md:w-80 shrink-0 space-y-5 bg-[#FDFBF2]/20`}>
          {step === "form" && (
            <button
              onClick={handleBackToDateTime}
              className={`mb-4 flex items-center gap-1.5 text-xs font-bold hover:underline ${theme.textMuted} hover:${theme.textMain} cursor-pointer`}
            >
              <ArrowLeft className={clsx('w-4', 'h-4')} />
              Back
            </button>
          )}

          {/* Host details */}
          <div className={clsx('flex', 'items-center', 'gap-3')}>
            {host.imageUrl ? (
              <img
                src={host.imageUrl}
                alt={`${host.firstName} avatar`}
                className={`w-11 h-11 rounded-full border ${theme.borderMain} object-cover`}
              />
            ) : (
              <div className={`w-11 h-11 rounded-full bg-[#B7ACF7] border ${theme.borderMain} flex items-center justify-center font-bold text-[#171614]`}>
                {host.firstName?.[0] || host.username[0].toUpperCase()}
              </div>
            )}
            <div className="leading-tight">
              <span className={`text-[10px] font-bold ${theme.textFaded} uppercase tracking-wide`}>Hosted by</span>
              <h4 className={`text-xs font-bold ${theme.textMain}`}>
                {host.firstName} {host.lastName}
              </h4>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className={`font-cal-sans text-xl font-bold uppercase tracking-wider ${theme.textMain}`}>
              {eventType.title}
            </h1>
            {action === "reschedule" && originalBooking && (
              <div className="bg-[#B7ACF7]/20 border border-[#B7ACF7]/40 rounded-xl p-3 text-[10px] text-[#171614] font-semibold space-y-1">
                <span className="font-bold text-[#171614] uppercase tracking-wide block text-xs">Rescheduling meeting</span>
                <span>Original slot: {new Date(originalBooking.startTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
            )}
            {action === "cancel" && originalBooking && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[10px] text-red-700 font-semibold space-y-1">
                <span className="font-bold text-red-800 uppercase tracking-wide block text-xs">Cancelling meeting</span>
                <span>Scheduled slot: {new Date(originalBooking.startTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
            )}
            <div className={clsx('flex', 'items-center', 'gap-2')}>
              <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md ${theme.tagBg}`}>
                {eventType.price > 0 ? (
                  `${
                    eventType.currency === "INR" ? "₹" :
                    eventType.currency === "USD" ? "$" :
                    eventType.currency === "EUR" ? "€" :
                    eventType.currency === "GBP" ? "£" : "$"
                  }${eventType.price}`
                ) : "Free"}
              </span>
            </div>
          </div>

          <div className={`space-y-3.5 text-xs font-semibold ${theme.textMuted}`}>
            <div className={clsx('flex', 'items-center', 'gap-2.5')}>
              <Clock className={clsx('w-4.5', 'h-4.5', 'text-current', 'opacity-70')} />
              <span>{eventType.duration} Minutes</span>
            </div>
            
            <div className={clsx('flex', 'items-center', 'gap-2.5')}>
              {eventType.locationType === "Video" ? (
                <Video className={clsx('w-4.5', 'h-4.5', 'text-current', 'opacity-70')} />
              ) : (
                <MapPin className={clsx('w-4.5', 'h-4.5', 'text-current', 'opacity-70')} />
              )}
              <span>
                {eventType.locationType} ({eventType.locationDetails})
              </span>
            </div>

            {selectedDate && (
              <div className={clsx('flex', 'items-center', 'gap-2.5', 'text-[#23C585]', 'font-bold', 'animate-in', 'fade-in', 'duration-200')}>
                <CalendarIcon className={clsx('w-4.5', 'h-4.5', 'text-[#23C585]')} />
                <span>
                  {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  {selectedTime && ` @ ${formatTimeSlotLabel(selectedTime)}`}
                </span>
              </div>
            )}

            <div className={`flex items-center gap-2.5 ${theme.textFaded}`}>
              <Globe className={clsx('w-4.5', 'h-4.5', 'text-current', 'opacity-70', 'flex-shrink-0')} />
              <Select
                value={attendeeTimezone}
                onChange={(val) => setAttendeeTimezone(val)}
                options={TIMEZONES}
                size="sm"
                className="w-48"
                buttonClassName={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer flex justify-between items-center gap-1 hover:underline py-0.5 border-none text-left ${theme.textMain}`}
                menuClassName={`absolute bottom-full left-0 mb-1 bg-white border border-[#E4E1D4] rounded-xl shadow-lg z-30 py-1 font-semibold text-[#171614] max-h-56 overflow-y-auto w-48`}
              />
            </div>
          </div>
        </div>

        {/* Right column: Step content */}
        <div className={`flex-1 ${theme.bgMain} flex flex-col md:flex-row min-h-[420px]`}>
          
          {/* STEP 1: Date & Time Picker */}
          {step === "dateTime" && (
            <>
              {/* Calendar pane */}
              <div className={clsx('flex-1', 'p-6', 'md:p-8', 'space-y-4')}>
                <div className={clsx('flex', 'justify-between', 'items-center')}>
                  <h3 className={`font-cal-sans text-sm font-bold ${theme.textMain} uppercase tracking-wider`}>
                    Select Date & Time
                  </h3>
                  <div className={clsx('flex', 'items-center', 'gap-1')}>
                    <button
                      onClick={handlePrevMonth}
                      className={`p-1.5 border ${theme.borderMain} hover:${theme.dayHover} rounded-lg cursor-pointer ${theme.textMuted}`}
                    >
                      <ChevronLeft className={clsx('w-4', 'h-4')} />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className={`p-1.5 border ${theme.borderMain} hover:${theme.dayHover} rounded-lg cursor-pointer ${theme.textMuted}`}
                    >
                      <ChevronRight className={clsx('w-4', 'h-4')} />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid Header */}
                <div className={`text-center font-bold text-xs ${theme.textMain} mb-2 uppercase tracking-wide`}>
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>

                {/* Week Day Labels */}
                <div className={`grid grid-cols-7 gap-1 text-center font-bold text-[10px] ${theme.textFaded} uppercase`}>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="py-1">{day}</div>
                  ))}
                </div>

                {/* Month Days Grid */}
                <div className={clsx('grid', 'grid-cols-7', 'gap-1')}>
                  {/* Empty offsets for start of month */}
                  {Array.from({ length: getFirstDayIndex(currentMonth) }).map((_, i) => (
                    <div key={`offset-${i}`} className="py-2" />
                  ))}

                  {/* Day Buttons */}
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
                          // Sync param without switching step
                          setSearchParams({ step: "1", date: localDateStr(checkDate) });
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

              {/* Time Slots Side Pane (Always visible side-by-side) */}
              <div className={`w-full md:w-56 p-6 md:p-8 md:border-l ${theme.borderSub} ${theme.bgSub} flex flex-col`}>
                <div className={`text-xs font-bold ${theme.textMain} uppercase mb-4 tracking-wider text-center md:text-left`}>
                  Available Slots
                </div>

                <div className={clsx('flex-1', 'overflow-y-auto', 'space-y-2', 'pr-1', 'max-h-[300px]')}>
                  {selectedDate ? (
                    availableSlots.length > 0 ? (
                      availableSlots.map((slot) => {
                        const isTimeSelected = selectedTime === slot;
                        return (
                          <div key={slot} className={clsx('space-y-1.5', 'animate-in', 'fade-in', 'duration-150')}>
                            <button
                              type="button"
                              onClick={() => handleSelectDateTime(selectedDate, slot)}
                              className={`w-full py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                                isTimeSelected
                                  ? theme.buttonSelected
                                  : `${theme.timeSlotBg} ${theme.borderMain} ${theme.textMain} ${theme.timeSlotHover} shadow-sm`
                              }`}
                            >
                              <span>{formatTimeSlotLabel(slot)}</span>
                              {eventType.seatsEnabled && eventType.seatsShowCount && (
                                <span className={clsx('block', 'text-[8px]', 'opacity-75', 'font-semibold', 'mt-0.5')}>
                                  {getRemainingSeatsForSlot(slot)} seats available
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className={`text-center py-10 text-xs font-semibold ${theme.textFaded} italic`}>
                        No slots available.
                      </div>
                    )
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

              {errorMsg && (
                <div className={clsx('p-3', 'bg-[#E5484D]/10', 'border', 'border-[#E5484D]/30', 'text-[#E5484D]', 'text-xs', 'font-bold', 'rounded-xl')}>
                  ✕ {errorMsg}
                </div>
              )}

              {/* Dynamic form questionnaire matching default/custom bookingFields */}
              <div className="space-y-4">
                {eventType.bookingFields?.map((field) => {
                  if (field.status === "Hidden") return null;
                  const isRequired = field.status === "Required";
                  
                  // Map "name" ID to attendeeName
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
                          onChange={(e) => {
                            setAttendeeName(e.target.value);
                            localStorage.setItem("cally_attendeeName", e.target.value);
                          }}
                          placeholder="e.g. Alex Rivera"
                          className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                        />
                      </div>
                    );
                  }

                  // Map "email" ID to attendeeEmail
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
                          onChange={(e) => {
                            setAttendeeEmail(e.target.value);
                            localStorage.setItem("cally_attendeeEmail", e.target.value);
                          }}
                          placeholder="alex@example.com"
                          className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                        />
                      </div>
                    );
                  }

                  // Map "phone" ID to attendeePhone
                  if (field.id === "phone" || field.type === "Phone") {
                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                          {field.label} {isRequired && <span className="text-[#E5484D]">*</span>}
                        </label>
                        <input
                          type="tel"
                          required={isRequired}
                          value={attendeePhone}
                          onChange={(e) => {
                            setAttendeePhone(e.target.value);
                            localStorage.setItem("cally_attendeePhone", e.target.value);
                          }}
                          placeholder="e.g. +1 (555) 019-2834"
                          className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                        />
                      </div>
                    );
                  }

                  // Render long text questions (e.g. Additional details) with text-xs class for typing text
                  if (field.type === "Long Text" || field.id === "notes") {
                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                          {field.label} {isRequired && <span className="text-[#E5484D]">*</span>}
                        </label>
                        <textarea
                          required={isRequired}
                          rows={3}
                          value={customFieldsData[field.id] || ""}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          placeholder="Please share details..."
                          className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                        />
                      </div>
                    );
                  }

                  // Render standard fields
                  return (
                    <div key={field.id} className="space-y-1.5">
                      <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                        {field.label} {isRequired && <span className="text-[#E5484D]">*</span>}
                      </label>
                      <input
                        type="text"
                        required={isRequired}
                        value={customFieldsData[field.id] || ""}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        placeholder="Your answer..."
                        className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                      />
                    </div>
                  );
                })}

                {/* Timezone Selection Option */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                    Timezone <span className="text-[#E5484D]">*</span>
                  </label>
                  <Select
                    value={attendeeTimezone}
                    onChange={(val) => setAttendeeTimezone(val)}
                    options={TIMEZONES}
                    buttonClassName={`w-full border ${theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} focus:outline-none focus:border-[#B7ACF7] transition-all text-left flex justify-between items-center px-4 py-2.5`}
                    menuClassName={`absolute top-full left-0 right-0 mt-1 ${theme.inputBg} border ${theme.borderMain} rounded-xl shadow-lg z-30 py-1 font-semibold ${theme.inputText} max-h-56 overflow-y-auto`}
                  />
                </div>
              </div>

              <div className={`pt-4 border-t ${theme.borderSub} flex justify-end`}>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  rounded="xl"
                  disabled={isSubmitting}
                  className={clsx('w-full', 'md:w-auto')}
                >
                  {isSubmitting 
                    ? "Scheduling..." 
                    : eventType.price > 0 
                      ? `Pay ${
                          eventType.currency === "INR" ? "₹" :
                          eventType.currency === "USD" ? "$" :
                          eventType.currency === "EUR" ? "€" :
                          eventType.currency === "GBP" ? "£" : "$"
                        }${eventType.price} and Book`
                      : "Schedule Event"
                  }
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Booking Success */}
          {step === "success" && successBooking && (
            <div className={`flex-1 p-6 md:p-10 flex flex-col justify-center items-center text-center space-y-5 ${theme.bgMain}`}>
              <CheckCircle2 className={clsx('w-16', 'h-16', 'text-[#23C585]')} />
              
              <div className="space-y-2">
                <h2 className={`font-cal-sans text-xl font-bold uppercase tracking-wider ${theme.textMain}`}>
                  {action === "reschedule" ? "Rescheduled Successfully!" : "Booking Confirmed!"}
                </h2>
                <p className={`text-sm font-semibold ${theme.textMuted} max-w-sm`}>
                  A calendar invite has been sent to your email. We look forward to meeting you!
                </p>
              </div>

              <div className={`p-5 border ${theme.borderMain} rounded-2xl ${theme.bgSub} w-full max-w-sm space-y-3.5 text-xs text-left font-bold ${theme.textMain}`}>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase ${theme.textFaded} block`}>Topic</span>
                  <span>{eventType.title}</span>
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase ${theme.textFaded} block`}>Guest details</span>
                  <span>{attendeeName} ({attendeeEmail})</span>
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase ${theme.textFaded} block`}>Scheduled Time</span>
                  <span>
                    {new Date(successBooking.startTime).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
                    {" @ "}
                    {new Date(successBooking.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" })} (UTC)
                  </span>
                </div>
              </div>

              {/* Show Reschedule / Cancel buttons if configured on the event type */}
              {!action && (
                <div className="flex gap-3 w-full max-w-sm pt-2">
                  {eventType.rescheduleEnabled !== false && (
                    <Button
                      onClick={() => navigate(`/booking/${successBooking.id}/reschedule?token=${successBookingToken}`)}
                      variant="secondary"
                      className="flex-1 text-xs"
                      size="sm"
                    >
                      Reschedule
                    </Button>
                  )}
                  {eventType.cancelEnabled !== false && (
                    <Button
                      onClick={() => navigate(`/booking/${successBooking.id}/cancel?token=${successBookingToken}`)}
                      variant="ghost"
                      className="flex-1 text-xs border border-[#E5484D] text-[#E5484D] bg-white hover:bg-[#E5484D]/5"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Cancel Meeting Portal */}
          {step === "cancel" && originalBooking && (
            <div className={`flex-1 p-6 md:p-10 flex flex-col justify-center items-center text-center space-y-5 ${theme.bgMain}`}>
              <div className="space-y-2">
                <h2 className={`font-cal-sans text-xl font-bold uppercase tracking-wider text-[#E5484D]`}>
                  Cancel Meeting
                </h2>
                <p className={`text-sm font-semibold ${theme.textMuted} max-w-sm`}>
                  Are you sure you want to cancel this meeting?
                </p>
              </div>

              <div className={`p-5 border border-red-100 rounded-2xl bg-red-50/20 w-full max-w-sm space-y-3.5 text-xs text-left font-bold ${theme.textMain}`}>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase ${theme.textFaded} block`}>Topic</span>
                  <span>{eventType.title}</span>
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase ${theme.textFaded} block`}>Guest</span>
                  <span>{attendeeName} ({attendeeEmail})</span>
                </div>
                <div>
                  <span className={`text-[10px] font-extrabold uppercase ${theme.textFaded} block`}>Scheduled Time</span>
                  <span>
                    {new Date(originalBooking.startTime).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
                    {" @ "}
                    {new Date(originalBooking.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" })} (UTC)
                  </span>
                </div>
              </div>

              {eventType.cancellationPolicy && (
                <div className="w-full max-w-sm p-4 border border-[#E4E1D4] rounded-2xl bg-[#FDFBF2]/20 text-left space-y-1.5">
                  <span className="block text-[10px] font-extrabold uppercase text-[#2B2A27]/60">Cancellation Policy</span>
                  <p className="text-xs text-[#2B2A27]/80 font-medium leading-relaxed">
                    {eventType.cancellationPolicy}
                  </p>
                </div>
              )}

              <form onSubmit={handleCancelSubmit} className="w-full max-w-sm space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className={`block text-xs font-bold ${theme.textMain} uppercase tracking-wider`}>
                    Reason for cancellation
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule conflict, will rebook later."
                    rows={3}
                    className={`w-full px-4 py-2.5 border ${theme.inputBorder || theme.borderMain} rounded-xl text-xs ${theme.inputBg} font-semibold ${theme.inputText} ${theme.inputPlaceholder} focus:outline-none ${theme.inputFocus || "focus:border-[#B7ACF7]"} transition-all`}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => navigate(`/book/${username}/${slug}`)}
                    variant="secondary"
                    className="flex-1 text-xs"
                    size="sm"
                  >
                    Keep Meeting
                  </Button>
                  <Button
                    type="submit"
                    variant="ghost"
                    disabled={isSubmitting}
                    className="flex-1 text-xs border border-[#E5484D] bg-[#E5484D] text-white hover:bg-[#E5484D]/90 shadow-[2px_2px_0_rgba(229,72,77,0.15)]"
                    size="sm"
                  >
                    {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: Cancellation Success Screen */}
          {step === "cancelled" && (
            <div className={`flex-1 p-6 md:p-10 flex flex-col justify-center items-center text-center space-y-5 ${theme.bgMain}`}>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                <span className="text-red-500 font-extrabold text-2xl">✓</span>
              </div>
              
              <div className="space-y-2">
                <h2 className={`font-cal-sans text-xl font-bold uppercase tracking-wider text-red-600`}>
                  Meeting Cancelled
                </h2>
                <p className={`text-sm font-semibold ${theme.textMuted} max-w-sm`}>
                  This meeting has been cancelled successfully. Confirmation has been sent to your email.
                </p>
              </div>

              {eventType && (
                <Button
                  onClick={() => navigate(`/book/${username}/${slug}`)}
                  variant="primary"
                  size="sm"
                  rounded="xl"
                >
                  Book another meeting
                </Button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
