import React, { useState } from 'react';
import { 
  Settings, Check, Users, Image as ImageIcon, FileText, 
  Sliders, Palette, BarChart3, Plus, Trash2, Edit3, Shield, 
  ShieldAlert, ShieldCheck, Eye, EyeOff, ExternalLink, RefreshCw, X, AlertCircle, Phone, MapPin, Star, Upload
} from 'lucide-react';
import { User, Listing, Chat, CustomPage, AdBanner, SiteSettings, BrandConfig, City, BarterOptions, CustomBarterField, ContractSettings, ContractClause } from '../types';
import { CITIES } from '../data/mockData';
import { savePlatformSettingsToDb, saveUserToDb, updateListingInDb, deleteListingFromDb } from '../services/firebaseService';

interface AdminPanelProps {
  brandConfig: BrandConfig;
  setBrandConfig: (config: BrandConfig) => void;
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  barterOptions: BarterOptions;
  setBarterOptions: (opts: BarterOptions) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  customPages: CustomPage[];
  setCustomPages: React.Dispatch<React.SetStateAction<CustomPage[]>>;
  adBanners: AdBanner[];
  setAdBanners: React.Dispatch<React.SetStateAction<AdBanner[]>>;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  chats: Chat[];
  platformSlogan: string;
  setPlatformSlogan: (v: string) => void;
  platformDescription?: string;
  setPlatformDescription?: (v: string) => void;
  platformImageUrl: string;
  setPlatformImageUrl: (v: string) => void;
  feature1Title: string;
  setFeature1Title: (v: string) => void;
  feature1Desc: string;
  setFeature1Desc: (v: string) => void;
  feature2Title: string;
  setFeature2Title: (v: string) => void;
  feature2Desc: string;
  setFeature2Desc: (v: string) => void;
  feature3Title: string;
  setFeature3Title: (v: string) => void;
  feature3Desc: string;
  setFeature3Desc: (v: string) => void;
  onSaveNotification: (title: string, desc: string) => void;
}

export default function AdminPanel({
  brandConfig,
  setBrandConfig,
  siteSettings,
  setSiteSettings,
  barterOptions,
  setBarterOptions,
  users,
  setUsers,
  customPages,
  setCustomPages,
  adBanners,
  setAdBanners,
  listings,
  setListings,
  chats,
  platformSlogan,
  setPlatformSlogan,
  platformDescription,
  setPlatformDescription,
  platformImageUrl,
  setPlatformImageUrl,
  feature1Title,
  setFeature1Title,
  feature1Desc,
  setFeature1Desc,
  feature2Title,
  setFeature2Title,
  feature2Desc,
  setFeature2Desc,
  feature3Title,
  setFeature3Title,
  feature3Desc,
  setFeature3Desc,
  onSaveNotification
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'home_branding' | 'listings' | 'barter_options' | 'members' | 'banners' | 'pages' | 'settings' | 'contract_settings' | 'analytics'>('home_branding');

  // Contract Settings local clause state
  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseText, setNewClauseText] = useState('');

  // --- LISTINGS MANAGEMENT STATE ---
  const [listingSearch, setListingSearch] = useState('');
  const [listingStatusFilter, setListingStatusFilter] = useState<'all' | 'active' | 'completed' | 'hidden'>('all');

  // New Custom Field state for Barter Options
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // --- MEMBER MANAGEMENT MODAL STATE ---
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  
  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserCity, setNewUserCity] = useState<City>('الرياض');
  const [newUserReliability, setNewUserReliability] = useState<'ممتاز' | 'جيد جداً' | 'مبتدئ'>('مبتدئ');
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  const [newUserBio, setNewUserBio] = useState('');

  // --- BANNER MANAGEMENT MODAL STATE ---
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdBanner | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerTargetUrl, setBannerTargetUrl] = useState('');
  const [bannerPosition, setBannerPosition] = useState<'header' | 'footer'>('header');
  const [bannerBadgeText, setBannerBadgeText] = useState('إعلان راعي');

  // --- CUSTOM PAGES MODAL STATE ---
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageContent, setPageContent] = useState('');

  // Update Config helper
  const updateConfig = (key: keyof BrandConfig, value: any) => {
    setBrandConfig({
      ...brandConfig,
      [key]: value
    });
  };

  const contractSettings: ContractSettings = siteSettings.contractSettings || {
    contractTitle: 'عقد مقايضة وتنازل تبادلي',
    contractSubtitle: 'منصة قايض السعودية للمقايضة والتبادل المباشر',
    documentBadgeText: 'وثيقة رسمية',
    party1Header: 'أولاً: طرفا الاتفاقية الموثقة',
    party1Label: 'الطرف الأول (صاحب السلعة)',
    party2Label: 'الطرف الثاني (مقدم العرض)',
    detailsHeader: 'ثانياً: تفاصيل محل المقايضة والتبادل',
    termsHeader: 'ثالثاً: الشروط والأحكام والإقرار القانوني',
    legalDeclaration: 'يقر الطرفان بصحة البيانات والمعلومات الواردة أعلاه وبسلامة الملكية الشرعية للسلع/الخدمات التبادلية، وقد تم تأكيد هذه المقايضة إلكترونياً من كلا الحسابين الموثقين عبر منصة قايض.',
    sealText: 'ختم التوثيق الرقمي المعتمد',
    sealSubtext: 'بصمة العقد الرقمية: VERIFIED-HASH-2026',
    sealImageUrl: siteSettings.contractSettings?.sealImageUrl || '/contract_seal.svg',
    showQrCode: true,
    showInspectionTerms: true,
    customClauses: [
      {
        id: 'clause_1',
        title: 'الملكية والسلامة الشرعية',
        text: 'يتعهد الطرفان بملكية المواد والخدمات المتبادلة وعدم وجود أي حقوق للغير عليها.',
        isEnabled: true
      },
      {
        id: 'clause_2',
        title: 'شروط المعاينة والفحص',
        text: 'يلتزم الطرفان بفحص المواد عند الاستلام قبل التنازل النهائي.',
        isEnabled: true
      }
    ]
  };

  const updateContractSettings = (field: keyof ContractSettings, value: any) => {
    const updatedContract = {
      ...contractSettings,
      [field]: value
    };
    const updatedSiteSettings = {
      ...siteSettings,
      contractSettings: updatedContract
    };
    setSiteSettings(updatedSiteSettings);
    autoPersistPlatformSettings({ siteSettings: updatedSiteSettings });
  };

  const handleSaveAll = async () => {
    try {
      await savePlatformSettingsToDb({
        siteSettings,
        barterOptions,
        brandConfig,
        customPages,
        adBanners,
        landingConfig: {
          platformSlogan,
          platformDescription: platformDescription || '',
          platformImageUrl,
          feature1Title,
          feature1Desc,
          feature2Title,
          feature2Desc,
          feature3Title,
          feature3Desc
        }
      });
      onSaveNotification(
        'تم حفظ التغييرات في قاعدة البيانات',
        'تم حفظ وبث كافة إعدادات المنصة وقواعد الخيارات بنجاح إلى قاعدة بيانات Firestore.'
      );
    } catch (err) {
      console.error("Error saving settings to Firestore:", err);
      onSaveNotification(
        'حدث خطأ أثناء الحفظ',
        'لم نتمكن من الحفظ في قاعدة البيانات. يرجى إعادة المحاولة.'
      );
    }
  };

  // User Handlers
  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    try {
      await saveUserToDb(editingUser);
    } catch (e) {
      console.error("Error saving user to DB:", e);
    }
    setEditingUser(null);
    onSaveNotification('تم تحديث العضو', `تم تحديث بيانات العضو ${editingUser.name}`);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const created: User = {
      id: `user_manual_${Date.now()}`,
      name: newUserName.trim(),
      city: newUserCity,
      rating: 5.0,
      completedSwaps: 0,
      reliabilityLevel: newUserReliability,
      bio: newUserBio.trim() || 'عضو جديد في المنصة.',
      isAdmin: newUserIsAdmin,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      joinedDate: new Date().toLocaleDateString('ar-SA')
    };

    setUsers(prev => [created, ...prev]);
    try {
      await saveUserToDb(created);
    } catch (e) {
      console.error("Error creating user in DB:", e);
    }
    setIsNewUserModalOpen(false);
    setNewUserName('');
    setNewUserBio('');
    onSaveNotification('تم إضافة العضو', `تم إضافة العضو الجديد ${created.name}`);
  };

  const handleToggleUserBan = async (userId: string) => {
    let updatedUser: User | null = null;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextState = !u.isBanned;
        updatedUser = { ...u, isBanned: nextState };
        onSaveNotification(
          nextState ? 'تم حظر العضو' : 'تم إلغاء حظر العضو',
          `حالة الحساب للعضو ${u.name} هي الآن: ${nextState ? 'محظور' : 'نشط'}`
        );
        return updatedUser;
      }
      return u;
    }));
    if (updatedUser) {
      try {
        await saveUserToDb(updatedUser);
      } catch (e) {
        console.error("Error updating ban status in DB:", e);
      }
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`هل أنت تأكد من حذف العضو (${userName}) نهائياً؟`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      onSaveNotification('تم حذف العضو', `تم إزالة العضو ${userName} من النظام.`);
    }
  };

  // Helper to persist current state to Firestore automatically
  const autoPersistPlatformSettings = async (overrides: {
    siteSettings?: SiteSettings;
    barterOptions?: BarterOptions;
    customPages?: CustomPage[];
    adBanners?: AdBanner[];
  } = {}) => {
    try {
      await savePlatformSettingsToDb({
        siteSettings: overrides.siteSettings || siteSettings,
        barterOptions: overrides.barterOptions || barterOptions,
        brandConfig,
        customPages: overrides.customPages || customPages,
        adBanners: overrides.adBanners || adBanners,
        landingConfig: {
          platformSlogan,
          platformDescription: platformDescription || '',
          platformImageUrl,
          feature1Title,
          feature1Desc,
          feature2Title,
          feature2Desc,
          feature3Title,
          feature3Desc
        }
      });
    } catch (e) {
      console.error("Auto persist failed:", e);
    }
  };

  // Banner Handlers
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImageUrl.trim()) return;

    let updatedBanners: AdBanner[] = [];
    if (editingBanner) {
      updatedBanners = adBanners.map(b => b.id === editingBanner.id ? {
        ...b,
        title: bannerTitle.trim(),
        imageUrl: bannerImageUrl.trim(),
        targetUrl: bannerTargetUrl.trim(),
        position: bannerPosition,
        badgeText: bannerBadgeText.trim()
      } : b);
      setAdBanners(updatedBanners);
      onSaveNotification('تم تحديث البنرات', 'تم حفظ التعديلات على البنر الإعلاني.');
    } else {
      const newBanner: AdBanner = {
        id: `banner_${Date.now()}`,
        title: bannerTitle.trim(),
        imageUrl: bannerImageUrl.trim(),
        targetUrl: bannerTargetUrl.trim(),
        position: bannerPosition,
        isActive: true,
        badgeText: bannerBadgeText.trim() || 'إعلان'
      };
      updatedBanners = [newBanner, ...adBanners];
      setAdBanners(updatedBanners);
      onSaveNotification('تم إضافة بنر جديد', 'تم نشر البنر الإعلاني بنجاح.');
    }

    autoPersistPlatformSettings({ adBanners: updatedBanners });
    setIsBannerModalOpen(false);
    setEditingBanner(null);
  };

  const handleToggleBannerActive = (bannerId: string) => {
    const updated = adBanners.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b);
    setAdBanners(updated);
    autoPersistPlatformSettings({ adBanners: updated });
  };

  const handleDeleteBanner = (bannerId: string) => {
    const updated = adBanners.filter(b => b.id !== bannerId);
    setAdBanners(updated);
    onSaveNotification('تم حذف البنر', 'تم إزالة البنر الإعلاني.');
    autoPersistPlatformSettings({ adBanners: updated });
  };

  // Page Handlers
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim() || !pageContent.trim()) return;

    const formattedSlug = (pageSlug.trim() || pageTitle.trim().toLowerCase().replace(/\s+/g, '-'));
    let updatedPages: CustomPage[] = [];

    if (editingPage) {
      updatedPages = customPages.map(p => p.id === editingPage.id ? {
        ...p,
        title: pageTitle.trim(),
        slug: formattedSlug,
        content: pageContent.trim(),
        updatedAt: new Date().toLocaleDateString('ar-SA')
      } : p);
      setCustomPages(updatedPages);
      onSaveNotification('تم تحديث الصفحة', `تم حفظ التعديلات على صفحة (${pageTitle})`);
    } else {
      const newPage: CustomPage = {
        id: `page_${Date.now()}`,
        slug: formattedSlug,
        title: pageTitle.trim(),
        content: pageContent.trim(),
        isActive: true,
        updatedAt: new Date().toLocaleDateString('ar-SA')
      };
      updatedPages = [newPage, ...customPages];
      setCustomPages(updatedPages);
      onSaveNotification('تم إضافة صفحة جديدة', `تم إنشاء صفحة (${newPage.title}) بنجاح`);
    }

    autoPersistPlatformSettings({ customPages: updatedPages });
    setIsPageModalOpen(false);
    setEditingPage(null);
  };

  const handleTogglePageActive = (pageId: string) => {
    const updated = customPages.map(p => p.id === pageId ? { ...p, isActive: !p.isActive } : p);
    setCustomPages(updated);
    autoPersistPlatformSettings({ customPages: updated });
  };

  const handleDeletePage = (pageId: string) => {
    const updated = customPages.filter(p => p.id !== pageId);
    setCustomPages(updated);
    onSaveNotification('تم حذف الصفحة', 'تم إزالة الصفحة المخصصة بنجاح.');
    autoPersistPlatformSettings({ customPages: updated });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.city.includes(userSearch)
  );

  // Listing Control Handlers
  const handleToggleHideListing = async (listingId: string) => {
    let targetListing: Listing | undefined;
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const isHidden = !l.isHidden;
        targetListing = { ...l, isHidden };
        onSaveNotification(
          isHidden ? 'تم إخفاء الإعلان' : 'تم إظهار الإعلان',
          `الإعلان "${l.title}" أصبح الآن ${isHidden ? 'مخفياً عن زوار الواجهة' : 'ظاهراً للجميع'}.`
        );
        return targetListing;
      }
      return l;
    }));

    if (targetListing) {
      try {
        await updateListingInDb(listingId, { isHidden: targetListing.isHidden });
      } catch (e) {
        console.error("Error updating hide status in DB:", e);
      }
    }
  };

  const handleToggleListingStatus = async (listingId: string) => {
    let targetListing: Listing | undefined;
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const newStatus = l.status === 'نشط' ? 'مكتمل' : 'نشط';
        targetListing = { ...l, status: newStatus };
        onSaveNotification(
          'تم تغيير حالة الإعلان',
          `حالة الإعلان "${l.title}" أصبحت الآن: ${newStatus}`
        );
        return targetListing;
      }
      return l;
    }));

    if (targetListing) {
      try {
        await updateListingInDb(listingId, { status: targetListing.status });
      } catch (e) {
        console.error("Error updating listing status in DB:", e);
      }
    }
  };

  const handleDeleteListing = async (listingId: string, title: string) => {
    if (window.confirm(`هل أنت تأكد من حذف الإعلان (${title}) نهائياً؟`)) {
      setListings(prev => prev.filter(l => l.id !== listingId));
      onSaveNotification('تم حذف الإعلان', `تم إزالة الإعلان "${title}" بنجاح.`);
      try {
        await deleteListingFromDb(listingId);
      } catch (e) {
        console.error("Error deleting listing from DB:", e);
      }
    }
  };

  const filteredAdminListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(listingSearch.toLowerCase()) ||
      item.city.includes(listingSearch) ||
      item.wantedInReturn.toLowerCase().includes(listingSearch.toLowerCase());
    
    if (listingStatusFilter === 'active') return matchesSearch && item.status === 'نشط' && !item.isHidden;
    if (listingStatusFilter === 'completed') return matchesSearch && item.status === 'مكتمل';
    if (listingStatusFilter === 'hidden') return matchesSearch && item.isHidden;
    return matchesSearch;
  });

  const colorPresets = [
    { id: 'emerald', name: 'أخضر زمردي', bg: 'bg-emerald-600' },
    { id: 'blue', name: 'أزرق', bg: 'bg-blue-600' },
    { id: 'purple', name: 'بنفسجي', bg: 'bg-purple-600' },
    { id: 'rose', name: 'وردي', bg: 'bg-rose-600' },
    { id: 'amber', name: 'ذهبي', bg: 'bg-amber-600' },
    { id: 'brown', name: 'بني دافئ', bg: 'bg-amber-800' },
  ];

  const categories = ['أجهزة وإلكترونيات', 'خدمات برمجية وتقنية', 'تصميم ورسومات', 'أثاث وديكور', 'كتب وأدوات تعليمية', 'أخرى'];
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: listings.filter(l => l.category === cat).length
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 text-right font-sans" id="admin_panel_container" style={{ direction: 'rtl' }}>
      
      {/* 1. Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="admin_header_card">
        <div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="p-2.5 bg-brand-50 text-brand-700 rounded-2xl">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">لوحة التحكم المركزية وإدارة بادل</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                إدارة الأعضاء، البنرات الإعلانية، الصفحات المخصصة، وإعدادات العرض والألوان بالكامل.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          className="bg-brand-600 hover:bg-brand-700 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md shadow-brand-600/20 flex items-center space-x-2 space-x-reverse transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>حفظ كافة التغييرات في قاعدة البيانات</span>
        </button>
      </div>

      {/* Horizontal Tabs Bar for Quick Navigation (Mobile & Desktop) */}
      <div className="bg-white rounded-2xl p-2 border border-gray-100 shadow-2xs mb-6 overflow-x-auto scrollbar-none flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('home_branding')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'home_branding'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          🎨 الهوية والواجهة
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contract_settings')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'contract_settings'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300'
              : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 font-black'
          }`}
        >
          📜 إعدادات العقد الإلكتروني والختم
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('listings')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'listings'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          📦 الإعلانات والعروض ({listings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('barter_options')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'barter_options'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          ⚙️ خيارات المقايضة
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('members')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'members'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          👥 إدارة الأعضاء ({users.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('banners')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'banners'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          📢 البنرات الإعلانية ({adBanners.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pages')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'pages'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          📄 الصفحات المخصصة ({customPages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'settings'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          🔧 إعدادات العرض
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer border ${
            activeSubTab === 'analytics'
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          📊 الإحصائيات
        </button>
      </div>

      {/* 2. Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="admin_main_grid">
        
        {/* Right Sidebar Navigation Menu */}
        <div className="md:col-span-1 space-y-2" id="admin_sidebar_menu">
          
          <button
            onClick={() => setActiveSubTab('home_branding')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'home_branding'
                ? 'bg-brand-50 text-brand-800 border-brand-200 shadow-2xs font-black ring-1 ring-brand-500/20'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>تخصيص الواجهة الرئيسية والهوية</span>
          </button>

          <button
            onClick={() => setActiveSubTab('listings')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'listings'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs font-black ring-1 ring-emerald-500/20'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>إدارة جميع الإعلانات والعروض ({listings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('barter_options')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'barter_options'
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs font-black ring-1 ring-amber-500/20'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>خيارات صفحة المقايضة</span>
          </button>

          <button
            onClick={() => setActiveSubTab('members')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'members'
                ? 'bg-brand-50 text-brand-800 border-brand-200 shadow-2xs font-black'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>إدارة الأعضاء ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('banners')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'banners'
                ? 'bg-brand-50 text-brand-800 border-brand-200 shadow-2xs font-black'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>البنرات الإعلانية ({adBanners.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pages')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'pages'
                ? 'bg-brand-50 text-brand-800 border-brand-200 shadow-2xs font-black'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>الصفحات المخصصة ({customPages.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'settings'
                ? 'bg-brand-50 text-brand-800 border-brand-200 shadow-2xs font-black'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>إعدادات العرض والقواعد</span>
          </button>

          <button
            onClick={() => setActiveSubTab('contract_settings')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'contract_settings'
                ? 'bg-blue-50 text-blue-900 border-blue-300 shadow-2xs font-black ring-1 ring-blue-500/20'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>إعدادات العقد الإلكتروني 📜</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`w-full p-3.5 rounded-2xl font-extrabold text-xs text-right transition-all cursor-pointer border block ${
              activeSubTab === 'analytics'
                ? 'bg-brand-50 text-brand-800 border-brand-200 shadow-2xs font-black'
                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>الإحصائيات والنشاط</span>
          </button>

        </div>

        {/* Left Dynamic Content Area */}
        <div className="md:col-span-3 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm" id="admin_content_box">
          
          {/* TAB 0: ALL LISTINGS MANAGEMENT */}
          {activeSubTab === 'listings' && (
            <div className="space-y-6" id="tab_listings_content">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">إدارة جميع الإعلانات والعروض المضافة</h3>
                  <p className="text-xs text-gray-500 mt-0.5">التحكم الكامل في جميع الإعلانات بمرونة: إخفاء العروض غير اللائقة، تحويل حالتها، أو حذفها نهائياً.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="بحث بعنوان الإعلان، المالك، أو المدينة..."
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden w-full sm:w-56"
                  />
                  <select
                    value={listingStatusFilter}
                    onChange={(e) => setListingStatusFilter(e.target.value as any)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white font-bold cursor-pointer outline-hidden"
                  >
                    <option value="all">كافة الحالات ({listings.length})</option>
                    <option value="active">نشطة فقط ({listings.filter(l => l.status === 'نشط' && !l.isHidden).length})</option>
                    <option value="completed">مكتملة المقايضة ({listings.filter(l => l.status === 'مكتمل').length})</option>
                    <option value="hidden">مخفية فقط ({listings.filter(l => l.isHidden).length})</option>
                  </select>
                </div>
              </div>

              {/* Listings List */}
              <div className="space-y-3">
                {filteredAdminListings.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-500">
                    لا توجد إعلانات مطابقة لمعايير البحث والفلترة المحددة.
                  </div>
                ) : (
                  filteredAdminListings.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        item.isHidden 
                          ? 'bg-amber-50/50 border-amber-200/80' 
                          : item.status === 'مكتمل'
                            ? 'bg-gray-50/80 border-gray-100'
                            : 'bg-white border-gray-100 hover:border-emerald-200'
                      }`}
                    >
                      {/* Image & Main Info */}
                      <div className="flex items-start space-x-3 space-x-reverse min-w-0 flex-1">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-gray-100 bg-gray-100"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-1">
                            <span className="font-extrabold text-sm text-gray-900 line-clamp-1">{item.title}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              item.type === 'خدمة' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.type}
                            </span>
                            {item.isHidden && (
                              <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 space-x-reverse">
                                <EyeOff className="w-3 h-3 text-amber-700" />
                                <span>مخفي عن الواجهة</span>
                              </span>
                            )}
                            {item.status === 'مكتمل' && (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                تمت المقايضة
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 font-medium line-clamp-1">
                            المطلوب بالمقابل: <span className="font-bold text-gray-800">{item.wantedInReturn}</span>
                          </p>

                          <div className="flex items-center space-x-3 space-x-reverse text-[11px] text-gray-400 font-bold pt-0.5">
                            <span className="text-gray-700">صاحب العرض: {item.ownerName}</span>
                            <span>•</span>
                            <span>المدينة: {item.city}</span>
                            <span>•</span>
                            <span>التصنيف: {item.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls / Actions */}
                      <div className="flex items-center space-x-2 space-x-reverse self-end md:self-center shrink-0">
                        {/* Toggle Hide / Show */}
                        <button
                          onClick={() => handleToggleHideListing(item.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1 space-x-reverse ${
                            item.isHidden 
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title={item.isHidden ? 'إظهار العرض في الواجهة' : 'إخفاء العرض عن الزوار'}
                        >
                          {item.isHidden ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-gray-500" />}
                          <span>{item.isHidden ? 'إظهار الإعلان' : 'إخفاء الإعلان'}</span>
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleListingStatus(item.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            item.status === 'نشط'
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                          }`}
                        >
                          <span>{item.status === 'نشط' ? 'تحويل لمكتمل' : 'تحويل لنشط'}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteListing(item.id, item.title)}
                          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
                          title="حذف الإعلان نهائياً"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 1: MEMBERS MANAGEMENT */}
          {activeSubTab === 'members' && (
            <div className="space-y-6" id="tab_members_content">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">إدارة الأعضاء والمستخدمين</h3>
                  <p className="text-xs text-gray-500 mt-0.5">تعديل الصلاحيات، الحظر، والموثوقية لكل عضو.</p>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="بحث باسم العضو أو المدينة..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden w-full sm:w-56"
                  />
                  <button
                    onClick={() => setIsNewUserModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 space-x-reverse cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة عضو</span>
                  </button>
                </div>
              </div>

              {/* Members Table / List */}
              <div className="space-y-3">
                {filteredUsers.map((usr) => (
                  <div
                    key={usr.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                      usr.isBanned 
                        ? 'bg-rose-50/50 border-rose-200/80' 
                        : 'bg-white border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    {/* User info */}
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <img
                        src={usr.avatar}
                        alt={usr.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100"
                      />
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-1">
                          <span className="font-black text-sm text-gray-900">{usr.name}</span>
                          {usr.isAdmin && (
                            <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 space-x-reverse">
                              <Shield className="w-3 h-3 text-purple-600" />
                              <span>مشرف النظام</span>
                            </span>
                          )}
                          {usr.isBanned && (
                            <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              محظور
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse text-xs text-gray-500 mt-1">
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span>{usr.city}</span>
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">درجة الموثوقية: {usr.reliabilityLevel}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-0.5 space-x-reverse text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{usr.rating}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 space-x-reverse self-end sm:self-center">
                      <button
                        onClick={() => setEditingUser(usr)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 space-x-reverse cursor-pointer"
                        title="تعديل العضو"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        onClick={() => handleToggleUserBan(usr.id)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 space-x-reverse cursor-pointer ${
                          usr.isBanned 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        {usr.isBanned ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        <span>{usr.isBanned ? 'فك الحظر' : 'حظر'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteUser(usr.id, usr.name)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        title="حذف العضو"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AD BANNERS MANAGEMENT */}
          {activeSubTab === 'banners' && (
            <div className="space-y-6" id="tab_banners_content">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">إدارة البنرات الإعلانية (الهيدر والفوتر)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">تحكم كامل في البنرات الإعلانية الترويجية في أعلى وأسفل الصفحة.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setBannerTitle('');
                    setBannerImageUrl('');
                    setBannerTargetUrl('');
                    setBannerPosition('header');
                    setBannerBadgeText('إعلان راعي');
                    setIsBannerModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 space-x-reverse cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة بنر إعلاني جديد</span>
                </button>
              </div>

              {adBanners.length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-gray-50 rounded-3xl border border-gray-100 space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="font-bold text-xs">لا توجد بنرات إعلانية مسجلة حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adBanners.map((banner) => (
                    <div key={banner.id} className="bg-white border border-gray-200 rounded-3xl p-4 space-y-3 shadow-xs relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          banner.position === 'header' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {banner.position === 'header' ? 'بنر هيدر علوي' : 'بنر فوتر سفلي'}
                        </span>

                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleToggleBannerActive(banner.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 space-x-reverse ${
                              banner.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {banner.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{banner.isActive ? 'نشط' : 'معطل'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="relative rounded-2xl overflow-hidden h-24 bg-gray-100 border border-gray-100">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
                          <span className="text-[10px] bg-amber-500/90 text-amber-950 font-black px-2 py-0.5 rounded-md w-max mb-1">
                            {banner.badgeText || 'إعلان'}
                          </span>
                          <p className="font-bold text-xs truncate">{banner.title}</p>
                        </div>
                      </div>

                      {banner.targetUrl && (
                        <p className="text-[10px] text-gray-400 font-mono truncate flex items-center space-x-1 space-x-reverse">
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                          <span>{banner.targetUrl}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM PAGES */}
          {activeSubTab === 'pages' && (
            <div className="space-y-6" id="tab_pages_content">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">إدارة الصفحات المخصصة والشروط</h3>
                  <p className="text-xs text-gray-500 mt-0.5">إضافة وتعديل صفحات مثل الشروط والأحكام، من نحن، وسياسات المنصة.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingPage(null);
                    setPageTitle('');
                    setPageSlug('');
                    setPageContent('');
                    setIsPageModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 space-x-reverse cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة صفحة جديدة</span>
                </button>
              </div>

              <div className="space-y-3">
                {customPages.map((pg) => (
                  <div key={pg.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-2xs">
                    <div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-black text-sm text-gray-900">{pg.title}</span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-mono">
                          /{pg.slug}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1 max-w-xl">{pg.content}</p>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse shrink-0">
                      <button
                        onClick={() => handleTogglePageActive(pg.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          pg.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {pg.isActive ? 'ظاهرة بالفوتر' : 'مخفية'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingPage(pg);
                          setPageTitle(pg.title);
                          setPageSlug(pg.slug);
                          setPageContent(pg.content);
                          setIsPageModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        تعديل
                      </button>

                      <button
                        onClick={() => handleDeletePage(pg.id)}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SITE DISPLAY SETTINGS & LISTINGS LIMIT */}
          {activeSubTab === 'settings' && (
            <div className="space-y-6" id="tab_settings_content">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">إعدادات خيارات عرض المنتجات وصفحة تصفح العروض</h3>
                <p className="text-xs text-gray-500 mt-0.5">تحكم في تخطيط شبكة المنتجات (عدد العروض بالصف)، وأدوات البحث والفلاتر والقواعد.</p>
              </div>

              <div className="space-y-6 bg-gray-50/60 p-5 rounded-3xl border border-gray-100">
                {/* 1. Grid Columns Setting (Products per row) */}
                <div className="bg-white p-4.5 rounded-2xl border border-gray-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-gray-900 block">عدد المنتجات المعروضة في كل صف (أعمدة الشبكة) *</span>
                      <span className="text-[11px] text-gray-500">اختر كم منتج يظهر بجانب بعضه في الشاشات الكبيرة (الافتراضي: 4 منتجات في الصف).</span>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                      {siteSettings.gridColumns || 4} منتجات في الصف
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { cols: 2, label: 'منتجان بالصف (2)' },
                      { cols: 3, label: '3 منتجات بالصف (3)' },
                      { cols: 4, label: '4 منتجات بالصف (4 - افتراضي)' },
                      { cols: 5, label: '5 منتجات بالصف (5)' },
                    ].map((opt) => (
                      <button
                        key={opt.cols}
                        type="button"
                        onClick={() => setSiteSettings({ ...siteSettings, gridColumns: opt.cols })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center ${
                          (siteSettings.gridColumns || 4) === opt.cols
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Listings Count per Page on Home */}
                <div className="bg-white p-4.5 rounded-2xl border border-gray-100 space-y-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">عدد المنتجات المعروضة في الواجهة الرئيسية *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[4, 8, 12, 16, 24].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSiteSettings({ ...siteSettings, homeListingsLimit: num })}
                        className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          siteSettings.homeListingsLimit === num
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {num} منتج
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Product Page Filters Display Controls */}
                <div className="bg-white p-4.5 rounded-2xl border border-gray-100 space-y-3">
                  <span className="font-extrabold text-xs text-gray-900 block border-b border-gray-100 pb-2">عناصر شريط التصفية والبحث في صفحة المنتجات</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-150 cursor-pointer">
                      <span className="text-xs font-bold text-gray-800">حقل البحث النصي</span>
                      <input
                        type="checkbox"
                        checked={siteSettings.showSearchFilter !== false}
                        onChange={(e) => setSiteSettings({ ...siteSettings, showSearchFilter: e.target.checked })}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-150 cursor-pointer">
                      <span className="text-xs font-bold text-gray-800">فلتر اختيار المدينة</span>
                      <input
                        type="checkbox"
                        checked={siteSettings.showCityFilters !== false}
                        onChange={(e) => setSiteSettings({ ...siteSettings, showCityFilters: e.target.checked })}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-150 cursor-pointer">
                      <span className="text-xs font-bold text-gray-800">فلتر التصنيفات</span>
                      <input
                        type="checkbox"
                        checked={siteSettings.showCategoryFilters !== false}
                        onChange={(e) => setSiteSettings({ ...siteSettings, showCategoryFilters: e.target.checked })}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* 4. Toggles for Rules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-gray-900 block">اشتراط صورة لإضافة العرض</span>
                      <span className="text-[11px] text-gray-500">منع إضافة أي عرض بدون صورة توضيحية.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteSettings.requireImageForListings}
                      onChange={(e) => setSiteSettings({ ...siteSettings, requireImageForListings: e.target.checked })}
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-gray-900 block">الموافقة التلقائية على العروض</span>
                      <span className="text-[11px] text-gray-500">نشر المنتجات فوراً دون مراجعة إدارية.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={siteSettings.autoApproveListings}
                      onChange={(e) => setSiteSettings({ ...siteSettings, autoApproveListings: e.target.checked })}
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Terms Notice */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-800 mb-1.5">نص تنبيه شروط المقايضة بالأعلى</label>
                  <textarea
                    rows={2}
                    value={siteSettings.barterTermsNotice}
                    onChange={(e) => setSiteSettings({ ...siteSettings, barterTermsNotice: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50/30 rounded-xl p-3 text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: HOMEPAGE & BRANDING CUSTOMIZATION */}
          {activeSubTab === 'home_branding' && (
            <div className="space-y-8" id="tab_home_branding_content">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2 space-x-reverse text-emerald-700 mb-1">
                  <Palette className="w-5 h-5" />
                  <h3 className="font-black text-gray-900 text-lg">تخصيص الواجهة الرئيسية والهوية البصرية</h3>
                </div>
                <p className="text-xs text-gray-500">
                  تحكم مباشر في ألوان الموقع، الشعار، صورة الواجهة الرئيسية، النصوص الترحيبية، وبطاقات المزايا.
                </p>
              </div>

              {/* 1. Theme Color Selector */}
              <div className="bg-gray-50/60 p-5 rounded-3xl border border-gray-100 space-y-3">
                <label className="block text-xs font-black text-gray-900">1. نظام الألوان الرئيسي للمناخ البصري</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => updateConfig('primaryColor', preset.id as any)}
                      className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer text-xs font-bold ${
                        brandConfig.primaryColor === preset.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 font-black'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${preset.bg} ring-2 ring-white shadow-2xs`} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Platform Brand Name & Logo */}
              <div className="bg-gray-50/60 p-5 rounded-3xl border border-gray-100 space-y-4">
                <label className="block text-xs font-black text-gray-900">2. اسم المنصة ورمز الشعار</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم المنصة *</label>
                    <input
                      type="text"
                      value={brandConfig.brandName}
                      onChange={(e) => updateConfig('brandName', e.target.value)}
                      placeholder="مثال: بادل"
                      className="w-full border border-gray-200 rounded-xl p-3 text-xs bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">رمز أو أيموجي الشعار *</label>
                    <input
                      type="text"
                      value={brandConfig.brandLogo}
                      onChange={(e) => updateConfig('brandLogo', e.target.value)}
                      placeholder="مثال: 🔄"
                      className="w-full border border-gray-200 rounded-xl p-3 text-xs bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-hidden font-bold"
                    />
                  </div>
                </div>

                {/* Live Header Logo Preview */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500">معاينة الشعار في الهيدر العلوي:</span>
                  <div className="flex items-center space-x-2 space-x-reverse bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-100">
                    <span className="text-lg">{brandConfig.brandLogo}</span>
                    <span className="font-black text-sm text-gray-900">{brandConfig.brandName}</span>
                  </div>
                </div>
              </div>

              {/* 2.5 Header & Navbar Settings */}
              <div className="bg-gray-50/60 p-5 rounded-3xl border border-gray-100 space-y-4" id="admin_header_settings_section">
                <div className="flex items-center space-x-2 space-x-reverse text-emerald-800">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  <label className="block text-xs font-black text-gray-900">إعدادات وشكل الهيدر العلوي (Header & Navbar Settings)</label>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-3">
                  
                  {/* Announcement Bar Settings */}
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-900">شريط الإعلانات الترحيبي العريض بأعلى الهيدر (Announcement Bar)</span>
                      <button
                        type="button"
                        onClick={() => updateConfig('showHeaderNotice', !brandConfig.showHeaderNotice)}
                        className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                          brandConfig.showHeaderNotice ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>

                    {brandConfig.showHeaderNotice && (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">نص شريط التنبيهات العلوي:</label>
                        <input
                          type="text"
                          value={brandConfig.headerNoticeText || ''}
                          onChange={(e) => updateConfig('headerNoticeText', e.target.value)}
                          placeholder="مثال: أهلاً بكم في منصة المقايضة الذكية! قايض الآن بكل أمان بدون رسوم..."
                          className="w-full border border-gray-200 rounded-xl p-2.5 text-xs bg-white text-gray-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Search Bar in Header Option */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-xs font-black text-gray-900 block">عرض شريط البحث السريع داخل الهيدر</span>
                      <span className="text-[11px] text-gray-500">يتيح للزوار البحث مباشرة في أعلى كل صفحة.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateConfig('showHeaderSearch', !brandConfig.showHeaderSearch)}
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                        brandConfig.showHeaderSearch ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  {/* Show Tagline under Logo in Header */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-xs font-black text-gray-900 block">إظهار شعار اللقب الفرعي تحت اسم المنصة</span>
                      <span className="text-[11px] text-gray-500">عرض "{brandConfig.brandTagline}" أسفل اللوجو في الهيدر.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateConfig('showHeaderTagline', !brandConfig.showHeaderTagline)}
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
                        brandConfig.showHeaderTagline ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                </div>
              </div>

              {/* 3. Hero Platform Image (خيار رفع وتغيير صورة الواجهة) */}
              <div className="bg-gray-50/60 p-5 rounded-3xl border border-gray-100 space-y-4" id="admin_hero_image_section">
                <div className="flex items-center space-x-2 space-x-reverse text-emerald-800">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <label className="block text-xs font-black text-gray-900">3. خيار رفع وتغيير صورة البنر الرئيسي (Hero Image)</label>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">رابط صورة البنر مباشرة (Hero Image URL)</label>
                      <input
                        type="text"
                        value={platformImageUrl}
                        onChange={(e) => setPlatformImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full border border-gray-200 rounded-xl p-3 text-xs bg-white text-gray-800 font-mono focus:ring-2 focus:ring-emerald-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">أو رفع صورة من جهازك</label>
                      <label className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 space-x-reverse cursor-pointer transition-all shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>اختيار صورة من الجهاز</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setPlatformImageUrl(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Quick Image Presets */}
                  <div className="pt-2 border-t border-gray-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-500 block">نماذج صور مقترحة جاهزة للاستخدام:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setPlatformImageUrl('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80')}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 border border-gray-200 rounded-xl text-[11px] font-bold cursor-pointer transition-all"
                      >
                        اجتماع ومقايضة
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlatformImageUrl('https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80')}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 border border-gray-200 rounded-xl text-[11px] font-bold cursor-pointer transition-all"
                      >
                        تبادل ومصافحة عادلة
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlatformImageUrl('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80')}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 border border-gray-200 rounded-xl text-[11px] font-bold cursor-pointer transition-all"
                      >
                        خدمات وتقنية وبناء
                      </button>
                    </div>
                  </div>

                  {/* Image Live Preview Thumbnail */}
                  {platformImageUrl && (
                    <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200 bg-gray-900/5 relative max-h-52">
                      <img src={platformImageUrl} alt="معاينة الهوية" className="w-full h-44 object-contain p-2" />
                      <div className="bg-gray-900/70 p-2.5 text-white text-[11px] font-bold flex justify-between items-center">
                        <span>معاينة صورة البنر الرئيسي (ستظهر جهة اليسار)</span>
                        <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-md font-extrabold">صورة نشطة</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Hero Slogan & Text Content (خيار تعديل الكلام والعنوان للبنر الرئيسي) */}
              <div className="bg-gray-50/60 p-5 rounded-3xl border border-gray-100 space-y-4" id="admin_hero_texts_section">
                <div className="flex items-center space-x-2 space-x-reverse text-emerald-800">
                  <Edit3 className="w-4 h-4 text-emerald-600" />
                  <label className="block text-xs font-black text-gray-900">4. خيار تعديل العنوان والكلام للبنر الرئيسي (Hero Texts & Slogan)</label>
                </div>
                
                <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-200/80">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-800 mb-1.5">العنوان الرئيسي للبنر (Hero Title / Headline) *</label>
                    <textarea
                      rows={2}
                      value={platformSlogan}
                      onChange={(e) => setPlatformSlogan(e.target.value)}
                      placeholder="مثال: قايض وفاوض بما تحتاجه."
                      className="w-full border border-gray-200 bg-white rounded-xl p-3 text-xs text-gray-900 font-black focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">يمكنك استخدام السطر الجديد بالفصل لخلق عنوان متعدد الأسطر.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-800 mb-1.5">الوصف والفقرة الفرعية للبنر (Hero Subtitle / Description)</label>
                    <textarea
                      rows={3}
                      value={platformDescription || ''}
                      onChange={(e) => setPlatformDescription && setPlatformDescription(e.target.value)}
                      placeholder="مثال: منصة تتيح لك عرض منتجاتك أو مهارتك ومقايضتها بما تحتاجه مباشرة مع الآخرين..."
                      className="w-full border border-gray-200 bg-white rounded-xl p-3 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">وسام الشارة العلوي للبنر (Badge Tagline)</label>
                      <input
                        type="text"
                        value={brandConfig.brandTagline}
                        onChange={(e) => updateConfig('brandTagline', e.target.value)}
                        placeholder="منصة مقايضة كاملة"
                        className="w-full border border-gray-200 bg-white rounded-xl p-2.5 text-xs text-gray-800 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">حقوق الملكية في أسفل الصفحة (Copyright)</label>
                      <input
                        type="text"
                        value={brandConfig.copyrightText}
                        onChange={(e) => updateConfig('copyrightText', e.target.value)}
                        placeholder="© 2026 جميع الحقوق محفوظة لمجتمع المقايضة الذكية"
                        className="w-full border border-gray-200 bg-white rounded-xl p-2.5 text-xs text-gray-800 font-medium"
                      />
                    </div>
                  </div>

                  {/* Footer & Copyright Activation Toggles */}
                  <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-extrabold text-gray-900">تفعيل إظهار أسطر الحقوق (Copyright)</span>
                      <input
                        type="checkbox"
                        checked={brandConfig.showCopyright !== false}
                        onChange={(e) => updateConfig('showCopyright', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-extrabold text-gray-900">تفعيل إظهار الفوتر بالكامل (Footer)</span>
                      <input
                        type="checkbox"
                        checked={brandConfig.showFooter !== false}
                        onChange={(e) => updateConfig('showFooter', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 5. Feature Cards (المزايا الرئيسية الثلاث) */}
              <div className="bg-gray-50/60 p-5 rounded-3xl border border-gray-100 space-y-4">
                <label className="block text-xs font-black text-gray-900">5. بطاقات المزايا والقيمة المضافة في الصفحة الرئيسية</label>
                
                {/* Feature 1 */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-2">
                  <span className="text-xs font-extrabold text-emerald-800 block">الميزة الأولى</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={feature1Title}
                      onChange={(e) => setFeature1Title(e.target.value)}
                      placeholder="عنوان الميزة الأولى"
                      className="border border-gray-200 rounded-xl p-2 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={feature1Desc}
                      onChange={(e) => setFeature1Desc(e.target.value)}
                      placeholder="وصف الميزة الأولى"
                      className="sm:col-span-2 border border-gray-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-2">
                  <span className="text-xs font-extrabold text-emerald-800 block">الميزة الثانية</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={feature2Title}
                      onChange={(e) => setFeature2Title(e.target.value)}
                      placeholder="عنوان الميزة الثانية"
                      className="border border-gray-200 rounded-xl p-2 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={feature2Desc}
                      onChange={(e) => setFeature2Desc(e.target.value)}
                      placeholder="وصف الميزة الثانية"
                      className="sm:col-span-2 border border-gray-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-2">
                  <span className="text-xs font-extrabold text-emerald-800 block">الميزة الثالثة</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={feature3Title}
                      onChange={(e) => setFeature3Title(e.target.value)}
                      placeholder="عنوان الميزة الثالثة"
                      className="border border-gray-200 rounded-xl p-2 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={feature3Desc}
                      onChange={(e) => setFeature3Desc(e.target.value)}
                      placeholder="وصف الميزة الثالثة"
                      className="sm:col-span-2 border border-gray-200 rounded-xl p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-6" id="tab_analytics_content">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">تحليلات المنصة وإحصائيات النشاط</h3>
                <p className="text-xs text-gray-500 mt-0.5">نظرة عامة على أعداد الأعضاء، المنتجات، والمقايضات المكتملة.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-2xl font-black text-emerald-800 block">{users.length + brandConfig.simulatedUsers}</span>
                  <span className="text-xs font-bold text-emerald-950/70">إجمالي الأعضاء</span>
                </div>

                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-center">
                  <span className="text-2xl font-black text-blue-800 block">{listings.length}</span>
                  <span className="text-xs font-bold text-blue-950/70">العروض النشطة</span>
                </div>

                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-center">
                  <span className="text-2xl font-black text-purple-800 block">{chats.length}</span>
                  <span className="text-xs font-bold text-purple-950/70">المحادثات الجارية</span>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
                  <span className="text-2xl font-black text-amber-800 block">{customPages.length}</span>
                  <span className="text-xs font-bold text-amber-950/70">الصفحات النشطة</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BARTER PAGE OPTIONS (خيارات صفحة المقايضة) */}
          {activeSubTab === 'barter_options' && (
            <div className="space-y-6" id="tab_barter_options_content">
              
              {/* Header Info */}
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2 space-x-reverse text-amber-800 mb-1">
                  <Sliders className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-gray-900 text-base">خيارات صفحة ونموذج المقايضة</h3>
                </div>
                <p className="text-xs text-gray-500">
                  يمكنك التحكم الكامل في تفعيل أو إيقاف جميع الخانات والخيارات والإضافات الموجودة في نموذج تقديم طلب المقايضة وصفحة العروض.
                </p>
              </div>

              {/* 1. Feature Toggles Grid */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <span>الخواص والخيارات المتاحة في النموذج</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Exchange Type: Products Toggle */}
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/90 flex items-center justify-between col-span-1 sm:col-span-2">
                    <div>
                      <h5 className="font-extrabold text-xs text-emerald-950 flex items-center space-x-1.5 space-x-reverse">
                        <span className="text-sm">📦</span>
                        <span>تفعيل نوع المقايضة: السلع والمنتجات المادية (منتج / سلعة)</span>
                      </h5>
                      <p className="text-[11px] text-emerald-800/80 mt-0.5">إتاحة إضافة وتصفح وإبراز كافة السلع والمنتجات المادية المعروضة للمقايضة</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableProducts: barterOptions.enableProducts === false ? true : false })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableProducts !== false ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableProducts !== false ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Exchange Type: Services Toggle */}
                  <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/90 flex items-center justify-between col-span-1 sm:col-span-2">
                    <div>
                      <h5 className="font-extrabold text-xs text-indigo-950 flex items-center space-x-1.5 space-x-reverse">
                        <span className="text-sm">🛠️</span>
                        <span>تفعيل نوع المقايضة: الخدمات والمهارات (خدمة تقدمها)</span>
                      </h5>
                      <p className="text-[11px] text-indigo-800/80 mt-0.5">إتاحة إضافة وتصفح وإبراز الخدمات والأعمال والمهارات المباشرة للمقايضة</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableServices: barterOptions.enableServices === false ? true : false })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableServices !== false ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableServices !== false ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Cash Difference Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">تفعيل خيار التسوية المالية (المبلغ المالي)</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">إتاحة دفع أو طلب فارق مبلغ مالي بالإضافة للسلعة</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableCashDifference: !barterOptions.enableCashDifference })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableCashDifference ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableCashDifference ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Offer Note Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">تفعيل إضافة ملاحظة العرض</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">إمكانية كِتابة ملاحظة وتوضيحات نصية مع العرض</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableOfferNote: !barterOptions.enableOfferNote })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableOfferNote ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableOfferNote ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Product Selection Step Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">تفعيل اختيار المنتج مقابل السلعة</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">اشتراط اختيار منتج من قائمة إعلانات المستخدم للتبادل</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableProductSelection: !barterOptions.enableProductSelection })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableProductSelection ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableProductSelection ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Swap Rating Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">تفعيل نافذة تقييم الصفقة</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">إظهار تقييم الطرف الآخر عند تأكيد استلام المقايضة</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableSwapRating: !barterOptions.enableSwapRating })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableSwapRating ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableSwapRating ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Filter Pills Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">أزرار تصفية العروض (واردة، صادرة، معلقة)</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">عرض أزرار التصفية في أعلى صفحة عروض المقايضة</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableFilterTabs: !barterOptions.enableFilterTabs })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableFilterTabs ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableFilterTabs ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Location Field Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">خانة موقع/مدينة التسليم المقترحة</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">حقل مخصص لتحديد الحي أو المدينة المفضلة للتسليم</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableLocationField: !barterOptions.enableLocationField })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableLocationField ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableLocationField ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Delivery Method Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">خيار تحديد طريقة التوصيل/الشحن</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">تحديد التسليم المباشر أو التوصيل عبر شركات الشحن</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableDeliveryOption: !barterOptions.enableDeliveryOption })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableDeliveryOption ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableDeliveryOption ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Inspection Condition Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">خيار اشتراط معاينة وفحص السلعة</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">مربع اختيار للموافقة المشروطة بفحص المنتج قبل التبادل</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableInspectionOption: !barterOptions.enableInspectionOption })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableInspectionOption ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableInspectionOption ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                  {/* Cancel Offer Toggle */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-gray-900">زر إلغاء العرض المعلق</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5">إتاحة إلغاء العرض الصادر قبل موافقة الطرف الثاني</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBarterOptions({ ...barterOptions, enableOfferCancel: !barterOptions.enableOfferCancel })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        barterOptions.enableOfferCancel ? 'bg-amber-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        barterOptions.enableOfferCancel ? 'translate-x-0' : '-translate-x-5'
                      }`} />
                    </button>
                  </div>

                </div>
              </div>

              {/* 2. Custom Barter Fields Management Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-gray-900">إضافة خانات وحقول مخصصة لنموذج المقايضة</h4>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md">
                    عدد الخانات المخصصة: {barterOptions.customFields?.length || 0}
                  </span>
                </div>

                {/* Add Custom Field Form */}
                <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60 space-y-3 text-xs">
                  <span className="font-extrabold text-amber-900 block text-xs">إضافة خانة جديدة لنموذج التقديم:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">اسم/عنوان الخانة *</label>
                      <input
                        type="text"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="مثال: حالة الضمان والكرتون الأصلي"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">نص التوضيح (Placeholder)</label>
                      <input
                        type="text"
                        value={newFieldPlaceholder}
                        onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                        placeholder="مثال: اكتب مواصفات الفحص أو السند..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="w-4 h-4 accent-amber-600 rounded"
                      />
                      <span className="text-xs font-bold text-gray-800">جعل الخانة إجبارية عند تقديم العرض</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newFieldLabel.trim()) return;
                        const newCustomField: CustomBarterField = {
                          id: `custom_${Date.now()}`,
                          label: newFieldLabel.trim(),
                          placeholder: newFieldPlaceholder.trim(),
                          isEnabled: true,
                          isRequired: newFieldRequired
                        };
                        setBarterOptions({
                          ...barterOptions,
                          customFields: [...(barterOptions.customFields || []), newCustomField]
                        });
                        setNewFieldLabel('');
                        setNewFieldPlaceholder('');
                        setNewFieldRequired(false);
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      إضافة الخانة للنموذج
                    </button>
                  </div>
                </div>

                {/* Existing Custom Fields List */}
                <div className="space-y-2">
                  {barterOptions.customFields?.length === 0 ? (
                    <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 rounded-2xl">
                      لا توجد خانات مخصصة إضافية حالياً. يمكنك إضافة خانات حسب حاجة المنصة.
                    </div>
                  ) : (
                    barterOptions.customFields?.map((field) => (
                      <div key={field.id} className="p-3.5 bg-white rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="font-bold text-xs text-gray-900">{field.label}</span>
                            {field.isRequired ? (
                              <span className="text-[10px] bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded-md">إجبارية</span>
                            ) : (
                              <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-md">اختيارية</span>
                            )}
                          </div>
                          {field.placeholder && (
                            <p className="text-[11px] text-gray-400 mt-0.5">التوضيح: "{field.placeholder}"</p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = barterOptions.customFields.map(f => f.id === field.id ? { ...f, isEnabled: !f.isEnabled } : f);
                              setBarterOptions({ ...barterOptions, customFields: updated });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              field.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {field.isEnabled ? 'مفعلة' : 'معطلة'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = barterOptions.customFields.filter(f => f.id !== field.id);
                              setBarterOptions({ ...barterOptions, customFields: updated });
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB: ELECTRONIC CONTRACT SETTINGS */}
          {activeSubTab === 'contract_settings' && (
            <div className="space-y-6" id="tab_contract_settings_content">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">إعدادات وتخصيص العقد الإلكتروني</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      تحكم كامل بكافة نصوص وتفاصيل العقد الرقمي المعتمد في المنصة، مع إمكانية تعديل الشروط والإقرار والبنود القانونية.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 1: Contract Header & Badge Settings */}
              <div className="bg-gray-50/70 rounded-3xl p-5 border border-gray-100 space-y-4">
                <h4 className="text-xs font-black text-gray-900 border-b border-gray-200/80 pb-2">
                  1. العناوين والشارات الرئيسية للعقد
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان العقد الرئيسي</label>
                    <input
                      type="text"
                      value={contractSettings.contractTitle}
                      onChange={(e) => updateContractSettings('contractTitle', e.target.value)}
                      placeholder="عقد مقايضة وتنازل تبادلي"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الوصف الفرعي أسفل العنوان</label>
                    <input
                      type="text"
                      value={contractSettings.contractSubtitle}
                      onChange={(e) => updateContractSettings('contractSubtitle', e.target.value)}
                      placeholder="منصة قايض السعودية للمقايضة والتبادل المباشر"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">نص شارة التوثيق أعلى العقد</label>
                    <input
                      type="text"
                      value={contractSettings.documentBadgeText}
                      onChange={(e) => updateContractSettings('documentBadgeText', e.target.value)}
                      placeholder="وثيقة رسمية"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Section Titles & Parties Labels */}
              <div className="bg-gray-50/70 rounded-3xl p-5 border border-gray-100 space-y-4">
                <h4 className="text-xs font-black text-gray-900 border-b border-gray-200/80 pb-2">
                  2. مسميات الأطراف وأقسام العقد
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان قسم الأطراف الموثقة</label>
                    <input
                      type="text"
                      value={contractSettings.party1Header}
                      onChange={(e) => updateContractSettings('party1Header', e.target.value)}
                      placeholder="أولاً: طرفا الاتفاقية الموثقة"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">مسمى الطرف الأول (صاحب السلعة)</label>
                    <input
                      type="text"
                      value={contractSettings.party1Label}
                      onChange={(e) => updateContractSettings('party1Label', e.target.value)}
                      placeholder="الطرف الأول (صاحب السلعة)"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">مسمى الطرف الثاني (مقدم العرض)</label>
                    <input
                      type="text"
                      value={contractSettings.party2Label}
                      onChange={(e) => updateContractSettings('party2Label', e.target.value)}
                      placeholder="الطرف الثاني (مقدم العرض)"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عنوان قسم تفاصيل التبادل</label>
                    <input
                      type="text"
                      value={contractSettings.detailsHeader}
                      onChange={(e) => updateContractSettings('detailsHeader', e.target.value)}
                      placeholder="ثانياً: تفاصيل محل المقايضة والتبادل"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Legal Declaration & Stamp Settings */}
              <div className="bg-gray-50/70 rounded-3xl p-5 border border-gray-100 space-y-4">
                <h4 className="text-xs font-black text-gray-900 border-b border-gray-200/80 pb-2">
                  3. الإقرار القانوني والختم الرقمي
                </h4>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نص الإقرار والتعهد القانوني المعتمد في العقد</label>
                  <textarea
                    rows={3}
                    value={contractSettings.legalDeclaration}
                    onChange={(e) => updateContractSettings('legalDeclaration', e.target.value)}
                    placeholder="يقر الطرفان بصحة البيانات والمعلومات..."
                    className="w-full border border-gray-200 rounded-2xl p-3 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">نص الختم الرقمي الرسمي</label>
                    <input
                      type="text"
                      value={contractSettings.sealText}
                      onChange={(e) => updateContractSettings('sealText', e.target.value)}
                      placeholder="ختم التوثيق الرقمي المعتمد"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">بصمة التوثيق/الكود الفرعي</label>
                    <input
                      type="text"
                      value={contractSettings.sealSubtext}
                      onChange={(e) => updateContractSettings('sealSubtext', e.target.value)}
                      placeholder="بصمة العقد الرقمية: VERIFIED-HASH-2026"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                  </div>
                </div>

                {/* Seal / Logo Image Settings */}
                <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-gray-900 block">شعار / ختم العقد الرسمي 🏅</span>
                      <span className="text-[11px] text-gray-500">قم برفع صورة الشعار/الختم أو وضع رابط الصورة ليتم تضمينها مباشرة في العقد الإلكتروني</span>
                    </div>
                    {contractSettings.sealImageUrl && (
                      <button
                        type="button"
                        onClick={() => updateContractSettings('sealImageUrl', '')}
                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        إزالة الشعار
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    {contractSettings.sealImageUrl ? (
                      <div className="w-20 h-20 rounded-2xl border-2 border-emerald-500/30 bg-gray-50 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden relative group">
                        <img
                          src={contractSettings.sealImageUrl}
                          alt="ختم العقد"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center shrink-0 text-gray-400">
                        <Upload className="w-6 h-6 mb-1 text-gray-400" />
                        <span className="text-[9px] font-bold">لا يوجد ختم</span>
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs flex items-center space-x-1.5 space-x-reverse shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع صورة الختم/الشعار</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const result = event.target?.result as string;
                                  if (result) {
                                    updateContractSettings('sealImageUrl', result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <span className="text-[11px] text-gray-400">أو أدخل الرابط المباشر:</span>
                      </div>

                      <input
                        type="url"
                        value={contractSettings.sealImageUrl || ''}
                        onChange={(e) => updateContractSettings('sealImageUrl', e.target.value)}
                        placeholder="https://example.com/seal_logo.png"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center space-x-2.5 space-x-reverse p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contractSettings.showQrCode !== false}
                      onChange={(e) => updateContractSettings('showQrCode', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-xs font-bold text-gray-800">إظهار رمز باركود التحقق الذكي (QR Code)</span>
                  </label>

                  <label className="flex items-center space-x-2.5 space-x-reverse p-3 bg-white rounded-2xl border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contractSettings.showInspectionTerms !== false}
                      onChange={(e) => updateContractSettings('showInspectionTerms', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-xs font-bold text-gray-800">إظهار بند معاينة وفحص السلعة قبل التسليم</span>
                  </label>
                </div>
              </div>

              {/* SECTION 4: Custom Contract Clauses Manager */}
              <div className="bg-gray-50/70 rounded-3xl p-5 border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200/80 pb-2">
                  <h4 className="text-xs font-black text-gray-900">
                    4. إدارة بنود الشروط والأحكام الخاصة بالعقد
                  </h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                    {contractSettings.customClauses?.length || 0} بنود
                  </span>
                </div>

                {/* Add new clause form */}
                <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-3">
                  <span className="text-xs font-bold text-blue-900 block">إضافة بند جديد للعقد الإلكتروني:</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="عنوان البند (مثال: شروط الضمان)"
                        value={newClauseTitle}
                        onChange={(e) => setNewClauseTitle(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50 focus:bg-white outline-hidden"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="نص البند التفصيلي الوارد بالعقد..."
                        value={newClauseText}
                        onChange={(e) => setNewClauseText(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-gray-50 focus:bg-white outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newClauseTitle.trim() || !newClauseText.trim()) return;
                        const newClause: ContractClause = {
                          id: `clause_${Date.now()}`,
                          title: newClauseTitle.trim(),
                          text: newClauseText.trim(),
                          isEnabled: true
                        };
                        const updatedClauses = [...(contractSettings.customClauses || []), newClause];
                        updateContractSettings('customClauses', updatedClauses);
                        setNewClauseTitle('');
                        setNewClauseText('');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 space-x-reverse"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة البند للعقد</span>
                    </button>
                  </div>
                </div>

                {/* Clauses list */}
                <div className="space-y-2">
                  {(!contractSettings.customClauses || contractSettings.customClauses.length === 0) ? (
                    <div className="p-4 bg-white text-center text-xs text-gray-400 rounded-2xl border border-dashed border-gray-200">
                      لا توجد بنود إضافية حالياً. جميع العقود ستستخدم الشروط الأساسية والافتراضية.
                    </div>
                  ) : (
                    contractSettings.customClauses.map((clause) => (
                      <div key={clause.id} className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="font-extrabold text-xs text-gray-900">{clause.title}</span>
                            {clause.isEnabled ? (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">مفعل بالعقد</span>
                            ) : (
                              <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-md">موقوف مؤقتاً</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{clause.text}</p>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse self-end sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedClauses = contractSettings.customClauses?.map(c => 
                                c.id === clause.id ? { ...c, isEnabled: !c.isEnabled } : c
                              );
                              updateContractSettings('customClauses', updatedClauses);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              clause.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {clause.isEnabled ? 'تعديل إلى تعطيل' : 'تفعيل البند'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const updatedClauses = contractSettings.customClauses?.filter(c => c.id !== clause.id);
                              updateContractSettings('customClauses', updatedClauses);
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          )}

          {/* Bottom Save Action Bar */}
          <div className="mt-8 pt-5 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs" id="admin_bottom_save_bar">
            <div>
              <h4 className="text-xs font-black text-gray-900">حفظ الإعدادات والتغيرات</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">اضغط على زر الحفظ لتأكيد وتطبيق جميع التعديلات والإعدادات على المنصة.</p>
            </div>
            <button
              type="button"
              onClick={handleSaveAll}
              className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center space-x-2 space-x-reverse cursor-pointer shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>حفظ جميع التغييرات</span>
            </button>
          </div>

        </div>
      </div>

      {/* --- EDIT USER MODAL --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-base text-gray-900">تعديل بيانات العضو ({editingUser.name})</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">المدينة *</label>
                <select
                  value={editingUser.city}
                  onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value as City })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">درجة الموثوقية *</label>
                <select
                  value={editingUser.reliabilityLevel}
                  onChange={(e) => setEditingUser({ ...editingUser, reliabilityLevel: e.target.value as any })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="ممتاز">ممتاز</option>
                  <option value="جيد جداً">جيد جداً</option>
                  <option value="مبتدئ">مبتدئ</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-800">صلاحية مشرف (Admin)</span>
                <input
                  type="checkbox"
                  checked={!!editingUser.isAdmin}
                  onChange={(e) => setEditingUser({ ...editingUser, isAdmin: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600"
                />
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD NEW USER MODAL --- */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-base text-gray-900">إضافة عضو جديد إدارياً</h3>
              <button onClick={() => setIsNewUserModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم العضو *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="مثال: محمد الشمري"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">المدينة *</label>
                <select
                  value={newUserCity}
                  onChange={(e) => setNewUserCity(e.target.value as City)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  إضافة العضو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT BANNER MODAL --- */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-base text-gray-900">{editingBanner ? 'تعديل البنر الإعلاني' : 'إضافة بنر إعلاني جديد'}</h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">عنوان البنر الإعلاني *</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="مثال: خصم 20% على خدمات التصميم والبرمجة"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">موقع البنر *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBannerPosition('header')}
                    className={`py-2 rounded-xl font-bold border ${bannerPosition === 'header' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-gray-50 border-gray-200'}`}
                  >
                    أعلى الصفحة (الهيدر)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerPosition('footer')}
                    className={`py-2 rounded-xl font-bold border ${bannerPosition === 'footer' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-gray-50 border-gray-200'}`}
                  >
                    أسفل الصفحة (الفوتر)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">رابط صورة البنر *</label>
                <input
                  type="text"
                  required
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">رابط التوجيه عند النقر (اختياري)</label>
                <input
                  type="text"
                  value={bannerTargetUrl}
                  onChange={(e) => setBannerTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  حفظ البنر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT CUSTOM PAGE MODAL --- */}
      {isPageModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-base text-gray-900">{editingPage ? 'تعديل الصفحة المخصصة' : 'إنشاء صفحة جديدة'}</h3>
              <button onClick={() => setIsPageModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">عنوان الصفحة *</label>
                <input
                  type="text"
                  required
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="مثال: شروط وقواعد المقايضة العادلة"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">محتوى الصفحة التفصيلي *</label>
                <textarea
                  required
                  rows={6}
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  placeholder="اكتب هنا جميع النصوص والتفاصيل والشروط الخاصة بالصفحة..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50"
                />
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  حفظ الصفحة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
