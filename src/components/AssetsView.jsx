import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  CreditCard,
  Wallet,
  Plus,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  Coins,
  DollarSign,
  TrendingUp,
  Sparkles,
  PieChart,
  ArrowUpRight,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export default function AssetsView() {
  const {
    accounts,
    setEditingAccount,
    setIsSmsSimulatorOpen,
    portfolio,
    marketPrices,
    setIsAssetValuationOpen
  } = usePoolaki();

  const [activeAssetTab, setActiveAssetTab] = useState('cards'); // 'cards' | 'vault' | 'allocation'

  // Total cash & bank balance
  const totalCashBank = accounts.reduce(
    (acc, a) => acc + (a.currentBalance || a.initialBalance || 0),
    0
  );

  // Valuation of investments
  const goldValue = Math.round((portfolio?.goldGrams || 0) * (marketPrices?.gold18k || 4680000));
  const sekehValue = Math.round((portfolio?.sekehCount || 0) * (marketPrices?.sekehEmami || 54200000));
  const tetherValue = Math.round((portfolio?.tetherAmount || 0) * (marketPrices?.tetherUsdt || 69400));
  const silverValue = Math.round((portfolio?.silverGrams || 0) * (marketPrices?.silverGram || 74000));
  const totalVaultValue = goldValue + sekehValue + tetherValue + silverValue;

  // Grand Total Net Worth
  const grandTotalAssets = totalCashBank + totalVaultValue;

  // Percentage calculations
  const bankPercent = grandTotalAssets > 0 ? Math.round((totalCashBank / grandTotalAssets) * 100) : 0;
  const goldPercent = grandTotalAssets > 0 ? Math.round(((goldValue + sekehValue) / grandTotalAssets) * 100) : 0;
  const cryptoPercent = grandTotalAssets > 0 ? Math.round((tetherValue / grandTotalAssets) * 100) : 0;
  const silverPercent = Math.max(0, 100 - (bankPercent + goldPercent + cryptoPercent));

  // Visual card styling helpers
  const getCardStyle = (acc) => {
    const code = acc.bankCode || '';
    if (code === 'tejarat') {
      return {
        bg: 'from-[#0f2b5c] via-[#163a75] to-[#0a1936]',
        border: 'border-blue-500/30',
        accent: 'text-amber-300',
        chip: 'from-amber-300 to-yellow-500',
        logoText: 'بانک تجارت'
      };
    }
    if (code === 'maskan') {
      return {
        bg: 'from-[#6c2810] via-[#853517] to-[#3f1608]',
        border: 'border-amber-600/30',
        accent: 'text-amber-400',
        chip: 'from-amber-200 to-amber-500',
        logoText: 'بانک مسکن'
      };
    }
    if (code === 'melli') {
      return {
        bg: 'from-[#751a1a] via-[#8c2222] to-[#420f0f]',
        border: 'border-rose-500/30',
        accent: 'text-rose-300',
        chip: 'from-amber-300 to-yellow-600',
        logoText: 'بانک ملی ایران'
      };
    }
    return {
      bg: 'from-[#143d34] via-[#185347] to-[#0a2620]',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-300',
      chip: 'from-emerald-300 to-teal-500',
      logoText: acc.name || 'حساب نقدی'
    };
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-3.5 select-none">
      {/* Grand Net Worth Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2333] via-[#151c2a] to-[#0f141f] border border-[#2b354c] rounded-3xl p-4 shadow-xl">
        <div className="absolute top-0 left-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-400" />
            ارزش کل دارایی‌ها و سرمایه
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ارزش‌گذاری زنده
          </span>
        </div>

        <div className="relative z-10 text-2xl font-black text-white tracking-tight mb-2 font-vazir">
          {formatToman(grandTotalAssets)}
        </div>

        {/* Quick allocation metrics */}
        <div className="relative z-10 grid grid-cols-3 gap-2 pt-2.5 border-t border-[#263147] text-[11px]">
          <div className="flex flex-col text-right">
            <span className="text-slate-400 text-[10px]">بانکی و نقد</span>
            <span className="font-bold text-slate-200 mt-0.5">{formatToman(totalCashBank)}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-amber-400/90 text-[10px]">طلا و سکه</span>
            <span className="font-bold text-amber-300 mt-0.5">{formatToman(goldValue + sekehValue)}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-cyan-400/90 text-[10px]">کریپتو (تتر)</span>
            <span className="font-bold text-cyan-300 mt-0.5">{formatToman(tetherValue)}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Cards / Vault / Allocation */}
      <div className="flex items-center bg-[#151a26] p-1 rounded-2xl border border-[#232c3f]">
        <button
          onClick={() => setActiveAssetTab('cards')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAssetTab === 'cards'
              ? 'bg-[#222a3d] text-white shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>کارت‌ها ({accounts.length})</span>
        </button>

        <button
          onClick={() => setActiveAssetTab('vault')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAssetTab === 'vault'
              ? 'bg-[#222a3d] text-amber-300 shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>صندوق طلا و تتر</span>
        </button>

        <button
          onClick={() => setActiveAssetTab('allocation')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeAssetTab === 'allocation'
              ? 'bg-[#222a3d] text-cyan-300 shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>تخصیص ریسک</span>
        </button>
      </div>

      {/* 1. CARDS TAB */}
      {activeAssetTab === 'cards' && (
        <div className="space-y-3 flex-1">
          {/* Action triggers */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => {
                setEditingAccount({
                  id: `acc-${Date.now()}`,
                  type: 'card',
                  bankName: 'بانک مسکن',
                  bankCode: 'maskan',
                  cardNumber: '6280 23',
                  name: '',
                  smsEnabled: true,
                  smsSenders: ['MaskanBank'],
                  initialBalance: 0,
                  currentBalance: 0,
                  color: '#ea580c'
                });
              }}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن کارت بانکی جدید</span>
            </button>

            <button
              onClick={() => setIsSmsSimulatorOpen(true)}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>تست پیامک</span>
            </button>
          </div>

          {/* Realistic Physical Debit Cards List */}
          <div className="space-y-3">
            {accounts.map((acc) => {
              const isCard = acc.type === 'card';
              const style = getCardStyle(acc);

              return (
                <div
                  key={acc.id}
                  onClick={() => setEditingAccount(acc)}
                  className={`relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br ${style.bg} border ${style.border} shadow-lg cursor-pointer hover:scale-[1.01] transition-all duration-200 group`}
                >
                  {/* Subtle Card Background Pattern */}
                  <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/5 rounded-full pointer-events-none blur-xl" />

                  {/* Top Bar: Bank Logo & Chip */}
                  <div className="flex items-center justify-between mb-4">
                    {/* EMV Chip & Contactless */}
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-6 rounded-md bg-gradient-to-tr ${style.chip} shadow-inner border border-white/20 flex items-center justify-center`}>
                        <div className="w-6 h-4 border border-black/30 rounded-xs grid grid-cols-2 gap-0.5 opacity-60" />
                      </div>
                      <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 19a8.5 8.5 0 0 1 0-14" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-bold text-white text-xs tracking-tight">
                        {style.logoText}
                      </span>
                      {acc.smsEnabled && (
                        <span className="text-[9px] text-emerald-300 font-medium flex items-center gap-1 justify-end">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          پیامک فعال
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="mb-3 text-center" dir="ltr">
                    <span className="font-mono text-base font-semibold tracking-[0.25em] text-slate-100 drop-shadow-sm">
                      {isCard && acc.cardNumber ? acc.cardNumber : 'نقدی و تنخواه گردان'}
                    </span>
                  </div>

                  {/* Bottom: Name & Balance */}
                  <div className="flex items-end justify-between pt-2 border-t border-white/10">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-white/60">نام حساب / صاحب کارت</span>
                      <span className="font-bold text-white text-xs mt-0.5">
                        {acc.name || acc.bankName || 'کارت روزمره'}
                      </span>
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-white/60">موجودی فعلی</span>
                      <span className="font-black text-sm text-white drop-shadow-xs">
                        {formatToman(acc.currentBalance || acc.initialBalance || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VAULT TAB */}
      {activeAssetTab === 'vault' && (
        <div className="space-y-3 flex-1">
          {/* Header & Trigger */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-white">سبد دارایی‌های محافظ در برابر تورم</span>
            <button
              onClick={() => setIsAssetValuationOpen(true)}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>ویرایش مقادیر</span>
            </button>
          </div>

          {/* 4 Asset Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* 18k Gold */}
            <div className="bg-[#1b2230] border border-[#2b364a] hover:border-amber-500/40 rounded-2xl p-3 space-y-1.5 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  Au
                </span>
                <span className="text-[10px] text-slate-400">{portfolio?.goldGrams || 0} گرم</span>
              </div>
              <div className="font-bold text-white text-xs">طلای ۱۸ عیار</div>
              <div className="font-black text-amber-300 text-sm">
                {formatToman(goldValue)}
              </div>
              <div className="text-[9px] text-slate-400">
                نرخ: {formatToman(marketPrices?.gold18k || 4680000)} / گ
              </div>
            </div>

            {/* Emami Gold Coin */}
            <div className="bg-[#1b2230] border border-[#2b364a] hover:border-amber-500/40 rounded-2xl p-3 space-y-1.5 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="w-7 h-7 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
                  🪙
                </span>
                <span className="text-[10px] text-slate-400">{portfolio?.sekehCount || 0} عدد</span>
              </div>
              <div className="font-bold text-white text-xs">سکه تمام امامی</div>
              <div className="font-black text-amber-300 text-sm">
                {formatToman(sekehValue)}
              </div>
              <div className="text-[9px] text-slate-400">
                نرخ: {formatToman(marketPrices?.sekehEmami || 54200000)}
              </div>
            </div>

            {/* Tether USDT */}
            <div className="bg-[#1b2230] border border-[#2b364a] hover:border-cyan-500/40 rounded-2xl p-3 space-y-1.5 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  ₮
                </span>
                <span className="text-[10px] text-slate-400">{portfolio?.tetherAmount || 0} USDT</span>
              </div>
              <div className="font-bold text-white text-xs">تتر (دلار دیجیتال)</div>
              <div className="font-black text-cyan-300 text-sm">
                {formatToman(tetherValue)}
              </div>
              <div className="text-[9px] text-slate-400">
                نرخ: {formatToman(marketPrices?.tetherUsdt || 69400)}
              </div>
            </div>

            {/* Pure Silver */}
            <div className="bg-[#1b2230] border border-[#2b364a] hover:border-slate-400/40 rounded-2xl p-3 space-y-1.5 transition-all">
              <div className="flex items-center justify-between text-xs">
                <span className="w-7 h-7 rounded-lg bg-slate-400/20 text-slate-300 flex items-center justify-center font-bold">
                  Ag
                </span>
                <span className="text-[10px] text-slate-400">{portfolio?.silverGrams || 0} گرم</span>
              </div>
              <div className="font-bold text-white text-xs">نقره ساچمه / شمش</div>
              <div className="font-black text-slate-200 text-sm">
                {formatToman(silverValue)}
              </div>
              <div className="text-[9px] text-slate-400">
                نرخ: {formatToman(marketPrices?.silverGram || 74000)} / گ
              </div>
            </div>
          </div>

          {/* Vault Banner Info */}
          <div className="bg-[#171e2c] border border-[#252f44] rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex flex-col text-right">
              <span className="font-bold text-white">ارزش کل صندوق سرمایه</span>
              <span className="text-[10px] text-slate-400 mt-0.5">محافظت در برابر تورم و کاهش ارزش ریال</span>
            </div>
            <span className="font-black text-amber-400 text-sm">
              {formatToman(totalVaultValue)}
            </span>
          </div>
        </div>
      )}

      {/* 3. ALLOCATION TAB */}
      {activeAssetTab === 'allocation' && (
        <div className="space-y-3.5 flex-1">
          <div className="bg-[#1b2230] border border-[#2b364a] rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-white block text-right">
              سهم کلاس‌های دارایی از کل ثروت
            </span>

            {/* Visual Segments Bar */}
            <div className="w-full h-3.5 rounded-full bg-[#111622] overflow-hidden flex shadow-inner">
              <div style={{ width: `${bankPercent}%` }} className="bg-blue-500 h-full transition-all" title={`نقد و بانک: ${bankPercent}%`} />
              <div style={{ width: `${goldPercent}%` }} className="bg-amber-400 h-full transition-all" title={`طلا و سکه: ${goldPercent}%`} />
              <div style={{ width: `${cryptoPercent}%` }} className="bg-cyan-400 h-full transition-all" title={`تتر: ${cryptoPercent}%`} />
              <div style={{ width: `${silverPercent}%` }} className="bg-slate-300 h-full transition-all" title={`نقره: ${silverPercent}%`} />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-slate-300">سپرده و نقد ({bankPercent}٪)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-slate-300">طلا و سکه ({goldPercent}٪)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="text-slate-300">ارز دیجیتال ({cryptoPercent}٪)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                <span className="text-slate-300">نقره ({silverPercent}٪)</span>
              </div>
            </div>
          </div>

          {/* AI Risk Score Analysis Card */}
          <div className="bg-gradient-to-br from-[#1a2333] to-[#121824] border border-[#2c374d] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                تحلیل تنوع دارایی هوش مالی جیب‌یار
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                متوازن و پایدار
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed text-right">
              سبد دارایی شما دارای نقدینگی مناسب در کنار پوشش تورمی مطلوب طلا و تتر است. پیشنهاد می‌شود سهم ریال نقد را کمتر از ۴۰٪ نگه دارید.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
