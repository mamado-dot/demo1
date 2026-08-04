import React from 'react';
import { useBarter } from '../context/BarterContext';
import { 
  ShieldCheck, 
  FileText, 
  Percent, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  PhoneCall,
  Mail,
  Lock,
  Scale
} from 'lucide-react';

interface PolicyPageProps {
  type: 'terms' | 'privacy' | 'commission';
  onClose: () => void;
  onNavigatePolicy?: (type: 'terms' | 'privacy' | 'commission') => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type, onClose, onNavigatePolicy }) => {
  const { settings } = useBarter();

  // Pick Page Config Based on Type
  let title = '';
  let icon = <FileText className="w-8 h-8 text-[#8c5332]" />;
  let badgeText = '';
  let content = '';

  if (type === 'terms') {
    title = settings.termsTitle || 'الشروط والأحكام الاستخدام';
    icon = <Scale className="w-8 h-8 text-[#8c5332]" />;
    badgeText = 'وثيقة الاستخدام والاتفاقية الرقمية المعتمدة';
    content = settings.termsContent || 'لا يوجد محتوى حالي للشروط والأحكام.';
  } else if (type === 'privacy') {
    title = settings.privacyTitle || 'سياسة الخصوصية وسرية البيانات';
    icon = <Lock className="w-8 h-8 text-[#8c5332]" />;
    badgeText = 'حماية وتشفير بيانات مستخدمي منصة مقايضة';
    content = settings.privacyContent || 'لا يوجد محتوى حالي لسياسة الخصوصية.';
  } else if (type === 'commission') {
    title = settings.commissionTitle || 'نسبة العمولة ورسوم الخدمة';
    icon = <Percent className="w-8 h-8 text-[#8c5332]" />;
    badgeText = 'شفافية الرسوم ونسبة التوثيق الإلكتروني';
    content = settings.commissionContent || 'لا يوجد محتوى حالي لسياسة العمولة.';
  }

  // Split content into structured sections by double newline or numbered items
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 pb-16 dir-rtl font-['Cairo',sans-serif]">
      
      {/* Top Simple Navigation Link */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#8c5332] hover:text-white hover:border-[#8c5332] transition-all cursor-pointer flex items-center gap-2 text-xs font-bold shadow-2xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#8c5332]/10 text-[#8c5332] border border-[#8c5332]/20">
          <ShieldCheck className="w-4 h-4" />
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Structured Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Page Header Title */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-[#f5eee6] text-[#8c5332] flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              آخر تحديث معتمد للمستند: {new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
        
        {type === 'commission' && (
          <div className="bg-amber-50/80 border border-amber-200/90 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shrink-0">
                {settings.barterCommissionRate ?? 2.5}%
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-900">نسبة اقتطاع العمولة الرسمية</h4>
                <p className="text-xs text-amber-800 font-medium">
                  نسبة توثيق وإصدار عقد المقايضة الإلكتروني هي {settings.barterCommissionRate ?? 2.5}% فقط من قيمة الصفقة.
                </p>
              </div>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-amber-800 border border-amber-300 shrink-0">
              استرجاع كامل في حال إلغاء الصفقة ✓
            </div>
          </div>
        )}

        {/* Formatted Content Blocks */}
        <div className="space-y-6 text-slate-800 leading-relaxed text-sm">
          {paragraphs.map((block, idx) => {
            const lines = block.split('\n');
            const heading = lines[0];
            const bodyLines = lines.slice(1);

            return (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2 hover:bg-white hover:shadow-xs transition-all">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#8c5332] shrink-0" />
                  <span>{heading}</span>
                </h3>
                {bodyLines.length > 0 ? (
                  <div className="text-xs text-slate-700 font-medium space-y-1.5 pr-7 whitespace-pre-line leading-6">
                    {bodyLines.join('\n')}
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 font-medium pr-7 whitespace-pre-line leading-6">
                    {heading}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Callout */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#8c5332]" />
            <span>هل لديك أي استفسار حول {title}؟</span>
          </div>

          <div className="flex items-center gap-3">
            {settings.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#8c5332]" />
                <span>{settings.contactEmail}</span>
              </a>
            )}
            {settings.contactPhone && (
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#8c5332] text-white hover:bg-[#734123] transition-all cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{settings.contactPhone}</span>
              </a>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
