import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { Plus, X, GripVertical, ChevronLeft } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function CategoriesView() {
  const {
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    categories,
    setEditingCategory,
    addCategory
  } = usePoolaki();

  const [activeTab, setActiveTab] = useState('expense'); // expense, income
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  if (!isCategoryManagerOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      type: activeTab,
      color: activeTab === 'expense' ? '#ea580c' : '#10b981',
      icon: 'Tag',
      subcategories: []
    });
    setNewCatName('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border border-[#2f384d] rounded-3xl p-5 shadow-2xl flex flex-col h-[90vh]">
        {/* Header matching photo_2 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d364a]">
          <button
            onClick={() => setIsAddingNew(true)}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="افزودن دسته‌بندی جدید"
          >
            <Plus className="w-5 h-5" />
          </button>

          <span className="font-bold text-white text-base">دسته‌بندی ها</span>

          <button
            onClick={() => setIsCategoryManagerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle matching photo_2: خرج | دخل */}
        <div className="flex items-center bg-[#191e2b] rounded-2xl p-1 border border-[#293245] my-4">
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'expense'
                ? 'bg-[#a3514a] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center text-[9px]">
              -
            </span>
            <span>خرج</span>
          </button>

          <button
            onClick={() => setActiveTab('income')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'income'
                ? 'bg-[#22845c] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center text-[9px]">
              +
            </span>
            <span>دخل</span>
          </button>
        </div>

        {/* New Category Input Form (if toggled) */}
        {isAddingNew && (
          <form onSubmit={handleAddNew} className="bg-[#191e2b] p-3 rounded-2xl border border-[#3b4760] mb-3 animate-fade-in">
            <span className="text-xs font-bold text-white mb-2 block">افزودن دسته‌بندی جدید</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="نام دسته‌بندی را وارد کنید..."
                className="flex-1 bg-[#242b3a] text-white text-xs px-3 py-2 rounded-xl border border-[#374259] outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#5b75f8] text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                ثبت
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-slate-400 hover:text-white px-2 py-2 text-xs"
              >
                انصراف
              </button>
            </div>
          </form>
        )}

        {/* Categories List matching photo_2 */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredCategories.map((cat) => {
            const subText = cat.subcategories?.map((s) => s.name).join('، ') || 'بدون زیرمجموعه';

            return (
              <div
                key={cat.id}
                onClick={() => setEditingCategory(cat)}
                className="bg-[#283042] border border-[#354058] hover:border-[#4b5a7a] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-sm group"
              >
                {/* Left side: drag handle and quick plus button matching photo_2 */}
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-lg font-bold tracking-tighter text-slate-500 group-hover:text-slate-300">
                    =
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(cat);
                    }}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Right side: Title, snippet, icon matching photo_2 */}
                <div className="flex items-center gap-3 text-right flex-1 justify-end">
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-slate-100 text-sm">{cat.name}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">
                      {subText}
                    </span>
                  </div>

                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat.color}25` }}
                  >
                    <CategoryIcon name={cat.icon} color={cat.color} className="w-5 h-5" />
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
