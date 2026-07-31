import React from 'react';
import { ShieldCheck, FileText, Printer, CheckCircle2, X, Download, BadgeCheck } from 'lucide-react';
import { Chat, User, Listing, ContractSettings } from '../types';

interface DigitalContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  currentUser: User | null;
  listings?: Listing[];
  contractSettings?: ContractSettings;
}

const DEFAULT_CONTRACT: ContractSettings = {
  contractTitle: 'عقد مقايضة وتنازل رسمية',
  contractSubtitle: 'منصة قايض السعودية للمقايضة المباشرة',
  documentBadgeText: 'وثيقة رسمية',
  party1Header: 'أولاً: طرفا الاتفاقية الموثقة',
  party1Label: 'الطرف الأول (صاحب السلعة الأولى)',
  party2Label: 'الطرف الثاني (صاحب السلعة الثانية)',
  detailsHeader: 'ثانياً: تفاصيل محل المقايضة',
  termsHeader: 'ثالثاً: الشروط والأحكام والإقرار القانوني',
  legalDeclaration: 'يقر الطرفان بصحة البيانات والمعلومات الواردة أعلاه وبسلامة الملكية الشرعية للسلع والمواد المقايَض عليها، وقد تم تأكيد هذه المقايضة إلكترونياً من كلا الحسابين الموثقين عبر منصة قايض.',
  sealText: 'توثيق إلكتروني معتمد',
  sealSubtext: 'بصمة العقد الرقمية: VERIFIED-HASH-2026',
  sealImageUrl: '',
  showQrCode: false,
  showInspectionTerms: true,
  enableIdentityVerification: true,
  requireNafathForContract: true,
  customClauses: [
    {
      id: 'clause_1',
      title: 'الملكية والسلامة الشرعية',
      text: 'يتعهد الطرفان بملكية المواد والسلع المقايَض عليها وعدم وجود أي حقوق للغير عليها.',
      isEnabled: true
    },
    {
      id: 'clause_2',
      title: 'شروط المعاينة والفحص',
      text: 'يلتزم الطرفان بفحص السلع عند الاستلام قبل التنازل النهائي.',
      isEnabled: true
    }
  ]
};

export default function DigitalContractModal({
  isOpen,
  onClose,
  chat,
  currentUser,
  listings = [],
  contractSettings
}: DigitalContractModalProps) {
  if (!isOpen) return null;

  const cfg = contractSettings || DEFAULT_CONTRACT;

  const targetListing = listings.find(l => l.id === chat.listingId);
  const offeredListing = listings.find(l => l.id === chat.offeredListingId);

  const contractNo = chat.contractNumber || `QAYD-2026-${chat.id.replace(/\D/g, '').slice(-6) || '883921'}`;
  const contractTimestamp = chat.contractDate || new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const targetTitle = chat.listingTitle || targetListing?.title || 'السلعة الأولى';
  const offeredTitle = chat.offeredListingTitle || offeredListing?.title || 'السلعة الثانية';

  const isTargetService = targetListing?.type === 'خدمة';
  const isOfferedService = offeredListing?.type === 'خدمة';

  const handlePrintOrPdf = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 text-right" id="digital_contract_view">
      
      {/* Top Header / Page Navigation */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs print:hidden">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-[#786142] text-white flex items-center justify-center font-black">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900 text-base sm:text-lg">العقد الإلكتروني الموثق للمقايضة</h2>
            <p className="text-xs text-gray-500 font-medium">وثيقة اتفاق ملزمة وموثقة رقمياً</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="flex items-center space-x-1.5 space-x-reverse bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <span>العودة</span>
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* PRINTABLE CONTRACT DOCUMENT BODY */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 text-right border border-gray-200 shadow-xs space-y-6 print:shadow-none print:border-none print:p-0">
        <div className="space-y-6 bg-gradient-to-b from-amber-50/20 via-white to-white p-6 sm:p-8 rounded-2xl border border-amber-200/80 shadow-xs relative">
          
          {/* Watermark Seal */}
          <div className="absolute top-6 left-6 opacity-10 pointer-events-none select-none">
            <ShieldCheck className="w-32 h-32 text-[#786142]" />
          </div>

          {/* Official Document Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#786142]/30 pb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{cfg.contractTitle || 'عقد مقايضة وتنازل رسمية'}</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{cfg.contractSubtitle || 'منصة قايض السعودية للمقايضة المباشرة'}</p>
            </div>

            <div className="text-right sm:text-left bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
              <p className="text-[10px] text-gray-400 font-bold uppercase">رقم العقد الموثق</p>
              <p className="text-xs font-black font-mono text-[#786142]">{contractNo}</p>
              <p className="text-[10px] text-gray-400 mt-1">{contractTimestamp}</p>
            </div>
          </div>

          {/* SECTION 1: الطرفان المتعاقدان */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-900 border-r-4 border-[#786142] pr-2 uppercase tracking-wide">
              {cfg.party1Header || 'أولاً: طرفا الاتفاقية الموثقة'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Party 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">{cfg.party1Label || 'الطرف الأول (صاحب السلعة الأولى)'}</span>
                  {cfg.enableIdentityVerification !== false && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <BadgeCheck className="w-3 h-3 text-emerald-600" />
                      <span>هوية موثقة</span>
                    </span>
                  )}
                </div>
                <p className="font-extrabold text-gray-900 text-sm">{chat.otherUser.name}</p>
                <p className="text-gray-500 text-[11px]">المدينة: {chat.otherUser.city || 'الرياض'}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold pt-1 border-t border-gray-100">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>تم التأكيد والتوقيع الرقمي</span>
                </div>
              </div>

              {/* Party 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">{cfg.party2Label || 'الطرف الثاني (صاحب السلعة الثانية)'}</span>
                  {cfg.enableIdentityVerification !== false && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <BadgeCheck className="w-3 h-3 text-emerald-600" />
                      <span>هوية موثقة</span>
                    </span>
                  )}
                </div>
                <p className="font-extrabold text-gray-900 text-sm">{currentUser?.name || 'مستخدم المقايضة'}</p>
                <p className="text-gray-500 text-[11px]">المدينة: {currentUser?.city || 'الرياض'}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold pt-1 border-t border-gray-100">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>تم التأكيد والتوقيع الرقمي</span>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: تفاصيل محل المقايضة */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-900 border-r-4 border-[#786142] pr-2 uppercase tracking-wide">
              {cfg.detailsHeader || 'ثانياً: تفاصيل محل المقايضة'}
            </h4>

            <div className="bg-white p-4 rounded-xl border border-gray-200 divide-y divide-gray-100 text-xs space-y-3">
              
              <div className="flex items-center justify-between pb-2">
                <div>
                  <span className="text-gray-400 text-[11px] block">
                    {isTargetService ? 'الخدمة الأولى:' : 'السلعة الأولى:'}
                  </span>
                  <span className="font-bold text-gray-900 text-sm">{targetTitle}</span>
                </div>
                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-bold">الطرف الأول</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-gray-400 text-[11px] block">
                    {isOfferedService ? 'الخدمة الثانية (المقايَض بها):' : 'السلعة الثانية (المقايَض بها):'}
                  </span>
                  <span className="font-bold text-emerald-800 text-sm">{offeredTitle}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-bold">الطرف الثاني</span>
              </div>

              {/* Cash Difference */}
              <div className="pt-2">
                <span className="text-gray-400 text-[11px] block">التسوية المالية والفارق النقدي:</span>
                <p className="font-extrabold text-amber-900 mt-0.5">
                  {chat.cashDifferenceType === 'offerer_pays' && `التزام الطرف الثاني بدفع مبلغ فارق قدره (${chat.cashDifferenceAmount || 0} ريال) للطرف الأول.`}
                  {chat.cashDifferenceType === 'offerer_requests' && `التزام الطرف الأول بدفع مبلغ فارق قدره (${chat.cashDifferenceAmount || 0} ريال) للطرف الثاني.`}
                  {(!chat.cashDifferenceType || chat.cashDifferenceType === 'none') && 'مقايضة رأس برأس بدون أي فارق نقدي.'}
                </p>
              </div>

              {/* Logistics */}
              {(cfg.showInspectionTerms !== false) && (chat.deliveryLocation || chat.deliveryMethod || chat.requiresInspection) && (
                <div className="pt-2 text-[11px] text-gray-600 space-y-1">
                  <span className="text-gray-400 block">شروط التسليم والمعاينة:</span>
                  {chat.deliveryLocation && <p>• مكان التسليم المعتمد: {chat.deliveryLocation}</p>}
                  {chat.requiresInspection && <p>• تشترط هذه العملية المعاينة والفحص الميداني قبل الاستلام النهائي.</p>}
                </div>
              )}

            </div>
          </div>

          {/* SECTION 3: الشروط والأحكام والإقرار */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 space-y-2">
            <h5 className="font-extrabold text-xs text-amber-900">{cfg.termsHeader || 'ثالثاً: الشروط والأحكام والإقرار القانوني'}</h5>
            <p className="leading-relaxed">
              {cfg.legalDeclaration || 'يقر الطرفان بصحة البيانات والمعلومات الواردة أعلاه وبسلامة الملكية الشرعية للسلع والمواد المقايَض عليها، وقد تم تأكيد هذه المقايضة إلكترونياً من كلا الحسابين الموثقين عبر منصة قايض.'}
            </p>

            {/* Custom Clauses */}
            {cfg.customClauses && cfg.customClauses.filter(c => c.isEnabled).length > 0 && (
              <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
                <p className="font-bold text-amber-900 text-[11px]">بنود العقد المخصصة:</p>
                {cfg.customClauses.filter(c => c.isEnabled).map((clause, idx) => (
                  <div key={clause.id || idx} className="bg-white/80 p-2 rounded-lg border border-amber-200/50">
                    <span className="font-bold text-amber-900 text-[11px] block">{idx + 1}. {clause.title}</span>
                    <span className="text-[10px] text-gray-700">{clause.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 print:hidden">
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={handlePrintOrPdf}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center space-x-1.5 space-x-reverse"
            >
              <Download className="w-4 h-4" />
              <span>حفظ</span>
            </button>
            <button
              onClick={handlePrintOrPdf}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center space-x-1.5 space-x-reverse"
            >
              <Printer className="w-4 h-4 text-gray-700" />
              <span>طباعة</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            العودة
          </button>
        </div>

      </div>
    </div>
  );
}


