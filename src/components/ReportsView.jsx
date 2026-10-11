import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  BarChart3,
  PieChart,
  TrendingDown,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function ReportsView() {
  const { transactions, categories, showToast } = usePoolaki();
  const [period, setPeriod] = useState('month'); // 'month' | 'quarter' | 'year'
  const [reportType, setReportType] = useState('categories'); // 'categories' | 'cashflow'

  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');

  const totalExpense = expenses.reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalIncome = incomes.reduce((acc, t) => acc + (t.amount || 0), 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  // Group expenses by category
  const categoryStats = {};
  expenses.forEach((t) => {
    const key = t.categoryName || 'تعیین‌نشده';
    if (!categoryStats[key]) {
      const catObj = categories.find((c) => c.name === key);
      categoryStats[key] = {
        name: key,
        amount: 0,
        count: 0,
        color: catObj?.color || '#64748b',
        icon: t.icon || catObj?.icon || 'HelpCircle'
      };
    }
    categoryStats[key].amount += t.amount;
    categoryStats[key].count += 1;
  });

  const sortedCategories = Object.values(categoryStats).sort((a, b) => b.amount - a.amount);
  const topExpense = sortedCategories[0];

  // Weekly breakdown simulation for chart
  const weeklyData = [
    { label: 'هفته ۱', expense: Math.round(totalExpense * 0.22), income: Math.round(totalIncome * 0.5) },
    { label: 'هفته ۲', expense: Math.round(totalExpense * 0.35), income: Math.round(totalIncome * 0.15) },
    { label: 'هفته ۳', expense: Math.round(totalExpense * 0.28), income: Math.round(totalIncome * 0.25) },
    { label: 'هفته ۴', expense: Math.round(totalExpense * 0.15), income: Math.round(totalIncome * 0.1) }
  ];

  const maxWeeklyAmount = Math.max(
    ...weeklyData.map((d) => Math.max(d.expense, d.income)),
    1000000
  );

  const handleExport = (type) => {
    showToast(`گزارش مالی ${type === 'excel' ? 'اکسل' : 'PDF'} با موفقیت آماده شد`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-3.5 select-none font-vazir">
      {/* Period Switcher */}
      <div className="flex items-center bg-[#151a26] rounded-2xl p-1 border border-[#232c3f]">
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'month'
              ? 'bg-[#222a3d] text-white shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          اردیبهشت ۱۴۰۵
        </button>
        <button
          onClick={() => setPeriod('quarter')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'quarter'
              ? 'bg-[#222a3d] text-white shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ۳ ماهه بهار
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            period === 'year'
              ? 'bg-[#222a3d] text-white shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          سال ۱۴۰۵
        </button>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Income Card */}
        <div className="bg-gradient-to-br from-[#12261e] to-[#0f1d18] border border-emerald-500/25 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>مجموع درآمد</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-black text-white">
            {formatToman(totalIncome)}
          </div>
          <span className="text-[10px] text-emerald-400/80 block">
            {incomes.length} واریزی ثبت شده
          </span>
        </div>

        {/* Expense Card */}
        <div className="bg-gradient-to-br from-[#2a171c] to-[#1e1014] border border-rose-500/25 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs text-rose-400 font-bold">
            <span>مجموع هزینه‌ها</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-base font-black text-white">
            {formatToman(totalExpense)}
          </div>
          <span className="text-[10px] text-rose-400/80 block">
            {expenses.length} تراکنش خروجی
          </span>
        </div>
      </div>

      {/* Net Balance & Savings Rate Card */}
      <div className="bg-[#181f2c] border border-[#273247] rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs">
            {savingsRate}٪
          </div>
          <div className="flex flex-col text-right">
            <span className="font-bold text-white text-xs">نرخ پس‌انداز ماهانه</span>
            <span className="text-[10px] text-slate-400">تراز مثبت ماه: {formatToman(netSavings)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleExport('excel')}
            className="p-2 rounded-xl bg-[#232b3b] hover:bg-[#2e374b] text-slate-300 border border-[#343f55] transition-colors cursor-pointer"
            title="خروجی فایل اکسل"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="p-2 rounded-xl bg-[#232b3b] hover:bg-[#2e374b] text-slate-300 border border-[#343f55] transition-colors cursor-pointer"
            title="دانلود گزارش PDF"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Sub Tabs: Categories vs Cashflow Chart */}
      <div className="flex items-center bg-[#151a26] p-1 rounded-2xl border border-[#232c3f]">
        <button
          onClick={() => setReportType('categories')}
          className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            reportType === 'categories'
              ? 'bg-[#222a3d] text-white shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>تفکیک دسته‌ها</span>
        </button>

        <button
          onClick={() => setReportType('cashflow')}
          className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            reportType === 'cashflow'
              ? 'bg-[#222a3d] text-white shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>جریان نقدینگی هفتگی</span>
        </button>
      </div>

      {/* 1. CATEGORIES VIEW */}
      {reportType === 'categories' && (
        <div className="space-y-3 flex-1">
          {/* Visual Percentage Bar */}
          {totalExpense > 0 && (
            <div className="bg-[#181f2c] border border-[#273247] rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">ترکیب هزینه‌ها</span>
                {topExpense && (
                  <span className="text-[10px] text-slate-400">
                    بیشترین: <strong className="text-white">{topExpense.name}</strong>
                  </span>
                )}
              </div>

              <div className="w-full h-3 rounded-full bg-[#121620] overflow-hidden flex shadow-inner">
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

          {/* Category Breakdown Cards */}
          <div className="space-y-2.5">
            {sortedCategories.map((cat, idx) => {
              const percent = totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0;
              const avgAmount = cat.count > 0 ? Math.round(cat.amount / cat.count) : cat.amount;

              return (
                <div
                  key={idx}
                  className="bg-[#181f2c] border border-[#273247] hover:border-[#384661] rounded-2xl p-3 space-y-2 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400">({percent}٪)</span>
                      <span className="font-black text-slate-100 text-sm">
                        {formatToman(cat.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col text-right">
                        <span className="font-bold text-white text-xs">{cat.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {cat.count} تراکنش • میانگین: {formatToman(avgAmount)}
                        </span>
                      </div>

                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                        style={{ backgroundColor: `${cat.color}22` }}
                      >
                        <CategoryIcon name={cat.icon} color={cat.color} className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Horizontal progress */}
                  <div className="w-full h-1.5 rounded-full bg-[#121620] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. WEEKLY CASHFLOW BAR CHART */}
      {reportType === 'cashflow' && (
        <div className="space-y-3 flex-1">
          <div className="bg-[#181f2c] border border-[#273247] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">مقایسه ورود و خروج پول در ۴ هفته ماه</span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  درآمد
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  هزینه
                </span>
              </div>
            </div>

            {/* Vertical Bar Chart Container */}
            <div className="h-44 pt-4 flex items-end justify-around gap-3 border-b border-[#283348] pb-2">
              {weeklyData.map((d, i) => {
                const incomeHeight = Math.max(12, Math.round((d.income / maxWeeklyAmount) * 140));
                const expenseHeight = Math.max(12, Math.round((d.expense / maxWeeklyAmount) * 140));

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="flex items-end gap-1.5 w-full justify-center h-full">
                      {/* Income Bar */}
                      <div
                        style={{ height: `${incomeHeight}px` }}
                        className="w-3.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all shadow-sm"
                        title={`درآمد: ${formatToman(d.income)}`}
                      />

                      {/* Expense Bar */}
                      <div
                        style={{ height: `${expenseHeight}px` }}
                        className="w-3.5 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all shadow-sm"
                        title={`هزینه: ${formatToman(d.expense)}`}
                      />
                    </div>

                    <span className="text-[10px] text-slate-400 font-bold">{d.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed text-right">
              بیشترین بار هزینه‌ای شما در هفته دوم رخ داده است (۳۵٪ از کل ماه)، در حالی که ۵۰٪ دریافتی در هفته اول محقق گردید.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
