import React from "react";
import { Check, Eye } from "lucide-react";

interface AppearanceTabProps {
  appearance: string;
  onSave: (layout: string) => void;
  eventTypeId?: string;
}

export function AppearanceTab({ appearance, onSave, eventTypeId }: AppearanceTabProps) {
  const getPreviewUrl = (theme: string) => {
    let url = `/preview?theme=${theme}`;
    if (eventTypeId) {
      url += `&returnTo=${encodeURIComponent(`/dashboard/events/${eventTypeId}/edit`)}`;
    }
    return url;
  };

  return (
    <div className="bg-white border border-[#E4E1D4] rounded-2xl p-8 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-6">
      <div>
        <h3 className="font-cal-sans text-xl font-bold uppercase tracking-wider text-[#171614]">Appearance Layouts</h3>
        <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">Select one of the form layout designs to match your branding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Classic Neo-brutalist */}
        <div
          onClick={() => onSave("classic")}
          className={`border rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
            appearance === "classic"
              ? "bg-[#F3E75B]/10 border-[#171614] border-2 shadow-[3px_3px_0_rgba(23,22,20,1)]"
              : "bg-white hover:bg-[#FDFBF2] border-[#E4E1D4] shadow-[2px_2px_0_rgba(23,22,20,0.04)]"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-[#171614]">Neo-Brutalist Classic</span>
              {appearance === "classic" && <Check className="w-4 h-4 text-[#171614] stroke-[3]" />}
            </div>
            <p className="text-[11px] text-[#2B2A27]/70 font-semibold leading-relaxed">
              Thick black borders, high contrast palettes, and heavy retro shadow effects.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E1D4]/40 flex justify-between items-center">
            <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#2B2A27]/45">Layout Preview</span>
            <a
              href={getPreviewUrl("classic")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#171614] hover:underline cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-3.5 h-3.5" />
              Demo Preview
            </a>
          </div>
        </div>

        {/* Minimalist Modern */}
        <div
          onClick={() => onSave("minimal")}
          className={`border rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
            appearance === "minimal"
              ? "bg-blue-50/20 border-blue-500 border-2 shadow-[3px_3px_0_rgba(59,130,246,0.15)]"
              : "bg-white hover:bg-[#FDFBF2] border-[#E4E1D4] shadow-[2px_2px_0_rgba(23,22,20,0.04)]"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-gray-900">Modern Minimalist</span>
              {appearance === "minimal" && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
            </div>
            <p className="text-[11px] text-[#2B2A27]/70 font-semibold leading-relaxed">
              Subtle grey margins, warm typography, and no block shadows. Pure elegance.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E1D4]/40 flex justify-between items-center">
            <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#2B2A27]/45">Layout Preview</span>
            <a
              href={getPreviewUrl("minimal")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:underline cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-3.5 h-3.5" />
              Demo Preview
            </a>
          </div>
        </div>

        {/* Dark Mode Glass */}
        <div
          onClick={() => onSave("dark")}
          className={`border rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
            appearance === "dark"
              ? "bg-emerald-950/15 border-emerald-500 border-2 shadow-[3px_3px_0_rgba(16,185,129,0.15)]"
              : "bg-white hover:bg-[#FDFBF2] border-[#E4E1D4] shadow-[2px_2px_0_rgba(23,22,20,0.04)]"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-[#171614]">Dark Mode Glass</span>
              {appearance === "dark" && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
            </div>
            <p className="text-[11px] text-[#2B2A27]/70 font-semibold leading-relaxed">
              Translucent dark layout panels, glow effects, and modern workspace gradients.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E1D4]/40 flex justify-between items-center">
            <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#2B2A27]/45">Layout Preview</span>
            <a
              href={getPreviewUrl("dark")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 hover:underline cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-3.5 h-3.5" />
              Demo Preview
            </a>
          </div>
        </div>

        {/* Sage Cozy */}
        <div
          onClick={() => onSave("sage")}
          className={`border rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
            appearance === "sage"
              ? "bg-emerald-50/40 border-emerald-600 border-2 shadow-[3px_3px_0_rgba(4,120,87,0.15)]"
              : "bg-white hover:bg-[#FDFBF2] border-[#E4E1D4] shadow-[2px_2px_0_rgba(23,22,20,0.04)]"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-[#1E2E1F]">Cozy Sage</span>
              {appearance === "sage" && <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />}
            </div>
            <p className="text-[11px] text-[#2B2A27]/70 font-semibold leading-relaxed">
              Soft sage green outlines, organic rounded corners, and pastel background colors.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E1D4]/40 flex justify-between items-center">
            <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#2B2A27]/45">Layout Preview</span>
            <a
              href={getPreviewUrl("sage")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 hover:underline cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-3.5 h-3.5" />
              Demo Preview
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppearanceTab;
