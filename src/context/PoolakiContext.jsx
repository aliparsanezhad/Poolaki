import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_CATEGORIES,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_DUES,
  INITIAL_BACKUPS,
  INITIAL_PENDING_SMS
} from '../data/initialData';
import { parseBankSms } from '../utils/smsParser';

const PoolakiContext = createContext(null);

const STORAGE_KEY = 'jeebyar_app_data_v2';

export const INITIAL_MARKET_PRICES = {
  gold18k: 4680000,       // تومان هر گرم طلای ۱۸ عیار
  goldAbshodeh: 20270000,  // تومان هر مثقال آبشده
  sekehEmami: 54200000,    // تومان هر عدد سکه تمام طرح جدید
  tetherUsdt: 69400,       // تومان هر واحد تتر
  silverGram: 74000        // تومان هر گرم نقره
};

export const INITIAL_PORTFOLIO = {
  goldGrams: 12.5,
  tetherAmount: 350,
  silverGrams: 65,
  sekehCount: 1
};

export function PoolakiProvider({ children }) {
  // Load initial state from LocalStorage or fall back to seed
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_accounts`);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [dues, setDues] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_dues`);
    return saved ? JSON.parse(saved) : INITIAL_DUES;
  });

  const [backups, setBackups] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_backups`);
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS;
  });

  const [pendingSmsList, setPendingSmsList] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pending_sms`);
    return saved ? JSON.parse(saved) : INITIAL_PENDING_SMS;
  });

  // Subscription state
  const [subscription, setSubscription] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subscription`);
    return saved
      ? JSON.parse(saved)
      : {
          isPro: true, // Default to Pro for awesome rich preview
          plan: 'pro',
          planName: 'طرح حرفه‌ای (Pro)',
          expiresAt: '۱۴۰۶/۰۲/۰۱',
          autoRenew: true
        };
  });

  // Multi-asset portfolio
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_portfolio`);
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
  });

  const [marketPrices, setMarketPrices] = useState(INITIAL_MARKET_PRICES);

  // Split bills list
  const [splitBills, setSplitBills] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_split_bills`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'sb-1',
            title: 'شام دورهمی با بچه‌ها',
            totalAmount: 1850000,
            date: '۱۶ مهر ۱۴۰۵',
            paidBy: 'من (علیرضا)',
            members: [
              { name: 'من', share: 462500, paid: true },
              { name: 'محمد', share: 462500, paid: true },
              { name: 'سینا', share: 462500, paid: false },
              { name: 'امیر', share: 462500, paid: false }
            ]
          }
        ];
  });

  // UI state
  const [activeTab, setActiveTab] = useState('home'); // home, assets, reports, budget, dues
  const [isPhoneFrame, setIsPhoneFrame] = useState(true); // Toggle realistic phone frame
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isSmsPermissionOpen, setIsSmsPermissionOpen] = useState(false);
  const [isSmsSimulatorOpen, setIsSmsSimulatorOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isBatchSmsOpen, setIsBatchSmsOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isAssetValuationOpen, setIsAssetValuationOpen] = useState(false);
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);

  // Callback holder when picking category from transaction form
  const [categoryPickerCallback, setCategoryPickerCallback] = useState(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_accounts`, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_dues`, JSON.stringify(dues));
  }, [dues]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_backups`, JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pending_sms`, JSON.stringify(pendingSmsList));
  }, [pendingSmsList]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_subscription`, JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_portfolio`, JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_split_bills`, JSON.stringify(splitBills));
  }, [splitBills]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const addTransaction = (newTx) => {
    const tx = {
      id: `tx-${Date.now()}`,
      ...newTx
    };
    setTransactions((prev) => [tx, ...prev]);

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === newTx.accountId) {
          const delta = newTx.type === 'expense' ? -newTx.amount : newTx.amount;
          return {
            ...acc,
            currentBalance: (acc.currentBalance || acc.initialBalance || 0) + delta
          };
        }
        return acc;
      })
    );

    showToast('تراکنش با موفقیت ثبت شد');
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('تراکنش حذف شد');
  };

  const updateCategory = (updatedCat) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
    showToast('تغییرات دسته‌بندی ذخیره شد');
  };

  const addCategory = (newCat) => {
    const cat = {
      id: `cat-${Date.now()}`,
      subcategories: [],
      color: '#3b82f6',
      icon: 'Tag',
      ...newCat
    };
    setCategories((prev) => [...prev, cat]);
    showToast('دسته‌بندی جدید افزوده شد');
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('دسته‌بندی حذف شد');
  };

  const updateAccount = (updatedAcc) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === updatedAcc.id ? updatedAcc : a))
    );
    showToast('اطلاعات حساب ذخیره شد');
  };

  const addAccount = (newAcc) => {
    const acc = {
      id: `acc-${Date.now()}`,
      ...newAcc
    };
    setAccounts((prev) => [...prev, acc]);
    showToast('حساب جدید افزوده شد');
  };

  const toggleDuePaid = (id) => {
    setDues((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isPaid: !d.isPaid, paidAt: !d.isPaid ? 'امروز' : null } : d
      )
    );
  };

  const addDue = (newDue) => {
    const due = {
      id: `due-${Date.now()}`,
      isPaid: false,
      ...newDue
    };
    setDues((prev) => [due, ...prev]);
    showToast('سررسید جدید ثبت شد');
  };

  const deleteDue = (id) => {
    setDues((prev) => prev.filter((d) => d.id !== id));
    showToast('سررسید حذف شد');
  };

  const importAllPendingSms = () => {
    if (pendingSmsList.length === 0) return;

    const count = pendingSmsList.length;
    const newTxs = pendingSmsList.map((item, index) => ({
      id: `tx-batch-${Date.now()}-${index}`,
      title: item.description || (item.type === 'income' ? 'واریز پیامکی' : 'خرید پیامکی'),
      categoryName: 'تعیین‌نشده',
      subCategoryName: '',
      categoryId: 'uncategorized',
      amount: item.amount,
      type: item.type,
      date: item.date?.split('،')?.[0] || 'امروز',
      accountId: item.accountId || 'card-maskan',
      accountName: item.accountName || 'کارت روزمره',
      icon: item.type === 'income' ? 'TrendingUp' : 'Receipt'
    }));

    setTransactions((prev) => [...newTxs, ...prev]);

    // Update balances
    setAccounts((prev) =>
      prev.map((acc) => {
        const relatedItems = pendingSmsList.filter((item) => item.accountId === acc.id);
        if (relatedItems.length === 0) return acc;
        const totalDelta = relatedItems.reduce((sum, item) => {
          return sum + (item.type === 'expense' ? -item.amount : item.amount);
        }, 0);
        return {
          ...acc,
          currentBalance: (acc.currentBalance || acc.initialBalance || 0) + totalDelta
        };
      })
    );

    setPendingSmsList([]);
    setIsBatchSmsOpen(false);
    showToast(`${count} تراکنش با موفقیت به دسته «تعیین‌نشده» اضافه شدند!`);
  };

  const deletePendingSms = (id) => {
    setPendingSmsList((prev) => prev.filter((p) => p.id !== id));
    showToast('پیامک حذف شد');
  };

  const triggerSampleNotification = (sampleData = null) => {
    setActiveNotification(
      sampleData || {
        id: `notif-${Date.now()}`,
        title: 'واریز پایا اینترنتی',
        amount: 12389000,
        type: 'income',
        accountName: 'خرید اینترنتی',
        accountId: 'account-online'
      }
    );
  };

  const activateSubscription = (planId, coupon = '') => {
    const plans = {
      pro_month: { name: 'طرح حرفه‌ای (ماهانه)', expires: '۱ ماه دیگر' },
      pro_year: { name: 'طرح حرفه‌ای (سالانه)', expires: '۱ سال دیگر' },
      vip_lifetime: { name: 'طرح مادام‌العمر الماس', expires: 'نامحدود (دائمی)' }
    };

    const chosen = plans[planId] || plans.pro_year;
    setSubscription({
      isPro: true,
      plan: planId,
      planName: chosen.name,
      expiresAt: chosen.expires,
      autoRenew: true
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`اشتراک ${chosen.name} با موفقیت فعال شد! 🎉`);
    setIsSubscriptionModalOpen(false);
  };

  const updatePortfolio = (newPort) => {
    setPortfolio(newPort);
    showToast('سبد دارایی‌ها به‌روز شد');
  };

  const addSplitBill = (newBill) => {
    const bill = {
      id: `sb-${Date.now()}`,
      date: 'امروز',
      ...newBill
    };
    setSplitBills((prev) => [bill, ...prev]);
    showToast('محاسبه دنگ با موفقیت ذخیره شد');
  };

  const createBackup = () => {
    const backupId = `b-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('fa-IR');
    const filename = `jeebyar-backup-${Date.now()}.plk`;

    const fullBackupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      appName: 'JeebYar',
      transactions,
      categories,
      accounts,
      dues,
      portfolio
    };

    const newBackup = {
      id: backupId,
      filename,
      date: `${dateStr}، ${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`,
      size: `${Math.round(JSON.stringify(fullBackupData).length / 1024) || 2} KB`,
      transactionsCount: transactions.length,
      duesCount: dues.length,
      data: fullBackupData
    };

    setBackups((prev) => [newBackup, ...prev]);
    showToast('پشتیبان‌گیری با فرمت PLK انجام شد');

    const blob = new Blob([JSON.stringify(fullBackupData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restoreBackupData = (backupObj) => {
    if (!backupObj) return;
    if (backupObj.categories) setCategories(backupObj.categories);
    if (backupObj.accounts) setAccounts(backupObj.accounts);
    if (backupObj.transactions) setTransactions(backupObj.transactions);
    if (backupObj.dues) setDues(backupObj.dues);
    if (backupObj.portfolio) setPortfolio(backupObj.portfolio);
    showToast('داده‌های پشتیبان با موفقیت بازیابی شد');
  };

  const resetAllData = () => {
    setTransactions([]);
    setDues([]);
    setBackups([]);
    setPendingSmsList([]);
    localStorage.removeItem(`${STORAGE_KEY}_transactions`);
    localStorage.removeItem(`${STORAGE_KEY}_dues`);
    localStorage.removeItem(`${STORAGE_KEY}_backups`);
    localStorage.removeItem(`${STORAGE_KEY}_pending_sms`);
    showToast('کلیه اطلاعات پاک شدند');
  };

  const simulateSmsReceived = (smsText) => {
    const parsed = parseBankSms(smsText);
    if (!parsed || parsed.amount <= 0) {
      showToast('پیامک حاوی مبلغ قابل تشخیص نبود');
      return false;
    }

    const matchedAccount =
      accounts.find((a) => a.name.includes(parsed.bankName) || a.bankName?.includes(parsed.bankName)) ||
      accounts[0];

    const newTx = {
      title: parsed.title,
      categoryName: 'متفرقه',
      subCategoryName: '',
      categoryId: 'food',
      amount: parsed.amount,
      type: parsed.type,
      date: 'امروز',
      accountId: matchedAccount?.id || 'card-maskan',
      accountName: matchedAccount?.name || 'کارت روزمره',
      icon: parsed.type === 'income' ? 'TrendingUp' : 'Receipt'
    };

    addTransaction(newTx);
    showToast(`تراکنش بانکی ${parsed.amount.toLocaleString()} تومانی از پیامک ثبت شد!`);
    return true;
  };

  return (
    <PoolakiContext.Provider
      value={{
        categories,
        accounts,
        transactions,
        dues,
        backups,
        pendingSmsList,
        setPendingSmsList,
        subscription,
        setSubscription,
        portfolio,
        marketPrices,
        splitBills,
        activeTab,
        setActiveTab,
        isPhoneFrame,
        setIsPhoneFrame,
        toastMessage,
        showToast,
        // Modals
        isNewTxModalOpen,
        setIsNewTxModalOpen,
        isCategoryPickerOpen,
        setIsCategoryPickerOpen,
        categoryPickerCallback,
        setCategoryPickerCallback,
        isCategoryManagerOpen,
        setIsCategoryManagerOpen,
        editingCategory,
        setEditingCategory,
        editingAccount,
        setEditingAccount,
        isSmsPermissionOpen,
        setIsSmsPermissionOpen,
        isSmsSimulatorOpen,
        setIsSmsSimulatorOpen,
        isDataManagementOpen,
        setIsDataManagementOpen,
        isBatchSmsOpen,
        setIsBatchSmsOpen,
        activeNotification,
        setActiveNotification,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        isAssetValuationOpen,
        setIsAssetValuationOpen,
        isReceiptScannerOpen,
        setIsReceiptScannerOpen,
        isSplitBillOpen,
        setIsSplitBillOpen,
        // Handlers
        addTransaction,
        deleteTransaction,
        updateCategory,
        addCategory,
        deleteCategory,
        updateAccount,
        addAccount,
        toggleDuePaid,
        addDue,
        deleteDue,
        importAllPendingSms,
        deletePendingSms,
        triggerSampleNotification,
        activateSubscription,
        updatePortfolio,
        addSplitBill,
        createBackup,
        restoreBackupData,
        resetAllData,
        simulateSmsReceived
      }}
    >
      {children}
    </PoolakiContext.Provider>
  );
}

export function usePoolaki() {
  const context = useContext(PoolakiContext);
  if (!context) {
    throw new Error('usePoolaki must be used within a PoolakiProvider');
  }
  return context;
}

export const useJeebYar = usePoolaki;
