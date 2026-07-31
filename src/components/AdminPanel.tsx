import React, { useState } from 'react';
import { 
  FileText, Shield, Palette, Sliders, Package, Users, Image as ImageIcon, 
  Settings, BarChart3, Plus, Trash2, Edit3, Eye, EyeOff, Check, X, Search,
  QrCode, Save, Upload, AlertTriangle, ExternalLink, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { 
  User, Listing, Chat, CustomPage, AdBanner, SiteSettings, BrandConfig, 
  BarterOptions, ContractSettings, ContractClause, CustomBarterField 
} from '../types';
import { savePlatformSettingsToDb, saveUserToDb, updateListingInDb, deleteListingFromDb, clearAllListingsFromDb } from '../services/firebaseService';

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
  contractSubtitle: 'وثيقة رسمية ملزمة لطرفي المقايضة عبر منصة قايض',
  documentBadgeText: 'عقد إلكتروني معتمد',
  party1Header: 'بيانات الطرف الأول',
  party1Label: 'الطرف الأول (صاحب السلعة الأولى)',
  party2Label: 'الطرف الثاني (صاحب السلعة الثانية)',
  detailsHeader: 'تفاصيل محل المقايضة',
  termsHeader: 'الشروط والبنود القانونية',
  legalDeclaration: 'يقر الطرفان بأهليتهما الشرعية ويتعهدان بالمقايضة حسب المواصفات بدون أدنى مسؤولية مالية على المنصة.',
  sealText: 'منصة قايض للمقايضة',
  sealSubtext: 'توثيق إلكتروني معتمد',
  sealImageUrl: '',
  showQrCode: false,
  showInspectionTerms: true,
  customClauses: [
    {
      id: 'c1',
      title: 'المعاينة والفحص',
      text: 'يلتزم الطرفان بمعاينة المواد والسلع قبل التسليم وخلوها من العيوب.',
      isEnabled: true
    },
    {
      id: 'c2',
      title: 'إخلاء المسؤولية',
      text: 'المنصة وسيط تقني ولا تتحمل جودة الأغراض المقايَض عليها.',
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
  const [activeTab, setActiveTab] = useState<
    'contract' | 'branding' | 'barter' | 'listings' | 'members' | 'banners' | 'pages' | 'settings' | 'analytics'
  >('contract');

  const [savedSuccessMessage, setSavedSuccessMessage] = useState('');

  // Search & Filter States
  const [listingSearch, setListingSearch] = useState('');
  const [listingFilterStatus, setListingFilterStatus] = useState<'all' | 'active' | 'completed' | 'hidden'>('all');
  const [userSearch, setUserSearch] = useState('');

  // New Clause State
  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseText, setNewClauseText] = useState('');

  // New Custom Barter Field State
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');

  // New Banner State
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');

  // Contract Settings Reference
  const contract: ContractSettings = siteSettings.contractSettings || DEFAULT_CONTRACT;

  const triggerSaveNotification = (msg: string) => {
    setSavedSuccessMessage(msg);
    onSaveNotification('تم حفظ التغييرات', msg);
    setTimeout(() => setSavedSuccessMessage(''), 3000);
  };

  const updateContract = (updated: Partial<ContractSettings>) => {
    const nextContract: ContractSettings = { ...contract, ...updated };
    const updatedSiteSettings = { ...siteSettings, contractSettings: nextContract };
    setSiteSettings(updatedSiteSettings);
    savePlatformSettingsToDb({ siteSettings: updatedSiteSettings });
    triggerSaveNotification('تم تحديث إعدادات العقد الإلكتروني بنجاح.');
  };

  // Add Clause
  const handleAddClause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClauseTitle.trim() || !newClauseText.trim()) return;
    const newClause: ContractClause = {
      id: 'c_' + Date.now(),
      title: newClauseTitle.trim(),
      text: newClauseText.trim(),
      isEnabled: true
    };
    const clauses = [...(contract.customClauses || []), newClause];
    updateContract({ customClauses: clauses });
    setNewClauseTitle('');
    setNewClauseText('');
  };

  // Toggle Clause Status
  const handleToggleClause = (id: string) => {
    const clauses = (contract.customClauses || []).map(c => 
      c.id === id ? { ...c, isEnabled: !c.isEnabled } : c
    );
    updateContract({ customClauses: clauses });
  };

  // Delete Clause
  const handleDeleteClause = (id: string) => {
    const clauses = (contract.customClauses || []).filter(c => c.id !== id);
    updateContract({ customClauses: clauses });
  };

  // Save General Platform Settings
  const handleSaveGeneralSettings = () => {
    savePlatformSettingsToDb({
      brandConfig,
      siteSettings,
      barterOptions,
      platformSlogan,
      platformDescription,
      platformImageUrl,
      feature1Title,
      feature1Desc,
      feature2Title,
      feature2Desc,
      feature3Title,
      feature3Desc
    });
    triggerSaveNotification('تم حفظ الإعدادات العامة بنجاح.');
  };

  // User Admin Toggle
  const handleToggleAdmin = (user: User) => {
    const updatedUser = { ...user, isAdmin: !user.isAdmin };
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    saveUserToDb(updatedUser);
    triggerSaveNotification(`تم تعديل صلاحيات المستخدم (${user.name}).`);
  };

  // User Ban Toggle
  const handleToggleBan = (user: User) => {
    const updatedUser = { ...user, isBanned: !user.isBanned };
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    saveUserToDb(updatedUser);
    triggerSaveNotification(`تم ${updatedUser.isBanned ? 'حظر' : 'إلغاء حظر'} (${user.name}).`);
  };

  // User Identity Verify Toggle (Nafath)
  const handleToggleVerifyIdentity = (user: User) => {
    const isNafathVerified = !user.isNafathVerified;
    const updatedUser = { ...user, isNafathVerified, isVerified: isNafathVerified };
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    saveUserToDb(updatedUser);
    triggerSaveNotification(`تم ${isNafathVerified ? 'توثيق هوية' : 'إلغاء توثيق هوية'} (${user.name}).`);
  };

  // Listing Hide Toggle
  const handleToggleHideListing = (listing: Listing) => {
    const isHidden = !listing.isHidden;
    setListings(prev => prev.map(l => l.id === listing.id ? { ...l, isHidden } : l));
    updateListingInDb(listing.id, { isHidden });
    triggerSaveNotification(`تم ${isHidden ? 'إخفاء' : 'إظهار'} العرض (${listing.title}).`);
  };

  // Listing Delete
  const handleDeleteListing = (id: string) => {
    if (!window.confirm('هل أنت تأكد من حذف هذا العرض نهائياً؟')) return;
    setListings(prev => prev.filter(l => l.id !== id));
    deleteListingFromDb(id);
    triggerSaveNotification('تم حذف العرض بنجاح.');
  };

  // Filtered Listings
  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.ownerName.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.wantedInReturn.toLowerCase().includes(listingSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (listingFilterStatus === 'active') return l.status === 'نشط' && !l.isHidden;
    if (listingFilterStatus === 'completed') return l.status === 'مكتمل';
    if (listingFilterStatus === 'hidden') return l.isHidden === true;
    return true;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.phone && u.phone.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6 text-right" style={{ direction: 'rtl' }} id="admin_panel_container">
      
      {/* Top Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="p-2 bg-brand-50 text-brand-700 rounded-xl">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">لوحة تحكم المنصة</h1>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">إدارة شاملة ومختصرة للعقود الإلكترونية، العروض، الأعضاء والإعدادات.</p>
        </div>

        {savedSuccessMessage && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 space-x-reverse animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Navigation Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 bg-white p-3 rounded-3xl border border-gray-100 shadow-2xs h-fit space-y-1">
          <button
            onClick={() => setActiveTab('contract')}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'contract' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>العقد الإلكتروني</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'branding' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>هوية المنصة والواجهة</span>
          </button>

          <button
            onClick={() => setActiveTab('barter')}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'barter' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>إعدادات المقايضة</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'listings' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <Package className="w-4 h-4" />
              <span>إدارة المعروضات</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'listings' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {listings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'members' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <Users className="w-4 h-4" />
              <span>الأعضاء والصلاحيات</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'members' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'banners' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>البانرات الإعلانية</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'pages' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الصفحات والسياسات</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات العرض والصيانة</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-brand-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>الإحصائيات والمؤشرات</span>
          </button>
        </div>

        {/* Dynamic Section Content */}
        <div className="lg:col-span-3 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-2xs min-h-[500px]">
          
          {/* TAB 1: ELECTRONIC CONTRACT SETTINGS */}
          {activeTab === 'contract' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                    <Shield className="w-5 h-5 text-brand-600" />
                    <span>إعدادات العقد الإلكتروني</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">التحكم المباشر بالنصوص والبنود الرسمية للعقد الإلكتروني الصادر عند إتمام المقايضة.</p>
                </div>
              </div>

              {/* Main Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">عنوان العقد الرئيسي</label>
                  <input
                    type="text"
                    value={contract.contractTitle}
                    onChange={(e) => updateContract({ contractTitle: e.target.value })}
                    className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الوصف الفرعي للعقد</label>
                  <input
                    type="text"
                    value={contract.contractSubtitle}
                    onChange={(e) => updateContract({ contractSubtitle: e.target.value })}
                    className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">شارة التوثيق (Badge Text)</label>
                  <input
                    type="text"
                    value={contract.documentBadgeText}
                    onChange={(e) => updateContract({ documentBadgeText: e.target.value })}
                    className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الطرف الأول</label>
                  <input
                    type="text"
                    value={contract.party1Header}
                    onChange={(e) => updateContract({ party1Header: e.target.value })}
                    className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Legal Declaration */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الإقرار والتعهد القانوني (مختصر)</label>
                <textarea
                  rows={2}
                  value={contract.legalDeclaration}
                  onChange={(e) => updateContract({ legalDeclaration: e.target.value })}
                  className="w-full text-xs font-medium border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-brand-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Stamp & Seal Controls */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-4">
                <h3 className="text-xs font-black text-gray-900 flex items-center space-x-1.5 space-x-reverse">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>بيانات الختم الرسمي والتفعيل</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">اسم الختم الرسمي</label>
                    <input
                      type="text"
                      value={contract.sealText}
                      onChange={(e) => updateContract({ sealText: e.target.value })}
                      className="w-full text-xs font-bold border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">النص الفرعي للختم</label>
                    <input
                      type="text"
                      value={contract.sealSubtext}
                      onChange={(e) => updateContract({ sealSubtext: e.target.value })}
                      className="w-full text-xs font-bold border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">رابط صورة الختم (Image URL)</label>
                  <input
                    type="text"
                    value={contract.sealImageUrl || ''}
                    placeholder="/contract_seal.svg"
                    onChange={(e) => updateContract({ sealImageUrl: e.target.value })}
                    className="w-full text-xs font-mono border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-200/60">
                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={contract.showQrCode !== false}
                      onChange={(e) => updateContract({ showQrCode: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                    <span>إظهار رمز QR للتحقق في العقد</span>
                  </label>

                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={contract.showInspectionTerms !== false}
                      onChange={(e) => updateContract({ showInspectionTerms: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                    <span>إظهار بند المعاينة وإخلاء المسؤولية</span>
                  </label>

                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={contract.enableIdentityVerification !== false}
                      onChange={(e) => updateContract({ enableIdentityVerification: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                    <span>تفعيل توثيق الهوية الوطنية (نفاذ NAFATH)</span>
                  </label>

                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={contract.requireNafathForContract !== false}
                      onChange={(e) => updateContract({ requireNafathForContract: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                    <span>إلزامية توثيق الهوية لتوقيع العقد</span>
                  </label>
                </div>
              </div>

              {/* Clauses Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-900">بنود وشروط العقد ({contract.customClauses?.length || 0})</h3>
                </div>

                {/* Add New Clause Form */}
                <form onSubmit={handleAddClause} className="bg-brand-50/40 p-4 rounded-2xl border border-brand-100 space-y-3">
                  <span className="text-xs font-black text-brand-900 block">إضافة بند جديد للعقد</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="عنوان البند (مثال: الشحن والتسليم)"
                      value={newClauseTitle}
                      onChange={(e) => setNewClauseTitle(e.target.value)}
                      className="sm:col-span-1 text-xs font-bold border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="نص البند الشامل والمختصر"
                      value={newClauseText}
                      onChange={(e) => setNewClauseText(e.target.value)}
                      className="sm:col-span-2 text-xs border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 space-x-reverse cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة البند</span>
                  </button>
                </form>

                {/* Clauses List */}
                <div className="space-y-2">
                  {(!contract.customClauses || contract.customClauses.length === 0) ? (
                    <p className="text-xs text-gray-400 py-4 text-center">لا توجد بنود إضافية مسجلة.</p>
                  ) : (
                    contract.customClauses.map((clause) => (
                      <div key={clause.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className="font-extrabold text-xs text-gray-900">{clause.title}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${clause.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                              {clause.isEnabled ? 'مفعل' : 'معطل'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{clause.text}</p>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse shrink-0">
                          <button
                            onClick={() => handleToggleClause(clause.id)}
                            className={`p-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                              clause.isEnabled ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {clause.isEnabled ? 'تعطيل' : 'تفعيل'}
                          </button>
                          <button
                            onClick={() => handleDeleteClause(clause.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 cursor-pointer"
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

          {/* TAB 2: BRANDING & IDENTITY (HEADER & FOOTER OPTIONS) */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <Palette className="w-5 h-5 text-brand-600" />
                  <span>هوية المنصة، الهيدر والفوتر</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">تخصيص كامل لاسم المنصة، الشعار، الألوان، وخيارات الهيدر العلوي والفوتر السفلي.</p>
              </div>

              {/* Basic Brand Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">اسم المنصة الرسمي</label>
                  <input
                    type="text"
                    value={brandConfig.brandName}
                    onChange={(e) => setBrandConfig({ ...brandConfig, brandName: e.target.value })}
                    className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">شعار المنصة النصي (Tagline)</label>
                  <input
                    type="text"
                    value={brandConfig.brandTagline}
                    onChange={(e) => setBrandConfig({ ...brandConfig, brandTagline: e.target.value })}
                    className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">اللون الرئيسي للواجهة</label>
                  <select
                    value={brandConfig.primaryColor}
                    onChange={(e) => setBrandConfig({ ...brandConfig, primaryColor: e.target.value as any })}
                    className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 outline-hidden bg-white cursor-pointer"
                  >
                    <option value="emerald">أخضر زمردي (Emerald - الافتراضي)</option>
                    <option value="blue">أزرق ملكي (Blue)</option>
                    <option value="purple">بنفسجي فاخر (Purple)</option>
                    <option value="amber">ذهبي/عنبري (Amber)</option>
                    <option value="rose">وردي دافئ (Rose)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نص حقوق الملكية والنشر (Footer Copyright)</label>
                  <input
                    type="text"
                    value={brandConfig.copyrightText}
                    onChange={(e) => setBrandConfig({ ...brandConfig, copyrightText: e.target.value })}
                    className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 outline-hidden"
                  />
                </div>
              </div>

              {/* HEADER CONFIGURATION SECTION */}
              <div className="bg-brand-50/40 p-4 sm:p-5 rounded-2xl border border-brand-100 space-y-4">
                <h3 className="text-xs font-black text-brand-900 flex items-center space-x-2 space-x-reverse">
                  <Sliders className="w-4 h-4 text-brand-600" />
                  <span>إعدادات خيارات الهيدر العلوي (Header Options)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200/80 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار الشريط التنبيهي العلوي</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showHeaderNotice !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderNotice: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200/80 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار مربع البحث السريع بالهيدر</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showHeaderSearch !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderSearch: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200/80 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار الشعار الفرعي بجانب اللوجو</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showHeaderTagline !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderTagline: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200/80 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار زر (+ إضافة عرض) في الهيدر</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showHeaderAddButton !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderAddButton: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200/80 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار أيقونة التنبيهات</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showHeaderNotifications !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showHeaderNotifications: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">نص الشريط التنبيهي العلوي</label>
                    <input
                      type="text"
                      placeholder="مثال: مرحباً بك في منصة قايض..."
                      value={brandConfig.headerNoticeText || ''}
                      onChange={(e) => setBrandConfig({ ...brandConfig, headerNoticeText: e.target.value })}
                      className="w-full text-xs font-medium border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">تخصيص نص زر إضافة العرض في الهيدر</label>
                    <input
                      type="text"
                      placeholder="إضافة عرض"
                      value={brandConfig.headerAddButtonText || ''}
                      onChange={(e) => setBrandConfig({ ...brandConfig, headerAddButtonText: e.target.value })}
                      className="w-full text-xs font-medium border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* FOOTER CONFIGURATION SECTION */}
              <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-4">
                <h3 className="text-xs font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <Sliders className="w-4 h-4 text-gray-700" />
                  <span>إعدادات خيارات الفوتر السفلي (Footer Options)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار الفوتر السفلي بالكامل</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showFooter !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showFooter: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار شريط الألوان المزخرف أعلى الفوتر</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showFooterAccentBar !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showFooterAccentBar: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار عمود السياسات والشروط بالفوتر</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showFooterPagesLinks !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showFooterPagesLinks: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">إظهار عمود الدعم والمعلومات</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showFooterSocialLinks !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showFooterSocialLinks: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 cursor-pointer sm:col-span-2">
                    <span className="text-xs font-bold text-gray-800">إظهار شريط الحقوق والنشر في قاع الفوتر</span>
                    <input
                      type="checkbox"
                      checked={brandConfig.showCopyright !== false}
                      onChange={(e) => setBrandConfig({ ...brandConfig, showCopyright: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>
                </div>

                {/* Footer Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">البريد الإلكتروني للدعم</label>
                    <input
                      type="email"
                      placeholder="support@badel-platform.sa"
                      value={brandConfig.footerEmail || ''}
                      onChange={(e) => setBrandConfig({ ...brandConfig, footerEmail: e.target.value })}
                      className="w-full text-xs font-medium border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">رقم واتساب الدعم</label>
                    <input
                      type="text"
                      placeholder="05xxxxxxxx"
                      value={brandConfig.footerWhatsapp || ''}
                      onChange={(e) => setBrandConfig({ ...brandConfig, footerWhatsapp: e.target.value })}
                      className="w-full text-xs font-medium border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">رقم الهاتف الرسمي</label>
                    <input
                      type="text"
                      placeholder="9200xxxxx"
                      value={brandConfig.footerPhone || ''}
                      onChange={(e) => setBrandConfig({ ...brandConfig, footerPhone: e.target.value })}
                      className="w-full text-xs font-medium border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Platform Slogan / Hero Banner Section */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-3">
                <h3 className="text-xs font-black text-gray-900">شعار وهيدر الصفحة الرئيسية</h3>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">العنوان الرئيسي الهيدر</label>
                  <input
                    type="text"
                    value={platformSlogan}
                    onChange={(e) => setPlatformSlogan(e.target.value)}
                    className="w-full text-xs font-bold border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">الوصف المختصر الهيدر</label>
                  <input
                    type="text"
                    value={platformDescription || ''}
                    onChange={(e) => setPlatformDescription?.(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BARTER SYSTEM OPTIONS */}
          {activeTab === 'barter' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <Sliders className="w-5 h-5 text-brand-600" />
                  <span>إعدادات ونظام المقايضة</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">التحكم في الميزات والخيارات المتاحة للمستخدمين عند تقديم طلب مقايضة.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
                  <span className="text-xs font-bold text-gray-800">تفعيل خيار فارق الكاش النقدي</span>
                  <input
                    type="checkbox"
                    checked={barterOptions.enableCashDifference}
                    onChange={(e) => setBarterOptions({ ...barterOptions, enableCashDifference: e.target.checked })}
                    className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
                  <span className="text-xs font-bold text-gray-800">إتاحة خيار المعاينة والفحص</span>
                  <input
                    type="checkbox"
                    checked={barterOptions.enableInspectionOption}
                    onChange={(e) => setBarterOptions({ ...barterOptions, enableInspectionOption: e.target.checked })}
                    className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
                  <span className="text-xs font-bold text-gray-800">إتاحة تحديد خيار الشحن والتسليم</span>
                  <input
                    type="checkbox"
                    checked={barterOptions.enableDeliveryOption}
                    onChange={(e) => setBarterOptions({ ...barterOptions, enableDeliveryOption: e.target.checked })}
                    className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
                  <span className="text-xs font-bold text-gray-800">تفعيل ملاحظات العرض والشروط الخاصه</span>
                  <input
                    type="checkbox"
                    checked={barterOptions.enableOfferNote}
                    onChange={(e) => setBarterOptions({ ...barterOptions, enableOfferNote: e.target.checked })}
                    className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                  />
                </label>
              </div>

              {/* Custom Barter Fields */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-900">حقول المبادلة الإضافية</h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="اسم الحقل (مثال: الرقم التسلسلي)"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="flex-1 text-xs border border-gray-200 rounded-xl p-2.5 outline-hidden"
                  />
                  <button
                    onClick={() => {
                      if (!newFieldLabel.trim()) return;
                      const field: CustomBarterField = {
                        id: 'f_' + Date.now(),
                        label: newFieldLabel.trim(),
                        placeholder: newFieldPlaceholder.trim(),
                        isEnabled: true,
                        isRequired: false
                      };
                      setBarterOptions({ ...barterOptions, customFields: [...barterOptions.customFields, field] });
                      setNewFieldLabel('');
                      setNewFieldPlaceholder('');
                    }}
                    className="bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    إضافة حقل
                  </button>
                </div>

                <div className="space-y-2">
                  {barterOptions.customFields.map((field) => (
                    <div key={field.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gray-800">{field.label}</span>
                      <button
                        onClick={() => {
                          setBarterOptions({
                            ...barterOptions,
                            customFields: barterOptions.customFields.filter(f => f.id !== field.id)
                          });
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LISTINGS MANAGEMENT */}
          {activeTab === 'listings' && (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                    <Package className="w-5 h-5 text-brand-600" />
                    <span>إدارة المعروضات ({listings.length})</span>
                  </h2>
                </div>

                {/* Filter Status Buttons & Clear All Action */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={async () => {
                      if (window.confirm('هل أنت تأكد من مسح جميع المنتجات والعروض الحالية للبدء بحساب نظيف للجميع؟')) {
                        await clearAllListingsFromDb();
                      }
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 space-x-reverse"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>حذف كافة المنتجات المضافة</span>
                  </button>

                  <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold space-x-1 space-x-reverse">
                    <button
                      onClick={() => setListingFilterStatus('all')}
                      className={`px-3 py-1 rounded-lg cursor-pointer ${listingFilterStatus === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'}`}
                    >
                      الكل
                    </button>
                    <button
                      onClick={() => setListingFilterStatus('active')}
                      className={`px-3 py-1 rounded-lg cursor-pointer ${listingFilterStatus === 'active' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-gray-500'}`}
                    >
                      النشطة
                    </button>
                    <button
                      onClick={() => setListingFilterStatus('completed')}
                      className={`px-3 py-1 rounded-lg cursor-pointer ${listingFilterStatus === 'completed' ? 'bg-white text-blue-700 shadow-2xs' : 'text-gray-500'}`}
                    >
                      المكتملة
                    </button>
                    <button
                      onClick={() => setListingFilterStatus('hidden')}
                      className={`px-3 py-1 rounded-lg cursor-pointer ${listingFilterStatus === 'hidden' ? 'bg-white text-amber-700 shadow-2xs' : 'text-gray-500'}`}
                    >
                      المخفية
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="ابحث بالعنوان، صاحب العرض، أو المطلوب بالمقابل..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl pr-9 pl-3 py-2.5 outline-hidden"
                />
              </div>

              {/* Listings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold">
                      <th className="p-3">العرض</th>
                      <th className="p-3">العارض</th>
                      <th className="p-3">المطلوب بالمقابل</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50/80">
                        <td className="p-3 flex items-center space-x-2 space-x-reverse">
                          <img src={listing.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <span className="font-extrabold text-gray-900 line-clamp-1">{listing.title}</span>
                        </td>
                        <td className="p-3 font-bold text-gray-700">{listing.ownerName}</td>
                        <td className="p-3 text-emerald-800 font-bold">{listing.wantedInReturn}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            listing.isHidden ? 'bg-amber-100 text-amber-800' : listing.status === 'مكتمل' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {listing.isHidden ? 'مخفي' : listing.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5 space-x-reverse">
                            <button
                              onClick={() => handleToggleHideListing(listing)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                              title={listing.isHidden ? 'إظهار العرض' : 'إخفاء العرض'}
                            >
                              {listing.isHidden ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-amber-600" />}
                            </button>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="حذف العرض"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MEMBERS & PERMISSIONS */}
          {activeTab === 'members' && (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <Users className="w-5 h-5 text-brand-600" />
                  <span>الأعضاء والصلاحيات ({users.length})</span>
                </h2>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="ابحث باسم العضو أو البريد الإلكتروني..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl pr-9 pl-3 py-2.5 outline-hidden"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold">
                      <th className="p-3">العضو</th>
                      <th className="p-3">المدينة</th>
                      <th className="p-3">الرتبة</th>
                      <th className="p-3">توثيق الهوية</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">إدارة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/80">
                        <td className="p-3 flex items-center space-x-2 space-x-reverse">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div>
                            <span className="font-extrabold text-gray-900 block">{u.name}</span>
                            <span className="text-[10px] text-gray-400">{u.phone || 'غير مسجل'}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600 font-bold">{u.city}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${u.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                            {u.isAdmin ? 'مشرف / أدمن' : 'عضو'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isNafathVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {u.isNafathVerified ? 'موثق (نفاذ)' : 'غير موثق'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBanned ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {u.isBanned ? 'محظور' : 'نشط'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleToggleVerifyIdentity(u)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                                u.isNafathVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {u.isNafathVerified ? 'إلغاء التوثيق' : 'توثيق الهوية (نفاذ)'}
                            </button>
                            <button
                              onClick={() => handleToggleAdmin(u)}
                              className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold border border-purple-200 cursor-pointer"
                            >
                              {u.isAdmin ? 'إلغاء الإشراف' : 'ترقية لأدمن'}
                            </button>
                            <button
                              onClick={() => handleToggleBan(u)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                                u.isBanned ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                            >
                              {u.isBanned ? 'فك الحظر' : 'حظر العضو'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: AD BANNERS */}
          {activeTab === 'banners' && (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <ImageIcon className="w-5 h-5 text-brand-600" />
                  <span>البانرات والإعلانات</span>
                </h2>
              </div>

              <div className="bg-brand-50/40 p-4 rounded-2xl border border-brand-100 space-y-3">
                <span className="text-xs font-black text-brand-900 block">إضافة بانر جديد</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="عنوان الإعلان"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    className="text-xs border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="رابط صورة البانر (Image URL)"
                    value={newBannerImage}
                    onChange={(e) => setNewBannerImage(e.target.value)}
                    className="text-xs border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newBannerTitle || !newBannerImage) return;
                    const b: AdBanner = {
                      id: 'b_' + Date.now(),
                      title: newBannerTitle,
                      imageUrl: newBannerImage,
                      targetUrl: newBannerUrl,
                      position: 'header',
                      isActive: true
                    };
                    setAdBanners([...adBanners, b]);
                    setNewBannerTitle('');
                    setNewBannerImage('');
                    setNewBannerUrl('');
                  }}
                  className="bg-brand-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer"
                >
                  إضافة البانر
                </button>
              </div>

              <div className="space-y-3">
                {adBanners.map((b) => (
                  <div key={b.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3">
                    <img src={b.imageUrl} alt="" className="w-16 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1">
                      <span className="font-extrabold text-xs text-gray-900 block">{b.title}</span>
                      <span className="text-[10px] text-gray-400">{b.position === 'header' ? 'أعلى الصفحة' : 'أسفل الصفحة'}</span>
                    </div>
                    <button
                      onClick={() => setAdBanners(adBanners.filter(x => x.id !== b.id))}
                      className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PAGES & POLICIES */}
          {activeTab === 'pages' && (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <FileText className="w-5 h-5 text-brand-600" />
                  <span>الصفحات والسياسات</span>
                </h2>
              </div>

              <div className="space-y-3">
                {customPages.map((page) => (
                  <div key={page.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-gray-900">{page.title}</span>
                      <button
                        onClick={() => {
                          setCustomPages(customPages.map(p => p.id === page.id ? { ...p, isActive: !p.isActive } : p));
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border cursor-pointer ${
                          page.isActive ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {page.isActive ? 'مفعلة' : 'معطلة'}
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={page.content}
                      onChange={(e) => {
                        const updated = customPages.map(p => p.id === page.id ? { ...p, content: e.target.value } : p);
                        setCustomPages(updated);
                      }}
                      className="w-full text-xs border border-gray-200 bg-white rounded-xl p-2.5 outline-hidden leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SITE DISPLAY & MAINTENANCE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <Settings className="w-5 h-5 text-brand-600" />
                  <span>إعدادات العرض والصيانة</span>
                </h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-red-50/60 rounded-2xl border border-red-100 cursor-pointer">
                  <div>
                    <span className="text-xs font-black text-red-900 block">وضع الصيانة العامة (Maintenance Mode)</span>
                    <span className="text-[11px] text-red-700">إغلاق المنصة عن الزوار مؤقتاً لأعمال التطوير.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={siteSettings.maintenanceMode}
                    onChange={(e) => setSiteSettings({ ...siteSettings, maintenanceMode: e.target.checked })}
                    className="w-5 h-5 rounded-md text-red-600 accent-red-600"
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عدد أعمدة الشبكة الرئيسية (Grid Columns)</label>
                    <select
                      value={siteSettings.gridColumns || 4}
                      onChange={(e) => setSiteSettings({ ...siteSettings, gridColumns: Number(e.target.value) })}
                      className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 bg-white outline-hidden"
                    >
                      <option value={2}>2 أعمدة (كبيرة)</option>
                      <option value={3}>3 أعمدة (متوسطة)</option>
                      <option value={4}>4 أعمدة (الافتراضي القياسي)</option>
                      <option value={5}>5 أعمدة (مكثفة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">عدد العروض المعروضة بالرئيسية</label>
                    <input
                      type="number"
                      value={siteSettings.homeListingsLimit}
                      onChange={(e) => setSiteSettings({ ...siteSettings, homeListingsLimit: Number(e.target.value) })}
                      className="w-full text-xs font-bold border border-gray-200 rounded-xl p-2.5 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">اشتراط وجود صورة لإضافة العرض</span>
                    <input
                      type="checkbox"
                      checked={siteSettings.requireImageForListings}
                      onChange={(e) => setSiteSettings({ ...siteSettings, requireImageForListings: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
                    <span className="text-xs font-bold text-gray-800">الموافقة التلقائية الفورية على العروض</span>
                    <input
                      type="checkbox"
                      checked={siteSettings.autoApproveListings}
                      onChange={(e) => setSiteSettings({ ...siteSettings, autoApproveListings: e.target.checked })}
                      className="w-4 h-4 rounded-md text-brand-600 accent-brand-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ANALYTICS OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-black text-gray-900 flex items-center space-x-2 space-x-reverse">
                  <BarChart3 className="w-5 h-5 text-brand-600" />
                  <span>مؤشرات وإحصائيات المنصة</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-brand-50/60 p-4 rounded-2xl border border-brand-100 text-center">
                  <span className="block text-2xl font-black text-brand-700">{users.length}</span>
                  <span className="text-xs font-extrabold text-brand-900/80">إجمالي الأعضاء</span>
                </div>

                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-center">
                  <span className="block text-2xl font-black text-blue-700">{listings.length}</span>
                  <span className="text-xs font-extrabold text-blue-900/80">إجمالي المعروضات</span>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
                  <span className="block text-2xl font-black text-emerald-700">
                    {listings.filter(l => l.status === 'مكتمل').length}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-900/80">مقايضات ناجحة</span>
                </div>

                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-center">
                  <span className="block text-2xl font-black text-purple-700">{chats.length}</span>
                  <span className="text-xs font-extrabold text-purple-900/80">محادثات جارية</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Save Options Bar */}
      <div className="mt-8 bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-gray-900">حفظ خيارات وإعدادات المنصة</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">اضغط على زر الحفظ أدناه لتطبيق وتأكيد كافة الخيارات والتغييرات المستحدثة.</p>
        </div>

        <div className="flex items-center space-x-3 space-x-reverse w-full sm:w-auto">
          {savedSuccessMessage && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 space-x-reverse animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedSuccessMessage}</span>
            </div>
          )}

          <button
            onClick={handleSaveGeneralSettings}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 space-x-reverse shadow-xs cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الخيارات والتغييرات</span>
          </button>
        </div>
      </div>
    </div>
  );
}
