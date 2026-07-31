import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { Clock, Calendar, LayoutDashboard, Settings, CalendarDays, BarChart3, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import clsx from "clsx";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { name: "Event Types", path: "/dashboard", icon: Clock },
    { name: "Bookings", path: "/dashboard/bookings", icon: Calendar },
    { name: "Availability", path: "/dashboard/availability", icon: LayoutDashboard },
    { name: "Calendar", path: "/dashboard/calendar", icon: CalendarDays },
    { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className={clsx(
      'w-64', 'border-r', 'border-[#E4E1D4]', 'bg-white', 'flex', 'flex-col', 'justify-between',
      'fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    )}>
      <div>
        {/* Logo container with thin bottom border */}
        <div className={clsx('h-16', 'border-b', 'border-[#E4E1D4]', 'bg-[#F3E75B]', 'flex', 'items-center', 'justify-between', 'px-6')}>
          <Logo />
          <button
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-black/5 rounded-lg text-[#171614] cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
        <nav className={clsx('p-4', 'space-y-2.5')}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  isActive
                    ? "bg-[#7CEFC0] text-[#171614] border-[#171614]/15 translate-x-[-1px] translate-y-[-1px] shadow-[2px_2px_0_rgba(23,22,20,0.08)]"
                    : "text-[#2B2A27] border-transparent hover:border-[#171614]/15 hover:bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0_rgba(23,22,20,0.08)]"
                }`}
              >
                <Icon className={clsx('h-4', 'w-4', 'stroke-[2.5]')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer profile container with thin top border */}
      <div className={clsx('p-4', 'border-t', 'border-[#E4E1D4]', 'bg-[#FDFBF2]', 'flex', 'items-center', 'justify-end', 'text-8xl', 'font-semibold')}>
        <div className={clsx('flex', 'items-center', 'gap-2', 'justify-between')}>
          <UserButton showName />
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
