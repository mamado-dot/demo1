import React, { useState } from 'react';
import { useBarter } from '../context/BarterContext';
import { TradeOffer, BarterContract } from '../types';
import { 
  MessageSquare, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
} from 'lucide-react';

interface NegotiationsViewProps {
  initialOfferId?: string | null;
  onClose: () => void;
  onViewContract?: (contract: BarterContract) => void;
  onViewUserProfile?: (userId: string) => void;
}

export const NegotiationsView: React.FC<NegotiationsViewProps> = ({
  initialOfferId,
  onClose,
  onViewContract,
  onViewUserProfile,
}) => {
  const { 
    currentUser, 
    offers, 
    items, 
    users, 
    negotiationMessages, 
    addNegotiationMessage, 
  } = useBarter();

  // Filter offers for currentUser
  const userOffers = currentUser
    ? offers.filter((o) => o.offeredByUserId === currentUser.id || o.targetOwnerUserId === currentUser.id)
    : [];

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(
    initialOfferId || (userOffers.length > 0 ? userOffers[0].id : null)
  );

  const [inputMessage, setInputMessage] = useState('');

  const selectedOffer = userOffers.find((o) => o.id === selectedOfferId) || userOffers[0];

  // Helper details for selected offer
  const targetItem = selectedOffer ? items.find((i) => i.id === selectedOffer.targetItemId) : null;
  const offeredItem = selectedOffer ? items.find((i) => i.id === selectedOffer.offeredItemId) : null;
  
  const isTargetOwner = currentUser && selectedOffer ? selectedOffer.targetOwnerUserId === currentUser.id : false;
  const otherUserId = selectedOffer
    ? (isTargetOwner ? selectedOffer.offeredByUserId : selectedOffer.targetOwnerUserId)
    : null;
  const otherUser = otherUserId ? users.find((u) => u.id === otherUserId) : null;

  const currentMessages = selectedOffer
    ? negotiationMessages.filter((m) => m.offerId === selectedOffer.id)
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedOffer) return;
    addNegotiationMessage(selectedOffer.id, inputMessage);
    setInputMessage('');
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 font-['Cairo',sans-serif]">
        <div className="w-14 h-14 bg-amber-50 text-[#8c5332] rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-slate-900">يلزم تسجيل الدخول للوصول للمفاوضات</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          مفاوضات المقايضة وشات الاتفاق حصرية للأعضاء المسجلين في المنصة.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200 dir-rtl font-['Cairo',sans-serif]">
      {/* Top Header Navigation */}
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
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900">المفاوضات والمحادثات</h1>
            <p className="text-xs text-slate-500 font-medium">التواصل المباشر والاتفاق على تفاصيل شروط المقايضة</p>
          </div>
        </div>
      </div>

      {userOffers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/90 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-[#8c5332] flex items-center justify-center mx-auto border border-amber-200">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">لا توجد مفاوضات حالية</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              عند إرسال أو استلام طلب مقايضة، ستظهر هنا محادثة المفاوضة المباشرة.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
          
          {/* Side Negotiations List (4 Cols) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-l border-slate-200/80 bg-slate-50/50 flex flex-col">
            <div className="p-4 border-b border-slate-200/80 bg-white">
              <h2 className="text-xs font-black text-slate-800 flex items-center justify-between">
                <span>المفاوضات</span>
              </h2>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1 max-h-[500px] lg:max-h-none">
              {userOffers.map((offer) => {
                const isSel = offer.id === selectedOfferId;
                const tItem = items.find((i) => i.id === offer.targetItemId);
                const oItem = items.find((i) => i.id === offer.offeredItemId);
                const isOwner = offer.targetOwnerUserId === currentUser.id;
                const otherP = users.find((u) => u.id === (isOwner ? offer.offeredByUserId : offer.targetOwnerUserId));
                const msgs = negotiationMessages.filter((m) => m.offerId === offer.id);
                const lastMsg = msgs[msgs.length - 1];

                return (
                  <button
                    key={offer.id}
                    onClick={() => setSelectedOfferId(offer.id)}
                    className={`w-full text-right p-4 transition-all cursor-pointer flex items-start gap-3 ${
                      isSel ? 'bg-amber-50/80 border-r-4 border-r-[#8c5332]' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <img
                      src={otherP?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={otherP?.name}
                      className="w-10 h-10 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-xs"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-900 truncate">
                          {otherP?.name || 'مستخدم'}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#8c5332] font-extrabold truncate">
                        {oItem?.title} ⇌ {tItem?.title}
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {lastMsg ? lastMsg.text : offer.note || 'محادثة جديدة...'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Active Chat Room (8 Cols) */}
          {selectedOffer && targetItem && offeredItem ? (
            <div className="lg:col-span-8 flex flex-col h-full bg-white">
              
              {/* Chat Room Header */}
              <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    if (otherUser && onViewUserProfile) {
                      onViewUserProfile(otherUser.id);
                    }
                  }}
                  className="flex items-center gap-2.5 text-right hover:opacity-80 transition-all cursor-pointer"
                >
                  <img
                    src={otherUser?.avatar}
                    alt={otherUser?.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <span>{otherUser?.name}</span>
                      {otherUser?.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8c5332]" />
                      )}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">{otherUser?.city}</p>
                  </div>
                </button>

                <div className="text-xs text-slate-600 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  {offeredItem.title} ⇌ {targetItem.title}
                </div>
              </div>

              {/* Chat Messages Thread */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 min-h-[350px] max-h-[480px] bg-slate-50/30">
                {currentMessages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">اكتب رسالتك لبدء المحادثة</p>
                  </div>
                ) : (
                  currentMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-200"
                        />

                        <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end text-left' : 'items-start text-right'}`}>
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] font-black text-slate-700">{msg.senderName}</span>
                            <span className="text-[9px] text-slate-400">{msg.createdAt}</span>
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed font-semibold shadow-2xs ${
                              isMe
                                ? 'bg-[#8c5332] text-white rounded-tr-xs'
                                : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200/80 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#8c5332] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-5 py-3 rounded-2xl bg-[#8c5332] hover:bg-[#734123] disabled:opacity-40 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md shadow-[#8c5332]/20"
                >
                  <span>إرسال</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          ) : null}

        </div>
      )}
    </div>
  );
};
