import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import { PiggyBank, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
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

  // Calculate spent per budget category
  const calculateSpent = (catName) => {
    return transactions
      .filter((t) => t.type === 'expense' && (t.categoryName === catName || t.categoryId === catName))
      .reduce((acc, t) => acc + (t.amount || 0), 0);
  };

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

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-4">
      {/* Overview Card */}
      <div className="bg-gradient-to-br from-[#273043] to-[#202636] border border-[#323d54] rounded-2xl p-4 shadow-md text-right">
        <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
          <span className="font-bold text-white flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            بودجه‌بندی ماهانه
          </span>
          <span className="text-[10px] text-slate-400">اردیبهشت ۱۴۰۵</span>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          تعیین سقف هزینه برای هر دسته‌بندی جهت جلوگیری از ولخرجی و پس‌انداز هوشمندانه
        </p>
      </div>

      {/* Add Budget Trigger */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>تعریف سقف جدید</span>
        </button>
        <span className="text-xs font-bold text-white">سقف‌های تعریف شده</span>
      </div>

      {/* Add form */}
      {isAdding && (
        <form onSubmit={handleAddBudget} className="bg-[#1b212f] p-4 rounded-2xl border border-[#354058] space-y-3 animate-fade-in">
          <div>
            <span className="text-xs text-slate-400 block text-right mb-1">انتخاب دسته‌بندی:</span>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full bg-[#252c3c] text-white text-xs px-3 py-2.5 rounded-xl border border-[#38445e] outline-none text-right"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#202737]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-xs text-slate-400 block text-right mb-1">سقف مبلغ (تومان):</span>
            <input
              type="number"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              placeholder="مثال: ۲,۵۰۰,۰۰۰"
              className="w-full bg-[#252c3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#5b75f8] text-white text-xs font-bold py-2 rounded-xl"
            >
              ذخیره سقف بودجه
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 text-slate-400 text-xs"
            >
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* Budgets List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {budgets.map((b) => {
          const spent = calculateSpent(b.name);
          const percent = Math.min(Math.round((spent / b.limit) * 100), 100);
          const isOver = spent > b.limit;

          return (
            <div
              key={b.categoryId}
              className="bg-[#212735] border border-[#2b3345] rounded-2xl p-4 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-slate-200'}`}>
                    {formatToman(spent)}
                  </span>
                  <span className="text-slate-400 text-[10px]">از {formatToman(b.limit)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{b.name}</span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${b.color}25` }}
                  >
                    <CategoryIcon name={b.icon} color={b.color} className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#171c26] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOver ? 'bg-rose-500' : percent > 80 ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{percent}٪ مصرف شده</span>
                <span>
                  {isOver
                    ? `⚠️ ${formatToman(spent - b.limit)} بیشتر از سقف`
                    : `${formatToman(b.limit - spent)} باقیمانده`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
