import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ListingCard from './components/ListingCard';
import AddListingModal from './components/AddListingModal';
import MatchingEngine from './components/MatchingEngine';
import ChatSection from './components/ChatSection';
import ProfileSection from './components/ProfileSection';
import Onboarding from './components/Onboarding';
import AuthModal from './components/AuthModal';
import Simulator from './components/Simulator';
import ListingDetails from './components/ListingDetails';
import MySwaps from './components/MySwaps';
import MyProducts from './components/MyProducts';
import AdminPanel from './components/AdminPanel';
import BarterOfferModal from './components/BarterOfferModal';

import { User, Listing, Chat, Notification, Review, City, ListingQuestion, BrandConfig, CustomPage, AdBanner, SiteSettings, BarterOptions } from './types';
import { INITIAL_LISTINGS, MOCK_REVIEWS, CATEGORIES, CITIES, MOCK_USERS } from './data/mockData';
import { Search, Filter, Sparkles, RefreshCw, Grid, Check, ArrowLeftRight, MessageSquare, Shield } from 'lucide-react';
import { Language, translations } from './utils/translations';
import { 
  subscribeToListings, 
  addListingToDb, 
  updateListingInDb, 
  deleteListingFromDb, 
  subscribeToUsers, 
  saveUserToDb, 
  subscribeToChats, 
  saveChatToDb, 
  subscribeToQuestions, 
  saveQuestionToDb, 
  subscribeToSiteSettings, 
  saveSiteSettingsToDb,
  subscribeToPlatformSettings,
  savePlatformSettingsToDb
} from './services/firebaseService';

const INITIAL_QUESTIONS: ListingQuestion[] = [];

const THEME_COLORS = {
  emerald: {
    '--brand-50': '#ecfdf5',
    '--brand-100': '#d1fae5',
    '--brand-200': '#a7f3d0',
    '--brand-500': '#10b981',
    '--brand-600': '#059669',
    '--brand-700': '#047857',
    '--brand-800': '#065f46',
    '--brand-900': '#064e3b',
  },
  blue: {
    '--brand-50': '#eff6ff',
    '--brand-100': '#dbeafe',
    '--brand-200': '#bfdbfe',
    '--brand-500': '#3b82f6',
    '--brand-600': '#2563eb',
    '--brand-700': '#1d4ed8',
    '--brand-800': '#1e40af',
    '--brand-900': '#1e3a8a',
  },
  purple: {
    '--brand-50': '#faf5ff',
    '--brand-100': '#f3e8ff',
    '--brand-200': '#e9d5ff',
    '--brand-500': '#a855f7',
    '--brand-600': '#9333ea',
    '--brand-700': '#7e22ce',
    '--brand-800': '#6b21a8',
    '--brand-900': '#581c87',
  },
  rose: {
    '--brand-50': '#fff1f2',
    '--brand-100': '#ffe4e6',
    '--brand-200': '#fecdd3',
    '--brand-500': '#f43f5e',
    '--brand-600': '#e11d48',
    '--brand-700': '#be123c',
    '--brand-800': '#9f1239',
    '--brand-900': '#881337',
  },
  amber: {
    '--brand-50': '#fffbeb',
    '--brand-100': '#fef3c7',
    '--brand-200': '#fde68a',
    '--brand-500': '#f59e0b',
    '--brand-600': '#d97706',
    '--brand-700': '#b45309',
    '--brand-800': '#92400e',
    '--brand-900': '#78350f',
  },
  brown: {
    '--brand-50': '#fdfbf7',
    '--brand-100': '#f5ebd9',
    '--brand-200': '#ebdccb',
    '--brand-500': '#a16207',
    '--brand-600': '#925f38',
    '--brand-700': '#724624',
    '--brand-800': '#54331a',
    '--brand-900': '#38200f',
  }
};

const getCachedBrandConfig = (): BrandConfig => {
  try {
    const cached = localStorage.getItem('app_brand_config');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.primaryColor) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  return {
    primaryColor: 'brown',
    brandName: 'قايض',
    brandLogo: 'ق',
    brandTagline: 'منصة مقايضة كاملة',
    copyrightText: '© 2026 قايض للمقايضة - جميع الحقوق محفوظة لمجتمع المقايضة بأمان',
    simulatedUsers: 342,
    simulatedListings: 18,
    simulatedSwaps: 86,
  };
};

const applyThemeColorsLocally = (colorKey: string) => {
  const colors = THEME_COLORS[colorKey as keyof typeof THEME_COLORS] || THEME_COLORS.brown;
  if (typeof document !== 'undefined') {
    Object.entries(colors).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value as string);
    });
  }
};

// Synchronously apply cached colors before React mounts
const initialCachedBrand = getCachedBrandConfig();
applyThemeColorsLocally(initialCachedBrand.primaryColor);

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('app_current_user');
      if (cached) {
        const parsed: User = JSON.parse(cached);
        const isOwner = parsed.phone?.toLowerCase().includes('crazyretiree') || parsed.email?.toLowerCase().includes('crazyretiree') || parsed.name?.toLowerCase().includes('crazyretiree') || parsed.id === 'user_owner_crazyretiree';
        if (isOwner) {
          parsed.isAdmin = true;
          parsed.bio = parsed.bio || '';
          parsed.completedSwaps = parsed.completedSwaps ?? 100;
          parsed.reliabilityLevel = 'ممتاز';
        }
        return parsed;
      }
    } catch (e) {
      // ignore
    }
    return null;
  });
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [profileSubTab, setProfileSubTab] = useState<'listings' | 'reviews' | 'trust'>('listings');
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [homeListingsLimit, setHomeListingsLimit] = useState<number>(8);
  const [language, setLanguage] = useState<Language>('ar');
  const t = translations[language];

  // Tab switch guard
  const handleTabChange = (tab: string) => {
    if (!currentUser && ['add', 'chat', 'my_swaps', 'profile', 'admin'].includes(tab)) {
      setIsAuthModalOpen(true);
      return;
    }
    if (tab === 'profile') {
      setViewingUser(currentUser);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProfile = (userId: string, userName?: string, userAvatar?: string) => {
    let userObj = users.find(u => u.id === userId);
    if (!userObj && MOCK_USERS[userId]) {
      userObj = MOCK_USERS[userId];
    }
    if (!userObj) {
      const userListingsCount = listings.filter(l => l.ownerId === userId).length;
      userObj = {
        id: userId,
        name: userName || 'عضو بادل',
        avatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        city: 'الرياض',
        rating: 4.9,
        completedSwaps: Math.max(userListingsCount * 2, 5),
        reliabilityLevel: 'ممتاز',
        bio: 'عضو محقق وموثق في منصة بادل للمقايضة العادلة.',
      };
    }
    setViewingUser(userObj);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Custom Pages, Ad Banners & Site Settings states
  const [selectedCustomPage, setSelectedCustomPage] = useState<CustomPage | null>(null);
  const [customPages, setCustomPages] = useState<CustomPage[]>([
    {
      id: 'page_terms',
      slug: 'terms',
      title: 'شروط وقواعد المقايضة العادلة',
      content: 'نرحب بكم في منصة بادل للمقايضة العادلة.\n\n1. يجب أن تكون كافة السلع والخدمات المعروضة حقيقية ومملوكة لصاحب العرض.\n2. يُحظر تماماً تقديم أي سلع أو خدمات تخالف الأنظمة أو القوانين.\n3. التفتيش والفحص والتدقيق مسؤولية طرفي المقايضة عند الالتقاء أو إتمام الخدمة.\n4. نوصي باستعمال نظام المحادثات الداخلي الآمن لتوثيق جميع تفاصيل الاتفاق.',
      isActive: true,
      updatedAt: '2026-07-20'
    },
    {
      id: 'page_about',
      slug: 'about',
      title: 'عن منصة بادل للمقايضة',
      content: 'منصة بادل هي المنصة السعودية الأولى الرائدة في مجال المقايضة المباشرة للسلع والخدمات.\n\nهدفنا هو تمكين الجميع من الاستفادة من مهاراتهم ومنتجاتهم غير المستعملة وتبادلها بقيمة حقيقية دون الحاجة للمعاملات المالية المباشرة.',
      isActive: true,
      updatedAt: '2026-07-20'
    },
    {
      id: 'page_privacy',
      slug: 'privacy',
      title: 'سياسة الخصوصية وأمان البيانات',
      content: 'تلتزم إدارة المنصة بأعلى معايير حماية البيانات والخصوصية.\n\nلا نقوم بمشاركة أي من بيانات التواصل الخاصة بك مع أي طرف خارجي، وتتم المراسلات بخصوصية تامة عبر نفاذ وتوثيق الهوية الرقمية.',
      isActive: true,
      updatedAt: '2026-07-20'
    }
  ]);

  const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1556742049-0a679149226a?auto=format&fit=crop&w=800&q=80';

  const [adBanners, setAdBanners] = useState<AdBanner[]>(() => {
    try {
      const cached = localStorage.getItem('app_ad_banners');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    homeListingsLimit: 8,
    gridColumns: 4,
    showCategoryFilters: true,
    showCityFilters: true,
    showSearchFilter: true,
    requireImageForListings: false,
    allowDirectPhoneContact: true,
    autoApproveListings: true,
    barterTermsNotice: 'تذكر دائماً: المقايضة الناجحة تبدأ بذكر ما تملكه بوضوح وما تبحث عنه تحديداً.',
    maintenanceMode: false
  });

  const getGridColsClass = (cols?: number) => {
    switch (cols) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 5:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
      case 4:
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  const [barterOptions, setBarterOptions] = useState<BarterOptions>({
    enableProducts: true,
    enableServices: true,
    enableCashDifference: true,
    enableOfferNote: true,
    enableProductSelection: true,
    enableSwapRating: true,
    enableFilterTabs: true,
    enableLocationField: true,
    enableDeliveryOption: true,
    enableInspectionOption: true,
    enableOfferCancel: true,
    customFields: [
      { id: 'field_1', label: 'حالة الضمان والكرتون', placeholder: 'أدخل تفاصيل الضمان أو وجود الكرتون الأصلي', isEnabled: true, isRequired: false }
    ]
  });
  
  // Listing Q&A and Interest list states
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [questions, setQuestions] = useState<ListingQuestion[]>(INITIAL_QUESTIONS);
  const [interestedListings, setInterestedListings] = useState<string[]>([]);

  // Brand and Visual Configuration state (Cached locally + synced from Firebase)
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(getCachedBrandConfig);

  // Apply colors dynamically on primaryColor change
  useEffect(() => {
    applyThemeColorsLocally(brandConfig.primaryColor);
    try {
      localStorage.setItem('app_brand_config', JSON.stringify(brandConfig));
    } catch (e) {
      // ignore
    }
  }, [brandConfig]);

  // Firebase Realtime Subscriptions
  useEffect(() => {
    const unsubListings = subscribeToListings((data) => {
      if (data && data.length > 0) {
        setListings(data);
      } else {
        setListings(INITIAL_LISTINGS);
      }
    });

    const unsubUsers = subscribeToUsers((data) => {
      if (data && data.length > 0) {
        setUsers(data);
      }
    });

    const unsubChats = subscribeToChats((data) => {
      if (data) {
        setChats(data);
      }
    });

    const unsubQuestions = subscribeToQuestions((data) => {
      if (data) {
        setQuestions(data);
      }
    });

    const unsubSettings = subscribeToPlatformSettings((data) => {
      if (data) {
        if (data.siteSettings) setSiteSettings(data.siteSettings);
        if (data.barterOptions) setBarterOptions(data.barterOptions);
        if (data.brandConfig) {
          setBrandConfig(data.brandConfig);
          try {
            localStorage.setItem('app_brand_config', JSON.stringify(data.brandConfig));
          } catch (e) {
            // ignore
          }
        }
        if (data.customPages && Array.isArray(data.customPages) && data.customPages.length > 0) {
          setCustomPages(data.customPages);
        }
        if (data.adBanners && Array.isArray(data.adBanners)) {
          setAdBanners(data.adBanners);
          try {
            localStorage.setItem('app_ad_banners', JSON.stringify(data.adBanners));
          } catch (e) {
            // ignore
          }
        }
        if (data.landingConfig) {
          if (data.landingConfig.platformSlogan) {
            setPlatformSlogan(data.landingConfig.platformSlogan);
            try { localStorage.setItem('app_platform_slogan', data.landingConfig.platformSlogan); } catch (e) {}
          }
          if (data.landingConfig.platformDescription) {
            setPlatformDescription(data.landingConfig.platformDescription);
            try { localStorage.setItem('app_platform_description', data.landingConfig.platformDescription); } catch (e) {}
          }
          if (data.landingConfig.platformImageUrl) {
            setPlatformImageUrl(data.landingConfig.platformImageUrl);
            try { localStorage.setItem('app_platform_image_url', data.landingConfig.platformImageUrl); } catch (e) {}
          }
          if (data.landingConfig.feature1Title) setFeature1Title(data.landingConfig.feature1Title);
          if (data.landingConfig.feature1Desc) setFeature1Desc(data.landingConfig.feature1Desc);
          if (data.landingConfig.feature2Title) setFeature2Title(data.landingConfig.feature2Title);
          if (data.landingConfig.feature2Desc) setFeature2Desc(data.landingConfig.feature2Desc);
          if (data.landingConfig.feature3Title) setFeature3Title(data.landingConfig.feature3Title);
          if (data.landingConfig.feature3Desc) setFeature3Desc(data.landingConfig.feature3Desc);
        } else if (data.platformImageUrl) {
          setPlatformImageUrl(data.platformImageUrl);
          try { localStorage.setItem('app_platform_image_url', data.platformImageUrl); } catch (e) {}
        }
      }
    });

    return () => {
      unsubListings();
      unsubUsers();
      unsubChats();
      unsubQuestions();
      unsubSettings();
    };
  }, []);

  // Update document title dynamically
  useEffect(() => {
    document.title = `${brandConfig.brandName || 'قايض'} | منصة المقايضة الذكية`;
  }, [brandConfig.brandName]);

  // Reset to default brand configuration helper
  const handleResetToDefaults = () => {
    setBrandConfig({
      primaryColor: 'brown',
      brandName: 'مقايضة',
      brandLogo: 'م',
      brandTagline: 'منصة مقايضة كاملة',
      copyrightText: '© 2026 مقايضة - جميع الحقوق محفوظة لمجتمع المقايضة بأمان',
      simulatedUsers: 342,
      simulatedListings: 18,
      simulatedSwaps: 86,
    });
    setPlatformSlogan('قايض وفاوض بما تحتاجه.');
    setPlatformDescription('منصة تتيح لك عرض منتجاتك أو مهارتك ومقايضتها بما تحتاجه مباشرة مع الآخرين - بكل بساطة وأمان.');
    setPlatformImageUrl(DEFAULT_HERO_IMAGE);
    try {
      localStorage.setItem('app_platform_image_url', DEFAULT_HERO_IMAGE);
    } catch (e) {}
    setFeature1Title('مقايضة مباشر بدون وسيط');
    setFeature1Desc('اعرض منتجك واذكر ما تريده مقابله.');
    setFeature2Title('محادثات فورية');
    setFeature2Desc('تواصل مباشرة مع الطرف الآخر لإتمام المقايضة.');
    setFeature3Title('توثيق الهوية');
    setFeature3Desc('وثّق هويتك لتحصل على شارة الثقة');
  };

  // Editable Landing Section States
  const [platformSlogan, setPlatformSlogan] = useState(() => {
    try { return localStorage.getItem('app_platform_slogan') || 'قايض وفاوض بما تحتاجه.'; } catch (e) { return 'قايض وفاوض بما تحتاجه.'; }
  });
  const [platformDescription, setPlatformDescription] = useState(() => {
    try { return localStorage.getItem('app_platform_description') || 'منصة تتيح لك عرض منتجاتك أو مهارتك ومقايضتها بما تحتاجه مباشرة مع الآخرين - بكل بساطة وأمان.'; } catch (e) { return 'منصة تتيح لك عرض منتجاتك أو مهارتك ومقايضتها بما تحتاجه مباشرة مع الآخرين - بكل بساطة وأمان.'; }
  });
  const [platformImageUrl, setPlatformImageUrl] = useState(() => {
    try { return localStorage.getItem('app_platform_image_url') || DEFAULT_HERO_IMAGE; } catch (e) { return DEFAULT_HERO_IMAGE; }
  });
  const [feature1Title, setFeature1Title] = useState('مقايضة مباشر بدون وسيط');
  const [feature1Desc, setFeature1Desc] = useState('اعرض منتجك واذكر ما تريده مقابله.');
  const [feature2Title, setFeature2Title] = useState('محادثات فورية');
  const [feature2Desc, setFeature2Desc] = useState('تواصل مباشرة مع الطرف الآخر لإتمام المقايضة.');
  const [feature3Title, setFeature3Title] = useState('توثيق الهوية');
  const [feature3Desc, setFeature3Desc] = useState('وثّق هويتك لتحصل على شارة الثقة');

  // Filter States for the Feed
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [selectedType, setSelectedType] = useState('الكل'); // الكل, سلعة, خدمة

  // Barter Offer Modal States
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);
  const [barterTargetListing, setBarterTargetListing] = useState<Listing | null>(null);

  // Audio simulator (soft chime for notification using basic Web Audio API to prevent layout frame blocks)
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Ignore audio failure
    }
  };

  // Setup initial state for logged in user
  const handleLogin = (user: User) => {
    const isOwner = user.phone?.toLowerCase().includes('crazyretiree') || user.email?.toLowerCase().includes('crazyretiree') || user.name?.toLowerCase().includes('crazyretiree') || user.id === 'user_owner_crazyretiree';
    const finalUser: User = isOwner 
      ? { ...user, isAdmin: true, bio: user.bio || '', completedSwaps: user.completedSwaps ?? 100, reliabilityLevel: 'ممتاز' }
      : user;

    setCurrentUser(finalUser);
    try {
      localStorage.setItem('app_current_user', JSON.stringify(finalUser));
    } catch (e) {
      // ignore
    }

    setUserReviews(MOCK_REVIEWS); // Initial rating reviews
    
    // Add custom welcome notification
    const welcomeNotif: Notification = {
      id: `welcome_${Date.now()}`,
      title: 'أهلاً بك في منصة قايض للمقايضة! 🔄',
      description: `مرحباً بك يا ${finalUser.name}. تم توثيق حسابك وربطه بـ "نفاذ" الوطني لضمان بيئة مقايضة آمنة. بادر بنشر سلعك أو تصفح العروض للبدء!`,
      timestamp: 'الآن',
      read: false,
      type: 'match'
    };
    setNotifications([welcomeNotif]);
    setActiveTab('feed');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('app_current_user');
    } catch (e) {
      // ignore
    }
    setChats([]);
    setActiveChatId(null);
    setNotifications([]);
  };

  // Add a new listing from the form
  const handleAddListing = (listingData: Omit<Listing, 'id' | 'ownerId' | 'ownerName' | 'ownerRating' | 'ownerReliability' | 'ownerAvatar' | 'createdAt' | 'status'>) => {
    if (!currentUser) return;

    const newListing: Listing = {
      ...listingData,
      id: `list_custom_${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerRating: currentUser.rating,
      ownerReliability: currentUser.reliabilityLevel,
      ownerAvatar: currentUser.avatar,
      createdAt: 'الآن',
      status: 'نشط',
    };

    setListings([newListing, ...listings]);
    addListingToDb(newListing);

    // Check for potential matching listings automatically after adding
    setTimeout(() => {
      // Simulate detection of intelligent match
      const matchingListing = listings.find(l => 
        l.ownerId !== currentUser.id && 
        (l.title.toLowerCase().includes(listingData.wantedInReturn.toLowerCase()) || 
         listingData.title.toLowerCase().includes(l.wantedInReturn.toLowerCase()))
      );

      if (matchingListing) {
        addNotification(
          'تطابق ذكي متبادل مكتشف! 💡',
          `عرضك الجديد يتطابق تماماً مع ما يبحث عنه "${matchingListing.ownerName}". يمكنك المقايضة معه الآن عبر تبويب المطابقة!`,
          'match'
        );
      } else {
        addNotification(
          'تم نشر عرضك بنجاح! 🚀',
          `تم نشر "${listingData.title}" على المنصة. يبحث محركنا الآن عن عروض مقايضة تناسب طلبك.`,
          'match'
        );
      }
    }, 1500);
  };

  // Delete an owned listing
  const handleDeleteListing = (listingId: string) => {
    setListings(listings.filter(l => l.id !== listingId));
    deleteListingFromDb(listingId);
  };

  // Toggle hide/show for an owned listing
  const handleToggleHideListing = (listingId: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const updatedIsHidden = !l.isHidden;
        updateListingInDb(listingId, { isHidden: updatedIsHidden });
        return { ...l, isHidden: updatedIsHidden };
      }
      return l;
    }));
  };

  // Update listing details
  const handleUpdateListing = (updatedListing: Listing) => {
    setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
    updateListingInDb(updatedListing.id, {
      title: updatedListing.title,
      type: updatedListing.type,
      category: updatedListing.category,
      city: updatedListing.city,
      description: updatedListing.description,
      imageUrl: updatedListing.imageUrl,
      wantedInReturn: updatedListing.wantedInReturn,
      cashDifference: updatedListing.cashDifference,
      status: updatedListing.status,
      isHidden: updatedListing.isHidden,
    });
  };

  // Close an owned listing (Mark as completed)
  const handleCloseListing = (listingId: string) => {
    setListings(listings.map(l => l.id === listingId ? { ...l, status: 'مكتمل' } : l));
    updateListingInDb(listingId, { status: 'مكتمل' });
  };

  // Initiate Chat or Open Barter Offer Modal
  const handleInitiateSwap = (listing: Listing, customSystemMessage?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (customSystemMessage) {
      let existingChat = chats.find(c => c.listingId === listing.id && c.otherUser.id === listing.ownerId);
      if (!existingChat) {
        const otherUser: User = MOCK_USERS[listing.ownerId] || {
          id: listing.ownerId,
          name: listing.ownerName,
          avatar: listing.ownerAvatar,
          city: listing.city,
          rating: listing.ownerRating,
          completedSwaps: 5,
          reliabilityLevel: 'جيد جداً',
          bio: '',
        };
        existingChat = {
          id: `chat_${Date.now()}`,
          listingId: listing.id,
          listingTitle: listing.title,
          listingImageUrl: listing.imageUrl,
          listingWantedInReturn: listing.wantedInReturn,
          otherUser,
          messages: [
            {
              id: `msg_init_${Date.now()}`,
              senderId: currentUser.id,
              text: customSystemMessage,
              timestamp: 'الآن',
            }
          ],
          offerStatus: 'معلق',
        };
        setChats([existingChat, ...chats]);
      } else {
        handleSendMessage(existingChat.id, customSystemMessage);
      }
      setActiveChatId(existingChat.id);
      setActiveTab('chat');
      return;
    }

    // Open Barter Offer Modal to pick product & cash difference
    setBarterTargetListing(listing);
    setIsBarterModalOpen(true);
  };

  // Submit Structured Barter Offer
  const handleSubmitBarterOffer = (data: {
    targetListing: Listing;
    offeredListing: Listing;
    cashDifferenceType: 'none' | 'offerer_pays' | 'offerer_requests';
    cashDifferenceAmount: number;
    note: string;
  }) => {
    if (!currentUser) return;

    // Check if the selected offered listing is already offered in another active swap offer
    const isOfferedProductBusy = chats.some(
      c => c.offeredListingId === data.offeredListing.id && c.offerStatus !== 'مرفوض' && c.offerStatus !== 'مكتمل'
    );
    if (isOfferedProductBusy) {
      addNotification(
        'تنبيه المقايضة',
        `المنتج (${data.offeredListing.title}) مُقدم بالفعل في عرض مقايضة جاري. لا يمكنك تقديم المنتج نفسه في أكثر من عرض في نفس الوقت.`,
        'offer'
      );
      setIsBarterModalOpen(false);
      return;
    }

    const otherUser: User = MOCK_USERS[data.targetListing.ownerId] || {
      id: data.targetListing.ownerId,
      name: data.targetListing.ownerName,
      avatar: data.targetListing.ownerAvatar,
      city: data.targetListing.city,
      rating: data.targetListing.ownerRating,
      completedSwaps: 5,
      reliabilityLevel: 'جيد جداً',
      bio: '',
    };

    const cashDiffText = 
      data.cashDifferenceType === 'offerer_pays' 
        ? `\n+ سأدفع فارق مبلغ مالي: ${data.cashDifferenceAmount} ريال`
        : data.cashDifferenceType === 'offerer_requests'
          ? `\n+ أطلب فارق مبلغ مالي: ${data.cashDifferenceAmount} ريال`
          : '\nمقايضة رأس برأس (بدون فارق مالي)';

    const offerSummaryText = `أرسلت عرض مقايضة رسمياً:\nعرضت منتجي: "${data.offeredListing.title}"\nمقابل منتجك: "${data.targetListing.title}"${cashDiffText}${data.note ? `\nملاحظة: ${data.note}` : ''}`;

    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      listingId: data.targetListing.id,
      listingTitle: data.targetListing.title,
      listingImageUrl: data.targetListing.imageUrl,
      listingWantedInReturn: data.targetListing.wantedInReturn,
      offeredListingId: data.offeredListing.id,
      offeredListingTitle: data.offeredListing.title,
      offeredListingImageUrl: data.offeredListing.imageUrl,
      cashDifferenceType: data.cashDifferenceType,
      cashDifferenceAmount: data.cashDifferenceAmount,
      offerNote: data.note,
      otherUser,
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          senderId: currentUser.id,
          text: offerSummaryText,
          timestamp: 'الآن',
        }
      ],
      offerStatus: 'معلق',
    };

    setChats([newChat, ...chats]);
    saveChatToDb(newChat);

    addNotification(
      'تم إرسال عرض المقايضة بنجاح',
      `قدمت عرضاً بمنتج "${data.offeredListing.title}" مقابل "${data.targetListing.title}". يمكنك متابعته من صفحة عروض المقايضة.`,
      'offer'
    );

    setActiveTab('swaps');
  };

  // Send a message inside a chat (by Current User)
  const handleSendMessage = (chatId: string, text: string) => {
    if (!currentUser) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: 'الآن',
    };

    setChats(chats.map(chat => {
      if (chat.id === chatId) {
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
        saveChatToDb(updatedChat);
        return updatedChat;
      }
      return chat;
    }));
  };

  // Append simulated reply from listing owners
  const addSimulatedMessage = (chatId: string, text: string) => {
    const newMessage = {
      id: `msg_sim_${Date.now()}`,
      senderId: chats.find(c => c.id === chatId)?.otherUser.id || 'system',
      text,
      timestamp: 'الآن',
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        // Automatically accept or update status depending on flow simulation
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    }));

    // Trigger sound & notification
    playNotificationSound();
  };

  // Confirm Barter Deal & Issue Digital Contract
  const handleConfirmBarterInChat = (chatId: string) => {
    if (!currentUser) return;
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        const targetListing = listings.find(l => l.id === chat.listingId);
        const isOwner = targetListing?.ownerId === currentUser.id;
        
        const updatedOwnerConfirmed = isOwner ? true : !!chat.ownerConfirmed;
        const updatedOffererConfirmed = !isOwner ? true : !!chat.offererConfirmed;

        const bothConfirmed = updatedOwnerConfirmed && updatedOffererConfirmed;
        const newStatus = bothConfirmed ? 'مكتمل' : 'مقبول';

        const contractNo = chat.contractNumber || `BDR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const contractDate = chat.contractDate || new Date().toLocaleDateString('ar-SA', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const confirmationMsgText = bothConfirmed 
          ? `🎉 تم تأكيد المقايضة والتوافق التام بين الطرفين! صدر العقد الإلكتروني الموثق رقم (${contractNo}).`
          : `قام ${currentUser.name} بتأكيد المقايضة والتزامه بالشروط. بانتظار تأكيد الطرف الثاني لاستصدار العقد الإلكتروني الموثق.`;

        const systemMsg = {
          id: `msg_sys_${Date.now()}`,
          senderId: 'system',
          text: confirmationMsgText,
          timestamp: 'الآن',
        };

        if (bothConfirmed) {
          addNotification(
            'تم توثيق العقد الإلكتروني للمقايضة! 📜',
            `اكتملت عملية التوافق وتأكيد المقايضة لـ "${chat.listingTitle}". تم استصدار العقد الموثق.`,
            'match'
          );
        } else {
          addNotification(
            'تم تسجيل تأكيدك للمقايضة بنجاح ✍️',
            `بانتظار تأكيد الطرف الآخر لتفعيل العقد الرقمي الموثق.`,
            'offer'
          );
        }

        const updatedChat: Chat = {
          ...chat,
          offererConfirmed: updatedOffererConfirmed,
          ownerConfirmed: updatedOwnerConfirmed,
          offerStatus: newStatus,
          contractNumber: contractNo,
          contractDate,
          messages: [...chat.messages, systemMsg],
        };

        saveChatToDb(updatedChat);
        return updatedChat;
      }
      return chat;
    }));
  };

  // Toggle interest bookmark state
  const handleToggleInterest = (listingId: string) => {
    if (interestedListings.includes(listingId)) {
      setInterestedListings(interestedListings.filter(id => id !== listingId));
      addNotification(
        'تمت الإزالة من قائمة الاهتمام 💔',
        'تمت إزالة هذا العرض من قائمة اهتماماتك بالمقايضة.',
        'match'
      );
    } else {
      setInterestedListings([...interestedListings, listingId]);
      addNotification(
        'تمت الإضافة لقائمة المهتمين بالمقايضة! ❤️',
        'تم حفظ العرض بنجاح. يمكنك مراجعته وإرسال عروض مبادلة سريعة لعارضه.',
        'match'
      );
    }
  };

  // Add question to a listing details Q&A section
  const handleAddQuestion = (listingId: string, questionText: string) => {
    if (!currentUser) return;
    const newQ: ListingQuestion = {
      id: `q_custom_${Date.now()}`,
      listingId,
      askerId: currentUser.id,
      askerName: currentUser.name,
      askerAvatar: currentUser.avatar,
      questionText,
      createdAt: new Date().toISOString()
    };

    setQuestions([newQ, ...questions]);
    saveQuestionToDb(newQ);

    const targetListing = listings.find(l => l.id === listingId);
    if (targetListing && targetListing.ownerId !== currentUser.id) {
      addNotification(
        'تم إرسال استفسارك بنجاح! 💬',
        `تم طرح سؤالك علناً لـ "${targetListing.ownerName}". ستتلقى تنبيهاً فور إجابة عارض السلعة.`,
        'message'
      );

      // If owner is a mock user, simulate an automatic professional reply in 4 seconds
      if (MOCK_USERS[targetListing.ownerId]) {
        setTimeout(() => {
          const mockReplies = [
            'أهلاً بك! شكراً جزيلاً لاهتمامك وسؤالك. نعم العرض متاح ومواصفاته ممتازة ومطابقة تماماً، وأرحب بالمقايضة المقترحة.',
            'حياك الله، نعم السلعة نظيفة جداً وخالية من العيوب واستخدامها خفيف جداً، وأتشرف بالاتفاق معك.',
            'أهلاً ومرحباً بك، يسعدني التبادل معك. نعم الشروط سهلة وبإمكاننا الاتفاق ومتابعة التفاصيل عبر الشات الخاص.'
          ];
          const chosenReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];

          setQuestions(prev => prev.map(q => {
            if (q.id === newQ.id) {
              return {
                ...q,
                replyText: chosenReply,
                replyCreatedAt: new Date().toISOString()
              };
            }
            return q;
          }));

          addNotification(
            'تم الرد على استفسارك علناً! 🔔',
            `أجاب صاحب العرض "${targetListing.ownerName}" على سؤالك حول "${targetListing.title}".`,
            'message'
          );
        }, 4000);
      }
    }
  };

  // Add reply to an existing question
  const handleAddReply = (questionId: string, replyText: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          replyText,
          replyCreatedAt: new Date().toISOString()
        };
      }
      return q;
    }));

    addNotification(
      'تم نشر ردك العلني بنجاح! ✅',
      'تم عرض ردك الواضح للمستفسر وجميع زوار صفحة المقايضة هذه.',
      'match'
    );
  };

  // Handle direct message from detail page
  const handleSendDirectMessage = (receiverId: string, text: string, listingTitle: string) => {
    if (!currentUser) return;
    
    const targetListing = listings.find(l => l.title === listingTitle);
    const existingChat = chats.find(c => c.otherUser.id === receiverId && c.listingTitle === listingTitle);
    
    if (existingChat) {
      const newMessage = {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        text,
        timestamp: 'الآن',
      };
      setChats(chats.map(chat => {
        if (chat.id === existingChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      }));
    } else {
      const otherUser = MOCK_USERS[receiverId] || {
        id: receiverId,
        name: 'مستعمل بادل',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        city: 'الرياض',
        rating: 4.8,
        completedSwaps: 4,
        reliabilityLevel: 'جيد جداً',
        bio: '',
      };
      
      const newChat: Chat = {
        id: `chat_direct_${Date.now()}`,
        listingId: targetListing?.id || `list_${Date.now()}`,
        listingTitle,
        listingImageUrl: targetListing?.imageUrl || 'https://images.unsplash.com/photo-1521791136368-1a46827d0515?auto=format&fit=crop&w=800&q=80',
        listingWantedInReturn: targetListing?.wantedInReturn || '',
        otherUser,
        messages: [
          {
            id: `msg_direct_init_${Date.now()}`,
            senderId: currentUser.id,
            text,
            timestamp: 'الآن',
          }
        ],
        offerStatus: 'معلق',
      };
      
      setChats([newChat, ...chats]);
    }
  };

  // Update Swap Proposal status (pending, accepted, rejected, completed)
  const handleUpdateOfferStatus = (chatId: string, status: 'معلق' | 'مقبول' | 'مرفوض' | 'مكتمل') => {
    setChats(chats.map(chat => {
      if (chat.id === chatId) {
        let systemMessageText = '';
        if (status === 'مقبول') {
          systemMessageText = 'تم قبول عرض المقايضة بنجاح من الطرفين. يرجى الاتفاق على آلية التسليم.';
        } else if (status === 'مكتمل') {
          systemMessageText = 'تم تأكيد استلام السلع/الخدمات من الطرفين واكتملت عملية المقايضة بنجاح.';
        } else if (status === 'مرفوض') {
          systemMessageText = 'تم الاعتذار عن عرض المقايضة.';
        }

        const systemMessage = {
          id: `sys_msg_${Date.now()}`,
          senderId: 'system',
          text: systemMessageText,
          timestamp: 'الآن',
        };

        return {
          ...chat,
          offerStatus: status,
          messages: [...chat.messages, systemMessage]
        };
      }
      return chat;
    }));

    // Raise a notification of status change
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      if (status === 'مقبول') {
        addNotification(
          'تم قبول اتفاق المقايضة',
          `وافق ${chat.otherUser.name} على تبادل السلع معك بخصوص "${chat.listingTitle}". تواصلوا للتسليم.`,
          'offer'
        );
      } else if (status === 'مكتمل') {
        addNotification(
          'اكتملت المقايضة بنجاح',
          `تم إغلاق صفقة التبادل بنجاح مع ${chat.otherUser.name}. يرجى إضافة تقييمك له الآن.`,
          'rating'
        );
      }
    }
  };

  // Add review dynamically to user's profiles
  const handleAddReview = (userId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev_custom_${Date.now()}`,
      date: 'الآن',
    };

    setUserReviews([newReview, ...userReviews]);
    addNotification(
      'تلقيت تقييماً جديداً! ⭐',
      `قام ${reviewData.reviewerName} بتقييمك بـ ${reviewData.rating} نجوم تقديراً لسرعة ومصداقية المقايضة.`,
      'rating'
    );
  };

  // Helper to push a notification
  const addNotification = (title: string, description: string, type: 'message' | 'offer' | 'match' | 'rating') => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title,
      description,
      timestamp: 'الآن',
      read: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev]);
    playNotificationSound();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // SIMULATOR HANDLERS
  const handleSimulateMessage = (senderId: string, text: string, listingTitle: string, userListingId: string) => {
    if (!currentUser) return;

    // Check if chat exists
    const existingChat = chats.find(c => c.otherUser.id === senderId);

    if (existingChat) {
      addSimulatedMessage(existingChat.id, text);
      setActiveChatId(existingChat.id);
      setActiveTab('chat');
    } else {
      // Create new chat
      const otherUser = MOCK_USERS[senderId];
      const newChat: Chat = {
        id: `chat_${Date.now()}`,
        listingId: userListingId,
        listingTitle: listingTitle,
        listingImageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
        listingWantedInReturn: 'بلايستيشن 5 أو عرض معادل',
        otherUser,
        messages: [
          {
            id: `msg_sim_init_${Date.now()}`,
            senderId: otherUser.id,
            text: text,
            timestamp: 'الآن',
          }
        ],
        offerStatus: 'معلق',
      };

      setChats([newChat, ...chats]);
      setActiveChatId(newChat.id);
      setActiveTab('chat');
    }
  };

  // Filter listings based on search criteria
  const filteredListings = listings.filter((list) => {
    if (list.isHidden) return false;
    if (barterOptions.enableProducts === false && list.type === 'سلعة') return false;
    if (barterOptions.enableServices === false && list.type === 'خدمة') return false;

    const matchesSearch = 
      list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.wantedInReturn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'الكل' || list.category === selectedCategory;
    const matchesCity = selectedCity === 'الكل' || list.city === selectedCity;
    const matchesType = selectedType === 'الكل' || list.type === selectedType;

    return matchesSearch && matchesCategory && matchesCity && matchesType;
  });

  const currentUserListings = listings.filter(l => l.ownerId === currentUser?.id);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans pb-24 md:pb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        onLogout={handleLogout}
        brandConfig={brandConfig}
        language={language}
        setLanguage={setLanguage}
        onNavigateToProfileSubTab={(subTab) => setProfileSubTab(subTab)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-6 flex-1" id="main_content_wrapper">
        
        {/* Header Ad Banners */}
        {adBanners.filter(b => b.isActive && b.position === 'header').map(banner => (
          <div key={banner.id} className="mb-6 rounded-3xl overflow-hidden border border-brand-100 shadow-xs bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white relative">
            <a href={banner.targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-right flex-1">
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {banner.badgeText || 'إعلان راعي'}
                </span>
                <h3 className="text-base sm:text-lg font-black leading-snug">{banner.title}</h3>
              </div>
              <img src={banner.imageUrl} alt={banner.title} className="w-full md:w-56 h-28 object-cover rounded-2xl ring-2 ring-white/20" />
            </a>
          </div>
        ))}
        
        {/* VIEW 1: HOME FEED (العروض العامة) */}
            {activeTab === 'feed' && (
              <div className="space-y-8" id="feed_view_panel">
                
                {/* Hero Platform Section with side-by-side layout */}
                <div className="grid grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-center bg-transparent py-2 sm:py-4 text-start" id="hero_platform_section">
                  
                  {/* Column 1: Slogan/Phrase & Description (Right side on desktop in RTL) */}
                  <div className="col-span-7 sm:col-span-7 lg:col-span-7 space-y-3 sm:space-y-5 flex flex-col justify-center order-1" id="hero_slogan_cell">
                    <div className="flex justify-start">
                      <span className={`inline-flex items-center px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#f5ebd9]/65 text-[#85532a] border border-[#ebdccb] space-x-1 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                        <span>{brandConfig.brandTagline || (language === 'en' ? 'Complete Barter Platform' : 'منصة مقايضة كاملة')}</span>
                        <span className="text-[#a16207]">✨</span>
                      </span>
                    </div>

                    <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight whitespace-pre-line">
                      {platformSlogan}
                    </h1>

                    <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 leading-relaxed max-w-xl">
                      {platformDescription || t.heroDesc}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                      <button
                        onClick={() => handleTabChange('add')}
                        className="px-3.5 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] sm:text-sm transition-all shadow-md shadow-brand-100 cursor-pointer"
                      >
                        {t.addYourProduct}
                      </button>
                      <button
                        onClick={() => setActiveTab('offers_page')}
                        className="px-3.5 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-[11px] sm:text-sm transition-all cursor-pointer"
                      >
                        {t.browseProducts}
                      </button>
                    </div>
                  </div>

                  {/* Column 2: Hero Illustration Image (Side-by-side with text) */}
                  <div className="col-span-5 sm:col-span-5 lg:col-span-5 flex items-center justify-center relative h-36 sm:h-56 md:h-72 lg:h-96 order-2 bg-transparent p-1" id="hero_image_cell">
                    <img 
                      src={platformImageUrl || DEFAULT_HERO_IMAGE} 
                      alt="Barter illustration" 
                      className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-102 rounded-2xl shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_HERO_IMAGE;
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                </div>

                {/* Latest Added Offers Section */}
                <div id="latest_home_listings_section" className="space-y-6 pt-4 text-start">
                  <div className={`flex justify-between items-center px-1 ${language === 'en' ? 'flex-row' : 'flex-row-reverse'}`} id="home_grid_header">
                    <span className="text-xs text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-md">{language === 'en' ? 'Live Updates' : 'تحديث مستمر'}</span>
                    <h3 className="font-extrabold text-gray-905 text-base sm:text-lg">{language === 'en' ? 'Latest Added Offers' : 'أحدث العروض المضافة'}</h3>
                  </div>

                  <div className={`grid ${getGridColsClass(siteSettings.gridColumns)} gap-6`} id="home_listings_grid">
                    {listings
                      .filter(l => l.status === 'نشط')
                      .slice(0, homeListingsLimit)
                      .map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          currentUser={currentUser}
                          onInitiateSwap={handleInitiateSwap}
                          onViewDetails={(listing) => {
                            setSelectedListing(listing);
                            setActiveTab('details_page');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onViewProfile={handleViewProfile}
                        />
                      ))
                    }
                  </div>

                  {listings.filter(l => l.status === 'نشط').length > homeListingsLimit && (
                    <div className="flex justify-center pt-4" id="home_more_btn_container">
                      <button
                        onClick={() => setHomeListingsLimit(prev => prev + 8)}
                        className={`flex items-center space-x-2 ${language === 'ar' ? 'space-x-reverse' : ''} bg-white hover:bg-brand-50 hover:text-brand-700 border border-gray-200 hover:border-brand-200 py-2.5 px-8 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all duration-150 cursor-pointer text-gray-700`}
                      >
                        <RefreshCw className="w-4 h-4 text-brand-600 animate-spin-slow" />
                        <span>{language === 'en' ? 'Show More' : 'اضغط للمزيد'}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* VIEW 1.5: OFFERS EXPLORE PAGE (صفحة تصفح العروض بالتصانيف والبحث) */}
            {activeTab === 'offers_page' && (
              <div className="space-y-6" id="offers_explore_view_panel">
                
                {/* Filter and Search Dashboard */}
                {(siteSettings.showSearchFilter !== false || siteSettings.showCityFilters !== false || siteSettings.showCategoryFilters !== false) && (
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs" id="filter_dashboard">
                    
                    {/* Search, City & Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      
                      {/* 1. Search Input */}
                      {siteSettings.showSearchFilter !== false && (
                        <div className="relative" id="search_input_group">
                          <label className="block text-xs font-bold text-gray-500 text-right mb-1">البحث</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="ابحث عن سلعة، خدمة..."
                              className="w-full border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-gray-50/30 outline-hidden text-right transition-all font-medium text-gray-800"
                            />
                            <Search className="w-4.5 h-4.5 text-gray-400 absolute right-4 top-3.5" />
                          </div>
                        </div>
                      )}

                      {/* 2. City Dropdown */}
                      {siteSettings.showCityFilters !== false && (
                        <div className="relative" id="filter_city_group">
                          <label className="block text-xs font-bold text-gray-500 text-right mb-1">المدينة</label>
                          <div className="relative">
                            <select
                              value={selectedCity}
                              onChange={(e) => setSelectedCity(e.target.value)}
                              className="w-full border border-gray-200 rounded-2xl py-3 pr-4 pl-10 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white outline-hidden cursor-pointer text-right appearance-none font-medium text-gray-800"
                            >
                              <option value="الكل">بكل المدن</option>
                              {CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                              ))}
                            </select>
                            <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-4 top-4 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {/* 3. Category Dropdown */}
                      {siteSettings.showCategoryFilters !== false && (
                        <div className="relative" id="filter_category_group">
                          <label className="block text-xs font-bold text-gray-500 text-right mb-1">التصنيف</label>
                          <div className="relative">
                            <select
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="w-full border border-gray-200 rounded-2xl py-3 pr-4 pl-10 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white outline-hidden cursor-pointer text-right appearance-none font-medium text-gray-800"
                            >
                              <option value="الكل">جميع التصنيفات</option>
                              {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-4 top-4 pointer-events-none" />
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                )}

                {/* Listings Grid Output */}
                <div id="listings_grid_container" className="space-y-4 text-right">
                  <div className="flex justify-between items-center px-1" id="grid_header">
                    <span className="text-xs text-gray-400 font-semibold">تحديث مستمر للعروض</span>
                    <h3 className="font-extrabold text-gray-900 text-base">العروض المتاحة ({filteredListings.length})</h3>
                  </div>

                  {filteredListings.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-150 py-16 text-center text-gray-500 flex flex-col items-center justify-center space-y-3" id="listings_empty_state">
                      <RefreshCw className="w-10 h-10 text-gray-300 animate-spin-slow" />
                      <p className="font-bold text-gray-800 text-sm">لم نجد أي عروض مطابقة للفلاتر!</p>
                      <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                        جرب تعديل خيارات البحث، اختيار مدينة أخرى، أو اضغط على تصنيف "الكل" لعرض كافة الإعلانات النشطة.
                      </p>
                    </div>
                  ) : (
                    <div className={`grid ${getGridColsClass(siteSettings.gridColumns)} gap-6`} id="listings_live_grid">
                      {filteredListings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          currentUser={currentUser}
                          onInitiateSwap={handleInitiateSwap}
                          onViewDetails={(listing) => {
                            setSelectedListing(listing);
                            setActiveTab('details_page');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* VIEW: FAVORITES (المفضلة) */}
            {activeTab === 'favorites' && (
              <div id="favorites_view_panel" className="space-y-6 text-right">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
                  <h2 className="text-lg font-black text-gray-900 mb-1 flex items-center space-x-2 space-x-reverse">
                    <span>العروض المفضلة ❤️</span>
                  </h2>
                  <p className="text-xs text-gray-500">العروض التي أبديت اهتمامك بها للعودة إليها والمقايضة عليها لاحقاً.</p>
                </div>

                {interestedListings.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500 space-y-3">
                    <p className="font-bold text-gray-800 text-sm">لم تقم بإضافة أي عروض للمفضلة بعد!</p>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      تصفح العروض واضغط على زر التفاصيل أو الاهتمام لحفظ أي عرض في قائمتك المفضلة.
                    </p>
                    <button
                      onClick={() => setActiveTab('feed')}
                      className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-700 transition-all cursor-pointer inline-block mt-2"
                    >
                      تصفح العروض الآن
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings
                      .filter(l => interestedListings.includes(l.id))
                      .map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          currentUser={currentUser}
                          onInitiateSwap={handleInitiateSwap}
                          onViewDetails={(listing) => {
                            setSelectedListing(listing);
                            setActiveTab('details_page');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onViewProfile={handleViewProfile}
                        />
                      ))
                    }
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: SMART MATCHING BOARD (المطابقة الذكية) */}
            {activeTab === 'matches' && (
              <div id="matches_view_panel">
                <MatchingEngine
                  currentUser={currentUser}
                  userListings={currentUserListings}
                  allListings={listings}
                  onInitiateSwap={handleInitiateSwap}
                />
              </div>
            )}

            {/* VIEW 3: ADD NEW LISTING (أضف عرضاً) */}
            {activeTab === 'add' && (
              <div id="add_view_panel">
                <AddListingModal
                  onAddListing={handleAddListing}
                  barterOptions={barterOptions}
                  onSuccess={() => {
                    setActiveTab('feed');
                    // Automatically scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* VIEW 4: CHATS SECTION (المحادثات) */}
            {activeTab === 'chat' && (
              <div id="chats_view_panel">
                <ChatSection
                  currentUser={currentUser}
                  chats={chats}
                  activeChatId={activeChatId}
                  setActiveChatId={setActiveChatId}
                  onSendMessage={handleSendMessage}
                  onAddSimulatedMessage={addSimulatedMessage}
                  onUpdateOfferStatus={handleUpdateOfferStatus}
                  onConfirmBarter={handleConfirmBarterInChat}
                  onCloseListing={handleCloseListing}
                  onAddReview={handleAddReview}
                  userListings={currentUserListings}
                  contractSettings={siteSettings.contractSettings}
                />
              </div>
            )}

            {/* VIEW 5: USER PROFILE & RATINGS (الملف الشخصي) */}
            {activeTab === 'profile' && (
              <div id="profile_view_panel">
                <ProfileSection
                  currentUser={currentUser}
                  displayedUser={viewingUser || currentUser}
                  userListings={listings}
                  reviews={userReviews}
                  onDeleteListing={handleDeleteListing}
                  onNavigateToAddListing={() => setActiveTab('add')}
                  onMarkCompleted={handleCloseListing}
                  onUpdateUser={(updated) => {
                    setCurrentUser(updated);
                    setViewingUser(updated);
                  }}
                  language={language}
                  initialSubTab={profileSubTab}
                  onViewDetails={(listing) => {
                    setSelectedListing(listing);
                    setActiveTab('details_page');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onViewProfile={handleViewProfile}
                  onNavigateToMyProducts={() => setActiveTab('my_products')}
                  onStartChat={(userToChat) => {
                    handleSendDirectMessage(userToChat.id, 'مرحباً، أود الاستفسار عن عروضك المعروضة للمقايضة.', 'استفسار عام');
                  }}
                  onBackToFeed={() => setActiveTab('feed')}
                />
              </div>
            )}

            {/* VIEW 1.6: LISTING DETAILS PAGE (تفاصيل العرض كاملة) */}
            {activeTab === 'details_page' && selectedListing && (
              <div id="listing_details_view_panel">
                <ListingDetails
                  listing={selectedListing}
                  currentUser={currentUser}
                  onClose={() => {
                    setActiveTab('feed');
                    setSelectedListing(null);
                  }}
                  onInitiateSwap={handleInitiateSwap}
                  onSendMessage={handleSendDirectMessage}
                  questions={questions}
                  onAddQuestion={handleAddQuestion}
                  onAddReply={handleAddReply}
                  interestedListings={interestedListings}
                  onToggleInterest={handleToggleInterest}
                  onViewProfile={handleViewProfile}
                />
              </div>
            )}

            {/* VIEW: MY PRODUCTS PAGE (منتجاتي) */}
            {activeTab === 'my_products' && (
              <div id="my_products_view_panel">
                <MyProducts
                  currentUser={currentUser}
                  userListings={listings}
                  onUpdateListing={handleUpdateListing}
                  onDeleteListing={handleDeleteListing}
                  onToggleHideListing={handleToggleHideListing}
                  onMarkCompleted={handleCloseListing}
                  onOpenAddListing={() => setActiveTab('add')}
                  onViewDetails={(listing) => {
                    setSelectedListing(listing);
                    setActiveTab('details_page');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  language={language}
                />
              </div>
            )}

            {/* VIEW 1.7: MY SWAPS PAGE (مقايضاتي) */}
            {activeTab === 'my_swaps' && (
              <div id="my_swaps_view_panel">
                <MySwaps
                  chats={chats}
                  listings={listings}
                  currentUser={currentUser}
                  barterOptions={barterOptions}
                  contractSettings={siteSettings.contractSettings}
                  onUpdateOfferStatus={handleUpdateOfferStatus}
                  onViewChat={(chatId) => {
                    setActiveChatId(chatId);
                    setActiveTab('chat');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onViewListing={(listing) => {
                    setSelectedListing(listing);
                    setActiveTab('details_page');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onMarkCompleted={handleCloseListing}
                  onSendMessage={handleSendMessage}
                  onAddSimulatedMessage={addSimulatedMessage}
                />
              </div>
            )}

            {/* VIEW 1.8: ADMIN CONTROL PANEL (لوحة التحكم) */}
            {activeTab === 'admin' && (
              <div id="admin_control_panel_view">
                <AdminPanel
                  brandConfig={brandConfig}
                  setBrandConfig={setBrandConfig}
                  siteSettings={siteSettings}
                  setSiteSettings={setSiteSettings}
                  barterOptions={barterOptions}
                  setBarterOptions={setBarterOptions}
                  users={users}
                  setUsers={setUsers}
                  customPages={customPages}
                  setCustomPages={setCustomPages}
                  adBanners={adBanners}
                  setAdBanners={setAdBanners}
                  listings={listings}
                  setListings={setListings}
                  chats={chats}
                  platformSlogan={platformSlogan}
                  setPlatformSlogan={setPlatformSlogan}
                  platformDescription={platformDescription}
                  setPlatformDescription={setPlatformDescription}
                  platformImageUrl={platformImageUrl}
                  setPlatformImageUrl={setPlatformImageUrl}
                  feature1Title={feature1Title}
                  setFeature1Title={setFeature1Title}
                  feature1Desc={feature1Desc}
                  setFeature1Desc={setFeature1Desc}
                  feature2Title={feature2Title}
                  setFeature2Title={setFeature2Title}
                  feature2Desc={feature2Desc}
                  setFeature2Desc={setFeature2Desc}
                  feature3Title={feature3Title}
                  setFeature3Title={setFeature3Title}
                  feature3Desc={feature3Desc}
                  setFeature3Desc={setFeature3Desc}
                  onSaveNotification={(title, desc) => addNotification(title, desc, 'match')}
                />
              </div>
            )}

            {/* VIEW 1.9: CUSTOM PAGE VIEW (عرض الصفحات المخصصة) */}
            {activeTab === 'custom_page' && selectedCustomPage && (
              <div className="max-w-4xl mx-auto py-6 px-4 text-right font-sans" id="custom_page_view">
                <button
                  onClick={() => setActiveTab('feed')}
                  className="mb-4 text-xs font-bold text-brand-700 hover:underline flex items-center space-x-1 space-x-reverse cursor-pointer"
                >
                  <span>← العودة للرئيسية</span>
                </button>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h1 className="text-2xl font-black text-gray-900">{selectedCustomPage.title}</h1>
                    <p className="text-xs text-gray-400 mt-1">آخر تحديث: {selectedCustomPage.updatedAt}</p>
                  </div>

                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium space-y-4">
                    {selectedCustomPage.content}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Simulator Dashboard */}
            {showSimulator && (
              <Simulator
                onSimulateMessage={handleSimulateMessage}
                onSimulateNotification={addNotification}
                onSimulateNewListing={() => {}}
                hasActiveListings={currentUserListings.filter(l => l.status === 'نشط').length > 0}
                onClose={() => setShowSimulator(false)}
                platformSlogan={platformSlogan}
                setPlatformSlogan={setPlatformSlogan}
                platformImageUrl={platformImageUrl}
                setPlatformImageUrl={setPlatformImageUrl}
                feature1Title={feature1Title}
                setFeature1Title={setFeature1Title}
                feature1Desc={feature1Desc}
                setFeature1Desc={setFeature1Desc}
                feature2Title={feature2Title}
                setFeature2Title={setFeature2Title}
                feature2Desc={feature2Desc}
                setFeature2Desc={setFeature2Desc}
                feature3Title={feature3Title}
                setFeature3Title={setFeature3Title}
                feature3Desc={feature3Desc}
                setFeature3Desc={setFeature3Desc}
              />
            )}

            {/* Barter Offer Modal */}
            <BarterOfferModal
              isOpen={isBarterModalOpen}
              onClose={() => setIsBarterModalOpen(false)}
              targetListing={barterTargetListing}
              userListings={listings}
              currentUser={currentUser}
              barterOptions={barterOptions}
              existingChats={chats}
              onOpenAddListing={() => {
                setIsBarterModalOpen(false);
                handleTabChange('add');
              }}
              onSubmitOffer={handleSubmitBarterOffer}
            />

            {/* Standard Login & Registration Modal */}
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              onLoginSuccess={handleLogin}
              language={language}
            />
      </main>

      {/* Footer Component */}
      <Footer
        brandConfig={brandConfig}
        customPages={customPages}
        language={language}
        setActiveTab={handleTabChange}
        onSelectCustomPage={(page) => {
          setSelectedCustomPage(page);
          handleTabChange('custom_page');
        }}
      />

      {/* Footer Ad Banners */}
      {adBanners.filter(b => b.isActive && b.position === 'footer').map(banner => (
        <div key={banner.id} className="max-w-7xl mx-auto px-4 my-6 w-full">
          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-2xs bg-white text-gray-900 relative">
            <a href={banner.targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
              <div className="space-y-1">
                <span className="bg-brand-100 text-brand-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-block">
                  {banner.badgeText || 'إعلان'}
                </span>
                <p className="text-xs sm:text-sm font-bold text-gray-800">{banner.title}</p>
              </div>
              <img src={banner.imageUrl} alt={banner.title} className="w-full sm:w-48 h-20 object-cover rounded-xl" />
            </a>
          </div>
        </div>
      ))}

    </div>
  );
}
