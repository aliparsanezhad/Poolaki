import React from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { MessageSquare, ShieldCheck, Check } from 'lucide-react';

export default function SmsPermissionModal() {
  const {
    isSmsPermissionOpen,
    setIsSmsPermissionOpen,
    setIsSmsSimulatorOpen,
    showToast
  } = usePoolaki();

  if (!isSmsPermissionOpen) return null;

  const handleGrant = () => {
    setIsSmsPermissionOpen(false);
    showToast('دسترسی به پیامک‌های بانکی با موفقیت فعال شد');
    setIsSmsSimulatorOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border-t border-[#343e56] rounded-t-3xl p-6 shadow-2xl flex flex-col space-y-5 animate-slide-up text-center">
        {/* Top Handle */}
        <div className="w-12 h-1.5 bg-slate-600/70 rounded-full mx-auto"></div>

        <div className="w-16 h-16 rounded-3xl bg-blue-500/15 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center shadow-inner">
          <MessageSquare className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">دسترسی به پیامک بانک</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            می‌تونی به پولکی دسترسی بدی تا دخل و خرج رو مستقیم از پیامک‌های بانکی بیاره و برای شما نمایش بده.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleGrant}
            className="w-full bg-[#5b75f8] hover:bg-[#4d69f0] active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer text-sm"
          >
            دسترسی می‌دهم
          </button>

          <button
            type="button"
            onClick={() => setIsSmsPermissionOpen(false)}
            className="w-full text-slate-400 hover:text-white py-2.5 text-xs font-semibold cursor-pointer transition-colors"
          >
            فعلاً نه
          </button>
        </div>
      </div>
    </div>
  );
}
