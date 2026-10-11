import React from 'react';

export default function JeebYarLogo({ className = 'w-9 h-9', showText = true, isPro = true }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 to-amber-400/30 rounded-2xl blur-xs"></div>

        {/* Outer shield container */}
        <div className="relative w-full h-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl border border-emerald-500/40 p-1 flex items-center justify-center shadow-lg shadow-emerald-950/50">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            {/* Hexagonal / Diamond Shield */}
            <path
              d="M24 4L42 12V24C42 34 34 41 24 44C14 41 6 34 6 24V12L24 4Z"
              fill="url(#shield_grad)"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            {/* Golden Coin Center Ring */}
            <circle cx="24" cy="24" r="10" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 2" />
            {/* Inner Emerald Core / Currency Symbol */}
            <path
              d="M24 18V30M19 21H27C28.5 21 29 22 29 23.5C29 25 27.5 25.5 24 25.5C20.5 25.5 19 26 19 27.5C19 29 20 30 22 30H29"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sparkle */}
            <circle cx="34" cy="14" r="2" fill="#fbbf24" />

            <defs>
              <linearGradient id="shield_grad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e3a5f" />
                <stop offset="1" stopColor="#0b1329" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white text-base tracking-tight font-vazir">جیب‌یار</span>
            {isPro && (
              <span className="text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 px-1.5 py-0.5 rounded-full shadow-xs">
                PRO
              </span>
            )}
          </div>
          <span className="text-[9px] text-slate-400 font-medium">دستیار هوشمند مالی و دارایی</span>
        </div>
      )}
    </div>
  );
}
