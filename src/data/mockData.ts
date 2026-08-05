import { User, BarterItem, TradeOffer, BarterContract, PlatformSettings, CategoryItem, ItemQuestion, TradeNegotiationMessage, UserReview } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_1',
    name: 'أحمد العتيبي (مالك المنصة)',
    email: 'crazyretiree@gmail.com',
    password: '054422516',
    isOwner: true,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    city: 'الرياض',
    phone: '0501234567',
    verified: true,
    rating: 4.9,
    completedBartersCount: 8,
    isActive: true,
    membershipTier: 'عضو موثق',
  },
  {
    id: 'usr_2',
    name: 'سارة الشمري',
    email: 'sara@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    city: 'جدة',
    phone: '0559876543',
    verified: true,
    rating: 4.8,
    completedBartersCount: 5,
    isActive: true,
    membershipTier: 'عضو مشترك',
    role: 'moderator',
  },
  {
    id: 'usr_3',
    name: 'خالد الدوسري',
    email: 'khaled@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    city: 'الدمام',
    phone: '0533334444',
    verified: true,
    rating: 5.0,
    completedBartersCount: 12,
    isActive: true,
    membershipTier: 'عضو موثق',
  },
  {
    id: 'usr_4',
    name: 'فيصل الغامدي',
    email: 'faisal@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    city: 'المدينة المنورة',
    phone: '0541122334',
    verified: false,
    rating: 4.6,
    completedBartersCount: 3,
    isActive: true,
    membershipTier: 'عضو عادي',
  }
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat_1', name: 'إلكترونيات وأجهزة', icon: 'Laptop', itemCount: 14, description: 'أجهزة كمبيوتر، هواتف، كاميرات، وشاشات' },
  { id: 'cat_2', name: 'ساعات ومستلزمات شخصية', icon: 'Watch', itemCount: 8, description: 'ساعات إلكترونية وكلاسيكية وعطور ونظارات' },
  { id: 'cat_3', name: 'أثاث ومستلزمات منزل', icon: 'Armchair', itemCount: 9, description: 'كراسي مريحة، مكاتب، وأجهزة منزلية' },
  { id: 'cat_4', name: 'آلات موسيقية', icon: 'Music', itemCount: 5, description: 'عود، جيتار، أورج، وملحقات صوتية' },
  { id: 'cat_5', name: 'ألعاب ورياضة', icon: 'Gamepad2', itemCount: 11, description: 'منصات ألعاب، دراجات، وأجهزة لياقة' },
  { id: 'cat_6', name: 'سيارات ومركبات', icon: 'Car', itemCount: 4, description: 'قطع غيار، دراجات نارية، وملحقات سيارات' },
  { id: 'cat_7', name: 'كتب ومقتنيات نادرة', icon: 'BookOpen', itemCount: 7, description: 'كتب قيمة، لوحات، ومقتنيات أثرية' },
];

export const INITIAL_SETTINGS: PlatformSettings = {
  siteName: 'مقايضة',
  siteDescription: 'المنصة السعودية الذكية لتبادل السلع والمنتجات وإصدار العقود الإلكترونية الموثقة',
  
  // Master Toggles
  showHeader: true,
  showFooter: true,

  // Registration & User Activation Policy
  autoActivateNewUsers: true,

  // Theme & Appearance
  themeColor: 'brown',
  
  // Homepage Display Limits
  homeItemsLimit: 6,
  
  // Header Granular Controls
  showHeaderTopNotice: false,
  headerNotice: 'أهلاً بك في منصة مقايضة - جميع التبادلات محمية بعقود إلكترونية رسمية مع فترة فحص ومعاينة',
  showHeaderLogo: true,
  showHeaderDescription: true,
  showHeaderSearch: true,
  showHeaderCityFilter: true,
  showHeaderAddItemBtn: true,
  showHeaderContractsBtn: true,
  showHeaderOffersBtn: true,
  showHeaderUserSwitcher: true,
  showHeaderAdminBtn: true,
  
  // Hero Banner Granular Controls
  showHeroBanner: true,
  heroBadgeText: 'منصة مقايضة كاملة',
  heroTitle: 'قايض وفاوض بما تحتاجه',
  heroSubtitle: 'منصة تتيح لك عرض منتجاتك او مهارتك ومقايضتها بما تحتاجه مباشرة مع الآخرين – بكل بساطة وأمان.',
  showHeroSteps: true,
  showHeroImage: true,
  heroImageUrl: '',

  // Modern Feature Boxes
  showFeatureBoxes: true,
  featureBoxes: [
    {
      id: 'fb_1',
      title: 'عقود إلكترونية رسمية موثقة',
      description: 'تولد المنصة تلقائياً عقداً رسمياً برقم تسلسلي ورمز QR يحفظ حقوق الطرفين وفوارق المبالغ النقدية.',
      icon: 'FileCheck2'
    },
    {
      id: 'fb_2',
      title: 'مهلة المعاينة والفحص المباشر',
      description: 'فترة معاينة لمدة 3 أيام عمل من تاريخ استلام السلعة لضمان سلامة وصف وشروط المقايضة.',
      icon: 'ShieldCheck'
    },
    {
      id: 'fb_3',
      title: 'تبادل مباشر وبدون عمولات خفية',
      description: 'تصفح كافة المنتجات مجاناً، أضف عرضك، وتواصل مع أصحاب السلع بشرعية وأمان تام.',
      icon: 'ArrowLeftRight'
    }
  ],

  // Product Grid Display Controls
  expandProductGridWidth: false,
  productGridCols: '4',
  
  // Footer Granular Controls & Styling
  showFooterLogo: true,
  footerText: 'منصة مقايضة الرائدة لتبادل المقتنيات والأجهزة الذكية بالعقود الإلكترونية الموثقة في المملكة العربية السعودية.',
  footerDescription: 'أول منصة سعودية متخصصة في تنظيم عمليات المقايضة التبادلية بين الأفراد والشركات مع توثيق العقود وتوفير ضمان المعاينة.',
  showFooterContacts: true,
  contactEmail: 'support@moqayada.sa',
  contactPhone: '920001234',
  contactWhatsapp: '966501234567',
  contactAddress: 'الرياض - طريق الملك فهد، برج المبتكرين',
  showFooterQuickLinks: true,
  showFooterRights: true,
  footerCopyrightText: 'جميع الحقوق محفوظة © 2026 منصة مقايضة لتقنية المعلومات - سجل تجاري معتمد',
  footerBgTheme: 'light',

  // Social Media Links
  showFooterSocialLinks: true,
  twitterUrl: 'https://x.com/moqayada',
  instagramUrl: 'https://instagram.com/moqayada',
  whatsappUrl: 'https://wa.me/966501234567',
  telegramUrl: 'https://t.me/moqayada',
  youtubeUrl: 'https://youtube.com/moqayada',

  // Legal & Policy Pages
  showFooterPolicyLinks: true,

  showTermsLink: true,
  termsTitle: 'الشروط والأحكام الاستخدام',
  termsContent: `1. الشروط العامة للاستخدام:
يُعد استخدام منصة (مقايضة) موافقة كاملة وغير مشروطة على كافة الشروط والأحكام المدونة في هذه الوثيقة. المنصة مخصصة لتسهيل عمليات التبادل التجاري والمقايضة المباشرة بين الأطراف بحسن نية.

2. الأهلية والمصداقية:
يشترط في مستخدم المنصة أن يكون بكامل الأهلية الشرعية والنظامية للتصرف، ويتحمل مسؤولية صحة البيانات الشخصية ووصف السلع المعروضة بدقة تامة دون تضليل أو إخفاء للعيوب.

3. السلع المحظورة:
يُحظر منعاً باتاً عرض أو طلب مقايضة أي سلع أو خدمات غير مجازة شرعاً أو نظاماً داخل المملكة العربية السعودية، كالأدوية المقيدة، المواد الخطرة، أو الأسلحة والمنتجات غير النظامية.

4. العقود الإلكترونية الموثقة:
تعتبر العقود الإلكترونية الصادرة عبر المنصة سنداً رسمياً متفقاً عليه بين الطرفين فور التوقيع الرقمي، وتخضع لأنظمة التعاملات الإلكترونية في المملكة.

5. إلغاء الحسابات والتعويض:
تحتفظ إدارة المنصة بحق إيقاف أو حظر أي حساب يخالف شروط الاستخدام أو يقدم بلاغات كاذبة أو يتعمد الإضرار بالمستخدمين الآخرين.`,

  showPrivacyLink: true,
  privacyTitle: 'سياسة الخصوصية وسرية البيانات',
  privacyContent: `1. جمع البيانات الشخصية:
نقوم بجمع البيانات الضرورية لتقديم خدمة المقايضة بأعلى درجات الأمان، وتشمل: الاسم، رقم الجوال، البريد الإلكتروني، والمدينة، وذلك لغرض إنشاء عقود المقايضة والتواصل بين الطرفين.

2. حماية وتشفير البيانات:
تلتزم منصة (مقايضة) بتطبيق أعلى معايير الأمان والتشفير لحماية بيانات المستخدمين الشخصية والعقود الصادرة من الوصول غير المصرح به أو التسريب.

3. مشاركة البيانات:
لا نقوم ببيع أو مشاركة بياناتك الشخصية مع أي أطراف ثالثة لأغراض تسويقية. يتم مشاركة معلومات التواصل الأساسية فقط بين طرفي عقد المقايضة المكتمل لغرض إتمام الشحن والتسليم.

4. ملفات تعريف الارتباط (Cookies):
تستخدم المنصة ملفات تعريف الارتباط لتحسين تجربة التصفح وحفظ تفضيلات المستخدم أثناء استخدام التطبيق.

5. التحديثات والتعديلات:
تحتفظ المنصة بحق تحديث سياسة الخصوصية وتعديلها عند الحاجة، ويتم إشعار المستخدمين بأي تغييرات جوهرية عبر الصفحة الرئيسية.`,

  showCommissionLink: true,
  commissionTitle: 'نسبة العمولة ورسوم الخدمة',
  commissionContent: `1. مجانية التصفح والعروض:
إن عملية التسجيل، تصفح المنتجات والسلع المعروضة، ونشر عروض المقايضة هي خدمة مجانية بالكامل 100% لجميع مستخدمي المنصة.

2. نسبة عمولة المنصة:
تتقاضى المنصة عمولة رمزية قدرها (2.5%) فقط من القيمة التقديرية للسلعة المقايض بها، أو من مبلغ الفارق النقدي المتفق عليه، وذلك لتغطية تكاليف التوثيق الإلكتروني وخدمة الضمان والاصدار الرقمي للعقد.

3. طريقة السداد والتسوية:
تُستحق العمولة عند التوقيع النهائي على عقد المقايضة الإلكتروني واعتتماد الصفقة بين الطرفين، ويمكن سدادها عبر وسائل الدفع الإلكتروني المعتمدة بالمنصة (مدى، الفيزا، أبل باي).

4. ضمان واسترجاع العمولة:
في حال إلغاء الصفقة خلال مهلة الفحص والمعاينة (3 أيام) بسبب عدم مطابقة السلعة للوصف، تقوم المنصة بإعادة مبلغ العمولة لحساب المستخدم المتضرر وفقاً لسياسة الضمان.`,
  
  primaryColor: 'indigo',
  
  // E-Contract Field-by-Field Controls & Texts
  showContractPreamble: true,
  contractPreamble: 'إنه في يوم المقايضة المحدد، وبموجب هذا العقد الإلكتروني المعتمد عبر منصة (مقايضة)، اتفق الطرفان بكامل أهليتهما المعتبرة شرعاً وقانوناً على تبادل السلع المبينة أدناه وفقاً للشروط والأحكام المدونة.',
  
  showContractInspectionClause: true,
  contractInspectionClause: 'يحق لكلا الطرفين مهلة معاينة وفحص لمدة 3 أيام عمل تبدأ من تاريخ التسليم الفعلي للسلعة للتحقق من سلامتها ومطابقتها للمواصفات.',
  
  showContractCashClause: true,
  contractCashClause: 'في حال وجود فارق سعر نقدي متفق عليه، يلتزم الطرف المحرر عليه السداد بتأدية المبلغ المذكور عند التوقيع أو استلام السلعة.',
  
  showContractIdentityClause: true,
  contractIdentityClause: 'يعتبر التوقيع الرقمي الصادر عبر المنصة بمثابة توثيق قانوني رسمي ملزم لكلا الطرفين ويعادل التوقيع اليدوي أمام الجهات ذات الاختصاص.',
  
  showContractPenaltyClause: true,
  contractPenaltyClause: 'في حال التراجع غير المبرر بعد التوقيع أو تسليم سلعة تالفة تخالف الوصف، يحظر حساب المستخدم ويتحمل التعويضات الناجمة.',
  
  showContractDisputeClause: true,
  contractDisputeClause: 'تختص الجهات القضائية والرسمية في المملكة العربية السعودية بالنظر في أي خلاف ينشأ عن تنفيذ بنود هذا العقد.',
  
  customContractTerms: [
    'يلتزم كل طرف بتسليم السلعة بالحالة الواردة في وصف الإعلان دون إخفاء أي عيوب.',
    'في حال اختلاف السلعة المسلمة عن الوصف المعتمد، يحق للطرف المتضرر إلغاء المقايضة وإعادة السلعة.',
    'يعد هذا العقد سنداً إلكترونياً ملزماً للطرفين فور الاعتماد الرقمي من الطرفين عبر المنصة.'
  ],

  // Item Submission Form Field Settings
  addItemShowTitle: true,
  addItemTitleLabel: 'عنوان السلعة *',
  addItemTitlePlaceholder: 'مثلاً: كاميرا نيكون Z6، أو بلايستيشن 5...',
  addItemTitleRequired: true,

  addItemShowCategory: true,
  addItemCategoryLabel: 'الفئة *',
  addItemCategoryRequired: true,

  addItemShowCondition: true,
  addItemConditionLabel: 'حالة السلعة *',
  addItemConditionRequired: true,
  addItemConditionOptions: [
    'جديد (بالكرتون)',
    'ممتاز كالجديد',
    'مستعمل بحالة جيدة',
    'مستعمل مع خدوش بسيطة'
  ],

  addItemShowEstimatedValue: true,
  addItemEstimatedValueLabel: 'القيمة التقديرية (بالريال) (اختياري)',
  addItemEstimatedValueRequired: false,

  addItemShowDescription: true,
  addItemDescriptionLabel: 'الوصف التفصيلي والملحقات *',
  addItemDescriptionPlaceholder: 'اذكر حالة السلعة، مدة الاستخدام، الملحقات المتوفرة...',
  addItemDescriptionRequired: true,

  addItemShowLocation: true,
  addItemLocationLabel: 'المدينة والمنطقة *',
  addItemLocationRequired: true,

  addItemShowDeliveryPref: true,
  addItemDeliveryPrefLabel: 'تفضيل التسليم *',
  addItemDeliveryPrefRequired: true,
  addItemDeliveryOptions: [
    'استلام يدوي',
    'شحن بريدي',
    'كلاهما يفي بالغرض'
  ],

  addItemShowDesiredItem: true,
  addItemDesiredItemLabel: 'وصف السلعة المطلوب مقايضتها بالمقابل *',
  addItemDesiredItemPlaceholder: 'اكتب بشكل مبسط ماذا تطلب بالمقابل (مثلاً: أبحث عن جهاز آيباد برو أو كاميرا احترافية أو أي عرض مناسب)...',
  addItemDesiredItemRequired: true,

  addItemShowCashDiffOption: true,
  addItemCashDiffLabel: 'أقبل دفع فارق / استلام فارق سعري',

  addItemShowImageUpload: true,
  addItemImageUploadLabel: 'رفع صورة السلعة * (إجباري لنشر العرض)',
  addItemImageUploadRequired: true,
  
  enableCashDifference: true,
  maxCashDifferenceLimit: 10000,
  enableInspectionGuarantee: true,
  inspectionDays: 3,
  enableIdentityVerificationRequired: true,
  enableDirectShipping: true,
  barterCommissionRate: 0,
  maintenanceMode: false,
};

export const INITIAL_ITEMS: BarterItem[] = [
  {
    id: 'item_101',
    title: 'بلايستيشن 5 إصدار الأقراص + ذراعين تحكم إضافية',
    category: 'إلكترونيات وأجهزة',
    description: 'جهاز بلايستيشن 5 بحالة ممتازة جداً، نظيف للغاية واستخدام خفيف. يأتي مع الكرتون وجميع الكابلات وذراعين تحكم أصلية ولعبة FIFA 24.',
    condition: 'ممتاز كالجديد',
    estimatedValue: 2200,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800'
    ],
    location: 'الرياض - حي الياسمين',
    ownerId: 'usr_1',
    status: 'active',
    createdAt: '2026-07-28',
    desiredCategory: 'إلكترونيات وأجهزة',
    desiredDescription: 'أبحث عن آيباد برو iPad Pro (M1 أو M2) مع القلم أو لاب توب ماك بوك بحالة ممتازة',
    allowCashDifference: true,
    maxCashDifference: 1000,
    deliveryPreference: 'استلام يدوي',
    views: 142,
    likes: 19,
  },
  {
    id: 'item_102',
    title: 'آيباد برو iPad Pro 11-inch M2 (256GB) مع قلم آبل الجيل الثاني',
    category: 'إلكترونيات وأجهزة',
    description: 'آيباد برو الشريحة M2 مساحة 256 جيجابايت لون رمادي فلكي. الجهاز خالي تماماً من الخدوش ومعه حماية شاشة كاسبر وكفر حماية أصلي وقلم Apple Pencil 2.',
    condition: 'جديد (بالكرتون)',
    estimatedValue: 3100,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=800'
    ],
    location: 'جدة - حي الشاطئ',
    ownerId: 'usr_2',
    status: 'active',
    createdAt: '2026-07-29',
    desiredCategory: 'إلكترونيات وأجهزة',
    desiredDescription: 'مقايضة مقابل كاميرا احترافية سوني Sony A7 III أو كاميرا كانون بحالة ممتازة أو بلايستيشن 5 مع فارق بسيط',
    allowCashDifference: true,
    maxCashDifference: 800,
    deliveryPreference: 'كلاهما يفي بالغرض',
    views: 210,
    likes: 34,
  },
  {
    id: 'item_103',
    title: 'ساعة آبل هيرمس الذكية Apple Watch Ultra 2 (49mm)',
    category: 'ساعات ومستلزمات شخصية',
    description: 'ساعة آبل ألترا 2 بحالة الوكالة مع سوار التيتانيوم الأصلي وسوار القماش الرياضي. نسبة البطارية 98% وتدعم الاتصال الخليوي.',
    condition: 'ممتاز كالجديد',
    estimatedValue: 2800,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
    ],
    location: 'الدمام - حي الشاطئ',
    ownerId: 'usr_3',
    status: 'active',
    createdAt: '2026-07-25',
    desiredCategory: 'أثاث ومستلزمات منزل',
    desiredDescription: 'مقايضة بمكتب هيرمان ميلر Herman Miller أو كراسي ألعاب احترافية ممتازة + آيفون 13 أو ما يماثله',
    allowCashDifference: true,
    maxCashDifference: 1500,
    deliveryPreference: 'شحن بريدي',
    views: 185,
    likes: 27,
  },
  {
    id: 'item_104',
    title: 'عود شرقي احترافي خشب زان وسيدار صناعة صانع معروف',
    category: 'آلات موسيقية',
    description: 'عود شرقي ذو صوت دافئ ورخيم جداً، أوتار لابيلا جديدة مع حقيبة مبطنة حامية ومجموعة أرياش احترافية.',
    condition: 'مستعمل بحالة جيدة',
    estimatedValue: 1800,
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
    ],
    location: 'الرياض - حي النفل',
    ownerId: 'usr_1',
    status: 'active',
    createdAt: '2026-07-20',
    desiredCategory: 'كتب ومقتنيات نادرة',
    desiredDescription: 'أطلب مقايضته بساعة كلاسيكية فاخرة أو مجموعة كتب وموسوعات نادرة أو آلة جيتار صوتي عالي الجودة',
    allowCashDifference: true,
    maxCashDifference: 500,
    deliveryPreference: 'استلام يدوي',
    views: 98,
    likes: 12,
  },
  {
    id: 'item_105',
    title: 'كرسي مريح هيرمان ميلر Herman Miller Ergonomic Chair',
    category: 'أثاث ومستلزمات منزل',
    description: 'كرسي مخصص لداعم الظهر والمكاتب، مريح للجلوس الطويل. جميع المفاصل والمساند تعمل بكفاءة عالية.',
    condition: 'مستعمل بحالة جيدة',
    estimatedValue: 2400,
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&q=80&w=800'
    ],
    location: 'جدة - حي الحمراء',
    ownerId: 'usr_2',
    status: 'active',
    createdAt: '2026-07-22',
    desiredCategory: 'ساعات ومستلزمات شخصية',
    desiredDescription: 'أرغب بمقايضته بساعة آبل ألترا أو هاتف آيفون 14 بحالة ممتازة',
    allowCashDifference: true,
    maxCashDifference: 1000,
    deliveryPreference: 'استلام يدوي',
    views: 165,
    likes: 22,
  },
  {
    id: 'item_106',
    title: 'دراجة هوائية جبلية Trek Marlin 7 إطار ألومنيوم',
    category: 'ألعاب ورياضة',
    description: 'دراجة ماركة Trek مقاس L، سرعات شيمانو 18 سرعة، فرامل هيدروليكية، مناسبة للمسارات الجبلية والأسفلت.',
    condition: 'ممتاز كالجديد',
    estimatedValue: 1950,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800'
    ],
    location: 'المدينة المنورة',
    ownerId: 'usr_4',
    status: 'active',
    createdAt: '2026-07-26',
    desiredCategory: 'إلكترونيات وأجهزة',
    desiredDescription: 'أطلب شاشة كمبيوتر جيمنج 4K أو جهاز بلايستيشن 5 أو دراجة أخرى احترافية',
    allowCashDifference: true,
    maxCashDifference: 600,
    deliveryPreference: 'استلام يدوي',
    views: 112,
    likes: 15,
  }
];

export const INITIAL_QUESTIONS: ItemQuestion[] = [
  {
    id: 'q_1',
    itemId: 'item_101',
    userId: 'usr_2',
    userName: 'سارة الشمري',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    question: 'السلام عليكم، هل الكرتون والضمان موجودين مع السوني؟ وكم متبقي في الضمان؟',
    createdAt: '2026-07-28 14:30',
    answer: 'وعليكم السلام ورحمة الله، نعم الكرتون بكامل الملحقات موجود، والضمان متبقي فيه 6 أشهر من الوكيل عصر الجوال.',
    answeredAt: '2026-07-28 15:10'
  },
  {
    id: 'q_2',
    itemId: 'item_101',
    userId: 'usr_3',
    userName: 'خالد الدوسري',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    question: 'هل تقبل المقايضة بساعة آبل ألترا 2 مع دفع فارق بسيط من طرفك؟',
    createdAt: '2026-07-29 09:20',
    answer: 'أهلاً بك أخي خالد، نعم الفكرة ممتازة! يرجى تقديم العرض عبر زر تقديم المقايضة لدراسته.',
    answeredAt: '2026-07-29 10:00'
  },
  {
    id: 'q_3',
    itemId: 'item_102',
    userId: 'usr_1',
    userName: 'أحمد العتيبي',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    question: 'حياك اختي سارة، هل القلم أصلي Apple Pencil 2 ودعامة الشحن تعمل بشكل طبيعي؟',
    createdAt: '2026-07-29 16:45',
    answer: 'أهلاً بك، نعم القلم أصلي 100% ويعمل بالشحن المغناطيسي المباشر بدون أي مشاكل.',
    answeredAt: '2026-07-29 17:05'
  }
];

export const INITIAL_OFFERS: TradeOffer[] = [
  {
    id: 'off_1',
    targetItemId: 'item_101', // بلايستيشن 5 (أحمد)
    offeredItemId: 'item_102', // آيباد برو (سارة)
    offeredByUserId: 'usr_2',
    targetOwnerUserId: 'usr_1',
    cashDifference: -900, // سارة تطلب 900 ريال فارق لأن الآيباد قيمته أعلى
    note: 'عرض مقايضة الآيباد برو M2 بكامل ملحقاته مع القلم مقابل البلايستيشن 5 ودفع فارق 900 ريال لصالحي.',
    status: 'pending',
    createdAt: '2026-07-30 11:15',
    deliveryMethod: 'استلام يدوي',
  },
  {
    id: 'off_2',
    targetItemId: 'item_103', // ساعة آبل ألترا (خالد)
    offeredItemId: 'item_105', // كرسي هيرمان ميلر (سارة)
    offeredByUserId: 'usr_2',
    targetOwnerUserId: 'usr_3',
    cashDifference: 400, // سارة تدفع 400 ريال فارق لخالد
    note: 'عرض كرسي هيرمان ميلر المريح بحالة ممتازة مقابل الساعة مع دفع 400 ريال فارق نقدي.',
    status: 'completed',
    createdAt: '2026-07-27 18:00',
    deliveryMethod: 'شحن بريدي',
    offeredBySigned: true,
    targetOwnerSigned: true,
    contractId: 'cnt_88192'
  }
];

export const INITIAL_NEGOTIATIONS: TradeNegotiationMessage[] = [
  {
    id: 'msg_1',
    offerId: 'off_1',
    senderId: 'usr_2',
    senderName: 'سارة الشمري',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    text: 'أهلاً أخي أحمد، أرسلت لك عرض المقايضة لـ الآيباد برو M2 مقابل البلايستيشن 5 مع فارق 900 ريال. الآيباد قيمته أعلى ومع القلم والجراب الأصلي.',
    createdAt: '2026-07-30 11:16'
  },
  {
    id: 'msg_2',
    offerId: 'off_1',
    senderId: 'usr_1',
    senderName: 'أحمد العتيبي',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    text: 'حياكِ الله أختي سارة، العرض ممتاّز. هل التسليم في الرياض أم جدة؟ وكيف حالة الشاشة هل عليها حماية؟',
    createdAt: '2026-07-30 11:30'
  },
  {
    id: 'msg_3',
    offerId: 'off_1',
    senderId: 'usr_2',
    senderName: 'سارة الشمري',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    text: 'الشاشة عليها حماية نانو وفحص الشحن ممتاز. أختي موجودة بالرياض وتستطيع تسليمك الجهاز يد ليد في حي الياسمين لمعاينته قبل الموافقة.',
    createdAt: '2026-07-30 11:45'
  }
];

export const INITIAL_CONTRACTS: BarterContract[] = [
  {
    id: 'cnt_88192',
    contractNumber: 'BARTER-2026-88192',
    offerId: 'off_2',
    partyA: {
      userId: 'usr_2',
      name: 'سارة الشمري',
      phone: '0559876543',
      city: 'جدة',
      itemId: 'item_105',
      itemTitle: 'كرسي مريح هيرمان ميلر Herman Miller Ergonomic Chair',
      itemEstimatedValue: 2400,
      signatureDate: '2026-07-27 18:05'
    },
    partyB: {
      userId: 'usr_3',
      name: 'خالد الدوسري',
      phone: '0533334444',
      city: 'الدمام',
      itemId: 'item_103',
      itemTitle: 'ساعة آبل هيرمس الذكية Apple Watch Ultra 2 (49mm)',
      itemEstimatedValue: 2800,
      signatureDate: '2026-07-27 18:20'
    },
    cashDifferenceAmount: 400,
    cashPayerUserId: 'usr_2',
    deliveryMethod: 'شحن بريدي معتمد مع فترة فحص 3 أيام',
    termsAndConditions: [
      'التزم الطرف الأول (سارة الشمري) بتسليم الكرسي المكتبي بحالته الموضحة بدون عيوب هيكلية خفية.',
      'التزم الطرف الثاني (خالد الدوسري) بتسليم ساعة آبل ألترا 2 بكامل الملحقات ونسبة بطارية لا تقل عن 98%.',
      'قام الطرف الأول بدفع مبلغ فارق السعر المقدر بـ 400 ريال سعودي للطرف الثاني.',
      'يسري ضمان الفحص والمعاينة لمدة 3 أيام تبدأ من تاريخ استلام السلعتين.'
    ],
    issuedAt: '2026-07-27 18:21',
    qrCodeSeed: 'MOQAYADA-VERIFIED-CONTRACT-88192-2026',
    status: 'نشط وموثق'
  }
];

export const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev_1',
    offerId: 'off_101',
    contractId: 'cnt_1001',
    reviewerId: 'usr_2',
    reviewerName: 'سارة الشمري',
    reviewerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    targetUserId: 'usr_1',
    targetUserName: 'أحمد العتيبي (مالك المنصة)',
    rating: 5,
    comment: 'تعامل راقي جداً والسلعة مطابقة للمواصفات تماماً، أنصح بالتعامل معه.',
    createdAt: '2026-07-28 14:30'
  },
  {
    id: 'rev_2',
    offerId: 'off_102',
    contractId: 'cnt_1002',
    reviewerId: 'usr_1',
    reviewerName: 'أحمد العتيبي (مالك المنصة)',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    targetUserId: 'usr_3',
    targetUserName: 'خالد الدوسري',
    rating: 5,
    comment: 'سرعة في الاستجابة والتسليم كان حسب الاتفاق، مقايضة ناجحة.',
    createdAt: '2026-08-01 19:15'
  }
];
