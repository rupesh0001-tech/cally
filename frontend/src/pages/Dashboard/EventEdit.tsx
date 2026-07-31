import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Sparkles, MessageSquare, Shield, HelpCircle, SquareArrowOutDownRight, BarChart3 } from "lucide-react";
import { useApi } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import AnalyticsPage from "./Analytics";

// Import modular tab components
import { BasicsTab } from "./components/EventEdit/BasicsTab";
import { AvailabilityTab } from "./components/EventEdit/AvailabilityTab";
import { BookingFormTab } from "./components/EventEdit/BookingFormTab";
import { AppearanceTab } from "./components/EventEdit/AppearanceTab";
import { BookingsTab } from "./components/EventEdit/BookingsTab";
import { PaymentsTab } from "./components/EventEdit/PaymentsTab";
import { LimitsTab } from "./components/EventEdit/LimitsTab";
import { RescheduleCancelTab } from "./components/EventEdit/RescheduleCancelTab";

export interface EventType {
  id: string;
  title: string;
  slug: string;
  duration: number;
  price: number;
  isActive: boolean;
  locationType: string;
  locationDetails: string;
  availability: Array<{ day: string; enabled: boolean; slots: Array<{ startTime: string; endTime: string }> }>;
  bookingFields: Array<{ id: string; label: string; type: string; status: "Hidden" | "Optional" | "Required"; editable: boolean }>;
  appearance: string;
  rescheduleEnabled: boolean;
  cancelEnabled: boolean;
  rescheduleNotice: number;
  cancelNotice: number;
  cancellationPolicy: string;
  paymentEnabled?: boolean;
  currency?: string;
  seatsEnabled?: boolean;
  seatsMax?: number;
  seatsShareInfo?: boolean;
  seatsShowCount?: boolean;
  beforeBuffer?: number;
  afterBuffer?: number;
  minimumNotice?: number;
  slotInterval?: number | null;
  limitBookingFrequency?: any;
  limitTotalBookingDuration?: any;
  limitFutureBookings?: any;
  limitUpcomingBookings?: any;
  showOnlyFirstAvailableSlot?: boolean;
}

const TIMEZONE_OPTIONS = [
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

// Helper to generate 30-min time interval options
const TIME_OPTIONS = (() => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min of ["00", "30"]) {
      const hh = hour.toString().padStart(2, "0");
      const val = `${hh}:${min}`;
      
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${displayHour}:${min} ${ampm}`;
      
      options.push({ val, label });
    }
  }
  return options;
})();



export function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();

  const [username, setUsername] = useState("");
  const [event, setEvent] = useState<EventType | null>(null);
  const [activeTab, setActiveTab] = useState("basics");
  
  // Loading & statuses
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Basics Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [duration, setDuration] = useState(30);
  const [locationType, setLocationType] = useState("Video");
  const [locationDetails, setLocationDetails] = useState("Google Meet");

  // Availability State
  const [availability, setAvailability] = useState<EventType["availability"]>([]);
  const [userTimezone, setUserTimezone] = useState("UTC");
  // Track open time-slot picker overlay
  const [activeDropdown, setActiveDropdown] = useState<{ dayIdx: number; slotIdx: number; type: "start" | "end" } | null>(null);

  // Booking Form State
  const [bookingFields, setBookingFields] = useState<EventType["bookingFields"]>([]);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  // Add Question State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState("Short Text");
  const [newFieldStatus, setNewFieldStatus] = useState<"Required" | "Optional" | "Hidden">("Optional");

  // Appearance State
  const [appearance, setAppearance] = useState("classic");

  // Payments & Seats State
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("INR");
  const [seatsEnabled, setSeatsEnabled] = useState(false);
  const [seatsMax, setSeatsMax] = useState(1);
  const [seatsShareInfo, setSeatsShareInfo] = useState(false);
  const [seatsShowCount, setSeatsShowCount] = useState(false);

  // Reschedule & Cancel State
  const [rescheduleEnabled, setRescheduleEnabled] = useState(true);
  const [cancelEnabled, setCancelEnabled] = useState(true);
  const [rescheduleNotice, setRescheduleNotice] = useState(60);
  const [cancelNotice, setCancelNotice] = useState(60);
  const [cancellationPolicy, setCancellationPolicy] = useState("");

  // Limits & Buffers State
  const [beforeBuffer, setBeforeBuffer] = useState(0);
  const [afterBuffer, setAfterBuffer] = useState(0);
  const [minimumNotice, setMinimumNotice] = useState(120);
  const [slotInterval, setSlotInterval] = useState<number | null>(null);
  const [limitBookingFrequency, setLimitBookingFrequency] = useState<any>(null);
  const [limitTotalBookingDuration, setLimitTotalBookingDuration] = useState<any>(null);
  const [limitFutureBookings, setLimitFutureBookings] = useState<any>(null);
  const [limitUpcomingBookings, setLimitUpcomingBookings] = useState<any>(null);
  const [showOnlyFirstAvailableSlot, setShowOnlyFirstAvailableSlot] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Load User info
        const meRes = await api.get("/auth/me");
        setUsername(meRes.data.user?.username || "user");
        setUserTimezone(meRes.data.user?.timezone || "UTC");

        // Load Event Details
        const eventRes = await api.get(`/events/${id}`);
        const ev = eventRes.data.event;
        setEvent(ev);

        // Populate state
        setTitle(ev.title);
        setSlug(ev.slug);
        setDuration(ev.duration);
        setLocationType(ev.locationType || "Video");
        setLocationDetails(ev.locationDetails || "Google Meet");
        setAvailability(ev.availability || []);
        setBookingFields(ev.bookingFields || []);
        setAppearance(ev.appearance || "classic");

        // Populate new fields
        setPaymentEnabled(ev.paymentEnabled || false);
        setPrice(ev.price || 0);
        setCurrency(ev.currency || "INR");
        setSeatsEnabled(ev.seatsEnabled || false);
        setSeatsMax(ev.seatsMax || 1);
        setSeatsShareInfo(ev.seatsShareInfo || false);
        setSeatsShowCount(ev.seatsShowCount || false);

        setRescheduleEnabled(ev.rescheduleEnabled !== false);
        setCancelEnabled(ev.cancelEnabled !== false);
        setRescheduleNotice(ev.rescheduleNotice ?? 60);
        setCancelNotice(ev.cancelNotice ?? 60);
        setCancellationPolicy(ev.cancellationPolicy || "");

        setBeforeBuffer(ev.beforeBuffer || 0);
        setAfterBuffer(ev.afterBuffer || 0);
        setMinimumNotice(ev.minimumNotice || 120);
        setSlotInterval(ev.slotInterval);
        setLimitBookingFrequency(ev.limitBookingFrequency);
        setLimitTotalBookingDuration(ev.limitTotalBookingDuration);
        setLimitFutureBookings(ev.limitFutureBookings);
        setLimitUpcomingBookings(ev.limitUpcomingBookings);
        setShowOnlyFirstAvailableSlot(ev.showOnlyFirstAvailableSlot || false);
      } catch (err: any) {
        console.error("Error loading event edit page data:", err);
        setMessage({ type: "error", text: "Failed to load event type details." });
      } finally {
        setIsLoading(false);
      }
    }

    if (id) loadData();
  }, [id]);

  // Click outside to close custom time slot popover
  useEffect(() => {
    const handleClose = () => setActiveDropdown(null);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, []);

  const handleSaveBasics = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdate({
      title,
      slug,
      duration: Number(duration),
      locationType,
      locationDetails,
    });
  };

  const handleSaveAvailability = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setMessage(null);
    try {
      // Save event availability
      const eventRes = await api.put(`/events/${id}`, { availability });
      setEvent(eventRes.data.event);

      // Save user timezone
      await api.put("/users/availability", { availability, timezone: userTimezone });

      setMessage({ type: "success", text: "Availability saved successfully! ✓" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("Error saving availability:", err);
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to save availability." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBookingForm = async () => {
    await handleUpdate({ bookingFields });
  };

  const handleSaveAppearance = async (selectedLayout: string) => {
    setAppearance(selectedLayout);
    await handleUpdate({ appearance: selectedLayout });
  };

  const handleSavePayments = async () => {
    await handleUpdate({
      paymentEnabled,
      price: Number(price),
      currency,
      seatsEnabled,
      seatsMax: Number(seatsMax),
      seatsShareInfo,
      seatsShowCount,
    });
  };

  const handleSaveReschedule = async () => {
    await handleUpdate({
      rescheduleEnabled,
      cancelEnabled,
      rescheduleNotice: Number(rescheduleNotice),
      cancelNotice: Number(cancelNotice),
      cancellationPolicy,
    });
  };

  const handleSaveLimits = async () => {
    await handleUpdate({
      beforeBuffer: Number(beforeBuffer),
      afterBuffer: Number(afterBuffer),
      minimumNotice: Number(minimumNotice),
      slotInterval: slotInterval === null ? null : Number(slotInterval),
      limitBookingFrequency,
      limitTotalBookingDuration,
      limitFutureBookings,
      limitUpcomingBookings,
      showOnlyFirstAvailableSlot,
    });
  };

  const handleUpdate = async (updatedFields: Partial<EventType>) => {
    if (isSaving) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await api.put(`/events/${id}`, updatedFields);
      setEvent(res.data.event);
      setMessage({ type: "success", text: "Changes saved successfully! ✓" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to update event type." });
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle availability day status
  const handleToggleDay = (dayIndex: number) => {
    const updated = [...availability];
    updated[dayIndex].enabled = !updated[dayIndex].enabled;
    if (updated[dayIndex].enabled && updated[dayIndex].slots.length === 0) {
      updated[dayIndex].slots = [{ startTime: "09:00", endTime: "17:00" }];
    }
    setAvailability(updated);
  };

  // Update specific day slot times
  const handleSlotTimeChange = (dayIndex: number, slotIndex: number, key: "startTime" | "endTime", value: string) => {
    const updated = [...availability];
    updated[dayIndex].slots[slotIndex][key] = value;
    setAvailability(updated);
  };

  // Booking questions edits
  const handleFieldStatusChange = (fieldId: string, status: "Hidden" | "Optional" | "Required") => {
    const updated = bookingFields.map(f => f.id === fieldId ? { ...f, status } : f);
    setBookingFields(updated);
  };

  const startEditField = (fieldId: string, currentLabel: string) => {
    setEditingFieldId(fieldId);
    setEditingLabel(currentLabel);
  };

  const saveFieldLabel = (fieldId: string) => {
    if (!editingLabel.trim()) return;
    const updated = bookingFields.map(f => f.id === fieldId ? { ...f, label: editingLabel.trim() } : f);
    setBookingFields(updated);
    setEditingFieldId(null);
  };

  const handleDeleteField = (fieldId: string) => {
    const updated = bookingFields.filter(f => f.id !== fieldId);
    setBookingFields(updated);
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const newField = {
      id: `custom_${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      status: newFieldStatus,
      editable: true
    };
    setBookingFields([...bookingFields, newField]);
    setNewFieldLabel("");
    setShowAddForm(false);
  };

  // Convert "09:00" to "9:00 AM" for selector button
  const formatTime24to12 = (time24: string) => {
    const match = TIME_OPTIONS.find(o => o.val === time24);
    return match ? match.label : time24;
  };

  if (isLoading) {
    return (
      <div className={clsx('flex', 'h-screen', 'w-screen', 'items-center', 'justify-center', 'bg-[#FDFBF2]')}>
        <div className={clsx('w-12', 'h-12', 'rounded-full', 'border-4', 'border-[#171614]', 'border-t-transparent', 'animate-spin')}></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={clsx('text-center', 'py-20', 'bg-[#FDFBF2]', 'h-screen', 'flex', 'flex-col', 'justify-center', 'items-center')}>
        <h3 className={clsx('font-cal-sans', 'text-2xl', 'font-bold', 'mb-4')}>Event Type Not Found</h3>
        <Button to="/dashboard" variant="primary" size="md">Back to Dashboard</Button>
      </div>
    );
  }

  const sidebarTabs: Array<{ id: string; name: string; icon: any; comingSoon?: boolean }> = [
    { id: "basics", name: "Basics", icon: Clock },
    { id: "availability", name: "Availability", icon: Calendar },
    { id: "bookingForm", name: "Booking Form", icon: MessageSquare },
    { id: "appearance", name: "Appearance", icon: Sparkles },
    { id: "bookings", name: "View Bookings", icon: Calendar },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "payments", name: "Payment & Seats", icon: Shield },
    { id: "limits", name: "Limits & Buffers", icon: Clock },
    { id: "reschedule", name: "Reschedule & Cancel", icon: Clock },
  ];

  return (
    <div className={clsx('h-screen', 'bg-[#FDFBF2]', 'flex', 'flex-col')}>
      {/* Edit Header */}
      <header className={clsx('h-16', 'px-8', 'flex', 'items-center', 'justify-between', 'border-b', 'border-[#E4E1D4]', 'bg-white')}>
        <div className={clsx('flex', 'items-center', 'gap-4')}>
          <Link to="/dashboard" className={clsx('p-2', 'border', 'border-transparent', 'hover:border-[#171614]/15', 'hover:bg-[#FDFBF2]', 'rounded-xl', 'transition-all')}>
            <ArrowLeft className={clsx('w-4', 'h-4', 'text-[#171614]')} />
          </Link>
          <div className={clsx('leading-tight')}>
            <a
              href={`/book/${username}/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx('block', 'hover:opacity-80')}
            >
              <h1 className={clsx('font-cal-sans', 'text-md', 'font-bold', 'text-[#171614]', 'uppercase', 'tracking-wider')}>{event.title}</h1>
              <div className={clsx('flex', 'items-center', 'gap-1.5', 'text-xs', 'font-semibold', 'text-[#2B2A27]/60', 'mt-0.5')}>
                <span>{window.location.host}/book/{username}/{event.slug}</span>
                <SquareArrowOutDownRight className={clsx('w-3.5', 'h-3.5')} />
              </div>
            </a>
          </div>
        </div>

        {message && (
          <div className={`text-xs font-bold px-4 py-2 border rounded-xl shadow-[2px_2px_0_rgba(23,22,20,0.08)] ${
            message.type === "success" ? "bg-[#7CEFC0] border-[#171614]/15" : "bg-[#E5484D]/10 border-[#E5484D]/30 text-[#E5484D]"
          }`}>
            {message.text}
          </div>
        )}

        <div className={clsx('text-xs', 'font-bold', 'text-[#2B2A27]/60')}>
          Auto-saves layouts
        </div>
      </header>

      {/* Main composition container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left inner sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E4E1D4] bg-white p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0 no-scrollbar">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer w-auto md:w-full ${
                  isActive
                    ? "bg-[#7CEFC0] text-[#171614] border-[#171614]/15 translate-x-[-1px] translate-y-[-1px] shadow-[2px_2px_0_rgba(23,22,20,0.08)]"
                    : "text-[#2B2A27] border-transparent hover:border-[#171614]/15 hover:bg-[#FDFBF2]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-[#171614]" />
                  {tab.name}
                </span>
                {tab.comingSoon && (
                  <span className="text-[9px] bg-[#E4E1D4]/60 border border-[#171614]/10 text-[#171614]/70 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider scale-95">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right workspace panels */}
        <main className={clsx('flex-1', 'p-8', 'overflow-y-auto', 'max-w-4xl', 'mx-auto', activeTab === "analytics" && "no-scrollbar")}>
          
          {/* BASICS PANEL */}
          {activeTab === "basics" && (
            <BasicsTab
              title={title}
              setTitle={setTitle}
              slug={slug}
              setSlug={setSlug}
              duration={duration}
              setDuration={setDuration}
              locationType={locationType}
              setLocationType={setLocationType}
              locationDetails={locationDetails}
              setLocationDetails={setLocationDetails}
              username={username}
              isSaving={isSaving}
              onSave={handleSaveBasics}
            />
          )}

          {/* AVAILABILITY PANEL */}
          {activeTab === "availability" && (
            <AvailabilityTab
              availability={availability}
              onToggleDay={handleToggleDay}
              onSlotTimeChange={handleSlotTimeChange}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              onSave={handleSaveAvailability}
              isSaving={isSaving}
              formatTime24to12={formatTime24to12}
              timeOptions={TIME_OPTIONS}
              timezone={userTimezone}
              onTimezoneChange={setUserTimezone}
              timezoneOptions={TIMEZONE_OPTIONS}
            />
          )}

          {/* BOOKING FORM CONFIGURATION PANEL */}
          {activeTab === "bookingForm" && (
            <BookingFormTab
              bookingFields={bookingFields}
              onFieldStatusChange={handleFieldStatusChange}
              editingFieldId={editingFieldId}
              editingLabel={editingLabel}
              setEditingFieldId={setEditingFieldId}
              setEditingLabel={setEditingLabel}
              onSaveFieldLabel={saveFieldLabel}
              onDeleteField={handleDeleteField}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              newFieldLabel={newFieldLabel}
              setNewFieldLabel={setNewFieldLabel}
              newFieldType={newFieldType}
              setNewFieldType={setNewFieldType}
              newFieldStatus={newFieldStatus}
              setNewFieldStatus={setNewFieldStatus}
              onAddField={handleAddField}
              onSave={handleSaveBookingForm}
              isSaving={isSaving}
            />
          )}

          {/* APPEARANCE PANEL */}
          {activeTab === "appearance" && (
            <AppearanceTab
              appearance={appearance}
              onSave={handleSaveAppearance}
              eventTypeId={event.id}
            />
          )}

          {/* VIEW BOOKINGS PANEL */}
          {activeTab === "bookings" && (
            <BookingsTab eventTypeId={event.id} />
          )}

          {/* ANALYTICS PANEL */}
          {activeTab === "analytics" && (
            <AnalyticsPage eventTypeId={event.id} showTitle={false} />
          )}

          {/* PAYMENTS PANEL */}
          {activeTab === "payments" && (
            <PaymentsTab
              paymentEnabled={paymentEnabled}
              setPaymentEnabled={setPaymentEnabled}
              price={price}
              setPrice={setPrice}
              currency={currency}
              setCurrency={setCurrency}
              seatsEnabled={seatsEnabled}
              setSeatsEnabled={setSeatsEnabled}
              seatsMax={seatsMax}
              setSeatsMax={setSeatsMax}
              seatsShareInfo={seatsShareInfo}
              setSeatsShareInfo={setSeatsShareInfo}
              seatsShowCount={seatsShowCount}
              setSeatsShowCount={setSeatsShowCount}
              isSaving={isSaving}
              onSave={handleSavePayments}
            />
          )}

          {/* LIMITS PANEL */}
          {activeTab === "limits" && (
            <LimitsTab
              beforeBuffer={beforeBuffer}
              setBeforeBuffer={setBeforeBuffer}
              afterBuffer={afterBuffer}
              setAfterBuffer={setAfterBuffer}
              minimumNotice={minimumNotice}
              setMinimumNotice={setMinimumNotice}
              slotInterval={slotInterval}
              setSlotInterval={setSlotInterval}
              limitBookingFrequency={limitBookingFrequency}
              setLimitBookingFrequency={setLimitBookingFrequency}
              limitTotalBookingDuration={limitTotalBookingDuration}
              setLimitTotalBookingDuration={setLimitTotalBookingDuration}
              limitFutureBookings={limitFutureBookings}
              setLimitFutureBookings={setLimitFutureBookings}
              limitUpcomingBookings={limitUpcomingBookings}
              setLimitUpcomingBookings={setLimitUpcomingBookings}
              showOnlyFirstAvailableSlot={showOnlyFirstAvailableSlot}
              setShowOnlyFirstAvailableSlot={setShowOnlyFirstAvailableSlot}
              isSaving={isSaving}
              onSave={handleSaveLimits}
            />
          )}

          {/* RESCHEDULE PANEL */}
          {activeTab === "reschedule" && (
            <RescheduleCancelTab
              rescheduleEnabled={rescheduleEnabled}
              setRescheduleEnabled={setRescheduleEnabled}
              cancelEnabled={cancelEnabled}
              setCancelEnabled={setCancelEnabled}
              rescheduleNotice={rescheduleNotice}
              setRescheduleNotice={setRescheduleNotice}
              cancelNotice={cancelNotice}
              setCancelNotice={setCancelNotice}
              cancellationPolicy={cancellationPolicy}
              setCancellationPolicy={setCancellationPolicy}
              isSaving={isSaving}
              onSave={handleSaveReschedule}
            />
          )}

        </main>
      </div>
    </div>
  );
}
export default EventEditPage;
