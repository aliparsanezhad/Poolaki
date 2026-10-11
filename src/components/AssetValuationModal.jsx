import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman, toPersianDigits } from '../utils/persianNumbers';
import { Coins, X, TrendingUp, DollarSign, Sparkles, RefreshCw, Check } from 'lucide-react';

export default function AssetValuationModal() {
  const {
    isAssetValuationOpen,
    setIsAssetValuationOpen,
    portfolio,
    marketPrices,
    updatePortfolio,
    showToast
  } = usePoolaki();

  const [goldGrams, setGoldGrams] = useState(portfolio.goldGrams);
  const [tetherAmount, setTetherAmount] = useState(portfolio.tetherAmount);
  const [silverGrams, setSilverGrams] = useState(portfolio.silverGrams);
  const [sekehCount, setSekehCount] = useState(portfolio.sekehCount);

  if (!isAssetValuationOpen) return null;

  // Real-time valuation calculations
  const goldValue = Math.round(goldGrams * marketPrices.gold18k);
  const tetherValue = Math.round(tetherAmount * marketPrices.tetherUsdt);
  const silverValue = Math.round(silverGrams * marketPrices.silverGram);
  const sekehValue = Math.round(sekehCount * marketPrices.sekehEmami);

  const totalPortfolioValue = goldValue + tetherValue + silverValue + sekehValue;

  const handleSave = () => {
    updatePortfolio({
      goldGrams: Number(goldGrams) || 0,
      tetherAmount: Number(tetherAmount) || 0,
      silverGrams: Number(silverGrams) || 0,
      sekehCount: Number(sekehCount) || 0
    });
    setIsAssetValuationOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#1e2536] border border-amber-500/30 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d384c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">ارزش‌گذاری لحظه‌ای طلا و ارز</span>
              <span className="text-[10px] text-slate-400">محاسبه خالص ارزش دارایی با نرخ زنده بازار</span>
            </div>
          </div>

          <button
            onClick={() => setIsAssetValuationOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Portfolio Value Banner */}
        <div className="bg-gradient-to-br from-amber-950/40 via-[#273248] to-[#1a2130] border border-amber-500/30 rounded-2xl p-4 my-3 text-center shadow-lg">
          <span className="text-xs text-amber-300 font-semibold block mb-1">
            مجموع ارزش سبد طلا، سکه و رمزارز
          </span>
          <div className="text-2xl font-black text-white tracking-wide font-vazir mb-1">
            {formatToman(totalPortfolioValue)}
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center justify-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            محافظت شده در برابر تورم ریالی
          </span>
        </div>

        {/* Assets Inputs */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {/* Gold 18k */}
          <div className="bg-[#171d2b] border border-[#2b364c] rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold text-[11px]" dir="ltr">
                {formatToman(marketPrices.gold18k)} / گرم
              </span>
              <span className="font-bold text-white">طلای ۱۸ عیار</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">گرم</span>
              <input
                type="number"
                step="0.1"
                value={goldGrams}
                onChange={(e) => setGoldGrams(e.target.value)}
                className="flex-1 bg-[#222b3e] text-white text-sm font-bold px-3 py-2 rounded-xl outline-none text-right font-vazir"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-[#222b3e]">
              <span>ارزش کل: {formatToman(goldValue)}</span>
              <span>{goldGrams} گرم</span>
            </div>
          </div>

          {/* Sekeh Emami */}
          <div className="bg-[#171d2b] border border-[#2b364c] rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold text-[11px]" dir="ltr">
                {formatToman(marketPrices.sekehEmami)} / عدد
              </span>
              <span className="font-bold text-white">سکه تمام بهار آزادی (امامی)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">عدد</span>
              <input
                type="number"
                step="1"
                value={sekehCount}
                onChange={(e) => setSekehCount(e.target.value)}
                className="flex-1 bg-[#222b3e] text-white text-sm font-bold px-3 py-2 rounded-xl outline-none text-right font-vazir"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-[#222b3e]">
              <span>ارزش کل: {formatToman(sekehValue)}</span>
              <span>{sekehCount} عدد سکه</span>
            </div>
          </div>

          {/* Tether USDT */}
          <div className="bg-[#171d2b] border border-[#2b364c] rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold text-[11px]" dir="ltr">
                {formatToman(marketPrices.tetherUsdt)} / USDT
              </span>
              <span className="font-bold text-white">تتر (USDT / دلار کریپتو)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">USDT</span>
              <input
                type="number"
                step="1"
                value={tetherAmount}
                onChange={(e) => setTetherAmount(e.target.value)}
                className="flex-1 bg-[#222b3e] text-white text-sm font-bold px-3 py-2 rounded-xl outline-none text-right font-vazir"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-[#222b3e]">
              <span>ارزش کل: {formatToman(tetherValue)}</span>
              <span>{tetherAmount} تتر</span>
            </div>
          </div>

          {/* Silver */}
          <div className="bg-[#171d2b] border border-[#2b364c] rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-bold text-[11px]" dir="ltr">
                {formatToman(marketPrices.silverGram)} / گرم
              </span>
              <span className="font-bold text-white">نقره و خرجکار</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">گرم</span>
              <input
                type="number"
                step="1"
                value={silverGrams}
                onChange={(e) => setSilverGrams(e.target.value)}
                className="flex-1 bg-[#222b3e] text-white text-sm font-bold px-3 py-2 rounded-xl outline-none text-right font-vazir"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-[#222b3e]">
              <span>ارزش کل: {formatToman(silverValue)}</span>
              <span>{silverGrams} گرم</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-[#10b981] hover:bg-[#059669] active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer text-xs mt-3"
        >
          <Check className="w-4 h-4" />
          <span>ذخیره و ثبت در محاسبات دارایی</span>
        </button>
      </div>
    </div>
  );
}
