import React from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import StatusBar from './StatusBar';
import AndroidNavBar from './AndroidNavBar';
import NavigationBar from './NavigationBar';
import { Plus, Smartphone, Monitor, MessageSquare, Database, Tag } from 'lucide-react';

export default function MobileFrame({ children }) {
  const {
    isPhoneFrame,
    setIsPhoneFrame,
    toastMessage,
    setIsNewTxModalOpen,
    setIsSmsSimulatorOpen,
    setIsDataManagementOpen,
    setIsCategoryManagerOpen
  } = usePoolaki();

  return (
    <div className="min-h-screen bg-[#0d1017] text-slate-100 flex flex-col items-center justify-center p-0 md:p-6 font-vazir relative selection:bg-blue-600/30 selection:text-white">
      {/* Desktop Top Control Bar */}
      <div className="hidden md:flex items-center justify-between w-full max-w-4xl mb-4 px-4 py-2.5 bg-[#171d29] border border-[#262f42] rounded-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-black text-sm text-white tracking-wide">
            پولکی <span className="text-xs font-normal text-slate-400">(Poolaki Exact Clone)</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsSmsSimulatorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>تست پیامک بانک</span>
          </button>

          <button
            onClick={() => setIsDataManagementOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#232b3c] hover:bg-[#2e374c] text-slate-300 border border-[#343f56] transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>پشتیبان‌گیری PLK</span>
          </button>

          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#232b3c] hover:bg-[#2e374c] text-slate-300 border border-[#343f56] transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>دسته‌ها</span>
          </button>

          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#232b3c] hover:bg-[#2e374c] text-slate-300 border border-[#343f56] transition-colors cursor-pointer"
            title="تغییر نمای موبایل / تمام‌صفحه"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span>نمای تمام‌صفحه</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>قالب گوشی موبایل</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container / Phone Mockup */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isPhoneFrame
            ? 'max-w-[415px] h-[100vh] md:h-[880px] bg-[#1a1f2c] md:rounded-[44px] md:border-[10px] md:border-[#283144] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden'
            : 'max-w-2xl h-[100vh] md:h-[90vh] bg-[#1a1f2c] md:rounded-3xl border border-[#2b354a] shadow-2xl overflow-hidden'
        }`}
      >
        {/* Android Camera Punch Hole on frame mode */}
        {isPhoneFrame && (
          <div className="hidden md:block absolute top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-30 ring-2 ring-[#222938]"></div>
        )}

        {/* Android Status Bar */}
        <StatusBar />

        {/* Dynamic View Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}

          {/* Floating Action Button (FAB) matching photo_5 & photo_6 */}
          <button
            onClick={() => setIsNewTxModalOpen(true)}
            className="absolute bottom-4 left-4 z-20 w-14 h-14 rounded-full bg-[#6179fb] hover:bg-[#4f6bf9] active:scale-95 text-white flex items-center justify-center shadow-xl shadow-blue-600/35 transition-all cursor-pointer group"
            title="ثبت تراکنش جدید"
          >
            <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Bottom Poolaki Navigation */}
        <NavigationBar />

        {/* Android System Nav Bar */}
        {isPhoneFrame && <AndroidNavBar />}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#293246] border border-[#3b4763] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
