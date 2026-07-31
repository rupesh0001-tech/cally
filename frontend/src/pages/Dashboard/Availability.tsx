import React, { useState, useEffect } from "react";
import { Save, ChevronDown, Globe } from "lucide-react";
import { useApi } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import clsx from "clsx";

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

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DayConfig {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
}

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

export default function AvailabilityPage() {
  const api = useApi();
  const [availability, setAvailability] = useState<DayConfig[]>([]);
  const [timezone, setTimezone] = useState("UTC");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<{ dayIdx: number; slotIdx: number; type: "start" | "end" } | null>(null);

  // Convert "09:00" to "9:00 AM" for selector button
  const formatTime24to12 = (time24: string) => {
    const match = TIME_OPTIONS.find(o => o.val === time24);
    return match ? match.label : time24;
  };

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      setMessage(null);
      const res = await api.get("/users/availability");
      setAvailability(res.data.availability || []);
      if (res.data.timezone) setTimezone(res.data.timezone);
    } catch (err: any) {
      console.error("Error loading availability:", err);
      setMessage({ type: "error", text: "Failed to load availability schedule." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClose = () => setActiveDropdown(null);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, []);

  const handleToggleDay = (dayIndex: number) => {
    const updated = [...availability];
    updated[dayIndex].enabled = !updated[dayIndex].enabled;
    if (updated[dayIndex].enabled && updated[dayIndex].slots.length === 0) {
      updated[dayIndex].slots = [{ startTime: "09:00", endTime: "17:00" }];
    }
    setAvailability(updated);
  };

  const handleSlotTimeChange = (dayIndex: number, slotIndex: number, key: "startTime" | "endTime", value: string) => {
    const updated = [...availability];
    updated[dayIndex].slots[slotIndex][key] = value;
    setAvailability(updated);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setMessage(null);

    try {
      await api.put("/users/availability", { availability, timezone });
      setMessage({ type: "success", text: "Availability schedule saved successfully! ✓" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("Error saving availability:", err);
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to update availability schedule." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 rounded-full border-3 border-[#171614] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-center bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
        <div>
          <h3 className="font-cal-sans text-xl font-bold text-[#171614] uppercase tracking-wider">
            General Availability
          </h3>
          <p className="text-xs font-semibold text-[#2B2A27]/60 mt-1">
            Configure your default working hours. New event types will automatically copy this schedule.
          </p>
        </div>

        {message && (
          <div className={`text-xs font-bold px-4 py-2 border rounded-xl shadow-[2px_2px_0_rgba(23,22,20,0.08)] ${
            message.type === "success" ? "bg-[#7CEFC0] border-[#171614]/15" : "bg-[#E5484D]/10 border-[#E5484D]/30 text-[#E5484D]"
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-8 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#E4E1D4]/60">
          <div>
            <h3 className="font-cal-sans text-lg font-bold text-[#171614] uppercase tracking-wider">
              Availability
            </h3>
            <p className="text-xs font-semibold text-[#2B2A27]/60 mt-1">
              Select days and time slots when you're open for bookings.
            </p>
          </div>

          {/* Compact Timezone Selector */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#2B2A27]/70 shrink-0">
            <Globe className="w-4 h-4 text-[#171614]" />
            <span>Timezone:</span>
            <Select
              value={timezone}
              onChange={(val) => setTimezone(val)}
              options={TIMEZONE_OPTIONS}
              className="w-48"
              buttonClassName="w-full px-4 py-2 border border-[#E4E1D4] rounded-lg bg-white font-semibold text-[#171614] text-xs text-left flex justify-between items-center hover:bg-[#FDFBF2] transition-all cursor-pointer shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {availability.map((dayConfig, dayIdx) => (
            <div key={dayConfig.day} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-[#E4E1D4]/60 last:border-b-0">
              <label className="flex items-center gap-3 w-full sm:w-32 cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={dayConfig.enabled}
                  onChange={() => handleToggleDay(dayIdx)}
                  className="w-4.5 h-4.5 rounded border border-[#E4E1D4] accent-[#7CEFC0] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#171614]">{dayConfig.day}</span>
              </label>

              {dayConfig.enabled ? (
                <div className="flex-1 flex flex-col gap-3 w-full">
                  {dayConfig.slots.map((slot, slotIdx) => {
                    const isStartOpen = activeDropdown?.dayIdx === dayIdx && activeDropdown?.slotIdx === slotIdx && activeDropdown?.type === "start";
                    const isEndOpen = activeDropdown?.dayIdx === dayIdx && activeDropdown?.slotIdx === slotIdx && activeDropdown?.type === "end";

                    return (
                      <div key={slotIdx} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* Custom Time slot Start Trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isStartOpen) {
                                setActiveDropdown(null);
                              } else {
                                setActiveDropdown({ dayIdx, slotIdx, type: "start" });
                              }
                            }}
                            className="px-3.5 py-2 border border-[#E4E1D4] rounded-xl text-xs font-bold text-[#171614] bg-white hover:bg-[#FDFBF2] transition-all flex items-center gap-2 cursor-pointer min-w-[110px] justify-between shadow-sm focus:outline-none focus:border-[#B7ACF7]"
                          >
                            <span>{formatTime24to12(slot.startTime)}</span>
                            <ChevronDown className="w-4.5 h-4.5 text-[#2B2A27]/50" />
                          </button>
                          {isStartOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white border border-[#E4E1D4] rounded-2xl shadow-xl z-40 p-4 animate-in fade-in zoom-in-95 duration-100">
                              <div className="text-[10px] font-extrabold uppercase text-[#171614]/65 tracking-wider mb-2 text-center">
                                Select Start Time
                              </div>
                              <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1">
                                {TIME_OPTIONS.map((opt) => (
                                  <button
                                    type="button"
                                    key={opt.val}
                                    onClick={() => {
                                      handleSlotTimeChange(dayIdx, slotIdx, "startTime", opt.val);
                                      setActiveDropdown(null);
                                    }}
                                    className={`py-1.5 text-[10px] font-bold border rounded-lg transition-all cursor-pointer text-center ${
                                      slot.startTime === opt.val
                                        ? "bg-[#7CEFC0] text-[#171614] border-[#171614]/15 shadow-[1px_1px_0_rgba(23,22,20,0.08)]"
                                        : "bg-white border-[#E4E1D4] text-[#2B2A27] hover:bg-[#FDFBF2] hover:border-[#171614]/15"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-xs font-bold text-[#2B2A27]/60">to</span>

                        {/* Custom Time slot End Trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isEndOpen) {
                                setActiveDropdown(null);
                              } else {
                                setActiveDropdown({ dayIdx, slotIdx, type: "end" });
                              }
                            }}
                            className="px-3.5 py-2 border border-[#E4E1D4] rounded-xl text-xs font-bold text-[#171614] bg-white hover:bg-[#FDFBF2] transition-all flex items-center gap-2 cursor-pointer min-w-[110px] justify-between shadow-sm focus:outline-none focus:border-[#B7ACF7]"
                          >
                            <span>{formatTime24to12(slot.endTime)}</span>
                            <ChevronDown className="w-4.5 h-4.5 text-[#2B2A27]/50" />
                          </button>
                          {isEndOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white border border-[#E4E1D4] rounded-2xl shadow-xl z-40 p-4 animate-in fade-in zoom-in-95 duration-100">
                              <div className="text-[10px] font-extrabold uppercase text-[#171614]/65 tracking-wider mb-2 text-center">
                                Select End Time
                              </div>
                              <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1">
                                {TIME_OPTIONS.map((opt) => (
                                  <button
                                    type="button"
                                    key={opt.val}
                                    onClick={() => {
                                      handleSlotTimeChange(dayIdx, slotIdx, "endTime", opt.val);
                                      setActiveDropdown(null);
                                    }}
                                    className={`py-1.5 text-[10px] font-bold border rounded-lg transition-all cursor-pointer text-center ${
                                      slot.endTime === opt.val
                                        ? "bg-[#7CEFC0] text-[#171614] border-[#171614]/15 shadow-[1px_1px_0_rgba(23,22,20,0.08)]"
                                        : "bg-white border-[#E4E1D4] text-[#2B2A27] hover:bg-[#FDFBF2] hover:border-[#171614]/15"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="text-xs font-semibold text-[#2B2A27]/40 italic">Unavailable</span>
              )}
            </div>
          ))}

          <div className="pt-6 border-t border-[#E4E1D4] flex justify-end">
            <Button onClick={handleSave} variant="primary" size="sm" rounded="xl" shadow="sm" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
