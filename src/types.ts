export type City = 'الرياض' | 'جدة' | 'الدمام' | 'مكة' | 'المدينة المنورة' | 'أبها' | 'الخبر';

export type ListingType = 'سلعة' | 'خدمة';

export interface User {
  id: string;
  name: string;
  avatar: string;
  city: City;
  rating: number;
  completedSwaps: number;
  reliabilityLevel: 'ممتاز' | 'جيد جداً' | 'مبتدئ';
  bio: string;
  isAdmin?: boolean;
  isBanned?: boolean;
  phone?: string;
  joinedDate?: string;
}

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  category: string;
  city: City;
  description: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ownerRating: number;
  ownerReliability: string;
  ownerAvatar: string;
  wantedInReturn: string; // What they want in return
  cashDifference?: string | number;
  createdAt: string;
  status: 'نشط' | 'مكتمل'; // active or completed
  isHidden?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface CustomBarterField {
  id: string;
  label: string;
  placeholder?: string;
  isEnabled: boolean;
  isRequired: boolean;
}

export interface BarterOptions {
  enableProducts?: boolean;
  enableServices?: boolean;
  enableCashDifference: boolean;
  enableOfferNote: boolean;
  enableProductSelection: boolean;
  enableSwapRating: boolean;
  enableFilterTabs: boolean;
  enableLocationField: boolean;
  enableDeliveryOption: boolean;
  enableInspectionOption: boolean;
  enableOfferCancel: boolean;
  customFields: CustomBarterField[];
}

export interface Chat {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImageUrl: string;
  listingWantedInReturn: string;
  offeredListingId?: string;
  offeredListingTitle?: string;
  offeredListingImageUrl?: string;
  cashDifferenceType?: 'none' | 'offerer_pays' | 'offerer_requests';
  cashDifferenceAmount?: number;
  offerNote?: string;
  deliveryLocation?: string;
  deliveryMethod?: string;
  requiresInspection?: boolean;
  customFieldsData?: Record<string, string>;
  otherUser: User;
  messages: Message[];
  offerStatus?: 'معلق' | 'مقبول' | 'مرفوض' | 'مكتمل'; // swap offer status
  offererConfirmed?: boolean;
  ownerConfirmed?: boolean;
  contractNumber?: string;
  contractDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'message' | 'offer' | 'rating' | 'match';
  relatedId?: string; // listingId, chatId, etc.
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ListingQuestion {
  id: string;
  listingId: string;
  askerId: string;
  askerName: string;
  askerAvatar: string;
  questionText: string;
  createdAt: string;
  replyText?: string;
  replyCreatedAt?: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  isActive: boolean;
  updatedAt: string;
}

export interface AdBanner {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl?: string;
  position: 'header' | 'footer';
  isActive: boolean;
  badgeText?: string;
}

export interface SiteSettings {
  homeListingsLimit: number;
  gridColumns?: number; // 2 | 3 | 4 | 5 (default 4 per row)
  showCategoryFilters?: boolean;
  showCityFilters?: boolean;
  showSearchFilter?: boolean;
  requireImageForListings: boolean;
  allowDirectPhoneContact: boolean;
  autoApproveListings: boolean;
  barterTermsNotice: string;
  maintenanceMode: boolean;
}

export interface BrandConfig {
  primaryColor: 'emerald' | 'blue' | 'purple' | 'rose' | 'amber' | 'brown';
  brandName: string;
  brandLogo: string;
  brandTagline: string;
  copyrightText: string;
  simulatedUsers: number;
  simulatedListings: number;
  simulatedSwaps: number;
  showHeaderNotice?: boolean;
  headerNoticeText?: string;
  showHeaderSearch?: boolean;
  showHeaderTagline?: boolean;
}



