import React, { useState, useEffect } from 'react';
import { useBarter } from '../context/BarterContext';
import { BarterContract, CategoryName, User, FeatureBox, UserMembershipTier, UserReview } from '../types';
import { 
  LayoutDashboard, 
  Settings, 
  Layers, 
  Package, 
  FileText, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  ArrowRight,
  SlidersHorizontal, 
  Banknote, 
  ShieldCheck, 
  Save,
  PlusCircle,
  Palette,
  Eye,
  Globe,
  Mail,
  Phone,
  FileCheck2,
  BadgeCheck,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  HelpCircle,
  FileEdit,
  UserCheck,
  Building,
  Upload,
  Code2,
  Terminal,
  ListPlus,
  Star,
  Search,
  Shield,
  UserCog
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onViewContract: (contract: BarterContract) => void;
  onViewUserProfile?: (userId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onViewContract, onViewUserProfile }) => {
  const { 
    currentUser,
    settings, 
    updateSettings, 
    categories, 
    addCategory, 
    deleteCategory, 
    items, 
    updateItem, 
    deleteItem, 
    contracts, 
    adminDeleteContract,
    adminUpdateContract,
    users,
    adminUpdateUser,
    adminDeleteUser,
    adminAddUser,
    reviews,
    adminDeleteReview,
    adminUpdateReview
  } = useBarter();

  const isOwner = currentUser?.email?.toLowerCase() === 'crazyretiree@gmail.com';

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-[#1c130d] flex items-center justify-center p-4 dir-rtl">
        <div className="p-8 bg-[#2b1c14] border border-[#3b271c] rounded-3xl text-center max-w-md w-full space-y-4 shadow-2xl">
          <ShieldCheck className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-black text-white">غير مصرح لك بدخول لوحة التحكم</h3>
          <p className="text-xs text-slate-300">
            عذراً، لوحة تحكم المنصة مخصصة حصرياً لمالك المنصة (crazyretiree@gmail.com).
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'ui_header_footer' | 'add_item_settings' | 'contract_clauses' | 'users' | 'reviews' | 'categories' | 'items' | 'contracts'>('ui_header_footer');

  // Search and modal states for Users and Reviews
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);

  // Notification Toast
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // --- 1. Header & Master Toggles ---
  const [showHeader, setShowHeader] = useState(settings.showHeader ?? true);
  const [showFooter, setShowFooter] = useState(settings.showFooter ?? true);

  // --- Theme & Appearance ---
  const [themeColor, setThemeColor] = useState<'brown' | 'indigo' | 'emerald' | 'blue' | 'slate' | 'amber' | 'rose' | 'dark'>(settings.themeColor || 'brown');

  // --- Product Limit Settings ---
  const [homeItemsLimit, setHomeItemsLimit] = useState<number>(settings.homeItemsLimit ?? 6);

  // --- Feature Boxes Settings ---
  const [showFeatureBoxes, setShowFeatureBoxes] = useState(settings.showFeatureBoxes ?? true);
  const [featureBoxes, setFeatureBoxes] = useState<FeatureBox[]>(
    settings.featureBoxes || [
      { id: 'fb_1', title: 'عقود إلكترونية رسمية موثقة', description: 'تولد المنصة تلقائياً عقداً رسمياً برقم تسلسلي ورمز QR يحفظ حقوق الطرفين وفوارق المبالغ النقدية.', icon: 'FileCheck2' },
      { id: 'fb_2', title: 'مهلة المعاينة والفحص المباشر', description: 'فترة معاينة لمدة 3 أيام عمل من تاريخ استلام السلعة لضمان سلامة وصف وشروط المقايضة.', icon: 'ShieldCheck' },
      { id: 'fb_3', title: 'تبادل مباشر وبدون عمولات خفية', description: 'تصفح كافة المنتجات مجاناً، أضف عرضك، وتواصل مع أصحاب السلع بشرعية وأمان تام.', icon: 'ArrowLeftRight' }
    ]
  );

  // --- Header & Basic Site Settings ---
  const [siteName, setSiteName] = useState(settings.siteName || 'مقايضة');
  const [siteDescription, setSiteDescription] = useState(settings.siteDescription || '');
  const [showHeaderTopNotice, setShowHeaderTopNotice] = useState(settings.showHeaderTopNotice ?? false);
  const [headerNotice, setHeaderNotice] = useState(settings.headerNotice || 'أهلاً بك في منصة مقايضة - جميع التبادلات محمية بعقود إلكترونية رسمية مع فترة فحص ومعاينة');
  const [showHeaderLogo, setShowHeaderLogo] = useState(settings.showHeaderLogo ?? true);
  const [showHeaderDescription, setShowHeaderDescription] = useState(settings.showHeaderDescription ?? true);
  const [showHeaderSearch, setShowHeaderSearch] = useState(settings.showHeaderSearch ?? true);
  const [showHeaderCityFilter, setShowHeaderCityFilter] = useState(settings.showHeaderCityFilter ?? true);
  const [showHeaderAddItemBtn, setShowHeaderAddItemBtn] = useState(settings.showHeaderAddItemBtn ?? true);
  const [showHeaderContractsBtn, setShowHeaderContractsBtn] = useState(settings.showHeaderContractsBtn ?? true);
  const [showHeaderOffersBtn, setShowHeaderOffersBtn] = useState(settings.showHeaderOffersBtn ?? true);
  const [showHeaderUserSwitcher, setShowHeaderUserSwitcher] = useState(settings.showHeaderUserSwitcher ?? true);
  const [showHeaderAdminBtn, setShowHeaderAdminBtn] = useState(settings.showHeaderAdminBtn ?? true);

  // --- Hero Banner Settings ---
  const [showHeroBanner, setShowHeroBanner] = useState(settings.showHeroBanner ?? true);
  const [heroBadgeText, setHeroBadgeText] = useState(settings.heroBadgeText || 'منصة المقايضة الأولى بالعقود الإلكترونية الموثقة');
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || 'اعرض سلعتك.. واطلب البديل واستخرج عقداً إلكترونياً معتمداً');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || 'تبادل آمن ومباشر للمقتنيات والأجهزة مع فترة معاينة وفحص');
  const [showHeroSteps, setShowHeroSteps] = useState(settings.showHeroSteps ?? true);
  const [showHeroImage, setShowHeroImage] = useState(settings.showHeroImage ?? true);
  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl || 'https://images.unsplash.com/photo-1556742049-0a670fc0a727?auto=format&fit=crop&q=80&w=800');

  // --- Product Grid Display Settings ---
  const [expandProductGridWidth, setExpandProductGridWidth] = useState(settings.expandProductGridWidth ?? false);
  const [productGridCols, setProductGridCols] = useState<'3' | '4' | '5' | '6'>(settings.productGridCols || '4');

  // --- Footer & Legal Policy Settings ---
  const [showFooterLogo, setShowFooterLogo] = useState(settings.showFooterLogo ?? true);
  const [footerText, setFooterText] = useState(settings.footerText || 'منصة مقايضة الرائدة لتبادل المقتنيات والأجهزة الذكية بالعقود الإلكترونية الموثقة.');
  const [footerDescription, setFooterDescription] = useState(settings.footerDescription || 'أول منصة سعودية متخصصة في تنظيم عمليات المقايضة التبادلية بين الأفراد والشركات مع توثيق العقود وتوفير ضمان المعاينة.');
  const [showFooterContacts, setShowFooterContacts] = useState(settings.showFooterContacts ?? true);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || 'support@moqayada.sa');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '920001234');
  const [contactWhatsapp, setContactWhatsapp] = useState(settings.contactWhatsapp || '966501234567');
  const [contactAddress, setContactAddress] = useState(settings.contactAddress || 'الرياض - طريق الملك فهد، برج المبتكرين');
  const [showFooterQuickLinks, setShowFooterQuickLinks] = useState(settings.showFooterQuickLinks ?? true);
  const [showFooterRights, setShowFooterRights] = useState(settings.showFooterRights ?? true);
  const [footerCopyrightText, setFooterCopyrightText] = useState(settings.footerCopyrightText || 'جميع الحقوق محفوظة © 2026 منصة مقايضة لتقنية المعلومات');
  const [footerBgTheme, setFooterBgTheme] = useState<'light' | 'dark' | 'brown' | 'slate'>(settings.footerBgTheme || 'light');

  // Social Links States
  const [showFooterSocialLinks, setShowFooterSocialLinks] = useState(settings.showFooterSocialLinks ?? true);
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl || 'https://x.com/moqayada');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || 'https://instagram.com/moqayada');
  const [whatsappUrl, setWhatsappUrl] = useState(settings.whatsappUrl || 'https://wa.me/966501234567');
  const [telegramUrl, setTelegramUrl] = useState(settings.telegramUrl || 'https://t.me/moqayada');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || 'https://youtube.com/moqayada');

  // Legal & Policy Pages States
  const [showFooterPolicyLinks, setShowFooterPolicyLinks] = useState(settings.showFooterPolicyLinks ?? true);

  const [showTermsLink, setShowTermsLink] = useState(settings.showTermsLink ?? true);
  const [termsTitle, setTermsTitle] = useState(settings.termsTitle || 'الشروط والأحكام الاستخدام');
  const [termsContent, setTermsContent] = useState(settings.termsContent || `1. الشروط العامة للاستخدام:
يُعد استخدام منصة (مقايضة) موافقة كاملة وغير مشروطة على كافة الشروط والأحكام المدونة في هذه الوثيقة.

2. الأهلية والمصداقية:
يشترط في مستخدم المنصة أن يكون بكامل الأهلية الشرعية والنظامية للتصرف، ويتحمل مسؤولية صحة البيانات الشخصية ووصف السلع المعروضة بدقة.

3. السلع المحظورة:
يُحظر عرض أو طلب مقايضة أي سلع غير مجازة شرعاً أو نظاماً داخل المملكة العربية السعودية.

4. العقود الإلكترونية الموثقة:
تعتبر العقود الإلكترونية الصادرة عبر المنصة سنداً رسمياً متفقاً عليه بين الطرفين فور التوقيع الرقمي.`);

  const [showPrivacyLink, setShowPrivacyLink] = useState(settings.showPrivacyLink ?? true);
  const [privacyTitle, setPrivacyTitle] = useState(settings.privacyTitle || 'سياسة الخصوصية وسرية البيانات');
  const [privacyContent, setPrivacyContent] = useState(settings.privacyContent || `1. جمع البيانات الشخصية:
نقوم بجمع البيانات الضرورية لتقديم خدمة المقايضة بأعلى درجات الأمان، وتشمل: الاسم، رقم الجوال، البريد الإلكتروني، والمدينة.

2. حماية وتشفير البيانات:
تلتزم منصة (مقايضة) بتطبيق أعلى معايير الأمان والتشفير لحماية بيانات المستخدمين الشخصية والعقود الصادرة من الوصول غير المصرح به.`);

  const [showCommissionLink, setShowCommissionLink] = useState(settings.showCommissionLink ?? true);
  const [commissionTitle, setCommissionTitle] = useState(settings.commissionTitle || 'نسبة العمولة ورسوم الخدمة');
  const [commissionContent, setCommissionContent] = useState(settings.commissionContent || `1. مجانية التصفح والعروض:
إن عملية التسجيل، تصفح المنتجات والسلع المعروضة، ونشر عروض المقايضة هي خدمة مجانية بالكامل 100%.

2. نسبة عمولة المنصة:
تتقاضى المنصة عمولة رمزية قدرها (2.5%) فقط من القيمة التقديرية للسلعة المقايض بها لتغطية تكاليف التوثيق الإلكتروني.

3. ضمان واسترجاع العمولة:
في حال إلغاء الصفقة خلال مهلة الفحص والمعاينة (3 أيام) تقوم المنصة بإعادة مبلغ العمولة لحساب المستخدم المتضرر.`);
  const [barterCommissionRate, setBarterCommissionRate] = useState<number>(settings.barterCommissionRate ?? 2.5);

  // --- 2. Modular E-Contract Clauses (Toggle + Edit Text Pattern) ---
  const [showContractPreamble, setShowContractPreamble] = useState(settings.showContractPreamble ?? true);
  const [contractPreamble, setContractPreamble] = useState(settings.contractPreamble || '');

  const [showContractInspectionClause, setShowContractInspectionClause] = useState(settings.showContractInspectionClause ?? true);
  const [contractInspectionClause, setContractInspectionClause] = useState(
    settings.contractInspectionClause || 'يحق لكلا الطرفين مهلة معاينة وفحص لمدة 3 أيام عمل تبدأ من تاريخ التسليم الفعلي للسلعة.'
  );

  const [showContractCashClause, setShowContractCashClause] = useState(settings.showContractCashClause ?? true);
  const [contractCashClause, setContractCashClause] = useState(
    settings.contractCashClause || 'في حال وجود فارق سعر نقدي متفق عليه، يلتزم الطرف المحرر عليه السداد بتأدية المبلغ المذكور عند التوقيع.'
  );

  const [showContractIdentityClause, setShowContractIdentityClause] = useState(settings.showContractIdentityClause ?? true);
  const [contractIdentityClause, setContractIdentityClause] = useState(
    settings.contractIdentityClause || 'يعتبر التوقيع الرقمي الصادر عبر المنصة بمثابة توثيق قانوني رسمي ملزم لكلا الطرفين.'
  );

  const [showContractPenaltyClause, setShowContractPenaltyClause] = useState(settings.showContractPenaltyClause ?? true);
  const [contractPenaltyClause, setContractPenaltyClause] = useState(
    settings.contractPenaltyClause || 'في حال التراجع غير المبرر بعد التوقيع أو تسليم سلعة تالفة تخالف الوصف، يحظر حساب المستخدم ويتحمل التعويضات.'
  );

  const [showContractDisputeClause, setShowContractDisputeClause] = useState(settings.showContractDisputeClause ?? true);
  const [contractDisputeClause, setContractDisputeClause] = useState(
    settings.contractDisputeClause || 'تختص الجهات القضائية والرسمية في المملكة العربية السعودية بالنظر في أي خلاف ينشأ عن تنفيذ بنود هذا العقد.'
  );

  const [customTerms, setCustomTerms] = useState<string[]>(settings.customContractTerms || []);
  const [newTermInput, setNewTermInput] = useState('');

  // Rules & Options
  const [autoActivateNewUsers, setAutoActivateNewUsers] = useState<boolean>(settings.autoActivateNewUsers ?? true);
  const [enableCashDifference, setEnableCashDifference] = useState(settings.enableCashDifference ?? true);
  const [maxCashDifferenceLimit, setMaxCashDifferenceLimit] = useState(settings.maxCashDifferenceLimit || 10000);
  const [enableInspectionGuarantee, setEnableInspectionGuarantee] = useState(settings.enableInspectionGuarantee ?? true);
  const [inspectionDays, setInspectionDays] = useState(settings.inspectionDays || 3);
  const [enableIdentityVerificationRequired, setEnableIdentityVerificationRequired] = useState(settings.enableIdentityVerificationRequired ?? true);

  // --- Add Item Form Field Settings States (Technical / Developer Schema) ---
  const [addItemShowTitle, setAddItemShowTitle] = useState(settings.addItemShowTitle ?? true);
  const [addItemTitleLabel, setAddItemTitleLabel] = useState(settings.addItemTitleLabel || 'عنوان السلعة *');
  const [addItemTitlePlaceholder, setAddItemTitlePlaceholder] = useState(settings.addItemTitlePlaceholder || 'مثلاً: كاميرا نيكون Z6، أو بلايستيشن 5...');
  const [addItemTitleRequired, setAddItemTitleRequired] = useState(settings.addItemTitleRequired ?? true);

  const [addItemShowCategory, setAddItemShowCategory] = useState(settings.addItemShowCategory ?? true);
  const [addItemCategoryLabel, setAddItemCategoryLabel] = useState(settings.addItemCategoryLabel || 'الفئة *');
  const [addItemCategoryRequired, setAddItemCategoryRequired] = useState(settings.addItemCategoryRequired ?? true);

  const [addItemShowCondition, setAddItemShowCondition] = useState(settings.addItemShowCondition ?? true);
  const [addItemConditionLabel, setAddItemConditionLabel] = useState(settings.addItemConditionLabel || 'حالة السلعة *');
  const [addItemConditionRequired, setAddItemConditionRequired] = useState(settings.addItemConditionRequired ?? true);
  const [addItemConditionOptions, setAddItemConditionOptions] = useState<string[]>(
    settings.addItemConditionOptions && settings.addItemConditionOptions.length > 0
      ? settings.addItemConditionOptions
      : ['جديد (بالكرتون)', 'ممتاز كالجديد', 'مستعمل بحالة جيدة', 'مستعمل مع خدوش بسيطة']
  );
  const [newConditionOptInput, setNewConditionOptInput] = useState('');

  const [addItemShowEstimatedValue, setAddItemShowEstimatedValue] = useState(settings.addItemShowEstimatedValue ?? true);
  const [addItemEstimatedValueLabel, setAddItemEstimatedValueLabel] = useState(settings.addItemEstimatedValueLabel || 'القيمة التقديرية (بالريال) (اختياري)');
  const [addItemEstimatedValueRequired, setAddItemEstimatedValueRequired] = useState(settings.addItemEstimatedValueRequired ?? false);

  const [addItemShowDescription, setAddItemShowDescription] = useState(settings.addItemShowDescription ?? true);
  const [addItemDescriptionLabel, setAddItemDescriptionLabel] = useState(settings.addItemDescriptionLabel || 'الوصف التفصيلي والملحقات *');
  const [addItemDescriptionPlaceholder, setAddItemDescriptionPlaceholder] = useState(settings.addItemDescriptionPlaceholder || 'اذكر حالة السلعة، مدة الاستخدام، الملحقات المتوفرة...');
  const [addItemDescriptionRequired, setAddItemDescriptionRequired] = useState(settings.addItemDescriptionRequired ?? true);

  const [addItemShowLocation, setAddItemShowLocation] = useState(settings.addItemShowLocation ?? true);
  const [addItemLocationLabel, setAddItemLocationLabel] = useState(settings.addItemLocationLabel || 'المدينة والمنطقة *');
  const [addItemLocationRequired, setAddItemLocationRequired] = useState(settings.addItemLocationRequired ?? true);

  const [addItemShowDeliveryPref, setAddItemShowDeliveryPref] = useState(settings.addItemShowDeliveryPref ?? true);
  const [addItemDeliveryPrefLabel, setAddItemDeliveryPrefLabel] = useState(settings.addItemDeliveryPrefLabel || 'تفضيل التسليم *');
  const [addItemDeliveryPrefRequired, setAddItemDeliveryPrefRequired] = useState(settings.addItemDeliveryPrefRequired ?? true);
  const [addItemDeliveryOptions, setAddItemDeliveryOptions] = useState<string[]>(
    settings.addItemDeliveryOptions && settings.addItemDeliveryOptions.length > 0
      ? settings.addItemDeliveryOptions
      : ['استلام يدوي', 'شحن بريدي', 'كلاهما يفي بالغرض']
  );
  const [newDeliveryOptInput, setNewDeliveryOptInput] = useState('');

  const [addItemShowDesiredItem, setAddItemShowDesiredItem] = useState(settings.addItemShowDesiredItem ?? true);
  const [addItemDesiredItemLabel, setAddItemDesiredItemLabel] = useState(settings.addItemDesiredItemLabel || 'وصف السلعة المطلوب مقايضتها بالمقابل *');
  const [addItemDesiredItemPlaceholder, setAddItemDesiredItemPlaceholder] = useState(settings.addItemDesiredItemPlaceholder || 'اكتب بشكل مبسط ماذا تطلب بالمقابل (مثلاً: أبحث عن جهاز آيباد برو أو كاميرا احترافية أو أي عرض مناسب)...');
  const [addItemDesiredItemRequired, setAddItemDesiredItemRequired] = useState(settings.addItemDesiredItemRequired ?? true);

  const [addItemShowCashDiffOption, setAddItemShowCashDiffOption] = useState(settings.addItemShowCashDiffOption ?? true);
  const [addItemCashDiffLabel, setAddItemCashDiffLabel] = useState(settings.addItemCashDiffLabel || 'أقبل دفع فارق / استلام فارق سعري');

  const [addItemShowImageUpload, setAddItemShowImageUpload] = useState(settings.addItemShowImageUpload ?? true);
  const [addItemImageUploadLabel, setAddItemImageUploadLabel] = useState(settings.addItemImageUploadLabel || 'رفع صور السلعة * (إجباري 3 صور على الأقل - بحد أقصى 5 صور)');
  const [addItemImageUploadRequired, setAddItemImageUploadRequired] = useState(settings.addItemImageUploadRequired ?? true);

  // --- 3. Categories State ---
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);

  // --- 4. User Edit State ---
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserCity, setNewUserCity] = useState('الرياض');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserVerified, setNewUserVerified] = useState(true);
  const [newUserIsActive, setNewUserIsActive] = useState(true);
  const [newUserMembershipTier, setNewUserMembershipTier] = useState<UserMembershipTier>('عضو عادي');

  // --- 5. Contract Edit State ---
  const [editingContract, setEditingContract] = useState<BarterContract | null>(null);

  // Sync settings whenever settings context changes
  useEffect(() => {
    if (settings) {
      setShowHeader(settings.showHeader ?? true);
      setShowFooter(settings.showFooter ?? true);
      setThemeColor(settings.themeColor || 'brown');
      setHomeItemsLimit(settings.homeItemsLimit || 12);
      setSiteName(settings.siteName || 'مقايضة');
      setSiteDescription(settings.siteDescription || 'منصة المقايضة والتبادل التجاري بالمملكة');
      setShowHeaderTopNotice(settings.showHeaderTopNotice ?? true);
      setHeaderNotice(settings.headerNotice || '');
      setShowHeaderLogo(settings.showHeaderLogo ?? true);
      setShowHeaderDescription(settings.showHeaderDescription ?? true);
      setShowHeaderSearch(settings.showHeaderSearch ?? true);
      setShowHeaderCityFilter(settings.showHeaderCityFilter ?? true);
      setShowHeaderAddItemBtn(settings.showHeaderAddItemBtn ?? true);
      setShowHeaderContractsBtn(settings.showHeaderContractsBtn ?? true);
      setShowHeaderOffersBtn(settings.showHeaderOffersBtn ?? true);
      setShowHeaderUserSwitcher(settings.showHeaderUserSwitcher ?? true);
      setShowHeaderAdminBtn(settings.showHeaderAdminBtn ?? true);
      setAutoActivateNewUsers(settings.autoActivateNewUsers ?? true);
    }
  }, [settings]);

  // Save Settings Function
  const handleSaveAllSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings({
      showHeader,
      showFooter,
      themeColor,
      homeItemsLimit,

      siteName,
      siteDescription,
      
      showHeaderTopNotice,
      headerNotice,
      showHeaderLogo,
      showHeaderDescription,
      showHeaderSearch,
      showHeaderCityFilter,
      showHeaderAddItemBtn,
      showHeaderContractsBtn,
      showHeaderOffersBtn,
      showHeaderUserSwitcher,
      showHeaderAdminBtn,

      showHeroBanner,
      heroBadgeText,
      heroTitle,
      heroSubtitle,
      showHeroSteps,
      showHeroImage,
      heroImageUrl,

      showFeatureBoxes,
      featureBoxes,

      expandProductGridWidth,
      productGridCols,

      showFooterLogo,
      footerText,
      footerDescription,
      showFooterContacts,
      contactEmail,
      contactPhone,
      contactWhatsapp,
      contactAddress,
      showFooterQuickLinks,
      showFooterRights,
      footerCopyrightText,
      footerBgTheme,

      showFooterSocialLinks,
      twitterUrl,
      instagramUrl,
      whatsappUrl,
      telegramUrl,
      youtubeUrl,

      showFooterPolicyLinks,
      showTermsLink,
      termsTitle,
      termsContent,

      showPrivacyLink,
      privacyTitle,
      privacyContent,

      showCommissionLink,
      commissionTitle,
      commissionContent,
      barterCommissionRate,

      showContractPreamble,
      contractPreamble,
      showContractInspectionClause,
      contractInspectionClause,
      showContractCashClause,
      contractCashClause,
      showContractIdentityClause,
      contractIdentityClause,
      showContractPenaltyClause,
      contractPenaltyClause,
      showContractDisputeClause,
      contractDisputeClause,

      customContractTerms: customTerms,

      autoActivateNewUsers,
      enableCashDifference,
      maxCashDifferenceLimit,
      enableInspectionGuarantee,
      inspectionDays,
      enableIdentityVerificationRequired,

      addItemShowTitle,
      addItemTitleLabel,
      addItemTitlePlaceholder,
      addItemTitleRequired,

      addItemShowCategory,
      addItemCategoryLabel,
      addItemCategoryRequired,

      addItemShowCondition,
      addItemConditionLabel,
      addItemConditionRequired,
      addItemConditionOptions,

      addItemShowEstimatedValue,
      addItemEstimatedValueLabel,
      addItemEstimatedValueRequired,

      addItemShowDescription,
      addItemDescriptionLabel,
      addItemDescriptionPlaceholder,
      addItemDescriptionRequired,

      addItemShowLocation,
      addItemLocationLabel,
      addItemLocationRequired,

      addItemShowDeliveryPref,
      addItemDeliveryPrefLabel,
      addItemDeliveryPrefRequired,
      addItemDeliveryOptions,

      addItemShowDesiredItem,
      addItemDesiredItemLabel,
      addItemDesiredItemPlaceholder,
      addItemDesiredItemRequired,

      addItemShowCashDiffOption,
      addItemCashDiffLabel,

      addItemShowImageUpload,
      addItemImageUploadLabel,
      addItemImageUploadRequired,
    });

    setSaveSuccessMsg('تم حفظ التغييرات والإعدادات المحددة بنجاح! ✓');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleAddTerm = () => {
    if (!newTermInput.trim()) return;
    setCustomTerms([...customTerms, newTermInput.trim()]);
    setNewTermInput('');
  };

  const handleRemoveTerm = (index: number) => {
    setCustomTerms(customTerms.filter((_, i) => i !== index));
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim() as CategoryName,
      icon: 'Package',
      description: newCatDesc.trim() || 'فئة مقايضة خاصة',
    });
    setNewCatName('');
    setNewCatDesc('');
    setShowAddCatModal(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    adminAddUser({
      name: newUserName.trim(),
      city: newUserCity,
      phone: newUserPhone || '0500000000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      verified: newUserVerified,
      rating: 5.0,
      completedBartersCount: 0,
      isActive: newUserIsActive,
      membershipTier: newUserMembershipTier
    });
    setNewUserName('');
    setNewUserPhone('');
    setShowAddUserModal(false);
  };

  const handleSaveContractEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContract) return;
    adminUpdateContract(editingContract.id, editingContract);
    setEditingContract(null);
    setSaveSuccessMsg('تم تحديث العقد الإلكتروني بنجاح! ✓');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="bg-white w-full rounded-3xl shadow-xs border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[700px] relative">

        {/* RIGHT SIDEBAR MENU */}
        <div className="w-full md:w-72 lg:w-80 bg-slate-100/90 border-b md:border-b-0 md:border-l border-slate-200 p-4 sm:p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            
            {/* Sidebar Title & Return Button */}
            <div className="px-2 py-1 border-b border-slate-200/80 pb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8c5332]" />
                  <span>خيارات لوحة التحكم</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">التحكم وإدارة المنصة</p>
              </div>
              <button
                onClick={onClose}
                title="العودة للرئيسية"
                aria-label="العودة للرئيسية"
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4 text-[#8c5332]" />
              </button>
            </div>

            {/* Vertical Options List */}
            <div className="space-y-1.5">
              
              <button
                onClick={() => setActiveTab('ui_header_footer')}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'ui_header_footer'
                    ? 'bg-[#8c5332] text-white shadow-md shadow-[#8c5332]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className={`w-4 h-4 ${activeTab === 'ui_header_footer' ? 'text-white' : 'text-[#8c5332]'}`} />
                  <span>خيار عرض المنصة</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('add_item_settings')}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'add_item_settings'
                    ? 'bg-[#8c5332] text-white shadow-md shadow-[#8c5332]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className={`w-4 h-4 ${activeTab === 'add_item_settings' ? 'text-white' : 'text-[#8c5332]'}`} />
                  <span>إعدادات إضافة السلع</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('contract_clauses')}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'contract_clauses'
                    ? 'bg-[#8c5332] text-white shadow-md shadow-[#8c5332]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileEdit className={`w-4 h-4 ${activeTab === 'contract_clauses' ? 'text-white' : 'text-[#8c5332]'}`} />
                  <span>حقول وبنود العقد</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#8c5332] text-white shadow-md shadow-[#8c5332]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-white' : 'text-[#8c5332]'}`} />
                  <span>إدارة الأعضاء</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-[#8c5332] text-white shadow-md shadow-[#8c5332]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className={`w-4 h-4 ${activeTab === 'reviews' ? 'text-white' : 'text-[#8c5332]'}`} />
                  <span>إدارة التقييمات والمراجعات</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {reviews.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-[#8c5332] text-white shadow-md shadow-[#8c5332]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className={`w-4 h-4 ${activeTab === 'categories' ? 'text-white' : 'text-[#8c5332]'}`} />
                  <span>إدارة الفئات</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'categories' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {categories.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('items')}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'items'
                    ? 'bg-[#8c5332] text-white shadow-md shadow-[#8c5332]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className={`w-4 h-4 ${activeTab === 'items' ? 'text-white' : 'text-[#8c5332]'}`} />
                  <span>السلع والمنتجات</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'items' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {items.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('contracts')}
                className={`w-full px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'contracts'
                    ? 'bg-[#8c5332] text-white shadow-md shadow-[#8c5332]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${activeTab === 'contracts' ? 'text-white' : 'text-[#8c5332]'}`} />
                  <span>سجل العقود الموثقة</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'contracts' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {contracts.length}
                </span>
              </button>

            </div>
          </div>

        </div>

        {/* TAB BODY (LEFT CONTENT AREA IN RTL) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50 flex flex-col justify-between">
          <div className="space-y-6">
          
          {/* TAB 1: PLATFORM DISPLAY OPTIONS (خيار عرض المنصة) */}
          {activeTab === 'ui_header_footer' && (
            <div className="space-y-6 max-w-4xl mx-auto">

              {/* 0. WELCOME / ANNOUNCEMENT BANNER ABOVE HEADER */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">الرسالة الترحيبية والتنبيه العلوي أعلى الهيدر (Top Notice Bar)</h3>
                      <p className="text-xs text-slate-500 font-medium">التحكم المباشر في إخفاء أو إظهار شريط الإعلان والترحيب أعلى الصفحة وتعديل نص الرسالة</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHeaderTopNotice(!showHeaderTopNotice)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      showHeaderTopNotice ? 'bg-[#8c5332] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showHeaderTopNotice ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showHeaderTopNotice ? 'مُفعل (ظاهر)' : 'مُعطل (مخفي)'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">نص الرسالة الترحيبية والإعلانية أعلى الهيدر:</label>
                  <input
                    type="text"
                    value={headerNotice}
                    onChange={(e) => setHeaderNotice(e.target.value)}
                    placeholder="اكتب الرسالة الترحيبية أو التنبيه الإعلاني هنا..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                  />
                  <p className="text-[11px] text-slate-500 font-medium">
                    عند التفعيل، ستظهر هذه الرسالة في شريط مميز أعلى الهيدر في كافة صفحات الموقع. وعند التعطيل تختفي تماماً.
                  </p>
                </div>
              </div>

              {/* 1. MASTER TOGGLES: SEARCH & FOOTER */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Globe className="w-5 h-5 text-[#8c5332]" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">تفعيل/إلغاء عناصر البحث والفوتر بالمنصة</h3>
                    <p className="text-xs text-slate-500 font-medium">التحكم المباشر في إظهار مربع البحث في الهيدر والفوتر السفلي (الهيدر رئيسي ودائم بالمنصة)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">حقل البحث في الهيدر (Search)</span>
                      <span className="text-[11px] text-slate-500 font-medium">مربع البحث العلوي لتسهيل وصول الزوار للسلع</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowHeaderSearch(!showHeaderSearch)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        showHeaderSearch ? 'bg-[#8c5332] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {showHeaderSearch ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{showHeaderSearch ? 'مُفعل' : 'مُعطل'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">شريط الفوتر السفلي (Footer)</span>
                      <span className="text-[11px] text-slate-500 font-medium">معلومات المنصة، وسائل التواصل، والشروط</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFooter(!showFooter)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        showFooter ? 'bg-[#8c5332] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {showFooter ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{showFooter ? 'مُفعل' : 'مُعطل'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. PRODUCT DISPLAY COUNT & LAYOUT ON HOMEPAGE */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Package className="w-5 h-5 text-[#8c5332]" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">صلاحيات وتوزيع عرض المنتجات في الواجهة الرئيسية</h3>
                    <p className="text-xs text-slate-500 font-medium">التحكم في عدد المنتجات المعروضة جنب بعضها (الأعمدة) والحد الأقصى للمنتجات بالواجهة الرئيسية</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Column Layout Selector */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 block">عدد المنتجات جنب بعضها (الأعمدة الأفقية):</label>
                    <select
                      value={productGridCols}
                      onChange={(e) => setProductGridCols(e.target.value as any)}
                      className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl p-2.5 border border-slate-300 focus:border-[#8c5332] outline-hidden cursor-pointer"
                    >
                      <option value="3">3 منتجات جنب بعضها (بطاقات كبيرة جداً)</option>
                      <option value="4">4 منتجات جنب بعضها (المقياس القياسي الموصى به)</option>
                      <option value="5">5 منتجات جنب بعضها (عرض مكثف للمنتجات)</option>
                      <option value="6">6 منتجات جنب بعضها (أقصى زيادة أفقية)</option>
                    </select>
                    <p className="text-[11px] text-slate-500 font-medium">عند اختيار 4 مثلاً، سيتم ترتيب المنتجات في صفوف من 4 أجهزة جنب بعضها.</p>
                  </div>

                  {/* Max Limit Selector */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 block">الحد الأقصى للمنتجات بالصفحة الرئيسية:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 4, label: '4 منتجات' },
                        { value: 8, label: '8 منتجات' },
                        { value: 12, label: '12 منتج' },
                        { value: 16, label: '16 منتج (موصى به)' },
                        { value: 20, label: '20 منتج' },
                        { value: 0, label: 'عرض الكل بدون حد' }
                      ].map((option) => (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => setHomeItemsLimit(option.value)}
                          className={`p-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border text-center ${
                            homeItemsLimit === option.value
                              ? 'bg-[#8c5332] text-white border-[#8c5332] shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#f5eee6] rounded-xl border border-[#e6d8c7] text-xs text-[#734123] font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#8c5332]" />
                  <span>
                    عند تحديد حد أقصى (مثلاً 16 منتجاً)، سيظهر تلقائياً زر كبير بارز باسم <strong>"المزيد من منتجات المقايضة"</strong> أسفل الشبكة بالصفحة الرئيسية ينقل الزائر مباشرة إلى المعرض الشامل.
                  </span>
                </div>
              </div>

              {/* 4. HERO INTRO MESSAGE & IMAGE UPLOAD */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">الرسالة التعريفية بالمنصة والصورة (Hero Section)</h3>
                      <p className="text-xs text-slate-500 font-medium">التحكم الكامل بنصوص الصورة والبطاقة التعريفية بالواجهة وإمكانية رفع صورة خاصة</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHeroBanner(!showHeroBanner)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showHeroBanner ? 'bg-[#8c5332] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showHeroBanner ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showHeroBanner ? 'مُفعل' : 'مُعطل'}</span>
                  </button>
                </div>

                {showHeroBanner && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">وسام الترحيب الصغير (Badge):</label>
                        <input
                          type="text"
                          value={heroBadgeText}
                          onChange={(e) => setHeroBadgeText(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">العنوان الرئيسي العريض:</label>
                        <input
                          type="text"
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:border-[#8c5332] outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">النص والرسالة التعريفية بالمنصة:</label>
                      <textarea
                        rows={3}
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:border-[#8c5332] outline-hidden"
                        placeholder="اكتب الرسالة التعريفية التي تظهر لزوار المنصة بالواجهة..."
                      />
                    </div>

                    {/* HERO IMAGE FILE UPLOAD */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-800 block">صورة الرسالة التعريفية (رفع صورة من جهازك):</label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowHeroImage(!showHeroImage)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            showHeroImage ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {showHeroImage ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          <span>{showHeroImage ? 'إظهار الصورة' : 'إخفاء الصورة'}</span>
                        </button>
                      </div>
                      
                      {showHeroImage && (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-full sm:w-auto px-5 py-3 bg-[#8c5332] hover:bg-[#734123] text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm shrink-0">
                              <Upload className="w-4 h-4" />
                              <span>اختيار ورفع صورة من جهازك</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setHeroImageUrl(reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>

                            {heroImageUrl ? (
                              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 w-full sm:w-auto flex-1">
                                <img
                                  src={heroImageUrl}
                                  alt="معاينة الصورة"
                                  className="w-20 h-16 object-cover rounded-lg border border-slate-200 shrink-0 shadow-2xs"
                                />
                                <div className="space-y-1 text-right flex-1">
                                  <span className="text-xs font-extrabold text-slate-800 block">معاينة الصورة المحملة</span>
                                  <span className="text-[10px] text-emerald-600 font-bold block">جاهزة للحفظ والتطبيق بالصفحة الرئيسية</span>
                                  <button
                                    type="button"
                                    onClick={() => setHeroImageUrl('')}
                                    className="text-[11px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer underline"
                                  >
                                    إزالة الصورة
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500 font-medium italic">
                                لم يتم اختيار صورة بعد (اضغط زر الرفع أعلاه لاختيار صورة من جهازك)
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Direct Save Button inside Hero Section */}
                      <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-500 font-medium">اضغط حفظ لتطبيق تغييرات النص والصورة فوراً بالواجهة</span>
                        <button
                          type="button"
                          onClick={() => handleSaveAllSettings()}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                        >
                          <Save className="w-4 h-4" />
                          <span>حفظ وتطبيق صورة ورسالة الترحيب الآن</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. THREE MODERN FEATURE BOXES */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#8c5332]" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">ثلاث صناديق تعريفية بمميزات المنصة (شكل عصري)</h3>
                      <p className="text-xs text-slate-500 font-medium">التحكم في إضافة وتعديل عناوين وأيقونات الصناديق الثلاثية بالواجهة</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFeatureBoxes(!showFeatureBoxes)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showFeatureBoxes ? 'bg-[#8c5332] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showFeatureBoxes ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showFeatureBoxes ? 'مُفعل' : 'مُعطل'}</span>
                  </button>
                </div>

                {showFeatureBoxes && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {featureBoxes.map((box, idx) => (
                      <div key={box.id || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#8c5332]">الصندوق {idx + 1}</span>
                          <select
                            value={box.icon}
                            onChange={(e) => {
                              const updated = [...featureBoxes];
                              updated[idx].icon = e.target.value;
                              setFeatureBoxes(updated);
                            }}
                            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 outline-hidden"
                          >
                            <option value="FileCheck2">أيقونة العقد</option>
                            <option value="ShieldCheck">أيقونة الحماية</option>
                            <option value="ArrowLeftRight">أيقونة التبادل</option>
                            <option value="Sparkles">أيقونة النجمة</option>
                            <option value="Package">أيقونة الصندوق</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">عنوان الصندوق:</label>
                          <input
                            type="text"
                            value={box.title}
                            onChange={(e) => {
                              const updated = [...featureBoxes];
                              updated[idx].title = e.target.value;
                              setFeatureBoxes(updated);
                            }}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-[#8c5332] outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">الوصف التوضيحي:</label>
                          <textarea
                            rows={3}
                            value={box.description}
                            onChange={(e) => {
                              const updated = [...featureBoxes];
                              updated[idx].description = e.target.value;
                              setFeatureBoxes(updated);
                            }}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:border-[#8c5332] outline-hidden"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: Footer Elements & Policy Pages Control */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#8c5332]" />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">إعدادات الفوتر والسياسات القانونية (تحكم شامل)</h3>
                      <p className="text-xs text-slate-500 font-medium">تخصيص المظهر، التواصل، الشروط والأحكام، سياسة الخصوصية، والعمولة</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFooter(!showFooter)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showFooter ? 'bg-[#8c5332] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showFooter ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showFooter ? 'تفعيل الفوتر' : 'تعطيل الفوتر'}</span>
                  </button>
                </div>

                {showFooter && (
                  <div className="space-y-6">

                    {/* 1. Theme Color Selector */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <label className="text-xs font-extrabold text-slate-800 block">نمط وثيم لون الفوتر:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'light', name: 'أبيض ناصع (Light)', class: 'bg-white text-slate-900 border-slate-300' },
                          { id: 'dark', name: 'داكن فاخر (Dark)', class: 'bg-[#18110b] text-white border-[#362417]' },
                          { id: 'brown', name: 'بني الهوية (Brown)', class: 'bg-[#8c5332] text-white border-[#8c5332]' },
                          { id: 'slate', name: 'رمادي حديـث (Slate)', class: 'bg-slate-900 text-white border-slate-800' }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setFooterBgTheme(theme.id as any)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${theme.class} ${
                              footerBgTheme === theme.id ? 'ring-2 ring-emerald-500 shadow-xs' : 'opacity-80 hover:opacity-100'
                            }`}
                          >
                            <span>{theme.name}</span>
                            {footerBgTheme === theme.id && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Text and Descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">العنوان أو الشعار البارز بالفوتر:</label>
                        <input
                          type="text"
                          value={footerText}
                          onChange={(e) => setFooterText(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">الوصف التوضيحي بالفوتر:</label>
                        <input
                          type="text"
                          value={footerDescription}
                          onChange={(e) => setFooterDescription(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#8c5332] outline-hidden"
                        />
                      </div>
                    </div>

                    {/* 3. Support Contacts */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-slate-800">بيانات وتفاصيل التواصل:</label>
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                          <span>إظهار قسم التواصل</span>
                          <input
                            type="checkbox"
                            checked={showFooterContacts}
                            onChange={(e) => setShowFooterContacts(e.target.checked)}
                            className="w-4 h-4 accent-[#8c5332] cursor-pointer"
                          />
                        </label>
                      </div>

                      {showFooterContacts && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">البريد الإلكتروني:</label>
                            <input
                              type="email"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">رقم الهاتف:</label>
                            <input
                              type="text"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">رقم الواتساب المباشر:</label>
                            <input
                              type="text"
                              value={contactWhatsapp}
                              onChange={(e) => setContactWhatsapp(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">العنوان / المقر:</label>
                            <input
                              type="text"
                              value={contactAddress}
                              onChange={(e) => setContactAddress(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-hidden"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Social Links */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-slate-800">روابط منصات التواصل الاجتماعي:</label>
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                          <span>إظهار أزرار التواصل</span>
                          <input
                            type="checkbox"
                            checked={showFooterSocialLinks}
                            onChange={(e) => setShowFooterSocialLinks(e.target.checked)}
                            className="w-4 h-4 accent-[#8c5332] cursor-pointer"
                          />
                        </label>
                      </div>

                      {showFooterSocialLinks && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">منصة إكس (Twitter):</label>
                            <input
                              type="text"
                              value={twitterUrl}
                              onChange={(e) => setTwitterUrl(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">إنستغرام (Instagram):</label>
                            <input
                              type="text"
                              value={instagramUrl}
                              onChange={(e) => setInstagramUrl(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">رابط واتساب (WhatsApp):</label>
                            <input
                              type="text"
                              value={whatsappUrl}
                              onChange={(e) => setWhatsappUrl(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">تليجرام (Telegram):</label>
                            <input
                              type="text"
                              value={telegramUrl}
                              onChange={(e) => setTelegramUrl(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-hidden"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">يوتيوب (YouTube):</label>
                            <input
                              type="text"
                              value={youtubeUrl}
                              onChange={(e) => setYoutubeUrl(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-hidden"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 5. EDIT POLICY PAGES (الشروط والأحكام، الخصوصية، والعمولة) */}
                    <div className="p-5 bg-gradient-to-br from-[#f5eee6] to-slate-50 rounded-2xl border border-[#e6d8c7] space-y-5">
                      <div className="flex items-center gap-2 border-b border-[#e6d8c7] pb-3">
                        <FileText className="w-5 h-5 text-[#8c5332]" />
                        <div>
                          <h4 className="text-sm font-black text-[#734123]">محرر نصوص الصفحات الثلاث (الشروط، الخصوصية، والعمولة)</h4>
                          <p className="text-xs text-slate-600 font-medium">يمكنك تعديل نصوص هذه الصفحات بحرية وتظهر للزائر في صفحة كاملة فور الضغط عليها</p>
                        </div>
                      </div>

                      {/* POLICY 1: الشروط والأحكام */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#8c5332]" />
                            <span className="text-xs font-black text-slate-900">1. الشروط والأحكام (Terms & Conditions)</span>
                          </div>
                          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                            <span>إظهار الرابط في الفوتر</span>
                            <input
                              type="checkbox"
                              checked={showTermsLink}
                              onChange={(e) => setShowTermsLink(e.target.checked)}
                              className="w-4 h-4 accent-[#8c5332] cursor-pointer"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 block">عنوان الصفحة:</label>
                            <input
                              type="text"
                              value={termsTitle}
                              onChange={(e) => setTermsTitle(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">المحتوى الكامل للشروط والأحكام (نصوص وبنود):</label>
                          <textarea
                            rows={6}
                            value={termsContent}
                            onChange={(e) => setTermsContent(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium leading-relaxed outline-hidden focus:border-[#8c5332]"
                          />
                        </div>
                      </div>

                      {/* POLICY 2: سياسة الخصوصية */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#8c5332]" />
                            <span className="text-xs font-black text-slate-900">2. سياسة الخصوصية وسرية البيانات (Privacy Policy)</span>
                          </div>
                          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                            <span>إظهار الرابط في الفوتر</span>
                            <input
                              type="checkbox"
                              checked={showPrivacyLink}
                              onChange={(e) => setShowPrivacyLink(e.target.checked)}
                              className="w-4 h-4 accent-[#8c5332] cursor-pointer"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 block">عنوان الصفحة:</label>
                            <input
                              type="text"
                              value={privacyTitle}
                              onChange={(e) => setPrivacyTitle(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">المحتوى الكامل لسياسة الخصوصية:</label>
                          <textarea
                            rows={6}
                            value={privacyContent}
                            onChange={(e) => setPrivacyContent(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium leading-relaxed outline-hidden focus:border-[#8c5332]"
                          />
                        </div>
                      </div>

                      {/* POLICY 3: نسبة العمولة ورسوم الخدمة */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#8c5332]" />
                            <span className="text-xs font-black text-slate-900">3. نسبة العمولة ورسوم الخدمة (Commission Policy)</span>
                          </div>
                          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                            <span>إظهار الرابط في الفوتر</span>
                            <input
                              type="checkbox"
                              checked={showCommissionLink}
                              onChange={(e) => setShowCommissionLink(e.target.checked)}
                              className="w-4 h-4 accent-[#8c5332] cursor-pointer"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 block">عنوان الصفحة:</label>
                            <input
                              type="text"
                              value={commissionTitle}
                              onChange={(e) => setCommissionTitle(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 block">نسبة العمولة المقتطعة (%):</label>
                            <input
                              type="number"
                              step="0.1"
                              value={barterCommissionRate}
                              onChange={(e) => setBarterCommissionRate(parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-hidden font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">المحتوى الشارح لسياسة العمولة ورسوم التوثيق:</label>
                          <textarea
                            rows={6}
                            value={commissionContent}
                            onChange={(e) => setCommissionContent(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium leading-relaxed outline-hidden focus:border-[#8c5332]"
                          />
                        </div>
                      </div>

                    </div>

                    {/* 6. Footer Bottom Copyright Text */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">نص شريط الحقوق أسفل الصفحة:</label>
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                          <span>إظهار شريط الحقوق</span>
                          <input
                            type="checkbox"
                            checked={showFooterRights}
                            onChange={(e) => setShowFooterRights(e.target.checked)}
                            className="w-4 h-4 accent-[#8c5332] cursor-pointer"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={footerCopyrightText}
                        onChange={(e) => setFooterCopyrightText(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>

                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveAllSettings()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ إعدادات الفوتر والسياسات الآن</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB: ADD ITEM FORM FIELD CONFIGURATION (TECHNICAL & DEVELOPER SCHEMA BUILDER) */}
          {activeTab === 'add_item_settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Technical Banner */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8c5332] text-white flex items-center justify-center font-mono font-bold">
                      <Code2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold flex items-center gap-2">
                        <span>محرر هيكل بيانات نموذج إضافة السلع</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono">Form Schema Editor</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        تحكم برمجي وفني كامل بالحقول، تسمياتها، حالات الإجبار (Required/Optional)، وخيارات القوائم المنسدلة (Dropdown Enums).
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-mono bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 self-start sm:self-auto">
                    <span className="text-emerald-400 font-bold">Schema V2.4</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-300">10 Fields</span>
                  </div>
                </div>
              </div>

              {/* FIELD 1: TITLE */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#1 addItemTitle</span>
                    <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">string</span>
                    <span className="text-xs font-bold text-slate-800">عنوان السلعة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemTitleRequired(!addItemTitleRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemTitleRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemTitleRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowTitle(!addItemShowTitle)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowTitle ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowTitle ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowTitle ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowTitle && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى الحقل (Field Label):</label>
                      <input
                        type="text"
                        value={addItemTitleLabel}
                        onChange={(e) => setAddItemTitleLabel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل النص الإرشادي (Placeholder):</label>
                      <input
                        type="text"
                        value={addItemTitlePlaceholder}
                        onChange={(e) => setAddItemTitlePlaceholder(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* FIELD 2: CATEGORY */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#2 addItemCategory</span>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">enum / categories</span>
                    <span className="text-xs font-bold text-slate-800">اختيار الفئة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemCategoryRequired(!addItemCategoryRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemCategoryRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemCategoryRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowCategory(!addItemShowCategory)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowCategory ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowCategory ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowCategory ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowCategory && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى الحقل (Field Label):</label>
                      <input
                        type="text"
                        value={addItemCategoryLabel}
                        onChange={(e) => setAddItemCategoryLabel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>يستمد هذا الحقل خياراته من شجرة فئات المنصة الرسمية ({categories.length} فئة حالية).</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className="bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer"
                      >
                        إدارة الفئات الآن
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* FIELD 3: CONDITION (DROPDOWN ENUM OPTIONS BUILDER) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#3 addItemCondition</span>
                    <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">select / dropdown</span>
                    <span className="text-xs font-bold text-slate-800">حالة السلعة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemConditionRequired(!addItemConditionRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemConditionRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemConditionRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowCondition(!addItemShowCondition)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowCondition ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowCondition ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowCondition ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowCondition && (
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى الحقل (Field Label):</label>
                      <input
                        type="text"
                        value={addItemConditionLabel}
                        onChange={(e) => setAddItemConditionLabel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>

                    {/* DROPDOWN OPTIONS MANAGER */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <ListPlus className="w-4 h-4 text-[#8c5332]" />
                          <span>خيارات القائمة المنسدلة (Condition Dropdown Items):</span>
                        </label>
                        <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          {addItemConditionOptions.length} خيارات
                        </span>
                      </div>

                      <div className="space-y-2">
                        {addItemConditionOptions.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400 w-6 text-center">#{idx + 1}</span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...addItemConditionOptions];
                                newOpts[idx] = e.target.value;
                                setAddItemConditionOptions(newOpts);
                              }}
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setAddItemConditionOptions(addItemConditionOptions.filter((_, i) => i !== idx));
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="حذف هذا الخيار"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new option inline */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <input
                          type="text"
                          placeholder="اكتب خياراً جديداً لحالة السلعة هنا..."
                          value={newConditionOptInput}
                          onChange={(e) => setNewConditionOptInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newConditionOptInput.trim()) {
                              e.preventDefault();
                              setAddItemConditionOptions([...addItemConditionOptions, newConditionOptInput.trim()]);
                              setNewConditionOptInput('');
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-[#8c5332] outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newConditionOptInput.trim()) {
                              setAddItemConditionOptions([...addItemConditionOptions, newConditionOptInput.trim()]);
                              setNewConditionOptInput('');
                            }
                          }}
                          className="bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة الخيار</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FIELD 4: ESTIMATED VALUE */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#4 addItemEstimatedValue</span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">number</span>
                    <span className="text-xs font-bold text-slate-800">القيمة التقديرية (بالريال)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemEstimatedValueRequired(!addItemEstimatedValueRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemEstimatedValueRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemEstimatedValueRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowEstimatedValue(!addItemShowEstimatedValue)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowEstimatedValue ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowEstimatedValue ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowEstimatedValue ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowEstimatedValue && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى الحقل (Field Label):</label>
                    <input
                      type="text"
                      value={addItemEstimatedValueLabel}
                      onChange={(e) => setAddItemEstimatedValueLabel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* FIELD 5: DESCRIPTION */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#5 addItemDescription</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">text / textarea</span>
                    <span className="text-xs font-bold text-slate-800">الوصف التفصيلي والملحقات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemDescriptionRequired(!addItemDescriptionRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemDescriptionRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemDescriptionRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowDescription(!addItemShowDescription)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowDescription ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowDescription ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowDescription ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowDescription && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى الحقل (Field Label):</label>
                      <input
                        type="text"
                        value={addItemDescriptionLabel}
                        onChange={(e) => setAddItemDescriptionLabel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل النص الإرشادي (Placeholder):</label>
                      <input
                        type="text"
                        value={addItemDescriptionPlaceholder}
                        onChange={(e) => setAddItemDescriptionPlaceholder(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* FIELD 6: LOCATION */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#6 addItemLocation</span>
                    <span className="text-[10px] font-mono text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">string / location</span>
                    <span className="text-xs font-bold text-slate-800">المدينة والمنطقة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemLocationRequired(!addItemLocationRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemLocationRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemLocationRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowLocation(!addItemShowLocation)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowLocation ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowLocation ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowLocation ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowLocation && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى الحقل (Field Label):</label>
                    <input
                      type="text"
                      value={addItemLocationLabel}
                      onChange={(e) => setAddItemLocationLabel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* FIELD 7: DELIVERY PREFERENCE (DROPDOWN ENUM OPTIONS BUILDER) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#7 addItemDeliveryPref</span>
                    <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">select / dropdown</span>
                    <span className="text-xs font-bold text-slate-800">تفضيل التسليم</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemDeliveryPrefRequired(!addItemDeliveryPrefRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemDeliveryPrefRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemDeliveryPrefRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowDeliveryPref(!addItemShowDeliveryPref)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowDeliveryPref ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowDeliveryPref ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowDeliveryPref ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowDeliveryPref && (
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى الحقل (Field Label):</label>
                      <input
                        type="text"
                        value={addItemDeliveryPrefLabel}
                        onChange={(e) => setAddItemDeliveryPrefLabel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>

                    {/* DROPDOWN OPTIONS MANAGER */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <ListPlus className="w-4 h-4 text-[#8c5332]" />
                          <span>خيارات القائمة المنسدلة (Delivery Dropdown Items):</span>
                        </label>
                        <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          {addItemDeliveryOptions.length} خيارات
                        </span>
                      </div>

                      <div className="space-y-2">
                        {addItemDeliveryOptions.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400 w-6 text-center">#{idx + 1}</span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...addItemDeliveryOptions];
                                newOpts[idx] = e.target.value;
                                setAddItemDeliveryOptions(newOpts);
                              }}
                              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setAddItemDeliveryOptions(addItemDeliveryOptions.filter((_, i) => i !== idx));
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="حذف هذا الخيار"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new option inline */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <input
                          type="text"
                          placeholder="اكتب طريقة تسليم جديدة هنا..."
                          value={newDeliveryOptInput}
                          onChange={(e) => setNewDeliveryOptInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newDeliveryOptInput.trim()) {
                              e.preventDefault();
                              setAddItemDeliveryOptions([...addItemDeliveryOptions, newDeliveryOptInput.trim()]);
                              setNewDeliveryOptInput('');
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-[#8c5332] outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newDeliveryOptInput.trim()) {
                              setAddItemDeliveryOptions([...addItemDeliveryOptions, newDeliveryOptInput.trim()]);
                              setNewDeliveryOptInput('');
                            }
                          }}
                          className="bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة الخيار</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FIELD 8: DESIRED ITEM */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#8 addItemDesiredItem</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">text / textarea</span>
                    <span className="text-xs font-bold text-slate-800">وصف السلعة المطلوب مقايضتها</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemDesiredItemRequired(!addItemDesiredItemRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemDesiredItemRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemDesiredItemRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowDesiredItem(!addItemShowDesiredItem)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowDesiredItem ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowDesiredItem ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowDesiredItem ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowDesiredItem && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى الحقل (Field Label):</label>
                      <input
                        type="text"
                        value={addItemDesiredItemLabel}
                        onChange={(e) => setAddItemDesiredItemLabel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل النص الإرشادي (Placeholder):</label>
                      <input
                        type="text"
                        value={addItemDesiredItemPlaceholder}
                        onChange={(e) => setAddItemDesiredItemPlaceholder(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#8c5332] outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* FIELD 9: CASH DIFFERENCE */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#9 addItemCashDiffOption</span>
                    <span className="text-[10px] font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">boolean / checkbox</span>
                    <span className="text-xs font-bold text-slate-800">خيار التفاوض وفارق السعر</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddItemShowCashDiffOption(!addItemShowCashDiffOption)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      addItemShowCashDiffOption ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {addItemShowCashDiffOption ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{addItemShowCashDiffOption ? 'مُفعّل' : 'معطّل'}</span>
                  </button>
                </div>

                {addItemShowCashDiffOption && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل نص مربع الاختيار (Checkbox Label):</label>
                    <input
                      type="text"
                      value={addItemCashDiffLabel}
                      onChange={(e) => setAddItemCashDiffLabel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* FIELD 10: IMAGE UPLOAD */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">#10 addItemImageUpload</span>
                    <span className="text-[10px] font-mono text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">file / image</span>
                    <span className="text-xs font-bold text-slate-800">رفع صورة السلعة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddItemImageUploadRequired(!addItemImageUploadRequired)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                        addItemImageUploadRequired 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {addItemImageUploadRequired ? 'إجباري (Required)' : 'اختياري (Optional)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddItemShowImageUpload(!addItemShowImageUpload)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        addItemShowImageUpload ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {addItemShowImageUpload ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{addItemShowImageUpload ? 'مُفعّل' : 'معطّل'}</span>
                    </button>
                  </div>
                </div>

                {addItemShowImageUpload && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">تعديل مسمى حقل رفع الصورة (Field Label):</label>
                    <input
                      type="text"
                      value={addItemImageUploadLabel}
                      onChange={(e) => setAddItemImageUploadLabel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#8c5332] outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Global Save Button */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSaveAllSettings()}
                  className="bg-[#8c5332] hover:bg-[#734123] text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ هيكل النموذج والإعدادات بالكامل</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: CONTRACT CLAUSES & FIELD TOGGLES */}
          {activeTab === 'contract_clauses' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md space-y-1">
                <h3 className="text-sm font-extrabold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  إعدادات وتخصيص حقول العقد الإلكتروني المعتمد
                </h3>
                <p className="text-xs text-emerald-200">
                  يمكنك تفعيل أو إلغاء تفعيل أي بند أو حقل قانوني في العقد بشكل منفصل وتعديل صيغته النصية بكل حرية.
                </p>
              </div>

              {/* CLAUSE 1: Preamble */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-extrabold text-slate-900">1. الديباجة والمقدمة القانونية للعقد</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContractPreamble(!showContractPreamble)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showContractPreamble ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showContractPreamble ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showContractPreamble ? 'تفعيل الحقل' : 'إلغاء الحقل'}</span>
                  </button>
                </div>
                {showContractPreamble && (
                  <textarea
                    rows={3}
                    value={contractPreamble}
                    onChange={(e) => setContractPreamble(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-hidden"
                  />
                )}
              </div>

              {/* CLAUSE 2: Inspection Clause */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8c5332]" />
                    <span className="text-xs font-extrabold text-slate-900">2. بند فترة الفحص والضمان</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContractInspectionClause(!showContractInspectionClause)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showContractInspectionClause ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showContractInspectionClause ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showContractInspectionClause ? 'تفعيل الحقل' : 'إلغاء الحقل'}</span>
                  </button>
                </div>
                {showContractInspectionClause && (
                  <textarea
                    rows={2}
                    value={contractInspectionClause}
                    onChange={(e) => setContractInspectionClause(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-hidden"
                  />
                )}
              </div>

              {/* CLAUSE 3: Cash Difference Clause */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-extrabold text-slate-900">3. بند التصفية المالية وفارق السعر النقدي</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContractCashClause(!showContractCashClause)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showContractCashClause ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showContractCashClause ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showContractCashClause ? 'تفعيل الحقل' : 'إلغاء الحقل'}</span>
                  </button>
                </div>
                {showContractCashClause && (
                  <textarea
                    rows={2}
                    value={contractCashClause}
                    onChange={(e) => setContractCashClause(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-hidden"
                  />
                )}
              </div>

              {/* CLAUSE 4: Identity & Digital Signature Clause */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-extrabold text-slate-900">4. بند الهوية والتوثيق والتوقيع الرقمي</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContractIdentityClause(!showContractIdentityClause)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showContractIdentityClause ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showContractIdentityClause ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showContractIdentityClause ? 'تفعيل الحقل' : 'إلغاء الحقل'}</span>
                  </button>
                </div>
                {showContractIdentityClause && (
                  <textarea
                    rows={2}
                    value={contractIdentityClause}
                    onChange={(e) => setContractIdentityClause(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-hidden"
                  />
                )}
              </div>

              {/* CLAUSE 5: Penalty Clause */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-extrabold text-slate-900">5. بند الجزاءات والإخلال بالالتزام</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContractPenaltyClause(!showContractPenaltyClause)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showContractPenaltyClause ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showContractPenaltyClause ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showContractPenaltyClause ? 'تفعيل الحقل' : 'إلغاء الحقل'}</span>
                  </button>
                </div>
                {showContractPenaltyClause && (
                  <textarea
                    rows={2}
                    value={contractPenaltyClause}
                    onChange={(e) => setContractPenaltyClause(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-hidden"
                  />
                )}
              </div>

              {/* CLAUSE 6: Dispute Jurisdiction */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-extrabold text-slate-900">6. بند الاختصاص القضائي وفض النزاعات</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContractDisputeClause(!showContractDisputeClause)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      showContractDisputeClause ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showContractDisputeClause ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{showContractDisputeClause ? 'تفعيل الحقل' : 'إلغاء الحقل'}</span>
                  </button>
                </div>
                {showContractDisputeClause && (
                  <textarea
                    rows={2}
                    value={contractDisputeClause}
                    onChange={(e) => setContractDisputeClause(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-hidden"
                  />
                )}
              </div>

              {/* Custom Additional Terms */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900">إضافة بنود وشروط قانونية مخصصة إضافية:</h4>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="اكتب بنداً مخصصاً جديداً لإضافته للعقد..."
                    value={newTermInput}
                    onChange={(e) => setNewTermInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddTerm}
                    className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 cursor-pointer"
                  >
                    إضافة البند +
                  </button>
                </div>

                <div className="space-y-2">
                  {customTerms.map((term, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800">
                      <span>• {term}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTerm(index)}
                        className="text-rose-600 hover:text-rose-700 font-bold text-[11px] p-1 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Barter Rules */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900">خيارات وقواعد المنصة العامة:</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-bold text-slate-800">
                    <span>السماح بدفع فارق السعر النقدي</span>
                    <input
                      type="checkbox"
                      checked={enableCashDifference}
                      onChange={(e) => setEnableCashDifference(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </label>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">الحد الأقصى المسموح للفارق النقدي (ريال):</label>
                    <input
                      type="number"
                      value={maxCashDifferenceLimit}
                      onChange={(e) => setMaxCashDifferenceLimit(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:border-emerald-500 outline-hidden"
                    />
                  </div>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs font-bold text-slate-800">
                    <span>اشتراط التوثيق الرسمي لإنشاء العقود</span>
                    <input
                      type="checkbox"
                      checked={enableIdentityVerificationRequired}
                      onChange={(e) => setEnableIdentityVerificationRequired(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </label>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">عدد أيام فحص والمعاينة القانونية:</label>
                    <input
                      type="number"
                      value={inspectionDays}
                      onChange={(e) => setInspectionDays(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:border-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveAllSettings()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ حقول وبنود العقد الآن</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: USER MANAGEMENT & PERMISSIONS */}
          {activeTab === 'users' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">إدارة مستخدمي وأعضاء المنصة</h3>
                  <p className="text-xs text-slate-500">البحث، تعديل البيانات، تغيير الرتبة والإشراف، وتصنيفات العضوية</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-[#8c5332] hover:bg-[#734123] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة عضو جديد +</span>
                </button>
              </div>

              {/* Registration & Activation Policy Control Box */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#8c5332] text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                      <UserCog className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                        سياسة التسجيل وتفعيل الأعضاء الجدد
                        {autoActivateNewUsers ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">التسجيل مباشر (تفعيل تلقائي)</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold">تفعيل يدوي (بانتظار موافقة الإدارة)</span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {autoActivateNewUsers
                          ? 'التسجيل المباشر مُفَعّل: يتم تفعيل حساب العضو الجديد تلقائياً فور التسجيل ويمكنه استخدام المنصة وإضافة السلع مباشرة دون انتظار الموافقة.'
                          : 'التسجيل معلق (تفعيل يدوي): تنشأ حسابات الأعضاء الجدد بحالة معلقة (بانتظار التفعيل) وتتطلب موافقة وتفعيل من إدارة المنصة أولاً.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200/80">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoActivateNewUsers}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setAutoActivateNewUsers(val);
                          updateSettings({ ...settings, autoActivateNewUsers: val });
                          setSaveSuccessMsg(
                            val
                              ? 'تم تفعيل سياسة التسجيل المباشر وتفعيل الأعضاء الجدد تلقائياً ✓'
                              : 'تم تفعيل سياسة التفعيل اليدوي والموافقة المسبقة للحسابات الجديدة ✓'
                          );
                          setTimeout(() => setSaveSuccessMsg(''), 3000);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                    <span className="text-xs font-extrabold text-slate-800">
                      {autoActivateNewUsers ? 'تسجيل مباشر' : 'تفعيل يدوي'}
                    </span>
                  </div>
                </div>

                {/* Batch Action: Activate all pending members with 1 click */}
                {users.some((u) => !(u.isActive ?? true)) && (
                  <div className="pt-2.5 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-amber-900 font-bold">
                      ⚠️ يوجد حالياً ({users.filter((u) => !(u.isActive ?? true)).length}) عضو بحالة معلقة بانتظار التفعيل.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('هل أنت تأكد من تفعيل كافة حسابات الأعضاء المعلقة دفعة واحدة؟')) {
                          users.forEach((u) => {
                            if (!(u.isActive ?? true)) {
                              adminUpdateUser(u.id, { isActive: true });
                            }
                          });
                          setSaveSuccessMsg('تم تفعيل كافة حسابات الأعضاء المعلقة بنجاح!');
                          setTimeout(() => setSaveSuccessMsg(''), 3000);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تفعيل جميع الأعضاء المعلقين الآن</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Search Bar for Users */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="ابحث عن عضو بالاسم، البريد الإلكتروني، رقم الجوال، المدينة، أو تصنيف العضوية..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#8c5332]/20 focus:border-[#8c5332] shadow-xs"
                />
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">العضو</th>
                        <th className="p-3">رتبة العضو بالمنصة</th>
                        <th className="p-3">تصنيف العضوية</th>
                        <th className="p-3">المدينة والجوال</th>
                        <th className="p-3">تفعيل الحساب</th>
                        <th className="p-3">حالة التوثيق</th>
                        <th className="p-3">المقايضات</th>
                        <th className="p-3">التقييم</th>
                        <th className="p-3 text-left">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {users
                        .filter((u) => {
                          if (!userSearchQuery.trim()) return true;
                          const q = userSearchQuery.toLowerCase();
                          return (
                            u.name.toLowerCase().includes(q) ||
                            (u.email && u.email.toLowerCase().includes(q)) ||
                            u.phone.includes(q) ||
                            u.city.toLowerCase().includes(q) ||
                            (u.membershipTier && u.membershipTier.toLowerCase().includes(q)) ||
                            (u.role && u.role.toLowerCase().includes(q))
                          );
                        })
                        .map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-all">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img src={user.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900">{user.name}</span>
                                <span className="text-[10px] text-slate-400">{user.email || 'بدون بريد'}</span>
                              </div>
                            </div>
                          </td>
                          {/* Role Select */}
                          <td className="p-3">
                            <select
                              value={user.isOwner ? 'admin' : (user.role || 'user')}
                              onChange={(e) => {
                                const newRole = e.target.value as 'user' | 'moderator' | 'admin';
                                adminUpdateUser(user.id, { role: newRole, isOwner: newRole === 'admin' ? true : user.isOwner });
                              }}
                              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold border cursor-pointer outline-hidden transition-all ${
                                user.isOwner || user.role === 'admin'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : user.role === 'moderator'
                                  ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <option value="user">عضو عادي</option>
                              <option value="moderator">مشرف منصة (Moderator)</option>
                              <option value="admin">مالك/مدير (Admin)</option>
                            </select>
                          </td>
                          {/* Membership Tier Dropdown */}
                          <td className="p-3">
                            <select
                              value={user.membershipTier || 'عضو عادي'}
                              onChange={(e) => adminUpdateUser(user.id, { membershipTier: e.target.value as UserMembershipTier })}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer outline-hidden transition-all ${
                                user.membershipTier === 'تاجر موثوق' || user.membershipTier === 'عضو مميز'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : user.membershipTier === 'عضو مشترك'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : user.membershipTier === 'عضو موثق'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              <option value="عضو عادي">عضو عادي</option>
                              <option value="عضو موثق">عضو موثق</option>
                              <option value="عضو مشترك">عضو مشترك</option>
                              <option value="تاجر موثوق">تاجر موثوق</option>
                              <option value="عضو مميز">عضو مميز</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-700 text-[11px] font-bold">{user.city}</div>
                            <div className="font-mono text-[10px] text-slate-400">{user.phone}</div>
                          </td>
                          {/* Account Activation Toggle */}
                          <td className="p-3">
                            <button
                              onClick={() => adminUpdateUser(user.id, { isActive: !(user.isActive ?? true) })}
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] cursor-pointer flex items-center gap-1 w-fit transition-all ${
                                (user.isActive ?? true) 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              <CheckCircle2 className={`w-3 h-3 ${(user.isActive ?? true) ? 'text-emerald-600' : 'text-amber-600'}`} />
                              <span>{(user.isActive ?? true) ? 'مُفعّل' : 'معطل'}</span>
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => adminUpdateUser(user.id, { verified: !user.verified })}
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] cursor-pointer flex items-center gap-1 w-fit ${
                                user.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <BadgeCheck className="w-3 h-3" />
                              <span>{user.verified ? 'موثق' : 'غير موثق'}</span>
                            </button>
                          </td>
                          <td className="p-3 font-bold text-slate-800">{user.completedBartersCount}</td>
                          <td className="p-3 font-bold text-amber-600">★ {user.rating}</td>
                          <td className="p-3 text-left">
                            <div className="flex items-center justify-end gap-1">
                              {onViewUserProfile && (
                                <button
                                  onClick={() => {
                                    onClose();
                                    onViewUserProfile(user.id);
                                  }}
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                                  title="عرض ملف العضو في المنصة"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                title="تعديل تفاصيل العضو"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت تأكد من حذف العضو ${user.name}؟`)) {
                                    adminDeleteUser(user.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                title="حذف العضو"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3.5: REVIEWS & RATINGS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">إدارة التقييمات وآراء الأعضاء</h3>
                  <p className="text-xs text-slate-500">استعراض وتعديل كافة التقييمات المنشورة وتأثيرها على معدل ثقة المستخدمين</p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">إجمالي التقييمات</span>
                    <strong className="text-base font-black text-slate-900">{reviews.length} تقييم</strong>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                    ★
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">متوسط تقييم المنصة</span>
                    <strong className="text-base font-black text-slate-900">
                      {reviews.length > 0
                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                        : '0.0'}{' '}
                      / 5.0
                    </strong>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">التقييمات الممتازة (5 نجوم)</span>
                    <strong className="text-base font-black text-slate-900">
                      {reviews.filter((r) => r.rating === 5).length} تقييم ممتاز
                    </strong>
                  </div>
                </div>
              </div>

              {/* Search Bar for Reviews */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  value={reviewSearchQuery}
                  onChange={(e) => setReviewSearchQuery(e.target.value)}
                  placeholder="ابحث باسم المُقَيِّـم، العضو المُقَيَّـم، أو نص التعليق والملاحظات..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#8c5332]/20 focus:border-[#8c5332] shadow-xs"
                />
              </div>

              {/* Reviews Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">المُقَيِّـم (كاتب التقييم)</th>
                        <th className="p-3">العضو المُقَيَّـم</th>
                        <th className="p-3">درجة التقييم</th>
                        <th className="p-3">التعليق والملاحظات</th>
                        <th className="p-3">تاريخ التقييم</th>
                        <th className="p-3 text-left">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {reviews.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                            لا توجد تقييمات مسجلة حالياً في المنصة.
                          </td>
                        </tr>
                      ) : (
                        reviews
                          .filter((r) => {
                            if (!reviewSearchQuery.trim()) return true;
                            const q = reviewSearchQuery.toLowerCase();
                            return (
                              r.reviewerName.toLowerCase().includes(q) ||
                              r.targetUserName.toLowerCase().includes(q) ||
                              r.comment.toLowerCase().includes(q)
                            );
                          })
                          .map((rev) => (
                            <tr key={rev.id} className="hover:bg-slate-50/80 transition-all">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={rev.reviewerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'}
                                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                  />
                                  <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-[#8c5332]">{rev.targetUserName}</span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 w-fit">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                                  <span>{rev.rating} / 5</span>
                                </div>
                              </td>
                              <td className="p-3 text-slate-700 max-w-xs truncate">
                                {rev.comment || <span className="text-slate-400 italic">بدون تعليق نصي</span>}
                              </td>
                              <td className="p-3 text-slate-400 font-mono text-[11px]">{rev.createdAt}</td>
                              <td className="p-3 text-left">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => setEditingReview(rev)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                    title="تعديل التقييم والتعليق"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`هل أنت تأكد من حذف هذا التقييم؟ سيتم إعادة حساب معدل العضو تلقائياً.`)) {
                                        adminDeleteReview(rev.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                    title="حذف التقييم"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: CATEGORIES & ITEMS MODERATION */}
          {activeTab === 'categories' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">فئات سلع المقايضة</h3>
                  <p className="text-xs text-slate-500">إضافة أو حذف الفئات المتاحة للمستخدمين</p>
                </div>
                <button
                  onClick={() => setShowAddCatModal(true)}
                  className="bg-[#8c5332] hover:bg-[#734123] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة فئة جديدة +</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                      <span className="inline-block mt-2 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                        {cat.itemCount} سلع معروضة
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`حذف فئة ${cat.name}؟`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <h3 className="text-sm font-extrabold text-slate-900">السلع المعروضة بالمنصة ({items.length})</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-3 shadow-xs flex flex-col justify-between">
                    <div className="flex gap-3">
                      <img src={item.images[0]} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100" />
                      <div className="text-xs space-y-1">
                        <span className="text-[10px] font-bold text-[#734123] bg-[#f5eee6] px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-slate-900 line-clamp-2">{item.title}</h4>
                        <p className="text-[11px] font-bold text-amber-700">القيمة المقدرة: {item.estimatedValue} ريال</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[10px]">المالك: {item.ownerName}</span>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت تأكد من حذف السلعة ${item.title}؟`)) {
                            deleteItem(item.id);
                          }
                        }}
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        حذف السلعة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONTRACTS REGISTRY & EDITING */}
          {activeTab === 'contracts' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">سجل وتعديل العقود الإلكترونية الموثقة</h3>
                <p className="text-xs text-slate-500">يمكنك معاينة العقد كملف PDF، أو تعديل تفاصيل الأطراف والمبالغ والحالة مباشرة</p>
              </div>

              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div key={contract.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-[#8c5332] text-sm">{contract.contractNumber}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {contract.status}
                        </span>
                      </div>
                      <p className="text-slate-700 font-semibold">
                        <strong className="text-slate-900">{contract.partyA.name}</strong> ⇄ <strong className="text-slate-900">{contract.partyB.name}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {contract.partyA.itemTitle} مقابل {contract.partyB.itemTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => onViewContract(contract)}
                        className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>عرض العقد PDF</span>
                      </button>
                      
                      <button
                        onClick={() => setEditingContract(contract)}
                        className="px-3 py-2 bg-[#f5eee6] text-[#734123] hover:bg-[#e6d8c7] border border-[#e6d8c7] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل العقد</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`حذف العقد رقم ${contract.contractNumber}؟`)) {
                            adminDeleteContract(contract.id);
                          }
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          </div>

          {/* Unified Single Bottom Save Bar */}
          <div className="pt-6 mt-8 border-t border-slate-200/80 space-y-3">
            {saveSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
                <button type="button" onClick={() => setSaveSuccessMsg('')} className="text-emerald-700 font-bold hover:underline">
                  حسناً
                </button>
              </div>
            )}

            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3 text-right">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Save className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">زر الحفظ الموحد للمنصة</h4>
                  <p className="text-[11px] text-slate-400 font-medium">اضغط هنا لحفظ كافة الخيارات والتعديلات المحدثة في جميع أقسام لوحة التحكم بضغطة واحدة</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSaveAllSettings()}
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/40 shrink-0 border border-emerald-400/40"
              >
                <Save className="w-4 h-4" />
                <span>حفظ كل الخيارات المحدثة</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: ADD CATEGORY */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">إضافة فئة مقايضة جديدة</h3>
            
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم الفئة:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: معدات تخييم ورحلات"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">وصف الفئة:</label>
                <input
                  type="text"
                  placeholder="وصف مختصر للسلع المدرجة تحتها..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#8c5332] text-white font-bold py-2.5 rounded-xl hover:bg-[#734123] cursor-pointer"
                >
                  حفظ الفئة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">إضافة عضو جديد للمنصة</h3>
            
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عبدالله الفايز"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المدينة:</label>
                  <select
                    value={newUserCity}
                    onChange={(e) => setNewUserCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم الجوال:</label>
                  <input
                    type="text"
                    placeholder="0500000000"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">تصنيف العضوية (صلاحية المالك حصراً):</label>
                <select
                  value={newUserMembershipTier}
                  onChange={(e) => setNewUserMembershipTier(e.target.value as UserMembershipTier)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                >
                  <option value="عضو عادي">عضو عادي</option>
                  <option value="عضو موثق">عضو موثق</option>
                  <option value="عضو مشترك">عضو مشترك</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserIsActive}
                    onChange={(e) => setNewUserIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#8c5332]"
                  />
                  <span>تفعيل الحساب فوراً (مكافحة السبام)</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserVerified}
                    onChange={(e) => setNewUserVerified(e.target.checked)}
                    className="w-4 h-4 accent-[#8c5332]"
                  />
                  <span>تسمية الحساب كمُوثق برقم الهوية النفاذ</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#8c5332] text-white font-bold py-2.5 rounded-xl hover:bg-[#734123] cursor-pointer"
                >
                  حفظ العضو
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">تعديل الملف الشخصي للعضو: {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                adminUpdateUser(editingUser.id, editingUser);
                setEditingUser(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">المدينة:</label>
                  <input
                    type="text"
                    value={editingUser.city}
                    onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">الجوال:</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">رتبة العضو في المنصة (الإشراف والإدارة):</label>
                <select
                  value={editingUser.isOwner ? 'admin' : (editingUser.role || 'user')}
                  onChange={(e) => {
                    const newRole = e.target.value as 'user' | 'moderator' | 'admin';
                    setEditingUser({
                      ...editingUser,
                      role: newRole,
                      isOwner: newRole === 'admin' ? true : editingUser.isOwner
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-extrabold outline-hidden"
                >
                  <option value="user">عضو عادي (User)</option>
                  <option value="moderator">مشرف منصة (Moderator)</option>
                  <option value="admin">مالك ومدير منصة (Admin)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">تصنيف العضوية:</label>
                <select
                  value={editingUser.membershipTier || 'عضو عادي'}
                  onChange={(e) => setEditingUser({ ...editingUser, membershipTier: e.target.value as UserMembershipTier })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                >
                  <option value="عضو عادي">عضو عادي</option>
                  <option value="عضو موثق">عضو موثق</option>
                  <option value="عضو مشترك">عضو مشترك</option>
                  <option value="تاجر موثوق">تاجر موثوق</option>
                  <option value="عضو مميز">عضو مميز</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">درجة التقييم الحالي (0.0 - 5.0):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingUser.rating}
                    onChange={(e) => setEditingUser({ ...editingUser, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">عدد المقايضات المكتملة:</label>
                  <input
                    type="number"
                    min="0"
                    value={editingUser.completedBartersCount}
                    onChange={(e) => setEditingUser({ ...editingUser, completedBartersCount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">رابط صورة الحساب (Avatar):</label>
                <input
                  type="text"
                  value={editingUser.avatar}
                  onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono outline-hidden text-[11px]"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.isActive ?? true}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#8c5332]"
                  />
                  <span>تفعيل الحساب (تفعيل العضو لمكافحة السبام)</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.verified}
                    onChange={(e) => setEditingUser({ ...editingUser, verified: e.target.checked })}
                    className="w-4 h-4 accent-[#8c5332]"
                  />
                  <span>حساب موثق بهوية رقمية</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#8c5332] text-white font-bold py-2.5 rounded-xl hover:bg-[#734123] cursor-pointer shadow-xs"
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT REVIEW */}
      {editingReview && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">تعديل تقييم العضو: {editingReview.targetUserName}</h3>
              <button onClick={() => setEditingReview(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                adminUpdateReview(editingReview.id, {
                  rating: editingReview.rating,
                  comment: editingReview.comment
                });
                setEditingReview(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-2">عدد النجوم (1 إلى 5):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditingReview({ ...editingReview, rating: star })}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= editingReview.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-extrabold text-amber-600 mr-2 text-sm">{editingReview.rating} من 5</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نص الملاحظات والتعليق:</label>
                <textarea
                  rows={3}
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  placeholder="اكتب ملاحظات التقييم..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#8c5332] text-white font-bold py-2.5 rounded-xl hover:bg-[#734123] cursor-pointer shadow-xs"
                >
                  تحديث التقييم
                </button>
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CONTRACT */}
      {editingContract && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-slate-900">تعديل العقد رقم: {editingContract.contractNumber}</h3>
            
            <form onSubmit={handleSaveContractEdit} className="space-y-3 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">حالة العقد القانونية:</label>
                <select
                  value={editingContract.status}
                  onChange={(e) => setEditingContract({ ...editingContract, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold outline-hidden"
                >
                  <option value="موثق ومعتمد">موثق ومعتمد</option>
                  <option value="قيد المراجعة والمعاينة">قيد المراجعة والمعاينة</option>
                  <option value="مكتمل ومسلم">مكتمل ومسلم</option>
                  <option value="ملغى">ملغى</option>
                </select>
              </div>

              {/* Party A info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-[#734123]">الطرف الأول:</span>
                <input
                  type="text"
                  value={editingContract.partyA.name}
                  onChange={(e) => setEditingContract({
                    ...editingContract,
                    partyA: { ...editingContract.partyA, name: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                  placeholder="اسم الطرف الأول"
                />
                <input
                  type="text"
                  value={editingContract.partyA.itemTitle}
                  onChange={(e) => setEditingContract({
                    ...editingContract,
                    partyA: { ...editingContract.partyA, itemTitle: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  placeholder="سلعة الطرف الأول"
                />
              </div>

              {/* Party B info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-teal-700">الطرف الثاني:</span>
                <input
                  type="text"
                  value={editingContract.partyB.name}
                  onChange={(e) => setEditingContract({
                    ...editingContract,
                    partyB: { ...editingContract.partyB, name: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                  placeholder="اسم الطرف الثاني"
                />
                <input
                  type="text"
                  value={editingContract.partyB.itemTitle}
                  onChange={(e) => setEditingContract({
                    ...editingContract,
                    partyB: { ...editingContract.partyB, itemTitle: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  placeholder="سلعة الطرف الثاني"
                />
              </div>

              {/* Cash diff */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">فارق السعر النقدي المعوض (ريال):</label>
                <input
                  type="number"
                  value={editingContract.cashDifferenceAmount}
                  onChange={(e) => setEditingContract({ ...editingContract, cashDifferenceAmount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-700 cursor-pointer"
                >
                  حفظ تغييرات العقد
                </button>
                <button
                  type="button"
                  onClick={() => setEditingContract(null)}
                  className="px-4 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
