import React, { useState, useEffect } from "react";
import { Save, Check, RefreshCw } from "lucide-react";
import { useApi } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import { Switch } from "../../components/ui/Switch";
import clsx from "clsx";

export default function CalendarPage() {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnectingCalendar, setIsConnectingCalendar] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // States
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [addMeetLink, setAddMeetLink] = useState(true);
  const [deleteOnCancel, setDeleteOnCancel] = useState(true);

  const loadCalendarData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      // Fetch connection status
      const statusRes = await api.get("/auth/google/status");
      const connected = statusRes.data.connected;
      setIsCalendarConnected(connected);

      if (connected) {
        // Fetch configurations
        const settingsRes = await api.get("/auth/google/settings");
        const settings = settingsRes.data.settings || {};
        setSyncEnabled(settings.syncEnabled !== false);
        setAddMeetLink(settings.addMeetLink !== false);
        setDeleteOnCancel(settings.deleteOnCancel !== false);
      }
    } catch (err) {
      console.error("Error loading calendar integration settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check URL parameters for connection feedback
    const params = new URLSearchParams(window.location.search);
    const googleConnected = params.get("google_connected");
    if (googleConnected === "success") {
      setMessage({ type: "success", text: "Successfully connected to Google Calendar! ✓" });
      setTimeout(() => setMessage(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (googleConnected === "error") {
      setMessage({ type: "error", text: "Failed to connect to Google Calendar." });
      setTimeout(() => setMessage(null), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    loadCalendarData();
  }, []);

  const handleConnectCalendar = async () => {
    if (isConnectingCalendar) return;
    setIsConnectingCalendar(true);
    setMessage(null);
    try {
      const res = await api.get("/auth/google/connect");
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        setMessage({ type: "error", text: "Could not generate authorization redirect link." });
      }
    } catch (err: any) {
      console.error("Failed to connect Google Calendar:", err);
      const serverMsg = err?.response?.data?.error || err?.message || "Failed to initiate Google Calendar connection.";
      setMessage({ type: "error", text: serverMsg });
    } finally {
      setIsConnectingCalendar(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    if (isConnectingCalendar) return;
    setIsConnectingCalendar(true);
    setMessage(null);
    try {
      await api.delete("/auth/google/disconnect");
      setIsCalendarConnected(false);
      setMessage({ type: "success", text: "Google Calendar connection revoked successfully." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Failed to disconnect Google Calendar:", err);
      setMessage({ type: "error", text: "Failed to revoke calendar connection." });
    } finally {
      setIsConnectingCalendar(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setMessage(null);

    try {
      await api.put("/auth/google/settings", {
        syncEnabled,
        addMeetLink,
        deleteOnCancel,
      });
      setMessage({ type: "success", text: "Calendar settings saved successfully! ✓" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error saving calendar settings:", err);
      setMessage({ type: "error", text: "Failed to save calendar configurations." });
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
    <div className="space-y-6 max-w-4xl">
      {/* Title Header */}
      <div className="flex justify-between items-center bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
        <div>
          <h3 className="font-cal-sans text-xl font-bold text-[#171614] uppercase tracking-wider">
            Calendar Integration
          </h3>
          <p className="text-xs font-semibold text-[#2B2A27]/60 mt-1">
            Connect and configure how bookings sync to your Google Calendar.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Sync status & connection toggles */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-[#E4E1D4] rounded-2xl p-6 shadow-[3px_3px_0_rgba(23,22,20,0.08)] flex flex-col justify-between space-y-6">
            <div>
              <h4 className="font-cal-sans text-xs font-bold text-[#171614] uppercase tracking-wider">
                Connection Status
              </h4>
              <p className="text-[10px] font-semibold text-[#2B2A27]/60 mt-0.5">
                Link scheduling bookings with calendars.
              </p>
            </div>

            <div className="flex items-center gap-3.5 p-4 bg-[#FDFBF2]/40 border border-[#E4E1D4]/60 rounded-xl">
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border",
                isCalendarConnected 
                  ? "bg-[#7CEFC0]/20 text-[#171614] border-[#171614]/15" 
                  : "bg-red-50 text-red-600 border-red-100"
              )}>
                G
              </div>
              <div className="flex-1 truncate">
                <span className="text-xs font-bold text-[#171614] block">Google Calendar</span>
                <span className="text-[10px] font-semibold text-[#2B2A27]/55 block truncate">
                  {isCalendarConnected ? "Active & Syncing" : "Not connected"}
                </span>
              </div>
            </div>

            {isCalendarConnected ? (
              <Button
                onClick={handleDisconnectCalendar}
                variant="secondary"
                size="sm"
                rounded="xl"
                className="w-full text-[#E5484D] hover:bg-[#E5484D]/5 border-[#E5484D]/30"
                disabled={isConnectingCalendar}
              >
                Disconnect Calendar
              </Button>
            ) : (
              <Button
                onClick={handleConnectCalendar}
                variant="primary"
                size="sm"
                rounded="xl"
                className="w-full bg-[#171614] text-white"
                disabled={isConnectingCalendar}
              >
                Connect Calendar
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Custom settings switches */}
        <div className="md:col-span-2">
          {isCalendarConnected ? (
            <form onSubmit={handleSaveSettings} className="bg-white border border-[#E4E1D4] rounded-2xl p-8 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-6">
              <div>
                <h4 className="font-cal-sans text-xs font-bold text-[#171614] uppercase tracking-wider">
                  Sync Customizations
                </h4>
                <p className="text-[10px] font-semibold text-[#2B2A27]/60 mt-0.5">
                  Configure behavior for calendar creations and updates.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Enable / Disable Sync */}
                <div className="flex items-center justify-between p-4 border border-[#E4E1D4]/60 rounded-xl hover:bg-[#FDFBF2]/10 transition-all">
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="text-xs font-bold text-[#171614] block">Enable Calendar Sync</span>
                    <span className="text-[10px] font-semibold text-[#2B2A27]/50 block leading-tight">
                      When checked, confirmed bookings will automatically populate on your Google Calendar.
                    </span>
                  </div>
                  <Switch
                    checked={syncEnabled}
                    onChange={(val) => setSyncEnabled(val)}
                    ariaLabel="Toggle sync status"
                  />
                </div>

                {/* Attach Google Meet Link */}
                <div className="flex items-center justify-between p-4 border border-[#E4E1D4]/60 rounded-xl hover:bg-[#FDFBF2]/10 transition-all">
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="text-xs font-bold text-[#171614] block">Create Google Meet Links</span>
                    <span className="text-[10px] font-semibold text-[#2B2A27]/50 block leading-tight">
                      Automatically generate and attach a Google Meet video conference link for every booking.
                    </span>
                  </div>
                  <Switch
                    checked={addMeetLink}
                    onChange={(val) => setAddMeetLink(val)}
                    ariaLabel="Toggle Google Meet creation"
                  />
                </div>

                {/* Delete on cancel */}
                <div className="flex items-center justify-between p-4 border border-[#E4E1D4]/60 rounded-xl hover:bg-[#FDFBF2]/10 transition-all">
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="text-xs font-bold text-[#171614] block">Delete Cancelled Bookings</span>
                    <span className="text-[10px] font-semibold text-[#2B2A27]/50 block leading-tight">
                      Remove the calendar event automatically if the meeting booking gets cancelled.
                    </span>
                  </div>
                  <Switch
                    checked={deleteOnCancel}
                    onChange={(val) => setDeleteOnCancel(val)}
                    ariaLabel="Toggle deletion on cancel"
                  />
                </div>

              </div>

              <div className="pt-6 border-t border-[#E4E1D4] flex justify-end">
                <Button type="submit" variant="primary" size="sm" rounded="xl" shadow="sm" disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-white border border-[#E4E1D4] rounded-2xl p-8 shadow-[3px_3px_0_rgba(23,22,20,0.08)] flex flex-col items-center justify-center text-center h-full min-h-[280px]">
              <div className="w-12 h-12 rounded-full bg-[#B7ACF7]/25 flex items-center justify-center text-lg font-bold text-[#171614] mb-4">
                G
              </div>
              <h4 className="font-cal-sans text-sm font-bold text-[#171614] uppercase tracking-wider">
                Google Calendar Offline
              </h4>
              <p className="text-xs font-semibold text-[#2B2A27]/60 max-w-sm mt-1.5 leading-relaxed">
                Connect your Google account on the left to unlock calendar sync configurations, auto-generated meet links, and cancellation settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
