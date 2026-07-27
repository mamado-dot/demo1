import React, { useState, useRef } from 'react';
import { PlusCircle, Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { City, ListingType, Listing, BarterOptions } from '../types';
import { CITIES, CATEGORIES } from '../data/mockData';

// Category to image mapping to make mock image selection beautiful and automatic
const CATEGORY_IMAGES: Record<string, string> = {
  'أجهزة وإلكترونيات': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  'خدمات برمجية وتقنية': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
  'تصميم ورسومات': 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80',
  'أثاث وديكور': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
  'كتب وأدوات تعليمية': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
  'دروس ودورات تدريبية': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
  'تصوير وكاميرات': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  'أدوات رياضية': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
  'أزياء ومستلزمات شخصية': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
};

interface AddListingModalProps {
  onAddListing: (listingData: Omit<Listing, 'id' | 'ownerId' | 'ownerName' | 'ownerRating' | 'ownerReliability' | 'ownerAvatar' | 'createdAt' | 'status'>) => void;
  onSuccess: () => void;
  barterOptions?: BarterOptions;
}

export default function AddListingModal({ onAddListing, onSuccess, barterOptions }: AddListingModalProps) {
  const enableProducts = barterOptions?.enableProducts !== false;
  const enableServices = barterOptions?.enableServices !== false;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ListingType>(enableProducts ? 'سلعة' : enableServices ? 'خدمة' : 'سلعة');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [city, setCity] = useState<City>('الرياض');
  const [description, setDescription] = useState('');
  const [wantedInReturn, setWantedInReturn] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Generate a local object URL to display the image immediately
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !wantedInReturn) return;

    setIsSubmitting(true);

    // Fallback to category default image if no custom image was uploaded
    const finalImage = uploadedImage || CATEGORY_IMAGES[category] || CATEGORY_IMAGES['أجهزة وإلكترونيات'];

    setTimeout(() => {
      onAddListing({
        title,
        type,
        category,
        city,
        description,
        imageUrl: finalImage,
        wantedInReturn,
      });

      // Reset form
      setTitle('');
      setType('سلعة');
      setCategory(CATEGORIES[0]);
      setCity('الرياض');
      setDescription('');
      setWantedInReturn('');
      setUploadedImage(null);
      setIsSubmitting(false);
      onSuccess();
    }, 800);
  };

  return (
    <div id="add_listing_form_container" className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8">
      <div className="text-right mb-6" id="add_listing_header">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center justify-end space-x-2 space-x-reverse">
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <span>أضف عرضاً للمقايضة</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-right" id="add_listing_form">
        
        {/* Type Selection (if applicable) */}
        {(!enableProducts || !enableServices) && (
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 text-right mb-2">
            {!enableProducts && !enableServices
              ? 'تنويه: إضافة العروض متوقفة مؤقتاً.'
              : !enableProducts
              ? 'متاح حالياً تقديم الخدمات فقط.'
              : 'متاح حالياً تقديم السلع فقط.'}
          </div>
        )}

        {enableProducts && enableServices && (
          <div id="form_group_type">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="btn_select_type_product"
                type="button"
                onClick={() => setType('سلعة')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center space-x-1.5 space-x-reverse cursor-pointer ${
                  type === 'سلعة'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>📦 سلعة</span>
              </button>
              <button
                id="btn_select_type_service"
                type="button"
                onClick={() => setType('خدمة')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center space-x-1.5 space-x-reverse cursor-pointer ${
                  type === 'خدمة'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>🛠️ خدمة</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. Title input */}
        <div id="form_group_title">
          <label className="block text-xs font-bold text-gray-700 mb-1">العنوان *</label>
          <input
            id="input_listing_title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان السلعة أو الخدمة..."
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-gray-50/30"
          />
        </div>

        {/* 2. Description */}
        <div id="form_group_description">
          <label className="block text-xs font-bold text-gray-700 mb-1">الوصف *</label>
          <textarea
            id="textarea_listing_desc"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="اكتب تفاصيل السلعة أو الخدمة..."
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-gray-50/30"
          />
        </div>

        {/* 3. What is wanted in return */}
        <div id="form_group_wanted">
          <label className="block text-xs font-bold text-gray-700 mb-1">المنتج أو الخدمة المطلوبة للمقايضة *</label>
          <input
            id="input_listing_wanted"
            type="text"
            required
            value={wantedInReturn}
            onChange={(e) => setWantedInReturn(e.target.value)}
            placeholder="ما الذي ترغب في الحصول عليه في المقابل؟"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-gray-50/30"
          />
        </div>

        {/* Category and City selection */}
        <div className="grid grid-cols-2 gap-3" id="form_row_meta">
          <div id="form_group_category">
            <label className="block text-xs font-bold text-gray-700 mb-1">التصنيف</label>
            <select
              id="select_listing_category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-right focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white cursor-pointer font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div id="form_group_city">
            <label className="block text-xs font-bold text-gray-700 mb-1">المدينة</label>
            <select
              id="select_listing_city"
              value={city}
              onChange={(e) => setCity(e.target.value as City)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-right focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white cursor-pointer font-medium"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Image Upload */}
        <div id="form_group_image">
          <label className="block text-xs font-bold text-gray-700 mb-1">إضافة صورة</label>
          
          <div
            id="drag_drop_zone"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              dragActive 
                ? 'border-emerald-500 bg-emerald-50/30' 
                : uploadedImage 
                  ? 'border-emerald-200 bg-emerald-50/10' 
                  : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="file_uploader"
            />

            {uploadedImage ? (
              <div className="flex flex-col items-center space-y-1.5" id="uploaded_preview_container">
                <img
                  src={uploadedImage}
                  alt="uploaded preview"
                  className="w-24 h-20 object-cover rounded-lg border border-gray-100"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedImage(null);
                  }}
                  className="text-[11px] text-red-500 hover:underline flex items-center space-x-0.5 space-x-reverse"
                >
                  <X className="w-3 h-3" />
                  <span>إزالة الصورة</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-500 py-2" id="upload_instructions">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>اضغط لاختيار صورة أو اسحبها هنا</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2" id="submit_action_container">
          <button
            id="btn_submit_listing"
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 space-x-reverse transition-all ${
              isSubmitting
                ? 'bg-emerald-400 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-sm'
            }`}
          >
            <span>{isSubmitting ? 'جاري النشر...' : 'نشر العرض'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
