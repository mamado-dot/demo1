import React, { useState, useRef } from 'react';
import { useBarter } from '../context/BarterContext';
import { BarterItem, CategoryName, ItemCondition } from '../types';
import { PlusCircle, ArrowLeftRight, ArrowRight, Banknote, Image as ImageIcon, CheckCircle2, Upload, Trash2, Sparkles, Lock, LogIn } from 'lucide-react';

interface AddItemModalProps {
  onClose: () => void;
  onSuccess?: (createdItem?: BarterItem) => void;
  onNavigateAuth?: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onSuccess, onNavigateAuth }) => {
  const { addItem, items, categories, currentUser, settings } = useBarter();

  // Guard 1: Guest Users (Require Login to Add Items)
  if (!currentUser) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 dir-rtl font-['Cairo',sans-serif]">
        {/* Top Navigation Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <button
            onClick={onClose}
            title="إلغاء والعودة للرئيسية"
            aria-label="إلغاء والعودة للرئيسية"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8c5332] text-white flex items-center justify-center font-bold">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-slate-900">إضافة سلعة جديدة للمقايضة</span>
          </div>
        </div>

        {/* Member Access Restriction Box */}
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 bg-amber-50 text-[#8c5332] border border-amber-200/80 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">خاصية إضافة السلع حصرية للأعضاء المسجلين</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
              عفواً، لا يمكن للزوار إضافة منتجات أو عرض سلع جديدة للمقايضة. يرجى تسجيل الدخول أو إنشاء حساب جديد مجاناً لتتمكن من إضافة سلعك وتبادلها بكل سهولة وبأمان تام.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                if (onNavigateAuth) onNavigateAuth();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#8c5332]/20"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول / إنشاء حساب</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              تصفح السلع كزائر
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Guard 2: Account pending activation from Admin Panel
  if (currentUser.isActive === false && !currentUser.isOwner) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 dir-rtl font-['Cairo',sans-serif]">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <button
            onClick={onClose}
            title="العودة للرئيسية"
            aria-label="العودة للرئيسية"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-amber-200 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-700 border border-amber-300 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">حسابك بانتظار التفعيل من إدارة المنصة</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
              لمنع السبام والحسابات الوهمية، يتم مراجعة وتفعيل حسابات الأعضاء الجدد عن طريق إدارة المنصة قبل السماح بنشر السلع. يُرجى الانتظار لحين تفعيل حسابك من لوحة التحكم.
            </p>
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              فهمت ذلك
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Guard 3: One item per day limit check
  const todayStr = new Date().toISOString().split('T')[0];
  const itemsAddedToday = items.filter(
    (item) => item.ownerId === currentUser.id && item.createdAt === todayStr
  );

  if (itemsAddedToday.length >= 1 && !currentUser.isOwner) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200 dir-rtl font-['Cairo',sans-serif]">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <button
            onClick={onClose}
            title="العودة للرئيسية"
            aria-label="العودة للرئيسية"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 bg-rose-50 text-rose-600 border border-rose-200 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
            <PlusCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">لقد وصلت للحد الأقصى اليومي</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
              وفقاً لقواعد المنصة، يُسمح لكل عضو بإضافة سلعة واحدة فقط في اليوم الواحد. لقد قمت بإضافة سلعة اليوم، ويمكنك إضافة سلعة جديدة غداً.
            </p>
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold transition-all cursor-pointer"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryName>('إلكترونيات وأجهزة');
  const [condition, setCondition] = useState<ItemCondition>('ممتاز كالجديد');
  const [estimatedValue, setEstimatedValue] = useState<number | ''>(0);
  const [location, setLocation] = useState(currentUser?.city || 'الرياض');
  const [description, setDescription] = useState('');
  
  // File Upload State (Offered Item - Min 3, Max 5)
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // File Upload State (Desired Item - Optional)
  const [desiredImageUrl, setDesiredImageUrl] = useState('');
  const [isDraggingDesired, setIsDraggingDesired] = useState(false);

  // Barter Target Preferences
  const [desiredDescription, setDesiredDescription] = useState('');
  const [allowCashDifference, setAllowCashDifference] = useState(false);
  const [maxCashDifference, setMaxCashDifference] = useState<number | ''>(0);
  const [deliveryPreference, setDeliveryPreference] = useState<'استلام يدوي' | 'شحن بريدي' | 'كلاهما يفي بالغرض'>('استلام يدوي');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMultipleFilesUpload = (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (files.length === 0) return;

    if (imageUrls.length >= 5) {
      setErrorMsg('لقد وصلت للحد الأقصى المسموح به (5 صور كحد أقصى)');
      return;
    }

    const availableSlots = 5 - imageUrls.length;
    const filesToUpload = files.slice(0, availableSlots);

    let hasError = false;
    const newImages: string[] = [];
    let processedCount = 0;

    filesToUpload.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('يرجى اختيار ملفات صور صالحة (JPG, PNG, WEBP)');
        hasError = true;
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('حجم إحدى الصور كبير، يرجى اختيار صور بحجم أقل من 8 ميجابايت');
        hasError = true;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processedCount++;
        if (processedCount === filesToUpload.length) {
          setImageUrls((prev) => [...prev, ...newImages].slice(0, 5));
          if (!hasError) setErrorMsg('');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleMultipleFilesUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleMultipleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDesiredFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('حجم الصورة كبير، يرجى اختيار صورة بحجم أقل من 8 ميجابايت');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setDesiredImageUrl(reader.result as string);
      if (errorMsg) setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleDesiredFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDesiredFileUpload(file);
    }
  };

  const handleDesiredDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingDesired(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleDesiredFileUpload(file);
    }
  };

  const conditionOptions = settings.addItemConditionOptions && settings.addItemConditionOptions.length > 0
    ? settings.addItemConditionOptions
    : ['جديد (بالكرتون)', 'ممتاز كالجديد', 'مستعمل بحالة جيدة', 'مستعمل مع خدوش بسيطة'];

  const deliveryOptions = settings.addItemDeliveryOptions && settings.addItemDeliveryOptions.length > 0
    ? settings.addItemDeliveryOptions
    : ['استلام يدوي', 'شحن بريدي', 'كلاهما يفي بالغرض'];

  const isSubmittingRef = useRef(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting || successMsg) return;

    if ((settings.addItemShowTitle ?? true) && (settings.addItemTitleRequired ?? true) && !title.trim()) {
      setErrorMsg('يرجى إدخال عنوان واضح للسلعة المعروضة');
      return;
    }
    if ((settings.addItemShowImageUpload ?? true) && (settings.addItemImageUploadRequired ?? true)) {
      if (imageUrls.length < 3) {
        setErrorMsg(`إجباري رفع 3 صور على الأقل للسلعة المعروضة (تم رفع ${imageUrls.length} من أصل 3 - بحد أقصى 5 صور)`);
        return;
      }
    }
    if ((settings.addItemShowDescription ?? true) && (settings.addItemDescriptionRequired ?? true) && !description.trim()) {
      setErrorMsg('يرجى إدخال وصف وافي لحالة السلعة');
      return;
    }
    if ((settings.addItemShowDesiredItem ?? true) && (settings.addItemDesiredItemRequired ?? true) && !desiredDescription.trim()) {
      setErrorMsg('يرجى توضيح ماذا تطلب بالمقابل لمقايضة هذه السلعة');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const createdItem = addItem({
        title: title.trim() || 'سلعة بدون عنوان',
        category,
        condition,
        estimatedValue: Number(estimatedValue) || 0,
        description: description.trim() || 'لا يوجد وصف تفصيلي',
        location: location.trim() || 'الرياض',
        images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800'],
        desiredCategory: 'أي فئة مناسبة',
        desiredDescription: desiredDescription.trim() || 'المقايضة مقابل أي عرض مناسب',
        desiredImage: desiredImageUrl.trim() || undefined,
        allowCashDifference,
        maxCashDifference: allowCashDifference ? (Number(maxCashDifference) || 0) : undefined,
        deliveryPreference,
      });

      setSuccessMsg('تم نشر السلعة بنجاح! جاري الانتقال إلى العرض...');

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(createdItem);
        } else {
          onClose();
        }
      }, 200);
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء إضافة السلعة، يرجى المحاولة مرة أخرى');
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <button
            onClick={onClose}
            title="إلغاء والعودة للرئيسية"
            aria-label="إلغاء والعودة للرئيسية"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#8c5332] text-white flex items-center justify-center font-bold">
            <PlusCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-900">إضافة سلعة جديدة للمقايضة</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white max-w-4xl mx-auto rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">

          {successMsg && (
            <div className="p-4 bg-[#f5eee6] text-[#734123] border border-[#e6d8c7] rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-[#8c5332] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Item Details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
              1. تفاصيل السلعة المعروضة
            </h3>

            {/* Title Field */}
            {(settings.addItemShowTitle ?? true) && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {settings.addItemTitleLabel || 'عنوان السلعة *'}
                </label>
                <input
                  type="text"
                  placeholder={settings.addItemTitlePlaceholder || 'مثلاً: كاميرا نيكون Z6، أو بلايستيشن 5...'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-slate-200 focus:border-[#8c5332] outline-hidden font-medium"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category Field */}
              {(settings.addItemShowCategory ?? true) && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {settings.addItemCategoryLabel || 'الفئة *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryName)}
                    className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#8c5332] outline-hidden font-bold cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Condition Field */}
              {(settings.addItemShowCondition ?? true) && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {settings.addItemConditionLabel || 'حالة السلعة *'}
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#8c5332] outline-hidden font-bold cursor-pointer"
                  >
                    {conditionOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Estimated Value Field */}
              {(settings.addItemShowEstimatedValue ?? true) && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {settings.addItemEstimatedValueLabel || 'القيمة التقديرية (بالريال) (اختياري)'}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#8c5332] outline-hidden font-extrabold text-[#8c5332]"
                  />
                </div>
              )}
            </div>

            {/* Description Field */}
            {(settings.addItemShowDescription ?? true) && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {settings.addItemDescriptionLabel || 'الوصف التفصيلي والملحقات *'}
                </label>
                <textarea
                  rows={3}
                  placeholder={settings.addItemDescriptionPlaceholder || 'اذكر حالة السلعة، مدة الاستخدام، الملحقات المتوفرة...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-slate-900 text-xs rounded-xl p-3 border border-slate-200 focus:border-[#8c5332] outline-hidden font-medium"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Location Field */}
              {(settings.addItemShowLocation ?? true) && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {settings.addItemLocationLabel || 'المدينة والمنطقة *'}
                  </label>
                  <input
                    type="text"
                    placeholder="الرياض - السعودية"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#8c5332] outline-hidden font-medium"
                  />
                </div>
              )}

              {/* Delivery Preference Field */}
              {(settings.addItemShowDeliveryPref ?? true) && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {settings.addItemDeliveryPrefLabel || 'تفضيل التسليم *'}
                  </label>
                  <select
                    value={deliveryPreference}
                    onChange={(e) => setDeliveryPreference(e.target.value as any)}
                    className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-[#8c5332] outline-hidden font-bold cursor-pointer"
                  >
                    {deliveryOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Offered Item Image Upload */}
            {(settings.addItemShowImageUpload ?? true) && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#8c5332]" />
                    {settings.addItemImageUploadLabel || 'رفع صور السلعة * (إجباري 3 صور على الأقل - بحد أقصى 5 صور)'}
                  </span>
                  {imageUrls.length < 3 ? (
                    <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
                      <span>إجباري 3 صور على الأقل</span>
                      <span>({imageUrls.length}/3)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مكتمل ({imageUrls.length}/5 صور)</span>
                    </span>
                  )}
                </label>

                {/* Uploaded Images List Grid */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative group rounded-2xl overflow-hidden border border-[#e6d8c7] bg-white shadow-xs">
                        <img
                          src={url}
                          alt={`صورة السلعة ${idx + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                          {idx + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 left-1 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-xs transition-all cursor-pointer opacity-90 hover:scale-110"
                          title="حذف هذه الصورة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropzone / Upload Box if less than 5 images */}
                {imageUrls.length < 5 && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      isDragging
                        ? 'border-[#8c5332] bg-[#f5eee6]/80 scale-101'
                        : 'border-slate-300 hover:border-[#8c5332] bg-slate-50 hover:bg-[#f5eee6]/30'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="item-files-input"
                    />
                    
                    <div className="w-12 h-12 rounded-2xl bg-[#e6d8c7] text-[#8c5332] flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {imageUrls.length === 0
                          ? 'اضغط هنا لرفع صور السلعة (اختر 3 صور إلى 5 صور)'
                          : `اضغط لرفع صور إضافية (متبقي ${5 - imageUrls.length} صور)`}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        يمكنك تحديد عدة صور دفعة واحدة أو سحب وإسقاط الصور هنا (PNG, JPG, WEBP)
                      </p>
                    </div>

                    <label
                      htmlFor="item-files-input"
                      className="mt-1 inline-flex items-center gap-1.5 bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>اختر الصور من جهازك ({imageUrls.length}/5)</span>
                    </label>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Section 2: Barter Target Preferences */}
          {((settings.addItemShowDesiredItem ?? true) || ((settings.addItemShowCashDiffOption ?? true) && settings.enableCashDifference)) && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-[10px] font-black text-[#8c5332] uppercase tracking-wider flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4 text-[#8c5332]" />
                2. ما هي السلعة أو الشيء المطلوب بالمقابل؟
              </h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                {/* Desired Item Field */}
                {(settings.addItemShowDesiredItem ?? true) && (
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      {settings.addItemDesiredItemLabel || 'وصف السلعة المطلوب مقايضتها بالمقابل *'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={settings.addItemDesiredItemPlaceholder || 'اكتب بشكل مبسط ماذا تطلب بالمقابل (مثلاً: أبحث عن جهاز آيباد برو أو كاميرا احترافية أو أي عرض مناسب)...'}
                      value={desiredDescription}
                      onChange={(e) => setDesiredDescription(e.target.value)}
                      className="w-full bg-white text-slate-900 text-xs rounded-xl p-3 border border-slate-200 focus:border-[#8c5332] outline-hidden font-medium"
                      required
                    />
                  </div>
                )}

                {/* Cash Difference Toggle */}
                {settings.enableCashDifference && (settings.addItemShowCashDiffOption ?? true) && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowCashDifference}
                        onChange={(e) => setAllowCashDifference(e.target.checked)}
                        className="w-4 h-4 text-[#8c5332] rounded-md focus:ring-[#8c5332]"
                      />
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Banknote className="w-4 h-4 text-[#8c5332]" />
                        {settings.addItemCashDiffLabel || 'أقبل زيادة نقدية / فارق سعري مع المقايضة'}
                      </span>
                    </label>

                    {allowCashDifference && (
                      <div className="p-3 bg-[#f5eee6]/60 rounded-xl border border-[#e6d8c7] text-[11px] text-[#734123] font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8c5332] shrink-0" />
                        <span>مُفعّل: سيتم السماح للطرف الثاني (صاحب العرض) بكتابة واقتراح المبلغ النقدي المناسب عند تقديم طلب المقايضة.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Desired Item Image Upload */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#8c5332]" />
                      <span>صورة السلعة المطلوبة (اختياري)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      اختياري
                    </span>
                  </label>

                  {!desiredImageUrl ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingDesired(true); }}
                      onDragLeave={() => setIsDraggingDesired(false)}
                      onDrop={handleDesiredDrop}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isDraggingDesired
                          ? 'border-[#8c5332] bg-[#f5eee6]/80 scale-101'
                          : 'border-slate-300 hover:border-[#8c5332] bg-white hover:bg-[#f5eee6]/30'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDesiredFileChange}
                        className="hidden"
                        id="desired-item-file-input"
                      />

                      <div className="w-10 h-10 rounded-xl bg-[#e6d8c7] text-[#8c5332] flex items-center justify-center shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          اضغط لرفع صورة توضيحية للسلعة المطلوبة بالمقابل
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          (اختياري - تساعد المستبدلين في معرفة ما ترغب به بدقة)
                        </p>
                      </div>

                      <label
                        htmlFor="desired-item-file-input"
                        className="mt-1 inline-flex items-center gap-1 bg-[#8c5332] hover:bg-[#734123] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>اختر صورة توضيحية</span>
                      </label>
                    </div>
                  ) : (
                    /* Desired Image Preview */
                    <div className="p-3 bg-[#f5eee6]/50 rounded-2xl border border-[#e6d8c7] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={desiredImageUrl}
                          alt="معاينة صورة السلعة المطلوبة"
                          className="w-16 h-16 object-cover rounded-xl border border-white shadow-md shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>تم إرفاق صورة السلعة المطلوبة!</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            ستظهر صورة توضيحية لما تبحث عنه للمستخدمين
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDesiredImageUrl('')}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف الصورة</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!successMsg}
              className="px-6 py-2.5 rounded-xl bg-[#8c5332] hover:bg-[#734123] active:scale-98 text-white text-xs font-bold shadow-md shadow-[#8c5332]/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || successMsg ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري نشر السلعة...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>نشر السلعة والبدء بالمقايضة</span>
                </>
              )}
            </button>
          </div>

      </form>

    </div>
  );
};
