import React from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import StatusBar from './StatusBar';
import AndroidNavBar from './AndroidNavBar';
import NavigationBar from './NavigationBar';
import InteractiveNotification from './InteractiveNotification';
import JeebYarLogo from './JeebYarLogo';
import {
  Plus,
  Smartphone,
  Monitor,
  MessageSquare,
  Database,
  Crown,
  Coins,
  Camera,
  Users,
  Bell,
  Sparkles
} from 'lucide-react';

export default function MobileFrame({ children }) {
  const {
    isPhoneFrame,
    setIsPhoneFrame,
    toastMessage,
    setIsNewTxModalOpen,
    setIsSmsSimulatorOpen,
    setIsDataManagementOpen,
    pendingSmsList,
    setIsBatchSmsOpen,
    setIsSubscriptionModalOpen,
    subscription,
    setIsAssetValuationOpen,
    setIsReceiptScannerOpen,
    setIsSplitBillOpen,
    triggerSampleNotification
  } = usePoolaki();

  const isProActive = Boolean(subscription?.isPro);
  const pendingCount = pendingSmsList?.length || 0;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col items-center justify-center p-0 md:p-5 font-vazir relative selection:bg-emerald-500/30 selection:text-white">
      {/* Desktop Top Control Bar */}
      <div className="hidden md:flex items-center justify-between w-full max-w-5xl mb-3.5 px-4 py-2.5 bg-[#141924]/90 backdrop-blur-md border border-[#222a3b] rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <JeebYarLogo className="w-8 h-8" showText={true} isPro={isProActive} />
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            نسخه ارتقایافته پولکی با هوش مالی، اسکن فاکتور و صندوق طلا
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs flex-wrap justify-end">
          {/* Subscription Tier Button */}
          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isProActive
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300 hover:brightness-110'
                : 'bg-emerald-600/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/25'
            }`}
            title="پلن‌های اشتراک جیب‌یار PRO"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{isProActive ? 'پلن VIP فعال' : 'ارتقا به PRO'}</span>
          </button>

          {/* Batch SMS Queue Button */}
          <button
            onClick={() => setIsBatchSmsOpen(true)}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1e2535] hover:bg-[#283247] text-slate-200 border border-[#2d384e] transition-colors cursor-pointer"
            title="پیامک‌های دسته‌جمعی وارد نشده"
          >
            <Bell className="w-3.5 h-3.5 text-indigo-400" />
            <span>پیامک‌های انباشته</span>
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          {/* Gold & Crypto Vault */}
          <button
            onClick={() => setIsAssetValuationOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1e2535] hover:bg-[#283247] text-slate-200 border border-[#2d384e] transition-colors cursor-pointer"
            title="ارزش‌گذاری لحظه‌ای طلا، سکه و تتر"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>طلا و تتر</span>
          </button>

          {/* AI Receipt Scanner */}
          <button
            onClick={() => setIsReceiptScannerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1e2535] hover:bg-[#283247] text-slate-200 border border-[#2d384e] transition-colors cursor-pointer"
            title="اسکن هوشمند رسید POS و فاکتور"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>اسکن فاکتور</span>
          </button>

          {/* Dong / Split Bill */}
          <button
            onClick={() => setIsSplitBillOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1e2535] hover:bg-[#283247] text-slate-200 border border-[#2d384e] transition-colors cursor-pointer"
            title="محاسبه دنگ جمعی و خروجی تلگرام"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>محاسبه دنگ</span>
          </button>

          {/* Test SMS Simulator */}
          <button
            onClick={() => setIsSmsSimulatorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 transition-colors cursor-pointer"
            title="تست پارسر پیامک بانکی (مسکن، سامان، ملت، بلوبانک)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>تست پیامک</span>
          </button>

          {/* Trigger Dropdown Notification */}
          <button
            onClick={triggerSampleNotification}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
            title="تست دریافت نوتیفیکیشن ثبت فوری ۱-کلیک"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">نوتیف ۱-کلیک</span>
          </button>

          {/* PLK Backup */}
          <button
            onClick={() => setIsDataManagementOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1e2535] hover:bg-[#283247] text-slate-300 border border-[#2d384e] transition-colors cursor-pointer"
            title="پشتیبان‌گیری PLK و بازیابی داده‌ها"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>پشتیبان</span>
          </button>

          {/* Toggle Screen Frame */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1e2535] hover:bg-[#283247] text-slate-300 border border-[#2d384e] transition-colors cursor-pointer"
            title="تغییر نمای موبایل / تمام‌صفحه"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline">تمام‌صفحه</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline">نمای گوشی</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container / Phone Mockup */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isPhoneFrame
            ? 'max-w-[420px] h-[100vh] md:h-[890px] bg-[#1a1f2c] md:rounded-[48px] md:border-[10px] md:border-[#283144] md:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden'
            : 'max-w-2xl h-[100vh] md:h-[92vh] bg-[#1a1f2c] md:rounded-3xl border border-[#2b354a] shadow-2xl overflow-hidden'
        }`}
      >
        {/* Android Camera Punch Hole on frame mode */}
        {isPhoneFrame && (
          <div className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-30 ring-2 ring-[#222938]"></div>
        )}

        {/* Android Status Bar */}
        <StatusBar />

        {/* Interactive Push Notification Banner */}
        <InteractiveNotification />

        {/* Dynamic View Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}

          {/* Floating Action Button (FAB) matching Poolaki */}
          <button
            onClick={() => setIsNewTxModalOpen(true)}
            className="absolute bottom-4 left-4 z-20 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 hover:brightness-110 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-emerald-950/60 transition-all cursor-pointer group"
            title="ثبت تراکنش جدید با ماشین‌حساب"
          >
            <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Bottom Navigation */}
        <NavigationBar />

        {/* Android System Nav Bar */}
        {isPhoneFrame && <AndroidNavBar />}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#293246]/95 backdrop-blur-md border border-[#3b4763] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
