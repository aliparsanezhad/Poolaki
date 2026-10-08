import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_DUES,
  INITIAL_BACKUPS
} from '../data/initialData';
import { parseBankSms } from '../utils/smsParser';

const PoolakiContext = createContext(null);

const STORAGE_KEY = 'poolaki_app_data_v1';

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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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

  const createBackup = () => {
    const backupId = `b-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('fa-IR');
    const filename = `poolaki-backup-${Date.now()}.plk`;
    
    const fullBackupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      transactions,
      categories,
      accounts,
      dues
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
    showToast('پشتیبان‌گیری با موفقیت انجام شد!');

    // Trigger download of the .plk file
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
    showToast('داده‌های پشتیبان با موفقیت بازیابی شد');
  };

  const resetAllData = () => {
    setTransactions([]);
    setDues([]);
    setBackups([]);
    localStorage.removeItem(`${STORAGE_KEY}_transactions`);
    localStorage.removeItem(`${STORAGE_KEY}_dues`);
    localStorage.removeItem(`${STORAGE_KEY}_backups`);
    showToast('کلیه اطلاعات با موفقیت پاک شدند');
  };

  const simulateSmsReceived = (smsText) => {
    const parsed = parseBankSms(smsText);
    if (!parsed || parsed.amount <= 0) {
      showToast('پیامک حاوی مبلغ قابل تشخیص نبود');
      return false;
    }

    // Match account
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
      accountId: matchedAccount?.id || 'card-tejarat',
      accountName: matchedAccount?.name || 'کارت بانکی',
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
