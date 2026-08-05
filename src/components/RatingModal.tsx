import React, { useState } from 'react';
import { Star, X, Check, Award, MessageSquare } from 'lucide-react';
import { User } from '../types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
  offerId: string;
  contractId?: string;
  onSubmit: (rating: number, comment: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  offerId,
  contractId,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return 'سيء جداً';
      case 2:
        return 'مقبول';
      case 3:
        return 'جيد جداً';
      case 4:
        return 'ممتاز';
      case 5:
        return 'ممتاز وموصى به 🌟';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-200 fill-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-black">تقييم تجربة المقايضة</h3>
              <p className="text-xs text-amber-100 font-medium">قيم تعامل العضو وصحة السلعة بعد إتمام الصفقة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-lg font-black text-slate-900">شكراً لك! تم تسجيل التقييم بنجاح</h4>
            <p className="text-xs text-slate-600">تم تحديث تقييم العضو ومعدل سمة الثقة في منصة مقايضة.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Target User Info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <img
                src={targetUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                alt={targetUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{targetUser.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                    {targetUser.membershipTier || 'عضو'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">المدينة: {targetUser.city}</p>
              </div>
            </div>

            {/* Stars Selector */}
            <div className="text-center space-y-3 py-2">
              <label className="block text-xs font-black text-slate-700">حدد عدد النجوم لتجربة المقايضة</label>
              
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1.5 transition-transform hover:scale-125 cursor-pointer focus:outline-hidden"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-300 fill-slate-100'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="h-6">
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block animate-in fade-in">
                  {getRatingLabel(hoverRating || rating)}
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <span>ملاحظة أو تعليق إضافي (اختياري)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="صف انطباعك عن المقايضة وصحة حالة السلعة وتجربتك مع هذا العضو..."
                rows={3}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-hidden text-slate-800 placeholder-slate-400 transition-all resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>حفظ التقييم وإرساله</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
