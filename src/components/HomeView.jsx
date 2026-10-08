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
  Settings
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function HomeView() {
  const {
    transactions,
    deleteTransaction,
    setIsNewTxModalOpen,
    setIsCategoryManagerOpen,
    setIsDataManagementOpen,
    setIsSmsSimulatorOpen,
    accounts
  } = usePoolaki();

  const [filterType, setFilterType] = useState('all'); // all, expense, income

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
    if (filterType === 'expense') return t.type === 'expense';
    if (filterType === 'income') return t.type === 'income';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-4">
      {/* Top Banner & Quick Shortcuts */}
      <div className="flex items-center justify-between bg-[#232938] border border-[#2e374b] rounded-2xl px-3.5 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#2e3648] hover:bg-[#384258] text-[11px] font-medium text-slate-200 transition-colors"
            title="مدیریت دسته‌بندی‌ها"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>دسته‌بندی‌ها</span>
          </button>
          <button
            onClick={() => setIsSmsSimulatorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#2e3648] hover:bg-[#384258] text-[11px] font-medium text-slate-200 transition-colors"
            title="تست و شبیه‌ساز پیامک بانک"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>پیامک بانک</span>
          </button>
        </div>

        <button
          onClick={() => setIsDataManagementOpen(true)}
          className="p-1.5 rounded-xl bg-[#2e3648] hover:bg-[#384258] text-slate-300 transition-colors"
          title="مدیریت داده‌ها و پشتیبان‌گیری"
        >
          <Database className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Overview Balance Card */}
      <div className="bg-gradient-to-br from-[#273043] to-[#202636] border border-[#323d54] rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
          <span className="flex items-center gap-1 font-medium">
            <Wallet className="w-3.5 h-3.5 text-blue-400" />
            موجودی کل کارت‌ها و دارایی
          </span>
          <span className="text-[10px] text-slate-400 bg-[#1c2230] px-2 py-0.5 rounded-full">
            اردیبهشت ۱۴۰۵
          </span>
        </div>
        <div className="text-2xl font-bold text-white tracking-wide mb-3">
          {formatToman(totalBalance)}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#313b52] text-xs">
          <div className="flex items-center justify-between bg-[#1b202c]/60 rounded-xl px-2.5 py-1.5">
            <span className="text-rose-400 flex items-center gap-1 text-[11px]">
              <TrendingDown className="w-3 h-3" />
              مجموع خرج:
            </span>
            <span className="font-semibold text-slate-200 text-[11px]">
              {formatToman(totalExpense)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#1b202c]/60 rounded-xl px-2.5 py-1.5">
            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3 h-3" />
              مجموع دخل:
            </span>
            <span className="font-semibold text-slate-200 text-[11px]">
              {formatToman(totalIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section (matching photo_5) */}
      <div className="bg-[#212735] border border-[#2b3345] rounded-2xl p-4 shadow-sm flex-1 flex flex-col">
        {/* Header matching screenshot: "تراکنش‌های اخیر" with icon and "همه >" */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2d364a]">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Receipt className="w-4 h-4 text-slate-300" />
            <span>تراکنش‌های اخیر</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-xs hover:text-white cursor-pointer transition-colors">
            <span>همه</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3 flex-1 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              تراکنشی برای نمایش وجود ندارد
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isExpense = tx.type === 'expense';
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-[#293244]/60 last:border-0 hover:bg-[#283042]/50 px-1 rounded-xl transition-colors group"
                >
                  {/* Left (Amount & Date in RTL) */}
                  <div className="text-left flex flex-col items-start">
                    <span
                      className={`font-bold text-sm ${
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
                      <span className="font-semibold text-slate-100 text-xs">
                        {tx.title}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {tx.categoryName || tx.accountName}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#2a3245] flex items-center justify-center text-slate-300 border border-[#353f57]">
                      <CategoryIcon name={tx.icon} className="w-5 h-5 text-amber-400" />
                    </div>

                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all ml-1"
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
