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
  onNavigateToMyProducts?: () => void;
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
  onNavigateToMyProducts,
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
  const [editAvatar, setEditAvatar] = useState(targetUser.avatar || '');
  const [editPhone, setEditPhone] = useState(targetUser.phone || '');
  const [editEmail, setEditEmail] = useState(targetUser.email || (targetUser.phone?.includes('@') ? targetUser.phone : ''));

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const myListings = userListings.filter(l => l.ownerId === targetUser.id);
  const [showReviews, setShowReviews] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !currentUser) return;

    const updated: UserType = {
      ...currentUser,
      name: editName.trim(),
      city: editCity,
      bio: editBio.trim(),
      avatar: editAvatar.trim() || currentUser.avatar,
      phone: editPhone.trim() || currentUser.phone,
      email: editEmail.trim() || currentUser.email
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

            {/* Action Buttons: Edit Profile & Manage Products */}
            {isOwnProfile ? (
              <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-y-2">
                {onNavigateToMyProducts && (
                  <button
                    onClick={onNavigateToMyProducts}
                    className="flex items-center space-x-1.5 space-x-reverse bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <span>{isRtl ? 'إدارة منتجاتي' : 'Manage My Products'}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditName(targetUser.name);
                    setEditCity(targetUser.city);
                    setEditBio(targetUser.bio || '');
                    setEditAvatar(targetUser.avatar || '');
                    setEditPhone(targetUser.phone || '');
                    setEditEmail(targetUser.email || (targetUser.phone?.includes('@') ? targetUser.phone : ''));
                    setIsEditingProfile(true);
                  }}
                  className={`flex items-center space-x-1.5 ${isRtl ? 'space-x-reverse' : ''} bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                  <span>{isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
                </button>
              </div>
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
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100" id="profile_stats_grid">
            <div className="bg-brand-50/50 p-3 rounded-2xl border border-brand-100/60 text-center">
              <span className="block text-lg sm:text-xl font-black text-brand-700">{targetUser.completedSwaps}</span>
              <span className="text-[11px] font-bold text-brand-900/70">{isRtl ? 'مقايضات ناجحة' : 'Completed Swaps'}</span>
            </div>

            <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100/60 text-center">
              <span className="block text-lg sm:text-xl font-black text-blue-700">{myListings.length}</span>
              <span className="text-[11px] font-bold text-blue-900/70">{isRtl ? 'إجمالي المنتجات' : 'Total Listings'}</span>
            </div>

            {/* Interactive Rating Box */}
            <div 
              onClick={() => setShowReviews(!showReviews)}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition-all shadow-2xs group ${
                showReviews 
                  ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300' 
                  : 'bg-amber-50/60 hover:bg-amber-100/80 border-amber-200/80'
              }`}
              title="اضغط لعرض التقييمات والآراء"
            >
              <div className="flex items-center justify-center space-x-1 space-x-reverse">
                <span className="block text-lg sm:text-xl font-black text-amber-700">{targetUser.rating}</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              </div>
              <span className="text-[11px] font-bold text-amber-900/80 group-hover:underline block">
                {isRtl ? `التقييمات (${reviews.length})` : `Reviews (${reviews.length})`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION TOGGLED BY RATING BOX */}
      {showReviews && (
        <div className="bg-amber-50/40 p-5 rounded-3xl border border-amber-200/70 space-y-4 animate-in fade-in duration-200" id="toggled_reviews_box">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <h3 className="font-black text-gray-900 text-sm flex items-center space-x-2 space-x-reverse">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{isRtl ? `آراء وتقييمات الأعضاء (${reviews.length})` : `Member Reviews (${reviews.length})`}</span>
            </h3>
            <button 
              onClick={() => setShowReviews(false)}
              className="text-xs text-gray-500 hover:text-gray-800 font-bold bg-white px-2.5 py-1 rounded-xl border border-gray-200 cursor-pointer"
            >
              إغلاق ✕
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-xs font-semibold">
              {isRtl ? 'لا توجد تقييمات مكتوبة لهذا العضو بعد.' : 'No written reviews yet.'}
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-start space-x-3 space-x-reverse">
                  <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="w-9 h-9 rounded-full object-cover shrink-0" />
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
                    <p className="text-xs text-gray-600 mt-1">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MAIN LISTINGS SECTION (Directly rendered without subtabs or filters) */}
      <div className="space-y-4" id="tab_my_listings">
        {myListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 py-12 px-6 text-center text-gray-500 flex flex-col items-center justify-center space-y-3" id="my_listings_empty">
            <div className="p-3.5 bg-brand-50 text-brand-600 rounded-full">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="font-black text-gray-800 text-sm">{isRtl ? 'لا توجد معروضات مضافة حالياً' : 'No active items added'}</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                {isOwnProfile 
                  ? (isRtl ? 'يمكنك إضافة عروض جديدة من خلال زر "اضف عرضك" في الصفحة الرئيسية.' : 'You can add items from the homepage.')
                  : (isRtl ? 'لم يقم هذا العضو بإضافة أي معروضات حتى الآن.' : 'This user has not added any items yet.')
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="my_listings_grid">
            {myListings.map((list) => (
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

      {/* EDIT PROFILE MODAL */}
      {isOwnProfile && isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl relative my-8 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-black text-base text-gray-900">{isRtl ? 'تعديل بيانات الملف الشخصي' : 'Edit Profile Info'}</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Avatar Section */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                <label className="block text-xs font-black text-gray-800">{isRtl ? 'الصورة الشخصية' : 'Profile Avatar'}</label>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <img
                    src={editAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500 shadow-xs bg-white shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center space-x-1.5 space-x-reverse bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer shadow-2xs">
                      <span>{isRtl ? 'رفع صورة جديدة 📷' : 'Upload New Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-brand-500 outline-hidden bg-white dir-ltr text-left"
                    />
                  </div>
                </div>
              </div>

              {/* Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">{isRtl ? 'الاسم الكامل *' : 'Full Name *'}</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-brand-500 outline-hidden bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">{isRtl ? 'المدينة *' : 'City *'}</label>
                  <select
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value as City)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-brand-500 outline-hidden bg-white cursor-pointer"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Info: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-hidden bg-gray-50/50 dir-ltr text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">{isRtl ? 'رقم الجوال / الهاتف' : 'Phone Number'}</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="0501234567"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-hidden bg-gray-50/50 dir-ltr text-left"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">{isRtl ? 'النبذة التعريفية' : 'Bio'}</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder={isRtl ? 'نبذة قصيرة عن اهتماماتك والمواد التي تحب مقايضتها...' : 'Short bio about your hobbies and swap preferences...'}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-hidden bg-gray-50/50"
                />
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-brand-600 text-white hover:bg-brand-700 cursor-pointer shadow-xs"
                >
                  {isRtl ? 'حفظ البيانات' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

