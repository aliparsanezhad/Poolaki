import React from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { Home, Coins, BarChart3, PiggyBank, CalendarClock } from 'lucide-react';

export default function NavigationBar() {
  const { activeTab, setActiveTab, dues, pendingSmsList } = usePoolaki();

  const unpaidDuesCount = dues?.filter((d) => !d.isPaid)?.length || 0;
  const pendingSmsCount = pendingSmsList?.length || 0;

  const tabs = [
    { id: 'home', label: 'داشبورد', icon: Home, badge: pendingSmsCount },
    { id: 'assets', label: 'دارایی‌ها', icon: Coins },
    { id: 'reports', label: 'گزارشات', icon: BarChart3 },
    { id: 'budget', label: 'بودجه', icon: PiggyBank },
    { id: 'dues', label: 'سررسید', icon: CalendarClock, badge: unpaidDuesCount }
  ];

  return (
    <nav className="w-full bg-[#131722]/95 backdrop-blur-xl border-t border-[#232c3f] px-3 py-2 flex items-center justify-around z-20 select-none shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1.5 rounded-2xl transition-all duration-200 cursor-pointer group ${
              isActive
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            {/* Active Pill Glow */}
            {isActive && (
              <span className="absolute inset-x-2 -top-2 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}

            <div
              className={`relative p-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 scale-110 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                  : 'group-hover:scale-105'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />

              {/* Dynamic Badge */}
              {tab.badge > 0 && !isActive && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-[#131722] rounded-full text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

