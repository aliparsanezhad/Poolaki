import React from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { Bookmark, Coins, BarChart2, PiggyBank, BookOpen } from 'lucide-react';

export default function NavigationBar() {
  const { activeTab, setActiveTab } = usePoolaki();

  const tabs = [
    { id: 'home', label: 'خانه', icon: Bookmark },
    { id: 'assets', label: 'دارایی', icon: Coins },
    { id: 'reports', label: 'گزارش', icon: BarChart2 },
    { id: 'budget', label: 'بودجه', icon: PiggyBank },
    { id: 'dues', label: 'سررسید', icon: BookOpen }
  ];

  return (
    <div className="w-full bg-[#181d28] border-t border-[#232938] px-2 py-2 flex items-center justify-around z-20 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-[#6179fb]' : 'text-[#7e8b9f] hover:text-slate-300'
            }`}
          >
            <div className={`p-1 transition-transform ${isActive ? 'scale-105' : ''}`}>
              <Icon className="w-5 h-5 stroke-[2]" />
            </div>
            <span className={`text-[11px] font-medium mt-0.5 ${isActive ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
