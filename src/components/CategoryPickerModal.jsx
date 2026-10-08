import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { Edit2, ChevronDown, ChevronUp, X } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function CategoryPickerModal() {
  const {
    isCategoryPickerOpen,
    setIsCategoryPickerOpen,
    categories,
    categoryPickerCallback,
    setIsCategoryManagerOpen
  } = usePoolaki();

  const [expandedId, setExpandedId] = useState(null);

  if (!isCategoryPickerOpen) return null;

  const handleSelect = (category, subcategory = null) => {
    if (categoryPickerCallback) {
      categoryPickerCallback(category, subcategory);
    }
    setIsCategoryPickerOpen(false);
  };

  const handleEditCategories = () => {
    setIsCategoryPickerOpen(false);
    setIsCategoryManagerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border-t border-[#313b52] rounded-t-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] animate-slide-up">
        {/* Top Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-600/70 rounded-full mx-auto mb-4"></div>

        {/* Header matching photo_3 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d364a] mb-3">
          <button
            onClick={handleEditCategories}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors flex items-center gap-1 text-xs"
            title="ویرایش دسته‌بندی‌ها"
          >
            <Edit2 className="w-4 h-4 text-blue-400" />
          </button>

          <span className="font-bold text-white text-base">دسته‌بندی</span>

          <button
            onClick={() => setIsCategoryPickerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories List matching photo_3 */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {categories.map((cat) => {
            const isExpanded = expandedId === cat.id;
            const subText = cat.subcategories?.map((s) => s.name).join('، ') || '';

            return (
              <div
                key={cat.id}
                className="bg-[#2a3245] border border-[#354058] rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                {/* Main Category Row */}
                <div
                  onClick={() => {
                    if (cat.subcategories && cat.subcategories.length > 0) {
                      setExpandedId(isExpanded ? null : cat.id);
                    } else {
                      handleSelect(cat);
                    }
                  }}
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-[#323c52] transition-colors"
                >
                  <div className="flex items-center gap-2 text-slate-400">
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-right flex-1 justify-end">
                    <div className="flex flex-col text-right">
                      <span className="font-bold text-slate-100 text-sm">{cat.name}</span>
                      {subText && (
                        <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[210px]">
                          {subText}
                        </span>
                      )}
                    </div>

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}22` }}
                    >
                      <CategoryIcon name={cat.icon} color={cat.color} className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Subcategories Dropdown */}
                {isExpanded && cat.subcategories && (
                  <div className="bg-[#202737] px-4 py-2 border-t border-[#343e56] space-y-1.5 animate-fade-in">
                    <div
                      onClick={() => handleSelect(cat)}
                      className="py-2 px-3 rounded-xl hover:bg-[#2c354a] cursor-pointer text-xs font-semibold text-blue-300 flex items-center justify-between"
                    >
                      <span>انتخاب کل گروه</span>
                      <span className="text-[11px] text-slate-400">{cat.name}</span>
                    </div>
                    {cat.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleSelect(cat, sub)}
                        className="py-2 px-3 rounded-xl hover:bg-[#2c354a] cursor-pointer text-xs text-slate-200 flex items-center justify-between transition-colors"
                      >
                        <span className="text-slate-400 text-[10px]">زیرمجموعه</span>
                        <div className="flex items-center gap-2">
                          <span>{sub.name}</span>
                          <CategoryIcon name={sub.icon || cat.icon} color={cat.color} className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
