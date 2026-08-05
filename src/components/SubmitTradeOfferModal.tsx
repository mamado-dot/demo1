import React, { useState } from 'react';
import { BarterItem } from '../types';
import { useBarter } from '../context/BarterContext';
import { 
  X, 
  ArrowLeftRight, 
  ArrowRight,
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Banknote, 
  MessageSquare,
  ShieldAlert,
  MapPin
} from 'lucide-react';

interface SubmitTradeOfferModalProps {
  targetItem: BarterItem | null;
  onClose: () => void;
  onOpenAddItem: () => void;
}

export const SubmitTradeOfferModal: React.FC<SubmitTradeOfferModalProps> = ({
  targetItem,
  onClose,
  onOpenAddItem
}) => {
  if (!targetItem) return null;

  const { items, currentUser, createTradeOffer, settings } = useBarter();

  // Get current user's active items
  const myActiveItems = currentUser ? items.filter(
    (i) => i.ownerId === currentUser.id && (i.status === 'active' || i.status === 'in_deal')
  ) : [];

  const [selectedOfferedItemId, setSelectedOfferedItemId] = useState<string>(
    myActiveItems.length > 0 ? myActiveItems[0].id : ''
  );

  const [cashDifference, setCashDifference] = useState<number>(0); // positive: payer pays target owner, negative: target owner pays payer
  const [cashDirection, setCashDirection] = useState<'pay' | 'receive' | 'none'>('none');
  const [cashAmountInput, setCashAmountInput] = useState<number | ''>(0);
  const [note, setNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'استلام يدوي' | 'شحن بريدي'>('استلام يدوي');

  const [feedback, setFeedback] = useState<{ success?: boolean; message?: string }>({});

  const selectedOfferedItem = items.find((i) => i.id === selectedOfferedItemId);

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOfferedItemId) {
      setFeedback({ success: false, message: 'يرجى اختيار سلعة من سلعك المضافة لمقايضتها' });
      return;
    }

    let finalCashDiff = 0;
    if (cashDirection === 'pay') {
      finalCashDiff = Number(cashAmountInput) || 0;
    } else if (cashDirection === 'receive') {
      finalCashDiff = -(Number(cashAmountInput) || 0);
    }

    const result = createTradeOffer({
      targetItemId: targetItem.id,
      offeredItemId: selectedOfferedItemId,
      cashDifference: finalCashDiff,
      note: note.trim() || 'أتطلع لمقايضة ممتازة وموفقة للطرفين.',
      deliveryMethod,
    });

    setFeedback(result);

    if (result.success) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
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
            <ArrowLeftRight className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900"> تقديم عرض مقايضة جديد</h1>
            <p className="text-xs text-slate-500 font-medium">اختر من مقتنياتك لطلب المبادلة والتوافق مع هذا العرض</p>
          </div>
        </div>
      </div>

      <div className="bg-white max-w-3xl mx-auto rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">


        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-right">
          
          {feedback.message && (
            <div className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              feedback.success ? 'bg-[#f5eee6] text-[#734123] border-[#e6d8c7]' : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              {feedback.success ? <CheckCircle2 className="w-4 h-4 text-[#8c5332] shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Condition Check: IF user has NO active items */}
          {myActiveItems.length === 0 ? (
            <div className="p-8 text-center bg-[#f5eee6]/60 rounded-2xl border border-[#e6d8c7] space-y-4">
              <div className="w-14 h-14 bg-[#e6d8c7] text-[#593118] rounded-2xl flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2b1c14]">يجب أن تملك سلعة مضافة بالموقع لتقديم مقايضة!</h3>
                <p className="text-xs text-[#734123] mt-1 max-w-md mx-auto font-medium leading-relaxed">
                  شرط المنصة الأساسي لتقديم عرض مقايضة أن تكون لديك سلعة واحدة على الأقل مضافة في حسابك، ليختار صاحب السلعة الأخرى قبولها ومقايضتها معك.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAddItem();
                }}
                className="px-6 py-3 bg-[#8c5332] hover:bg-[#734123] text-white font-bold text-xs rounded-xl shadow-md shadow-[#8c5332]/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>أضف سلعتك الأولى الآن وارجع لتقديم العرض</span>
              </button>
            </div>
          ) : (
            /* IF User HAS items listed */
            <form onSubmit={handleSubmitOffer} className="space-y-6">
              
              {/* TARGET ITEM RECAP */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <img src={targetItem.images[0]} className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200" />
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-500">السلعة المستهدفة:</div>
                  <div className="text-sm font-extrabold text-slate-900 leading-snug">{targetItem.title}</div>
                  <div className="text-xs text-[#8c5332] font-bold mt-0.5">القيمة المقدرة: {targetItem.estimatedValue} ريال</div>
                </div>
              </div>

              {/* ITEM SELECTOR FROM USER'S LIST */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-900">
                  اختر السلعة التي تريد تقديمها بالمقابل من قائمة سلعك: *
                </label>

                <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {myActiveItems.map((item) => (
                    <label
                      key={item.id}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        selectedOfferedItemId === item.id
                          ? 'border-[#8c5332] bg-[#f5eee6]/60 ring-2 ring-[#8c5332]/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="offeredItem"
                          value={item.id}
                          checked={selectedOfferedItemId === item.id}
                          onChange={() => setSelectedOfferedItemId(item.id)}
                          className="w-4 h-4 text-[#8c5332] focus:ring-[#8c5332]"
                        />
                        <img src={item.images[0]} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{item.title}</div>
                          <div className="text-[11px] text-slate-500">{item.category} • {item.condition}</div>
                        </div>
                      </div>

                      <div className="text-left text-xs font-black text-[#8c5332]">
                        {item.estimatedValue} ريال
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* CASH DIFFERENCE SETTLEMENT */}
              {settings.enableCashDifference && targetItem.allowCashDifference && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-[#8c5332]" />
                    هل ترغب باقتراح فارق سعر نقدي لتكافؤ الصفقة؟
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { setCashDirection('none'); setCashAmountInput(0); }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        cashDirection === 'none' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      تبادل راس براس (بدون فارق)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashDirection('pay')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        cashDirection === 'pay' ? 'bg-[#8c5332] text-white border-[#8c5332]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      أنا أدفع فارق لصاحب السلعة
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashDirection('receive')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        cashDirection === 'receive' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      أطلب فارق نقدي من صاحب السلعة
                    </button>
                  </div>

                  {cashDirection !== 'none' && (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs font-bold text-slate-700">مبلغ الفارق النقدي:</span>
                      <input
                        type="number"
                        placeholder="500"
                        value={cashAmountInput}
                        onChange={(e) => setCashAmountInput(e.target.value ? Number(e.target.value) : '')}
                        className="w-32 bg-white font-extrabold text-sm text-slate-900 rounded-xl px-3 py-1.5 border border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-800">ريال سعودي</span>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery method */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">طريقة المعاينة والتسليم المقترحة:</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value as any)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-200 outline-hidden"
                >
                  <option value="استلام يدوي">استلام يدوي وجه لوجه والمعاينة الفورية</option>
                  <option value="شحن بريدي">شحن عبر شركات الشحن مع فترة فحص 3 أيام</option>
                </select>
              </div>

              {/* Custom Note */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">رسالة توضيحية لصاحب السلعة:</label>
                <textarea
                  rows={2}
                  placeholder="اكتب ملاحظة ودية تشرح مميزات سلعتك ومكان تواجدها..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl p-3 border border-slate-200 outline-hidden font-medium"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold shadow-md shadow-[#8c5332]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>إرسال عرض المقايضة</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
