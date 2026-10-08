import React, { useRef, useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import {
  X,
  FileText,
  Download,
  Upload,
  Trash2,
  Share2,
  Folder,
  Cloud,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DataManagementModal() {
  const {
    isDataManagementOpen,
    setIsDataManagementOpen,
    transactions,
    dues,
    backups,
    createBackup,
    restoreBackupData,
    resetAllData,
    showToast
  } = usePoolaki();

  const fileInputRef = useRef(null);
  const [isDropboxConnected, setIsDropboxConnected] = useState(false);

  if (!isDataManagementOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        restoreBackupData(json);
      } catch (err) {
        showToast('فایل پشتیبان نامعتبر است');
      }
    };
    reader.readAsText(file);
  };

  const handleDropboxToggle = () => {
    setIsDropboxConnected(!isDropboxConnected);
    showToast(!isDropboxConnected ? 'اتصال به Dropbox برقرار شد' : 'اتصال به Dropbox قطع شد');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border border-[#2f384d] rounded-3xl p-5 shadow-2xl flex flex-col h-[90vh]">
        {/* Header matching photo_10 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d364a]">
          <div className="w-5"></div>
          <span className="font-bold text-white text-base">مدیریت داده‌های من</span>
          <button
            onClick={() => setIsDataManagementOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
          {/* Dropbox Card matching photo_10 */}
          <div
            onClick={handleDropboxToggle}
            className="bg-[#242b3b] hover:bg-[#2d364b] border border-[#333e56] rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-sm"
          >
            <span className="text-slate-400 text-xs font-semibold">
              {isDropboxConnected ? 'متصل شد ✓' : '<'}
            </span>

            <div className="flex items-center gap-2.5">
              <span className="font-bold text-slate-100 text-xs">اتصال به دراپ‌باکس</span>
              <Cloud className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center leading-relaxed px-4">
            هرچندوقت از داده‌هات پشتیبان‌گیری کن تا یه جای امن ذخیره بشن
          </p>

          {/* Current Poolaki Data Card matching photo_10 */}
          <div className="bg-[#242b3b] border border-[#333e56] rounded-2xl p-4 space-y-3 shadow-sm">
            <span className="text-xs font-bold text-slate-200 block text-right">
              داده‌های فعلی پولکی
            </span>

            {/* Stats row matching photo_10 */}
            <div className="bg-[#1b212f] border border-[#2e374b] rounded-2xl px-4 py-3 flex items-center justify-end gap-2 text-slate-200 text-xs font-bold">
              <span>
                {transactions.length} تراکنش، {dues.length} سررسید
              </span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>

            {/* Primary Action Button: پشتیبان بگیر! */}
            <button
              type="button"
              onClick={createBackup}
              className="w-full bg-[#5b75f8] hover:bg-[#4d69f0] active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer text-xs"
            >
              <Download className="w-4 h-4" />
              <span>پشتیبان بگیر!</span>
            </button>

            {/* Secondary Action: بارگذاری فایل پشتیبان */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".plk,.json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#1e2535] hover:bg-[#283144] border border-[#333e56] text-slate-200 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>بارگذاری فایل پشتیبان</span>
            </button>

            {/* Destructive Action: حذف همه‌چیز */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('آیا از پاک کردن کامل تمام اطلاعات اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
                  resetAllData();
                }
              }}
              className="w-full bg-[#1e2535] hover:bg-rose-950/40 border border-rose-900/40 text-rose-400 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف همه‌چیز</span>
            </button>
          </div>

          {/* Backup History Card matching photo_10 */}
          <div className="bg-[#242b3b] border border-[#333e56] rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]" dir="ltr">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Download/Poolaki/backups</span>
              </div>
              <span className="font-bold text-white">تاریخچه پشتیبان‌گیری</span>
            </div>

            {/* Backup items matching photo_10 */}
            <div className="space-y-2">
              {backups.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#1b212f] border border-[#2d364b] hover:border-[#3f4d6d] rounded-2xl p-3 flex items-center justify-between transition-colors"
                >
                  {/* Share button */}
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`لینک اشتراک‌گذاری فایل ${b.filename} آماده است`);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* File info and PLK badge */}
                  <div className="flex items-center gap-3 text-right">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200 text-xs" dir="ltr">
                        {b.filename}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {b.date}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-600/40 text-blue-300 font-black text-[9px] flex items-center justify-center shrink-0">
                      PLK
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
