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
  Plus,
  FileText,
  CreditCard,
  Trash2,
  AlertCircle,
  BellRing,
  QrCode
} from 'lucide-react';

export default function DuesView() {
  const {
    dues,
    toggleDuePaid,
    addDue,
    deleteDue,
    showToast
  } = usePoolaki();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'installment' | 'cheque' | 'note'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'paid'
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('installment');
  const [newDueDate, setNewDueDate] = useState('۲۵ آبان ۱۴۰۵');
  const [newBank, setNewBank] = useState('بانک تجارت');
  const [newNote, setNewNote] = useState('');

  const filteredDues = dues.filter((d) => {
    if (filterType !== 'all' && d.type !== filterType) return false;
    if (statusFilter === 'pending' && d.isPaid) return false;
    if (statusFilter === 'paid' && !d.isPaid) return false;
    return true;
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
      bank: newBank,
      note: newNote.trim() || (newType === 'cheque' ? 'چک صیادی بنفش' : 'ثبت کاربر')
    });

    setNewTitle('');
    setNewAmount('');
    setNewNote('');
    setIsAddingNew(false);
    showToast('سررسید جدید با موفقیت ثبت شد');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-3.5 select-none font-vazir">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#181f2c] border border-[#273248] rounded-2xl p-2.5 text-center shadow-sm">
          <span className="text-[10px] text-slate-400 block mb-1">سررسید کل</span>
          <span className="font-black text-xs text-white block truncate">
            {formatToman(totalDuesAmount)}
          </span>
        </div>

        <div className="bg-[#12261e] border border-emerald-500/30 rounded-2xl p-2.5 text-center shadow-sm">
          <span className="text-[10px] text-emerald-400 block mb-1">پرداخت شده</span>
          <span className="font-black text-xs text-emerald-400 block truncate">
            {formatToman(paidDuesAmount)}
          </span>
        </div>

        <div className="bg-[#291e17] border border-amber-500/30 rounded-2xl p-2.5 text-center shadow-sm">
          <span className="text-[10px] text-amber-400 block mb-1">مانده / معوق</span>
          <span className="font-black text-xs text-amber-400 block truncate">
            {formatToman(pendingDuesAmount)}
          </span>
        </div>
      </div>

      {/* Type Filter Pills: همه | چک صیادی | قسط وام | یادداشت */}
      <div className="flex items-center bg-[#151a26] p-1 rounded-2xl border border-[#232c3f]">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#222a3d] text-white shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          همه ({dues.length})
        </button>

        <button
          onClick={() => setFilterType('installment')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'installment'
              ? 'bg-[#222a3d] text-blue-400 shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          اقساط وام
        </button>

        <button
          onClick={() => setFilterType('cheque')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'cheque'
              ? 'bg-[#222a3d] text-purple-400 shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          چک صیادی
        </button>

        <button
          onClick={() => setFilterType('note')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterType === 'note'
              ? 'bg-[#222a3d] text-emerald-400 shadow-md border border-[#34415e]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          یادداشت
        </button>
      </div>

      {/* Action Header & Status Toggles */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#181f2c] text-slate-400 border-[#273248]'
            }`}
          >
            فقط پرداخت‌نشده‌ها
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'paid' ? 'all' : 'paid')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#181f2c] text-slate-400 border-[#273248]'
            }`}
          >
            تسویه‌شده
          </button>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ثبت سررسید جدید</span>
        </button>
      </div>

      {/* Add New Due Form Drawer */}
      {isAddingNew && (
        <form onSubmit={handleAdd} className="bg-[#19202e] p-4 rounded-3xl border border-[#333f57] space-y-3 animate-fade-in shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400 block text-right mb-1">نوع تعهد:</span>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-[#232b3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
              >
                <option value="installment">قسط وام</option>
                <option value="cheque">چک صیادی</option>
                <option value="note">یادداشت و قبض</option>
              </select>
            </div>

            <div>
              <span className="text-xs text-slate-400 block text-right mb-1">بانک مربوطه:</span>
              <select
                value={newBank}
                onChange={(e) => setNewBank(e.target.value)}
                className="w-full bg-[#232b3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
              >
                <option value="بانک تجارت">بانک تجارت</option>
                <option value="بانک مسکن">بانک مسکن</option>
                <option value="بانک ملی ایران">بانک ملی ایران</option>
                <option value="بانک ملت">بانک ملت</option>
                <option value="بلوبانک">بلوبانک</option>
              </select>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block text-right mb-1">عنوان سررسید:</span>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: قسط وام مسکن یا چک خرید لپتاپ"
              className="w-full bg-[#232b3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-400 block text-right mb-1">مبلغ (تومان):</span>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="مثال: ۵,۰۰۰,۰۰۰"
                className="w-full bg-[#232b3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
              />
            </div>

            <div>
              <span className="text-xs text-slate-400 block text-right mb-1">تاریخ موعد:</span>
              <input
                type="text"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="۲۵ آبان ۱۴۰۵"
                className="w-full bg-[#232b3c] text-white text-xs px-3 py-2 rounded-xl border border-[#38445e] outline-none text-right font-vazir"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
            >
              افزودن به تقویم تعهدات
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 bg-[#232b3c] text-slate-300 text-xs rounded-xl cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* Dues List */}
      <div className="space-y-3 flex-1">
        {filteredDues.map((d) => {
          const isCheque = d.type === 'cheque';
          const isInstallment = d.type === 'installment';

          return (
            <div
              key={d.id}
              className={`relative overflow-hidden rounded-2xl border transition-all shadow-xs ${
                d.isPaid
                  ? 'bg-[#141b26]/70 border-[#232d3f] opacity-80'
                  : isCheque
                  ? 'bg-gradient-to-br from-[#201831] via-[#1a1428] to-[#14101e] border-purple-500/30'
                  : 'bg-[#181f2c] border-[#273248]'
              }`}
            >
              {/* Sayadi Cheque Top Purple Banner */}
              {isCheque && (
                <div className="bg-purple-950/80 border-b border-purple-500/30 px-3.5 py-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-purple-300 font-bold flex items-center gap-1">
                    <QrCode className="w-3 h-3" />
                    چک صیادی الکترونیک
                  </span>
                  <span className="font-mono text-purple-200" dir="ltr">
                    شناسه: ۴۲۸۰ ۱۱۹۲ ۰۸۳۲ ****
                  </span>
                </div>
              )}

              <div className="p-3.5 space-y-2.5">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  {/* Status checkbox */}
                  <button
                    onClick={() => toggleDuePaid(d.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      d.isPaid
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-[#232c3f] text-slate-300 hover:text-white border border-[#34415e]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${d.isPaid ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{d.isPaid ? 'پرداخت شده' : 'ثبت پرداخت'}</span>
                  </button>

                  <div className="flex items-center gap-2 text-right">
                    <div className="flex flex-col">
                      <span className={`font-bold text-xs ${d.isPaid ? 'line-through text-slate-400' : 'text-white'}`}>
                        {d.title}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {d.bank} • {d.note}
                      </span>
                    </div>

                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isCheque
                        ? 'bg-purple-500/20 text-purple-400'
                        : isInstallment
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {isCheque ? (
                        <FileText className="w-4 h-4" />
                      ) : isInstallment ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <Calendar className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Due Date */}
                <div className="flex items-center justify-between pt-2 border-t border-[#232c3f] text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteDue(d.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="حذف سررسید"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className={`font-black text-sm ${d.isPaid ? 'text-slate-400' : 'text-white'}`}>
                      {formatToman(d.amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span>موعد: {d.dueDate}</span>
                    <span className="text-[10px] text-slate-400">({d.daysLabel})</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
