import React from 'react';
import {
  UtensilsCrossed,
  Utensils,
  Coffee,
  Smartphone,
  Wifi,
  Building2,
  CreditCard,
  DollarSign,
  Bitcoin,
  Banknote,
  Coins,
  Wrench,
  BarChart2,
  TrendingUp,
  LineChart,
  Shirt,
  ShoppingBag,
  Watch,
  Sparkles,
  Fuel,
  Wallet,
  Receipt,
  Gift,
  Tag,
  CircleDollarSign,
  HelpCircle,
  Calculator,
  Bell
} from 'lucide-react';

const ICON_MAP = {
  UtensilsCrossed,
  Utensils,
  Coffee,
  Smartphone,
  Wifi,
  Building2,
  CreditCard,
  DollarSign,
  Bitcoin,
  Banknote,
  Coins,
  Wrench,
  BarChart2,
  TrendingUp,
  LineChart,
  Shirt,
  ShoppingBag,
  Watch,
  Sparkles,
  Fuel,
  Wallet,
  Receipt,
  Gift,
  Tag,
  CircleDollarSign,
  HelpCircle,
  Calculator,
  Bell
};

export default function CategoryIcon({ name, className = 'w-5 h-5', color }) {
  const IconComponent = ICON_MAP[name] || UtensilsCrossed;
  return <IconComponent className={className} style={color ? { color } : undefined} />;
}
