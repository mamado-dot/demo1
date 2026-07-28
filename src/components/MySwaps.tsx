import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ChevronLeft, 
  MessageSquare, 
  Shield, 
  MapPin, 
  Truck, 
  X, 
  Eye, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User as UserIcon,
  DollarSign,
  FileText
} from 'lucide-react';
import { Chat, Listing, User as UserType, BarterOptions, ContractSettings } from '../types';
import DigitalContractModal from './DigitalContractModal';

interface MySwapsProps {
  chats: Chat[];
  listings?: Listing[];
  currentUser: UserType | null;
  barterOptions?: BarterOptions;
  contractSettings?: ContractSettings;
  onUpdateOfferStatus?: (chatId: string, status: 'معلق' | 'مقبول' | 'مرفوض' | 'مكتمل') => void;
  onViewChat?: (chatId: string) => void;
  onViewListing?: (listing: Listing) => void;
  onMarkCompleted?: (listingId: string) => void;
  onSendMessage?: (chatId: string, text: string) => void;
  onAddSimulatedMessage?: (chatId: string, text: string) => void;
}

type FilterType = 'all' | 'received' | 'sent' | 'accepted_completed' | 'pending' | 'rejected';

export default function MySwaps({
  chats,
  listings = [],
  currentUser,
  barterOptions,
  contractSettings,
  onUpdateOfferStatus,
  onViewChat,
  onMarkCompleted,
}: MySwapsProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  
  // Modal for viewing full details of a specific offer
  const [selectedChatDetails, setSelectedChatDetails] = useState<Chat | null>(null);
  const [contractChat, setContractChat] = useState<Chat | null>(null);

  // Rating Modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTargetUser, setRatingTargetUser] = useState<UserType | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  const options: BarterOptions = barterOptions || {
    enableCashDifference: true,
    enableOfferNote: true,
    enableProductSelection: true,
    enableSwapRating: true,
    enableFilterTabs: true,
    enableLocationField: true,
    enableDeliveryOption: true,
    enableInspectionOption: true,
    enableOfferCancel: true,
    customFields: []
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-right space-y-4" id="my_swaps_guest_state" style={{ direction: 'rtl' }}>
        <h2 className="text-xl font-black text-gray-900">يرجى تسجيل الدخول أولاً</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          يجب عليك تسجيل الدخول بحسابك لمشاهدة عروض المقايضة الخاصة بك.
        </p>
      </div>
    );
  }

  // Count categories & determine direction
  const isReceivedChat = (chat: Chat) => {
    const listing = listings.find(l => l.id === chat.listingId);
    return listing?.ownerId === currentUser.id;
  };

  const isSentChat = (chat: Chat) => {
    const listing = listings.find(l => l.id === chat.listingId);
    return listing?.ownerId !== currentUser.id;
  };

  const filteredChats = chats.filter(chat => {
    const status = chat.offerStatus || 'معلق';
    const received = isReceivedChat(chat);
    const sent = isSentChat(chat);

    if (filterType === 'all') return true;
    if (filterType === 'received') return received;
    if (filterType === 'sent') return sent;
    if (filterType === 'accepted_completed') return status === 'مقبول' || status === 'مكتمل';
    if (filterType === 'pending') return status === 'معلق';
    if (filterType === 'rejected') return status === 'مرفوض';
    return true;
  });

  const handleCompleteSwap = (chat: Chat) => {
    if (onUpdateOfferStatus) {
      onUpdateOfferStatus(chat.id, 'مكتمل');
    }
    if (onMarkCompleted) {
      onMarkCompleted(chat.listingId);
    }
    if (options.enableSwapRating) {
      setRatingTargetUser(chat.otherUser);
      setShowRatingModal(true);
    }
    // Update local modal if open
    if (selectedChatDetails && selectedChatDetails.id === chat.id) {
      setSelectedChatDetails({ ...selectedChatDetails, offerStatus: 'مكتمل' });
    }
  };

  const submitRating = () => {
    setShowRatingModal(false);
    setRatingComment('');
    setRatingValue(5);
    setRatingTargetUser(null);
  };

  return (
    <div id="my_swaps_container" className="w-full px-1 sm:px-2 py-6 space-y-6 text-right" style={{ direction: 'rtl' }}>
      
      {/* Main Section Title & Description */}
      <div className="space-y-1" id="swaps_main_heading">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">عروض المقايضة</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          إدارة ومتابعة جميع عروض المقايضة الواردة والصادرة بكل سهولة.
        </p>
      </div>

      {/* Filter Pills (Conditional on barterOptions.enableFilterTabs) */}
      {options.enableFilterTabs && (
        <div className="flex flex-wrap items-center gap-2 pt-1" id="swaps_filter_pills">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            الكل ({chats.length})
          </button>

          <button
            onClick={() => setFilterType('received')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'received'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            واردة ({chats.filter(isReceivedChat).length})
          </button>

          <button
            onClick={() => setFilterType('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'sent'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            صادرة ({chats.filter(isSentChat).length})
          </button>

          <button
            onClick={() => setFilterType('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            معلقة
          </button>

          <button
            onClick={() => setFilterType('accepted_completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'accepted_completed'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            مقبولة / مكتملة
          </button>

          <button
            onClick={() => setFilterType('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === 'rejected'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            الأرشيف
          </button>
        </div>
      )}

      {/* SINGLE-ROW OFFERS LIST (كل عرض في صف لحاله مع بيانات بسيطة) */}
      <div className="space-y-3 pt-2" id="swaps_cards_list">
        {filteredChats.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-gray-900 text-base">لا توجد عروض مقايضة هنا</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              عند إرسال أو استقبال أي عرض مقايضة، سيظهر في هذه القائمة المنظمة.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const offerStatus = chat.offerStatus || 'معلق';
            const isReceived = isReceivedChat(chat);
            const targetListing = listings.find(l => l.id === chat.listingId);
            const offeredListing = listings.find(l => l.id === chat.offeredListingId);
            const offeredTitle = chat.offeredListingTitle || offeredListing?.title || 'منتج مقترَح للمقايضة';
            const offeredImg = chat.offeredListingImageUrl || offeredListing?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80';

            return (
              <div 
                key={chat.id} 
                id={`swap_offer_row_${chat.id}`}
                onClick={() => setSelectedChatDetails(chat)}
                className="bg-white rounded-[20px] sm:rounded-[24px] border border-gray-100 transition-all duration-300 overflow-hidden flex flex-row justify-between cursor-pointer group hover:shadow-xl hover:shadow-gray-200/50 hover:border-emerald-300"
              >
                
                {/* 1. Image Container (First in DOM so in RTL it appears on the Right) */}
                <div className="w-28 sm:w-36 md:w-44 bg-gray-100 overflow-hidden relative border-l border-gray-100/60 shrink-0">
                  <img
                    src={chat.listingImageUrl || offeredImg}
                    alt={chat.listingTitle || offeredTitle}
                    className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* 2. Card Body (Second in DOM so in RTL it appears on the Left) */}
                <div className="p-3 sm:p-5 flex flex-col justify-between flex-1 text-right min-w-0">
                  
                  <div>
                    {/* Header Row: Title & Badge */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-extrabold text-gray-900 text-sm sm:text-base lg:text-lg leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {chat.listingTitle || offeredTitle}
                      </h3>

                      <span className="bg-[#f5f0e6] text-[#786142] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
                        {offerStatus === 'معلق' ? 'كالجديد' : offerStatus}
                      </span>
                    </div>

                    {/* Category */}
                    <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-2 sm:mb-3">
                      {targetListing?.category || 'عام'}
                    </p>

                    <div className="border-t border-gray-100/90 pt-2 my-1 sm:my-2" />

                    {/* Swapped item info */}
                    <div className="flex items-center space-x-2 space-x-reverse text-xs sm:text-sm font-bold text-gray-800 my-1">
                      <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#85532a] shrink-0" />
                      <span className="line-clamp-1 text-emerald-800 font-extrabold">{offeredTitle}</span>
                    </div>
                  </div>

                  {/* Footer info: Owner Name & Location */}
                  <div className="pt-2 sm:pt-2.5 mt-1 sm:mt-1.5 border-t border-dashed border-gray-100 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                    
                    {/* Owner Name */}
                    <div className="flex items-center space-x-1.5 space-x-reverse truncate">
                      {chat.otherUser.avatar ? (
                        <img 
                          src={chat.otherUser.avatar} 
                          alt={chat.otherUser.name} 
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full object-cover shrink-0 ring-1 ring-gray-200" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                      )}
                      <span className="truncate text-gray-800 font-extrabold">{chat.otherUser.name}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-1 space-x-reverse text-gray-400 text-[10px] sm:text-[11px] font-medium shrink-0">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                      <span>{targetListing?.city || chat.deliveryLocation || 'الرياض'}، السعودية</span>
                    </div>

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* FULL OFFER DETAILS MODAL (نافذة تفاصيل المقايضة الكاملة) */}
      {selectedChatDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-xs overflow-y-auto" id="swap_details_modal">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 text-right border border-gray-100 shadow-2xl relative my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-xs">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-base">تفاصيل عرض المقايضة</h3>
                  <p className="text-[11px] text-gray-500 font-medium">معلومات العرض الكاملة وقرارات المقايضة</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedChatDetails(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Other User Info Card */}
            {(() => {
              const chat = selectedChatDetails;
              const offerStatus = chat.offerStatus || 'معلق';
              const isReceived = isReceivedChat(chat);
              const offeredListing = listings.find(l => l.id === chat.offeredListingId);
              const offeredTitle = chat.offeredListingTitle || offeredListing?.title || 'منتج معروض للمقايضة';
              const offeredImg = chat.offeredListingImageUrl || offeredListing?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80';

              return (
                <div className="space-y-5">
                  
                  {/* Status Banner & User Bar */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <img 
                        src={chat.otherUser.avatar} 
                        alt={chat.otherUser.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <h4 className="font-extrabold text-gray-900 text-sm">{chat.otherUser.name}</h4>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md">
                            مستوى ثقة {chat.otherUser.reliabilityLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {isReceived ? 'أرسل لك هذا العرض للمقايضة' : 'أرسلت له هذا العرض للمقايضة'}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${
                      offerStatus === 'مقبول' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : offerStatus === 'مكتمل'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : offerStatus === 'مرفوض'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {offerStatus === 'معلق' && (isReceived ? 'بانتظار موافقتك' : 'بانتظار الطرف الثاني')}
                      {offerStatus === 'مقبول' && 'تم قبول العرض'}
                      {offerStatus === 'مكتمل' && 'مكتمل بنجاح'}
                      {offerStatus === 'مرفوض' && 'تم الرفض'}
                    </span>
                  </div>

                  {/* Full Product Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Targeted Item */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                      <span className="text-[10px] font-black text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md inline-block">
                        المنتج الأصلي (المطلوب)
                      </span>
                      <div className="flex space-x-3 space-x-reverse items-start">
                        <img 
                          src={chat.listingImageUrl} 
                          alt={chat.listingTitle}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="font-extrabold text-gray-900 text-xs sm:text-sm">{chat.listingTitle}</h5>
                          <p className="text-[11px] text-gray-500 mt-1">
                            المطلب المعلن: <span className="font-bold text-gray-700">{chat.listingWantedInReturn}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Offered Item */}
                    <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 space-y-3 ring-1 ring-emerald-500/10">
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                        المنتج المعروض للتبادل
                      </span>
                      <div className="flex space-x-3 space-x-reverse items-start">
                        <img 
                          src={offeredImg} 
                          alt={offeredTitle}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="font-extrabold text-gray-900 text-xs sm:text-sm">{offeredTitle}</h5>
                          <p className="text-[11px] text-emerald-700 font-bold mt-1">
                            مقدم بواسطة: {chat.otherUser.name}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Financial Settlement / Cash Difference */}
                  {options.enableCashDifference && (
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-xs text-amber-900 font-bold space-y-1">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <DollarSign className="w-4 h-4 text-amber-700" />
                        <span>التسوية المالية المرفقة والعرض المالي:</span>
                      </div>
                      <p className="text-gray-800 text-xs font-semibold pt-1">
                        {chat.cashDifferenceType === 'offerer_pays' && (
                          <span className="text-emerald-700 font-black">
                            يتعهد مقدم العرض بدفع مبلغ مالي إضافي قدره +{chat.cashDifferenceAmount || 0} ريال.
                          </span>
                        )}
                        {chat.cashDifferenceType === 'offerer_requests' && (
                          <span className="text-amber-900 font-black">
                            يطلب مقدم العرض تحويل مبلغ +{chat.cashDifferenceAmount || 0} ريال لصالح حسابه مقابل الفارق.
                          </span>
                        )}
                        {(!chat.cashDifferenceType || chat.cashDifferenceType === 'none') && (
                          <span className="text-gray-600">
                            مقايضة مباشرة رأس برأس بدون دفع مالي إضافي.
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Logistics & Location Details */}
                  {(chat.deliveryLocation || chat.deliveryMethod || chat.requiresInspection || chat.customFieldsData) && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-2">
                      <h5 className="font-extrabold text-gray-900 text-xs border-b border-gray-200 pb-1.5">
                        شروط وموقع التسليم:
                      </h5>
                      {chat.deliveryLocation && (
                        <p className="flex items-center space-x-2 space-x-reverse">
                          <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span><strong>موقع التسليم:</strong> {chat.deliveryLocation}</span>
                        </p>
                      )}
                      {chat.deliveryMethod && (
                        <p className="flex items-center space-x-2 space-x-reverse">
                          <Truck className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span><strong>طريقة الشحن / التوصيل:</strong> {chat.deliveryMethod}</span>
                        </p>
                      )}
                      {chat.requiresInspection && (
                        <p className="text-emerald-800 font-bold flex items-center space-x-2 space-x-reverse">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>يشترط المعاينة والفحص الميداني قبل إتمام التسليم.</span>
                        </p>
                      )}
                      {chat.customFieldsData && Object.entries(chat.customFieldsData).map(([fieldId, val]) => {
                        const fieldDef = options.customFields?.find(f => f.id === fieldId);
                        return (
                          <p key={fieldId}>
                            <strong>{fieldDef?.label || fieldId}:</strong> {val}
                          </p>
                        );
                      })}
                    </div>
                  )}

                  {/* Offer Note */}
                  {options.enableOfferNote && chat.offerNote && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
                      <h5 className="font-extrabold text-gray-900 mb-1">ملاحظة ورسالة العرض:</h5>
                      <p className="text-gray-600 leading-relaxed italic">"{chat.offerNote}"</p>
                    </div>
                  )}

                  {/* Open Chat Link & Contract View */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if (onViewChat) {
                          onViewChat(chat.id);
                          setSelectedChatDetails(null);
                        }
                      }}
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 space-x-reverse cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-700" />
                      <span>محادثة التفاوض والاتفاق</span>
                    </button>

                    <button
                      onClick={() => {
                        setContractChat(chat);
                      }}
                      className="w-full py-3 bg-[#786142] hover:bg-[#614e35] text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 space-x-reverse cursor-pointer shadow-xs"
                    >
                      <FileText className="w-4 h-4 text-amber-200" />
                      <span>العقد الإلكتروني الموثق</span>
                    </button>
                  </div>

                  {/* Action Decisions Bar */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2">
                    {offerStatus === 'معلق' && isReceived && (
                      <>
                        <button
                          onClick={() => {
                            if (onUpdateOfferStatus) onUpdateOfferStatus(chat.id, 'مقبول');
                            setSelectedChatDetails(null);
                          }}
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                        >
                          قبول عرض المقايضة
                        </button>

                        <button
                          onClick={() => {
                            if (onUpdateOfferStatus) onUpdateOfferStatus(chat.id, 'مرفوض');
                            setSelectedChatDetails(null);
                          }}
                          className="px-5 py-3 bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                        >
                          اعتذار
                        </button>
                      </>
                    )}

                    {offerStatus === 'معلق' && !isReceived && (
                      <div className="w-full flex items-center justify-between gap-2">
                        <span className="text-xs text-amber-800 font-bold bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 flex-1">
                          بانتظار موافقة الطرف الثاني على العرض
                        </span>
                        {options.enableOfferCancel && (
                          <button
                            onClick={() => {
                              if (onUpdateOfferStatus) onUpdateOfferStatus(chat.id, 'مرفوض');
                              setSelectedChatDetails(null);
                            }}
                            className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs transition-all cursor-pointer"
                          >
                            إلغاء العرض
                          </button>
                        )}
                      </div>
                    )}

                    {offerStatus === 'مقبول' && (
                      <button
                        onClick={() => handleCompleteSwap(chat)}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                      >
                        تأكيد استلام المنتجات وتقييم التجربة
                      </button>
                    )}

                    {offerStatus === 'مكتمل' && (
                      <span className="w-full text-center text-xs font-bold text-purple-800 bg-purple-50 py-2.5 rounded-xl border border-purple-200">
                        اكتملت المقايضة بنجاح!
                      </span>
                    )}

                    {offerStatus === 'مرفوض' && (
                      <span className="w-full text-center text-xs font-bold text-rose-700 bg-rose-50 py-2.5 rounded-xl border border-rose-200">
                        عرض مرفوض
                      </span>
                    )}
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* RATING & REVIEWS MODAL */}
      {showRatingModal && ratingTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs" id="swaps_rating_modal">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-right border border-gray-100 shadow-2xl relative">
            
            <div className="text-center mb-5">
              <h3 className="font-extrabold text-gray-900 text-lg">إغلاق المقايضة وتقييم الطرف الآخر</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                تم تأكيد استلام السلعة/الخدمة. يرجى تقديم تقييمك لمستخدم **{ratingTargetUser.name}**.
              </p>
            </div>

            {/* Target user card */}
            <div className="flex items-center space-x-3 space-x-reverse bg-gray-50 p-3 rounded-2xl border border-gray-100 mb-5">
              <img
                src={ratingTargetUser.avatar}
                alt={ratingTargetUser.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/20"
                referrerPolicy="no-referrer"
              />
              <div className="text-right flex-1">
                <h4 className="font-bold text-gray-900 text-sm">{ratingTargetUser.name}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">سيتم إضافة التقييم لملفه الشخصي</p>
              </div>
            </div>

            {/* Rating Numeric Buttons */}
            <div className="mb-5 text-center">
              <span className="block text-xs font-bold text-gray-700 mb-2">التقييم من 5:</span>
              <div className="flex justify-center space-x-2 space-x-reverse">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRatingValue(val)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      ratingValue === val
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">تعليق شخصي (اختياري)</label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="اكتب انطباعك عن عملية التبادل والتعامل..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-right focus:ring-2 focus:ring-purple-500 bg-gray-50/50 outline-hidden"
              />
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2.5 space-x-reverse">
              <button
                onClick={submitRating}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md text-center cursor-pointer"
              >
                تأكيد التقييم والحفظ
              </button>
              
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                تخطي
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Digital Contract Viewer Modal */}
      {contractChat && (
        <DigitalContractModal
          isOpen={!!contractChat}
          onClose={() => setContractChat(null)}
          chat={contractChat}
          currentUser={currentUser}
          listings={listings}
          contractSettings={contractSettings}
        />
      )}

    </div>
  );
}
