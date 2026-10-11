import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman, toPersianDigits } from '../utils/persianNumbers';
import { Users, X, Copy, Plus, Trash2, CheckCircle2, Share2, Sparkles } from 'lucide-react';

export default function SplitBillModal() {
  const {
    isSplitBillOpen,
    setIsSplitBillOpen,
    addTransaction,
    accounts,
    showToast
  } = usePoolaki();

  const [billTitle, setBillTitle] = useState('شام دورهمی');
  const [totalAmount, setTotalAmount] = useState(1600000);
  const [members, setMembers] = useState(['من', 'محمد', 'سینا', 'امیر']);
  const [newMemberName, setNewMemberName] = useState('');
  const [paidBy, setPaidBy] = useState('من');

  if (!isSplitBillOpen) return null;

  const count = Math.max(members.length, 1);
  const sharePerPerson = Math.round(totalAmount / count);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    setMembers([...members, newMemberName.trim()]);
    setNewMemberName('');
  };

  const handleRemoveMember = (index) => {
    if (members.length <= 1) return;
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCopyShareText = () => {
    const text = `سلام بچه‌ها! 🪙\nسهم دنگ هر نفر برای "${billTitle}": ${formatToman(sharePerPerson)}\nلطفاً به حساب تسویه کنید. ممنون!`;
    navigator.clipboard.writeText(text);
    showToast('متن دنگ کپی شد! می‌توانید در تلگرام یا واتساپ بفرستید ✨');
  };

  const handleSaveMyShareAsExpense = () => {
    addTransaction({
      title: `سهم دنگ: ${billTitle}`,
      categoryName: 'خوردنی',
      subCategoryName: 'کافه و رستوران',
      categoryId: 'food',
      amount: sharePerPerson,
      type: 'expense',
      date: 'امروز',
      accountId: accounts[0]?.id || 'card-maskan',
      accountName: accounts[0]?.name || 'کارت روزمره',
      icon: 'UtensilsCrossed'
    });
    showToast(`سهم دنگ شما (${sharePerPerson.toLocaleString()} تومان) در هزینه‌ها ثبت شد!`);
    setIsSplitBillOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#1e2536] border border-blue-500/30 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d384c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">محاسبه دنگ و خرج مشترک</span>
              <span className="text-[10px] text-blue-400">تقسیم خودکار صورت‌حساب دورهمی و سفر</span>
            </div>
          </div>

          <button
            onClick={() => setIsSplitBillOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3 my-3">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 block text-right">عنوان خرج:</span>
            <input
              type="text"
              value={billTitle}
              onChange={(e) => setBillTitle(e.target.value)}
              className="w-full bg-[#171d2b] border border-[#2d384c] rounded-xl px-3 py-2 text-xs text-white outline-none text-right font-vazir"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 block text-right">مبلغ کل فاکتور (تومان):</span>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
              className="w-full bg-[#171d2b] border border-[#2d384c] rounded-xl px-3 py-2 text-sm font-bold text-white outline-none text-right font-vazir"
            />
          </div>

          {/* Members List */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 block text-right">افراد حاضر در دنگ ({members.length} نفر):</span>
            <div className="flex flex-wrap gap-1.5 bg-[#161c2a] p-2.5 rounded-2xl border border-[#2b354a]">
              {members.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-[#242e42] text-white text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-[#35435e]"
                >
                  <span>{m}</span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add person */}
            <form onSubmit={handleAddMember} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="نام فرد جدید..."
                className="flex-1 bg-[#171d2b] border border-[#2d384c] rounded-xl px-3 py-1.5 text-xs text-white outline-none text-right font-vazir"
              />
              <button
                type="submit"
                className="bg-[#2a354c] hover:bg-[#394766] text-blue-400 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
              >
                + افزودن
              </button>
            </form>
          </div>
        </div>

        {/* Calculated Share Result Card */}
        <div className="bg-gradient-to-br from-blue-950/40 via-[#232c40] to-[#171e2c] border border-blue-500/30 rounded-2xl p-4 my-2 text-center space-y-2">
          <span className="text-xs text-blue-300 font-semibold block">
            سهم دنگ هر نفر:
          </span>
          <div className="text-2xl font-black text-white tracking-wide font-vazir">
            {formatToman(sharePerPerson)}
          </div>
          <span className="text-[10px] text-slate-400 block">
            از مجموع {formatToman(totalAmount)} تقسیم بر {count} نفر
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleCopyShareText}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.99] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer text-xs"
          >
            <Copy className="w-4 h-4" />
            <span>کپی متن پیام دنگ برای دوستان</span>
          </button>

          <button
            type="button"
            onClick={handleSaveMyShareAsExpense}
            className="w-full bg-[#1e2535] hover:bg-[#273248] border border-[#34425d] text-slate-200 font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
          >
            <span>فقط سهم خودم را به عنوان خرج ثبت کن</span>
          </button>
        </div>
      </div>
    </div>
  );
}
