import React, { useState } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Star, 
  ArrowLeftRight, 
  MessageSquare, 
  Heart, 
  CheckCircle, 
  User, 
  Send, 
  MessageCircle, 
  Lock,
  ChevronLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Listing, User as UserType, ListingQuestion } from '../types';

interface ListingDetailsProps {
  listing: Listing;
  currentUser: UserType | null;
  onClose: () => void;
  onInitiateSwap: (listing: Listing) => void;
  onSendMessage: (receiverId: string, text: string, listingTitle: string) => void;
  questions: ListingQuestion[];
  onAddQuestion: (listingId: string, text: string) => void;
  onAddReply: (questionId: string, replyText: string) => void;
  interestedListings: string[]; // List of listing IDs the user is interested in
  onToggleInterest: (listingId: string) => void;
  onViewProfile?: (userId: string, userName?: string, userAvatar?: string) => void;
}

export default function ListingDetails({
  listing,
  currentUser,
  onClose,
  onInitiateSwap,
  onSendMessage,
  questions,
  onAddQuestion,
  onAddReply,
  interestedListings,
  onToggleInterest,
  onViewProfile,
}: ListingDetailsProps) {
  const [questionText, setQuestionText] = useState('');
  const [replyTexts, setReplyTexts] = useState<{ [questionId: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const isOwner = currentUser?.id === listing.ownerId;
  const isCompleted = listing.status === 'مكتمل';
  const isInterested = interestedListings.includes(listing.id);

  // Filter questions for this specific listing
  const listingQuestions = questions.filter(q => q.listingId === listing.id);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    onAddQuestion(listing.id, questionText.trim());
    setQuestionText('');
  };

  const handleSendReply = (questionId: string) => {
    const text = replyTexts[questionId];
    if (!text || !text.trim()) return;
    onAddReply(questionId, text.trim());
    setReplyTexts(prev => ({ ...prev, [questionId]: '' }));
    setActiveReplyId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6" id="listing_details_container">
      
      {/* Back button and navigation header */}
      <div className="flex justify-between items-center mb-6" id="details_header_nav">
        <div className="text-right">
          <p className="text-xs text-gray-400">تصفح العروض &gt; تفاصيل العرض</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center space-x-1.5 space-x-reverse bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
          id="btn_back_to_feed"
        >
          <span>العودة للعروض</span>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right" id="details_grid">
        
        {/* RIGHT COLUMN: Image, description, and interactive Q&A (Col span 8) */}
        <div className="lg:col-span-8 space-y-6" id="details_right_col">
          
          {/* 1. Image container & general specifications */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs" id="details_image_panel">
            <div className="relative aspect-[16/9] w-full bg-gray-50">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Badges on image */}
              <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                <span className="bg-emerald-600 text-white px-3.5 py-1 rounded-xl text-xs font-extrabold shadow-sm">
                  {listing.type}
                </span>
                <span className="bg-white/95 backdrop-blur-xs text-gray-950 px-3 py-1 rounded-xl text-xs font-bold border border-gray-100 shadow-sm">
                  {listing.category}
                </span>
                <span className="bg-gray-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-xs font-medium flex items-center space-x-1 space-x-reverse">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{listing.city}</span>
                </span>
              </div>

              {isCompleted && (
                <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-base shadow-lg flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="w-5 h-5 text-emerald-600 animate-bounce" />
                    <span>تمت مقايضة هذا العرض بنجاح</span>
                  </span>
                </div>
              )}
            </div>

            {/* Core Listing Metadata */}
            <div className="p-6 border-t border-gray-50 bg-gray-50/30">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 leading-tight">
                {listing.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 items-center text-xs text-gray-400 mt-2" id="listing_meta_row">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>نُشر في: {new Date(listing.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <span>•</span>
                <div>الحالة: <span className="font-semibold text-emerald-600">نشط وجاهز للتبادل</span></div>
              </div>
            </div>
          </div>

          {/* 2. Description Panel */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-xs" id="details_desc_panel">
            <h3 className="text-sm font-extrabold text-gray-900 border-r-4 border-emerald-500 pr-2.5">الوصف</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line pr-1">
              {listing.description}
            </p>
          </div>

          {/* 3. Barter Box Panel */}
          <div className="bg-amber-50/40 rounded-3xl border border-amber-100/60 p-6 space-y-3 shadow-xs" id="details_barter_box">
            <div className="flex items-center space-x-2 space-x-reverse text-amber-900 font-extrabold text-sm">
              <ArrowLeftRight className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>المطلوب في المقابل للمقايضة:</span>
            </div>
            <p className="text-amber-950 text-sm leading-relaxed font-medium">
              {listing.wantedInReturn}
            </p>
            {listing.cashDifference && (
              <div className="pt-2 border-t border-amber-200/40 text-xs font-bold text-amber-900 flex items-center space-x-1 space-x-reverse">
                <span>مبلغ فارق نقدي مطلوب:</span>
                <span className="bg-amber-100/80 px-2 py-0.5 rounded-lg text-amber-950 font-black">{listing.cashDifference} ﷼</span>
              </div>
            )}
          </div>

          {/* 4. Q&A Section (الأسئلة والردود) */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 space-y-4 shadow-xs" id="details_qa_panel">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-150 pb-3" id="qa_panel_header">
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                <span>الأسئلة والردود</span>
                <span className="text-xs text-gray-500 font-medium">({listingQuestions.length})</span>
              </h3>
            </div>

            {/* Questions List */}
            <div className="space-y-3" id="questions_list">
              {listingQuestions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">لا توجد أسئلة حتى الآن.</p>
              ) : (
                listingQuestions.map((q) => (
                  <div key={q.id} className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/80 space-y-2 text-right" id={`question_item_${q.id}`}>
                    
                    {/* Question Header & Text */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span className="font-extrabold text-gray-900">{q.askerName}</span>
                        {q.createdAt && <span className="text-[10px] text-gray-400">{q.createdAt}</span>}
                      </div>
                      <p className="text-xs text-gray-800 font-medium leading-relaxed">{q.questionText}</p>
                    </div>

                    {/* Owner Reply */}
                    {q.replyText ? (
                      <div className="bg-white rounded-xl p-3 border border-amber-200/70 mr-3 sm:mr-5 mt-2 space-y-1">
                        <span className="text-[11px] font-bold text-[#786142] block">رد صاحب العرض ({listing.ownerName}):</span>
                        <p className="text-xs text-gray-800 font-medium">{q.replyText}</p>
                      </div>
                    ) : (
                      isOwner && (
                        <div className="mr-3 sm:mr-5 mt-2" id={`owner_reply_form_${q.id}`}>
                          {activeReplyId === q.id ? (
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={replyTexts[q.id] || ''}
                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                                placeholder="اكتب ردك..."
                                className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#786142]"
                              />
                              <button
                                onClick={() => handleSendReply(q.id)}
                                className="bg-[#786142] hover:bg-[#614e35] text-white p-2 rounded-xl transition-colors shrink-0 cursor-pointer"
                                title="إرسال الرد"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setActiveReplyId(null)}
                                className="text-gray-400 hover:text-gray-600 text-xs px-1 cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setActiveReplyId(q.id)}
                              className="text-xs text-[#786142] hover:underline font-bold cursor-pointer"
                            >
                              الرد على السؤال
                            </button>
                          )}
                        </div>
                      )
                    )}

                  </div>
                ))
              )}
            </div>

            {/* Small Messaging Input Box with Send Icon (shown if not owner) */}
            {!isOwner && (
              <form onSubmit={handleAskQuestion} className="flex items-center gap-2 pt-2 border-t border-gray-150" id="ask_form">
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="اسأل صاحب العرض..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-[#786142] outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!questionText.trim()}
                  className="bg-[#786142] hover:bg-[#614e35] disabled:opacity-40 text-white p-2.5 rounded-2xl transition-all shrink-0 cursor-pointer shadow-xs flex items-center justify-center"
                  title="إرسال"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>

        </div>

        {/* LEFT COLUMN: Sidebar with Lister Profile and Action triggers (Col span 4) */}
        <div className="lg:col-span-4 space-y-6" id="details_left_col">
          
          {/* 1. Lister Profile Widget */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4 shadow-xs" id="lister_widget">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
              <h3 className="text-xs font-extrabold text-gray-400">صاحب العرض</h3>
              {onViewProfile && (
                <button
                  onClick={() => onViewProfile(listing.ownerId, listing.ownerName, listing.ownerAvatar)}
                  className="text-[11px] font-bold text-[#786142] hover:text-[#5c4931] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>عرض الملف الكامل</span>
                  <ChevronLeft className="w-3 h-3" />
                </button>
              )}
            </div>
            
            {/* Lister Profile Row */}
            <div 
              className="flex items-center space-x-3 space-x-reverse cursor-pointer group p-1.5 -m-1.5 rounded-2xl hover:bg-[#FAF8F5] transition-all" 
              id="lister_profile_info"
              onClick={() => onViewProfile?.(listing.ownerId, listing.ownerName, listing.ownerAvatar)}
              title={`عرض الملف الشخصي لـ ${listing.ownerName}`}
            >
              <img
                src={listing.ownerAvatar}
                alt={listing.ownerName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-50 group-hover:ring-[#8A6A4B] transition-all"
                referrerPolicy="no-referrer"
              />
              <div className="text-right flex-1">
                <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-[#786142] group-hover:underline underline-offset-2 transition-all">{listing.ownerName}</h4>
                <div className="flex items-center space-x-1 space-x-reverse mt-0.5">
                  <span className="text-[10px] text-gray-400">{listing.city}</span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                    مستوى {listing.ownerReliability}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Direct Actions (Three options on left side) */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 space-y-3 shadow-xs" id="lister_actions_box">
            {/* Option 1: إضافة كمهتم بالمقايضة (Add interested in barter) */}
            <button
              onClick={() => onToggleInterest(listing.id)}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between border cursor-pointer ${
                isInterested
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-emerald-300'
              }`}
              id="btn_detail_interest_toggle"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <Heart className={`w-4 h-4 transition-colors ${isInterested ? 'fill-emerald-600 text-emerald-600' : 'text-gray-400'}`} />
                <span>{isInterested ? 'مهتم بالمقايضة (تمت الإضافة)' : 'إضافة مهتم بالمقايضة'}</span>
              </div>
              <span className="text-[10px] text-gray-400 bg-gray-100/50 px-1.5 py-0.5 rounded-full">
                {isInterested ? 'نشط' : 'قائمة اهتمامي'}
              </span>
            </button>

            {/* Option 2: اطلب مقايضة (Request barter - triggers product negotiation page) */}
            <button
              onClick={() => {
                if (isCompleted) return;
                onInitiateSwap(listing);
              }}
              disabled={isCompleted || isOwner}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between border cursor-pointer ${
                isCompleted
                  ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                  : isOwner
                  ? 'bg-gray-50 text-gray-400 border-gray-200/60 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent hover:shadow-md hover:shadow-emerald-100'
              }`}
              id="btn_detail_swap_request"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <ArrowLeftRight className="w-4 h-4" />
                <span>اطلب مقايضة فورية</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isOwner ? 'bg-gray-200 text-gray-500' : 'bg-emerald-500 text-emerald-50'}`}>
                {isCompleted ? 'مكتمل' : isOwner ? 'عرضي' : 'بدء تبادل'}
              </span>
            </button>

            {/* Barter Policy Note */}
            <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60 text-[11px] text-amber-950 space-y-1">
              <span className="font-extrabold block text-amber-900">نظام المقايضة والاتفاق:</span>
              <p className="text-[10.5px] leading-relaxed text-amber-900/80">
                تجري جميع المفاوضات والتنسيقات عند تقديم طلب مقايضة رسمي، لتفعيل المحادثة الموثقة وإصدار العقد الرقمي.
              </p>
            </div>

          </div>

          {/* Tips for Safe Swapping Info */}
          <div className="bg-emerald-50/30 rounded-3xl p-4 border border-emerald-100/20 text-right space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5 space-x-reverse">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>نصائح لمقايضة آمنة:</span>
            </h4>
            <ul className="text-[10.5px] text-emerald-950 space-y-1 pr-1.5 list-disc leading-relaxed">
              <li>قم بالاتفاق المتبادل في مكان عام آمن ومزدحم.</li>
              <li>افحص السلعة المعروضة جيداً للتأكد من سلامتها قبل إتمام التبادل.</li>
              <li>استخدم نظام المحادثة الموثق في منصة بادل لمتابعة اتفاقياتك بشكل آمن.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
