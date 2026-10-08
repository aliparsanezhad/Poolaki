import React from 'react';
import { Menu, Circle, ChevronLeft } from 'lucide-react';

export default function AndroidNavBar() {
  return (
    <div className="w-full h-9 flex items-center justify-around px-8 text-slate-400 select-none bg-[#151922] border-t border-slate-800/40">
      <button className="p-1 hover:text-white transition-colors">
        <Menu className="w-4 h-4 transform rotate-90" />
      </button>
      <button className="p-1 hover:text-white transition-colors">
        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400"></div>
      </button>
      <button className="p-1 hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
}
