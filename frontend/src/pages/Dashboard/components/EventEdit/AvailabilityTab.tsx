import React from "react";
import { Save, ChevronDown, Globe } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";
import type { EventType } from "../../EventEdit";

interface AvailabilityTabProps {
  availability: EventType["availability"];
  onToggleDay: (dayIndex: number) => void;
  onSlotTimeChange: (dayIndex: number, slotIndex: number, key: "startTime" | "endTime", value: string) => void;
  activeDropdown: { dayIdx: number; slotIdx: number; type: "start" | "end" } | null;
  setActiveDropdown: (val: { dayIdx: number; slotIdx: number; type: "start" | "end" } | null) => void;
  onSave: () => void;
  isSaving: boolean;
  formatTime24to12: (time24: string) => string;
  timeOptions: Array<{ val: string; label: string }>;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
  timezoneOptions: Array<{ value: string; label: string }>;
}

export function AvailabilityTab({
  availability,
  onToggleDay,
  onSlotTimeChange,
  activeDropdown,
  setActiveDropdown,
  onSave,
  isSaving,
  formatTime24to12,
  timeOptions,
  timezone,
  onTimezoneChange,
  timezoneOptions,
}: AvailabilityTabProps) {
  return (
    <div className="bg-white border border-[#E4E1D4] rounded-2xl p-8 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#E4E1D4]/60">
        <div>
          <h3 className="font-cal-sans text-xl font-bold uppercase tracking-wider text-[#171614]">Availability</h3>
          <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">Select days and time slots when you're open for bookings.</p>
        </div>

        {/* Compact Timezone Selector */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#2B2A27]/70 shrink-0">
          <Globe className="w-4 h-4 text-[#171614]" />
          <span>Timezone:</span>
          <Select
            value={timezone}
            onChange={onTimezoneChange}
            options={timezoneOptions}
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
                onChange={() => onToggleDay(dayIdx)}
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
                              {timeOptions.map((opt) => (
                                <button
                                  type="button"
                                  key={opt.val}
                                  onClick={() => {
                                    onSlotTimeChange(dayIdx, slotIdx, "startTime", opt.val);
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
                              {timeOptions.map((opt) => (
                                <button
                                  type="button"
                                  key={opt.val}
                                  onClick={() => {
                                    onSlotTimeChange(dayIdx, slotIdx, "endTime", opt.val);
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
          <Button onClick={onSave} variant="primary" size="sm" rounded="xl" shadow="sm" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Availability
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityTab;
