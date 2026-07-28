import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, ChevronRight, FileText, CheckCircle2, ShieldCheck, ArrowLeftRight, Clock
} from 'lucide-react';
import { Chat, User, Listing, Review, ContractSettings } from '../types';
import { SIMULATED_RESPONSES } from '../data/mockData';
import DigitalContractModal from './DigitalContractModal';

interface ChatSectionProps {
  currentUser: User | null;
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  onSendMessage: (chatId: string, text: string) => void;
  onAddSimulatedMessage: (chatId: string, text: string) => void;
  onUpdateOfferStatus: (chatId: string, status: 'معلق' | 'مقبول' | 'مرفوض' | 'مكتمل') => void;
  onConfirmBarter?: (chatId: string) => void;
  onCloseListing: (listingId: string) => void;
  onAddReview: (userId: string, review: Omit<Review, 'id' | 'date'>) => void;
  userListings: Listing[];
  contractSettings?: ContractSettings;
}

export default function ChatSection({
  currentUser,
  chats,
  activeChatId,
  setActiveChatId,
  onSendMessage,
  onAddSimulatedMessage,
  onUpdateOfferStatus,
  onConfirmBarter,
  onCloseListing,
  onAddReview,
  userListings,
  contractSettings,
}: ChatSectionProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  // Handle simulated replies
  const handleUserMessageSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId || !currentUser) return;

    const currentText = inputText;
    setInputText('');
    
    // 1. Send user message
    onSendMessage(activeChatId, currentText);

    // 2. Trigger simulated response after short delay
    setIsTyping(true);

    const otherUserId = activeChat?.otherUser.id || '';
    const responses = SIMULATED_RESPONSES[otherUserId] || [
      'هذا رائع جداً! يسعدني التنسيق معك بخصوص عرض المقايضة والعقد.',
      'أهلاً بك، تم استلام تفاصيل المقايضة وسأقوم بتأكيد الاتفاق الآن.',
      'ممتاز! اتفقت معك ويمكنك الضغط على زر "تأكيد المقايضة" لإصدار العقد الإلكتروني.'
    ];

    const userMessageCount = activeChat?.messages.filter(m => m.senderId === currentUser.id).length || 0;
    const replyText = responses[userMessageCount % responses.length];

    setTimeout(() => {
      setIsTyping(false);
      onAddSimulatedMessage(activeChatId, replyText);

      // Simulate other user confirmation on 2nd message if not confirmed
      if (userMessageCount >= 1 && onConfirmBarter && activeChat && !activeChat.ownerConfirmed && !activeChat.offererConfirmed) {
        setTimeout(() => {
          onConfirmBarter(activeChat.id);
        }, 1200);
      }
    }, 1500);
  };

  const targetListing = userListings.find(l => l.id === activeChat?.listingId);
  const isOwner = targetListing?.ownerId === currentUser?.id;
  
  const userConfirmed = isOwner ? activeChat?.ownerConfirmed : activeChat?.offererConfirmed;
  const otherConfirmed = isOwner ? activeChat?.offererConfirmed : activeChat?.ownerConfirmed;
  const bothConfirmed = activeChat?.ownerConfirmed && activeChat?.offererConfirmed;

  return (
    <div id="chat_section_container" className="bg-white border border-gray-100 rounded-3xl min-h-[620px] overflow-hidden flex flex-col md:flex-row shadow-sm" style={{ direction: 'rtl' }}>
      
      {/* 1. Right Sidebar: List of Barter Negotiation Chats */}
      <div id="chat_sidebar" className={`w-full md:w-80 border-l border-gray-100 flex flex-col bg-gray-50/40 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between" id="sidebar_header">
          <div className="flex items-center space-x-2 space-x-reverse">
            <MessageSquare className="w-5 h-5 text-[#786142]" />
            <h3 className="font-black text-gray-900 text-sm">محادثات المقايضة والصفقات</h3>
          </div>
          <span className="text-xs font-bold text-[#786142] bg-amber-50 px-2.5 py-0.5 rounded-full">
            {chats.length}
          </span>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 bg-white" id="chats_list">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              لا توجد محادثات صفقات قائمة حتى الآن.
            </div>
          ) : (
            chats.map((chat) => {
              const isSelected = chat.id === activeChatId;

              return (
                <div
                  key={chat.id}
                  id={`chat_item_${chat.id}`}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-3.5 flex items-center space-x-3 space-x-reverse cursor-pointer transition-all duration-150 border-r-4 ${
                    isSelected 
                      ? 'bg-amber-50/50 border-[#786142]' 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={chat.otherUser.avatar}
                    alt={chat.otherUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-gray-900 text-sm truncate">{chat.otherUser.name}</h4>
                      {chat.ownerConfirmed && chat.offererConfirmed && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0">موثق</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{chat.listingTitle}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Left Main Area: Active Barter Negotiation Chat Window */}
      <div id="active_chat_window" className={`flex-1 flex flex-col bg-gray-50/20 ${!activeChatId ? 'hidden md:flex justify-center items-center p-8' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Header: User Info */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between" id="chat_window_header">
              
              <div className="flex items-center space-x-3 space-x-reverse" id="chat_header_user_info">
                <button 
                  onClick={() => setActiveChatId(null)} 
                  className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                  id="back_to_chats_btn"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <img
                  src={activeChat.otherUser.avatar}
                  alt={activeChat.otherUser.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-500/10"
                  referrerPolicy="no-referrer"
                />
                
                <div className="text-right">
                  <h4 className="font-black text-gray-900 text-base">{activeChat.otherUser.name}</h4>
                  <p className="text-xs text-[#786142] font-extrabold flex items-center space-x-1 space-x-reverse mt-0.5">
                    <span>محادثة صفقة مقايضة:</span>
                    <span className="text-gray-900 font-bold">{activeChat.listingTitle}</span>
                  </p>
                </div>
              </div>

              {/* Top View Contract Button if available */}
              {(bothConfirmed || activeChat.contractNumber) && (
                <button
                  onClick={() => setIsContractModalOpen(true)}
                  className="px-3.5 py-2 bg-[#786142] hover:bg-[#614e35] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center space-x-1.5 space-x-reverse cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>عرض العقد الإلكتروني</span>
                </button>
              )}

            </div>

            {/* DEDICATED BARTER DEAL CONFIRMATION & CONTRACT BANNER */}
            <div className="bg-amber-50/80 border-b border-amber-200/70 p-3.5 sm:p-4 text-xs text-amber-950 space-y-3" id="deal_negotiation_banner">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Items preview */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="flex items-center space-x-1.5 space-x-reverse bg-white px-2.5 py-1.5 rounded-lg border border-amber-200">
                    <span className="font-bold text-gray-900 truncate max-w-[120px]">{activeChat.listingTitle}</span>
                  </div>
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#786142] shrink-0" />
                  <div className="flex items-center space-x-1.5 space-x-reverse bg-white px-2.5 py-1.5 rounded-lg border border-amber-200">
                    <span className="font-bold text-emerald-800 truncate max-w-[120px]">{activeChat.offeredListingTitle || 'عرض المقايضة'}</span>
                  </div>
                </div>

                {/* Dual Confirm Actions */}
                <div className="flex items-center space-x-2 space-x-reverse justify-end">
                  
                  {/* Both confirmed state */}
                  {bothConfirmed ? (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center space-x-1 space-x-reverse">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>موثق بعقد إلكتروني</span>
                      </span>
                      <button
                        onClick={() => setIsContractModalOpen(true)}
                        className="bg-[#786142] hover:bg-[#614e35] text-white px-3 py-1.5 rounded-xl font-bold transition-all shadow-2xs"
                      >
                        معاينة العقد
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      
                      {/* Confirm Button for current user */}
                      {!userConfirmed ? (
                        <button
                          onClick={() => {
                            if (onConfirmBarter) onConfirmBarter(activeChat.id);
                          }}
                          className="bg-[#786142] hover:bg-[#614e35] text-white px-4 py-2 rounded-xl font-black text-xs transition-all shadow-xs flex items-center space-x-1.5 space-x-reverse cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-200" />
                          <span>تأكيد المقايضة</span>
                        </button>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1.5 rounded-xl border border-amber-200 flex items-center space-x-1 space-x-reverse">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>تأكيدك مسجل (بانتظار الطرف الآخر)</span>
                        </span>
                      )}

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* Messages Scrollable Panel */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/20" id="messages_scroller">
              
              {/* Chat start time label */}
              <div className="text-center my-2">
                <span className="text-[10px] text-gray-500 bg-white border border-amber-100 px-3 py-1 rounded-full shadow-2xs">
                  بدأت محادثة صفقة المقايضة والعقد
                </span>
              </div>

              {/* Render Chat Messages */}
              {activeChat.messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                const isSystem = msg.senderId === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="my-3 p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl text-center text-xs text-amber-950 font-bold max-w-lg mx-auto shadow-2xs space-y-2">
                      <p>{msg.text}</p>
                      {bothConfirmed && (
                        <button
                          onClick={() => setIsContractModalOpen(true)}
                          className="inline-flex items-center space-x-1.5 space-x-reverse px-4 py-1.5 bg-[#786142] text-white text-[11px] font-black rounded-lg shadow-2xs hover:bg-[#614e35] transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>تحميل ومعاينة العقد الإلكتروني</span>
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 space-x-reverse ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={activeChat.otherUser.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    <div className="flex flex-col max-w-[75%]" style={{ alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <div 
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm text-right leading-relaxed ${
                          isMe 
                            ? 'bg-[#786142] text-white rounded-br-none shadow-xs' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-2xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                    </div>

                    {isMe && currentUser && (
                      <img
                        src={currentUser.avatar}
                        alt="me"
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 space-x-reverse justify-start" id="typing_indicator">
                  <img
                    src={activeChat.otherUser.avatar}
                    alt="typing"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none flex items-center space-x-1.5 space-x-reverse shadow-2xs">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] text-gray-400 mr-1.5">يكتب الآن...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Box */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-100" id="chat_input_box">
              <form onSubmit={handleUserMessageSend} className="flex space-x-2 space-x-reverse">
                
                <input
                  id="chat_text_input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="اكتب رسالتك والتنسيق للتسليم والمقايضة..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-right focus:ring-2 focus:ring-[#786142] focus:border-[#786142] outline-hidden bg-gray-50/50"
                />

                <button
                  id="chat_send_btn"
                  type="submit"
                  className="bg-[#786142] hover:bg-[#614e35] text-white font-bold rounded-xl px-5 py-3 transition-all duration-150 shadow-xs flex items-center justify-center shrink-0 space-x-1.5 space-x-reverse cursor-pointer"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  <span className="text-xs hidden sm:inline">إرسال</span>
                </button>

              </form>
            </div>
          </>
        ) : (
          <div className="text-center p-8 text-gray-400 text-sm flex flex-col items-center justify-center space-y-4" id="chat_no_selection_state">
            <div className="p-4 bg-amber-50/60 rounded-full text-[#786142]">
              <MessageSquare className="w-10 h-10 text-[#786142]" />
            </div>
            <div>
              <p className="font-extrabold text-gray-800 text-base">اختر صفقة من القائمة</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                اضغط على اسم الصفقة من القائمة الجانبية للتفاوض وتأكيد المقايضة واستصدار العقد الإلكتروني الموثق.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Digital Contract Modal */}
      {activeChat && (
        <DigitalContractModal
          isOpen={isContractModalOpen}
          onClose={() => setIsContractModalOpen(false)}
          chat={activeChat}
          currentUser={currentUser}
          listings={userListings}
          contractSettings={contractSettings}
        />
      )}

    </div>
  );
}
