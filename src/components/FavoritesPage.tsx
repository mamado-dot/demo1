import React from 'react';
import { useBarter } from '../context/BarterContext';
import { ItemCard } from './ItemCard';
import { BarterItem } from '../types';
import { 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Package, 
  SearchX, 
  PlusCircle, 
  Trash2,
  ArrowLeftRight
} from 'lucide-react';

interface FavoritesPageProps {
  onSelectItem: (item: BarterItem) => void;
  onOpenTradeModal: (targetItem: BarterItem) => void;
  onNavigateHome: () => void;
  onNavigateAllItems: () => void;
  onViewUserProfile?: (userId: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectItem,
  onOpenTradeModal,
  onNavigateHome,
  onNavigateAllItems,
  onViewUserProfile,
}) => {
  const { items, favorites, toggleFavorite } = useBarter();

  // Filter items that match favorite IDs
  const favoriteItems = items.filter((item) => favorites.includes(item.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Breadcrumb */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            title="العودة للرئيسية"
            aria-label="العودة للرئيسية"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center shrink-0 shadow-2xs">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>المفضلة</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">السلع والمنتجات التي قمت بحفظها للمقايضة لاحقاً</p>
            </div>
          </div>
        </div>

        {favoriteItems.length > 0 && (
          <button
            onClick={onNavigateAllItems}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#8c5332] hover:bg-[#734123] text-white font-bold text-xs transition-all cursor-pointer shadow-xs shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تصفح ورؤية المزيد</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {favoriteItems.length > 0 ? (
        <div className="space-y-4">
          


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoriteItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelectItem={onSelectItem}
                onOpenTradeModal={onOpenTradeModal}
                onViewUserProfile={onViewUserProfile}
              />
            ))}
          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 border border-rose-200/80 mx-auto flex items-center justify-center shadow-xs">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900">قائمة المفضلة فارغة حالياً</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              لم تقم بحفظ أي سلع في مفضلتك حتى الآن. يمكنك استكشاف السلع المتاحة للمقايضة والضغط على أيقونة القلب (❤️) على أي سلعة تعجبك لحفظها هنا!
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateAllItems}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#8c5332] hover:bg-[#734123] text-white font-extrabold text-xs transition-all shadow-md shadow-[#8c5332]/20 cursor-pointer active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>تصفح المعروضات الآن</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
