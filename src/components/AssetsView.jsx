import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  CreditCard,
  Wallet,
  Plus,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  Smartphone
} from 'lucide-react';

export default function AssetsView() {
  const {
    accounts,
    setEditingAccount,
    setIsSmsSimulatorOpen,
    setIsSmsPermissionOpen
  } = usePoolaki();

  const totalAssets = accounts.reduce(
    (acc, a) => acc + (a.currentBalance || a.initialBalance || 0),
    0
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-3 space-y-4">
      {/* Total Assets Summary */}
      <div className="bg-gradient-to-br from-[#273043] to-[#1f2535] border border-[#323d54] rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
          <span className="font-semibold text-slate-300">مجموع دارایی‌های نقدی و بانکی</span>
          <span className="text-[10px] text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded-full">
            فعال
          </span>
        </div>
        <div className="text-2xl font-bold text-white tracking-wide mb-2">
          {formatToman(totalAssets)}
        </div>
        <p className="text-[11px] text-slate-400">
          شامل حساب‌های بانکی، کارت‌ها و موجودی نقدی
        </p>
      </div>

      {/* SMS Sync Shortcut Banner */}
      <div className="bg-[#212735] border border-[#2b3345] rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setIsSmsSimulatorOpen(true)}
          className="bg-[#5b75f8] hover:bg-[#4c66e9] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          شبیه‌سازی پیامک
        </button>

        <div className="flex items-center gap-2.5 text-right">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">خواندن خودکار پیامک بانک</span>
            <span className="text-[10px] text-slate-400 mt-0.5">همگام‌سازی تراکنش‌ها بدون ورود دستی</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Accounts & Cards List */}
      <div className="bg-[#212735] border border-[#2b3345] rounded-2xl p-4 shadow-sm flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2d364a]">
          <button
            onClick={() => {
              setEditingAccount({
                id: `acc-${Date.now()}`,
                type: 'card',
                bankName: 'بانک تجارت',
                bankCode: 'tejarat',
                cardNumber: '',
                name: '',
                smsEnabled: true,
                smsSenders: ['TejaratBank'],
                initialBalance: 0,
                currentBalance: 0,
                color: '#1e40af'
              });
            }}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن کارت</span>
          </button>

          <span className="font-bold text-white text-sm">حساب‌ها و کارت‌ها</span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {accounts.map((acc) => {
            const isCard = acc.type === 'card';
            return (
              <div
                key={acc.id}
                onClick={() => setEditingAccount(acc)}
                className="bg-[#283042] border border-[#343f56] hover:border-[#4a5878] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all group"
              >
                {/* Left: Balance & Chevron */}
                <div className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-slate-100 text-sm">
                      {formatToman(acc.currentBalance || acc.initialBalance || 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {acc.smsEnabled ? 'پیامک فعال' : 'ورود دستی'}
                    </span>
                  </div>
                </div>

                {/* Right: Bank name, card number, icon */}
                <div className="flex items-center gap-3 text-right">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-xs">
                      {acc.name || acc.bankName}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5" dir="ltr">
                      {isCard && acc.cardNumber ? acc.cardNumber : acc.type === 'card' ? 'شماره ثبت نشده' : 'کیف پول نقدی'}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#1e2433] border border-[#323d54] flex items-center justify-center text-slate-200">
                    {isCard ? (
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Wallet className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
