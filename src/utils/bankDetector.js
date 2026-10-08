import { toEnglishDigits } from './persianNumbers';

export const IRAN_BANKS = [
  { bin: '585983', name: 'بانک تجارت', smsSender: 'TejaratBank', code: 'tejarat', color: '#1e40af' },
  { bin: '603799', name: 'بانک ملی ایران', smsSender: 'B.Melli', code: 'melli', color: '#991b1b' },
  { bin: '610433', name: 'بانک ملت', smsSender: 'BankMellat', code: 'mellat', color: '#b91c1c' },
  { bin: '621986', name: 'بانک سامان', smsSender: 'SamanBank', code: 'saman', color: '#0369a1' },
  { bin: '502229', name: 'بانک پاسارگاد', smsSender: 'Pasargad', code: 'pasargad', color: '#ca8a04' },
  { bin: '622106', name: 'بانک پارسیان', smsSender: 'Parsian', code: 'parsian', color: '#92400e' },
  { bin: '603769', name: 'بانک صادرات', smsSender: 'BSI', code: 'saderat', color: '#1e3a8a' },
  { bin: '504706', name: 'بانک شهر', smsSender: 'ShahrBank', code: 'shahr', color: '#b45309' },
  { bin: '628023', name: 'بانک مسکن', smsSender: 'Maskan', code: 'maskan', color: '#c2410c' },
  { bin: '589463', name: 'بانک رفاه', smsSender: 'Refah', code: 'refah', color: '#15803d' },
  { bin: '627412', name: 'بانک اقتصاد نوین', smsSender: 'ENBank', code: 'en', color: '#4338ca' },
  { bin: '639346', name: 'بانک سینا', smsSender: 'SinaBank', code: 'sina', color: '#0f766e' },
  { bin: '8601', name: 'بلوبانک', smsSender: 'blubank', code: 'blu', color: '#2563eb' }
];

export function detectBankFromCardNumber(cardNumber) {
  if (!cardNumber) return null;
  const cleaned = toEnglishDigits(cardNumber).replace(/[^0-9]/g, '');
  if (cleaned.length < 4) return null;

  for (const bank of IRAN_BANKS) {
    if (cleaned.startsWith(bank.bin)) {
      return bank;
    }
  }

  // Fallback default
  return null;
}

export function formatCardNumber16(value) {
  if (!value) return '';
  const digits = toEnglishDigits(value).replace(/[^0-9]/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
}
