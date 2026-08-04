import React, { useState } from 'react';
import { useBarter } from '../context/BarterContext';
import { TradeOffer, BarterContract } from '../types';
import { 
  X, 
  ArrowLeftRight, 
  ArrowRight,
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock, 
  Banknote, 
  BadgeCheck, 
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface TradeOffersModalProps {
  onClose: () => void;
  onViewContract: (contract: BarterContract) => void;
  onOpenNegotiation?: (offerId: string) => void;
}

export const TradeOffersModal: React.FC<TradeOffersModalProps> = ({ onClose, onViewContract, onOpenNegotiation }) => {
  const { 
    currentUser, 
    offers, 
    items, 
    users, 
    respondToOffer, 
    signContractAndFinalize,
    contracts 
  } = useBarter();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  // Filter offers
  const incomingOffers = currentUser ? offers.filter((o) => o.targetOwnerUserId === currentUser.id) : [];
  const outgoingOffers = currentUser ? offers.filter((o) => o.offeredByUserId === currentUser.id) : [];

  const displayedOffers = activeTab === 'incoming' ? incomingOffers : outgoingOffers;

  const handleSignContract = (offerId: string) => {
    const result = signContractAndFinalize(offerId);
    if (result.contract) {
      onViewContract(result.contract);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-sm font-extrabold text-slate-900">صفقات وعروض المقايضة</span>
        </div>
      </div>

      <div className="bg-white max-w-5xl mx-auto rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">

        {/* Tab Buttons */}
        <div className="p-2 bg-slate-100/80 rounded-2xl flex gap-2">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'incoming'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>العروض الواردة لسلعي</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-black">
              {incomingOffers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'outgoing'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>العروض التي أرسلتها للآخرين</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#e6d8c7] text-[#593118] font-black">
              {outgoingOffers.length}
            </span>
          </button>
        </div>

        {/* Offers List Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {displayedOffers.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-2">
              <ArrowLeftRight className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">لا توجد عروض في هذا القسم حالياً</p>
              <p className="text-xs text-slate-400">عند تقديم أو استلام أي عرض مقايضة ستظهر التفاصيل الكاملة هنا.</p>
            </div>
          ) : (
            displayedOffers.map((offer) => {
              const targetItem = items.find((i) => i.id === offer.targetItemId);
              const offeredItem = items.find((i) => i.id === offer.offeredItemId);
              const otherPartyUser = users.find((u) => 
                u.id === (activeTab === 'incoming' ? offer.offeredByUserId : offer.targetOwnerUserId)
              );

              const associatedContract = contracts.find((c) => c.offerId === offer.id || c.id === offer.contractId);

              return (
                <div 
                  key={offer.id} 
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 space-y-4"
                >
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">تاريخ العرض: {offer.createdAt}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-600">طريقة التسليم: {offer.deliveryMethod}</span>
                    </div>

                    <div>
                      {offer.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          بانتظار الرد والاتفاق
                        </span>
                      )}
                      {offer.status === 'accepted' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f5eee6] text-[#734123] border border-[#e6d8c7] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8c5332]" />
                          تم القبول • بانتظار توقيع العقد
                        </span>
                      )}
                      {offer.status === 'completed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                          عقد موثق ومكتمل ✓
                        </span>
                      )}
                      {offer.status === 'rejected' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          تم رفض العرض
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comparative Side by Side Items */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    
                    {/* Item A */}
                    <div className="md:col-span-5 flex items-center gap-3">
                      <img src={targetItem?.images[0]} className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase">السلعة الأولى (المستهدفة)</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{targetItem?.title}</h4>
                        <div className="text-xs text-amber-700 font-extrabold">{targetItem?.estimatedValue} ريال</div>
                      </div>
                    </div>

                    {/* Barter Icon & Cash Diff Indicator */}
                    <div className="md:col-span-2 text-center flex flex-col items-center justify-center my-1 md:my-0">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        <ArrowLeftRight className="w-4 h-4" />
                      </div>
                      
                      {offer.cashDifference !== 0 && (
                        <div className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md mt-1 border border-emerald-200">
                          {offer.cashDifference > 0 
                            ? `+${offer.cashDifference} ريال (يدفعها مقدم العرض)` 
                            : `${offer.cashDifference} ريال (يستلمها مقدم العرض)`}
                        </div>
                      )}
                    </div>

                    {/* Item B */}
                    <div className="md:col-span-5 flex items-center gap-3">
                      <img src={offeredItem?.images[0]} className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                      <div>
                        <span className="text-[10px] font-extrabold text-teal-700 uppercase">السلعة الثانية (المقدمة)</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{offeredItem?.title}</h4>
                        <div className="text-xs text-amber-700 font-extrabold">{offeredItem?.estimatedValue} ريال</div>
                      </div>
                    </div>

                  </div>

                  {/* Note & Other Party */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <img src={otherPartyUser?.avatar} className="w-6 h-6 rounded-md object-cover" />
                      <span className="font-bold text-slate-800">
                        {activeTab === 'incoming' ? 'مقدم العرض:' : 'صاحب السلعة:'} {otherPartyUser?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      <p className="text-slate-600 font-medium italic truncate max-w-[200px]">
                        "{offer.note}"
                      </p>

                      {onOpenNegotiation && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenNegotiation(offer.id);
                          }}
                          className="px-3 py-1.5 bg-[#f5eee6] hover:bg-[#e6d8c7] text-[#734123] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-[#e6d8c7] shrink-0"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#8c5332]" />
                          <span>شات المفاوضة</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions for Incoming Offers */}
                  {activeTab === 'incoming' && offer.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => respondToOffer(offer.id, 'reject')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        رفض العرض
                      </button>
                      <button
                        onClick={() => respondToOffer(offer.id, 'accept')}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>قبول العرض وبدء توثيق العقد</span>
                      </button>
                    </div>
                  )}

                  {/* Sign Contract Button if accepted */}
                  {(offer.status === 'accepted' || (offer.status === 'pending' && activeTab === 'outgoing')) && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-950">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <span>جاهز لإصدار وتوقيع العقد الإلكتروني الموثق مع بنود الضمان!</span>
                      </div>
                      <button
                        onClick={() => handleSignContract(offer.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        اعتماد وتوقيع العقد
                      </button>
                    </div>
                  )}

                  {/* View Contract Button if completed */}
                  {offer.status === 'completed' && associatedContract && (
                    <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 text-xs">
                        <BadgeCheck className="w-5 h-5 text-amber-400" />
                        <span>العقد الإلكتروني رقم <strong className="text-amber-300">{associatedContract.contractNumber}</strong> موثق وساري.</span>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onViewContract(associatedContract);
                        }}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
                      >
                        معاينة وطباعة العقد
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
