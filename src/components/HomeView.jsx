import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  Receipt,
  ChevronLeft,
  Plus,
  Trash2,
  Database,
  Tag,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  Wallet,
  Crown,
  Search,
  AlertCircle,
  HelpCircle,
  Filter
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import JeebYarLogo from './JeebYarLogo';
import FinancialHealthCard from './FinancialHealthCard';

export default function HomeView() {
  const {
    transactions,
    deleteTransaction,
    setIsNewTxModalOpen,
    setIsCategoryManagerOpen,
    setIsDataManagementOpen,
    setIsSmsSimulatorOpen,
    setIsSubscriptionModalOpen,
    setIsCategoryPickerOpen,
    setCategoryPickerCallback,
    subscription,
    accounts,
    showToast
  } = usePoolaki();

  const [filterType, setFilterType] = useState('all'); // all, expense, income, uncategorized
  const [searchQuery, setSearchQuery] = useState('');

  // Uncategorized transactions count
  const uncategorizedTxs = transactions.filter(
    (t) => t.categoryName === 'تعیین‌نشده' || t.categoryId === 'uncategorized'
  );

  // Calculate totals
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const totalBalance = accounts.reduce(
    (acc, a) => acc + (a.currentBalance || a.initialBalance || 0),
    0
  );

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'expense' && t.type !== 'expense') return false;
    if (filterType === 'income' && t.type !== 'income') return false;
    if (filterType === 'uncategorized' && t.categoryName !== 'تعیین‌نشده' && t.categoryId !== 'uncategorized') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchCat = t.categoryName?.toLowerCase().includes(q);
      const matchAccount = t.accountName?.toLowerCase().includes(q);
      return matchTitle || matchCat || matchAccount;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-4 select-none">
      {/* Top Brand Header */}
      <div className="flex items-center justify-between bg-[#1f2738] border border-[#2e3a50] rounded-2xl px-3.5 py-2.5 shadow-sm">
        <JeebYarLogo isPro={subscription.isPro} />

        <div className="flex items-center gap-1.5">
          {/* Subscription Pro Badge / Trigger */}
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
            className="p-2 rounded-xl bg-[#2a3448] hover:bg-[#36435c] text-slate-300 transition-colors"
            title="مدیریت داده‌ها و پشتیبان‌گیری"
          >
            <Database className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Overview Balance Card */}
      <div className="bg-gradient-to-br from-[#273248] via-[#20283a] to-[#182030] border border-[#35435e] rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <Wallet className="w-3.5 h-3.5 text-blue-400" />
            موجودی کل حساب‌ها و کارت‌ها
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">
            اردیبهشت ۱۴۰۵
          </span>
        </div>
        <div className="text-2xl font-black text-white tracking-wide mb-3 font-vazir">
          {formatToman(totalBalance)}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#313e56] text-xs">
          <div className="flex items-center justify-between bg-[#151c28]/70 rounded-xl px-2.5 py-1.5 border border-[#263348]">
            <span className="text-rose-400 flex items-center gap-1 text-[11px] font-bold">
              <TrendingDown className="w-3 h-3" />
              مجموع خرج:
            </span>
            <span className="font-semibold text-slate-200 text-[11px] font-vazir">
              {formatToman(totalExpense)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#151c28]/70 rounded-xl px-2.5 py-1.5 border border-[#263348]">
            <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
              <TrendingUp className="w-3 h-3" />
              مجموع دخل:
            </span>
            <span className="font-semibold text-slate-200 text-[11px] font-vazir">
              {formatToman(totalIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* AI Financial Health & Super-Features Card */}
      <FinancialHealthCard />

      {/* Uncategorized Transactions Alert Banner matching update release notes */}
      {uncategorizedTxs.length > 0 && (
        <div
          onClick={() => setFilterType(filterType === 'uncategorized' ? 'all' : 'uncategorized')}
          className="bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 rounded-2xl p-3 flex items-center justify-between text-xs cursor-pointer transition-colors shadow-sm"
        >
          <span className="text-[10px] font-bold text-amber-300 underline">
            مشاهده و دسته‌بندی ({uncategorizedTxs.length})
          </span>
          <div className="flex items-center gap-2 text-right">
            <span className="text-[11px] text-amber-200 font-semibold">
              تراکنش‌های ثبت‌شده از پیامک بدون دسته‌بندی
            </span>
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
        </div>
      )}

      {/* Recent Transactions Feed */}
      <div className="bg-[#1f2738] border border-[#2c374d] rounded-3xl p-4 shadow-sm flex-1 flex flex-col space-y-3">
        {/* Header & Filter Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-[#2d384c]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#6179fb] text-white'
                  : 'bg-[#283246] text-slate-400 hover:text-white'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#283246] text-slate-400 hover:text-white'
              }`}
            >
              خرج
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                filterType === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#283246] text-slate-400 hover:text-white'
              }`}
            >
              دخل
            </button>
          </div>

          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Receipt className="w-4 h-4 text-slate-300" />
            <span>تراکنش‌های اخیر</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#171d2b] border border-[#2a364a] rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در بین تراکنش‌ها..."
            className="bg-transparent text-right text-xs text-white placeholder-slate-500 outline-none flex-1 font-vazir"
          />
          <Search className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Transactions List */}
        <div className="space-y-2.5 flex-1 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              تراکنشی با این مشخصات یافت نشد
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isExpense = tx.type === 'expense';
              const isUncategorized = tx.categoryName === 'تعیین‌نشده' || tx.categoryId === 'uncategorized';

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-[#293448]/60 last:border-0 hover:bg-[#283348]/50 px-1 rounded-xl transition-colors group"
                >
                  {/* Left (Amount & Date in RTL) */}
                  <div className="text-left flex flex-col items-start">
                    <span
                      className={`font-black text-sm font-vazir ${
                        isExpense ? 'text-slate-100' : 'text-emerald-400'
                      }`}
                    >
                      {isExpense ? '- ' : '+ '}
                      {formatToman(tx.amount)}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {tx.date}
                    </span>
                  </div>

                  {/* Right (Title & Category with Icon) */}
                  <div className="flex items-center gap-3">
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
                          {tx.categoryName || tx.accountName}
                        </span>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#283348] flex items-center justify-center text-slate-300 border border-[#37445e] shrink-0">
                      <CategoryIcon
                        name={isUncategorized ? 'HelpCircle' : tx.icon}
                        className={`w-5 h-5 ${isUncategorized ? 'text-amber-400' : 'text-amber-300'}`}
                      />
                    </div>

                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all ml-1 cursor-pointer"
                      title="حذف تراکنش"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
