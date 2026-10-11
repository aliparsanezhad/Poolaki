import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  ScanLine,
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  Receipt,
  FileText,
  CreditCard,
  Building2,
  ArrowRight
} from 'lucide-react';

export default function ReceiptScannerModal() {
  const {
    isReceiptScannerOpen,
    setIsReceiptScannerOpen,
    addTransaction,
    accounts,
    showToast
  } = usePoolaki();

  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  if (!isReceiptScannerOpen) return null;

  const sampleReceipts = [
    {
      title: 'رسید کاغذی پوز افق کوروش',
      amount: 425000,
      type: 'expense',
      merchant: 'فروشگاه زنجیره‌ای افق کوروش (شعبه شریعتی)',
      card: '۶۲۸۰...۳۴۵۶ (کارت روزمره مسکن)',
      refId: '۸۹۲۳۴۱۰۱',
      category: 'خوردنی',
      subCategory: 'سوپرمارکت',
      date: 'امروز، ساعت ۱۸:۳۰',
      icon: 'UtensilsCrossed'
    },
    {
      title: 'رسید انتقال بلوبانک',
      amount: 3800000,
      type: 'expense',
      merchant: 'کارت‌به‌کارت اجاره‌بها',
      card: '۵۸۵۹...۰۵۶۱ (بانک تجارت)',
      refId: '۵۵۴۹۱۲۰۲',
      category: 'اقساط',
      subCategory: 'اجاره مسکن',
      date: 'امروز، ساعت ۱۴:۱۵',
      icon: 'Building2'
    },
    {
      title: 'فیش پوز پمپ بنزین',
      amount: 90000,
      type: 'expense',
      merchant: 'جایگاه سوخت آزادی شماره ۱۲',
      card: '۶۲۸۰...۳۴۵۶ (بانک مسکن)',
      refId: '۱۰۲۹۴۸۳۳',
      category: 'خودرو و سوخت',
      subCategory: 'بنزین',
      date: 'امروز، ساعت ۰۹:۴۰',
      icon: 'Fuel'
    }
  ];

  const handleSimulateScan = (receipt) => {
    setIsScanning(true);
    setScannedResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(receipt);
    }, 1200);
  };

  const handleConfirmTransaction = () => {
    if (!scannedResult) return;

    addTransaction({
      title: scannedResult.merchant,
      categoryName: scannedResult.category,
      subCategoryName: scannedResult.subCategory,
      categoryId: 'food',
      amount: scannedResult.amount,
      type: scannedResult.type,
      date: 'امروز',
      accountId: 'card-maskan',
      accountName: 'کارت روزمره',
      icon: scannedResult.icon || 'Receipt'
    });

    showToast(`تراکنش ${scannedResult.amount.toLocaleString()} تومانی با هوش مصنوعی ثبت شد! ✨`);
    setIsReceiptScannerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#1e2536] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d384c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">اسکن هوشمند رسید و فیش پوز</span>
              <span className="text-[10px] text-cyan-400">هوش مصنوعی استخراج خودکار مبلغ، کارت و پذیرنده</span>
            </div>
          </div>

          <button
            onClick={() => setIsReceiptScannerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone / Drop Area */}
        <div className="border-2 border-dashed border-cyan-500/30 bg-[#161c2a] rounded-2xl p-4 my-3 text-center flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
          {isScanning && (
            <div className="absolute inset-0 bg-cyan-950/60 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 z-10 animate-fade-in">
              <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-cyan-300">در حال پردازش OCR تصویر رسید...</span>
            </div>
          )}

          <Upload className="w-8 h-8 text-cyan-400" />
          <span className="text-xs font-bold text-white">تصویر یا اسکرین‌شات رسید را انتخاب کنید</span>
          <span className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
            پشتیبانی از رسید اپلیکیشن‌های بلو، آپ، همراه کارت و برگه کاغذی دستگاه پوز
          </span>
        </div>

        {/* Presets to test instantly */}
        <div className="space-y-2 mb-3">
          <span className="text-[11px] font-bold text-slate-400 block text-right">
            یا یکی از نمونه‌های زیر را برای تست فوری کلیک کنید:
          </span>

          <div className="grid grid-cols-1 gap-2">
            {sampleReceipts.map((r, idx) => (
              <div
                key={idx}
                onClick={() => handleSimulateScan(r)}
                className="bg-[#171d2b] hover:bg-[#252f44] border border-[#2b364c] hover:border-cyan-500/50 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all group"
              >
                <span className="text-xs font-bold text-cyan-400 group-hover:underline">
                  تست اسکن
                </span>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-white">{r.title}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{r.merchant}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scanned Result Card */}
        {scannedResult && (
          <div className="bg-[#182133] border border-emerald-500/40 rounded-2xl p-4 space-y-3 animate-fade-in shadow-lg">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#2d384c]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                اطلاعات با موفقیت استخراج شد
              </span>
              <span className="text-[10px] text-slate-400">کد پیگیری: {scannedResult.refId}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="font-black text-emerald-400 text-sm">
                  {formatToman(scannedResult.amount)}
                </span>
                <span className="text-slate-400">مبلغ استخراج شده:</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-200">{scannedResult.merchant}</span>
                <span className="text-slate-400">پذیرنده / مقصد:</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300" dir="ltr">{scannedResult.card}</span>
                <span className="text-slate-400">کارت بانکی:</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400 font-bold">
                  {scannedResult.category} &gt; {scannedResult.subCategory}
                </span>
                <span className="text-slate-400">دسته‌بندی هوشمند:</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmTransaction}
              className="w-full bg-[#10b981] hover:bg-[#059669] active:scale-[0.99] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer text-xs mt-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ثبت مستقیم در تراکنش‌ها</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
