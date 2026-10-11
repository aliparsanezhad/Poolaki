import React from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import { X, Trash2, CheckCircle2, Inbox, ArrowDownLeft, ArrowUpRight, Sparkles } from 'lucide-react';

export default function BatchSmsModal() {
  const {
    isBatchSmsOpen,
    setIsBatchSmsOpen,
    pendingSmsList,
    setPendingSmsList,
    importAllPendingSms,
    deletePendingSms
  } = usePoolaki();

  if (!isBatchSmsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border border-[#2f384d] rounded-3xl p-5 shadow-2xl flex flex-col h-[88vh]">
        {/* Header matching update_batch_sms.jpg */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d364a]">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Inbox className="w-4 h-4 text-blue-400" />
            <span>ثبت یکجای پیامک‌ها (صندوق تلمبار)</span>
          </div>

          <button
            onClick={() => setIsBatchSmsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Banner */}
        <div className="bg-[#1b212f] border border-[#2d384c] rounded-2xl p-3 my-3 text-right">
          <p className="text-xs text-slate-300 leading-relaxed">
            دیگه نگران تلمبار شدن پیامک‌ها نباش! می‌تونی تمام تراکنش‌های اضافه‌نشده رو با زدن یک دکمه ثبت کنی. همه تراکنش‌ها به دسته‌بندی <span className="font-bold text-amber-400">«تعیین‌نشده»</span> اضافه می‌شوند تا حساب‌کتاب‌هات فوراً به‌روز بمانند.
          </p>
        </div>

        {/* Pending SMS List matching update_batch_sms.jpg */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {pendingSmsList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <span>تمام پیامک‌ها ثبت شده‌اند و پیامک تلمبار شده‌ای ندارید!</span>
            </div>
          ) : (
            pendingSmsList.map((item) => {
              const isExpense = item.type === 'expense';
              return (
                <div
                  key={item.id}
                  className="bg-[#283042] border border-[#343f56] hover:border-[#475677] rounded-2xl p-3.5 flex items-center justify-between transition-colors group"
                >
                  {/* Left: Delete icon */}
                  <button
                    onClick={() => deletePendingSms(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="حذف این پیامک"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Middle & Right: Details matching screenshot */}
                  <div className="flex items-center gap-3 text-right">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span
                          className={`font-bold text-xs ${
                            isExpense ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {isExpense ? '- ' : '+ '}
                          {formatToman(item.amount)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {item.date} • {item.accountName}
                      </span>
                      {item.description && (
                        <span className="text-[10px] text-slate-400">
                          {item.description}
                        </span>
                      )}
                    </div>

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isExpense
                          ? 'bg-rose-950/40 border border-rose-800/30 text-rose-400'
                          : 'bg-emerald-950/40 border border-emerald-800/30 text-emerald-400'
                      }`}
                    >
                      {isExpense ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Floating Pill Bar matching update_batch_sms.jpg */}
        {pendingSmsList.length > 0 && (
          <div className="pt-3 border-t border-[#2e374b] flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-medium">
              +{pendingSmsList.length} پیامک منتظر ثبت
            </span>

            <button
              type="button"
              onClick={importAllPendingSms}
              className="bg-[#6179fb] hover:bg-[#4d69f0] active:scale-95 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 text-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ثبت همه</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
