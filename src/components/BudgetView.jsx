import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  PiggyBank,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingDown,
  Trash2,
  Edit2
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function BudgetView() {
  const { transactions, categories, showToast } = usePoolaki();

  const [budgets, setBudgets] = useState([
    { categoryId: 'food', name: 'خوردنی', limit: 2000000, color: '#e66746', icon: 'UtensilsCrossed' },
    { categoryId: 'telecom', name: 'شارژ و اینترنت', limit: 300000, color: '#f3ad22', icon: 'Smartphone' },
    { categoryId: 'vehicle', name: 'بنزین و خودرو', limit: 1200000, color: '#ea580c', icon: 'Fuel' },
    { categoryId: 'personal-style', name: 'استایل شخصی', limit: 1500000, color: '#22b8a2', icon: 'Shirt' }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'food');
  const [limitInput, setLimitInput] = useState('');

  // Timeline progress: 18th day of 31 days
  const currentDay = 18;
  const totalDays = 31;
  const daysRemaining = totalDays - currentDay;
  const monthProgress = Math.round((currentDay / totalDays) * 100);

  // Calculate spent per budget category
  const calculateSpent = (catName) => {
    return transactions
      .filter((t) => t.type === 'expense' && (t.categoryName === catName || t.categoryId === catName))
      .reduce((acc, t) => acc + (t.amount || 0), 0);
  };

  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + calculateSpent(b.name), 0);
  const overallPercent = totalLimit > 0 ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100) : 0;

  const handleAddBudget = (e) => {
    e.preventDefault();
    const rawNum = parseInt(limitInput.replace(/[^0-9]/g, ''), 10);
    if (!rawNum) return;
    const cat = categories.find((c) => c.id === selectedCatId);
    if (!cat) return;

    setBudgets([
      ...budgets.filter((b) => b.categoryId !== cat.id),
      {
        categoryId: cat.id,
        name: cat.name,
        limit: rawNum,
        color: cat.color,
        icon: cat.icon
      }
    ]);

    setLimitInput('');
    setIsAdding(false);
    showToast(`سقف بودجه برای ${cat.name} تنظیم شد`);
  };

  const handleDeleteBudget = (catId, name) => {
    setBudgets(budgets.filter((b) => b.categoryId !== catId));
    showToast(`سقف بودجه ${name} حذف شد`);
  };

  const applyTemplate = (type) => {
    if (type === 'family') {
      setBudgets([
        { categoryId: 'food', name: 'خوردنی', limit: 4500000, color: '#e66746', icon: 'UtensilsCrossed' },
        { categoryId: 'vehicle', name: 'بنزین و خودرو', limit: 2000000, color: '#ea580c', icon: 'Fuel' },
        { categoryId: 'telecom', name: 'شارژ و اینترنت', limit: 600000, color: '#f3ad22', icon: 'Smartphone' },
        { categoryId: 'health', name: 'پزشکی و دارو', limit: 1200000, color: '#10b981', icon: 'HeartPulse' }
      ]);
      showToast('الگوی بودجه خانواده فعال شد');
    } else {
      setBudgets([
        { categoryId: 'food', name: 'خوردنی', limit: 1500000, color: '#e66746', icon: 'UtensilsCrossed' },
        { categoryId: 'vehicle', name: 'بنزین و خودرو', limit: 600000, color: '#ea580c', icon: 'Fuel' },
        { categoryId: 'telecom', name: 'شارژ و اینترنت', limit: 200000, color: '#f3ad22', icon: 'Smartphone' }
      ]);
      showToast('الگوی بودجه صرفه‌جویی شدید فعال شد');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-3.5 select-none font-vazir">
      {/* Month Timeline & Overall Budget Health Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a2333] via-[#141b28] to-[#0f141e] border border-[#29344a] rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            پایش بودجه اردیبهشت ۱۴۰۵
          </span>
          <span className="text-[10px] text-slate-400 bg-[#222a3b] border border-[#303c54] px-2.5 py-0.5 rounded-full">
            {daysRemaining} روز مانده از ماه
          </span>
        </div>

        {/* Month Progress Indicator */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>سپری شده: روز {currentDay} از {totalDays} ({monthProgress}٪)</span>
            <span>مصرف بودجه: {overallPercent}٪</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#121620] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overallPercent > monthProgress ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Overall summary stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#232c3f] text-xs">
          <div className="flex flex-col text-right">
            <span className="text-slate-400 text-[10px]">کل سقف مجاز</span>
            <span className="font-bold text-white text-sm mt-0.5">{formatToman(totalLimit)}</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-slate-400 text-[10px]">کل خرج شده</span>
            <span className={`font-black text-sm mt-0.5 ${totalSpent > totalLimit ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatToman(totalSpent)}
            </span>
          </div>
        </div>
      </div>

      {/* Preset Templates Quick Bar */}
      <div className="bg-[#171e2c] border border-[#273248] rounded-2xl p-2.5 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-300 flex items-center gap-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          الگوهای آماده:
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => applyTemplate('family')}
            className="px-2.5 py-1 rounded-xl bg-[#232b3c] hover:bg-[#2e374c] text-slate-200 text-[10px] font-bold border border-[#333e54] transition-colors cursor-pointer"
          >
            خانواده
          </button>
          <button
            onClick={() => applyTemplate('saving')}
            className="px-2.5 py-1 rounded-xl bg-[#232b3c] hover:bg-[#2e374c] text-emerald-400 text-[10px] font-bold border border-emerald-500/30 transition-colors cursor-pointer"
          >
            صرفه‌جویی شدید
          </button>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-white">سقف‌های تعریف‌شده ({budgets.length})</span>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>تعریف سقف جدید</span>
        </button>
      </div>

      {/* Add / Edit Form Drawer */}
      {isAdding && (
        <form onSubmit={handleAddBudget} className="bg-[#19202e] p-4 rounded-3xl border border-[#333f57] space-y-3 animate-fade-in shadow-xl">
          <div>
            <span className="text-xs text-slate-400 block text-right mb-1">دسته‌بندی:</span>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full bg-[#232b3c] text-white text-xs px-3 py-2.5 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1c2230]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-xs text-slate-400 block text-right mb-1">سقف مجاز ماهانه (تومان):</span>
            <input
              type="number"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              placeholder="مثال: ۲,۵۰۰,۰۰۰"
              className="w-full bg-[#232b3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
              autoFocus
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
            >
              ذخیره سقف بودجه
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-[#232b3c] text-slate-300 text-xs rounded-xl cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* Budgets List with Smart Badges */}
      <div className="space-y-3 flex-1">
        {budgets.map((b) => {
          const spent = calculateSpent(b.name);
          const percent = Math.min(Math.round((spent / b.limit) * 100), 100);
          const isOver = spent > b.limit;
          const remaining = Math.max(0, b.limit - spent);
          const dailyBurnAllowable = daysRemaining > 0 ? Math.round(remaining / daysRemaining) : 0;

          return (
            <div
              key={b.categoryId}
              className={`bg-[#181f2c] border rounded-2xl p-3.5 space-y-2.5 transition-all shadow-xs ${
                isOver ? 'border-rose-500/40 bg-rose-950/10' : 'border-[#273247] hover:border-[#384661]'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDeleteBudget(b.categoryId, b.name)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="حذف سقف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className={`font-black text-sm ${isOver ? 'text-rose-400' : 'text-slate-100'}`}>
                    {formatToman(spent)}
                  </span>
                  <span className="text-slate-400 text-[10px]">از {formatToman(b.limit)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{b.name}</span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: `${b.color}22` }}
                  >
                    <CategoryIcon name={b.icon} color={b.color} className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[#121620] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOver ? 'bg-rose-500' : percent > 80 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Bottom footer status */}
              <div className="flex items-center justify-between text-[10px]">
                {isOver ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    اضافه‌خرج: {formatToman(spent - b.limit)} بالاتر از سقف
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">
                    مانده: {formatToman(remaining)} (روزانه تا {formatToman(dailyBurnAllowable)})
                  </span>
                )}

                <span className={`font-bold px-1.5 py-0.5 rounded-md ${
                  isOver ? 'bg-rose-950 text-rose-400 border border-rose-800/40' : 'bg-[#222a3b] text-slate-300'
                }`}>
                  {percent}٪ مصرف شد
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
