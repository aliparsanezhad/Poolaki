import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Receipt,
  Search,
  AlertCircle,
  Database,
  Crown,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Coins,
  Camera,
  Users,
  MessageSquare
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import JeebYarLogo from './JeebYarLogo';
import FinancialHealthCard from './FinancialHealthCard';

export default function HomeView() {
  const {
    transactions,
    accounts,
    deleteTransaction,
    subscription,
    setIsSubscriptionModalOpen,
    setIsDataManagementOpen,
    setIsNewTxModalOpen,
    setIsBatchSmsOpen,
    pendingSmsList
  } = usePoolaki();

  const [filterType, setFilterType] = useState('all'); // 'all', 'expense', 'income', 'uncategorized'
  const [searchQuery, setSearchQuery] = useState('');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  // Calculate balances
  const totalBalance = accounts.reduce(
    (acc, a) => acc + (a.currentBalance || a.initialBalance || 0),
    0
  );

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  // Uncategorized count
  const uncategorizedTxs = transactions.filter(
    (t) => t.categoryName === 'تعیین‌نشده' || t.categoryId === 'uncategorized'
  );

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'expense' && tx.type !== 'expense') return false;
    if (filterType === 'income' && tx.type !== 'income') return false;
    if (filterType === 'uncategorized') {
      const isUncat = tx.categoryName === 'تعیین‌نشده' || tx.categoryId === 'uncategorized';
      if (!isUncat) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (tx.title || '').toLowerCase().includes(q);
      const matchCat = (tx.categoryName || '').toLowerCase().includes(q);
      const matchAcc = (tx.accountName || '').toLowerCase().includes(q);
      const matchAmount = (tx.amount || 0).toString().includes(q);
      return matchTitle || matchCat || matchAcc || matchAmount;
    }
    return true;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((acc, tx) => {
    const dateKey = tx.date || 'نامشخص';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(tx);
    return acc;
  }, {});

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-3.5 select-none font-vazir">
      {/* Top Brand Header */}
      <div className="flex items-center justify-between bg-[#171e2c] border border-[#273248] rounded-2xl px-3.5 py-2.5 shadow-sm">
        <JeebYarLogo isPro={subscription.isPro} />

        <div className="flex items-center gap-1.5">
          {/* Subscription Pro Badge */}
          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-300/10 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-black transition-all cursor-pointer shadow-xs"
            title="مدیریت اشتراک جیب‌یار PRO"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{subscription.isPro ? 'طرح PRO' : 'ارتقا'}</span>
          </button>

          <button
            onClick={() => setIsDataManagementOpen(true)}
            className="p-2 rounded-xl bg-[#232b3b] hover:bg-[#2d374b] text-slate-300 border border-[#333e54] transition-colors cursor-pointer"
            title="پشتیبان‌گیری PLK و تنظیمات"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Overview Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1b2436] via-[#141b29] to-[#0f141f] border border-[#2a364d] rounded-3xl p-4 shadow-xl">
        <div className="absolute top-0 left-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-slate-400 text-xs mb-1.5">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <Wallet className="w-4 h-4 text-emerald-400" />
            موجودی کل حساب‌ها و کارت‌ها
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isBalanceHidden ? 'نمایش موجودی' : 'مخفی‌سازی موجودی'}
            >
              {isBalanceHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">
              اردیبهشت ۱۴۰۵
            </span>
          </div>
        </div>

        <div className="relative z-10 text-2xl font-black text-white tracking-wide mb-3 font-vazir">
          {isBalanceHidden ? '••••••••••' : formatToman(totalBalance)}
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-2 pt-2 border-t border-[#253045] text-xs">
          <div className="flex items-center justify-between bg-[#151b27]/80 rounded-xl px-2.5 py-1.5 border border-[#232c3f]">
            <span className="text-rose-400 flex items-center gap-1 text-[11px] font-bold">
              <TrendingDown className="w-3 h-3" />
              مجموع خرج:
            </span>
            <span className="font-bold text-slate-200 text-[11px] font-vazir">
              {isBalanceHidden ? '••••••' : formatToman(totalExpense)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#151b27]/80 rounded-xl px-2.5 py-1.5 border border-[#232c3f]">
            <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
              <TrendingUp className="w-3 h-3" />
              مجموع دخل:
            </span>
            <span className="font-bold text-slate-200 text-[11px] font-vazir">
              {isBalanceHidden ? '••••••' : formatToman(totalIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* AI Financial Health Score Card */}
      <FinancialHealthCard />

      {/* Pending Unread SMS Queue Pill (Batch SMS trigger) */}
      {pendingSmsList && pendingSmsList.length > 0 && (
        <div
          onClick={() => setIsBatchSmsOpen(true)}
          className="bg-indigo-950/40 border border-indigo-500/40 hover:border-indigo-400 rounded-2xl p-3 flex items-center justify-between text-xs cursor-pointer transition-all shadow-sm group"
        >
          <span className="text-[10px] font-bold text-indigo-300 underline group-hover:text-white">
            بررسی و ثبت همه ({pendingSmsList.length} پیامک)
          </span>
          <div className="flex items-center gap-2 text-right">
            <span className="text-[11px] text-indigo-200 font-semibold">
              پیامک‌های انباشته بانک (آماده ثبت دسته‌جمعی)
            </span>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
          </div>
        </div>
      )}

      {/* Uncategorized Transactions Alert Banner */}
      {uncategorizedTxs.length > 0 && (
        <div
          onClick={() => setFilterType(filterType === 'uncategorized' ? 'all' : 'uncategorized')}
          className="bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between text-xs cursor-pointer transition-colors shadow-sm"
        >
          <span className="text-[10px] font-bold text-amber-300 underline">
            مشاهده ({uncategorizedTxs.length})
          </span>
          <div className="flex items-center gap-2 text-right">
            <span className="text-[11px] text-amber-200 font-semibold">
              تراکنش‌های بدون دسته‌بندی (تعیین‌نشده)
            </span>
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
        </div>
      )}

      {/* Recent Transactions Feed */}
      <div className="bg-[#171e2c] border border-[#273248] rounded-3xl p-4 shadow-sm flex-1 flex flex-col space-y-3">
        {/* Header & Filter Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-[#253045]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#222a3b] text-slate-400 hover:text-white'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#222a3b] text-slate-400 hover:text-white'
              }`}
            >
              خرج
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#222a3b] text-slate-400 hover:text-white'
              }`}
            >
              دخل
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-white font-bold text-xs">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>تراکنش‌های اخیر</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#121722] border border-[#232d3f] rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس عنوان، دسته‌بندی یا مبلغ..."
            className="bg-transparent text-right text-xs text-white placeholder-slate-500 outline-none flex-1 font-vazir"
          />
          <Search className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Grouped Transactions List */}
        <div className="space-y-3 flex-1 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs space-y-2">
              <p>تراکنشی یافت نشد</p>
              <button
                onClick={() => setIsNewTxModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                ثبت تراکنش جدید
              </button>
            </div>
          ) : (
            Object.keys(groupedTransactions).map((dateKey) => (
              <div key={dateKey} className="space-y-1.5">
                {/* Date Header Sticky Pill */}
                <div className="text-[10px] font-bold text-slate-400 px-1 py-0.5 bg-[#141b27]/60 rounded-md inline-block">
                  {dateKey}
                </div>

                <div className="space-y-1">
                  {groupedTransactions[dateKey].map((tx) => {
                    const isExpense = tx.type === 'expense';
                    const isUncategorized =
                      tx.categoryName === 'تعیین‌نشده' || tx.categoryId === 'uncategorized';

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between py-2 border-b border-[#212b3e]/60 last:border-0 hover:bg-[#20293b]/50 px-1.5 rounded-xl transition-colors group"
                      >
                        {/* Left: Amount in RTL */}
                        <div className="text-left flex flex-col items-start">
                          <span
                            className={`font-black text-sm font-vazir ${
                              isExpense ? 'text-slate-100' : 'text-emerald-400'
                            }`}
                          >
                            {isExpense ? '- ' : '+ '}
                            {formatToman(tx.amount)}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {tx.accountName || 'کارت'}
                          </span>
                        </div>

                        {/* Right: Title, Category & Icon */}
                        <div className="flex items-center gap-2.5">
                          <div className="flex flex-col text-right">
                            <span className="font-bold text-slate-100 text-xs">
                              {tx.title}
                            </span>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                              <span
                                className={`text-[10px] ${
                                  isUncategorized
                                    ? 'text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded-md border border-amber-800/40'
                                    : 'text-slate-400'
                                }`}
                              >
                                {tx.categoryName}
                              </span>
                            </div>
                          </div>

                          <div className="w-9 h-9 rounded-xl bg-[#20293a] flex items-center justify-center text-slate-300 border border-[#2f3b52] shrink-0">
                            <CategoryIcon
                              name={isUncategorized ? 'HelpCircle' : tx.icon}
                              className={`w-4 h-4 ${isUncategorized ? 'text-amber-400' : 'text-amber-300'}`}
                            />
                          </div>

                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all ml-0.5 cursor-pointer"
                            title="حذف تراکنش"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
