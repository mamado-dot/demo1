import React, { useState, useEffect } from 'react';
import { Plus, Star, Award, MapPin, RefreshCw, Edit3, Shield, Package, CheckCircle2, MessageSquare, ThumbsUp, X, ArrowRight } from 'lucide-react';
import { User as UserType, Listing, Review, City } from '../types';
import ListingCard from './ListingCard';
import { CITIES } from '../data/mockData';

interface ProfileSectionProps {
  currentUser: UserType | null;
  displayedUser?: UserType | null;
  userListings: Listing[];
  reviews: Review[];
  onDeleteListing?: (listingId: string) => void;
  onNavigateToAddListing?: () => void;
  onViewDetails?: (listing: Listing) => void;
  onMarkCompleted?: (listingId: string) => void;
  onUpdateUser?: (updatedUser: UserType) => void;
  onViewProfile?: (userId: string, userName?: string, userAvatar?: string) => void;
  onStartChat?: (user: UserType) => void;
  onBackToFeed?: () => void;
  language?: 'en' | 'ar';
  initialSubTab?: 'listings' | 'reviews' | 'trust';
}

export default function ProfileSection({
  currentUser,
  displayedUser,
  userListings,
  reviews,
  onDeleteListing,
  onNavigateToAddListing,
  onViewDetails,
  onMarkCompleted,
  onUpdateUser,
  onViewProfile,
  onStartChat,
  onBackToFeed,
  language = 'ar',
  initialSubTab = 'listings',
}: ProfileSectionProps) {
  const targetUser = displayedUser || currentUser;
  if (!targetUser) return null;

  const isOwnProfile = currentUser?.id === targetUser.id;

  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'reviews' | 'trust'>(initialSubTab);
  const [listingFilter, setListingFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Edit form state
  const [editName, setEditName] = useState(targetUser.name);
  const [editCity, setEditCity] = useState<City>(targetUser.city);
  const [editBio, setEditBio] = useState(targetUser.bio || '');

  const myListings = userListings.filter(l => l.ownerId === targetUser.id);
  const activeListings = myListings.filter(l => l.status === 'نشط');
  const completedListings = myListings.filter(l => l.status === 'مكتمل');

  const filteredListings = myListings.filter(l => {
    if (listingFilter === 'active') return l.status === 'نشط';
    if (listingFilter === 'completed') return l.status === 'مكتمل';
    return true;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !currentUser) return;

    const updated: UserType = {
      ...currentUser,
      name: editName.trim(),
      city: editCity,
      bio: editBio.trim(),
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setIsEditingProfile(false);
  };

  const isRtl = language === 'ar';

  return (
    <div id="profile_section_container" className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'} font-sans`}>
      
      {/* Top Header if viewing another user */}
      {!isOwnProfile && onBackToFeed && (
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={onBackToFeed}
            className="flex items-center space-x-1.5 space-x-reverse text-xs font-bold text-gray-700 hover:text-brand-700 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-brand-600" />
            <span>العودة للصفحة الرئيسية</span>
          </button>
          <span className="text-xs font-extrabold text-[#786142] bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#E8E2D5]">
            الملف الشخصي للعارض
          </span>
        </div>
      )}

      {/* 1. Main Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden" id="profile_main_card">
        {/* Cover / Header Banner */}
        <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 h-32 sm:h-40 relative p-6 flex items-end justify-between">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center space-x-1.5 space-x-reverse">
            <Shield className="w-3.5 h-3.5 text-brand-200" />
            <span>{isRtl ? 'حساب موثق وآمن' : 'Verified & Secure Account'}</span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative" id="profile_details_body">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end ${isRtl ? 'sm:flex-row-reverse' : ''} -mt-12 sm:-mt-14 mb-4 gap-4`}>
            {/* Avatar & Info */}
            <div className={`flex items-end space-x-4 ${isRtl ? 'space-x-reverse' : ''}`}>
              <div className="relative">
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-brand-500 border-2 border-white rounded-full" title="Online" />
              </div>

              <div className="pb-1">
                <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900">{targetUser.name}</h1>
                  <span className="bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center space-x-1 space-x-reverse">
                    <Award className="w-3 h-3 text-brand-600" />
                    <span>{targetUser.reliabilityLevel}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse text-xs text-gray-500 mt-1 font-semibold">
                  <span className="flex items-center space-x-1 space-x-reverse">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{targetUser.city}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 space-x-reverse text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{targetUser.rating} (5.0)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button: Edit Profile (if own) or Message Owner (if another) */}
            {isOwnProfile ? (
              <button
                onClick={() => {
                  setEditName(targetUser.name);
                  setEditCity(targetUser.city);
                  setEditBio(targetUser.bio);
                  setIsEditingProfile(true);
                }}
                className={`flex items-center space-x-1.5 ${isRtl ? 'space-x-reverse' : ''} bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer`}
              >
                <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                <span>{isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
              </button>
            ) : (
              <span className="text-[11px] text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 font-bold">
                المحادثات تفعل عند تقديم طلب مقايضة على العروض
              </span>
            )}
          </div>

          {/* Bio text */}
          {targetUser.bio && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mt-2 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
              {targetUser.bio}
            </p>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100" id="profile_stats_grid">
            <div className="bg-brand-50/50 p-3 rounded-2xl border border-brand-100/60 text-center">
              <span className="block text-lg sm:text-xl font-black text-brand-700">{targetUser.completedSwaps}</span>
              <span className="text-[11px] font-bold text-brand-900/70">{isRtl ? 'مقايضات ناجحة' : 'Completed Swaps'}</span>
            </div>

            <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100/60 text-center">
              <span className="block text-lg sm:text-xl font-black text-blue-700">{myListings.length}</span>
              <span className="text-[11px] font-bold text-blue-900/70">{isRtl ? 'إجمالي المنتجات' : 'Total Listings'}</span>
            </div>

            <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100/60 text-center">
              <span className="block text-lg sm:text-xl font-black text-amber-700">{targetUser.rating}</span>
              <span className="text-[11px] font-bold text-amber-900/70">{isRtl ? 'التقييم العام' : 'Overall Rating'}</span>
            </div>

            <div className="bg-purple-50/50 p-3 rounded-2xl border border-purple-100/60 text-center">
              <span className="block text-lg sm:text-xl font-black text-purple-700">{targetUser.reliabilityLevel}</span>
              <span className="text-[11px] font-bold text-purple-900/70">{isRtl ? 'درجة الموثوقية' : 'Reliability Level'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile Sub-tabs Bar (Only for logged-in user's own profile) */}
      {isOwnProfile && (
        <div className="flex border-b border-gray-200 space-x-6 space-x-reverse" id="profile_tabs_bar">
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center space-x-2 space-x-reverse border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'listings'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{isRtl ? `منتجاتي (${myListings.length})` : `My Listings (${myListings.length})`}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center space-x-2 space-x-reverse border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'reviews'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>{isRtl ? `التقييمات والآراء (${reviews.length})` : `Reviews & Ratings (${reviews.length})`}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('trust')}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center space-x-2 space-x-reverse border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'trust'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Shield className="w-4 h-4 text-brand-600" />
            <span>{isRtl ? 'الموثوقية وقواعد المجتمع' : 'Trust & Community Rules'}</span>
          </button>
        </div>
      )}

      {/* 3. Sub-Tab or Main Content */}

      {/* LISTINGS SECTION (Always shown for lister profile, or when activeSubTab === 'listings' for own profile) */}
      {(activeSubTab === 'listings' || !isOwnProfile) && (
        <div className="space-y-6" id="tab_my_listings">
          {/* Filters and Add button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center bg-gray-100/80 p-1 rounded-xl text-xs font-bold space-x-1 space-x-reverse">
              <button
                onClick={() => setListingFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${listingFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {isRtl ? `الكل (${myListings.length})` : `All (${myListings.length})`}
              </button>
              <button
                onClick={() => setListingFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${listingFilter === 'active' ? 'bg-white text-brand-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {isRtl ? `النشطة (${activeListings.length})` : `Active (${activeListings.length})`}
              </button>
              <button
                onClick={() => setListingFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${listingFilter === 'completed' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {isRtl ? `المكتملة (${completedListings.length})` : `Completed (${completedListings.length})`}
              </button>
            </div>

            {isOwnProfile && onNavigateToAddListing && (
              <button
                onClick={onNavigateToAddListing}
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-1.5 space-x-reverse transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isRtl ? 'إضافة منتج جديد' : 'Add New Item'}</span>
              </button>
            )}
          </div>

          {/* Grid or Empty */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 py-16 px-8 text-center text-gray-500 flex flex-col items-center justify-center space-y-4" id="my_listings_empty">
              <div className="p-4 bg-brand-50 text-brand-600 rounded-full">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <p className="font-extrabold text-gray-800 text-base">{isRtl ? 'لا توجد منتجات في هذه القائمة' : 'No items found in this filter'}</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  {isOwnProfile 
                    ? (isRtl ? 'ابدأ بعرض منتجاتك أو خدماتك الآن لتتمكن من تلقي عروض المقايضة والمبادلة من بقية الأعضاء.' : 'Start adding your items or services to get barter offers.')
                    : 'لم يقم هذا العارض بإضافة منتجات متاحة في هذه الفئة حالياً.'
                  }
                </p>
              </div>
              {isOwnProfile && onNavigateToAddListing && (
                <button
                  onClick={onNavigateToAddListing}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {isRtl ? 'اضف منتجك الأول الآن' : 'Add your first item now'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="my_listings_grid">
              {filteredListings.map((list) => (
                <ListingCard
                  key={list.id}
                  listing={list}
                  currentUser={currentUser}
                  onInitiateSwap={() => {}}
                  onMarkCompleted={isOwnProfile ? onMarkCompleted : undefined}
                  onViewDetails={onViewDetails}
                  onDelete={isOwnProfile ? onDeleteListing : undefined}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* REVIEWS SECTION FOR LISTER PROFILE IF REVIEWS EXIST AND NOT OWN PROFILE */}
      {!isOwnProfile && reviews.length > 0 && (
        <div className="mt-8 space-y-4 border-t border-gray-100 pt-6" id="lister_reviews_section">
          <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>تقييمات وآراء الأعضاء عن العارض ({reviews.length})</span>
          </h3>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-start space-x-3 space-x-reverse">
                <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900">{rev.reviewerName}</span>
                    <span className="text-[10px] text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REVIEWS (For own profile) */}
      {isOwnProfile && activeSubTab === 'reviews' && (
        <div className="space-y-4" id="tab_reviews">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500 space-y-3">
              <Star className="w-10 h-10 text-amber-300 mx-auto" />
              <h3 className="font-bold text-gray-800 text-base">{isRtl ? 'لا توجد تقييمات مسجلة بعد' : 'No reviews recorded yet'}</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                {isRtl 
                  ? 'يتم إضافة التقييمات تلقائياً من قبل الطرف الآخر عند إتمام أي صفقة مقايضة ناجحة وتقييم التبادلات.' 
                  : 'Reviews will appear here once other users rate completed barter swaps.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-start space-x-3 space-x-reverse">
                  <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">{rev.reviewerName}</span>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: TRUST & COMMUNITY (For own profile) */}
      {isOwnProfile && activeSubTab === 'trust' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-6" id="tab_trust_rules">
          <div className="flex items-start space-x-4 space-x-reverse bg-brand-50/60 p-4 rounded-2xl border border-brand-100">
            <div className="p-3 bg-brand-600 text-white rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-brand-950 text-sm sm:text-base">
                {isRtl ? 'مجتمع مقايضة آمن وبدون مقابل مالي' : 'Cash-Free Barter Guarantee'}
              </h3>
              <p className="text-xs text-brand-800/80 mt-1 leading-relaxed">
                {isRtl 
                  ? 'منصة بادل تضمن بيئة تعامل عادلة ومبنية على الموثوقية. تتم المقايضة مباشرة سلعة مقابل سلعة أو خدمة مقابل خدمة بدون استخدام أي عملات نقدية.'
                  : 'Badel guarantees a fair environment based on mutual trust. Swaps are executed product-for-product or service-for-service with zero cash.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">{isRtl ? 'معايير حساب الموثوقية:' : 'Reliability Metrics:'}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center space-x-1.5 space-x-reverse text-xs font-bold text-brand-700">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>{isRtl ? 'ممتاز (5.0)' : 'Excellent (5.0)'}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {isRtl ? 'للمستخدمين الأكثر نشاطاً والتزاماً بالمواعيد مع تقييمات إيجابية مستمرة.' : 'For top active users with consistent 5-star ratings.'}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center space-x-1.5 space-x-reverse text-xs font-bold text-blue-700">
                  <ThumbsUp className="w-4 h-4 text-blue-600" />
                  <span>{isRtl ? 'جيد جداً (4.5+)' : 'Very Good (4.5+)'}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {isRtl ? 'أتم عدة مقايضات ناجحة بنجاح وسرعة استجابة.' : 'Completed multiple successful swaps with fast responsiveness.'}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex items-center space-x-1.5 space-x-reverse text-xs font-bold text-amber-700">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>{isRtl ? 'مبتدئ' : 'Beginner'}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {isRtl ? 'عضو جديد بالمنصة يسعى لإجراء أول مقايضة له.' : 'New member looking forward to completing their first swap.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isOwnProfile && isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-base text-gray-900">{isRtl ? 'تعديل بيانات الملف الشخصي' : 'Edit Profile Info'}</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{isRtl ? 'الاسم *' : 'Name *'}</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-brand-500 outline-hidden bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{isRtl ? 'المدينة *' : 'City *'}</label>
                <select
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value as City)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-brand-500 outline-hidden bg-white cursor-pointer"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{isRtl ? 'النبذة الشخصية' : 'Bio'}</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder={isRtl ? 'نبذة قصيرة عن اهتماماتك والمواد التي تحب مقايضتها...' : 'Short bio about your hobbies and swap preferences...'}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-brand-500 outline-hidden bg-gray-50/50"
                />
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 cursor-pointer shadow-xs"
                >
                  {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

