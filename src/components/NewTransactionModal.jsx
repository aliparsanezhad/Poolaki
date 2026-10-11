import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { toEnglishDigits, formatNumberWithCommas, getSampleJalaliToday } from '../utils/persianNumbers';
import {
  X,
  Plus,
  Calendar,
  FileText,
  Wallet,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shapes,
  CreditCard,
  Calculator
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import CalculatorKeypad from './CalculatorKeypad';

export default function NewTransactionModal() {
  const {
    isNewTxModalOpen,
    setIsNewTxModalOpen,
    accounts,
    addTransaction,
    setIsCategoryPickerOpen,
    setCategoryPickerCallback,
    showToast
  } = usePoolaki();

  const [type, setType] = useState('expense'); // expense, income, transfer
  const [amountStr, setAmountStr] = useState('۳۵۴,۰۰۰');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || 'card-tejarat');
  const [dateStr, setDateStr] = useState('(امروز) ' + getSampleJalaliToday().slice(0, 16));
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({
    name: 'دسته‌بندی',
    id: null,
    subName: '',
    icon: 'Shapes'
  });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  if (!isNewTxModalOpen) return null;

  const currentAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleAmountChange = (e) => {
    const raw = toEnglishDigits(e.target.value).replace(/[^0-9]/g, '');
    if (!raw) {
      setAmountStr('');
      return;
    }
    const num = parseInt(raw, 10);
    setAmountStr(formatNumberWithCommas(num));
  };

  const openCategoryPicker = () => {
    setCategoryPickerCallback(() => (cat, sub) => {
      setSelectedCategory({
        name: cat.name,
        id: cat.id,
        subName: sub?.name || '',
        icon: sub?.icon || cat.icon
      });
    });
    setIsCategoryPickerOpen(true);
  };

  const handleQuickChipSelect = (name, icon) => {
    setSelectedCategory({
      name,
      id: 'quick',
      subName: '',
      icon
    });
    if (!description) {
      setDescription(name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawNum = parseInt(toEnglishDigits(amountStr).replace(/[^0-9]/g, ''), 10);
    if (!rawNum || rawNum <= 0) {
      showToast('لطفاً مبلغ معتبری وارد کنید');
      return;
    }

    addTransaction({
      title: description.trim() || selectedCategory.name || 'تراکنش بدون عنوان',
      categoryName: selectedCategory.name === 'دسته‌بندی' ? 'متفرقه' : selectedCategory.name,
      subCategoryName: selectedCategory.subName,
      categoryId: selectedCategory.id || 'misc',
      amount: rawNum,
      type,
      date: 'امروز',
      accountId: selectedAccountId,
      accountName: currentAccount?.name || 'کارت بانکی',
      icon: selectedCategory.icon || 'Receipt'
    });

    setIsNewTxModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border border-[#2f384d] rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header matching photo_4 */}
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={() => setIsNewTxModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-bold text-white text-base">تراکنش جدید</span>
          <div className="w-5"></div>
        </div>

        {/* Type Toggle Tabs: خرج | دخل | جابجایی */}
        <div className="flex items-center bg-[#191e2b] rounded-2xl p-1 border border-[#293245]">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'expense'
                ? 'bg-[#a3514a] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            خرج
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'income'
                ? 'bg-[#22845c] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            دخل
          </button>
          <button
            type="button"
            onClick={() => setType('transfer')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'transfer'
                ? 'bg-[#3b82f6] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            جابجایی
          </button>
        </div>

        {/* Amount Input Card with in-app Calculator toggle matching update_calculator.jpg */}
        <div className="bg-[#191e2b] border border-[#2d364b] rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-medium">تومان</span>
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                isCalculatorOpen
                  ? 'bg-[#6179fb] text-white border-blue-400 shadow-md'
                  : 'bg-[#252c3c] hover:bg-[#323b4e] text-slate-300 border-[#384359]'
              }`}
              title="ماشین حساب درون‌برنامه‌ای"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[10px] font-bold">ماشین‌حساب</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-lg">
              {type === 'expense' ? '-' : '+'}
            </span>
            <input
              type="text"
              value={amountStr}
              onChange={handleAmountChange}
              placeholder="۰"
              className="bg-transparent text-right text-2xl font-bold text-white outline-none w-40 tracking-wider font-vazir"
              dir="ltr"
            />
          </div>
        </div>

        {/* In-App Calculator Keypad Component */}
        {isCalculatorOpen && (
          <CalculatorKeypad
            initialValue={amountStr}
            onConfirm={(val) => {
              setAmountStr(formatNumberWithCommas(val));
              setIsCalculatorOpen(false);
            }}
            onClose={() => setIsCalculatorOpen(false)}
          />
        )}

        {/* Account Selection Card */}
        <div className="bg-[#191e2b] border border-[#2d364b] rounded-2xl px-4 py-3 flex items-center justify-between">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="bg-transparent text-right text-sm font-semibold text-white outline-none flex-1 cursor-pointer"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id} className="bg-[#191e2b] text-white">
                {acc.name} ({acc.bankName || 'نقدی'})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-xs font-medium text-slate-400">حساب / کارت</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Date Selector Card matching photo_4 */}
        <div className="bg-[#191e2b] border border-[#2d364b] rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white" />
            <span className="font-medium text-slate-200">{dateStr}</span>
            <ChevronRight className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white" />
          </div>
          <Calendar className="w-4 h-4 text-slate-400" />
        </div>

        {/* Description Field matching photo_4 */}
        <div className="bg-[#191e2b] border border-[#2d364b] rounded-2xl px-4 py-2.5 flex items-center justify-between">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات"
            className="bg-transparent text-right text-xs text-white placeholder-slate-500 outline-none flex-1 font-vazir"
          />
          <FileText className="w-4 h-4 text-slate-400" />
        </div>

        {/* Category Picker Trigger Card matching photo_4 */}
        <button
          type="button"
          onClick={openCategoryPicker}
          className="w-full bg-[#191e2b] border border-[#2d364b] hover:border-[#42506e] rounded-2xl px-4 py-3 flex items-center justify-between transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">
              {selectedCategory.subName
                ? `${selectedCategory.name} > ${selectedCategory.subName}`
                : selectedCategory.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <Shapes className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </div>
        </button>

        {/* Quick Suggestion Chips matching photo_4 */}
        <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => handleQuickChipSelect('متفرقه', 'Coffee')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#283144] hover:bg-[#344058] border border-[#374460] text-xs font-medium text-slate-200 transition-colors"
          >
            <span>متفرقه</span>
            <CategoryIcon name="Coffee" className="w-3.5 h-3.5 text-amber-500" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickChipSelect('بنزین', 'Fuel')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#283144] hover:bg-[#344058] border border-[#374460] text-xs font-medium text-slate-200 transition-colors"
          >
            <span>بنزین</span>
            <CategoryIcon name="Fuel" className="w-3.5 h-3.5 text-orange-500" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickChipSelect('ابزار نقره', 'Wrench')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#283144] hover:bg-[#344058] border border-[#374460] text-xs font-medium text-slate-200 transition-colors"
          >
            <span>ابزار نقره</span>
            <CategoryIcon name="Wrench" className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Submit Button matching photo_4 */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-[#5b75f8] hover:bg-[#4d69f0] active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer text-sm mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت تراکنش</span>
        </button>
      </div>
    </div>
  );
}
