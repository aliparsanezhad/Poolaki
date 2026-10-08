import { toEnglishDigits } from './persianNumbers';

/**
 * Parses bank SMS messages in Persian format.
 * Examples:
 * - "بانک تجارت\nبرداشت مبلغ ۳۵۴,۰۰۰ ریال\nاز حساب ۵۸۵۹...۰۵۶۱\nمانده: ۲,۳۸۵,۲۰۰ ریال"
 * - "بانک ملی\nخرید: ۱۵۰,۰۰۰ تومان\nکارت: ۶۰۳۷...۱۲۳۴\nمانده: ۱,۲۰۰,۰۰۰"
 */
export function parseBankSms(smsText) {
  if (!smsText || typeof smsText !== 'string') return null;

  const normalized = toEnglishDigits(smsText);
  
  // Detect transaction type
  let type = 'expense'; // default
  if (/واریز|دریافت|افزایش/i.test(normalized)) {
    type = 'income';
  } else if (/برداشت|خرید|کسر|پرداخت/i.test(normalized)) {
    type = 'expense';
  } else if (/انتقال|کارت به کارت/i.test(normalized)) {
    type = 'transfer';
  }

  // Detect amount
  // Match patterns like: مبلغ 354,000 ریال or خرید: 150000 تومان or 150,000-
  let amount = 0;
  let isRial = /ریال/i.test(normalized);
  
  // Match amount number
  const amountMatch = normalized.match(/(?:مبلغ|خرید|واریز|برداشت|کسر|پرداخت)?\s*[:\-+]?\s*([0-9,]+)\s*(?:تومان|ریال)?/i);
  if (amountMatch && amountMatch[1]) {
    const rawNumber = parseInt(amountMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(rawNumber) && rawNumber > 0) {
      amount = isRial ? Math.round(rawNumber / 10) : rawNumber;
    }
  }

  // Detect card or account suffix (e.g., 0561 or 1234)
  const cardMatch = normalized.match(/(?:کارت|حساب)?\s*([0-9]{4})(?:\s|$|\n)/);
  const cardSuffix = cardMatch ? cardMatch[1] : '';

  // Detect bank
  let bankName = 'کارت بانکی';
  if (/تجارت/i.test(normalized)) bankName = 'تجارت';
  else if (/ملی/i.test(normalized)) bankName = 'ملی';
  else if (/ملت/i.test(normalized)) bankName = 'ملت';
  else if (/سامان/i.test(normalized)) bankName = 'سامان';
  else if (/پاسارگاد/i.test(normalized)) bankName = 'پاسارگاد';
  else if (/بلو/i.test(normalized)) bankName = 'بلو';

  return {
    raw: smsText,
    type,
    amount,
    cardSuffix,
    bankName,
    date: 'امروز',
    title: type === 'income' ? 'واریز پیامکی' : 'خرید پیامکی'
  };
}
