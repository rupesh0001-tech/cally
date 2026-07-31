import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useApi } from "../../../lib/api";
import { Button } from "../../../components/ui/Button";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
}

export function CreateEventModal({ isOpen, onClose, username = "username" }: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const api = useApi();
  const navigate = useNavigate();

  // Auto-fill slug from title
  useEffect(() => {
    const autoSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 30);
    setSlug(autoSlug);
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await api.post("/events", {
        title,
        slug,
        duration: Number(duration),
      });
      const createdEvent = res.data.event;
      onClose();
      // Redirect to the event edit page
      navigate(`/dashboard/events/${createdEvent.id}/edit`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171614]/40 backdrop-blur-sm p-4">
      {/* Modal - thin border */}
      <div className="bg-white border border-[#E4E1D4] rounded-2xl w-full max-w-md overflow-hidden shadow-[4px_4px_0_rgba(23,22,20,0.1)] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header - thin border */}
        <div className="flex justify-between items-center p-5 border-b border-[#E4E1D4] bg-[#F3E75B]/20">
          <h3 className="font-cal-sans text-lg font-bold text-[#171614] uppercase tracking-wider">
            Create Event Type
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-transparent hover:border-[#171614]/15 hover:bg-[#FDFBF2] transition-all cursor-pointer"
          >
            <X className="w-5 h-5 text-[#171614]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-[#E5484D]/10 border border-[#E5484D]/30 text-[#E5484D] text-xs font-bold rounded-lg">
              ✕ {errorMsg}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 15 Minute Discovery Call"
              className="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl text-sm bg-white focus:outline-none focus:border-[#B7ACF7] transition-all font-semibold text-[#171614]"
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
              Duration
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[15, 30, 45, 60].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-2 border border-[#E4E1D4] rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    duration === d
                      ? "bg-[#7CEFC0] text-[#171614] border-[#171614]/15 shadow-[2px_2px_0_rgba(23,22,20,0.08)] translate-x-[-1px] translate-y-[-1px]"
                      : "bg-white text-[#2B2A27]/80 hover:bg-[#FDFBF2]"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* URL Slug */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171614] uppercase tracking-wider">
              URL Link Slug
            </label>
            <div className="flex items-center border border-[#E4E1D4] rounded-xl bg-white px-3 py-2.5 focus-within:border-[#B7ACF7] transition-all font-semibold">
              <span className="text-xs font-bold text-[#2B2A27]/50 select-none shrink-0 mr-1.5">
                {window.location.host}/{username}/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="15-min-call"
                className="w-full bg-transparent focus:outline-none text-xs text-[#171614] font-semibold"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#E4E1D4]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              rounded="xl"
              shadow="none"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              rounded="xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Event Type"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CreateEventModal;
