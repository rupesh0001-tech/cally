import React from "react";
import { Search, Plus, Menu } from "lucide-react";
import { Button } from "../ui/Button";

interface HeaderProps {
  title: string;
  showActions?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (val: string) => void;
  onCreateClick?: () => void;
  onMenuToggle?: () => void;
}

export function Header({
  title,
  showActions = false,
  searchQuery = "",
  onSearchQueryChange,
  onCreateClick,
  onMenuToggle,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-[#E4E1D4] bg-white flex items-center justify-between px-3 md:px-8 shrink-0 select-none">
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1.5 text-[#171614] hover:bg-black/5 rounded-xl cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
        <h2 className="font-cal-sans text-xs sm:text-sm md:text-base font-bold text-[#171614] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h2>
      </div>
      {showActions && (
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {onSearchQueryChange && (
            <div className="relative w-28 sm:w-48 md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#171614] opacity-75" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-[#E4E1D4] rounded-xl text-[11px] bg-white focus:outline-none focus:border-[#B7ACF7] transition-all font-semibold text-[#171614] placeholder-[#2B2A27]/60"
              />
            </div>
          )}
          
          <div className="hidden sm:block">
            <Button
              variant="primary"
              size="sm"
              rounded="xl"
              shadow="sm"
              onClick={onCreateClick}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3] mr-1.5" />
              Create Event Type
            </Button>
          </div>

          <div className="block sm:hidden">
            <button
              onClick={onCreateClick}
              className="w-9 h-9 flex items-center justify-center bg-[#171614] text-[#FDFBF2] border-2 border-[#171614] rounded-xl shadow-[2px_2px_0_#171614] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#171614] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3] text-[#FDFBF2]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
export default Header;
