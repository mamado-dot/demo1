import React, { useState } from 'react';
import { useBarter } from '../context/BarterContext';
import { BarterItem, BarterContract, User } from '../types';
import { ItemCard } from './ItemCard';
import { NegotiationsView } from './NegotiationsView';
import { 
  User as UserIcon, 
  Package, 
  ArrowLeftRight, 
  MapPin, 
  Star, 
  BadgeCheck, 
  ArrowRight, 
  Edit3, 
  Check, 
  PlusCircle, 
  Save,
  Phone,
  MessageSquare
} from 'lucide-react';

interface UserProfilePageProps {
  userId?: string;
  initialTab?: 'profile' | 'items' | 'negotiations';
  onClose: () => void;
  onSelectItem: (item: BarterItem) => void;
  onOpenTradeModal: (item: BarterItem) => void;
  onOpenAddItem: () => void;
  onViewContract?: (contract: BarterContract) => void;
  onOpenAdmin?: () => void;
  onViewUserProfile?: (userId: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  userId,
  initialTab = 'items',
  onClose,
  onSelectItem,
  onOpenTradeModal,
  onOpenAddItem,
  onViewContract,
  onOpenAdmin,
  onViewUserProfile
}) => {
  const { 
    currentUser, 
    users, 
    items, 
    offers,
    updateUserProfile 
  } = useBarter();

  // Determine target user
  const targetUser: User = (userId ? users.find((u) => u.id === userId) : null) || currentUser || users[0];
  const isOwnProfile = currentUser && currentUser.id === targetUser.id;

  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'items' | 'negotiations'>(initialTab);

  // Edit State (Only relevant if isOwnProfile)
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(targetUser.name);
  const [city, setCity] = useState(targetUser.city);
  const [phone, setPhone] = useState(targetUser.phone || '');
  const [avatar, setAvatar] = useState(targetUser.avatar);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter active products owned by targetUser
  const userItems = items.filter((i) => i.ownerId === targetUser.id && i.status !== 'hidden');

  // Filter negotiations for target user
  const userNegotiations = offers.filter(
    (o) => o.offeredByUserId === targetUser.id || o.targetOwnerUserId === targetUser.id
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, city, phone, avatar });
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  ];

  if (activeProfileTab === 'negotiations' && isOwnProfile) {
    return (
      <NegotiationsView
        onClose={onClose}
        onViewContract={onViewContract}
        onViewUserProfile={onViewUserProfile}
      />
    );
  }

  // 1. ITEMS VIEW ("صفحة منتجاتي الخاصة بالعضو" - ONLY PRODUCTS)
  if (activeProfileTab === 'items') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl mx-auto pb-12 dir-rtl font-['Cairo',sans-serif]">
        {/* Top Navigation Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              title="العودة"
              aria-label="العودة"
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#8c5332] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#8c5332]/20">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                {isOwnProfile ? 'منتجاتي' : `منتجات العضو: ${targetUser.name}`}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                عرض المنتجات والسلع المعروضة للمقايضة ({userItems.length})
              </p>
            </div>
          </div>
        </div>

        {/* ONLY PRODUCTS GRID */}
        {userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelectItem={onSelectItem}
                onOpenTradeModal={onOpenTradeModal}
                onViewUserProfile={onViewUserProfile}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-800">لا توجد منتجات حالية</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              لم يتم إضافة أي منتجات أو سلع جديدة للمقايضة في الوقت الحالي.
            </p>
          </div>
        )}
      </div>
    );
  }

  // 2. PROFILE VIEW ("الملف الشخصي")
  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-6xl mx-auto pb-12 dir-rtl font-['Cairo',sans-serif]">
      {/* Top Header Navigation */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            title="العودة"
            aria-label="العودة"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-[#8c5332] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#8c5332]/20">
            <UserIcon className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900">
              {isOwnProfile ? 'الملف الشخصي لحسابي' : `الملف الشخصي: ${targetUser.name}`}
            </h1>
            <p className="text-xs text-slate-500 font-medium">عرض واستعراض المعلومات والتقييمات</p>
          </div>
        </div>

        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#8c5332] text-white hover:bg-[#734123] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'إغلاق التعديل' : 'تعديل البيانات'}</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ التغييرات على الملف الشخصي بنجاح!</span>
        </div>
      )}

      {/* Profile Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          
          {/* Avatar + Name + City */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-right">
            <div className="relative shrink-0">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-[#8c5332]/20 shadow-md"
              />
              {targetUser.verified && (
                <div className="absolute -bottom-2 -right-2 bg-[#8c5332] text-white p-1.5 rounded-xl shadow-md border-2 border-white" title="عضو موثق">
                  <BadgeCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{targetUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f5eee6] text-[#734123] border border-[#e6d8c7]">
                  {targetUser.verified ? 'عضو موثق ✓' : 'حساب عادي'}
                </span>
              </div>

              {/* المدينة (City) */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-extrabold text-slate-600">
                <MapPin className="w-4 h-4 text-[#8c5332]" />
                <span>المدينة: <strong className="text-slate-900">{targetUser.city}</strong></span>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center">
            
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-1 min-w-[100px]">
              <div className="text-[10px] font-extrabold text-slate-500 uppercase">المقايضات</div>
              <div className="text-lg sm:text-2xl font-black text-emerald-600">
                {targetUser.completedBartersCount ?? 0}
              </div>
              <div className="text-[10px] text-slate-500 font-bold">مقايضة ناجحة</div>
            </div>

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 space-y-1 min-w-[100px]">
              <div className="text-[10px] font-extrabold text-slate-500 uppercase">التقييم</div>
              <div className="text-lg sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                <span>{targetUser.rating ?? 5.0}</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[10px] text-slate-500 font-bold">من 5 نجوم</div>
            </div>

            <button
              onClick={() => setActiveProfileTab('items')}
              className="bg-[#f5eee6] hover:bg-[#ebdccb] transition-all p-3.5 sm:p-4 rounded-2xl border border-[#e6d8c7] space-y-1 min-w-[100px] cursor-pointer"
            >
              <div className="text-[10px] font-extrabold text-[#734123] uppercase">المنتجات</div>
              <div className="text-lg sm:text-2xl font-black text-[#8c5332]">
                {userItems.length}
              </div>
              <div className="text-[10px] text-[#8c5332] font-bold">عرض المنتجات ←</div>
            </button>

          </div>

        </div>

        {/* Edit Profile Form Panel */}
        {isOwnProfile && isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-6 border-t border-slate-100 space-y-4 animate-in fade-in">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-[#8c5332]" />
              <span>تحديث بيانات حسابك الشخصي:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8c5332]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">المدينة</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8c5332]"
                >
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة المكرمة">مكة المكرمة</option>
                  <option value="المدينة المنورة">المدينة المنورة</option>
                  <option value="الخبر">الخبر</option>
                  <option value="أبها">أبها</option>
                  <option value="تبوك">تبوك</option>
                  <option value="القصيم">القصيم</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">رقم الجوال</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8c5332]"
                  required
                />
              </div>
            </div>



            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ البيانات</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
