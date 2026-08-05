import React from 'react';
import { Home, Heart, Plus, MessageSquare, ArrowLeftRight } from 'lucide-react';
import { useBarter } from '../context/BarterContext';

interface MobileBottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAddItem: () => void;
  onOpenOffers: () => void;
  onOpenProfileTab?: (tab: 'profile' | 'items' | 'offers' | 'contracts' | 'negotiations') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onNavigate,
  onOpenAddItem,
  onOpenOffers,
  onOpenProfileTab,
}) => {
  const { currentUser, favorites, offers } = useBarter();

  const userNegotiationsCount = currentUser
    ? offers.filter((o) => o.offeredByUserId === currentUser.id || o.targetOwnerUserId === currentUser.id).length
    : 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 dir-rtl">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        
        {/* 1. الرئيسية (Home) */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            activeView === 'home' ? 'text-[#8c5332] font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-bold'
          }`}
        >
          <Home className={`w-5 h-5 ${activeView === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 tracking-tight">الرئيسية</span>
        </button>

        {/* 2. المفضلة (Favorites) */}
        <button
          onClick={() => onNavigate('favorites')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
            activeView === 'favorites' ? 'text-[#8c5332] font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-bold'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeView === 'favorites' ? 'fill-[#8c5332]/20 stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">المفضلة</span>
        </button>

        {/* 3. زر الإضافة البارز في المنتصف (+) */}
        <div className="flex justify-center items-center -mt-6">
          <button
            onClick={() => {
              if (onOpenAddItem) {
                onOpenAddItem();
              } else {
                onNavigate('add_item');
              }
            }}
            className="w-13 h-13 rounded-full bg-[#8c5332] hover:bg-[#734123] text-white shadow-lg border-4 border-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            title="إضافة سلعة"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. مفاوضات (Negotiations - instead of الإشعارات) */}
        <button
          onClick={() => {
            if (onOpenProfileTab) {
              onOpenProfileTab('negotiations');
            } else {
              onNavigate('user_profile');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
            activeView === 'user_profile' ? 'text-[#8c5332] font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-bold'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${activeView === 'user_profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">مفاوضات</span>
        </button>

        {/* 5. مقايضاتي (My Barters) */}
        <button
          onClick={() => {
            if (onOpenOffers) {
              onOpenOffers();
            } else {
              onNavigate('my_offers');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
            activeView === 'my_offers' ? 'text-[#8c5332] font-black scale-105' : 'text-slate-500 hover:text-slate-800 font-bold'
          }`}
        >
          <ArrowLeftRight className={`w-5 h-5 ${activeView === 'my_offers' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 tracking-tight">مقايضاتي</span>
        </button>

      </div>
    </nav>
  );
};
