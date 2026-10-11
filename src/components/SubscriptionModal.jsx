import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { formatToman } from '../utils/persianNumbers';
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Percent,
  Gift,
  ArrowRight
} from 'lucide-react';

export default function SubscriptionModal() {
  const {
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    subscription,
    activateSubscription,
    showToast
  } = usePoolaki();

  const [selectedPlan, setSelectedPlan] = useState('pro_year');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isSubscriptionModalOpen) return null;

  const plans = [
    {
      id: 'pro_month',
      title: 'حرفه‌ای (ماهانه)',
      price: 49000,
      period: 'ماه',
      badge: null,
      desc: 'مناسب تست امکانات پیشرفته'
    },
    {
      id: 'pro_year',
      title: 'حرفه‌ای (سالانه)',
      price: 390000,
      originalPrice: 588000,
      period: 'سال',
      badge: '۳۵٪ تخفیف ویژه',
      isPopular: true,
      desc: 'محبوب‌ترین طرح برای مدیریت هوشمند'
    },
    {
      id: 'vip_lifetime',
      title: 'الماس (مادام‌العمر)',
      price: 890000,
      period: 'همیشگی',
      badge: 'یکبار پرداخت',
      desc: 'دسترسی همیشگی به تمام آپدیت‌های آینده'
    }
  ];

  const currentPlanObj = plans.find((p) => p.id === selectedPlan) || plans[1];
  const finalPrice = Math.round(
    currentPlanObj.price * (1 - discountPercent / 100)
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'JEEBYAR50' || code === 'NOROOZ' || code === 'VIP') {
      setDiscountPercent(50);
      setCouponApplied(true);
      showToast('کد تخفیف ۵۰ درصدی با موفقیت اعمال شد! 🎁');
    } else if (code) {
      showToast('کد تخفیف وارد شده معتبر نیست');
    }
  };

  const handlePayment = () => {
    activateSubscription(selectedPlan, couponCode);
  };

  const features = [
    'ماشین حساب هوشمند درون‌فرمی با جاگذاری از کلیپ‌بورد',
    'ثبت یکجای پیامک‌های تلمبار شده با یک دکمه (صندوق هوشمند)',
    'ثبت تراکنش بدون باز کردن اپلیکیشن از طریق اعلان (Push Notification)',
    'پشتیبانی کامل از پیامک تمام بانک‌ها (مسکن، تجارت، ملی، بلو و...)',
    'ارزش‌گذاری لحظه‌ای طلا، سکه، تتر و رمزارز با نرخ روز',
    'پیش‌بینی هوشمند تاب‌آوری مالی تا سر برج و امتیاز سلامت مالی',
    'اسکنر هوش مصنوعی برای خواندن عکس فیش و رسید پوز',
    'ماشین حساب خرج مشترک و دنگ سفر با دوستان',
    'پشتیبان‌گیری ابری و صدور گزارش اکسل/PDF'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1c2436] to-[#121824] border border-amber-500/30 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d384c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-white text-sm block">ارتقا به جیب‌یار PRO</span>
              <span className="text-[10px] text-amber-400">دسترسی نامحدود به تمام امکانات هوشمند</span>
            </div>
          </div>

          <button
            onClick={() => setIsSubscriptionModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Plan Status */}
        {subscription.isPro && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3 my-2 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold">
              ✓ هم‌اکنون دارای اشتراک فعال هستید ({subscription.planName})
            </span>
            <span className="text-[10px] text-slate-400">انقضا: {subscription.expiresAt}</span>
          </div>
        )}

        {/* Plans Selector */}
        <div className="space-y-2.5 my-3">
          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#253046] border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-[#182030] border-[#2b354a] hover:border-slate-500'
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-2.5 left-4 bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    {p.badge}
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                    </div>

                    <div className="flex flex-col text-right">
                      <span className="font-bold text-white text-xs">{p.title}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{p.desc}</span>
                    </div>
                  </div>

                  <div className="flex flex-col text-left" dir="ltr">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black text-amber-300 font-vazir">
                        {formatToman(p.price)}
                      </span>
                    </div>
                    {p.originalPrice && (
                      <span className="text-[10px] text-slate-500 line-through">
                        {formatToman(p.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon Code Input */}
        <form onSubmit={handleApplyCoupon} className="flex gap-2 my-1">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="کد تخفیف (مثال: JEEBYAR50)"
            className="flex-1 bg-[#182030] border border-[#2d384c] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none text-right font-vazir"
            dir="ltr"
          />
          <button
            type="submit"
            className="bg-[#2d374f] hover:bg-[#3b4763] text-amber-400 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors"
          >
            اعمال کد
          </button>
        </form>

        {couponApplied && (
          <span className="text-[11px] text-emerald-400 text-right pr-1 block">
            ✓ ۵۰٪ تخفیف روی فاکتور شما اعمال شد!
          </span>
        )}

        {/* Feature List */}
        <div className="bg-[#161c2a] rounded-2xl p-3 my-2 space-y-1.5 border border-[#263044]">
          <span className="text-[11px] font-bold text-slate-300 block text-right mb-1">
            امکانات فعال‌شده در نسخه پرو:
          </span>
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300 justify-end">
              <span>{feat}</span>
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
          ))}
        </div>

        {/* Gateway Simulation Button */}
        <button
          type="button"
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:opacity-95 active:scale-[0.99] text-slate-950 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer text-sm mt-2"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>
            پرداخت و فعال‌سازی فوری ({formatToman(finalPrice)})
          </span>
        </button>

        <span className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ضمانت بازگشت وجه ۷ روزه و اتصال امن شتاب
        </span>
      </div>
    </div>
  );
}
