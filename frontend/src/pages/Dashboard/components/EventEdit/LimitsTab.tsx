import React, { useState, useEffect } from "react";
import { Save, Info } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";

interface LimitsTabProps {
  beforeBuffer: number;
  setBeforeBuffer: (val: number) => void;
  afterBuffer: number;
  setAfterBuffer: (val: number) => void;
  minimumNotice: number;
  setMinimumNotice: (val: number) => void;
  slotInterval: number | null;
  setSlotInterval: (val: number | null) => void;
  limitBookingFrequency: any;
  setLimitBookingFrequency: (val: any) => void;
  limitTotalBookingDuration: any;
  setLimitTotalBookingDuration: (val: any) => void;
  limitFutureBookings: any;
  setLimitFutureBookings: (val: any) => void;
  limitUpcomingBookings: any;
  setLimitUpcomingBookings: (val: any) => void;
  showOnlyFirstAvailableSlot: boolean;
  setShowOnlyFirstAvailableSlot: (val: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function LimitsTab({
  beforeBuffer,
  setBeforeBuffer,
  afterBuffer,
  setAfterBuffer,
  minimumNotice,
  setMinimumNotice,
  slotInterval,
  setSlotInterval,
  limitBookingFrequency,
  setLimitBookingFrequency,
  limitTotalBookingDuration,
  setLimitTotalBookingDuration,
  limitFutureBookings,
  setLimitFutureBookings,
  limitUpcomingBookings,
  setLimitUpcomingBookings,
  showOnlyFirstAvailableSlot,
  setShowOnlyFirstAvailableSlot,
  isSaving,
  onSave,
}: LimitsTabProps) {
  // Notice conversion helper state
  const [noticeValue, setNoticeValue] = useState(2);
  const [noticeUnit, setNoticeUnit] = useState<"minutes" | "hours" | "days">("hours");

  // Sync state from prop initially
  useEffect(() => {
    if (minimumNotice % 1440 === 0 && minimumNotice > 0) {
      setNoticeValue(minimumNotice / 1440);
      setNoticeUnit("days");
    } else if (minimumNotice % 60 === 0 && minimumNotice > 0) {
      setNoticeValue(minimumNotice / 60);
      setNoticeUnit("hours");
    } else {
      setNoticeValue(minimumNotice || 0);
      setNoticeUnit("minutes");
    }
  }, [minimumNotice]);

  // Handle notice updates
  const handleNoticeChange = (val: number, unit: "minutes" | "hours" | "days") => {
    setNoticeValue(val);
    setNoticeUnit(unit);
    let totalMinutes = val;
    if (unit === "hours") {
      totalMinutes = val * 60;
    } else if (unit === "days") {
      totalMinutes = val * 1440;
    }
    setMinimumNotice(totalMinutes);
  };

  // Safe parsed sub-objects for frequency & limits
  const freqConfig = limitBookingFrequency || { enabled: false, maxBookings: 3, period: "day" };
  const durationConfig = limitTotalBookingDuration || { enabled: false, maxMinutes: 120, period: "day" };
  const futureConfig = limitFutureBookings || { enabled: false, days: 60 };
  const upcomingConfig = limitUpcomingBookings || { enabled: false, maxBookings: 2 };

  return (
    <div className="bg-white border border-[#E4E1D4] rounded-2xl p-8 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-6">
      <div>
        <h3 className="font-cal-sans text-xl font-bold uppercase tracking-wider text-[#171614]">
          Limits & Buffers
        </h3>
        <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">
          Set buffer times, minimum notices, scheduling frequencies, and future windows.
        </p>
      </div>

      <div className="space-y-5">
        {/* Buffers block */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-[#171614] uppercase tracking-wider">
              Before event <Info className="w-3.5 h-3.5 opacity-60" />
            </label>
            <Select
              value={beforeBuffer}
              onChange={(val) => setBeforeBuffer(Number(val))}
              options={[
                { value: 0, label: "No buffer time" },
                { value: 5, label: "5 mins" },
                { value: 10, label: "10 mins" },
                { value: 15, label: "15 mins" },
                { value: 30, label: "30 mins" },
                { value: 45, label: "45 mins" },
                { value: 60, label: "60 mins" },
              ]}
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-[#171614] uppercase tracking-wider">
              After event <Info className="w-3.5 h-3.5 opacity-60" />
            </label>
            <Select
              value={afterBuffer}
              onChange={(val) => setAfterBuffer(Number(val))}
              options={[
                { value: 0, label: "No buffer time" },
                { value: 5, label: "5 mins" },
                { value: 10, label: "10 mins" },
                { value: 15, label: "15 mins" },
                { value: 30, label: "30 mins" },
                { value: 45, label: "45 mins" },
                { value: 60, label: "60 mins" },
              ]}
            />
          </div>
        </div>

        {/* Notice & intervals block */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-[#171614] uppercase tracking-wider">
              Minimum notice <Info className="w-3.5 h-3.5 opacity-60" />
            </label>
            <div className="grid grid-cols-5 gap-2">
              <input
                type="number"
                min="0"
                value={noticeValue}
                onChange={(e) => handleNoticeChange(Number(e.target.value) || 0, noticeUnit)}
                className="col-span-3 px-4 py-2.5 text-sm bg-white border border-[#E4E1D4] rounded-xl focus:outline-none focus:border-[#B7ACF7] transition-all font-semibold text-[#171614]"
              />
              <Select
                value={noticeUnit}
                onChange={(val) => handleNoticeChange(noticeValue, val as any)}
                options={[
                  { value: "minutes", label: "Minutes" },
                  { value: "hours", label: "Hours" },
                  { value: "days", label: "Days" },
                ]}
                className="col-span-2"
                buttonClassName="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl bg-white font-semibold text-[#171614] text-sm text-left flex justify-between items-center hover:bg-[#FDFBF2] transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1 text-xs font-bold text-[#171614] uppercase tracking-wider">
              Time-slot intervals <Info className="w-3.5 h-3.5 opacity-60" />
            </label>
            <Select
              value={slotInterval === null ? "" : slotInterval}
              onChange={(val) => setSlotInterval(val === "" ? null : Number(val))}
              options={[
                { value: "", label: "Use event length (default)" },
                { value: 10, label: "10 mins" },
                { value: 15, label: "15 mins" },
                { value: 20, label: "20 mins" },
                { value: 30, label: "30 mins" },
                { value: 45, label: "45 mins" },
                { value: 60, label: "60 mins" },
              ]}
            />
          </div>
        </div>

        {/* Toggles section */}
        <div className="space-y-4 pt-4 border-t border-[#E4E1D4]/60">
          {/* Limit Booking Frequency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                  Limit booking frequency
                </label>
                <span className="block text-xs text-[#2B2A27]/60 font-semibold">
                  Limit how many times this event can be booked.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={freqConfig.enabled}
                  onChange={(e) =>
                    setLimitBookingFrequency({ ...freqConfig, enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
              </label>
            </div>
            {freqConfig.enabled && (
              <div className="flex items-center gap-3 py-4.5 px-5 bg-gray-50 border border-[#E4E1D4] rounded-2xl animate-in fade-in duration-100">
                <span className="text-xs font-bold text-[#171614]">Max bookings</span>
                <input
                  type="number"
                  min="1"
                  value={freqConfig.maxBookings}
                  onChange={(e) =>
                    setLimitBookingFrequency({
                      ...freqConfig,
                      maxBookings: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-20 px-3 py-2.5 border border-[#E4E1D4] rounded-xl text-sm text-center font-semibold text-[#171614] bg-white focus:outline-none focus:border-[#B7ACF7] transition-all"
                />
                <span className="text-xs font-bold text-[#171614]">per</span>
                <Select
                  value={freqConfig.period}
                  onChange={(val) => setLimitBookingFrequency({ ...freqConfig, period: val })}
                  options={[
                    { value: "day", label: "Day" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                  ]}
                  className="w-32"
                  buttonClassName="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl bg-white font-semibold text-[#171614] text-sm text-left flex justify-between items-center hover:bg-[#FDFBF2] transition-all cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Limit Total Booking Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                  Limit total booking duration
                </label>
                <span className="block text-xs text-[#2B2A27]/60 font-semibold">
                  Limit total amount of time that this event can be booked.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={durationConfig.enabled}
                  onChange={(e) =>
                    setLimitTotalBookingDuration({ ...durationConfig, enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
              </label>
            </div>
            {durationConfig.enabled && (
              <div className="flex items-center gap-3 py-4.5 px-5 bg-gray-50 border border-[#E4E1D4] rounded-2xl animate-in fade-in duration-100">
                <span className="text-xs font-bold text-[#171614]">Max duration</span>
                <input
                  type="number"
                  min="1"
                  value={durationConfig.maxMinutes}
                  onChange={(e) =>
                    setLimitTotalBookingDuration({
                      ...durationConfig,
                      maxMinutes: parseInt(e.target.value, 10) || 30,
                    })
                  }
                  className="w-24 px-3 py-2.5 border border-[#E4E1D4] rounded-xl text-sm text-center font-semibold text-[#171614] bg-white focus:outline-none focus:border-[#B7ACF7] transition-all"
                />
                <span className="text-xs font-bold text-[#171614]">minutes per</span>
                <Select
                  value={durationConfig.period}
                  onChange={(val) =>
                    setLimitTotalBookingDuration({ ...durationConfig, period: val })
                  }
                  options={[
                    { value: "day", label: "Day" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                  ]}
                  className="w-32"
                  buttonClassName="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl bg-white font-semibold text-[#171614] text-sm text-left flex justify-between items-center hover:bg-[#FDFBF2] transition-all cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Limit Future Bookings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                  Limit future bookings
                </label>
                <span className="block text-xs text-[#2B2A27]/60 font-semibold">
                  Limit how far in the future this event can be booked.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={futureConfig.enabled}
                  onChange={(e) =>
                    setLimitFutureBookings({ ...futureConfig, enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
              </label>
            </div>
            {futureConfig.enabled && (
              <div className="flex items-center gap-3 py-4.5 px-5 bg-gray-50 border border-[#E4E1D4] rounded-2xl animate-in fade-in duration-100">
                <span className="text-xs font-bold text-[#171614]">Allow bookings up to</span>
                <input
                  type="number"
                  min="1"
                  value={futureConfig.days}
                  onChange={(e) =>
                    setLimitFutureBookings({
                      ...futureConfig,
                      days: parseInt(e.target.value, 10) || 30,
                    })
                  }
                  className="w-20 px-3 py-2.5 border border-[#E4E1D4] rounded-xl text-sm text-center font-semibold text-[#171614] bg-white focus:outline-none focus:border-[#B7ACF7] transition-all"
                />
                <span className="text-xs font-bold text-[#171614]">days in the future</span>
              </div>
            )}
          </div>

          {/* Limit Number of Upcoming Bookings per Booker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                  Limit number of upcoming bookings per booker
                </label>
                <span className="block text-xs text-[#2B2A27]/60 font-semibold">
                  Limit the number of active bookings a booker can make for this event type.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={upcomingConfig.enabled}
                  onChange={(e) =>
                    setLimitUpcomingBookings({ ...upcomingConfig, enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
              </label>
            </div>
            {upcomingConfig.enabled && (
              <div className="flex items-center gap-3 py-4.5 px-5 bg-gray-50 border border-[#E4E1D4] rounded-2xl animate-in fade-in duration-100">
                <span className="text-xs font-bold text-[#171614]">Max active bookings</span>
                <input
                  type="number"
                  min="1"
                  value={upcomingConfig.maxBookings}
                  onChange={(e) =>
                    setLimitUpcomingBookings({
                      ...upcomingConfig,
                      maxBookings: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-20 px-3 py-2.5 border border-[#E4E1D4] rounded-xl text-sm text-center font-semibold text-[#171614] bg-white focus:outline-none focus:border-[#B7ACF7] transition-all"
                />
                <span className="text-xs font-bold text-[#171614]">per guest email</span>
              </div>
            )}
          </div>

          {/* Show Only First Slot Each Day */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                Show only the first available slot each day
              </label>
              <span className="block text-xs text-[#2B2A27]/60 font-semibold">
                Limit to one slot per day at the earliest available time.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyFirstAvailableSlot}
                onChange={(e) => setShowOnlyFirstAvailableSlot(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[#E4E1D4] flex justify-end">
        <Button
          type="button"
          onClick={onSave}
          variant="primary"
          size="sm"
          rounded="xl"
          shadow="sm"
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Limits & Buffers
        </Button>
      </div>
    </div>
  );
}

export default LimitsTab;
