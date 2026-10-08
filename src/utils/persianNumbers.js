// Persian digits conversion and currency formatting

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toPersianDigits(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str.replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

export function toEnglishDigits(value) {
  if (!value) return '';
  let str = String(value);
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(PERSIAN_DIGITS[i], 'g'), ENGLISH_DIGITS[i]);
  }
  return str;
}

export function formatNumberWithCommas(num) {
  if (num === null || num === undefined || num === '') return '۰';
  const rawNum = typeof num === 'number' ? num : parseInt(toEnglishDigits(num).replace(/[^0-9-]/g, ''), 10) || 0;
  const parts = Math.abs(rawNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = rawNum < 0 ? '-' : '';
  return sign + toPersianDigits(parts);
}

export function formatToman(amount, showSign = false) {
  if (amount === null || amount === undefined) return '۰ تومان';
  const num = typeof amount === 'number' ? amount : parseInt(toEnglishDigits(amount).replace(/[^0-9-]/g, ''), 10) || 0;
  const formatted = formatNumberWithCommas(Math.abs(num));
  let sign = '';
  if (showSign && num !== 0) {
    sign = num < 0 ? '- ' : '+ ';
  }
  return `${sign}${formatted} تومان`;
}

// Persian solar month names
export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

export const PERSIAN_WEEKDAYS = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
];

// Helper to format date label
export function getSampleJalaliToday() {
  return 'پنجشنبه ۱۶ مهر ۱۴۰۵';
}
