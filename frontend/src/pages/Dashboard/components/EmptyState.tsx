import React from "react";
import { Search } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export function EmptyState({
  icon = <Search className="w-12 h-12 text-[#171614] mx-auto mb-4 opacity-75" />,
  title = "No event types found",
  description = "Try adjusting your search terms or create a new event type to get started.",
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white border border-[#E4E1D4] rounded-2xl shadow-[3px_3px_0_rgba(23,22,20,0.08)]">
      {icon}
      <h3 className="font-cal-sans text-xl font-bold text-[#171614] uppercase tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-[#2B2A27] text-sm max-w-xs mx-auto font-medium">
        {description}
      </p>
    </div>
  );
}
export default EmptyState;
