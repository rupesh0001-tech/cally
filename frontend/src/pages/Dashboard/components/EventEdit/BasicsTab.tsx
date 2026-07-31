import React from "react";
import { Save } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";

interface BasicsTabProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  duration: number;
  setDuration: (val: number) => void;
  locationType: string;
  setLocationType: (val: string) => void;
  locationDetails: string;
  setLocationDetails: (val: string) => void;
  username: string;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function BasicsTab({
  title,
  setTitle,
  slug,
  setSlug,
  duration,
  setDuration,
  locationType,
  setLocationType,
  locationDetails,
  setLocationDetails,
  username,
  isSaving,
  onSave,
}: BasicsTabProps) {
  return (
    <div className="bg-white border border-[#E4E1D4] rounded-2xl p-8 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-6">
      <div>
        <h3 className="font-cal-sans text-xl font-bold uppercase tracking-wider text-[#171614]">Basics</h3>
        <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">Configure meeting link, titles, durations, and locations.</p>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl text-sm bg-white font-semibold text-[#171614] focus:outline-none focus:border-[#B7ACF7] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">URL Slug</label>
          <div className="flex items-center border border-[#E4E1D4] rounded-xl bg-white px-3 py-2.5 focus-within:border-[#B7ACF7] transition-all font-semibold">
            <span className="text-sm font-bold text-[#2B2A27]/50 select-none shrink-0 mr-1.5">
              {window.location.host}/{username}/
            </span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              className="w-full bg-transparent focus:outline-none text-sm text-[#171614] font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">Duration (Minutes)</label>
          <Select
            value={duration}
            onChange={(val) => setDuration(Number(val))}
            options={[
              { value: 15, label: "15 Minutes" },
              { value: 30, label: "30 Minutes" },
              { value: 45, label: "45 Minutes" },
              { value: 60, label: "60 Minutes" },
            ]}
          />
        </div>

        {/* Location Configuration */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">Location Type</label>
          <Select
            value={locationType === "Video" ? locationDetails : locationType}
            onChange={(val) => {
              if (val === "Google Meet" || val === "Zoom") {
                setLocationType("Video");
                setLocationDetails(val);
              } else {
                setLocationType(val);
                setLocationDetails("");
              }
            }}
            options={[
              { value: "Google Meet", label: "Google Meet (Video)" },
              { value: "Zoom", label: "Zoom (Video)" },
              { value: "Phone", label: "Phone Call" },
              { value: "In-Person", label: "In-Person Meeting" },
            ]}
          />
        </div>

        {locationType === "Phone" && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1.5 duration-150">
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">Phone Number</label>
            <input
              type="text"
              required
              placeholder="e.g. +1 234 567 890"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl text-sm bg-white font-semibold text-[#171614] focus:outline-none focus:border-[#B7ACF7] transition-all"
            />
          </div>
        )}

        {locationType === "In-Person" && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1.5 duration-150">
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">Address / Location Details</label>
            <input
              type="text"
              required
              placeholder="e.g. Starbucks, 5th Avenue"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl text-sm bg-white font-semibold text-[#171614] focus:outline-none focus:border-[#B7ACF7] transition-all"
            />
          </div>
        )}

        <div className="pt-4 border-t border-[#E4E1D4] flex justify-end">
          <Button type="submit" variant="primary" size="sm" rounded="xl" shadow="sm" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Basics
          </Button>
        </div>
      </form>
    </div>
  );
}

export default BasicsTab;
