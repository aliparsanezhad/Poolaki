import React, { useState } from 'react';
import { usePoolaki } from '../context/PoolakiContext';
import { Trash2, X, Edit3, Plus, ChevronLeft, Check } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function EditCategoryModal() {
  const {
    editingCategory,
    setEditingCategory,
    updateCategory,
    deleteCategory,
    showToast
  } = usePoolaki();

  const [name, setName] = useState(editingCategory?.name || '');
  const [subcategories, setSubcategories] = useState(editingCategory?.subcategories || []);
  const [selectedColor, setSelectedColor] = useState(editingCategory?.color || '#e66746');
  const [selectedIcon, setSelectedIcon] = useState(editingCategory?.icon || 'UtensilsCrossed');
  const [newSubName, setNewSubName] = useState('');
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  if (!editingCategory) return null;

  const availableColors = [
    '#e66746', '#f3ad22', '#3b8296', '#20a359', '#d99b1a', '#10b981', '#22b8a2', '#ea580c', '#8b5cf6', '#ec4899'
  ];

  const availableIcons = [
    'UtensilsCrossed', 'Utensils', 'Coffee', 'Smartphone', 'Building2', 'DollarSign', 'Coins', 'BarChart2', 'Shirt', 'Fuel', 'Wrench', 'Wallet'
  ];

  const handleSave = () => {
    if (!name.trim()) {
      showToast('نام دسته‌بندی نمی‌تواند خالی باشد');
      return;
    }

    updateCategory({
      ...editingCategory,
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
      subcategories
    });

    setEditingCategory(null);
  };

  const handleDelete = () => {
    if (window.confirm(`آیا از حذف دسته‌بندی "${editingCategory.name}" اطمینان دارید؟`)) {
      deleteCategory(editingCategory.id);
      setEditingCategory(null);
    }
  };

  const handleAddSub = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      icon: selectedIcon
    };
    setSubcategories([...subcategories, newSub]);
    setNewSubName('');
    setIsAddingSub(false);
  };

  const handleRemoveSub = (subId) => {
    setSubcategories(subcategories.filter((s) => s.id !== subId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#222838] border border-[#2f384d] rounded-3xl p-5 shadow-2xl flex flex-col h-[90vh]">
        {/* Header matching photo_1 */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d364a]">
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
            title="حذف دسته‌بندی"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <span className="font-bold text-white text-base">ویرایش دسته‌بندی</span>

          <button
            onClick={() => setEditingCategory(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* Category Icon Card matching photo_1 */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center border border-[#394660] shadow-inner"
                style={{ backgroundColor: `${selectedColor}18` }}
              >
                <CategoryIcon name={selectedIcon} color={selectedColor} className="w-12 h-12" />
              </div>

              <button
                type="button"
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                className="absolute -bottom-1 -left-1 p-2 bg-[#2d364b] hover:bg-[#3b4762] text-white rounded-full border border-[#445270] shadow-md transition-colors cursor-pointer"
                title="تغییر آیکون و رنگ"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Color & Icon Selector Drawer */}
            {colorPickerOpen && (
              <div className="w-full bg-[#1b212f] border border-[#354058] rounded-2xl p-3 mt-3 space-y-3 animate-fade-in">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">انتخاب رنگ:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                          selectedColor === c ? 'scale-125 ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">انتخاب آیکون:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableIcons.map((ic) => (
                      <button
                        key={ic}
                        onClick={() => setSelectedIcon(ic)}
                        className={`p-1.5 rounded-lg border ${
                          selectedIcon === ic
                            ? 'bg-blue-600/30 border-blue-500 text-white'
                            : 'bg-[#252c3c] border-[#36425a] text-slate-400 hover:text-white'
                        }`}
                      >
                        <CategoryIcon name={ic} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Name Field matching photo_1 */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 block text-right">نام</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1c2230] border border-[#303a50] rounded-2xl px-4 py-3 text-sm text-white font-bold outline-none text-right font-vazir"
            />
          </div>

          {/* Subcategories Header & List matching photo_1 */}
          <div className="space-y-2 pt-2">
            <div className="space-y-1.5">
              {subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#242b3b] border border-[#333e56] rounded-2xl px-4 py-3 flex items-center justify-between text-xs transition-colors"
                >
                  {/* Left: ویرایش > with remove option */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveSub(sub.id)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                      title="حذف زیرمجموعه"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-400 flex items-center gap-0.5 font-medium cursor-pointer hover:text-white">
                      <span>ویرایش</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Right: Subcategory title and icon */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-slate-100">{sub.name}</span>
                    <CategoryIcon name={sub.icon || selectedIcon} color={selectedColor} className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Subcategory Trigger / Form matching photo_1 */}
            {isAddingSub ? (
              <form onSubmit={handleAddSub} className="bg-[#1b212f] p-3 rounded-2xl border border-[#38445e] flex items-center gap-2">
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="نام زیرمجموعه..."
                  className="flex-1 bg-[#252c3c] text-white text-xs px-3 py-2 rounded-xl outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#5b75f8] text-white px-3 py-2 rounded-xl text-xs font-bold"
                >
                  افزودن
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSub(false)}
                  className="text-slate-400 px-2 py-2 text-xs"
                >
                  لغو
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingSub(true)}
                className="w-full py-2.5 text-center text-[#6179fb] hover:text-[#7f94fd] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن زیرمجموعه</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom CTA Button matching photo_1 */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-[#5b75f8] hover:bg-[#4d69f0] active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25 transition-all cursor-pointer text-sm mt-3"
        >
          ثبت تغییرات
        </button>
      </div>
    </div>
  );
}
