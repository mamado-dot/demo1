import React from 'react';
import { BarterItem } from '../types';
import { useBarter } from '../context/BarterContext';
import { 
  ArrowLeftRight, 
  MapPin, 
  MessageSquare, 
  BadgeCheck, 
  Heart, 
  Sparkles, 
  Banknote, 
  Tag,
  Calendar
} from 'lucide-react';

interface ItemCardProps {
  item: BarterItem;
  onSelectItem: (item: BarterItem) => void;
  onOpenTradeModal: (targetItem: BarterItem) => void;
  onViewUserProfile?: (userId: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelectItem, onOpenTradeModal, onViewUserProfile }) => {
  const { users, currentUser, questions, toggleFavorite, isFavorite } = useBarter();

  const owner = users.find((u) => u.id === item.ownerId) || {
    name: 'مستخدم منصة',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    verified: true,
    city: item.location,
    rating: 0,
  };

  const isOwner = currentUser ? currentUser.id === item.ownerId : false;

  return (
    <div 
      onClick={() => onSelectItem(item)}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer"
    >
      
      {/* 📱 MOBILE VIEW: Horizontal Card Layout matching user request */}
      <div className="flex sm:hidden h-32 bg-white w-full">
        {/* Image Thumbnail */}
        <div className="relative w-32 shrink-0 bg-slate-100 border-l border-slate-100 overflow-hidden">
          <img
            src={item.images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800'}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {item.status === 'bartered' && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 z-10">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white">
                تمت المقايضة ✓
              </span>
            </div>
          )}

          {/* Favorite heart icon top-left on image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className={`absolute top-2 left-2 w-6 h-6 rounded-full backdrop-blur-md flex items-center justify-center transition-all z-10 cursor-pointer shadow-xs border ${
              isFavorite(item.id)
                ? 'bg-rose-500 text-white border-rose-400 shadow-rose-900/20'
                : 'bg-white/90 text-slate-700 border-white/40'
            }`}
          >
            <Heart className={`w-3 h-3 ${isFavorite(item.id) ? 'fill-white text-white' : 'fill-rose-500/10 text-slate-600'}`} />
          </button>
        </div>

        {/* Content Side: Title, Desired Item, City, Owner Name */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0 dir-rtl">
          <div className="space-y-1.5">
            {/* 1. عنوان المنتج */}
            <h3 className="text-xs font-black text-[#8c5332] line-clamp-2 leading-tight group-hover:underline">
              {item.title}
            </h3>

            {/* 2. المطلوب للمبادلة */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/70 w-fit max-w-full">
              <ArrowLeftRight className="w-3 h-3 shrink-0 text-amber-700" />
              <span className="truncate">
                المطلوب: {item.desiredDescription || item.desiredCategory}
              </span>
            </div>
          </div>

          {/* Bottom row: 3. المدينة & 4. اسم المعلن (بدون صورة) */}
          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100/80 gap-2">
            {/* المدينة */}
            <div className="flex items-center gap-1 font-bold text-slate-500 shrink-0">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[100px]">
                {item.location ? item.location.split('-')[0].split('،')[0].split(',')[0].trim() : ''}
              </span>
            </div>

            {/* اسم المعلن فقط بدون الصورة */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onViewUserProfile) onViewUserProfile(owner.id);
              }}
              className="flex items-center shrink-0 hover:opacity-80 transition-opacity"
            >
              <span className="font-extrabold text-slate-800 text-[11px] truncate max-w-[90px]">
                {owner.name}
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* 💻 DESKTOP & TABLET VIEW: Standard Vertical Card Layout */}
      <div className="hidden sm:flex flex-col h-full">
        {/* Image Thumbnail & Overlay Badges */}
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <img
            src={item.images[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800'}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Status / Bartered Badge */}
          {item.status === 'bartered' && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-md">
                تمت المقايضة ✓
              </span>
            </div>
          )}

          {/* Like / Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all z-10 cursor-pointer shadow-xs border ${
              isFavorite(item.id)
                ? 'bg-rose-500 text-white border-rose-400 shadow-rose-900/20 scale-105'
                : 'bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 border-white/40'
            }`}
            title={isFavorite(item.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart className={`w-4 h-4 ${isFavorite(item.id) ? 'fill-white text-white' : 'fill-rose-500/10 text-slate-600 hover:fill-rose-500 hover:text-rose-500'}`} />
          </button>
        </div>

        {/* Card Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          
          <div className="space-y-2">
            
            {/* Header Row: Title */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#8c5332] transition-colors line-clamp-1 leading-snug">
                {item.title}
              </h3>
            </div>

            {/* BARTER TARGET LINE (المطلوب للمقايضة) */}
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold pt-1">
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="line-clamp-1">
                {item.desiredDescription || item.desiredCategory}
              </span>
            </div>

            {/* LOCATION & PUBLICATION DATE */}
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium pt-0.5 gap-2">
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{item.createdAt}</span>
              </div>
            </div>

          </div>

          {/* Action Button & Owner Info Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onViewUserProfile) onViewUserProfile(owner.id);
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity group/ownerLink"
              title={`عرض الملف الشخصي لـ ${owner.name}`}
            >
              <img
                src={owner.avatar}
                alt={owner.name}
                className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-200 group-hover/ownerLink:ring-[#8c5332]"
              />
              <span className="text-xs font-bold text-slate-700 group-hover/ownerLink:text-[#8c5332] truncate max-w-[85px] transition-colors">
                {owner.name}
              </span>
            </div>

            {!isOwner && item.status !== 'bartered' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTradeModal(item);
                }}
                className="text-xs font-bold py-1.5 px-3 rounded-xl bg-[#8c5332] hover:bg-[#734123] text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>مقايضة</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item);
                }}
                className="text-xs font-bold py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              >
                التفاصيل
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
