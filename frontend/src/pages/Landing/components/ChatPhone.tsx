import React, { useState } from "react";

export function ChatPhone() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const selectSlot = (time: string) => {
    if (isTyping) return;
    setSelectedTime(time);
    setIsTyping(true);

    // Simulate typing dynamic delay
    setTimeout(() => {
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="absolute left-[50%] top-0 -translate-x-1/2 w-[300px] h-[500px] bg-gradient-to-br from-[#232220] to-[#0b0b0a] border-[6px] border-[#3a3835] rounded-[34px] shadow-[0_30px_60px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="flex items-center justify-between px-4.5 pt-3.5 text-[11px] font-bold text-white">
        <span>9:41</span>
        <div className="flex gap-1.25">
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
        </div>
      </div>
      <div className="px-4.5 pt-5 text-left text-white">
        <p className="text-[12px] font-semibold text-white mb-2">
          ✦ Pick a time that works for you. Priya is available:
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => selectSlot("9:00 AM")}
            disabled={isTyping}
            className={`text-[10px] font-bold bg-[#2a2926] px-3 py-1.75 rounded-full flex items-center gap-1.25 border-none cursor-pointer transition-all ${
              selectedTime === "9:00 AM" ? "bg-[#8C7CF0] text-white" : "text-white"
            }`}
          >
            🕐 9:00 AM
          </button>
          <button
            onClick={() => selectSlot("11:30 AM")}
            disabled={isTyping}
            className={`text-[10px] font-bold bg-[#2a2926] px-3 py-1.75 rounded-full flex items-center gap-1.25 border-none cursor-pointer transition-all ${
              selectedTime === "11:30 AM" ? "bg-[#8C7CF0] text-white" : "text-white"
            }`}
          >
            🕐 11:30 AM
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => selectSlot("2:00 PM")}
            disabled={isTyping}
            className={`text-[10px] font-bold bg-[#2a2926] px-3 py-1.75 rounded-full flex items-center gap-1.25 border-none cursor-pointer transition-all ${
              selectedTime === "2:00 PM" ? "bg-[#8C7CF0] text-white" : "text-white"
            }`}
          >
            🕐 2:00 PM
          </button>
          <button
            onClick={() => selectSlot("4:30 PM")}
            disabled={isTyping}
            className={`text-[10px] font-bold bg-[#2a2926] px-3 py-1.75 rounded-full flex items-center gap-1.25 border-none cursor-pointer transition-all ${
              selectedTime === "4:30 PM" ? "bg-[#8C7CF0] text-white" : "text-white"
            }`}
          >
            🕐 4:30 PM
          </button>
        </div>

        <div className="mt-3 bg-[#2a2926] rounded-t-xl rounded-bl-xl rounded-br-[2px] px-3 py-2.25 text-[11px] ml-[30%] text-white">
          Booking a 30-min product demo — do you have anything free tomorrow morning?
        </div>

        {selectedTime && (
          <div className="mt-3 bg-[#2a2926] rounded-t-xl rounded-bl-xl rounded-br-[2px] px-3 py-2.25 text-[11px] ml-[30%] text-white">
            {selectedTime} works great for me, let's lock that in.
          </div>
        )}

        {isTyping ? (
          <div className="mt-2.5 bg-[#7CEFC0] text-[#171614] rounded-t-xl rounded-br-xl rounded-bl-[2px] px-3 py-2.25 text-[11px] inline-flex gap-1 items-center">
            <span className="w-1.5 h-1.5 bg-[#171614] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#171614] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#171614] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        ) : (
          selectedTime && (
            <>
              <div className="mt-2.5 bg-[#7CEFC0] text-[#171614] rounded-t-xl rounded-br-xl rounded-bl-[2px] px-3 py-2.25 text-[11px] max-w-[80%]">
                Done! Confirmed for {selectedTime} and added to both calendars automatically.
              </div>
              <div className="mt-3 bg-[#2a2926] rounded-xl px-3 py-2 text-[10.5px] font-bold flex items-center gap-2 text-white">
                <span className="w-4 h-4 rounded-full bg-[#7CEFC0] shrink-0"></span> Product Demo · {selectedTime}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
export default ChatPhone;
