import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Video,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  X,
  Copy,
  Check,
  User,
} from "lucide-react";
import { Select } from "../../../components/ui/Select";

const timeOfDayOptions = [
  { value: "all", label: "Any Time" },
  { value: "morning", label: "Morning (Before 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
  { value: "evening", label: "Evening (After 5 PM)" },
];

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string | null;
  bookingFieldsData: Record<string, any> | null;
  eventType: {
    id: string;
    title: string;
    duration: number;
    locationType: string;
    locationDetails: string;
  };
}

interface EventTypeOption {
  id: string;
  title: string;
}

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  isManualRefreshing: boolean;
  onRefresh: () => void;
  errorMsg: string;
  /** When provided, renders an Event Type dropdown filter */
  eventTypes?: EventTypeOption[];
  /** When true, renders an inline header with title/description + refresh button */
  showHeader?: boolean;
  headerTitle?: string;
  headerDescription?: string;
}

export function BookingsList({
  bookings,
  isLoading,
  isManualRefreshing,
  onRefresh,
  errorMsg,
  eventTypes,
  showHeader = false,
  headerTitle = "Bookings",
  headerDescription = "View all bookings.",
}: BookingsListProps) {
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("all");
  const [selectedEventTypeId, setSelectedEventTypeId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, timeOfDay, selectedEventTypeId]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setTimeOfDay("all");
    setSelectedEventTypeId("all");
  };

  const isAnyFilterActive =
    searchTerm !== "" ||
    startDate !== "" ||
    endDate !== "" ||
    timeOfDay !== "all" ||
    (!!eventTypes && selectedEventTypeId !== "all");

  const filteredBookings = bookings.filter((booking) => {
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      const match =
        booking.attendeeName.toLowerCase().includes(q) ||
        booking.attendeeEmail.toLowerCase().includes(q) ||
        booking.eventType.title.toLowerCase().includes(q) ||
        (booking.bookingFieldsData &&
          Object.values(booking.bookingFieldsData).some((v) =>
            String(v).toLowerCase().includes(q)
          ));
      if (!match) return false;
    }

    const bd = new Date(booking.startTime);
    const bdo = new Date(bd.getFullYear(), bd.getMonth(), bd.getDate());

    if (startDate) {
      const s = new Date(startDate);
      if (bdo < new Date(s.getFullYear(), s.getMonth(), s.getDate())) return false;
    }
    if (endDate) {
      const e = new Date(endDate);
      if (bdo > new Date(e.getFullYear(), e.getMonth(), e.getDate())) return false;
    }

    if (timeOfDay !== "all") {
      const h = new Date(booking.startTime).getHours();
      if (timeOfDay === "morning" && h >= 12) return false;
      if (timeOfDay === "afternoon" && (h < 12 || h >= 17)) return false;
      if (timeOfDay === "evening" && h < 17) return false;
    }

    if (eventTypes && selectedEventTypeId !== "all" && booking.eventType.id !== selectedEventTypeId) {
      return false;
    }

    return true;
  });

  const totalPages = Math.max(Math.ceil(filteredBookings.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleCopyUserInfo = (booking: Booking) => {
    const fd = new Date(booking.startTime).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
    const ft = new Date(booking.startTime).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit",
    });
    const text = [
      `Name: ${booking.attendeeName}`,
      `Email: ${booking.attendeeEmail}`,
      booking.attendeePhone ? `Phone: ${booking.attendeePhone}` : null,
      `Meeting Type: ${booking.eventType.title}`,
      `Date: ${fd}`,
      `Time: ${ft}`,
      `Status: ${booking.status === "pending_payment" ? "Pending Payment" : booking.status}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedBookingId(booking.id);
    setTimeout(() => setCopiedBookingId(null), 2000);
  };

  const toggleExpand = (id: string) => setExpandedBookingId(expandedBookingId === id ? null : id);

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-10 h-10 rounded-full border-4 border-[#171614] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header (BookingsTab mode) */}
      {showHeader ? (
        <div className="flex justify-between items-center bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
          <div>
            <h3 className="font-cal-sans text-xl font-bold text-[#171614] uppercase tracking-wider">
              {headerTitle}
            </h3>
            <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">{headerDescription}</p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 border border-[#E4E1D4] rounded-xl hover:border-[#171614] hover:bg-[#FDFBF2] transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={clsx("w-4 h-4 text-[#171614]", isManualRefreshing && "animate-spin")} />
          </button>
        </div>
      ) : (
        /* Standalone refresh button (Bookings page mode) */
        <div className="flex justify-end">
          <button
            onClick={onRefresh}
            className="p-2 border border-[#E4E1D4] rounded-xl hover:border-[#171614] hover:bg-[#FDFBF2] bg-white transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={clsx("w-4 h-4 text-[#171614]", isManualRefreshing && "animate-spin")} />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-[#E5484D]/10 border border-[#E5484D]/30 text-[#E5484D] text-xs font-bold rounded-2xl">
          ✕ {errorMsg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-5 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-4">
        <div className={clsx("grid gap-3.5", eventTypes ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5")}>
          {/* Search */}
          <div className={clsx("space-y-1 flex flex-col justify-end", eventTypes ? "col-span-1 sm:col-span-2 lg:col-span-2" : "col-span-1 sm:col-span-2")}>
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">Search</label>
            <div className="relative w-full h-9">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#2B2A27]/40" />
              </span>
              <input
                type="text"
                placeholder={eventTypes ? "Search guest, email, event..." : "Search guest, email or notes..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-full pl-9 pr-4 py-2 border border-[#E4E1D4] rounded-xl text-xs font-semibold text-[#171614] bg-[#FDFBF2]/20 focus:outline-none focus:border-[#171614] transition-all"
              />
            </div>
          </div>

          {/* From Date */}
          <div className="space-y-1 flex flex-col justify-end">
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-9 px-3 py-2 border border-[#E4E1D4] rounded-xl text-xs font-semibold text-[#171614] bg-[#FDFBF2]/20 focus:outline-none focus:border-[#171614] transition-all"
            />
          </div>

          {/* To Date */}
          <div className="space-y-1 flex flex-col justify-end">
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-9 px-3 py-2 border border-[#E4E1D4] rounded-xl text-xs font-semibold text-[#171614] bg-[#FDFBF2]/20 focus:outline-none focus:border-[#171614] transition-all"
            />
          </div>

          {/* Time of Day */}
          <div className="space-y-1 flex flex-col justify-end">
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">Time of Day</label>
            <Select
              value={timeOfDay}
              onChange={(val) => setTimeOfDay(val)}
              options={timeOfDayOptions}
              size="sm"
              className="h-9"
            />
          </div>

          {/* Event Type (optional) */}
          {eventTypes && (
            <div className="space-y-1 flex flex-col justify-end">
              <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">Event Type</label>
              <Select
                value={selectedEventTypeId}
                onChange={(val) => setSelectedEventTypeId(val)}
                options={[
                  { value: "all", label: "All Event Types" },
                  ...eventTypes.map((et) => ({ value: et.id, label: et.title })),
                ]}
                size="sm"
                className="h-9"
              />
            </div>
          )}
        </div>

        {isAnyFilterActive && (
          <div className="flex justify-between items-center pt-1 animate-in fade-in duration-150">
            <span className="text-[10px] font-bold text-[#2B2A27]/50 uppercase tracking-wider">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""} found
            </span>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-[11px] font-bold text-[#E5484D] hover:underline cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Booking Cards */}
      {bookings.length === 0 ? (
        <div className="bg-white border border-[#E4E1D4] rounded-2xl p-12 text-center shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-3">
          <Calendar className="w-10 h-10 text-[#171614] opacity-50 mx-auto" />
          <h4 className="font-cal-sans text-sm font-bold uppercase tracking-wider text-[#171614]">No Bookings Found</h4>
          <p className="text-xs font-semibold text-[#2B2A27]/60 max-w-xs mx-auto">
            {showHeader
              ? "Once guests schedule appointments using this link, they will be listed here."
              : "Once invitees schedule meetings on your public links, they will be listed here."}
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white border border-[#E4E1D4] rounded-2xl p-12 text-center shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-3">
          <Search className="w-10 h-10 text-[#171614] opacity-50 mx-auto" />
          <h4 className="font-cal-sans text-sm font-bold uppercase tracking-wider text-[#171614]">No Bookings Match Filters</h4>
          <p className="text-xs font-semibold text-[#2B2A27]/60 max-w-xs mx-auto">
            Try adjusting your search query, dates, time, or selected event type filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-2 px-4 py-2 bg-[#7CEFC0] text-[#171614] border border-[#171614] rounded-xl text-xs font-bold shadow-[2px_2px_0_rgba(23,22,20,0.08)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_rgba(23,22,20,0.1)] transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {paginatedBookings.map((booking) => {
            const isExpanded = expandedBookingId === booking.id;
            const hasCustomFields = booking.bookingFieldsData && Object.keys(booking.bookingFieldsData).length > 0;
            return (
              <div
                key={booking.id}
                className="bg-white border border-[#E4E1D4] rounded-2xl shadow-[3px_3px_0_rgba(23,22,20,0.06)] hover:shadow-[3px_3px_0_rgba(23,22,20,0.1)] hover:border-[#171614]/30 transition-all overflow-hidden"
              >
                <div
                  onClick={() => toggleExpand(booking.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#7CEFC0]/20 border border-[#7CEFC0]/40 rounded-xl text-center min-w-[100px]">
                      <span className="text-[10px] font-extrabold uppercase text-[#171614] block tracking-wide">
                        {new Date(booking.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-[11px] font-bold text-[#2B2A27]/85 block mt-0.5">
                        {fmtTime(booking.startTime)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-cal-sans text-sm font-bold text-[#171614] uppercase tracking-wide">
                        {booking.eventType.title}
                      </h4>
                      <p className="text-xs text-[#2B2A27]/70 font-semibold flex items-center gap-1.5 mt-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{booking.attendeeName} ({booking.attendeeEmail})</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopyUserInfo(booking); }}
                          className="p-1 hover:bg-gray-150 rounded text-gray-400 hover:text-gray-900 transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
                          title="Copy Details"
                        >
                          {copiedBookingId === booking.id
                            ? <Check className="w-3 h-3 text-emerald-600" />
                            : <Copy className="w-3 h-3" />}
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-[#E4E1D4]/40">
                    <div className="flex items-center gap-4 text-xs font-semibold text-[#2B2A27]/80">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#171614]/60" />
                        <span>{booking.eventType.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {booking.eventType.locationType === "Video"
                          ? <Video className="w-3.5 h-3.5 text-[#171614]/60" />
                          : <MapPin className="w-3.5 h-3.5 text-[#171614]/60" />}
                        <span>{booking.eventType.locationDetails}</span>
                      </div>
                    </div>
                    <button className="p-1 border border-[#E4E1D4]/80 rounded-lg hover:border-[#171614] transition-all">
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-[#171614]" />
                        : <ChevronDown className="w-4 h-4 text-[#171614]" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[#E4E1D4]/40 bg-[#FDFBF2]/20 space-y-4 pt-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-[#171614]">
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-extrabold uppercase text-[#2B2A27]/50 tracking-wider">Guest Contact Info</h5>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-[#2B2A27]/40" />
                            <a href={`mailto:${booking.attendeeEmail}`} className="hover:underline">{booking.attendeeEmail}</a>
                          </div>
                          {booking.attendeePhone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-[#2B2A27]/40" />
                              <span>{booking.attendeePhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-extrabold uppercase text-[#2B2A27]/50 tracking-wider">Meeting Time Frame</h5>
                        <div className="space-y-1.5 text-[#2B2A27]/85">
                          <div>Date: <span className="font-bold text-[#171614]">{fmtDate(booking.startTime)}</span></div>
                          <div>Time: <span className="font-bold text-[#171614]">{fmtTime(booking.startTime)} – {fmtTime(booking.endTime)}</span> (UTC)</div>
                        </div>
                      </div>
                    </div>
                    {hasCustomFields && (
                      <div className="pt-3 border-t border-[#E4E1D4]/30 space-y-2">
                        <h5 className="text-[10px] font-extrabold uppercase text-[#2B2A27]/50 tracking-wider">Responses to Custom Questions</h5>
                        <div className="grid grid-cols-1 gap-2.5 text-xs">
                          {Object.entries(booking.bookingFieldsData || {}).map(([key, val]) => (
                            <div key={key} className="bg-white border border-[#E4E1D4]/70 p-2.5 rounded-xl">
                              <span className="text-[10px] font-bold text-[#2B2A27]/60 block mb-0.5">{key.replace(/_/g, " ")}</span>
                              <span className="font-semibold text-[#171614] whitespace-pre-wrap">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {bookings.length > 0 && filteredBookings.length > 0 && totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-3.5 bg-white border border-[#E4E1D4] rounded-2xl shadow-[3px_3px_0_rgba(23,22,20,0.06)] text-xs font-bold text-[#2B2A27] select-none mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 border border-[#E4E1D4] hover:border-[#171614] rounded-xl bg-white hover:bg-[#FDFBF2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E4E1D4] disabled:hover:bg-white active:scale-95 disabled:active:scale-100 transition-all text-[#171614] cursor-pointer"
          >
            Previous
          </button>
          <span className="text-[#2B2A27]/70 font-semibold">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 border border-[#E4E1D4] hover:border-[#171614] rounded-xl bg-white hover:bg-[#FDFBF2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E4E1D4] disabled:hover:bg-white active:scale-95 disabled:active:scale-100 transition-all text-[#171614] cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingsList;
