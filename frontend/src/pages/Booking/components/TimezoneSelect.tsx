import React from "react";
import { Globe, ChevronDown } from "lucide-react";

interface TimezoneSelectProps {
  timezone: string;
  onChangeTimezone: (tz: string) => void;
  timezoneOptions: Array<{ value: string; label: string }>;
}

export const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  timezone,
  onChangeTimezone,
  timezoneOptions,
}) => {
  return (
    <div className="relative">
      <label className="text-[10px] font-bold text-[#171614]/50 uppercase tracking-wider block mb-1 flex items-center gap-1">
        <Globe className="w-3 h-3 text-[#171614]/70" />
        Booker Timezone
      </label>
      <div className="relative">
        <select
          value={timezone}
          onChange={(e) => onChangeTimezone(e.target.value)}
          className="w-full bg-[#FAF9F5] border border-[#E4E1D4] rounded-xl px-3 py-2 text-xs font-bold text-[#171614] appearance-none cursor-pointer focus:outline-none focus:border-[#171614] focus:ring-1 focus:ring-[#171614] pr-8 shadow-[2px_2px_0_rgba(23,22,20,0.06)]"
        >
          {timezoneOptions.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#171614]/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
