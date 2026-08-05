import React, { useState } from 'react';
import { useBarter } from '../context/BarterContext';
import { BarterItem } from '../types';
import { ItemCard } from './ItemCard';
import { 
  Package, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  SearchX, 
  PlusCircle, 
  MapPin, 
  Tag, 
  Sparkles,
  ArrowUpDown,
  Grid,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AllItemsPageProps {
  onSelectItem: (item: BarterItem) => void;
  onOpenTradeModal: (targetItem: BarterItem) => void;
  onOpenAddItem: () => void;
  onViewUserProfile?: (userId: string) => void;
  onNavigateHome?: () => void;
}

export const AllItemsPage: React.FC<AllItemsPageProps> = ({
  onSelectItem,
  onOpenTradeModal,
  onOpenAddItem,
  onViewUserProfile,
  onNavigateHome
}) => {
  const { 
    items, 
    categories, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    selectedCityFilter,
    setSelectedCityFilter,
    settings
  } = useBarter();

  const [conditionFilter, setConditionFilter] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<'newest' | 'highest_value' | 'lowest_value'>('newest');

  // Filter Logic
  const filteredItems = items.filter((item) => {
    // Category match
    if (selectedCategoryFilter !== 'الكل' && item.category !== selectedCategoryFilter) {
      return false;
    }
    // City match
    if (selectedCityFilter !== 'الكل' && !item.location.includes(selectedCityFilter)) {
      return false;
    }
    // Condition match
    if (conditionFilter !== 'الكل' && !item.condition.includes(conditionFilter)) {
      return false;
    }
    // Search Query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchDesired = item.desiredDescription.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchDesired) {
        return false;
      }
    }
    return true;
  });

  // Sort Logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'highest_value') {
      return b.estimatedValue - a.estimatedValue;
    }
    if (sortBy === 'lowest_value') {
      return a.estimatedValue - b.estimatedValue;
    }
    // Default newest
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* TOP HEADER TITLE */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome || (() => window.history.back())}
            title="العودة للرئيسية"
            aria-label="العودة للرئيسية"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-600/20">
            <Package className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              جميع السلع المعروضة للمقايضة
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              تصفح واستكشف كل المنتجات والمقتنيات المتاحة للتبادل
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAddItem}
          className="bg-[#8c5332] hover:bg-[#734123] active:scale-98 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة سلعة جديدة</span>
        </button>
      </div>

      {/* FILTER & SEARCH CONTROL PANEL */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* 1. Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن سلعة، جهاز، أو مقتنى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#faf6f0] focus:bg-white text-slate-900 text-xs sm:text-sm rounded-2xl pr-10 pl-4 py-2.5 border border-[#e8ded2] focus:border-[#8c5332] focus:ring-2 focus:ring-[#8c5332]/20 transition-all outline-hidden font-medium"
            />
          </div>

          {/* 2. City Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="w-full bg-[#faf6f0] text-slate-800 text-xs sm:text-sm font-bold rounded-2xl px-3.5 py-2.5 border border-[#e8ded2] focus:border-[#8c5332] outline-hidden cursor-pointer"
            >
              <option value="الكل">كل المدن</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
              <option value="المدينة المنورة">المدينة المنورة</option>
              <option value="مكة المكرمة">مكة المكرمة</option>
              <option value="الخبر">الخبر</option>
              <option value="أبها">أبها</option>
            </select>
          </div>

          {/* 3. Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full bg-[#faf6f0] text-[#734123] text-xs sm:text-sm font-bold rounded-2xl px-3.5 py-2.5 border border-[#e6d8c7] focus:border-[#8c5332] outline-hidden cursor-pointer"
            >
              <option value="الكل">جميع التصنيفات</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* RESULT METRICS BAR */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
        <span>
          تم العثور على <strong className="text-[#8c5332] font-extrabold">{sortedItems.length}</strong> سلعة معروضة
        </span>
        {(selectedCategoryFilter !== 'الكل' || selectedCityFilter !== 'الكل' || conditionFilter !== 'الكل' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategoryFilter('الكل');
              setSelectedCityFilter('الكل');
              setConditionFilter('الكل');
              setSearchQuery('');
            }}
            className="text-[#8c5332] hover:underline cursor-pointer"
          >
            تفريغ الفلاتر ↺
          </button>
        )}
      </div>

      {/* ITEMS GRID */}
      {sortedItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">لا توجد نتائج تطابق معايير البحث</h3>
          <p className="text-xs text-slate-500 font-medium">جرب إزالة بعض خيارات الفلترة لعرض نتائج أكثر.</p>
        </div>
      ) : (
        <div className={`grid gap-4 sm:gap-4 ${
          settings.productGridCols === '6' ? 'grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          : settings.productGridCols === '5' ? 'grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
          : settings.productGridCols === '3' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
        }`}>
          {sortedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelectItem={(itm) => onSelectItem(itm)}
              onOpenTradeModal={(targetItm) => onOpenTradeModal(targetItm)}
              onViewUserProfile={onViewUserProfile}
            />
          ))}
        </div>
      )}

    </div>
  );
};
