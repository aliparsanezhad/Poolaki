import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { detectBankFromCardNumber, formatCardNumber16 } from '../utils/bankDetector';
import { toEnglishDigits, formatNumberWithCommas } from '../utils/persianNumbers';
import {
  CreditCard,
  Wallet,
  Trash2,
  X,
  MessageSquare,
  Plus,
  ChevronLeft,
  Building2
} from 'lucide-react';

export default function EditAccountModal() {
  const {
    editingAccount,
    setEditingAccount,
    updateAccount,
    addAccount,
    accounts,
    showToast
  } = usePoolaki();

  const isExisting = accounts.some((a) => a.id === editingAccount?.id);

  const [type, setType] = useState(editingAccount?.type || 'card');
  const [cardNumber, setCardNumber] = useState(editingAccount?.cardNumber || '5859 8310 2691 0561');
  const [name, setName] = useState(editingAccount?.name || 'تجارت');
  const [smsEnabled, setSmsEnabled] = useState(editingAccount?.smsEnabled ?? true);
  const [senders, setSenders] = useState(editingAccount?.smsSenders || ['TejaratBank']);
  const [hasInitialBalance, setHasInitialBalance] = useState(true);
  const [initialBalanceStr, setInitialBalanceStr] = useState(
    formatNumberWithCommas(editingAccount?.initialBalance || 2385200)
  );
  const [newSenderInput, setNewSenderInput] = useState('');
  const [isAddingSender, setIsAddingSender] = useState(false);

  if (!editingAccount) return null;

  const detectedBank = detectBankFromCardNumber(cardNumber);
  const bankName = detectedBank?.name || editingAccount?.bankName || 'بانک نامشخص';

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber16(e.target.value);
    setCardNumber(formatted);
  };

  const handleBalanceChange = (e) => {
    const raw = toEnglishDigits(e.target.value).replace(/[^0-9]/g, '');
    if (!raw) {
      setInitialBalanceStr('');
      return;
    }
    const num = parseInt(raw, 10);
    setInitialBalanceStr(formatNumberWithCommas(num));
  };

  const handleAddSender = (e) => {
    e.preventDefault();
    if (!newSenderInput.trim()) return;
    setSenders([...senders, newSenderInput.trim()]);
    setNewSenderInput('');
    setIsAddingSender(false);
  };

  const handleRemoveSender = (index) => {
    setSenders(senders.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const rawBal = parseInt(toEnglishDigits(initialBalanceStr).replace(/[^0-9]/g, ''), 10) || 0;

    const updated = {
      ...editingAccount,
      type,
      cardNumber: type === 'card' ? cardNumber : '',
      bankName: type === 'card' ? bankName : '',
      bankCode: detectedBank?.code || 'custom',
      name: name.trim() || (type === 'card' ? bankName : 'کیف پول'),
      smsEnabled,
      smsSenders: senders,
      initialBalance: hasInitialBalance ? rawBal : 0,
      currentBalance: hasInitialBalance ? rawBal : 0
    };

    if (isExisting) {
      updateAccount(updated);
    } else {
      addAccount(updated);
    }

    setEditingAccount(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border border-[#2f384d] rounded-3xl p-5 shadow-2xl flex flex-col h-[90vh]">
        {/* Header matching photo_7 & photo_8 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d364a]">
          <button
            onClick={() => {
              if (window.confirm('آیا از حذف این حساب اطمینان دارید؟')) {
                setEditingAccount(null);
                showToast('حساب حذف شد');
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
            title="حذف حساب"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <span className="font-bold text-white text-base">ویرایش حساب‌کتاب</span>

          <button
            onClick={() => setEditingAccount(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* Account Type Toggle matching photo_8 */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 block text-right">
              نوع حساب‌کتاب
            </span>
            <div className="grid grid-cols-2 gap-2 bg-[#1b212f] p-1 rounded-2xl border border-[#2b3549]">
              <button
                type="button"
                onClick={() => setType('other')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'other'
                    ? 'bg-[#5b75f8] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>منبع دیگر</span>
                <Wallet className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setType('card')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'card'
                    ? 'bg-[#5b75f8] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>کارت بانکی</span>
                <CreditCard className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 16-Digit Card Number matching photo_8 */}
          {type === 'card' && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 block text-right">
                شماره کارت ۱۶ رقمی
              </span>
              <div className="bg-[#1c2230] border border-[#303a50] rounded-2xl px-4 py-3 text-center">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="۵۸۵۹ ۸۳۱۰ ۲۶۹۱ ۰۵۶۱"
                  className="w-full bg-transparent text-center text-xl font-bold text-white tracking-widest outline-none font-vazir"
                  dir="ltr"
                />
              </div>

              {/* Detected Bank Name with icon */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-400 pt-1">
                <Building2 className="w-4 h-4" />
                <span>{bankName}</span>
              </div>
            </div>
          )}

          {/* Card Nickname (Optional) matching photo_8 */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 block text-right">
              نام کارت (اختیاری)
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="تجارت"
              className="w-full bg-[#1c2230] border border-[#303a50] rounded-2xl px-4 py-3 text-sm text-white font-semibold outline-none text-right font-vazir"
            />
            <p className="text-[10px] text-slate-400 text-right leading-relaxed pr-1">
              اگر برای کارتت اسم بذاری، این نام رو به جای شماره کارت نمایش می‌دیم
            </p>
          </div>

          <div className="border-t border-[#2e374b] my-2"></div>

          {/* Toggle: خواندن پیامک‌های بانک matching photo_7 & photo_8 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  smsEnabled ? 'bg-[#5b75f8]' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    smsEnabled ? 'right-1' : 'right-7'
                  }`}
                />
              </button>

              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white">خواندن پیامک‌های بانک</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  دخل و خرج مستقیم از پیامک خونده می‌شه
                </span>
              </div>
            </div>

            {/* Senders List matching photo_7 */}
            {smsEnabled && (
              <div className="space-y-2 pt-1 animate-fade-in">
                {senders.map((sender, index) => (
                  <div
                    key={index}
                    className="bg-[#242b3b] border border-[#333e56] rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveSender(index)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200" dir="ltr">
                        {sender}
                      </span>
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}

                {isAddingSender ? (
                  <form onSubmit={handleAddSender} className="flex items-center gap-2 bg-[#1b212f] p-2 rounded-2xl border border-[#344057]">
                    <input
                      type="text"
                      value={newSenderInput}
                      onChange={(e) => setNewSenderInput(e.target.value)}
                      placeholder="مثال: TejaratBank یا 200073"
                      className="flex-1 bg-[#252c3c] text-white text-xs px-3 py-1.5 rounded-xl outline-none"
                      dir="ltr"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-[#5b75f8] text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                    >
                      ثبت
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingSender(true)}
                    className="w-full py-1 text-center text-[#6179fb] hover:text-[#7f94fd] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن شماره جدید</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-[#2e374b] my-2"></div>

          {/* Toggle: موجودی اولیه کارت matching photo_7 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setHasInitialBalance(!hasInitialBalance)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  hasInitialBalance ? 'bg-[#5b75f8]' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    hasInitialBalance ? 'right-1' : 'right-7'
                  }`}
                />
              </button>

              <span className="text-xs font-bold text-white text-right">
                موجودی اولیه کارت
              </span>
            </div>

            {hasInitialBalance && (
              <div className="bg-[#1c2230] border border-[#303a50] rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400 text-xs">تومان</span>
                <input
                  type="text"
                  value={initialBalanceStr}
                  onChange={handleBalanceChange}
                  className="bg-transparent text-right text-lg font-bold text-white outline-none flex-1 font-vazir"
                  dir="ltr"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA matching photo_7: ثبت تغییرات > */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-[#5b75f8] hover:bg-[#4d69f0] active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-1 shadow-lg shadow-blue-600/25 transition-all cursor-pointer text-sm mt-3"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ثبت تغییرات</span>
        </button>
      </div>
    </div>
  );
}
