import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { MessageSquare, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SmsSimulatorModal() {
  const {
    isSmsSimulatorOpen,
    setIsSmsSimulatorOpen,
    simulateSmsReceived,
    accounts
  } = usePoolaki();

  const [customSms, setCustomSms] = useState('');

  if (!isSmsSimulatorOpen) return null;

  const presets = [
    {
      title: 'خرید از اسنپ‌فود (تجارت)',
      text: 'بانک تجارت\nبرداشت مبلغ ۳۵۴,۰۰۰ تومان\nاز کارت ۵۸۵۹...۰۵۶۱\nخرید: اسنپ فود\nمانده: ۲,۰۳۱,۲۰۰ تومان'
    },
    {
      title: 'بنزین سوپر (تجارت)',
      text: 'بانک تجارت\nبرداشت: ۹۰,۰۰۰ تومان\nکارت: ۵۸۵۹...۰۵۶۱\nپمپ بنزین شماره ۱۴\nمانده: ۱,۹۴۱,۲۰۰'
    },
    {
      title: 'واریز حقوق ماهانه (ملی)',
      text: 'بانک ملی ایران\nواریز مبلغ ۱۲,۵۰۰,۰۰۰ تومان\nبه حساب ۶۰۳۷...۹۸۷۶\nبابت: حقوق و دستمزد\nمانده: ۱۴,۰۰۰,۰۰۰'
    },
    {
      title: 'خرید کارگاه نقره‌کاری',
      text: 'بانک تجارت\nبرداشت مبلغ ۱۵۰,۰۰۰ تومان\nاز کارت ۵۸۵۹...۰۵۶۱\nخرید ابزار نقره\nمانده: ۱,۷۹۱,۲۰۰'
    }
  ];

  const handleTestSms = (text) => {
    const success = simulateSmsReceived(text);
    if (success) {
      setIsSmsSimulatorOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border border-[#2f384d] rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d364a]">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>شبیه‌ساز پیامک بانکی (تست زنده)</span>
          </div>

          <button
            onClick={() => setIsSmsSimulatorOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
          <p className="text-xs text-slate-300 leading-relaxed text-right">
            در برنامه اصلی پولکی، با دریافت هر پیامک واریز یا برداشت از بانک، تراکنش بدون نیاز به ورود دستی ثبت می‌شود. با انتخاب یا ارسال یکی از پیامک‌های زیر، تست کنید:
          </p>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block text-right">
              نمونه‌های آماده پیامک بانک:
            </span>
            {presets.map((p, idx) => (
              <div
                key={idx}
                onClick={() => handleTestSms(p.text)}
                className="bg-[#1c2230] hover:bg-[#283144] border border-[#2d364b] hover:border-blue-500/50 rounded-2xl p-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-blue-400 font-bold group-hover:underline">
                    تست و ثبت تراکنش
                  </span>
                  <span className="text-xs font-bold text-white">{p.title}</span>
                </div>
                <pre className="text-[11px] text-slate-400 font-vazir whitespace-pre-wrap text-right leading-relaxed bg-[#151922] p-2 rounded-xl border border-[#242b3c]" dir="rtl">
                  {p.text}
                </pre>
              </div>
            ))}
          </div>

          {/* Custom SMS Input */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 block text-right">
              متن پیامک دلخواه خود را بنویسید یا الصاق کنید:
            </span>
            <textarea
              rows={3}
              value={customSms}
              onChange={(e) => setCustomSms(e.target.value)}
              placeholder="مثال: برداشت مبلغ ۵۰,۰۰۰ تومان از کارت تجارت خرید نان..."
              className="w-full bg-[#1c2230] border border-[#303a50] rounded-2xl p-3 text-xs text-white placeholder-slate-500 outline-none text-right font-vazir resize-none"
            />

            <button
              type="button"
              onClick={() => handleTestSms(customSms)}
              disabled={!customSms.trim()}
              className="w-full bg-[#5b75f8] hover:bg-[#4d69f0] disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>پردازش و ثبت تراکنش از متن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
