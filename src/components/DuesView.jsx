import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Building2,
  RefreshCw,
  MessageSquare,
  Plus,
  FileText,
  CreditCard,
  Trash2
} from 'lucide-react';

export default function DuesView() {
  const {
    dues,
    toggleDuePaid,
    addDue,
    deleteDue,
    setIsSmsPermissionOpen,
    setIsSmsSimulatorOpen
  } = usePoolaki();

  const [filterType, setFilterType] = useState('all'); // all, installment, cheque, note
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('installment');
  const [newDueDate, setNewDueDate] = useState('۳۰ آبان ۱۴۰۵');

  const filteredDues = dues.filter((d) => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  });

  const totalDuesAmount = dues.reduce((acc, d) => acc + (d.amount || 0), 0);
  const paidDuesAmount = dues.filter((d) => d.isPaid).reduce((acc, d) => acc + (d.amount || 0), 0);
  const pendingDuesAmount = dues.filter((d) => !d.isPaid).reduce((acc, d) => acc + (d.amount || 0), 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;
    const rawAmt = parseInt(newAmount.replace(/[^0-9]/g, ''), 10) || 0;

    addDue({
      title: newTitle.trim(),
      type: newType,
      amount: rawAmt,
      dueDate: newDueDate,
      daysLabel: 'در موعد مقرر',
      bank: 'بانک تجارت',
      note: 'ثبت شده توسط کاربر'
    });

    setNewTitle('');
    setNewAmount('');
    setIsAddingNew(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-4">
      {/* Top Summary Cards matching photo_6 top scrollbar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#242b3b] border border-[#333e56] rounded-2xl p-2.5 text-center shadow-sm">
          <span className="text-[10px] text-slate-400 block mb-1">سررسید کل</span>
          <span className="font-bold text-xs text-white block truncate">
            {formatToman(totalDuesAmount)}
          </span>
        </div>

        <div className="bg-[#242b3b] border border-[#333e56] rounded-2xl p-2.5 text-center shadow-sm">
          <span className="text-[10px] text-emerald-400 block mb-1">پرداخت شده</span>
          <span className="font-bold text-xs text-emerald-400 block truncate">
            {formatToman(paidDuesAmount)}
          </span>
        </div>

        <div className="bg-[#242b3b] border border-[#333e56] rounded-2xl p-2.5 text-center shadow-sm">
          <span className="text-[10px] text-amber-400 block mb-1">معوق / مانده</span>
          <span className="font-bold text-xs text-amber-400 block truncate">
            {formatToman(pendingDuesAmount)}
          </span>
        </div>
      </div>

      {/* Timeline Date Selector matching photo_6 */}
      <div className="bg-[#222838] border border-[#2e374b] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ChevronLeft className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
            <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
          </div>

          <div className="flex items-center gap-2 text-right">
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white">۲۰۲ روز پیش</span>
              <span className="text-[10px] text-slate-400 mt-0.5">جمعه، ۲۹ اسفند</span>
            </div>
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Filter Pills matching photo_6: یادداشت | چک | قسط */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2d3649]">
          <button
            onClick={() => setFilterType(filterType === 'note' ? 'all' : 'note')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              filterType === 'note'
                ? 'bg-[#5b75f8] text-white shadow-sm'
                : 'bg-[#1b212f] text-slate-400 hover:text-white border border-[#2d364b]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>یادداشت</span>
          </button>

          <button
            onClick={() => setFilterType(filterType === 'cheque' ? 'all' : 'cheque')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              filterType === 'cheque'
                ? 'bg-[#5b75f8] text-white shadow-sm'
                : 'bg-[#1b212f] text-slate-400 hover:text-white border border-[#2d364b]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>چک</span>
          </button>

          <button
            onClick={() => setFilterType(filterType === 'installment' ? 'all' : 'installment')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              filterType === 'installment'
                ? 'bg-[#5b75f8] text-white shadow-sm'
                : 'bg-[#1b212f] text-slate-400 hover:text-white border border-[#2d364b]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>قسط</span>
          </button>
        </div>
      </div>

      {/* Add New Due Form Button / Section */}
      <div className="flex justify-between items-center px-1">
        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن قسط یا چک جدید</span>
        </button>
        <span className="text-xs font-bold text-slate-400">تعهدات و یادداشت‌ها</span>
      </div>

      {isAddingNew && (
        <form onSubmit={handleAdd} className="bg-[#1b212f] p-4 rounded-2xl border border-[#354058] space-y-3 animate-fade-in">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 block text-right">عنوان:</span>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: قسط وام ازدواج"
              className="w-full bg-[#252c3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block text-right mb-1">مبلغ (تومان):</span>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="۵,۰۰۰,۰۰۰"
                className="w-full bg-[#252c3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block text-right mb-1">نوع:</span>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-[#252c3c] text-white text-xs px-2 py-2 rounded-xl border border-[#38445e] outline-none text-right"
              >
                <option value="installment">قسط</option>
                <option value="cheque">چک</option>
                <option value="note">یادداشت</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-[#5b75f8] text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              ثبت سررسید
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 text-slate-400 hover:text-white text-xs"
            >
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* Dues Cards List matching photo_6 */}
      <div className="space-y-3">
        {filteredDues.map((due) => (
          <div
            key={due.id}
            className="bg-[#232938] border border-[#2f384d] rounded-2xl p-4 shadow-sm space-y-3 hover:border-[#42506e] transition-colors group"
          >
            <div className="flex items-center justify-between">
              {/* Status pill button matching photo_6: "پرداخت‌شده" */}
              <button
                onClick={() => toggleDuePaid(due.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  due.isPaid
                    ? 'bg-emerald-950/70 border border-emerald-600/50 text-emerald-300'
                    : 'bg-amber-950/60 border border-amber-600/50 text-amber-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{due.isPaid ? 'پرداخت‌شده' : 'در انتظار پرداخت'}</span>
              </button>

              {/* Amount matching photo_6 */}
              <div className="flex items-center gap-1 text-left">
                <span className="text-slate-400 text-xs font-medium">تومان</span>
                <span className="text-xl font-bold text-white tracking-wide">
                  {due.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Sub details matching photo_6 */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2e374b] text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  onClick={() => deleteDue(due.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all p-1"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span>{due.bank || 'بانک تجارت'}</span>
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">{due.dueDate}</span>
                <span className="font-bold text-slate-200">{due.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SMS Status Card matching photo_6 bottom section */}
      <div className="bg-[#1c2230] border border-[#2b354a] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => setIsSmsSimulatorOpen(true)}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title="بروزرسانی پیامک‌ها"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <span>پیامک جدید نداری</span>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        {/* Bank Melli configuration card matching photo_6 */}
        <div
          onClick={() => setIsSmsPermissionOpen(true)}
          className="bg-[#242b3b] hover:bg-[#2e374b] border border-[#333e56] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-3 text-right">
            <div className="flex flex-col">
              <span className="font-bold text-white text-xs">بانک ملی ایران</span>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[210px]">
                سرشماره بانک رو از بین پیامک‌ها انتخاب کن تا دخل و خرج به صورت خودکار وارد بشه
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-700/40 flex items-center justify-center text-red-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
