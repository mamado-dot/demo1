import React from 'react';
import { BarterContract } from '../types';
import { useBarter } from '../context/BarterContext';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ArrowLeftRight, 
  ArrowRight,
  Banknote, 
  MapPin, 
  Calendar, 
  Lock, 
  Download,
  QrCode
} from 'lucide-react';

interface EContractModalProps {
  contract: BarterContract | null;
  onClose: () => void;
}

export const EContractModal: React.FC<EContractModalProps> = ({ contract, onClose }) => {
  if (!contract) return null;

  const { settings } = useBarter();

  const handlePrint = () => {
    window.print();
  };

  // Determine cash payer & receiver details
  let payerName = contract.partyA.name;
  let payerRole = 'الطرف الأول';
  let receiverName = contract.partyB.name;
  let receiverRole = 'الطرف الثاني';

  if (contract.cashPayerUserId === contract.partyB.userId) {
    payerName = contract.partyB.name;
    payerRole = 'الطرف الثاني';
    receiverName = contract.partyA.name;
    receiverRole = 'الطرف الأول';
  } else if (contract.cashPayerUserId === contract.partyA.userId) {
    payerName = contract.partyA.name;
    payerRole = 'الطرف الأول';
    receiverName = contract.partyB.name;
    receiverRole = 'الطرف الثاني';
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Control Bar (Non-Printable) */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            title="العودة"
            aria-label="العودة"
            className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">العقد الإلكتروني الموثق</h1>
            <p className="text-xs text-slate-400 font-medium">وثيقة وتعهد رسمي موثق بين الطرفين</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/40"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / تحميل عقد PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white max-w-4xl mx-auto rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8" id="printable-contract">

          
          {/* OFFICIAL HEADER & STAMP */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">{settings.siteName}</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">{settings.siteDescription}</p>
              <p className="text-[11px] font-bold text-emerald-700">سجل وثيقة رقمية موثوقة ومحمية</p>
            </div>

            {/* Contract Meta & QR Code */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-right space-y-0.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase">رقم العقد الموثق:</div>
                <div className="text-xs font-black text-slate-900 font-mono tracking-wide">{contract.contractNumber}</div>
                <div className="text-[10px] font-semibold text-slate-500">تاريخ الإصدار: {contract.issuedAt}</div>
                <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] mt-1">
                  حالة العقد: {contract.status}
                </div>
              </div>

              {/* QR Code Graphic Simulation */}
              <div className="w-16 h-16 bg-white p-1.5 rounded-xl border border-slate-300 flex flex-col items-center justify-center text-slate-800 shrink-0 shadow-xs">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
            </div>

          </div>

          {/* PREAMBLE */}
          {settings.showContractPreamble && settings.contractPreamble && (
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 leading-relaxed">
              <h3 className="font-bold text-slate-900 text-sm mb-1">ديباجة اتفاقية التبادل:</h3>
              <p>{settings.contractPreamble}</p>
            </div>
          )}

          {/* PARTIES INFORMATION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Party A Box */}
            <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  الطرف الأول (المقايِض)
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p><strong className="text-slate-500 font-medium">الاسم الكامل:</strong> <span className="font-bold text-slate-900">{contract.partyA.name}</span></p>
                <p><strong className="text-slate-500 font-medium">المدينة والجوال:</strong> <span className="font-semibold text-slate-800">{contract.partyA.city} • {contract.partyA.phone}</span></p>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400">السلعة المسلمة منه:</p>
                  <p className="font-bold text-slate-900">{contract.partyA.itemTitle}</p>
                </div>
              </div>
            </div>

            {/* Party B Box */}
            <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                  الطرف الثاني (المقايِض)
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p><strong className="text-slate-500 font-medium">الاسم الكامل:</strong> <span className="font-bold text-slate-900">{contract.partyB.name}</span></p>
                <p><strong className="text-slate-500 font-medium">المدينة والجوال:</strong> <span className="font-semibold text-slate-800">{contract.partyB.city} • {contract.partyB.phone}</span></p>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400">السلعة المسلمة منه:</p>
                  <p className="font-bold text-slate-900">{contract.partyB.itemTitle}</p>
                </div>
              </div>
            </div>

          </div>

          {/* CASH DIFFERENCE SETTLEMENT DETAILS */}
          {contract.cashDifferenceAmount > 0 && (
            <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200/90 space-y-2">
              <div className="flex items-center gap-2 border-b border-emerald-200/60 pb-2">
                <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="font-extrabold text-xs text-emerald-950">
                  التصفية المالية التعويضية (فارق السعر النقدي):
                </h4>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                وتعهد <strong className="text-emerald-900 font-black">{payerRole} ({payerName})</strong> بدفع مبلغ <strong className="text-emerald-900 font-black px-1.5 py-0.5 rounded bg-white border border-emerald-300 shadow-2xs">{contract.cashDifferenceAmount} ريال سعودي</strong> لطرف <strong className="text-teal-900 font-black">{receiverRole} ({receiverName})</strong> لتوازن تكافؤ هذه المقايضة والوفاء بالتزامات العقد.
              </p>
            </div>
          )}

          {/* CONTRACT TERMS & CONDITIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              شروط وأحكام العقد القانونية المعتمدة:
            </h3>

            <ol className="list-decimal list-inside space-y-2 text-xs font-semibold text-slate-700 leading-relaxed">
              {settings.showContractInspectionClause && settings.contractInspectionClause && (
                <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-extrabold text-slate-900 ml-1">بند الفحص والمعاينة:</span>
                  {settings.contractInspectionClause}
                </li>
              )}
              {settings.showContractCashClause && settings.contractCashClause && (
                <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-extrabold text-slate-900 ml-1">بند التصفية المالية:</span>
                  {settings.contractCashClause}
                </li>
              )}
              {settings.showContractIdentityClause && settings.contractIdentityClause && (
                <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-extrabold text-slate-900 ml-1">بند التوقيع الرقمي:</span>
                  {settings.contractIdentityClause}
                </li>
              )}
              {settings.showContractPenaltyClause && settings.contractPenaltyClause && (
                <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-extrabold text-slate-900 ml-1">بند الجزاءات والإخلال:</span>
                  {settings.contractPenaltyClause}
                </li>
              )}
              {settings.showContractDisputeClause && settings.contractDisputeClause && (
                <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="font-extrabold text-slate-900 ml-1">بند الاختصاص القضائي:</span>
                  {settings.contractDisputeClause}
                </li>
              )}
              {contract.termsAndConditions.map((term, idx) => (
                <li key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  {term}
                </li>
              ))}
            </ol>
          </div>

          {/* DIGITAL SIGNATURES & STAMP FOOTER */}
          <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-6 text-center">
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400">توقيع واعتماد الطرف الأول:</div>
              <div className="text-sm font-extrabold text-slate-900">{contract.partyA.name}</div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold">DIGITAL-SIGN-PASS: VERIFIED ✓</div>
              <div className="text-[9px] text-slate-400">{contract.partyA.signatureDate}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400">توقيع واعتماد الطرف الثاني:</div>
              <div className="text-sm font-extrabold text-slate-900">{contract.partyB.name}</div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold">DIGITAL-SIGN-PASS: VERIFIED ✓</div>
              <div className="text-[9px] text-slate-400">{contract.partyB.signatureDate}</div>
            </div>

          </div>

          <div className="text-center text-[10px] text-slate-400 font-medium">
            تمت طباعة واستخراج هذا العقد الإلكتروني عبر منصة {settings.siteName} • جميع الحقوق محفوظة © 2026
          </div>

      </div>

    </div>
  );
};
