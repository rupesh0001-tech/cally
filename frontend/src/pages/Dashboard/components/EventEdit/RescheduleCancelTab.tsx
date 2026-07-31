import React, { useState, useEffect } from "react";
import { Save, Info } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";

interface RescheduleCancelTabProps {
  rescheduleEnabled: boolean;
  setRescheduleEnabled: (val: boolean) => void;
  cancelEnabled: boolean;
  setCancelEnabled: (val: boolean) => void;
  rescheduleNotice: number; // in minutes
  setRescheduleNotice: (val: number) => void;
  cancelNotice: number; // in minutes
  setCancelNotice: (val: number) => void;
  cancellationPolicy: string;
  setCancellationPolicy: (val: string) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function RescheduleCancelTab({
  rescheduleEnabled,
  setRescheduleEnabled,
  cancelEnabled,
  setCancelEnabled,
  rescheduleNotice,
  setRescheduleNotice,
  cancelNotice,
  setCancelNotice,
  cancellationPolicy,
  setCancellationPolicy,
  isSaving,
  onSave,
}: RescheduleCancelTabProps) {
  
  // Helper to parse minutes into UI value and unit
  const parseNotice = (totalMinutes: number) => {
    if (totalMinutes === 0) return { val: 0, unit: "minutes" };
    if (totalMinutes % 1440 === 0) return { val: totalMinutes / 1440, unit: "days" };
    if (totalMinutes % 60 === 0) return { val: totalMinutes / 60, unit: "hours" };
    return { val: totalMinutes, unit: "minutes" };
  };

  const initialReschedule = parseNotice(rescheduleNotice);
  const initialCancel = parseNotice(cancelNotice);

  const [resValue, setResValue] = useState(initialReschedule.val);
  const [resUnit, setResUnit] = useState(initialReschedule.unit);

  const [canValue, setCanValue] = useState(initialCancel.val);
  const [canUnit, setCanUnit] = useState(initialCancel.unit);

  // Sync back to parent when UI values change
  const updateRescheduleNotice = (val: number, unit: string) => {
    let multiplier = 1;
    if (unit === "hours") multiplier = 60;
    if (unit === "days") multiplier = 1440;
    setRescheduleNotice(val * multiplier);
  };

  const updateCancelNotice = (val: number, unit: string) => {
    let multiplier = 1;
    if (unit === "hours") multiplier = 60;
    if (unit === "days") multiplier = 1440;
    setCancelNotice(val * multiplier);
  };

  return (
    <div className="space-y-6">
      {/* Title Header Card */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
        <div>
          <h3 className="font-cal-sans text-xl font-bold uppercase tracking-wider text-[#171614]">
            Reschedule & Cancel
          </h3>
          <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">
            Configure guidelines and policies for rescheduling and cancellation of meetings.
          </p>
        </div>
      </div>

      {/* Rescheduling Rules Card */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="block text-sm font-bold text-[#171614]">Allow rescheduling</label>
            <span className="block text-xs text-[#2B2A27]/60 font-semibold">
              Permit guests to change the date and time of their bookings.
            </span>
          </div>
          {/* Custom Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rescheduleEnabled}
              onChange={(e) => setRescheduleEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
          </label>
        </div>

        {rescheduleEnabled && (
          <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-1.5 duration-150">
            <label className="flex items-center gap-1 text-xs font-bold text-[#171614] uppercase tracking-wider">
              Minimum notice for rescheduling <Info className="w-3.5 h-3.5 opacity-60" />
            </label>
            <div className="grid grid-cols-5 gap-2 max-w-md">
              <input
                type="number"
                min="0"
                value={resValue}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setResValue(val);
                  updateRescheduleNotice(val, resUnit);
                }}
                className="col-span-3 px-4 py-2.5 text-sm bg-white border border-[#E4E1D4] rounded-xl focus:outline-none focus:border-[#B7ACF7] transition-all font-semibold text-[#171614]"
              />
              <Select
                value={resUnit}
                onChange={(val) => {
                  setResUnit(val);
                  updateRescheduleNotice(resValue, val);
                }}
                options={[
                  { value: "minutes", label: "Minutes" },
                  { value: "hours", label: "Hours" },
                  { value: "days", label: "Days" },
                ]}
                className="col-span-2"
                buttonClassName="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl bg-white font-semibold text-[#171614] text-sm text-left flex justify-between items-center hover:bg-[#FDFBF2] transition-all cursor-pointer"
              />
            </div>
            <span className="block text-[10px] text-[#2B2A27]/55 font-bold">
              Bookings cannot be rescheduled less than {resValue} {resUnit} in advance.
            </span>
          </div>
        )}
      </div>

      {/* Cancellation Rules Card */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="block text-sm font-bold text-[#171614]">Allow cancellation</label>
            <span className="block text-xs text-[#2B2A27]/60 font-semibold">
              Permit guests to cancel their scheduled bookings.
            </span>
          </div>
          {/* Custom Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cancelEnabled}
              onChange={(e) => setCancelEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
          </label>
        </div>

        {cancelEnabled && (
          <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-1.5 duration-150">
            <label className="flex items-center gap-1 text-xs font-bold text-[#171614] uppercase tracking-wider">
              Minimum notice for cancellation <Info className="w-3.5 h-3.5 opacity-60" />
            </label>
            <div className="grid grid-cols-5 gap-2 max-w-md">
              <input
                type="number"
                min="0"
                value={canValue}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setCanValue(val);
                  updateCancelNotice(val, canUnit);
                }}
                className="col-span-3 px-4 py-2.5 text-sm bg-white border border-[#E4E1D4] rounded-xl focus:outline-none focus:border-[#B7ACF7] transition-all font-semibold text-[#171614]"
              />
              <Select
                value={canUnit}
                onChange={(val) => {
                  setCanUnit(val);
                  updateCancelNotice(canValue, val);
                }}
                options={[
                  { value: "minutes", label: "Minutes" },
                  { value: "hours", label: "Hours" },
                  { value: "days", label: "Days" },
                ]}
                className="col-span-2"
                buttonClassName="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl bg-white font-semibold text-[#171614] text-sm text-left flex justify-between items-center hover:bg-[#FDFBF2] transition-all cursor-pointer"
              />
            </div>
            <span className="block text-[10px] text-[#2B2A27]/55 font-bold">
              Bookings cannot be cancelled less than {canValue} {canUnit} in advance.
            </span>
          </div>
        )}
      </div>

      {/* Policies Message Card */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
            Cancellation & Rescheduling Policy Message
          </label>
          <span className="block text-xs text-[#2B2A27]/60 font-semibold mb-2">
            Show custom policy instructions when a guest wants to reschedule or cancel a booking.
          </span>
          <textarea
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            placeholder="e.g. If you need to reschedule, please let me know at least 2 hours in advance. Thank you!"
            rows={4}
            className="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl text-sm bg-white font-semibold text-[#171614] focus:outline-none focus:border-[#171614] transition-all"
          />
        </div>
      </div>

      {/* Save Button Row */}
      <div className="flex justify-end">
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
          Save Reschedule & Cancel Settings
        </Button>
      </div>
    </div>
  );
}
