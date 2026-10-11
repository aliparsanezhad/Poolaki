export const INITIAL_CATEGORIES = [
  {
    id: 'uncategorized',
    type: 'expense',
    name: 'تعیین‌نشده',
    icon: 'HelpCircle',
    color: '#64748b',
    subcategories: []
  },
  {
    id: 'food',
    type: 'expense',
    name: 'خوردنی',
    icon: 'UtensilsCrossed',
    color: '#e66746',
    subcategories: [
      { id: 'snapp-food', name: 'اسنپ فود', icon: 'UtensilsCrossed' },
      { id: 'restaurant', name: 'رستوران', icon: 'Utensils' },
      { id: 'cafe', name: 'کافه', icon: 'Coffee' },
      { id: 'misc-food', name: 'متفرقه', icon: 'UtensilsCrossed' },
      { id: 'catering-yas', name: 'کترینگ یاس', icon: 'Utensils' },
      { id: 'boys-night', name: 'BoysNight', icon: 'UtensilsCrossed' }
    ]
  },
  {
    id: 'telecom',
    type: 'expense',
    name: 'شارژ و بسته اینترنت',
    icon: 'Smartphone',
    color: '#f3ad22',
    subcategories: [
      { id: 'hamrah-aval', name: 'همراه اول', icon: 'Smartphone' },
      { id: 'irancell', name: 'ایرانسل', icon: 'Smartphone' },
      { id: 'rightel', name: 'رایتل', icon: 'Smartphone' },
      { id: 'adsl', name: 'اینترنت ثابت ADSL', icon: 'Wifi' }
    ]
  },
  {
    id: 'installments',
    type: 'expense',
    name: 'اقساط',
    icon: 'Building2',
    color: '#3b8296',
    subcategories: [
      { id: 'bank-loan', name: 'قسط وام بانکی', icon: 'Building2' },
      { id: 'digipay', name: 'DigiPay', icon: 'CreditCard' },
      { id: 'torobpay', name: 'TorobPay', icon: 'CreditCard' },
      { id: 'snapp-pay', name: 'اسنپ‌پی', icon: 'CreditCard' }
    ]
  },
  {
    id: 'crypto-usd',
    type: 'expense',
    name: 'دلار ، تتر ، کریپتو',
    icon: 'DollarSign',
    color: '#20a359',
    subcategories: [
      { id: 'usdt', name: 'USDT', icon: 'DollarSign' },
      { id: 'crypto', name: 'Crypto', icon: 'Bitcoin' },
      { id: 'paper-usd', name: 'دلار کاغذی', icon: 'Banknote' }
    ]
  },
  {
    id: 'gold-silver',
    type: 'expense',
    name: 'طلا و نقره',
    icon: 'Coins',
    color: '#d99b1a',
    subcategories: [
      { id: 'gold', name: 'طلا', icon: 'Coins' },
      { id: 'silver', name: 'نقره', icon: 'Coins' },
      { id: 'silver-craft', name: 'خرجکار نقره', icon: 'Wrench' }
    ]
  },
  {
    id: 'stocks-funds',
    type: 'expense',
    name: 'سهام و صندوق',
    icon: 'BarChart2',
    color: '#10b981',
    subcategories: [
      { id: 'fixed-income', name: 'صندوق درآمد ثابت', icon: 'TrendingUp' },
      { id: 'etf', name: 'صندوق ETF و مختلط', icon: 'BarChart2' },
      { id: 'bourse', name: 'بورس اوراق بهادار', icon: 'LineChart' }
    ]
  },
  {
    id: 'personal-style',
    type: 'expense',
    name: 'استایل شخصی',
    icon: 'Shirt',
    color: '#22b8a2',
    subcategories: [
      { id: 'shoes-bags', name: 'کیف و کفش', icon: 'ShoppingBag' },
      { id: 'accessories', name: 'اکسسوری', icon: 'Watch' },
      { id: 'perfume', name: 'عطر و ادکلن', icon: 'Sparkles' },
      { id: 'clothes', name: 'پوشاک', icon: 'Shirt' }
    ]
  },
  {
    id: 'vehicle',
    type: 'expense',
    name: 'خودرو و سوخت',
    icon: 'Fuel',
    color: '#ea580c',
    subcategories: [
      { id: 'benzin', name: 'بنزین', icon: 'Fuel' },
      { id: 'accessories-car', name: 'لوازم جانبی', icon: 'Wrench' },
      { id: 'oil-service', name: 'تعویض روغن', icon: 'Wrench' }
    ]
  },
  {
    id: 'income-salary',
    type: 'income',
    name: 'حقوق و دستمزد',
    icon: 'Wallet',
    color: '#10b981',
    subcategories: [
      { id: 'monthly-salary', name: 'حقوق ماهانه', icon: 'Wallet' },
      { id: 'bonus', name: 'پاداش و کارانه', icon: 'Gift' }
    ]
  },
  {
    id: 'income-investments',
    type: 'income',
    name: 'سود سرمایه‌گذاری',
    icon: 'TrendingUp',
    color: '#3b82f6',
    subcategories: [
      { id: 'fund-dividend', name: 'سود ماهیانه صندوق', icon: 'Coins' },
      { id: 'crypto-profit', name: 'سود کریپتو', icon: 'DollarSign' }
    ]
  }
];

export const INITIAL_ACCOUNTS = [
  {
    id: 'card-tejarat',
    type: 'card',
    bankName: 'بانک تجارت',
    bankCode: 'tejarat',
    cardNumber: '5859 8310 2691 0561',
    name: 'تجارت',
    smsEnabled: true,
    smsSenders: ['TejaratBank'],
    initialBalance: 2385200,
    currentBalance: 2385200,
    color: '#1e40af'
  },
  {
    id: 'card-melli',
    type: 'card',
    bankName: 'بانک ملی ایران',
    bankCode: 'melli',
    cardNumber: '6037 9918 4321 9876',
    name: 'ملی',
    smsEnabled: true,
    smsSenders: ['B.Melli'],
    initialBalance: 1500000,
    currentBalance: 1500000,
    color: '#991b1b'
  },
  {
    id: 'cash-wallet',
    type: 'other',
    name: 'نقدی',
    initialBalance: 350000,
    currentBalance: 350000,
    color: '#059669'
  },
  {
    id: 'card-maskan',
    type: 'card',
    bankName: 'بانک مسکن',
    bankCode: 'maskan',
    cardNumber: '6280 2314 9012 3456',
    name: 'کارت روزمره',
    smsEnabled: true,
    smsSenders: ['Maskan', 'BankMaskan'],
    initialBalance: 4890000,
    currentBalance: 4890000,
    color: '#c2410c'
  },
  {
    id: 'account-online',
    type: 'other',
    name: 'خرید اینترنتی',
    initialBalance: 1200000,
    currentBalance: 1200000,
    color: '#7c3aed'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'باکس',
    categoryName: 'ابزار نقره',
    subCategoryName: '',
    categoryId: 'gold-silver',
    amount: 150000,
    type: 'expense',
    date: '۲۷ اردیبهشت ۱۴۰۵',
    accountId: 'card-tejarat',
    accountName: 'تجارت',
    icon: 'Wrench'
  },
  {
    id: 'tx-2',
    title: 'بنزین',
    categoryName: 'بنزین',
    subCategoryName: '',
    categoryId: 'vehicle',
    amount: 90000,
    type: 'expense',
    date: '۲۷ اردیبهشت ۱۴۰۵',
    accountId: 'card-tejarat',
    accountName: 'تجارت',
    icon: 'Fuel'
  },
  {
    id: 'tx-3',
    title: 'متفرقه',
    categoryName: 'متفرقه',
    subCategoryName: '',
    categoryId: 'food',
    amount: 75000,
    type: 'expense',
    date: '۲۷ اردیبهشت ۱۴۰۵',
    accountId: 'card-tejarat',
    accountName: 'تجارت',
    icon: 'Coffee'
  },
  {
    id: 'tx-4',
    title: 'اسنپ فود',
    categoryName: 'اسنپ فود',
    subCategoryName: '',
    categoryId: 'food',
    amount: 655000,
    type: 'expense',
    date: '۲۵ اردیبهشت ۱۴۰۵',
    accountId: 'card-tejarat',
    accountName: 'تجارت',
    icon: 'UtensilsCrossed'
  },
  {
    id: 'tx-5',
    title: 'بیعانه سپر',
    categoryName: 'لوازم جانبی',
    subCategoryName: '',
    categoryId: 'vehicle',
    amount: 200900,
    type: 'expense',
    date: '۲۳ اردیبهشت ۱۴۰۵',
    accountId: 'card-tejarat',
    accountName: 'تجارت',
    icon: 'Wrench'
  },
  {
    id: 'tx-6',
    title: 'شارژ و بسته اینترنت',
    categoryName: 'شارژ و بسته اینترنت',
    subCategoryName: 'ایرانسل',
    categoryId: 'telecom',
    amount: 22000,
    type: 'expense',
    date: '۲۳ اردیبهشت ۱۴۰۵',
    accountId: 'card-tejarat',
    accountName: 'تجارت',
    icon: 'Smartphone'
  }
];

export const INITIAL_DUES = [
  {
    id: 'due-1',
    title: 'وام خرید کالا',
    type: 'installment', // قسط
    amount: 5000000,
    dueDate: '۲۹ اسفند ۱۴۰۴',
    daysLabel: '۲۰۲ روز پیش',
    bank: 'بانک تجارت',
    isPaid: true,
    paidAt: '۲۹ اسفند ۱۴۰۴',
    note: 'قسط آخر تسویه شد'
  },
  {
    id: 'due-2',
    title: 'چک تجهیزات نقره‌کاری',
    type: 'cheque', // چک
    amount: 15000000,
    dueDate: '۲۵ آبان ۱۴۰۵',
    daysLabel: '۳۸ روز مانده',
    bank: 'بانک ملی ایران',
    isPaid: false,
    note: 'صیادی به نام کارگاه رسولی'
  },
  {
    id: 'due-3',
    title: 'تمدید بیمه خودرو',
    type: 'note', // یادداشت
    amount: 3200000,
    dueDate: '۱۰ آذر ۱۴۰۵',
    daysLabel: '۵۳ روز مانده',
    bank: 'بانک تجارت',
    isPaid: false,
    note: 'شخص ثالث ایران'
  }
];

export const INITIAL_BACKUPS = [
  {
    id: 'b-1',
    filename: 'poolaki-backup-1404-04-31.plk',
    date: '۳۱ تیر ۱۴۰۴، ۲۰:۴۱',
    size: '84 KB',
    transactionsCount: 780,
    duesCount: 18
  },
  {
    id: 'b-2',
    filename: 'poolaki-backup-1405-01-07.plk',
    date: '۷ فروردین ۱۴۰۵، ۱۱:۲۵',
    size: '128 KB',
    transactionsCount: 1085,
    duesCount: 24
  }
];

export const INITIAL_PENDING_SMS = [
  {
    id: 'sms-p-1',
    amount: 559500,
    type: 'expense',
    date: 'پنجشنبه ۱۷ مهر ۱۴۰۵، ۱۶:۱۴',
    accountName: 'کارت روزمره',
    accountId: 'card-maskan',
    description: 'خرید از فروشگاه اتکا',
    bankName: 'بانک مسکن'
  },
  {
    id: 'sms-p-2',
    amount: 1399000,
    type: 'expense',
    date: 'پنجشنبه ۱۷ مهر ۱۴۰۵، ۱۴:۰۸',
    accountName: 'کارت روزمره',
    accountId: 'card-maskan',
    description: 'خرید پوشاک و کفش',
    bankName: 'بانک مسکن'
  },
  {
    id: 'sms-p-3',
    amount: 34000,
    type: 'expense',
    date: 'پنجشنبه ۱۷ مهر ۱۴۰۵، ۱۱:۲۳',
    accountName: 'کارت روزمره',
    accountId: 'card-maskan',
    description: 'سوپرمارکت محله',
    bankName: 'بانک مسکن'
  },
  {
    id: 'sms-p-4',
    amount: 120000,
    type: 'expense',
    date: 'جمعه ۱۸ مهر ۱۴۰۵، ۰۹:۱۵',
    accountName: 'کارت روزمره',
    accountId: 'card-maskan',
    description: 'نانوایی و سوپر پروتئین',
    bankName: 'بانک مسکن'
  },
  {
    id: 'sms-p-5',
    amount: 250000,
    type: 'expense',
    date: 'جمعه ۱۸ مهر ۱۴۰۵، ۱۹:۴۰',
    accountName: 'کارت روزمره',
    accountId: 'card-maskan',
    description: 'جایگاه سوخت آزادی',
    bankName: 'بانک مسکن'
  },
  {
    id: 'sms-p-6',
    amount: 480000,
    type: 'expense',
    date: 'شنبه ۱۹ مهر ۱۴۰۵، ۱۲:۳۰',
    accountName: 'تجارت',
    accountId: 'card-tejarat',
    description: 'کافه کتاب لمیز',
    bankName: 'بانک تجارت'
  },
  {
    id: 'sms-p-7',
    amount: 12389000,
    type: 'income',
    date: 'شنبه ۱۹ مهر ۱۴۰۵، ۱۸:۲۰',
    accountName: 'خرید اینترنتی',
    accountId: 'account-online',
    description: 'واریز پایا حقوق',
    bankName: 'بانک ملی ایران'
  }
];
