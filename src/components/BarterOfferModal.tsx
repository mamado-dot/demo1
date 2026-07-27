import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Listing, User, BarterOptions } from '../types';

interface BarterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetListing: Listing | null;
  userListings: Listing[];
  currentUser: User | null;
  barterOptions?: BarterOptions;
  onOpenAddListing: () => void;
  onSubmitOffer: (data: {
    targetListing: Listing;
    offeredListing?: Listing;
    cashDifferenceType: 'none' | 'offerer_pays' | 'offerer_requests';
    cashDifferenceAmount: number;
    note: string;
    deliveryLocation?: string;
    deliveryMethod?: string;
    requiresInspection?: boolean;
    customFieldsData?: Record<string, string>;
  }) => void;
}

export default function BarterOfferModal({
  isOpen,
  onClose,
  targetListing,
  userListings,
  currentUser,
  barterOptions,
  onOpenAddListing,
  onSubmitOffer,
}: BarterOfferModalProps) {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [cashType, setCashType] = useState<'none' | 'offerer_pays' | 'offerer_requests'>('none');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [offerNote, setOfferNote] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('يداً بـ يد (تسليم مباشر)');
  const [requiresInspection, setRequiresInspection] = useState<boolean>(false);
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, string>>({});

  // Default options if not provided
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

  // My active listings
  const myActiveListings = userListings.filter(
    (l) => l.ownerId === currentUser?.id && l.status !== 'مكتمل'
  );

  useEffect(() => {
    if (myActiveListings.length > 0 && !selectedListingId) {
      setSelectedListingId(myActiveListings[0].id);
    }
  }, [myActiveListings, selectedListingId]);

  if (!isOpen || !targetListing) return null;

  const selectedOfferedListing = myActiveListings.find((l) => l.id === selectedListingId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If product selection is enabled, enforce selecting a product
    if (options.enableProductSelection && !selectedOfferedListing && myActiveListings.length > 0) {
      return;
    }

    onSubmitOffer({
      targetListing,
      offeredListing: selectedOfferedListing,
      cashDifferenceType: options.enableCashDifference ? cashType : 'none',
      cashDifferenceAmount: options.enableCashDifference ? (cashType === 'none' ? 0 : Number(cashAmount) || 0) : 0,
      note: options.enableOfferNote ? offerNote : '',
      deliveryLocation: options.enableLocationField ? deliveryLocation : undefined,
      deliveryMethod: options.enableDeliveryOption ? deliveryMethod : undefined,
      requiresInspection: options.enableInspectionOption ? requiresInspection : undefined,
      customFieldsData: options.customFields.length > 0 ? customFieldsData : undefined,
    });

    // Reset and close
    setOfferNote('');
    setCashType('none');
    setCashAmount(0);
    setDeliveryLocation('');
    setRequiresInspection(false);
    setCustomFieldsData({});
    onClose();
  };

  const activeCustomFields = options.customFields?.filter(f => f.isEnabled) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs overflow-y-auto" id="barter_offer_modal" style={{ direction: 'rtl' }}>
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 text-right border border-gray-100 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6 pb-4 border-b border-gray-100" id="barter_modal_header">
          <h2 className="text-lg font-black text-gray-900">تقديم عرض مقايضة مباشر</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            حدد خيارات المقايضة الخاصة بك للبدء بتقديم العرض إلى صاحب السلعة.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Targeted Item Card */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-2">
            <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md inline-block">
              المنتج المستهدف لمقايضته
            </span>
            <div className="flex items-center space-x-3 space-x-reverse pt-1">
              <img
                src={targetListing.imageUrl}
                alt={targetListing.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-gray-900 text-sm truncate">{targetListing.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  صاحب العرض: <span className="font-bold text-gray-800">{targetListing.ownerName}</span> ({targetListing.city})
                </p>
                <p className="text-xs text-amber-900 font-bold mt-1 bg-amber-100/60 p-1.5 rounded-lg">
                  المطلوب في المقابل: {targetListing.wantedInReturn}
                </p>
              </div>
            </div>
          </div>

          {/* OPTION 1: Select Offered Item (If Enabled) */}
          {options.enableProductSelection && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-gray-900">
                  1. اختر منتجك الذي ترغب بمقايضته مقابله *
                </label>

                {myActiveListings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddListing();
                    }}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    إضافة منتج جديد
                  </button>
                )}
              </div>

              {myActiveListings.length === 0 ? (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 text-center space-y-3">
                  <div>
                    <p className="font-bold text-gray-900 text-xs">ليس لديك أي منتجات أو خدمات معروضة حالياً لمقايضتها!</p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      لتقديم عرض مقايضة، يجب عليك أولاً إضافة المنتج الذي ترغب بالاستغناء عنه لمقايضته.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddListing();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    أضف منتجك الآن للمقايضة
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
                  {myActiveListings.map((item) => {
                    const isSelected = item.id === selectedListingId;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedListingId(item.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 space-x-reverse relative ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 text-right">
                          <h5 className="font-extrabold text-gray-900 text-xs truncate">{item.title}</h5>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{item.category}</span>
                        </div>
                        {isSelected && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                            محدد
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* OPTION 2: Cash Top-up Adjustment (If Enabled) */}
          {options.enableCashDifference && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="block text-xs font-black text-gray-900">
                2. فارق مبلغ مالي إضافي (اختياري إن وجد)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCashType('none')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    cashType === 'none'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  بدون إضافة مالية (مقايضة رأس برأس)
                </button>

                <button
                  type="button"
                  onClick={() => setCashType('offerer_pays')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    cashType === 'offerer_pays'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  أنا سأدفع فارق مبلغ لصاحب العرض
                </button>

                <button
                  type="button"
                  onClick={() => setCashType('offerer_requests')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    cashType === 'offerer_requests'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  أطلب دفع فارق من صاحب العرض
                </button>
              </div>

              {cashType !== 'none' && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    {cashType === 'offerer_pays'
                      ? 'المبلغ الذي تتعهد بدفعه بالإضافة لسلعتك (بالريال السعودي):'
                      : 'المبلغ الذي تطلبه من صاحب السلعة كفارق (بالريال السعودي):'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cashAmount || ''}
                    onChange={(e) => setCashAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="مثال: 200"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 font-bold bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* OPTION 3: Location Field (If Enabled) */}
          {options.enableLocationField && (
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <label className="block text-xs font-black text-gray-900">
                موقع أو مدينة التسليم المقترحة (اختياري)
              </label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="مثال: شمال الرياض - حي الملقا"
                className="w-full border border-gray-200 rounded-xl p-3 text-xs text-gray-800 bg-gray-50/50 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          )}

          {/* OPTION 4: Delivery Method Option (If Enabled) */}
          {options.enableDeliveryOption && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-black text-gray-900">
                طريقة التوصيل والاستلام المفضل
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['يداً بـ يد (تسليم مباشر)', 'شحن / توصيل للمنزل'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setDeliveryMethod(method)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      deliveryMethod === method
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* OPTION 5: Inspection Option (If Enabled) */}
          {options.enableInspectionOption && (
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200/70">
                <input
                  type="checkbox"
                  checked={requiresInspection}
                  onChange={(e) => setRequiresInspection(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span className="text-xs font-bold text-gray-800">
                  أشترط معاينة وفحص السلعة قبل إتمام المقايضة النهائية
                </span>
              </label>
            </div>
          )}

          {/* DYNAMIC CUSTOM FIELDS (If Any) */}
          {activeCustomFields.map((field) => (
            <div key={field.id} className="space-y-1.5 pt-2 border-t border-gray-100">
              <label className="block text-xs font-black text-gray-900">
                {field.label} {field.isRequired ? '*' : '(اختياري)'}
              </label>
              <input
                type="text"
                required={field.isRequired}
                value={customFieldsData[field.id] || ''}
                onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.id]: e.target.value })}
                placeholder={field.placeholder || 'أدخل التفاصيل...'}
                className="w-full border border-gray-200 rounded-xl p-3 text-xs text-gray-800 bg-gray-50/50 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          ))}

          {/* OPTION 6: Notes (If Enabled) */}
          {options.enableOfferNote && (
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <label className="block text-xs font-black text-gray-900">
                ملاحظات إضافية على العرض (اختياري)
              </label>
              <textarea
                rows={2}
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                placeholder="مثال: منتجي بحالة الوكالة ويشمل الضمان والكرتون الأصلي..."
                className="w-full border border-gray-200 rounded-xl p-3 text-xs text-gray-800 bg-gray-50/50 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex space-x-3 space-x-reverse pt-2">
            <button
              type="submit"
              disabled={options.enableProductSelection && !selectedOfferedListing && myActiveListings.length > 0}
              className={`flex-1 py-3 px-6 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                options.enableProductSelection && !selectedOfferedListing && myActiveListings.length > 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              إرسال طلب المقايضة إلى {targetListing.ownerName}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              إلغاء
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
