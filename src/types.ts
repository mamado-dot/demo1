export type ItemCondition = 'جديد (بالكرتون)' | 'ممتاز كالجديد' | 'مستعمل بحالة جيدة' | 'مستعمل مع خدوش بسيطة';

export type ItemStatus = 'active' | 'in_deal' | 'bartered' | 'hidden';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'contract_pending' | 'completed' | 'cancelled';

export type CategoryName = 
  | 'إلكترونيات وأجهزة' 
  | 'سيارات ومركبات' 
  | 'أثاث ومستلزمات منزل' 
  | 'آلات موسيقية' 
  | 'ساعات ومستلزمات شخصية' 
  | 'ألعاب ورياضة' 
  | 'كتب ومقتنيات نادرة';

export type UserMembershipTier = 'عضو عادي' | 'عضو موثق' | 'عضو مشترك' | 'تاجر موثوق' | 'عضو مميز';

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  isOwner?: boolean;
  role?: 'user' | 'moderator' | 'admin';
  avatar: string;
  city: string;
  phone: string;
  verified: boolean;
  rating: number;
  completedBartersCount: number;
  isActive?: boolean;
  membershipTier?: UserMembershipTier;
}

export interface UserReview {
  id: string;
  offerId: string;
  contractId?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  targetUserId: string;
  targetUserName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface TradeNegotiationMessage {
  id: string;
  offerId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
}

export interface ItemQuestion {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  question: string;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
}

export interface BarterItem {
  id: string;
  title: string;
  category: CategoryName;
  description: string;
  condition: ItemCondition;
  estimatedValue: number; // بالريال السعودي
  images: string[];
  location: string;
  ownerId: string;
  status: ItemStatus;
  createdAt: string;
  
  // شروط وتطلعات المقايضة
  desiredCategory: string;
  desiredDescription: string;
  desiredImage?: string;
  allowCashDifference: boolean;
  maxCashDifference?: number; // أقصى فارق سعر مسموح به
  deliveryPreference: 'استلام يدوي' | 'شحن بريدي' | 'كلاهما يفي بالغرض';
  
  // إحصائيات
  views: number;
  likes: number;
}

export interface TradeOffer {
  id: string;
  targetItemId: string; // السلعة المعروضة الأصلية
  offeredItemId: string; // السلعة المقدمة للمقايضة
  offeredByUserId: string;
  targetOwnerUserId: string;
  cashDifference: number; // فارق السعر النقدي (+ تدفع للمستهدف، - تطلب من المستهدف)
  note: string;
  status: OfferStatus;
  createdAt: string;
  deliveryMethod: 'استلام يدوي' | 'شحن بريدي';
  
  // موافقات العقد
  offeredBySigned?: boolean;
  targetOwnerSigned?: boolean;
  contractId?: string;
}

export interface BarterContract {
  id: string;
  contractNumber: string; // e.g. BARTER-2026-9812
  offerId: string;
  partyA: {
    userId: string;
    name: string;
    phone: string;
    city: string;
    itemId: string;
    itemTitle: string;
    itemEstimatedValue: number;
    signatureDate: string;
  };
  partyB: {
    userId: string;
    name: string;
    phone: string;
    city: string;
    itemId: string;
    itemTitle: string;
    itemEstimatedValue: number;
    signatureDate: string;
  };
  cashDifferenceAmount: number; // المبلغ النقدي التعويضي
  cashPayerUserId?: string; // من يدفع الفارق
  deliveryMethod: string;
  termsAndConditions: string[];
  issuedAt: string;
  qrCodeSeed: string;
  status: 'نشط وموثق' | 'ملغى' | 'مكتمل التسليم';
}

export interface FeatureBox {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PlatformSettings {
  siteName: string;
  siteDescription: string;
  
  // Master Toggles
  showHeader: boolean;
  showFooter: boolean;

  // Theme & Appearance
  themeColor: 'brown' | 'indigo' | 'emerald' | 'blue' | 'slate' | 'amber' | 'rose' | 'dark';
  
  // Homepage Display Limits
  homeItemsLimit: number; // 0 = unlimited/all, 4, 6, 8, 12, 16, etc.
  
  // Header Granular Controls
  showHeaderTopNotice: boolean;
  headerNotice: string;
  showHeaderLogo: boolean;
  showHeaderDescription: boolean;
  showHeaderSearch: boolean;
  showHeaderCityFilter: boolean;
  showHeaderAddItemBtn: boolean;
  showHeaderContractsBtn: boolean;
  showHeaderOffersBtn: boolean;
  showHeaderUserSwitcher: boolean;
  showHeaderAdminBtn: boolean;
  
  // Hero Banner Controls
  showHeroBanner: boolean;
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  showHeroSteps: boolean;
  showHeroImage: boolean;
  heroImageUrl: string;

  // Modern Feature Boxes
  showFeatureBoxes: boolean;
  featureBoxes: FeatureBox[];

  // Product Grid Display Controls
  expandProductGridWidth: boolean;
  productGridCols: '3' | '4' | '5' | '6';
  
  // Footer Granular Controls & Styling
  showFooterLogo?: boolean;
  footerText?: string;
  footerDescription?: string;
  showFooterContacts?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactAddress?: string;
  showFooterQuickLinks?: boolean;
  showFooterRights?: boolean;
  footerCopyrightText?: string;
  footerBgTheme?: 'light' | 'dark' | 'brown' | 'slate';
  
  // Social Media Links
  showFooterSocialLinks?: boolean;
  twitterUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  telegramUrl?: string;
  youtubeUrl?: string;

  // Legal & Policy Pages
  showFooterPolicyLinks?: boolean;
  showTermsLink?: boolean;
  termsTitle?: string;
  termsContent?: string;

  showPrivacyLink?: boolean;
  privacyTitle?: string;
  privacyContent?: string;

  showCommissionLink?: boolean;
  commissionTitle?: string;
  commissionContent?: string;
  
  // Theme Accent
  primaryColor: 'indigo' | 'emerald' | 'blue' | 'slate' | 'amber';
  
  // E-Contract Field-by-Field Controls & Texts
  showContractPreamble: boolean;
  contractPreamble: string;
  
  showContractInspectionClause: boolean;
  contractInspectionClause: string;
  
  showContractCashClause: boolean;
  contractCashClause: string;
  
  showContractIdentityClause: boolean;
  contractIdentityClause: string;
  
  showContractPenaltyClause: boolean;
  contractPenaltyClause: string;
  
  showContractDisputeClause: boolean;
  contractDisputeClause: string;
  
  customContractTerms: string[];
  
  // Registration & User Activation Policy
  autoActivateNewUsers?: boolean;

  // Item Submission Form Field Settings (إعدادات نموذج إضافة السلع)
  addItemShowTitle?: boolean;
  addItemTitleLabel?: string;
  addItemTitlePlaceholder?: string;
  addItemTitleRequired?: boolean;

  addItemShowCategory?: boolean;
  addItemCategoryLabel?: string;
  addItemCategoryRequired?: boolean;

  addItemShowCondition?: boolean;
  addItemConditionLabel?: string;
  addItemConditionRequired?: boolean;
  addItemConditionOptions?: string[];

  addItemShowEstimatedValue?: boolean;
  addItemEstimatedValueLabel?: string;
  addItemEstimatedValueRequired?: boolean;

  addItemShowDescription?: boolean;
  addItemDescriptionLabel?: string;
  addItemDescriptionPlaceholder?: string;
  addItemDescriptionRequired?: boolean;

  addItemShowLocation?: boolean;
  addItemLocationLabel?: string;
  addItemLocationRequired?: boolean;

  addItemShowDeliveryPref?: boolean;
  addItemDeliveryPrefLabel?: string;
  addItemDeliveryPrefRequired?: boolean;
  addItemDeliveryOptions?: string[];

  addItemShowDesiredItem?: boolean;
  addItemDesiredItemLabel?: string;
  addItemDesiredItemPlaceholder?: string;
  addItemDesiredItemRequired?: boolean;

  addItemShowCashDiffOption?: boolean;
  addItemCashDiffLabel?: string;

  addItemShowImageUpload?: boolean;
  addItemImageUploadLabel?: string;
  addItemImageUploadRequired?: boolean;

  // Platform Rules
  enableCashDifference: boolean;
  maxCashDifferenceLimit: number;
  enableInspectionGuarantee: boolean;
  inspectionDays: number;
  enableIdentityVerificationRequired: boolean;
  enableDirectShipping: boolean;
  barterCommissionRate: number;
  maintenanceMode: boolean;
}

export interface CategoryItem {
  id: string;
  name: CategoryName;
  icon: string;
  itemCount: number;
  description: string;
}
