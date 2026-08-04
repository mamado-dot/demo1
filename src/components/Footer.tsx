import React from 'react';
import { useBarter } from '../context/BarterContext';
import { 
  ShieldCheck, 
  FileText, 
  Percent, 
  Lock
} from 'lucide-react';

interface FooterProps {
  isOwner?: boolean;
  onOpenAdmin?: () => void;
  onNavigateView: (view: 'all_items' | 'add_item' | 'my_offers' | 'terms' | 'privacy' | 'commission') => void;
}

export const Footer: React.FC<FooterProps> = ({ isOwner, onOpenAdmin, onNavigateView }) => {
  const { settings } = useBarter();

  if (settings.showFooter === false) {
    return null;
  }

  const bgTheme = settings.footerBgTheme || 'light';

  // Apply Theme Styling Classes
  let bgClass = 'bg-white border-t border-slate-200/90 text-slate-700';
  let titleClass = 'text-slate-900';
  let textClass = 'text-slate-500';
  let borderClass = 'border-slate-100';
  let linkHoverClass = 'hover:text-[#8c5332] text-slate-600';
  let cardClass = 'bg-slate-50 border-slate-200/80';

  if (bgTheme === 'dark') {
    bgClass = 'bg-[#18110b] border-t border-[#362417] text-slate-300';
    titleClass = 'text-white';
    textClass = 'text-slate-400';
    borderClass = 'border-[#2d1e13]';
    linkHoverClass = 'hover:text-amber-400 text-slate-300';
    cardClass = 'bg-[#231810] border-[#362417]';
  } else if (bgTheme === 'brown') {
    bgClass = 'bg-[#8c5332] text-amber-50';
    titleClass = 'text-white';
    textClass = 'text-amber-100/80';
    borderClass = 'border-white/10';
    linkHoverClass = 'hover:text-white text-amber-100';
    cardClass = 'bg-black/10 border-white/10';
  } else if (bgTheme === 'slate') {
    bgClass = 'bg-slate-900 border-t border-slate-800 text-slate-300';
    titleClass = 'text-white';
    textClass = 'text-slate-400';
    borderClass = 'border-slate-800';
    linkHoverClass = 'hover:text-amber-400 text-slate-300';
    cardClass = 'bg-slate-800/60 border-slate-700/80';
  }

  return (
    <footer className={`mt-16 py-10 ${bgClass} transition-colors dir-rtl font-['Cairo',sans-serif]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Footer Content: Policies ONLY */}
        <div className="space-y-3">
          <h4 className={`text-xs font-black uppercase tracking-wider ${titleClass} flex items-center gap-1.5`}>
            <ShieldCheck className="w-4 h-4 text-[#8c5332]" />
            <span>السياسات والعقود الرسمية</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {settings.showTermsLink !== false && (
              <button
                onClick={() => onNavigateView('terms')}
                className={`transition-colors cursor-pointer flex items-center gap-2 p-3 rounded-xl ${cardClass} hover:border-[#8c5332] text-right`}
              >
                <FileText className="w-4.5 h-4.5 text-[#8c5332] shrink-0" />
                <div>
                  <span className="block font-black text-xs">{settings.termsTitle || 'الشروط والأحكام'}</span>
                  <span className={`text-[10px] font-normal ${textClass}`}>ضوابط اتفاقيات المقايضة</span>
                </div>
              </button>
            )}

            {settings.showPrivacyLink !== false && (
              <button
                onClick={() => onNavigateView('privacy')}
                className={`transition-colors cursor-pointer flex items-center gap-2 p-3 rounded-xl ${cardClass} hover:border-[#8c5332] text-right`}
              >
                <Lock className="w-4.5 h-4.5 text-[#8c5332] shrink-0" />
                <div>
                  <span className="block font-black text-xs">{settings.privacyTitle || 'سياسة الخصوصية'}</span>
                  <span className={`text-[10px] font-normal ${textClass}`}>تشفير وحماية البيانات</span>
                </div>
              </button>
            )}

            {settings.showCommissionLink !== false && (
              <button
                onClick={() => onNavigateView('commission')}
                className={`transition-colors cursor-pointer flex items-center gap-2 p-3 rounded-xl ${cardClass} hover:border-[#8c5332] text-right`}
              >
                <Percent className="w-4.5 h-4.5 text-[#8c5332] shrink-0" />
                <div>
                  <span className="block font-black text-xs">{settings.commissionTitle || 'نسبة العمولة والرسوم'}</span>
                  <span className={`text-[10px] font-normal ${textClass}`}>({settings.barterCommissionRate ?? 2.5}%) رسوم التوثيق</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Rights Bar (الحقوق) */}
        {settings.showFooterRights && (
          <div className={`pt-4 border-t ${borderClass} text-center text-xs font-medium ${textClass}`}>
            {settings.footerCopyrightText || `جميع الحقوق محفوظة © ${new Date().getFullYear()} ${settings.siteName}`}
          </div>
        )}

      </div>
    </footer>
  );
};
