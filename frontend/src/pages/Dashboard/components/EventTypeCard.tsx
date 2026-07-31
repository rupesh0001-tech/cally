import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Clock, Video, MapPin, Copy, ExternalLink, Check } from "lucide-react";
import { Switch } from "../../../components/ui/Switch";

export interface EventType {
  id: string;
  title: string;
  duration: number;
  locationType: "Video" | "In-Person";
  locationDetails: string;
  price: number;
  isActive: boolean;
  slug: string;
}

interface EventTypeCardProps {
  et: EventType;
  username: string;
  onToggleActive: (id: string) => void;
  onCopyLink: (id: string, slug: string) => void;
  copiedId: string | null;
}

export function EventTypeCard({
  et,
  username,
  onToggleActive,
  onCopyLink,
  copiedId,
}: EventTypeCardProps) {
  return (
    <div
      className={`bg-white border border-[#E4E1D4] rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(23,22,20,0.08)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_rgba(23,22,20,0.12)] transition-all flex flex-col justify-between ${
        et.isActive ? "" : "opacity-85"
      }`}
    >
      {/* Top Bar with status & action dropdown */}
      <div className={clsx('p-6', 'border-b', 'border-[#E4E1D4]', 'flex-1')}>
        <div className={clsx('flex', 'justify-between', 'items-center', 'mb-4')}>
          <span className={clsx('text-xs', 'font-bold', 'text-[#171614]', 'bg-[#F3E75B]', 'px-3', 'py-1', 'rounded-xl', 'border', 'border-[#171614]/15')}>
            {et.duration} mins
          </span>
          
          <Switch
            checked={et.isActive}
            onChange={() => onToggleActive(et.id)}
            ariaLabel="Toggle Active Status"
          />
        </div>

        {/* Title & Price */}
        <Link to={`/dashboard/events/${et.id}/edit`} className={clsx('block', 'hover:underline')}>
          <h3 className={clsx('font-cal-sans', 'text-lg', 'font-bold', 'text-[#171614]', 'uppercase', 'tracking-wide', 'mb-2', 'line-clamp-1')}>
            {et.title}
          </h3>
        </Link>
        
        <div className="mb-4">
          <span className={clsx('inline-block', 'text-xs', 'font-extrabold', 'text-[#171614]', 'bg-[#B7ACF7]', 'border', 'border-[#171614]/15', 'px-2.5', 'py-0.5', 'rounded-md')}>
            {et.price > 0 ? `$${et.price}.00` : "Free"}
          </span>
        </div>

        {/* Meeting Meta details */}
        <div className={clsx('space-y-2.5', 'text-xs', 'text-[#2B2A27]', 'font-semibold')}>
          <div className={clsx('flex', 'items-center', 'gap-2')}>
            <Clock className={clsx('w-4', 'h-4', 'text-[#171614]')} />
            <span>1-on-1 • {et.duration} min session</span>
          </div>
          <div className={clsx('flex', 'items-center', 'gap-2')}>
            {et.locationType === "Video" ? (
              <Video className={clsx('w-4', 'h-4', 'text-[#171614]')} />
            ) : (
              <MapPin className={clsx('w-4', 'h-4', 'text-[#171614]')} />
            )}
            <span>
              {et.locationType} ({et.locationDetails})
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className={clsx('bg-[#FDFBF2]', 'px-6', 'py-4', 'flex', 'items-center', 'justify-between')}>
        <a
          href={`/book/${username}/${et.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx('text-xs', 'font-bold', 'text-[#2B2A27]', 'hover:text-[#171614]', 'hover:underline', 'flex', 'items-center', 'gap-1.5', 'transition-colors')}
        >
          <ExternalLink className={clsx('w-3.5', 'h-3.5')} />
          Preview page
        </a>
        <button
          onClick={() => onCopyLink(et.id, et.slug)}
          className={`text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            copiedId === et.id ? "text-[#58D9A6]" : "text-[#2B2A27] hover:text-[#171614]"
          }`}
        >
          {copiedId === et.id ? (
            <>
              <Check className={clsx('w-3.5', 'h-3.5', 'stroke-[3]')} />
              Copied!
            </>
          ) : (
            <>
              <Copy className={clsx('w-3.5', 'h-3.5')} />
              Copy link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
export default EventTypeCard;
