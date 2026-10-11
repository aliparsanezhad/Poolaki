import React, { useState, useEffect } from 'react';
import { toPersianDigits, toEnglishDigits, formatNumberWithCommas } from '../utils/persianNumbers';
import { Delete, Check, ClipboardPaste, RotateCcw } from 'lucide-react';

export default function CalculatorKeypad({ initialValue, onConfirm, onClose }) {
  // Current expression string e.g. "30120000 - 55000"
  const [expression, setExpression] = useState(() => {
    const raw = toEnglishDigits(initialValue || '').replace(/[^0-9]/g, '');
    return raw || '0';
  });

  const [clipboardHint, setClipboardHint] = useState(false);

  // Evaluate the expression safely
  const evaluateExpression = (expr) => {
    try {
      // Replace Persian/human operators with JS operators
      const sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/[^0-9+\-*/.]/g, '');

      if (!sanitized) return 0;
      // If ends with an operator, ignore trailing operator for live preview
      const cleanExpr = sanitized.replace(/[+\-*/.]+$/, '');
      if (!cleanExpr) return 0;

      // Safe evaluation of basic math expressions
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${cleanExpr})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Math.max(0, Math.round(result));
      }
      return 0;
    } catch {
      return 0;
    }
  };

  const currentResult = evaluateExpression(expression);

  // Handle number or operator press
  const handleKey = (key) => {
    setExpression((prev) => {
      if (prev === '0' && /[0-9]/.test(key)) {
        return key;
      }
      const lastChar = prev.slice(-1);
      const isOperator = ['+', '-', '×', '÷'].includes(key);
      const lastIsOperator = ['+', '-', '×', '÷'].includes(lastChar);

      if (isOperator && lastIsOperator) {
        // Replace operator
        return prev.slice(0, -1) + key;
      }

      return prev + key;
    });
  };

  // Backspace
  const handleBackspace = () => {
    setExpression((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  // Clear
  const handleClear = () => {
    setExpression('0');
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numOnly = toEnglishDigits(text).replace(/[^0-9]/g, '');
      if (numOnly) {
        setExpression(numOnly);
        setClipboardHint(true);
        setTimeout(() => setClipboardHint(false), 2000);
      }
    } catch {
      // Clipboard access might be blocked
    }
  };

  // Format the expression with Persian digits and commas
  const formatExpressionDisplay = (expr) => {
    // Break by operators and format numbers with commas
    return expr
      .split(/([+\-×÷])/)
      .map((part) => {
        if (['+', '-', '×', '÷'].includes(part)) {
          return ` ${part} `;
        }
        const num = parseInt(part, 10);
        return isNaN(num) ? part : toPersianDigits(part.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      })
      .join('');
  };

  const handleFinish = () => {
    const finalAmount = evaluateExpression(expression);
    onConfirm(finalAmount);
  };

  return (
    <div className="bg-[#242b3b] border-t border-[#344057] rounded-t-3xl p-4 shadow-2xl flex flex-col space-y-3 animate-slide-up select-none">
      {/* Top Display Bar matching update_calculator.jpg */}
      <div className="bg-[#1b212f] border border-[#2d384c] rounded-2xl p-3 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded-lg transition-colors"
          >
            <ClipboardPaste className="w-3 h-3" />
            <span>جاگذاری از کلیپ‌بورد</span>
          </button>

          <span className="text-[10px] text-slate-400">ماشین‌حساب پولکی 🧮</span>
        </div>

        {/* Formula Display */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="text-right text-xs font-medium text-slate-400 font-vazir truncate max-w-[180px]" dir="ltr">
            {formatExpressionDisplay(expression)}
          </div>

          <div className="text-left flex items-baseline gap-1" dir="ltr">
            <span className="text-xs text-slate-400">=</span>
            <span className="text-xl font-bold text-white font-vazir">
              {toPersianDigits(currentResult.toLocaleString())}
            </span>
            <span className="text-[11px] text-slate-400 mr-1">تومان</span>
          </div>
        </div>

        {clipboardHint && (
          <span className="text-[10px] text-emerald-400 text-center animate-fade-in">
            مبلغ از حافظه کپی شد!
          </span>
        )}
      </div>

      {/* Calculator Keypad Grid matching update_calculator.jpg */}
      <div className="grid grid-cols-4 gap-2 text-base font-bold">
        {/* Row 1: 1, 2, 3, + */}
        <button
          type="button"
          onClick={() => handleKey('1')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۱
        </button>
        <button
          type="button"
          onClick={() => handleKey('2')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۲
        </button>
        <button
          type="button"
          onClick={() => handleKey('3')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۳
        </button>
        <button
          type="button"
          onClick={() => handleKey('+')}
          className="bg-[#6179fb] hover:bg-[#4f6bf9] active:scale-95 text-white py-3.5 rounded-2xl shadow-md transition-transform cursor-pointer text-xl"
        >
          +
        </button>

        {/* Row 2: 4, 5, 6, - */}
        <button
          type="button"
          onClick={() => handleKey('4')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۴
        </button>
        <button
          type="button"
          onClick={() => handleKey('5')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۵
        </button>
        <button
          type="button"
          onClick={() => handleKey('6')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۶
        </button>
        <button
          type="button"
          onClick={() => handleKey('-')}
          className="bg-[#6179fb] hover:bg-[#4f6bf9] active:scale-95 text-white py-3.5 rounded-2xl shadow-md transition-transform cursor-pointer text-xl"
        >
          -
        </button>

        {/* Row 3: 7, 8, 9, × */}
        <button
          type="button"
          onClick={() => handleKey('7')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۷
        </button>
        <button
          type="button"
          onClick={() => handleKey('8')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۸
        </button>
        <button
          type="button"
          onClick={() => handleKey('9')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۹
        </button>
        <button
          type="button"
          onClick={() => handleKey('×')}
          className="bg-[#6179fb] hover:bg-[#4f6bf9] active:scale-95 text-white py-3.5 rounded-2xl shadow-md transition-transform cursor-pointer text-xl"
        >
          ×
        </button>

        {/* Row 4: Clear, 0, Backspace, ÷ */}
        <button
          type="button"
          onClick={handleClear}
          className="bg-[#333d52] hover:bg-[#3d4a63] active:scale-95 text-slate-300 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer text-xs font-bold"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => handleKey('0')}
          className="bg-white hover:bg-slate-100 active:scale-95 text-slate-800 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer font-vazir text-lg"
        >
          ۰
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="bg-[#333d52] hover:bg-[#3d4a63] active:scale-95 text-slate-200 py-3.5 rounded-2xl shadow-sm transition-transform cursor-pointer flex items-center justify-center"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => handleKey('÷')}
          className="bg-[#6179fb] hover:bg-[#4f6bf9] active:scale-95 text-white py-3.5 rounded-2xl shadow-md transition-transform cursor-pointer text-xl"
        >
          ÷
        </button>
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        onClick={handleFinish}
        className="w-full bg-[#10b981] hover:bg-[#059669] active:scale-[0.99] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer text-xs mt-1"
      >
        <Check className="w-4 h-4" />
        <span>تأیید مبلغ نهایی ({toPersianDigits(currentResult.toLocaleString())} تومان)</span>
      </button>
    </div>
  );
}
