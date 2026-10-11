import React from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Inbox,
  Coins,
  ScanLine,
  Users,
  ChevronLeft
} from 'lucide-react';

export default function FinancialHealthCard() {
  const {
    transactions,
    accounts,
    pendingSmsList,
    setIsBatchSmsOpen,
    setIsAssetValuationOpen,
    setIsReceiptScannerOpen,
    setIsSplitBillOpen,
    triggerSampleNotification,
    subscription
  } = usePoolaki();

  const totalBalance = accounts.reduce(
    (acc, a) => acc + (a.currentBalance || a.initialBalance || 0),
    0
  );

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  // Health score calculation
  const healthScore = totalBalance > totalExpense ? 88 : 54;
  const isHealthy = healthScore >= 75;

  return (
    <div className="bg-gradient-to-br from-[#1d2638] via-[#17202f] to-[#121926] border border-[#2d3a52] rounded-3xl p-4 shadow-xl space-y-3.5 select-none relative overflow-hidden">
      {/* Decorative neon ambient blur */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Header: AI Financial Copilot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            {isHealthy ? 'وضعیت پایدار' : 'هشدار سرعت خرج'}
          </span>
          <span className="text-xs font-black text-white">هوش مالی جیب‌یار</span>
        </div>

        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>امتیاز سلامت: {healthScore}/۱۰۰</span>
        </div>
      </div>

      {/* Predictive Burnout Runway */}
      <div className="bg-[#121824]/80 border border-[#243046] rounded-2xl p-3 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">
          {isHealthy
            ? '✓ با روند فعلی، تا پایان ماه پس‌انداز مثبتی خواهید داشت.'
            : '⚠️ سرعت مخارج بالا؛ تا روز ۲۴م موجودی اصلی تمام می‌شود.'}
        </span>
        <div className="flex items-center gap-1 text-slate-300 font-bold shrink-0">
          <span>تاب‌آوری تا سر برج</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Quick Action Feature Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Batch SMS Queue Button matching update_batch_sms.jpg */}
        <button
          type="button"
          onClick={() => setIsBatchSmsOpen(true)}
          className="bg-[#1c2436] hover:bg-[#253046] border border-[#2f3d57] rounded-2xl p-2.5 flex items-center justify-between transition-all group cursor-pointer shadow-xs"
        >
          <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            +{pendingSmsList.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white group-hover:text-blue-400 transition-colors">
              صندوق پیامک‌ها
            </span>
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
        </button>

        {/* Live Gold & Crypto Valuation */}
        <button
          type="button"
          onClick={() => setIsAssetValuationOpen(true)}
          className="bg-[#1c2436] hover:bg-[#253046] border border-[#2f3d57] rounded-2xl p-2.5 flex items-center justify-between transition-all group cursor-pointer shadow-xs"
        >
          <span className="text-[10px] text-amber-400 font-bold">نرخ روز</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white group-hover:text-amber-400 transition-colors">
              ارزش طلا و تتر
            </span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
        </button>

        {/* AI Receipt Scanner */}
        <button
          type="button"
          onClick={() => setIsReceiptScannerOpen(true)}
          className="bg-[#1c2436] hover:bg-[#253046] border border-[#2f3d57] rounded-2xl p-2.5 flex items-center justify-between transition-all group cursor-pointer shadow-xs"
        >
          <span className="text-[10px] text-cyan-400 font-bold">OCR</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">
              اسکنر هوشمند رسید
            </span>
            <ScanLine className="w-4 h-4 text-cyan-400" />
          </div>
        </button>

        {/* Split Bill / Dong */}
        <button
          type="button"
          onClick={() => setIsSplitBillOpen(true)}
          className="bg-[#1c2436] hover:bg-[#253046] border border-[#2f3d57] rounded-2xl p-2.5 flex items-center justify-between transition-all group cursor-pointer shadow-xs"
        >
          <span className="text-[10px] text-purple-400 font-bold">دورهمی</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white group-hover:text-purple-400 transition-colors">
              محاسبه دنگ
            </span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
        </button>
      </div>

      {/* Interactive Push Notification Test Bar */}
      <button
        type="button"
        onClick={() => triggerSampleNotification()}
        className="w-full bg-[#182133] hover:bg-[#222d44] border border-[#2b3952] py-2 px-3 rounded-2xl flex items-center justify-between text-xs text-slate-300 transition-colors cursor-pointer"
      >
        <span className="text-[10px] text-blue-400 font-bold flex items-center gap-1">
          <span>شبیه‌سازی و تست</span>
          <ChevronLeft className="w-3 h-3" />
        </span>
        <span className="text-[11px] font-semibold text-slate-200">
          🔔 تست ثبت تراکنش با نوتیفیکیشن بدون بازکردن اپ
        </span>
      </button>
    </div>
  );
}
