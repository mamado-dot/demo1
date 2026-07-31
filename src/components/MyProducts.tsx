import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  MapPin, 
  Sparkles,
} from 'lucide-react';
import { Listing, User, ListingType, City } from '../types';
import { CITIES, CATEGORIES } from '../data/mockData';

interface MyProductsProps {
  currentUser: User | null;
  userListings: Listing[];
  onUpdateListing: (listing: Listing) => void;
  onDeleteListing: (listingId: string) => void;
  onToggleHideListing: (listingId: string) => void;
  onMarkCompleted: (listingId: string) => void;
  onOpenAddListing: () => void;
  onViewDetails: (listing: Listing) => void;
  language?: 'en' | 'ar';
}

export default function MyProducts({
  currentUser,
  userListings,
  onUpdateListing,
  onDeleteListing,
  onToggleHideListing,
  onMarkCompleted,
  onOpenAddListing,
  onViewDetails,
  language = 'ar'
}: MyProductsProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // Modal editing state
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for edit modal
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<ListingType>('سلعة');
  const [editCategory, setEditCategory] = useState('');
  const [editCity, setEditCity] = useState<City>('الرياض');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editWantedInReturn, setEditWantedInReturn] = useState('');
  const [editCashDifference, setEditCashDifference] = useState<string | number>('');
  const [editStatus, setEditStatus] = useState<'نشط' | 'مكتمل'>('نشط');
  const [editIsHidden, setEditIsHidden] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 max-w-lg mx-auto shadow-sm space-y-4 my-8">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-gray-900">يلزم تسجيل الدخول</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          يرجى تسجيل الدخول لعرض وإدارة المنتجات والخدمات الخاصة بك.
        </p>
      </div>
    );
  }

  // User's own items
  const myListings = userListings.filter(l => l.ownerId === currentUser.id);

  // Statistics
  const totalCount = myListings.length;
  const activeCount = myListings.filter(l => l.status === 'نشط' && !l.isHidden).length;
  const hiddenCount = myListings.filter(l => l.isHidden).length;
  const completedCount = myListings.filter(l => l.status === 'مكتمل').length;

  // Filtered list
  const filteredListings = myListings.filter(listing => {
    // Status filter
    if (filterStatus === 'active' && (listing.status !== 'نشط' || listing.isHidden)) return false;
    if (filterStatus === 'hidden' && !listing.isHidden) return false;
    if (filterStatus === 'completed' && listing.status !== 'مكتمل') return false;

    // Category filter
    if (selectedCategory !== 'الكل' && listing.category !== selectedCategory) return false;

    return true;
  });

  const handleOpenEdit = (listing: Listing) => {
    setEditingListing(listing);
    setEditTitle(listing.title);
    setEditType(listing.type);
    setEditCategory(listing.category);
    setEditCity(listing.city);
    setEditDescription(listing.description);
    setEditImageUrl(listing.imageUrl);
    setEditWantedInReturn(listing.wantedInReturn);
    setEditCashDifference(listing.cashDifference || '');
    setEditStatus(listing.status);
    setEditIsHidden(!!listing.isHidden);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    const updated: Listing = {
      ...editingListing,
      title: editTitle.trim(),
      type: editType,
      category: editCategory,
      city: editCity,
      description: editDescription.trim(),
      imageUrl: editImageUrl.trim() || editingListing.imageUrl,
      wantedInReturn: editWantedInReturn.trim(),
      cashDifference: editCashDifference,
      status: editStatus,
      isHidden: editIsHidden,
    };

    onUpdateListing(updated);
    setEditingListing(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="my_products_page" className="space-y-6 font-sans text-right" dir="rtl">
      
      {/* 1. Simple Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">منتجاتي ومعروضاتي</h1>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
              إدارة المنتجات والخدمات الخاصة بك، إخفائها أو تعديلها أو حذفها.
            </p>
          </div>

          <button
            onClick={onOpenAddListing}
            className="bg-white hover:bg-emerald-50 text-emerald-900 font-black text-xs px-4 py-2.5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>إضافة عرض جديد للمقايضة</span>
          </button>
        </div>
      </div>

      {/* 2. Simplified Category Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-2xs">
        <div className="flex flex-row justify-between items-center gap-3">
          
          <div className="text-xs font-bold text-gray-500">
            إجمالي المعروضات: <span className="text-emerald-700 font-black">{totalCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
            >
              <option value="الكل">جميع التصنيفات</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* 4. Products List Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 py-12 px-6 text-center text-gray-500 space-y-3 shadow-2xs">
          <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm">لا توجد منتجات مطابقة لخيارات الفرز</p>
            <p className="text-xs text-gray-400 mt-1">
              جرب تغيير كلمات البحث أو مسح تصفية الفئات لعرض باقي المنتجات.
            </p>
          </div>
          {myListings.length === 0 && (
            <button
              onClick={onOpenAddListing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتجك الأول الآن</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => {
            const isHidden = listing.isHidden;
            const isCompleted = listing.status === 'مكتمل';

            return (
              <div 
                key={listing.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isHidden 
                    ? 'border-amber-200 bg-amber-50/20' 
                    : isCompleted 
                    ? 'border-blue-100 opacity-90' 
                    : 'border-gray-100'
                }`}
              >
                <div>
                  {/* Image & Top Badges */}
                  <div className="relative h-36 overflow-hidden bg-gray-100">
                    <img 
                      src={listing.imageUrl} 
                      alt={listing.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Status Badges */}
                    <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1">
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-2xs">
                        {listing.type}
                      </span>
                    </div>

                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-end">
                      {isHidden && (
                        <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          <span>مخفي</span>
                        </span>
                      )}
                      {isCompleted && (
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>تمت المقايضة</span>
                        </span>
                      )}
                    </div>

                    {/* City Badge */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{listing.city}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-3 space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-gray-900 text-sm leading-tight line-clamp-1">
                        {listing.title}
                      </h3>
                      <button
                        onClick={() => onViewDetails(listing)}
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline shrink-0"
                      >
                        معاينة ↗
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-500 line-clamp-1 leading-snug">
                      {listing.description}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-2 border border-gray-100 space-y-0.5">
                      <div className="text-[10px] font-bold text-gray-400">المطلوب بالمقابل:</div>
                      <div className="text-xs font-extrabold text-emerald-900 line-clamp-1">
                        {listing.wantedInReturn}
                      </div>
                      {listing.cashDifference && (
                        <div className="text-[10px] font-bold text-amber-700 pt-0.5">
                          فارق مبلغ: {listing.cashDifference} ريال
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="p-2.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-1.5">
                  
                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(listing)}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-800 hover:text-emerald-800 text-[11px] font-extrabold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تعديل</span>
                  </button>

                  {/* Toggle Hide / Show Button */}
                  <button
                    onClick={() => onToggleHideListing(listing.id)}
                    title={isHidden ? 'إظهار العرض في التغذية العامة' : 'إخفاء العرض مؤقتاً'}
                    className={`flex-1 py-1.5 px-2 border text-[11px] font-extrabold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${
                      isHidden 
                        ? 'bg-amber-100/80 hover:bg-amber-200 border-amber-300 text-amber-900' 
                        : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {isHidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
                        <span>إظهار</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                        <span>إخفاء</span>
                      </>
                    )}
                  </button>

                  {/* Mark Completed / Reactivate Toggle */}
                  <button
                    onClick={() => {
                      if (isCompleted) {
                        onUpdateListing({ ...listing, status: 'نشط' });
                      } else {
                        onMarkCompleted(listing.id);
                      }
                    }}
                    title={isCompleted ? 'إعادة التنشيط' : 'تحديد كمكتمل'}
                    className={`p-2 border rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-2xs ${
                      isCompleted 
                        ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200' 
                        : 'bg-white hover:bg-emerald-50 border-gray-200 text-gray-500 hover:text-emerald-600'
                    }`}
                  >
                    {isCompleted ? <RotateCcw className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmId(listing.id)}
                    title="حذف العرض"
                    className="p-2 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-red-500 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl relative my-8 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-base text-gray-900">تعديل بيانات المنتج / الخدمة</h3>
              </div>
              <button onClick={() => setEditingListing(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-bold">
              
              {/* Title */}
              <div>
                <label className="block text-gray-800 mb-1">عنوان العرض / المنتج *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-800 mb-1">نوع العرض *</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as ListingType)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
                  >
                    <option value="سلعة">سلعة</option>
                    <option value="خدمة">خدمة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-800 mb-1">التصنيف *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-800 mb-1">المدينة *</label>
                <select
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value as City)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Image Upload / URL */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <label className="block text-gray-800">صورة المنتج</label>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <img
                    src={editImageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center space-x-1.5 space-x-reverse bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-[11px] font-bold text-gray-700 hover:bg-gray-100 cursor-pointer shadow-2xs">
                      <span>رفع صورة جديدة 📷</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="رابط الصورة https://..."
                      className="w-full border border-gray-200 rounded-xl p-2 text-[11px] bg-white dir-ltr text-left"
                    />
                  </div>
                </div>
              </div>

              {/* Wanted In Return */}
              <div>
                <label className="block text-gray-800 mb-1">المطلوب بالمقابل للمقايضة *</label>
                <input
                  type="text"
                  required
                  value={editWantedInReturn}
                  onChange={(e) => setEditWantedInReturn(e.target.value)}
                  placeholder="مثال: آيفون 13 أو بلايستيشن 5..."
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Cash Difference */}
              <div>
                <label className="block text-gray-800 mb-1">فارق مبلغ مالي (اختياري)</label>
                <input
                  type="text"
                  value={editCashDifference}
                  onChange={(e) => setEditCashDifference(e.target.value)}
                  placeholder="مثال: +200 ريال"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-800 mb-1">الوصف والتفاصيل *</label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Visibility & Status Settings */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-2.5">
                <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsHidden}
                    onChange={(e) => setEditIsHidden(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span className="text-gray-800 font-bold">إخفاء هذا العرض عن التغذية العامة والزوار (مؤقتاً)</span>
                </label>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                  <span className="text-gray-700">حالة العرض:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditStatus('نشط')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        editStatus === 'نشط' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      نشط
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus('مكتمل')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        editStatus === 'مكتمل' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      مكتمل المقايضة
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2 space-x-reverse pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  حفظ التعديلات
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">حذف العرض نهائياً؟</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لن تتمكن من استعادته بعد الحذف.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  onDeleteListing(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
