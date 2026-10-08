import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import { BarChart2, PieChart, TrendingDown, Calendar, Filter } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function ReportsView() {
  const { transactions, categories } = usePoolaki();
  const [period, setPeriod] = useState('month'); // month, year

  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((acc, t) => acc + (t.amount || 0), 0);

  // Group by category
  const categoryStats = {};
  expenses.forEach((t) => {
    const key = t.categoryName || 'متفرقه';
    if (!categoryStats[key]) {
      const catObj = categories.find((c) => c.name === key);
      categoryStats[key] = {
        name: key,
        amount: 0,
        count: 0,
        color: catObj?.color || '#3b82f6',
        icon: t.icon || catObj?.icon || 'Tag'
      };
    }
    categoryStats[key].amount += t.amount;
    categoryStats[key].count += 1;
  });

  const sortedCategories = Object.values(categoryStats).sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-4">
      {/* Period Switcher */}
      <div className="flex items-center bg-[#222838] rounded-2xl p-1 border border-[#2f384d]">
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            period === 'month' ? 'bg-[#5b75f8] text-white shadow-sm' : 'text-slate-400'
          }`}
        >
          اردیبهشت ۱۴۰۵
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            period === 'year' ? 'bg-[#5b75f8] text-white shadow-sm' : 'text-slate-400'
          }`}
        >
          کل سال ۱۴۰۵
        </button>
      </div>

      {/* Total Expense Summary Card */}
      <div className="bg-gradient-to-br from-[#273043] to-[#202636] border border-[#323d54] rounded-2xl p-4 shadow-md text-center">
        <span className="text-xs text-slate-400 block mb-1">مجموع کل هزینه‌ها</span>
        <div className="text-2xl font-bold text-white tracking-wide mb-1">
          {formatToman(totalExpense)}
        </div>
        <span className="text-[11px] text-slate-400">
          تعداد {expenses.length} تراکنش ثبت شده
        </span>
      </div>

      {/* Visual Percentage Bar */}
      {totalExpense > 0 && (
        <div className="bg-[#212735] border border-[#2b3345] rounded-2xl p-4 shadow-sm space-y-3">
          <span className="text-xs font-bold text-white block text-right">
            ترکیب مخارج بر اساس دسته‌بندی
          </span>
          <div className="w-full h-3 rounded-full bg-[#1b202c] overflow-hidden flex">
            {sortedCategories.map((cat, idx) => {
              const percent = Math.round((cat.amount / totalExpense) * 100);
              return (
                <div
                  key={idx}
                  style={{ width: `${percent}%`, backgroundColor: cat.color }}
                  title={`${cat.name}: ${percent}%`}
                  className="h-full transition-all"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Category Breakdown List */}
      <div className="bg-[#212735] border border-[#2b3345] rounded-2xl p-4 shadow-sm flex-1 flex flex-col space-y-3">
        <span className="text-xs font-bold text-white block text-right pb-2 border-b border-[#2d364a]">
          ریز تفکیک دسته‌بندی‌ها
        </span>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {sortedCategories.map((cat, idx) => {
            const percent = totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">({percent}٪)</span>
                    <span className="font-bold text-slate-200">{formatToman(cat.amount)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">{cat.name}</span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}22` }}
                    >
                      <CategoryIcon name={cat.icon} color={cat.color} className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#191f2c] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
