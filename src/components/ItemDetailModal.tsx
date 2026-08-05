import React, { useState } from 'react';
import { BarterItem } from '../types';
import { useBarter } from '../context/BarterContext';
import { 
  X, 
  MapPin, 
  Tag, 
  BadgeCheck, 
  ArrowLeftRight, 
  ArrowRight,
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Banknote, 
  Calendar, 
  Eye, 
  Truck, 
  Sparkles,
  AlertCircle,
  User,
  Lock,
  LogIn,
  Heart,
  Package
} from 'lucide-react';

interface ItemDetailModalProps {
  item: BarterItem | null;
  onClose: () => void;
  onOpenTradeModal: (targetItem: BarterItem) => void;
  onViewUserProfile?: (userId: string) => void;
  onNavigateAuth?: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onOpenTradeModal, onViewUserProfile, onNavigateAuth }) => {
  if (!item) return null;

  const { users, currentUser, questions, addQuestion, answerQuestion, settings, toggleFavorite, isFavorite } = useBarter();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [replyingToQId, setReplyingToQId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const owner = users.find((u) => u.id === item.ownerId) || {
    name: 'مستخدم منصة',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    verified: true,
    city: item.location,
    phone: '0500000000',
    rating: 0,
  };

  const isOwner = currentUser ? currentUser.id === item.ownerId : false;
  const itemQuestions = questions.filter((q) => q.itemId === item.id);

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    addQuestion(item.id, newQuestionText.trim());
    setNewQuestionText('');
  };

  const handleSendReply = (qId: string) => {
    if (!replyText.trim()) return;
    answerQuestion(qId, replyText.trim());
    setReplyingToQId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
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
            <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>تفاصيل السلعة</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">استعراض مواصفات السلعة ومعلومات المقايضة المتاحة</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f5eee6] text-[#734123] border border-[#e6d8c7]">
            {item.category}
          </span>
        </div>
      </div>

      {/* Main Full Page Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">

          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                <img
                  src={item.images[activeImageIndex] || item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl z-10">
                  {item.condition}
                </div>

                {/* Favorite Heart Button Overlay on Image */}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute top-3 left-3 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all z-20 cursor-pointer shadow-md border ${
                    isFavorite(item.id)
                      ? 'bg-rose-500 text-white border-rose-400 shadow-rose-900/20 scale-105'
                      : 'bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 border-white/40'
                  }`}
                  title={isFavorite(item.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(item.id) ? 'fill-white text-white' : 'fill-rose-500/10 text-slate-600 hover:fill-rose-500 hover:text-rose-500'}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {item.images.length > 1 && (
                <div className="flex gap-2">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#8c5332] ring-2 ring-[#8c5332]/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Info Badges */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Truck className="w-4 h-4 text-[#8c5332]" />
                    طريقة التسليم الفضلى:
                  </span>
                  <span className="font-semibold text-slate-900">{item.deliveryPreference}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Eye className="w-4 h-4 text-[#8c5332]" />
                    عدد المشاهدات:
                  </span>
                  <span className="font-semibold text-slate-900">{item.views + 12} مشاهدة</span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Desired Item & Owner Card */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">{item.title}</h1>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-3">
                  <div className="bg-[#f5eee6] text-[#734123] border border-[#e6d8c7] px-3 py-1.5 rounded-xl font-bold text-xs">
                    القيمة التقديرية: <span className="text-base text-[#8c5332] font-black">{item.estimatedValue.toLocaleString('ar-SA')}</span> ريال
                  </div>
                  <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
                    <MapPin className="w-4 h-4 text-[#8c5332]" />
                    <span>{item.location}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>تاريخ النشر: {item.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* BARTER TARGET SPECIFICATIONS (شروط وتطلعات المقايضة) */}
              <div className="p-5 rounded-3xl bg-[#2b1c14] text-white shadow-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#8c5332]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#d9a885] uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowLeftRight className="w-4 h-4" />
                    السلعة المطلوبة للمقايضة:
                  </span>
                  {item.allowCashDifference && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1">
                      <Banknote className="w-3 h-3 text-green-400" />
                      يقبل فارق السعر النقدي
                    </span>
                  )}
                </div>

                <div className="text-xs font-medium text-slate-200 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10 space-y-2">
                  <p>{item.desiredDescription || `يرغب في مقايضتها مقابل منتج من فئة (${item.desiredCategory}) بحالة ممتازة.`}</p>
                  {item.desiredImage && (
                    <div className="pt-2">
                      <p className="text-[10px] text-[#d9a885] font-bold mb-1">صورة توضيحية للسلعة المطلوبة:</p>
                      <img
                        src={item.desiredImage}
                        alt="صورة توضيحية للسلعة المطلوبة"
                        className="w-full max-h-48 object-cover rounded-xl border border-white/20 shadow-md"
                      />
                    </div>
                  )}
                </div>

                {item.allowCashDifference && (
                  <p className="text-[11px] text-[#d9a885] font-medium flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>* صاحب السلعة يرحب بإضافة فارق سعر نقدي أو طلب زيادة من صاحب العرض عند التقديم.</span>
                  </p>
                )}
              </div>

              {/* Item Description */}
              <div className="space-y-1.5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">تفاصيل وحالة السلعة:</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80 whitespace-pre-line font-medium">
                  {item.description}
                </p>
              </div>

              {/* Owner Info Card */}
              <div 
                onClick={() => {
                  if (onViewUserProfile) onViewUserProfile(item.ownerId);
                }}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-[#f5eee6]/60 border border-slate-200/80 hover:border-[#8c5332]/40 transition-all flex items-center justify-between cursor-pointer group/ownerCard"
                title={`عرض الملف الشخصي لـ ${owner.name}`}
              >
                <div className="flex items-center gap-3">
                  <img src={owner.avatar} alt={owner.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#8c5332]/30 group-hover/ownerCard:ring-[#8c5332] transition-all" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover/ownerCard:text-[#8c5332] transition-colors flex items-center gap-1.5">
                      <span>{owner.name}</span>
                      {owner.verified && <BadgeCheck className="w-4 h-4 text-[#8c5332]" />}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      المدينة: {owner.city} • تقييم <span className="text-amber-600 font-bold">★ {owner.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#8c5332] bg-[#f5eee6] group-hover/ownerCard:bg-[#8c5332] group-hover/ownerCard:text-white px-3 py-1.5 rounded-xl font-bold border border-[#e6d8c7] transition-all">
                  <User className="w-3.5 h-3.5" />
                  <span>عرض الملف الشخصي</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div>
                {isOwner ? (
                  <div className="p-3 bg-[#f5eee6] text-[#734123] rounded-xl border border-[#e6d8c7] text-xs font-bold text-center">
                    هذه السلعة مضافة بحسابك. يمكنك مراجعة الاستفسارات والعروض المقدمة عليها.
                  </div>
                ) : item.status === 'bartered' ? (
                  <button disabled className="w-full py-3.5 bg-slate-200 text-slate-500 rounded-xl font-bold text-xs cursor-not-allowed">
                    تمت المقايضة وإصدار العقد الإلكتروني لهذه السلعة
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTradeModal(item);
                    }}
                    className="w-full py-3.5 px-6 bg-[#8c5332] hover:bg-[#734123] active:scale-98 text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#8c5332]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                    <span>تقديم عرض مقايضة مقابل هذه السلعة</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* PUBLIC QUESTIONS & ANSWERS SECTION (الأسئلة والاستفسارات المباشرة) */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#8c5332]" />
                استفسارات
              </h3>
            </div>

            {/* Ask Question Form / Guest Restriction */}
            {!currentUser ? (
              <div className="bg-amber-50/90 border border-amber-200/90 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#8c5332] flex items-center justify-center shrink-0 border border-amber-200">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-950">طرح الأسئلة متاح للأعضاء فقط</h4>
                    <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                      يلزم التسجيل أو تسجيل الدخول لتتمكن من كتابة أسئلتك واستفساراتك لصاحب السلعة.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onNavigateAuth) onNavigateAuth();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>تسجيل الدخول / حساب جديد</span>
                </button>
              </div>
            ) : !isOwner ? (
              <form onSubmit={handleSendQuestion} className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب سؤالك لصاحب السلعة هنا..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="flex-1 bg-slate-100 focus:bg-white text-slate-900 text-xs rounded-xl px-4 py-3 border border-slate-200 focus:border-[#8c5332] outline-hidden font-medium"
                />
                <button
                  type="submit"
                  disabled={!newQuestionText.trim()}
                  className="bg-[#8c5332] hover:bg-[#734123] disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md shadow-[#8c5332]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>طرح السؤال</span>
                </button>
              </form>
            ) : null}

            {/* Questions List */}
            <div className="space-y-4">
              {itemQuestions.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs font-medium">
                  لا توجد أسئلة سابقة حول هذه السلعة بعد. كن أول من يسأل!
                </div>
              ) : (
                itemQuestions.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    {/* User Question */}
                    <div className="flex items-start gap-3">
                      <img src={q.userAvatar} className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{q.userName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{q.createdAt}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">{q.question}</p>
                      </div>
                    </div>

                    {/* Owner Answer if existing */}
                    {q.answer ? (
                      <div className="mr-6 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 flex items-start gap-2.5">
                        <img src={owner.avatar} className="w-7 h-7 rounded-md object-cover ring-1 ring-emerald-500/30 shrink-0" />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                            <span>رد صاحب السلعة ({owner.name})</span>
                            <span className="text-[10px] text-emerald-700 font-normal">• {q.answeredAt}</span>
                          </div>
                          <p className="text-xs font-medium text-emerald-900 mt-0.5 leading-relaxed">{q.answer}</p>
                        </div>
                      </div>
                    ) : isOwner ? (
                      /* Owner Answer Trigger */
                      <div className="mr-6 pt-2">
                        {replyingToQId === q.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="اكتب ردك الوافي على استفسار المستخدم..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 text-xs bg-white text-slate-900 rounded-lg px-3 py-2 border border-emerald-500 outline-hidden font-medium"
                            />
                            <button
                              onClick={() => handleSendReply(q.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                            >
                              إرسال الرد
                            </button>
                            <button
                              onClick={() => setReplyingToQId(null)}
                              className="bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-2 rounded-lg cursor-pointer"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingToQId(q.id)}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                          >
                            + الإجابة على هذا الاستفسار كصاحب سلعة
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mr-6 text-[11px] text-slate-400 font-medium">بانتظار رد صاحب السلعة...</div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

      </div>

    </div>
  );
};
