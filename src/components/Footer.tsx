import React from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeftRight, 
  Sparkles, 
  Heart,
  Globe,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { BrandConfig, CustomPage } from '../types';
import { Language, translations } from '../utils/translations';

interface FooterProps {
  brandConfig: BrandConfig;
  customPages: CustomPage[];
  language: Language;
  setActiveTab: (tab: string) => void;
  onSelectCustomPage: (page: CustomPage) => void;
}

export default function Footer({
  brandConfig,
  customPages,
  language,
  setActiveTab,
  onSelectCustomPage,
}: FooterProps) {
  const t = translations[language];

  // Default policies if no custom pages are created yet
  const defaultPolicies = [
    {
      id: 'default_terms',
      slug: 'terms',
      title: language === 'en' ? 'Terms of Use & Barter' : 'شروط الاستخدام والمقايضة',
      content: 'شروط وبنود استخدام منصة المقايضة الذكية، الالتزام بالشفافية والصدق في وصف السلع والخدمات.',
      isActive: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default_privacy',
      slug: 'privacy',
      title: language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية وأمان البيانات',
      content: 'نحن نلتزم بحماية خصوصية بيانات جميع المستخدمين والرسائل الخاصة في المنصة.',
      isActive: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default_trust',
      slug: 'trust',
      title: language === 'en' ? 'Safety & Reliability Guide' : 'دليل الأمان والموثوقية',
      content: 'نصائح المعاينة قبل المقايضة والتأكد من جودة المنتجات والخدمات المعروضة.',
      isActive: true,
      updatedAt: new Date().toISOString()
    }
  ];

  const activePages = customPages.filter(p => p.isActive).length > 0
    ? customPages.filter(p => p.isActive)
    : defaultPolicies;

  if (brandConfig.showFooter === false) {
    return null;
  }

  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-16 text-gray-700" id="standalone_footer">
      
      {/* Top Banner Accent */}
      {brandConfig.showFooterAccentBar !== false && (
        <div className="h-1.5 bg-gradient-to-r from-brand-600 via-amber-500 to-brand-700 w-full" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand Info & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 space-x-reverse cursor-pointer" onClick={() => setActiveTab('feed')}>
              <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-md shadow-brand-600/20">
                <span>{brandConfig.brandLogo || 'م'}</span>
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 leading-none">
                  {brandConfig.brandName || 'منصة المقايضة'}
                </h2>
                <span className="text-[10px] font-bold text-brand-700 block mt-1">
                  {brandConfig.brandTagline || 'مقايضة عادلة ومباشرة'}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {language === 'en'
                ? 'A modern barter platform empowering direct product and service exchanges without cash boundaries.'
                : 'منصة مقايضة ذكية تتيح لك مقايضة المنتجات والخدمات مباشرة وبشفافية تامة بدون قيود مالية.'}
            </p>

            <div className="flex items-center space-x-2 space-x-reverse pt-1 text-xs text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>مقايضات آمنة وموثوقة</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-gray-900 border-r-3 border-brand-600 pr-2.5">
              {language === 'en' ? 'Quick Navigation' : 'روابط سريعة'}
            </h3>
            <ul className="space-y-2 text-xs font-bold text-gray-600">
              <li>
                <button
                  onClick={() => { setActiveTab('feed'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-600 transition-colors cursor-pointer flex items-center space-x-1.5 space-x-reverse"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400" />
                  <span>{language === 'en' ? 'Explore Listings' : 'تصفح كافة العروض'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('my_swaps'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-600 transition-colors cursor-pointer flex items-center space-x-1.5 space-x-reverse"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400" />
                  <span>{language === 'en' ? 'Barter Offers' : 'عروض المقايضة المتاحة'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('add'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-600 transition-colors cursor-pointer flex items-center space-x-1.5 space-x-reverse text-brand-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>{language === 'en' ? '+ Post New Barter' : '+ إضافة عرض جديد'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('matching'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-600 transition-colors cursor-pointer flex items-center space-x-1.5 space-x-reverse"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'en' ? 'Smart Match Engine' : 'محرك المطابقة الذكية'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Standalone Policies & Terms */}
          {brandConfig.showFooterPagesLinks !== false && (
            <div className="space-y-3" id="footer_policies_column">
              <h3 className="text-xs font-black text-gray-900 border-r-3 border-brand-600 pr-2.5">
                {language === 'en' ? 'Policies & Terms' : 'السياسات والشروط'}
              </h3>
              <ul className="space-y-2 text-xs font-bold text-gray-600">
                {activePages.map((page) => (
                  <li key={page.id}>
                    <button
                      onClick={() => {
                        onSelectCustomPage(page);
                        setActiveTab('custom_page');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-brand-600 transition-colors cursor-pointer flex items-center space-x-1.5 space-x-reverse text-right"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{page.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4: Support & Community */}
          {brandConfig.showFooterSocialLinks !== false && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-gray-900 border-r-3 border-brand-600 pr-2.5">
                {language === 'en' ? 'Support & Contact' : 'الدعم والمساعدة'}
              </h3>
              <div className="space-y-2 text-xs font-medium text-gray-600">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{brandConfig.footerEmail || 'support@badel-platform.sa'}</span>
                </div>
                {brandConfig.footerPhone && (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                    <span dir="ltr">{brandConfig.footerPhone}</span>
                  </div>
                )}
                {brandConfig.footerWhatsapp && (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>واتساب: {brandConfig.footerWhatsapp}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Bar & Copyright */}
        {brandConfig.showCopyright !== false && (
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
            <p id="copyright_text_display" className="font-bold text-gray-700">
              {brandConfig.copyrightText || 'جميع الحقوق محفوظة © 2026 منصة المقايضة الذكية'}
            </p>

            <div className="flex items-center space-x-4 space-x-reverse text-xs font-bold text-gray-500">
              <span>منصة مقايضة مخصصة ومبنية بأحدث تقنيات الويب</span>
            </div>
          </div>
        )}

      </div>
    </footer>
  );
}
