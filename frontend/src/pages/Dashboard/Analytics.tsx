import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Clock, 
  Activity, 
  AlertCircle, 
  ArrowUpRight, 
  Briefcase, 
  CreditCard,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import { useApi } from "../../lib/api";
import { Select } from "../../components/ui/Select";

interface EventType {
  id: string;
  title: string;
  price: number;
  currency: string;
  paymentEnabled: boolean;
}

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string | null;
  eventType: EventType;
}

const dateRangeOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "allTime", label: "All Time" },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
};

export interface AnalyticsPageProps {
  eventTypeId?: string;
  showTitle?: boolean;
}

export default function AnalyticsPage({ eventTypeId, showTitle = true }: AnalyticsPageProps = {}) {
  const api = useApi();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("30days");
  const [filterPaidOnly, setFilterPaidOnly] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Copy booking details state & handler
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);

  const handleCopyUserInfo = (b: Booking) => {
    const hasPayment = b.eventType?.paymentEnabled && b.eventType?.price > 0;
    const formattedDate = new Date(b.startTime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = new Date(b.startTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    const textToCopy = [
      `Name: ${b.attendeeName}`,
      `Email: ${b.attendeeEmail}`,
      b.attendeePhone ? `Phone: ${b.attendeePhone}` : null,
      `Meeting Type: ${b.eventType?.title || "Custom Meeting"}`,
      `Date: ${formattedDate}`,
      `Time: ${formattedTime}`,
      `Status: ${b.status === "pending_payment" ? "Pending Payment" : b.status}`,
      hasPayment ? `Price: ${CURRENCY_SYMBOLS[b.eventType.currency] || b.eventType.currency} ${b.eventType.price.toFixed(2)}` : "Price: Free",
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(textToCopy);
    setCopiedBookingId(b.id);
    setTimeout(() => setCopiedBookingId(null), 2000);
  };

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMsg("");

      const [bookingsRes, eventsRes] = await Promise.all([
        api.get("/bookings"),
        api.get("/events"),
      ]);

      setBookings(bookingsRes.data.bookings || []);
      setEventTypes(eventsRes.data.events || []);
      setCurrentPage(1); // Reset page on refresh
    } catch (err: any) {
      console.error("Error fetching analytics data:", err);
      setErrorMsg("Failed to load analytics records.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset page when dateRange filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, filterPaidOnly]);

  // Filter bookings based on Event Type and Date Range selection
  const filteredBookings = bookings.filter((b) => {
    // If eventTypeId is provided, filter specifically for this event type
    if (eventTypeId && b.eventType?.id !== eventTypeId) {
      return false;
    }

    const bookingDate = new Date(b.startTime);
    const now = new Date();
    
    if (dateRange === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return bookingDate >= sevenDaysAgo;
    }
    if (dateRange === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return bookingDate >= thirtyDaysAgo;
    }
    if (dateRange === "thisMonth") {
      return (
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
      );
    }
    return true; // allTime
  });

  // Calculate stats
  const totalBookings = filteredBookings.length;
  const cancelledBookings = filteredBookings.filter((b) => b.status === "cancelled").length;
  const pendingPayments = filteredBookings.filter((b) => b.status === "pending_payment").length;
  const confirmedBookings = filteredBookings.filter((b) => b.status === "confirmed").length;

  // Revenue & Currency Breakdowns (Only confirmed/paid bookings generate revenue)
  const revenueByCurrency: Record<string, number> = {};
  const paidBookingsCountByCurrency: Record<string, number> = {};

  filteredBookings.forEach((b) => {
    if (b.status === "confirmed" && b.eventType?.paymentEnabled && b.eventType?.price > 0) {
      const currency = b.eventType.currency || "INR";
      revenueByCurrency[currency] = (revenueByCurrency[currency] || 0) + b.eventType.price;
      paidBookingsCountByCurrency[currency] = (paidBookingsCountByCurrency[currency] || 0) + 1;
    }
  });

  // Unique paid bookings total
  const totalPaidBookings = Object.values(paidBookingsCountByCurrency).reduce((a, b) => a + b, 0);

  // Group bookings by event type
  const bookingsByEventType: Record<string, { title: string; count: number; color: string }> = {};
  
  const colors = ["bg-[#8C7CF0]", "bg-[#7CEFC0]", "bg-[#F3E75B]", "bg-[#E5484D]", "bg-blue-400"];

  eventTypes.forEach((et, index) => {
    bookingsByEventType[et.id] = {
      title: et.title,
      count: 0,
      color: colors[index % colors.length],
    };
  });

  filteredBookings.forEach((b) => {
    if (b.eventType?.id && bookingsByEventType[b.eventType.id]) {
      bookingsByEventType[b.eventType.id].count += 1;
    }
  });

  const eventTypePopularity = Object.values(bookingsByEventType)
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  // Daily booking distribution for Bar Chart (last 7 days or matching range)
  const getChartData = () => {
    const daysToCount = dateRange === "7days" ? 7 : 14; // Limit chart columns for clean visual rendering
    const counts: Record<string, number> = {};
    const labels: string[] = [];
    
    for (let i = daysToCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      counts[key] = 0;
      labels.push(key);
    }

    filteredBookings.forEach((b) => {
      const key = new Date(b.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (counts[key] !== undefined) {
        counts[key] += 1;
      }
    });

    return labels.map((label) => ({
      label,
      value: counts[label],
    }));
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map((d) => d.value), 1);

  // List of bookings filtered for table
  const tableBookings = filteredBookings.filter((b) => {
    if (filterPaidOnly) {
      return b.eventType?.paymentEnabled && b.eventType?.price > 0;
    }
    return true;
  });

  // Paginated bookings
  const totalPages = Math.max(Math.ceil(tableBookings.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = tableBookings.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#171614] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 font-sans no-scrollbar">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
        <div>
          <h3 className="font-cal-sans text-xl font-bold text-[#171614] uppercase tracking-wider">
            {showTitle ? "Analytics Overview" : "Analytics"}
          </h3>
          <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">
            Track metrics, payment revenues, and booking schedules.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            options={dateRangeOptions}
            size="sm"
            className="w-40"
          />

          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 border border-[#E4E1D4] hover:border-[#171614] rounded-xl bg-white hover:bg-[#FDFBF2] active:scale-95 transition-all text-[#171614] inline-flex items-center justify-center cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={clsx("w-4.5 h-4.5", isRefreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2.5 p-4 border border-[#E5484D]/30 bg-[#E5484D]/10 text-[#E5484D] rounded-2xl text-xs font-semibold">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings Card */}
        <div className="bg-white border border-[#E4E1D4] rounded-2xl p-5 shadow-[2px_2px_0_rgba(23,22,20,0.04)] hover:shadow-[4px_4px_0_rgba(23,22,20,0.08)] hover:-translate-y-0.5 transition-all flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2A27]/55">Total Bookings</span>
            <div className="p-1.5 bg-[#8C7CF0]/10 border border-[#8C7CF0]/20 rounded-lg">
              <Calendar className="w-4 h-4 text-[#8C7CF0]" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-extrabold text-[#171614] font-cal-sans">{totalBookings}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>Active Scheduled Meetings</span>
            </div>
          </div>
        </div>

        {/* Total Collections Card */}
        <div className="bg-white border border-[#E4E1D4] rounded-2xl p-5 shadow-[2px_2px_0_rgba(23,22,20,0.04)] hover:shadow-[4px_4px_0_rgba(23,22,20,0.08)] hover:-translate-y-0.5 transition-all flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2A27]/55">Payments Received</span>
            <div className="p-1.5 bg-[#7CEFC0]/15 border border-[#7CEFC0]/30 rounded-lg">
              <DollarSign className="w-4 h-4 text-[#2B2A27]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="space-y-0.5">
              {Object.keys(revenueByCurrency).length > 0 ? (
                Object.entries(revenueByCurrency).map(([cur, amt]) => (
                  <h2 key={cur} className="text-2xl font-extrabold text-[#171614] font-cal-sans leading-none">
                    {CURRENCY_SYMBOLS[cur] || cur} {amt.toLocaleString()}
                  </h2>
                ))
              ) : (
                <h2 className="text-2xl font-extrabold text-[#171614] font-cal-sans">0.00</h2>
              )}
            </div>
            <div className="text-[10px] font-bold text-[#2B2A27]/55 mt-1">
              From {totalPaidBookings} paid bookings
            </div>
          </div>
        </div>

        {/* Paid Bookings Card */}
        <div className="bg-white border border-[#E4E1D4] rounded-2xl p-5 shadow-[2px_2px_0_rgba(23,22,20,0.04)] hover:shadow-[4px_4px_0_rgba(23,22,20,0.08)] hover:-translate-y-0.5 transition-all flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2A27]/55">Payment Ratio</span>
            <div className="p-1.5 bg-[#F3E75B]/15 border border-[#F3E75B]/30 rounded-lg">
              <CreditCard className="w-4 h-4 text-[#171614]" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-extrabold text-[#171614] font-cal-sans">
              {totalBookings > 0 ? Math.round((totalPaidBookings / totalBookings) * 100) : 0}%
            </h2>
            <div className="text-[10px] font-bold text-[#2B2A27]/55 mt-1">
              {totalPaidBookings} of {totalBookings} booked slots
            </div>
          </div>
        </div>

        {/* Confirmed Bookings Status */}
        <div className="bg-white border border-[#E4E1D4] rounded-2xl p-5 shadow-[2px_2px_0_rgba(23,22,20,0.04)] hover:shadow-[4px_4px_0_rgba(23,22,20,0.08)] hover:-translate-y-0.5 transition-all flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2A27]/55">Confirmed Slots</span>
            <div className="p-1.5 bg-blue-50/50 border border-blue-100 rounded-lg">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-extrabold text-[#171614] font-cal-sans">{confirmedBookings}</h2>
            <div className="text-[10px] font-bold text-[#2B2A27]/55 mt-1">
              {pendingPayments} pending, {cancelledBookings} cancelled
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Booking Volume Trend Chart */}
        <div className={clsx(
          "bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[2px_2px_0_rgba(23,22,20,0.04)] flex flex-col justify-between",
          eventTypeId ? "lg:col-span-5" : "lg:col-span-3"
        )}>
          <div>
            <h3 className="font-cal-sans text-sm font-bold uppercase tracking-wider text-[#171614]">
              Booking Volume Trend
            </h3>
            <p className="text-[10px] text-[#2B2A27]/55 font-semibold">
              Meetings booked per day over the selected timeframe.
            </p>
          </div>

          {/* SVG Custom Bar Chart */}
          <div className="mt-6 flex flex-col justify-end h-48 w-full border-b border-[#E4E1D4] pb-1">
            <div className="flex justify-between items-end h-full w-full gap-2 px-1">
              {chartData.map((d, i) => {
                const heightPercent = (d.value / maxChartValue) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                    {/* Tooltip bubble */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#171614] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded mb-1 select-none pointer-events-none">
                      {d.value}
                    </div>
                    {/* Bar */}
                    <div 
                      style={{ height: `${Math.max(heightPercent, 4)}%` }} 
                      className={clsx(
                        "w-full rounded-t-[4px] transition-all duration-300",
                        d.value > 0 
                          ? "bg-[#7CEFC0] border border-[#171614]/15 hover:bg-[#58D9A6]" 
                          : "bg-gray-100 border border-gray-200"
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {/* Chart Labels */}
          <div className="flex justify-between w-full pt-2 text-[9px] font-bold text-[#2B2A27]/50 uppercase tracking-wide px-2">
            <span>{chartData[0]?.label}</span>
            <span>{chartData[Math.floor(chartData.length / 2)]?.label}</span>
            <span>{chartData[chartData.length - 1]?.label}</span>
          </div>
        </div>

        {/* Popular Event Types - Only shown when viewing global analytics */}
        {!eventTypeId && (
          <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[2px_2px_0_rgba(23,22,20,0.04)] lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-cal-sans text-sm font-bold uppercase tracking-wider text-[#171614]">
                Meeting Types Distribution
              </h3>
              <p className="text-[10px] text-[#2B2A27]/55 font-semibold">
                Performance breakdown of each individual meeting type.
              </p>
            </div>

            <div className="space-y-4 my-6 overflow-y-auto max-h-52 pr-1">
              {eventTypePopularity.length > 0 ? (
                eventTypePopularity.map((item, index) => {
                  const percentage = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-[#171614] truncate max-w-[70%]">{item.title}</span>
                        <span className="text-[#2B2A27]/60">
                          {item.count} bookings ({percentage}%)
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                        <div 
                          style={{ width: `${percentage}%` }} 
                          className={clsx("h-full rounded-full transition-all duration-500", item.color)}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                  <Briefcase className="w-8 h-8 text-[#2B2A27]/30" />
                  <span className="text-[10px] text-[#2B2A27]/50 font-bold">No event type data found.</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E4E1D4]/40 flex justify-between text-[9px] font-bold text-[#2B2A27]/40 uppercase tracking-wide">
              <span>Productivity Ratio</span>
              <span>{eventTypePopularity.length} active types</span>
            </div>
          </div>
        )}
      </div>

      {/* Transaction / Bookings List Table */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl shadow-[2px_2px_0_rgba(23,22,20,0.04)] overflow-hidden">
        {/* Table Top actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 gap-3 border-b border-[#E4E1D4] bg-gray-50/50">
          <div>
            <h3 className="font-cal-sans text-sm font-bold uppercase tracking-wider text-[#171614]">
              Transaction & Bookings List
            </h3>
            <p className="text-[10px] text-[#2B2A27]/55 font-semibold">
              Browse details of booked slots and check validation limits.
            </p>
          </div>

          {/* Toggle filter paid-only */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#171614] uppercase tracking-wider">
            <input
              type="checkbox"
              checked={filterPaidOnly}
              onChange={(e) => setFilterPaidOnly(e.target.checked)}
              className="w-4 h-4 rounded border border-[#E4E1D4] accent-[#7CEFC0]"
            />
            <span>Show Paid Only</span>
          </label>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {tableBookings.length > 0 ? (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E4E1D4] text-[10px] font-extrabold uppercase tracking-wider text-[#2B2A27]/55 bg-gray-50/30">
                    <th className="py-3.5 px-6">Attendee</th>
                    <th className="py-3.5 px-6">Scheduled Date</th>
                    <th className="py-3.5 px-6">Meeting Type</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Payment/Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E1D4]/50">
                  {paginatedBookings.map((b) => {
                    const hasPayment = b.eventType?.paymentEnabled && b.eventType?.price > 0;
                    const formattedDate = new Date(b.startTime).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const formattedTime = new Date(b.startTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={b.id} className="hover:bg-[#FDFBF2]/20 transition-all text-xs text-[#171614]">
                        {/* Attendee */}
                        <td className="py-4.5 px-6">
                          <div className="flex items-center gap-1.5 font-bold text-[#171614]">
                            <span>{b.attendeeName}</span>
                            <button
                              onClick={() => handleCopyUserInfo(b)}
                              className="p-1 hover:bg-gray-150 rounded text-gray-400 hover:text-gray-900 transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
                              title="Copy Details"
                            >
                              {copiedBookingId === b.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="text-[10px] text-[#2B2A27]/50 mt-0.5">{b.attendeeEmail}</div>
                        </td>

                        {/* Scheduled Date */}
                        <td className="py-4.5 px-6">
                          <div className="font-semibold">{formattedDate}</div>
                          <div className="text-[10px] text-[#2B2A27]/50 mt-0.5">{formattedTime}</div>
                        </td>

                        {/* Meeting Type */}
                        <td className="py-4.5 px-6 text-xs font-semibold text-[#171614]">
                          {b.eventType?.title || "Custom Meeting"}
                        </td>

                        {/* Status */}
                        <td className="py-4.5 px-6 text-center">
                          <span 
                            className={clsx(
                              "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                              b.status === "confirmed" && "bg-emerald-50 text-emerald-700 border-emerald-250",
                              b.status === "cancelled" && "bg-red-50 text-red-600 border-red-200",
                              b.status === "pending_payment" && "bg-amber-50 text-amber-600 border-amber-250"
                            )}
                          >
                            {b.status === "pending_payment" ? "Pending" : b.status}
                          </span>
                        </td>

                        {/* Payment/Price */}
                        <td className="py-4.5 px-6 text-right text-xs font-bold">
                          {hasPayment ? (
                            <span className={clsx(b.status === "confirmed" ? "text-emerald-700" : "text-amber-600")}>
                              {CURRENCY_SYMBOLS[b.eventType.currency] || b.eventType.currency} {b.eventType.price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-[#2B2A27]/40 text-xs uppercase font-bold">Free</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Table Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-3.5 bg-gray-50/50 border-t border-[#E4E1D4] text-xs font-bold text-[#2B2A27] select-none">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-[#E4E1D4] hover:border-[#171614] rounded-xl bg-white hover:bg-[#FDFBF2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E4E1D4] disabled:hover:bg-white active:scale-95 disabled:active:scale-100 transition-all text-[#171614] cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-[#2B2A27]/70 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 border border-[#E4E1D4] hover:border-[#171614] rounded-xl bg-white hover:bg-[#FDFBF2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E4E1D4] disabled:hover:bg-white active:scale-95 disabled:active:scale-100 transition-all text-[#171614] cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Calendar className="w-10 h-10 text-[#2B2A27]/30" />
              <div className="space-y-1">
                <span className="block text-xs font-bold text-[#171614] uppercase tracking-wide">No Transactions Found</span>
                <span className="block text-[10px] text-[#2B2A27]/50">
                  {filterPaidOnly ? "Try disabling the 'Show Paid Only' filter to see free bookings." : "No scheduled slots in the selected period."}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
