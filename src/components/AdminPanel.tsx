import React, { useState } from 'react';
import { 
  FileText, Shield, Palette, Sliders, Package, Users, Image as ImageIcon, 
  Settings, BarChart3, Plus, Trash2, Edit3, Eye, EyeOff, Check, X, Search,
  QrCode, Save, Upload, AlertTriangle, ExternalLink, ShieldAlert, ShieldCheck,
  LayoutDashboard, Megaphone, Bell, Phone, Mail, Globe, Lock, Unlock,
  MessageSquare, Sparkles, CheckCircle2, XCircle, ChevronLeft, Building,
  Zap, Ban, RefreshCw, CheckSquare, Layers
} from 'lucide-react';
import { 
  User, Listing, Chat, CustomPage, AdBanner, SiteSettings, BrandConfig, 
  BarterOptions, ContractSettings, ContractClause, CustomBarterField 
} from '../types';
import { 
  savePlatformSettingsToDb, 
  saveUserToDb, 
  updateListingInDb, 
  deleteListingFromDb, 
  clearAllListingsFromDb,
  clearAllDemoDataFromDb
} from '../services/firebaseService';

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

const DEFAULT_CONTRACT: ContractSettings = {
  contractTitle: 'عقد مقايضة وتنازل رسمية',
  contractSubtitle: 'وثيقة رسمية ملزمة لطرفي المقايضة عبر منصة المقايضة الذكية',
  documentBadgeText: 'عقد إلكتروني معتمد',
  party1Header: 'بيانات الطرف الأول',
  party1Label: 'الطرف الأول (صاحب السلعة/الخدمة الأولى)',
  party2Label: 'الطرف الثاني (صاحب السلعة/الخدمة المقابلة)',
  detailsHeader: 'تفاصيل محل المقايضة والبنود',
  termsHeader: 'الشروط والإقرارات القانونية',
  legalDeclaration: 'يقر الطرفان بأهليتهما الشرعية ويتعهدان بالمقايضة حسب المواصفات دون أي مسؤولية مالية على المنصة الوسيطة.',
  sealText: 'منصة المقايضة الذكية المعتمدة',
  sealSubtext: 'توثيق إلكتروني ومطابقة موثقة',
  sealImageUrl: '',
  showQrCode: true,
  showInspectionTerms: true,
  requireNafathForContract: false,
  customClauses: [
    {
      id: 'c1',
      title: 'المعاينة والفحص قبل الاستلام',
      text: 'يلتزم الطرفان بمعاينة المواد والسلع قبل التسليم النهائي للتأكد من خلوها من العيوب غير المعلنة.',
      isEnabled: true
    },
    {
      id: 'c2',
      title: 'إخلاء مسؤولية المنصة',
      text: 'المنصة تقدم خدمة تقنية للتوفيق والتوثيق فقط، ولا تتحمل جودة الأغراض المقايَض عليها أو الأخطاء الفردية.',
      isEnabled: true
    }
  ]
};

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
  platformDescription = '',
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
  onSaveNotification,
}: AdminPanelProps) {

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'general' | 'display' | 'swaps' | 'products' | 'users' | 'contract' | 'header' | 'footer' | 'ads' | 'listings_manage' | 'pages'
  >('overview');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // User Filter State
  const [userSearch, setUserSearch] = useState('');

  // Listings Filter State
  const [listingSearch, setListingSearch] = useState('');

  // Contract state helper
  const contract: ContractSettings = siteSettings.contractSettings || DEFAULT_CONTRACT;

  // New Custom Clause Form State
  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseText, setNewClauseText] = useState('');

  // New Custom Barter Field Form State
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // New Ad Banner Form State
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdImageUrl, setNewAdImageUrl] = useState('');
  const [newAdTargetUrl, setNewAdTargetUrl] = useState('');
  const [newAdPosition, setNewAdPosition] = useState<'header' | 'footer' | 'feed'>('header');
  const [newAdBadge, setNewAdBadge] = useState('إعلان مميز');

  // New Custom Page Form State
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageContent, setNewPageContent] = useState('');

  // Global Save Handler to Firebase & Parent State
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // 1. Update Parent Local State
      setBrandConfig(brandConfig);
      setSiteSettings(siteSettings);
      setBarterOptions(barterOptions);
      setCustomPages(customPages);
      setAdBanners(adBanners);

      // 2. Persist to Firebase Settings Doc
      await savePlatformSettingsToDb({
        siteSettings,
        barterOptions,
        brandConfig,
        customPages,
        adBanners,
        landingConfig: {
          platformSlogan,
          platformDescription,
          platformImageUrl,
          feature1Title,
          feature1Desc,
          feature2Title,
          feature2Desc,
          feature3Title,
          feature3Desc,
        }
      });

      onSaveNotification('تم حفظ الإعدادات', 'تم حفظ جميع خيارات المنصة ولوحة التحكم في الـ Cloud بنجاح.');
      setSaveSuccessMsg('تم حفظ كافة التغييرات وإعدادات المنصة بنجاح!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
      onSaveNotification('خطأ في الحفظ', 'حدث خطأ أثناء حفظ الإعدادات في قاعدة البيانات.');
    } finally {
      setIsSaving(false);
    }
  };

  // Clause Handlers
  const handleAddClause = () => {
    if (!newClauseTitle.trim() || !newClauseText.trim()) return;
    const newClause: ContractClause = {
      id: 'clause_' + Date.now(),
      title: newClauseTitle.trim(),
      text: newClauseText.trim(),
      isEnabled: true,
    };
    const updated = [...contract.customClauses, newClause];
    setSiteSettings({
      ...siteSettings,
      contractSettings: {
        ...contract,
        customClauses: updated
      }
    });
    setNewClauseTitle('');
    setNewClauseText('');
  };

  const handleToggleClause = (id: string) => {
    const updated = contract.customClauses.map(c => c.id === id ? { ...c, isEnabled: !c.isEnabled } : c);
    setSiteSettings({
      ...siteSettings,
      contractSettings: {
        ...contract,
        customClauses: updated
      }
    });
  };

  const handleDeleteClause = (id: string) => {
    const updated = contract.customClauses.filter(c => c.id !== id);
    setSiteSettings({
      ...siteSettings,
      contractSettings: {
        ...contract,
        customClauses: updated
      }
    });
  };

  // Custom Field Handlers
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: CustomBarterField = {
      id: 'field_' + Date.now(),
      label: newFieldLabel.trim(),
      placeholder: newFieldPlaceholder.trim() || undefined,
      isEnabled: true,
      isRequired: newFieldRequired
    };
    const updated = [...(barterOptions.customFields || []), newField];
    setBarterOptions({
      ...barterOptions,
      customFields: updated
    });
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldRequired(false);
  };

  const handleToggleCustomField = (id: string) => {
    const updated = (barterOptions.customFields || []).map(f => f.id === id ? { ...f, isEnabled: !f.isEnabled } : f);
    setBarterOptions({ ...barterOptions, customFields: updated });
  };

  const handleDeleteCustomField = (id: string) => {
    const updated = (barterOptions.customFields || []).filter(f => f.id !== id);
    setBarterOptions({ ...barterOptions, customFields: updated });
  };

  // User Actions
  const handleToggleBanUser = async (user: User) => {
    const updatedUser: User = { ...user, isBanned: !user.isBanned };
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    await saveUserToDb(updatedUser);
    onSaveNotification('تعديل حساب', `تم ${updatedUser.isBanned ? 'حظر' : 'إلغاء حظر'} المستخدم ${user.name}`);
  };

  const handleToggleVerifyUser = async (user: User) => {
    const updatedUser: User = { ...user, isVerified: !user.isVerified };
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    await saveUserToDb(updatedUser);
    onSaveNotification('توثيق حساب', `تم ${updatedUser.isVerified ? 'توثيق' : 'إلغاء توثيق'} المستخدم ${user.name}`);
  };

  const handleToggleNafathUser = async (user: User) => {
    const updatedUser: User = { ...user, isNafathVerified: !user.isNafathVerified };
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    await saveUserToDb(updatedUser);
    onSaveNotification('توثيق نفاذ', `تم ${updatedUser.isNafathVerified ? 'توثيق نفاذ' : 'إلغاء توثيق نفاذ'} للمستخدم ${user.name}`);
  };

  // Listing Actions
  const handleToggleListingVisibility = async (listing: Listing) => {
    const updated: Listing = { ...listing, isHidden: !listing.isHidden };
    setListings(listings.map(l => l.id === listing.id ? updated : l));
    await updateListingInDb(listing.id, updated);
    onSaveNotification('تحديث العرض', `تم ${updated.isHidden ? 'إخفاء' : 'إظهار'} العرض (${listing.title})`);
  };

  const handleDeleteListing = async (id: string) => {
    setListings(listings.filter(l => l.id !== id));
    await deleteListingFromDb(id);
    onSaveNotification('حذف عرض', 'تم حذف العرض بنجاح من قاعدة البيانات.');
  };

  // Ad Banner Actions
  const handleAddAdBanner = () => {
    if (!newAdTitle.trim() || !newAdImageUrl.trim()) return;
    const newBanner: AdBanner = {
      id: 'banner_' + Date.now(),
      title: newAdTitle.trim(),
      imageUrl: newAdImageUrl.trim(),
      targetUrl: newAdTargetUrl.trim() || '#',
      position: newAdPosition,
      isActive: true,
      badgeText: newAdBadge.trim() || 'إعلان'
    };
    const updated = [...adBanners, newBanner];
    setAdBanners(updated);
    setNewAdTitle('');
    setNewAdImageUrl('');
    setNewAdTargetUrl('');
  };

  const handleToggleAdBanner = (id: string) => {
    const updated = adBanners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    setAdBanners(updated);
  };

  const handleDeleteAdBanner = (id: string) => {
    const updated = adBanners.filter(b => b.id !== id);
    setAdBanners(updated);
  };

  // Custom Page Actions
  const handleAddCustomPage = () => {
    if (!newPageTitle.trim() || !newPageContent.trim()) return;
    const slug = newPageSlug.trim() || 'page-' + Date.now();
    const newPage: CustomPage = {
      id: 'page_' + Date.now(),
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      title: newPageTitle.trim(),
      content: newPageContent.trim(),
      isActive: true,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCustomPages([...customPages, newPage]);
    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageContent('');
  };

  const handleToggleCustomPage = (id: string) => {
    setCustomPages(customPages.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleDeleteCustomPage = (id: string) => {
    setCustomPages(customPages.filter(p => p.id !== id));
  };

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.city?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone?.includes(userSearch)
  );

  const filteredListings = listings.filter(l =>
    l.title?.toLowerCase().includes(listingSearch.toLowerCase()) ||
    l.category?.toLowerCase().includes(listingSearch.toLowerCase()) ||
    l.ownerName?.toLowerCase().includes(listingSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 text-right font-sans space-y-8" id="admin_control_panel" style={{ direction: 'rtl' }}>
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-l from-brand-900 via-brand-800 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-brand-700/50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 space-x-reverse mb-2">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <Settings className="w-7 h-7 text-brand-300" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">لوحة تحكم المنصة الشاملة</h1>
                <p className="text-xs sm:text-sm text-brand-200 mt-1 font-medium">
                  إدارة كافة خيارات الواجهة، الهيدر، الفوتر، العقد الإلكتروني، الإعلانات، المنتجات، والأعضاء.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center justify-center space-x-2 space-x-reverse bg-amber-400 hover:bg-amber-300 text-gray-950 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ كافة التغييرات'}</span>
            </button>
          </div>
        </div>

        {/* Global Success Banner Notification */}
        {saveSuccessMsg && (
          <div className="mt-4 bg-emerald-500 text-white p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 space-x-reverse animate-fade-in shadow-md">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white rounded-3xl p-2 border border-gray-150 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'overview' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>نظرة عامة</span>
          </button>

          <button
            onClick={() => setActiveSubTab('general')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'general' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>واجهة المنصة والهوية</span>
          </button>

          <button
            onClick={() => setActiveSubTab('display')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'display' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>عرض المنتجات والرئيسية</span>
          </button>

          <button
            onClick={() => setActiveSubTab('swaps')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'swaps' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>خيارات المقايضات</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'products' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>خيارات المنتجات</span>
          </button>

          <button
            onClick={() => setActiveSubTab('contract')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'contract' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>العقد الإلكتروني</span>
          </button>

          <button
            onClick={() => setActiveSubTab('header')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'header' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>خيارات الهيدر</span>
          </button>

          <button
            onClick={() => setActiveSubTab('footer')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'footer' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>خيارات الفوتر</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ads')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'ads' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>خيارات الإعلانات</span>
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'users' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة الأعضاء</span>
          </button>

          <button
            onClick={() => setActiveSubTab('listings_manage')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'listings_manage' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>إدارة العروض</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pages')}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'pages' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>الصفحات المخصصة</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: OVERVIEW & STATS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-bold">العروض والمنتجات</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{listings.length}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">نشط بالمنصة</p>
              </div>
              <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-bold">إجمالي الأعضاء</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{users.length}</h3>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">حسابات مسجلة</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-bold">محادثات وعروض المقايضة</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{chats.length}</h3>
                <p className="text-[11px] text-purple-600 font-semibold mt-1">صفقة جارية</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-bold">حالة المنصة</p>
                <h3 className="text-lg font-black text-gray-900 mt-1">
                  {siteSettings.maintenanceMode ? 'وضع الصيانة' : 'نشطة وجاهزة'}
                </h3>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                  siteSettings.maintenanceMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {siteSettings.maintenanceMode ? 'مغلقة مؤقتاً' : 'تعمل بكفاءة'}
                </span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs space-y-4">
            <h3 className="text-base font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>إجراءات وإعدادات سريعة</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="text-xs font-extrabold text-gray-900">حالة وضع الصيانة</h4>
                <p className="text-[11px] text-gray-500">عند تفعيله يظهر تنبيه صيانة للمستخدمين لمنع إضافة العروض أثناء التحديث.</p>
                <button
                  type="button"
                  onClick={() => {
                    const next = !siteSettings.maintenanceMode;
                    setSiteSettings({ ...siteSettings, maintenanceMode: next });
                    onSaveNotification('تغيير حالة الصيانة', next ? 'تم تفعيل وضع الصيانة' : 'تم تعطيل وضع الصيانة');
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    siteSettings.maintenanceMode 
                      ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {siteSettings.maintenanceMode ? 'تعطيل وضع الصيانة' : 'تفعيل وضع الصيانة'}
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="text-xs font-extrabold text-gray-900">الموافقة التلقائية على المنتجات</h4>
                <p className="text-[11px] text-gray-500">نشر المنتجات والعروض فور إضافتها بدون الحاجة لمراجعة المشرف.</p>
                <button
                  type="button"
                  onClick={() => {
                    const next = !siteSettings.autoApproveListings;
                    setSiteSettings({ ...siteSettings, autoApproveListings: next });
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    siteSettings.autoApproveListings 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {siteSettings.autoApproveListings ? 'مفعلة تلقائياً' : 'تتطلب موافقة المشرف'}
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="text-xs font-extrabold text-gray-900">تفريغ وبيانات تجريبية</h4>
                <p className="text-[11px] text-gray-500">تنظيف بقايا العروض الوهمية وقاعدة البيانات.</p>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm('هل أنت تأكد من مسح العروض التجريبية؟')) {
                      await clearAllDemoDataFromDb();
                      onSaveNotification('تنظيف البيانات', 'تم تنظيف البيانات التجريبية بنجاح.');
                    }
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-xl text-xs font-bold transition-all border border-red-200 cursor-pointer"
                >
                  مسح البيانات التجريبية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GENERAL & BRANDING */}
      {activeSubTab === 'general' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-8 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <Palette className="w-5 h-5 text-brand-600" />
              <span>إعدادات واجهة المنصة والهوية البصرية</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">اسم المنصة الرئيسي</label>
              <input
                type="text"
                value={brandConfig.brandName || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, brandName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="منصة المقايضة الذكية"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">رمز / حرف الشعار</label>
              <input
                type="text"
                value={brandConfig.brandLogo || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, brandLogo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="م"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700">العبارة الترويجية (Tagline)</label>
              <input
                type="text"
                value={brandConfig.brandTagline || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, brandTagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="مقايضة مباشرة، موثوقة وعادلة بين المستخدمين"
              />
            </div>

            {/* Color Theme Selector */}
            <div className="space-y-3 md:col-span-2 bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <label className="block text-xs font-bold text-gray-900">النسق واللون الأساسي للموقع (Primary Theme Color)</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'emerald', name: 'أخضر زمردي (Emerald)', color: 'bg-emerald-600' },
                  { id: 'blue', name: 'أزرق ملكي (Royal Blue)', color: 'bg-blue-600' },
                  { id: 'purple', name: 'بنفسجي فخم (Purple)', color: 'bg-purple-600' },
                  { id: 'rose', name: 'وردي / أحمر (Rose)', color: 'bg-rose-600' },
                  { id: 'amber', name: 'ذهبي / عنبري (Amber)', color: 'bg-amber-600' },
                  { id: 'brown', name: 'بني دافئ (Warm Saddle)', color: 'bg-amber-900' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setBrandConfig({ ...brandConfig, primaryColor: c.id as any })}
                    className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      brandConfig.primaryColor === c.id 
                        ? 'bg-white border-brand-600 shadow-md ring-2 ring-brand-500 text-gray-900' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${c.color}`}></span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Banner Controls */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700">عنوان الواجهة الترحيبية الرئيسية (Hero Slogan)</label>
              <input
                type="text"
                value={platformSlogan}
                onChange={(e) => setPlatformSlogan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700">وصف الواجهة الترحيبية الرئيسية</label>
              <textarea
                rows={2}
                value={platformDescription}
                onChange={(e) => setPlatformDescription && setPlatformDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700">رابط صورة البنر الترويجي الرئيسي (Hero Image URL)</label>
              <input
                type="text"
                value={platformImageUrl}
                onChange={(e) => setPlatformImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Feature Cards 1, 2, 3 */}
            <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-150">
              <h3 className="text-sm font-black text-gray-900">بطاقات المزايا الرئيسية الثلاث بالصفحة</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-gray-800">الميزة الأولى - العنوان</label>
                  <input
                    type="text"
                    value={feature1Title}
                    onChange={(e) => setFeature1Title(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                  <label className="block text-xs font-bold text-gray-800">الميزة الأولى - الوصف</label>
                  <textarea
                    rows={2}
                    value={feature1Desc}
                    onChange={(e) => setFeature1Desc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-gray-800">الميزة الثانية - العنوان</label>
                  <input
                    type="text"
                    value={feature2Title}
                    onChange={(e) => setFeature2Title(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                  <label className="block text-xs font-bold text-gray-800">الميزة الثانية - الوصف</label>
                  <textarea
                    rows={2}
                    value={feature2Desc}
                    onChange={(e) => setFeature2Desc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-gray-800">الميزة الثالثة - العنوان</label>
                  <input
                    type="text"
                    value={feature3Title}
                    onChange={(e) => setFeature3Title(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                  <label className="block text-xs font-bold text-gray-800">الميزة الثالثة - الوصف</label>
                  <textarea
                    rows={2}
                    value={feature3Desc}
                    onChange={(e) => setFeature3Desc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: DISPLAY & HOME LISTINGS */}
      {activeSubTab === 'display' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <Layers className="w-5 h-5 text-brand-600" />
              <span>إعدادات عرض المنتجات والعروض بالصفحة الرئيسية</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">عدد أعمدة الشبكة للشاشات الكبيرة (Grid Columns)</label>
              <select
                value={siteSettings.gridColumns || 4}
                onChange={(e) => setSiteSettings({ ...siteSettings, gridColumns: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value={2}>عمودان (2 Columns)</option>
                <option value={3}>3 أعمدة (3 Columns)</option>
                <option value={4}>4 أعمدة (4 Columns - الموصى به)</option>
                <option value={5}>5 أعمدة (5 Columns)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">حد أقصى للسيارات والعروض المعروضة بالرئيسية</label>
              <input
                type="number"
                min={4}
                max={100}
                value={siteSettings.homeListingsLimit || 12}
                onChange={(e) => setSiteSettings({ ...siteSettings, homeListingsLimit: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Filter Toggles */}
            <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-150">
              <h3 className="text-sm font-black text-gray-900">خيارات فلاتر البحث والصفحة الرئيسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={siteSettings.showSearchFilter !== false}
                    onChange={(e) => setSiteSettings({ ...siteSettings, showSearchFilter: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 block">شريط البحث بالكلمات</span>
                    <span className="text-[10px] text-gray-500">إظهار محرك البحث بالكلمات المفتاحية</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={siteSettings.showCityFilters !== false}
                    onChange={(e) => setSiteSettings({ ...siteSettings, showCityFilters: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 block">فلاتر المدن</span>
                    <span className="text-[10px] text-gray-500">فلترة العروض بحسب المدينة</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={siteSettings.showCategoryFilters !== false}
                    onChange={(e) => setSiteSettings({ ...siteSettings, showCategoryFilters: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 block">فلاتر التصنيفات</span>
                    <span className="text-[10px] text-gray-500">إظهار أزرار التصنيفات والأقسام</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SWAPS & BARTER OPTIONS */}
      {activeSubTab === 'swaps' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <Sliders className="w-5 h-5 text-brand-600" />
              <span>إعدادات وتفاصيل صفحة المقايضات وتقديم العروض</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={barterOptions.enableProducts !== false}
                onChange={(e) => setBarterOptions({ ...barterOptions, enableProducts: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">تفعيل مقايضة السلع والأغراض</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={barterOptions.enableServices !== false}
                onChange={(e) => setBarterOptions({ ...barterOptions, enableServices: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">تفعيل مقايضة الخدمات والمنافع</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={barterOptions.enableCashDifference}
                onChange={(e) => setBarterOptions({ ...barterOptions, enableCashDifference: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">تفعيل خيار زيادة / طلب الفارق النقدي</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={barterOptions.enableOfferNote}
                onChange={(e) => setBarterOptions({ ...barterOptions, enableOfferNote: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">تفعيل خيار كتابة ملاحظة أو تفاصيل إضافية</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={barterOptions.enableLocationField}
                onChange={(e) => setBarterOptions({ ...barterOptions, enableLocationField: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">تفعيل خيار موقع/مكان التسليم والتسلم</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={barterOptions.enableInspectionOption}
                onChange={(e) => setBarterOptions({ ...barterOptions, enableInspectionOption: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">تفعيل خيار اشتراط المعاينة والفحص</span>
            </label>
          </div>

          {/* Custom Fields Builder */}
          <div className="space-y-4 pt-4 border-t border-gray-150">
            <h3 className="text-sm font-black text-gray-900">حقول المقايضة المخصصة (Custom Fields Builder)</h3>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="عنوان الحقل (مثال: حالة الضمان)"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <input
                type="text"
                placeholder="النص التوضيحي داخل الحقل"
                value={newFieldPlaceholder}
                onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <label className="flex items-center space-x-1.5 space-x-reverse px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer text-xs font-bold">
                <input
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="rounded text-brand-600"
                />
                <span>إجباري</span>
              </label>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                إضافة الحقل
              </button>
            </div>

            <div className="space-y-2">
              {(barterOptions.customFields || []).map((field) => (
                <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-xs font-bold text-gray-900">{field.label}</span>
                    {field.isRequired && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">إجباري</span>}
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      type="button"
                      onClick={() => handleToggleCustomField(field.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        field.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {field.isEnabled ? 'مفعل' : 'معطل'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomField(field.id)}
                      className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-150">
            <label className="block text-xs font-bold text-gray-700">تنبيه وإخلاء مسؤولية شروط المقايضة</label>
            <textarea
              rows={3}
              value={siteSettings.barterTermsNotice || ''}
              onChange={(e) => setSiteSettings({ ...siteSettings, barterTermsNotice: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      )}

      {/* SUBTAB 5: PRODUCTS & CONTACT SETTINGS */}
      {activeSubTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <Package className="w-5 h-5 text-brand-600" />
              <span>إعدادات صفحة المنتجات وتفاصيل التواصل</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={siteSettings.allowDirectPhoneContact}
                onChange={(e) => setSiteSettings({ ...siteSettings, allowDirectPhoneContact: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">السماح بالتواصل الهاتفي المباشر</span>
                <span className="text-[10px] text-gray-500">إظهار رقم الهاتف لصاحب العرض بدلاً من الاقتصار على المحادثة</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={siteSettings.requireImageForListings}
                onChange={(e) => setSiteSettings({ ...siteSettings, requireImageForListings: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">إلزامية رفع صورة للعرض</span>
                <span className="text-[10px] text-gray-500">منع نشر أي عرض بدون إرفاق صورة توضيحية</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={siteSettings.autoApproveListings}
                onChange={(e) => setSiteSettings({ ...siteSettings, autoApproveListings: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">الموافقة الفورية على العروض</span>
                <span className="text-[10px] text-gray-500">نشر المنتجات تلقائياً بدون مراجعة المشرف</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={barterOptions.enableSwapRating}
                onChange={(e) => setBarterOptions({ ...barterOptions, enableSwapRating: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">تفعيل تقييمات المقايضات</span>
                <span className="text-[10px] text-gray-500">السماح للأطراف بتقييم بعضهم بعد التبادل</span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* SUBTAB 6: DIGITAL CONTRACT */}
      {activeSubTab === 'contract' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <FileText className="w-5 h-5 text-brand-600" />
              <span>إعدادات وثيقة العقد الإلكتروني التوثيقي</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">عنوان وثيقة العقد</label>
              <input
                type="text"
                value={contract.contractTitle}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contractSettings: { ...contract, contractTitle: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">العنوان الفرعي للعقد</label>
              <input
                type="text"
                value={contract.contractSubtitle}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contractSettings: { ...contract, contractSubtitle: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">عنوان الطرف الأول</label>
              <input
                type="text"
                value={contract.party1Label}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contractSettings: { ...contract, party1Label: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">عنوان الطرف الثاني</label>
              <input
                type="text"
                value={contract.party2Label}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contractSettings: { ...contract, party2Label: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700">نص الإقرار والتعهد القانوني بالعقد</label>
              <textarea
                rows={3}
                value={contract.legalDeclaration}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contractSettings: { ...contract, legalDeclaration: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">نص الختم المعتمد بالعقد</label>
              <input
                type="text"
                value={contract.sealText}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contractSettings: { ...contract, sealText: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">الوصف الفرعي للختم المعتمد</label>
              <input
                type="text"
                value={contract.sealSubtext}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  contractSettings: { ...contract, sealSubtext: e.target.value }
                })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Contract Toggles */}
            <div className="flex flex-wrap gap-4 md:col-span-2 pt-4 border-t border-gray-150">
              <label className="flex items-center space-x-2 space-x-reverse bg-gray-50 px-4 py-2.5 rounded-xl border cursor-pointer">
                <input
                  type="checkbox"
                  checked={contract.showQrCode}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    contractSettings: { ...contract, showQrCode: e.target.checked }
                  })}
                  className="rounded text-brand-600"
                />
                <span className="text-xs font-bold text-gray-800">إظهار كود QR بالوثيقة</span>
              </label>

              <label className="flex items-center space-x-2 space-x-reverse bg-gray-50 px-4 py-2.5 rounded-xl border cursor-pointer">
                <input
                  type="checkbox"
                  checked={contract.showInspectionTerms}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    contractSettings: { ...contract, showInspectionTerms: e.target.checked }
                  })}
                  className="rounded text-brand-600"
                />
                <span className="text-xs font-bold text-gray-800">إظهار بند فحص المعاينة</span>
              </label>

              <label className="flex items-center space-x-2 space-x-reverse bg-gray-50 px-4 py-2.5 rounded-xl border cursor-pointer">
                <input
                  type="checkbox"
                  checked={contract.requireNafathForContract || false}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    contractSettings: { ...contract, requireNafathForContract: e.target.checked }
                  })}
                  className="rounded text-brand-600"
                />
                <span className="text-xs font-bold text-gray-800">اشتراط توثيق نفاذ لإبرام العقد</span>
              </label>
            </div>

            {/* Custom Contract Clauses Builder */}
            <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-150">
              <h3 className="text-sm font-black text-gray-900">إدارة البنود والشروط المخصصة للعقد</h3>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="عنوان البند (مثال: بند التوصيل والتأخير)"
                  value={newClauseTitle}
                  onChange={(e) => setNewClauseTitle(e.target.value)}
                  className="sm:w-1/3 px-4 py-2 rounded-xl border border-gray-200 text-xs"
                />
                <input
                  type="text"
                  placeholder="نص البند الشامل"
                  value={newClauseText}
                  onChange={(e) => setNewClauseText(e.target.value)}
                  className="sm:w-2/3 px-4 py-2 rounded-xl border border-gray-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddClause}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  إضافة البند
                </button>
              </div>

              <div className="space-y-2">
                {contract.customClauses.map((clause) => (
                  <div key={clause.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-gray-900">{clause.title}</h4>
                      <p className="text-xs text-gray-600 font-medium">{clause.text}</p>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleClause(clause.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                          clause.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {clause.isEnabled ? 'مفعل بالعقد' : 'معطل'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClause(clause.id)}
                        className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 7: HEADER OPTIONS */}
      {activeSubTab === 'header' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <Bell className="w-5 h-5 text-brand-600" />
              <span>إعدادات الشريط العلوي والهيدر</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showHeaderNotice || false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderNotice: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">تفعيل شريط التنبيهات/الإعلانات العلوي</span>
            </label>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700">نص الشريط الإعلاني العلوي (Header Notice)</label>
              <input
                type="text"
                value={brandConfig.headerNoticeText || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, headerNoticeText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="أهلاً بك في منصة المقايضة الموثوقة - قايض خدماتك وسلعك بسهولة"
              />
            </div>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showHeaderSearch !== false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderSearch: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">إظهار حقل البحث بالهيدر</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showHeaderAddButton !== false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderAddButton: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">إظهار زر "أضف عرض" بالهيدر</span>
            </label>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700">النص المكتوب على زر إضافة العرض</label>
              <input
                type="text"
                value={brandConfig.headerAddButtonText || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, headerAddButtonText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="أضف عرض مقايضة"
              />
            </div>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showHeaderNotifications !== false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderNotifications: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">إظهار جرس الإشعارات والتنبيهات</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showHeaderLanguageSelector !== false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderLanguageSelector: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">إظهار محول اللغة (العربية / الإنجليزية)</span>
            </label>
          </div>
        </div>
      )}

      {/* SUBTAB 8: FOOTER OPTIONS */}
      {activeSubTab === 'footer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <Building className="w-5 h-5 text-brand-600" />
              <span>إعدادات وتفاصيل الفوتر والشريط السفلي</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showFooter !== false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showFooter: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">عرض الفوتر بالكامل</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showFooterAccentBar !== false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showFooterAccentBar: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">عرض الشريط الملون الجمالي أعلى الفوتر</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showFooterPagesLinks !== false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showFooterPagesLinks: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">عرض روابط الصفحات السريعة بالفوتر</span>
            </label>

            <label className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={brandConfig.showFooterSocialLinks !== false}
                onChange={(e) => setBrandConfig({ ...brandConfig, showFooterSocialLinks: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-bold text-gray-900">عرض روابط وحسابات التواصل الاجتماعي</span>
            </label>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">بريد الدعم والاتصال</label>
              <input
                type="email"
                value={brandConfig.footerEmail || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, footerEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="support@badel.sa"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">رقم التواصل المباشر</label>
              <input
                type="text"
                value={brandConfig.footerPhone || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, footerPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="+966500000000"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">رقم الواتساب</label>
              <input
                type="text"
                value={brandConfig.footerWhatsapp || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, footerWhatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="+966500000000"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-gray-700">نص حقوق الطبع والنشر (Copyright Text)</label>
              <input
                type="text"
                value={brandConfig.copyrightText || ''}
                onChange={(e) => setBrandConfig({ ...brandConfig, copyrightText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 9: AD BANNERS */}
      {activeSubTab === 'ads' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <Megaphone className="w-5 h-5 text-brand-600" />
              <span>إدارة خيارات الإعلانات والبنرات الدعائية</span>
            </h2>
          </div>

          {/* Add New Ad Form */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-xs font-black text-gray-900">إضافة بنر إعلاني جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="عنوان الإعلان"
                value={newAdTitle}
                onChange={(e) => setNewAdTitle(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <input
                type="text"
                placeholder="رابط صورة البنر الإعلاني (Image URL)"
                value={newAdImageUrl}
                onChange={(e) => setNewAdImageUrl(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <input
                type="text"
                placeholder="رابط التوجيه عند النقر (Target URL)"
                value={newAdTargetUrl}
                onChange={(e) => setNewAdTargetUrl(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <div className="flex gap-2">
                <select
                  value={newAdPosition}
                  onChange={(e) => setNewAdPosition(e.target.value as any)}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs"
                >
                  <option value="header">أعلى الصفحة (Header Top)</option>
                  <option value="footer">أسفل الصفحة (Footer Bottom)</option>
                  <option value="feed">وسط العروض (Feed Inline)</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddAdBanner}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  إضافة الإعلان
                </button>
              </div>
            </div>
          </div>

          {/* Current Banners List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-gray-900">البنرات الإعلانية المضافة ({adBanners.length})</h3>
            {adBanners.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">لا توجد بنرات إعلانية حالياً.</p>
            ) : (
              adBanners.map((b) => (
                <div key={b.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <img src={b.imageUrl} alt={b.title} className="w-16 h-10 object-cover rounded-lg border border-gray-200" />
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">{b.title}</h4>
                      <p className="text-[10px] text-gray-500">الموقع: {b.position === 'header' ? 'أعلى الصفحة' : b.position === 'footer' ? 'أسفل الصفحة' : 'وسط العروض'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      type="button"
                      onClick={() => handleToggleAdBanner(b.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {b.isActive ? 'نشط' : 'معطل'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAdBanner(b.id)}
                      className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
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

      {/* SUBTAB 10: USER MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                <Users className="w-5 h-5 text-brand-600" />
                <span>إدارة الأعضاء والتحكم بالحسابات ({users.length})</span>
              </h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute top-3 right-3 text-gray-400" />
              <input
                type="text"
                placeholder="البحث باسم العضو أو المدينة..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 font-bold">
                  <th className="p-3">العضو</th>
                  <th className="p-3">المدينة</th>
                  <th className="p-3">الموثوقية</th>
                  <th className="p-3">التوثيق</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="p-3 flex items-center space-x-2.5 space-x-reverse">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-gray-900 block">{u.name}</span>
                        {u.isAdmin && <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">مشرف</span>}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600 font-medium">{u.city}</td>
                    <td className="p-3 text-amber-600 font-bold">{u.rating} ⭐</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {u.isVerified && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">موثق</span>}
                        {u.isNafathVerified && <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-bold">نفاذ</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isBanned ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.isBanned ? 'محظور' : 'نشط'}
                      </span>
                    </td>
                    <td className="p-3 text-left space-x-1.5 space-x-reverse">
                      <button
                        type="button"
                        onClick={() => handleToggleVerifyUser(u)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        {u.isVerified ? 'إلغاء التوثيق' : 'توثيق'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleNafathUser(u)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold cursor-pointer border border-emerald-200"
                      >
                        {u.isNafathVerified ? 'إلغاء نفاذ' : 'نفاذ'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBanUser(u)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          u.isBanned ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {u.isBanned ? 'فك الحظر' : 'حظر'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 11: LISTINGS MANAGEMENT */}
      {activeSubTab === 'listings_manage' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                <CheckSquare className="w-5 h-5 text-brand-600" />
                <span>إدارة ومراجعة العروض المضافة ({listings.length})</span>
              </h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute top-3 right-3 text-gray-400" />
              <input
                type="text"
                placeholder="البحث باسم العرض أو صاحب العرض..."
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((l) => (
              <div key={l.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <img src={l.imageUrl} alt={l.title} className="w-16 h-14 object-cover rounded-xl border border-gray-200" />
                  <div>
                    <h4 className="text-xs font-black text-gray-900 line-clamp-1">{l.title}</h4>
                    <p className="text-[10px] text-gray-500">صاحب العرض: {l.ownerName}</p>
                    <span className="text-[10px] bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">
                      {l.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleListingVisibility(l)}
                    className={`flex items-center space-x-1 space-x-reverse px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                      l.isHidden ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {l.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{l.isHidden ? 'إظهار العرض' : 'إخفاء العرض'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteListing(l.id)}
                    className="text-red-600 hover:text-red-800 flex items-center space-x-1 space-x-reverse text-[10px] font-bold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف العرض</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 12: CUSTOM PAGES */}
      {activeSubTab === 'pages' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-3 flex items-center space-x-2 space-x-reverse">
              <Globe className="w-5 h-5 text-brand-600" />
              <span>إدارة الصفحات المخصصة والشروط</span>
            </h2>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-xs font-black text-gray-900">إضافة صفحة مخصصة جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="عنوان الصفحة (مثال: الشروط والأحكام)"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <input
                type="text"
                placeholder="رابط المسار Slug (مثال: terms)"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <textarea
                rows={4}
                placeholder="محتوى الصفحة الشامل..."
                value={newPageContent}
                onChange={(e) => setNewPageContent(e.target.value)}
                className="md:col-span-2 px-4 py-2 rounded-xl border border-gray-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomPage}
                className="md:col-span-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                إضافة الصفحة
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {customPages.map((page) => (
              <div key={page.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">{page.title}</h4>
                  <p className="text-[10px] text-gray-500">المسار: /{page.slug}</p>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    type="button"
                    onClick={() => handleToggleCustomPage(page.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                      page.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {page.isActive ? 'نشطة' : 'معطلة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomPage(page.id)}
                    className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
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
  );
}
