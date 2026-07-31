import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { EventTypeCard } from "./components/EventTypeCard";
import type { EventType } from "./components/EventTypeCard";
import { EmptyState } from "./components/EmptyState";
import { useApi } from "../../lib/api";
import { LayoutGrid, List, Grid, Clock, Video, MapPin, Edit3, Eye, Copy, Check } from "lucide-react";
import { Switch } from "../../components/ui/Switch";

export default function DashboardPage() {
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [username, setUsername] = useState("user");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"cards" | "table" | "icons">("cards");
  const api = useApi();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        // Load user info
        const meRes = await api.get("/auth/me");
        setUsername(meRes.data.user?.username || "user");

        // Load events
        const eventsRes = await api.get("/events");
        setEventTypes(eventsRes.data.events || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleToggleActive = async (id: string) => {
    const target = eventTypes.find((et) => et.id === id);
    if (!target) return;

    try {
      const nextActive = !target.isActive;
      // Optimistic update
      setEventTypes(eventTypes.map((et) => et.id === id ? { ...et, isActive: nextActive } : et));
      
      const res = await api.put(`/events/${id}`, { isActive: nextActive });
      // Update with server state
      setEventTypes(eventTypes.map((et) => et.id === id ? res.data.event : et));
    } catch (err) {
      console.error("Failed to toggle active status:", err);
      // Revert status on failure
      setEventTypes(eventTypes.map((et) => et.id === id ? { ...et, isActive: target.isActive } : et));
    }
  };

  const handleCopyLink = (id: string, slug: string) => {
    const link = `${window.location.origin}/book/${username}/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEventTypes = eventTypes.filter((et) =>
    et.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, viewMode]);

  const totalPages = Math.max(Math.ceil(filteredEventTypes.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEventTypes = filteredEventTypes.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-10 h-10 rounded-full border-4 border-[#171614] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control bar with layout switcher */}
      {eventTypes.length > 0 && (
        <div className="flex justify-between items-center bg-white border border-[#E4E1D4] rounded-2xl px-5 py-3 shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
          <span className="text-[10px] font-extrabold uppercase text-[#2B2A27]/55 tracking-wider">
            Showing {filteredEventTypes.length} event type{filteredEventTypes.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1 bg-[#FDFBF2]/40 border border-[#E4E1D4] rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                viewMode === "cards"
                  ? "bg-[#171614] text-white shadow-sm"
                  : "text-[#2B2A27]/60 hover:text-[#171614] hover:bg-[#FDFBF2]"
              }`}
              title="Default Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                viewMode === "table"
                  ? "bg-[#171614] text-white shadow-sm"
                  : "text-[#2B2A27]/60 hover:text-[#171614] hover:bg-[#FDFBF2]"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("icons")}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                viewMode === "icons"
                  ? "bg-[#171614] text-white shadow-sm"
                  : "text-[#2B2A27]/60 hover:text-[#171614] hover:bg-[#FDFBF2]"
              }`}
              title="Small Cards View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Small Cards</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Event Types */}
      {filteredEventTypes.length > 0 ? (
        <>
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEventTypes.map((et) => (
                <EventTypeCard
                  key={et.id}
                  et={et}
                  username={username}
                  onToggleActive={handleToggleActive}
                  onCopyLink={handleCopyLink}
                  copiedId={copiedId}
                />
              ))}
            </div>
          )}

          {viewMode === "table" && (
            <div className="bg-white border border-[#E4E1D4] rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FDFBF2]/20 border-b border-[#E4E1D4] text-[10px] font-extrabold uppercase text-[#2B2A27]/60 tracking-wider">
                      <th className="py-4 px-6">Event Type</th>
                      <th className="py-4 px-6">Duration & Price</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E1D4]/60">
                    {paginatedEventTypes.map((et) => (
                      <tr key={et.id} className="hover:bg-[#FDFBF2]/10 transition-all">
                        {/* Event Type Column */}
                        <td className="py-4 px-6">
                          <Link to={`/dashboard/events/${et.id}/edit`} className="font-cal-sans text-sm font-bold text-[#171614] uppercase tracking-wide hover:underline block">
                            {et.title}
                          </Link>
                          <span className="text-[10px] text-[#2B2A27]/55 font-semibold block mt-0.5">/{et.slug}</span>
                        </td>
                        {/* Duration & Price Badges */}
                        <td className="py-4 px-6 text-xs text-[#171614]">
                          <div>
                            <span className="inline-block text-[10px] font-bold text-[#171614] bg-[#F3E75B] px-2.5 py-0.5 rounded-lg border border-[#171614]/15">
                              {et.duration} mins
                            </span>
                          </div>
                          <div className="mt-1.5">
                            <span className="inline-block text-[10px] font-extrabold text-[#171614] bg-[#B7ACF7] border border-[#171614]/15 px-2 py-0.5 rounded-md">
                              {et.price > 0 ? `$${et.price}.00` : "Free"}
                            </span>
                          </div>
                        </td>
                        {/* Location Details */}
                        <td className="py-4 px-6 text-xs text-[#2B2A27] font-semibold">
                          <div className="flex items-center gap-2">
                            {et.locationType === "Video" ? (
                              <Video className="w-4 h-4 text-[#171614]" />
                            ) : (
                              <MapPin className="w-4 h-4 text-[#171614]" />
                            )}
                            <span className="font-semibold">
                              {et.locationType} ({et.locationDetails})
                            </span>
                          </div>
                        </td>
                        {/* Active Switch Toggle */}
                        <td className="py-4 px-6">
                          <Switch
                            checked={et.isActive}
                            onChange={() => handleToggleActive(et.id)}
                            ariaLabel="Toggle Active Status"
                          />
                        </td>
                        {/* Actions Icons */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {/* Edit Action Icon */}
                            <Link
                              to={`/dashboard/events/${et.id}/edit`}
                              className="p-1.5 border border-[#E4E1D4] hover:border-[#171614] hover:bg-[#FDFBF2] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center text-[#171614]"
                              title="Edit Event Type"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>
                            {/* Preview Action Icon */}
                            <a
                              href={`/book/${username}/${et.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 border border-[#E4E1D4] hover:border-[#171614] hover:bg-[#FDFBF2] rounded-lg transition-all cursor-pointer inline-flex items-center justify-center text-[#171614]"
                              title="Preview Booking Page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                            {/* Copy Link Action Icon */}
                            <button
                              onClick={() => handleCopyLink(et.id, et.slug)}
                              className={`p-1.5 border rounded-lg transition-all cursor-pointer inline-flex items-center justify-center ${
                                copiedId === et.id
                                  ? "bg-[#7CEFC0] text-[#171614] border-[#171614]/15"
                                  : "border-[#E4E1D4] hover:border-[#171614] hover:bg-[#FDFBF2] text-[#171614]"
                              }`}
                              title={copiedId === et.id ? "Link Copied!" : "Copy Booking Link"}
                            >
                              {copiedId === et.id ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === "icons" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginatedEventTypes.map((et) => (
                <div
                  key={et.id}
                  className="bg-white border border-[#E4E1D4] hover:border-[#171614]/80 rounded-2xl p-4 shadow-[2px_2px_0_rgba(23,22,20,0.05)] hover:shadow-[3px_3px_0_rgba(23,22,20,0.08)] transition-all flex flex-col justify-between h-36 group relative"
                >
                  <div className="space-y-1 truncate">
                    <Link
                      to={`/dashboard/events/${et.id}/edit`}
                      className="font-cal-sans text-xs font-extrabold uppercase text-[#171614] hover:underline block truncate"
                    >
                      {et.title}
                    </Link>
                    <span className="text-[9px] font-bold text-[#2B2A27]/50 block">/{et.slug}</span>
                    <span className="text-[9px] font-bold text-[#2B2A27]/40 block">{et.duration} mins</span>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#E4E1D4]/60">
                    <button
                      onClick={() => handleCopyLink(et.id, et.slug)}
                      className={`px-2 py-1 border rounded-lg transition-all cursor-pointer text-[9px] font-extrabold ${
                        copiedId === et.id
                          ? "bg-[#7CEFC0] text-[#171614] border-[#171614]/15"
                          : "border-[#E4E1D4] hover:border-[#171614] hover:bg-[#FDFBF2]"
                      }`}
                    >
                      {copiedId === et.id ? "Copied" : "Link"}
                    </button>
                    <Link
                      to={`/dashboard/events/${et.id}/edit`}
                      className="px-2.5 py-1 text-[9px] font-extrabold border border-[#E4E1D4] hover:border-[#171614] hover:bg-[#FDFBF2] rounded-lg transition-all text-center"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3.5 bg-white border border-[#E4E1D4] rounded-2xl shadow-[3px_3px_0_rgba(23,22,20,0.06)] text-xs font-bold text-[#2B2A27] select-none mt-6">
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
        <EmptyState />
      )}
    </div>
  );
}
