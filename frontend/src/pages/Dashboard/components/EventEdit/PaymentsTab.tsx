import React from "react";
import { Save, Shield, ChevronDown } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";

interface PaymentsTabProps {
  paymentEnabled: boolean;
  setPaymentEnabled: (val: boolean) => void;
  price: number;
  setPrice: (val: number) => void;
  currency: string;
  setCurrency: (val: string) => void;
  seatsEnabled: boolean;
  setSeatsEnabled: (val: boolean) => void;
  seatsMax: number;
  setSeatsMax: (val: number) => void;
  seatsShareInfo: boolean;
  setSeatsShareInfo: (val: boolean) => void;
  seatsShowCount: boolean;
  setSeatsShowCount: (val: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function PaymentsTab({
  paymentEnabled,
  setPaymentEnabled,
  price,
  setPrice,
  currency,
  setCurrency,
  seatsEnabled,
  setSeatsEnabled,
  seatsMax,
  setSeatsMax,
  seatsShareInfo,
  setSeatsShareInfo,
  seatsShowCount,
  setSeatsShowCount,
  isSaving,
  onSave,
}: PaymentsTabProps) {
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const currentSymbol = currencySymbols[currency] || "₹";

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
        <div>
          <h3 className="font-cal-sans text-xl font-bold uppercase tracking-wider text-[#171614]">
            Payment & Seats
          </h3>
          <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">
            Configure paid bookings and seat limitations for this event type.
          </p>
        </div>
      </div>

      {/* Paid Booking Settings Card */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="block text-sm font-bold text-[#171614]">Paid booking</label>
            <span className="block text-xs text-[#2B2A27]/60 font-semibold">
              Request payments for your bookings and earn money.
            </span>
          </div>
          {/* Custom Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentEnabled}
              onChange={(e) => setPaymentEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
          </label>
        </div>

        {paymentEnabled && (
          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-1.5 duration-150">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                Payment Gateway
              </label>
              <div className="flex items-center justify-between h-11 border border-[#E4E1D4] rounded-xl bg-gray-50 px-4 text-sm font-semibold text-[#171614]/50 cursor-not-allowed select-none">
                <span>Cal Pay (Razorpay Global Connected)</span>
                <ChevronDown className="w-4 h-4 text-[#2B2A27]/40" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                  Price
                </label>
                <div className="flex items-center h-11 border border-[#E4E1D4] rounded-xl bg-white px-3 focus-within:border-[#B7ACF7] transition-all font-semibold">
                  <span className="text-sm font-bold text-[#2B2A27]/50 select-none mr-2">
                    {currentSymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={price || ""}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent focus:outline-none text-sm text-[#171614] font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                  Currency
                </label>
                <Select
                  className="h-11 w-full"
                  value={currency}
                  onChange={(val) => setCurrency(val)}
                  options={[
                    { value: "INR", label: "INR (₹)" },
                    { value: "USD", label: "USD ($)" },
                    { value: "EUR", label: "EUR (€)" },
                    { value: "GBP", label: "GBP (£)" },
                  ]}
                  buttonClassName="w-full h-full border border-[#E4E1D4] rounded-xl bg-white font-semibold text-[#171614] text-sm text-left flex justify-between items-center px-4 hover:bg-[#FDFBF2] transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Offer Seats Settings Card */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="block text-sm font-bold text-[#171614]">Offer seats</label>
            <span className="block text-xs text-[#2B2A27]/60 font-semibold">
              Allow multiple guests to book the same slot.
            </span>
          </div>
          {/* Custom Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={seatsEnabled}
              onChange={(e) => setSeatsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#E4E1D4] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#171614]/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7CEFC0] border border-transparent peer-focus:outline-none"></div>
          </label>
        </div>

        {seatsEnabled && (
          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-1.5 duration-150">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
                Number of Seats
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSeatsMax(Math.max(1, seatsMax - 1))}
                  className="w-11 h-11 border border-[#E4E1D4] rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={seatsMax || 1}
                  onChange={(e) => setSeatsMax(parseInt(e.target.value, 10) || 1)}
                  className="w-16 h-11 border border-[#E4E1D4] rounded-full text-center text-sm font-bold text-[#171614] focus:outline-none focus:border-[#B7ACF7]"
                />
                <button
                  type="button"
                  onClick={() => setSeatsMax(seatsMax + 1)}
                  className="w-11 h-11 border border-[#E4E1D4] rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  +
                </button>
                <span className="font-sans text-xs font-semibold text-[#2B2A27]/60 ml-2">seats max</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={seatsShareInfo}
                  onChange={(e) => setSeatsShareInfo(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border border-[#E4E1D4] accent-[#7CEFC0]"
                />
                <span className="text-xs font-semibold text-[#171614]">
                  Share attendee information between guests
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={seatsShowCount}
                  onChange={(e) => setSeatsShowCount(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border border-[#E4E1D4] accent-[#7CEFC0]"
                />
                <span className="text-xs font-semibold text-[#171614]">
                  Show the number of available seats on the booking page
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

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
          Save Payment & Seats
        </Button>
      </div>
    </div>
  );
}

export default PaymentsTab;
