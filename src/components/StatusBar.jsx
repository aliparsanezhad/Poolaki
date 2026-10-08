import React from 'react';
import { Wifi, Signal, BatteryMedium, Send } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="w-full flex items-center justify-between px-5 pt-3 pb-2 text-[12px] font-medium text-slate-300 select-none bg-transparent">
      {/* Right side in RTL (Left on screen): Time and notification icons */}
      <div className="flex items-center gap-1.5 direction-ltr">
        <span className="font-semibold tracking-tight text-[13px] text-white">۳:۳۴</span>
        <span className="text-[10px] text-slate-400 font-bold ml-1">nV</span>
        <Send className="w-3 h-3 text-slate-300 transform -rotate-45" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
      </div>

      {/* Left side in RTL (Right on screen): Network, VoLTE, Battery */}
      <div className="flex items-center gap-1.5 text-slate-300 direction-ltr">
        <div className="flex flex-col text-[8px] leading-[9px] font-bold text-slate-400">
          <span>Vo)</span>
          <span>LTE1</span>
        </div>
        <div className="flex flex-col text-[8px] leading-[9px] font-bold text-slate-400">
          <span>Vo)</span>
          <span>LTE2</span>
        </div>
        <div className="flex items-center text-[10px] font-bold">
          <span>4G</span>
        </div>
        <Signal className="w-3.5 h-3.5 text-slate-200" />
        <span className="text-[12px] font-bold ml-0.5">۶۶٪</span>
        <div className="w-5 h-2.5 border border-slate-300 rounded-[3px] p-[1px] flex items-center">
          <div className="bg-slate-200 h-full w-[66%] rounded-[1px]"></div>
        </div>
      </div>
    </div>
  );
}
