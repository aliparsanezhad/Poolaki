import React, { useState, useEffect } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import { ChevronUp, X, BellRing, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function InteractiveNotification() {
  const {
    activeNotification,
    setActiveNotification,
    addTransaction,
    showToast
  } = usePoolaki();

  if (!activeNotification) return null;

  const isIncome = activeNotification.type === 'income';

  // Category choices based on income vs expense matching update_notification_record.jpg
  const categoryOptions = isIncome
    ? [
        { label: 'طلب', categoryName: 'طلب / بازپرداخت', categoryId: 'misc' },
        { label: 'حقوق', categoryName: 'حقوق و دستمزد', categoryId: 'income-salary' },
        { label: 'هدیه', categoryName: 'هدیه و پاداش', categoryId: 'income-salary' },
        { label: 'تعیین‌نشده', categoryName: 'تعیین‌نشده', categoryId: 'uncategorized' }
      ]
    : [
        { label: 'خوردنی', categoryName: 'خوردنی', categoryId: 'food' },
        { label: 'بنزین', categoryName: 'خودرو و سوخت', categoryId: 'vehicle' },
        { label: 'خرید', categoryName: 'استایل شخصی', categoryId: 'personal-style' },
        { label: 'تعیین‌نشده', categoryName: 'تعیین‌نشده', categoryId: 'uncategorized' }
      ];

  const handleSelectCategory = (option) => {
    addTransaction({
      title: activeNotification.title || (isIncome ? 'واریز بانکی' : 'خرید بانکی'),
      categoryName: option.categoryName,
      subCategoryName: '',
      categoryId: option.categoryId,
      amount: activeNotification.amount,
      type: activeNotification.type,
      date: 'امروز',
      accountId: activeNotification.accountId || 'card-maskan',
      accountName: activeNotification.accountName || 'کارت روزمره',
      icon: isIncome ? 'TrendingUp' : 'Receipt'
    });

    showToast(`تراکنش در دسته «${option.label}» ثبت شد!`);
    setActiveNotification(null);
  };

  return (
    <div className="absolute top-12 left-3 right-3 z-50 animate-slide-up select-none">
      {/* Android Push Notification Banner Card matching update_notification_record.jpg */}
      <div className="bg-[#f8fafc] text-slate-800 rounded-3xl p-3.5 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.6)] border border-slate-200 flex flex-col space-y-2">
        {/* App Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200/60">
          <button
            onClick={() => setActiveNotification(null)}
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5" dir="ltr">
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-400">now</span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-xs font-black text-[#5b75f8]">Poolaki</span>
            <div className="w-4 h-4 rounded-full bg-[#5b75f8] flex items-center justify-center text-white text-[9px] font-bold">
              P
            </div>
          </div>
        </div>

        {/* Content matching update_notification_record.jpg */}
        <div className="flex items-start justify-between py-1">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400">ثبت سریع</span>
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="font-black text-sm text-slate-900 tracking-tight">
                {isIncome ? 'واریز: ' : 'برداشت: '}
                {formatToman(activeNotification.amount)}
              </span>
              {isIncome ? (
                <span className="text-emerald-600 font-bold text-sm">⬇️</span>
              ) : (
                <span className="text-rose-600 font-bold text-sm">⬆️</span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 font-medium">
              حساب‌کتاب "{activeNotification.accountName || 'کارت روزمره'}"
            </span>
          </div>
        </div>

        {/* Action Category Buttons matching update_notification_record.jpg */}
        <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-slate-200/70">
          {categoryOptions.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectCategory(opt)}
              className="flex-1 py-1.5 px-2 bg-slate-200/80 hover:bg-[#6179fb] hover:text-white active:scale-95 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer text-center"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
