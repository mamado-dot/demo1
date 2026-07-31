import React, { useState } from 'react';
import { 
  ArrowRight, 
  Star, 
  ArrowLeftRight, 
  MessageSquare, 
  Heart, 
  CheckCircle, 
  User, 
  Send, 
  MessageCircle, 
  Lock,
  Calendar,
  AlertCircle,
  HelpCircle,
  Clock,
  CornerDownLeft,
  BadgeCheck
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
              </div>

              {/* Owner Name under Status */}
              <div className="mt-3 pt-3 border-t border-gray-100/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-gray-400 font-medium">صاحب العرض:</span>
                  <button 
                    onClick={() => onViewProfile?.(listing.ownerId, listing.ownerName, listing.ownerAvatar)}
                    className="flex items-center space-x-1.5 space-x-reverse text-gray-900 font-extrabold hover:text-[#786142] hover:underline cursor-pointer group"
                  >
                    <img
                      src={listing.ownerAvatar}
                      alt={listing.ownerName}
                      className="w-5.5 h-5.5 rounded-full object-cover ring-1 ring-gray-200 group-hover:ring-[#786142] transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <span>{listing.ownerName}</span>
                  </button>
                </div>
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
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 space-y-5 shadow-xs" id="details_qa_panel">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4" id="qa_panel_header">
              <div className="flex items-center space-x-2.5 space-x-reverse">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#786142]">
                  <HelpCircle className="w-5 h-5 text-[#786142]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <span>الأسئلة والاستفسارات</span>
                    <span className="bg-amber-100/80 text-amber-900 text-[11px] font-black px-2 py-0.5 rounded-full">
                      {listingQuestions.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">استفسارات الأعضاء وإجابات صاحب العرض المباشرة</p>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4" id="questions_list">
              {listingQuestions.length === 0 ? (
                <div className="bg-gray-50/70 rounded-2xl p-6 text-center border border-dashed border-gray-200 space-y-2">
                  <MessageCircle className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500 font-bold">لا توجد أسئلة أو استفسارات حول هذا العرض حتى الآن</p>
                  <p className="text-[11px] text-gray-400">كن أول من يستفسر من صاحب العرض مباشرة</p>
                </div>
              ) : (
                listingQuestions.map((q) => (
                  <div key={q.id} className="bg-gray-50/60 rounded-2xl p-4 border border-gray-200/80 space-y-3 text-right transition-all hover:bg-gray-50" id={`question_item_${q.id}`}>
                    
                    {/* Question Item Header & Avatar */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div 
                          onClick={() => onViewProfile?.(q.askerId, q.askerName, q.askerAvatar)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 overflow-hidden shrink-0 cursor-pointer shadow-2xs"
                        >
                          {q.askerAvatar ? (
                            <img src={q.askerAvatar} alt={q.askerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 font-bold text-xs">
                              {q.askerName?.charAt(0) || 'م'}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span 
                              onClick={() => onViewProfile?.(q.askerId, q.askerName, q.askerAvatar)}
                              className="font-extrabold text-gray-900 text-xs hover:text-[#786142] hover:underline cursor-pointer"
                            >
                              {q.askerName}
                            </span>
                            <span className="bg-gray-200/70 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              استفسار
                            </span>
                          </div>
                          {q.createdAt && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 font-medium">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>{q.createdAt}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-gray-100 text-xs font-medium text-gray-800 leading-relaxed shadow-2xs">
                      {q.questionText}
                    </div>

                    {/* Owner Reply Section */}
                    {q.replyText ? (
                      <div className="border-r-2 border-[#786142]/80 pr-3 my-2 me-1 sm:me-3 space-y-1.5">
                        <div className="bg-[#FAF6F0] rounded-xl p-3.5 border border-[#EBDCCB] space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between border-b border-[#E3D1BC]/60 pb-1.5">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <div className="w-6 h-6 rounded-full bg-[#786142] text-white flex items-center justify-center font-bold text-[10px]">
                                {listing.ownerName?.charAt(0) || 'ع'}
                              </div>
                              <span className="text-xs font-black text-[#5C4830]">
                                {listing.ownerName}
                              </span>
                              <span className="bg-amber-100 text-[#786142] text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <BadgeCheck className="w-3 h-3 text-amber-700" />
                                <span>صاحب العرض</span>
                              </span>
                            </div>
                            {q.replyCreatedAt && (
                              <span className="text-[9px] text-amber-800/60 font-medium">{q.replyCreatedAt}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-900 font-medium leading-relaxed pt-0.5">{q.replyText}</p>
                        </div>
                      </div>
                    ) : (
                      isOwner && (
                        <div className="border-r-2 border-dashed border-amber-300/80 pr-3 my-2 me-1 sm:me-3" id={`owner_reply_form_${q.id}`}>
                          {activeReplyId === q.id ? (
                            <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                              <div className="flex items-center space-x-2 space-x-reverse text-[11px] font-bold text-amber-900">
                                <CornerDownLeft className="w-3.5 h-3.5 text-amber-700" />
                                <span>الرد كـ (صاحب العرض)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={replyTexts[q.id] || ''}
                                  onChange={(e) => setReplyTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                                  placeholder="اكتب إجابتك الواضحة هنا..."
                                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:border-amber-600 transition-all"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSendReply(q.id)}
                                  className="bg-[#786142] hover:bg-[#614e35] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>إرسال</span>
                                </button>
                                <button
                                  onClick={() => setActiveReplyId(null)}
                                  className="text-gray-400 hover:text-gray-600 text-xs px-2 py-2 cursor-pointer font-medium"
                                >
                                  إلغاء
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setActiveReplyId(q.id)}
                              className="inline-flex items-center gap-1.5 text-xs text-[#786142] hover:text-[#52412b] font-black bg-amber-50 hover:bg-amber-100/80 border border-amber-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                            >
                              <CornerDownLeft className="w-3.5 h-3.5" />
                              <span>الرد على هذا الاستفسار</span>
                            </button>
                          )}
                        </div>
                      )
                    )}

                  </div>
                ))
              )}
            </div>

            {/* Ask Question Input Form (shown if not owner) */}
            {!isOwner && (
              <form onSubmit={handleAskQuestion} className="pt-3 border-t border-gray-100" id="ask_form">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 hidden sm:flex items-center justify-center">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="لديك سؤال أو استفسار حول هذه السلعة؟ اسأل صاحب العرض مباشرة..."
                    className="flex-1 bg-gray-50/80 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-[#786142] focus:ring-1 focus:ring-[#786142] outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!questionText.trim()}
                    className="bg-[#786142] hover:bg-[#5f4c33] disabled:opacity-40 text-white px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shrink-0 cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>إرسال</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

        {/* LEFT COLUMN: Sidebar with Action triggers (Col span 4) */}
        <div className="lg:col-span-4 space-y-6" id="details_left_col">
          
          {/* Direct Actions (Options on left side) */}
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

          </div>

        </div>

      </div>

    </div>
  );
}
