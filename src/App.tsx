import React, { useState, useEffect } from 'react';
import { BarterProvider, useBarter } from './context/BarterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ItemCard } from './components/ItemCard';
import { AllItemsPage } from './components/AllItemsPage';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AddItemModal } from './components/AddItemModal';
import { SubmitTradeOfferModal } from './components/SubmitTradeOfferModal';
import { TradeOffersModal } from './components/TradeOffersModal';
import { EContractModal } from './components/EContractModal';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfilePage } from './components/UserProfilePage';
import { UserSettingsPage } from './components/UserSettingsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { AuthPage } from './components/AuthPage';
import { PolicyPage } from './components/PolicyPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BarterItem, BarterContract } from './types';
const heroIllustrationImage = new URL('./assets/images/barter_hero_illustration_1785621011302.jpg', import.meta.url).href;
import { 
  ArrowLeftRight, 
  ShieldCheck, 
  PlusCircle, 
  FileCheck2, 
  Sparkles, 
  Layers, 
  SearchX, 
  CheckCircle2, 
  Heart,
  SlidersHorizontal,
  Package,
  ArrowRight,
  Search
} from 'lucide-react';

type ActiveViewType = 
  | 'home' 
  | 'all_items' 
  | 'item_detail' 
  | 'add_item' 
  | 'submit_offer' 
  | 'my_offers' 
  | 'view_contract' 
  | 'user_profile'
  | 'user_settings'
  | 'favorites'
  | 'admin'
  | 'auth'
  | 'terms'
  | 'privacy'
  | 'commission';

function BarterAppMain() {
  const { 
    currentUser,
    items, 
    categories, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    selectedCityFilter,
    setSelectedCityFilter,
    isAdminMode,
    setIsAdminMode,
    settings
  } = useBarter();

  const isOwner = currentUser?.email?.toLowerCase() === 'crazyretiree@gmail.com';

  // Helper to parse route from URL path/hash/search
  const getViewFromURL = (): ActiveViewType => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    if (path.startsWith('/item/') || hash.includes('item_') || search.includes('item=')) {
      return 'item_detail';
    }
    if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || search.includes('view=admin')) {
      return 'admin';
    }
    if (path === '/settings' || path === '/user_settings' || hash === '#settings' || search.includes('view=settings')) {
      return 'user_settings';
    }
    if (path === '/favorites' || hash === '#favorites' || search.includes('view=favorites')) {
      return 'favorites';
    }
    if (path === '/terms' || hash === '#terms' || search.includes('view=terms')) {
      return 'terms';
    }
    if (path === '/privacy' || hash === '#privacy' || search.includes('view=privacy')) {
      return 'privacy';
    }
    if (path === '/commission' || hash === '#commission' || search.includes('view=commission')) {
      return 'commission';
    }
    if (path === '/items' || path === '/all_items' || hash === '#items') {
      return 'all_items';
    }
    if (path === '/add' || path === '/add_item' || hash === '#add') {
      return 'add_item';
    }
    if (path === '/offers' || hash === '#offers') {
      return 'my_offers';
    }
    if (path === '/auth' || hash === '#auth') {
      return 'auth';
    }
    if (path === '/profile' || hash === '#profile') {
      return 'user_profile';
    }
    return 'home';
  };

  // Navigation View State
  const [activeView, setActiveView] = useState<ActiveViewType>(getViewFromURL());
  const [userProfileTab, setUserProfileTab] = useState<'profile' | 'items' | 'offers' | 'contracts'>('profile');
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'items' | 'negotiations'>('items');

  // Selected State
  const [selectedDetailItem, setSelectedDetailItem] = useState<BarterItem | null>(null);
  const [selectedTradeTargetItem, setSelectedTradeTargetItem] = useState<BarterItem | null>(null);
  const [selectedContractForView, setSelectedContractForView] = useState<BarterContract | null>(null);
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState<string | null>(null);

  // Navigate and update URL
  const navigateToView = (view: ActiveViewType, targetItem?: BarterItem | null) => {
    if (view !== 'admin') {
      setIsAdminMode(false);
    } else {
      setIsAdminMode(true);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });

    let newPath = '/';
    if (view === 'admin') newPath = '/admin';
    else if (view === 'user_settings') newPath = '/settings';
    else if (view === 'favorites') newPath = '/favorites';
    else if (view === 'terms') newPath = '/terms';
    else if (view === 'privacy') newPath = '/privacy';
    else if (view === 'commission') newPath = '/commission';
    else if (view === 'all_items') newPath = '/items';
    else if (view === 'add_item') newPath = '/add';
    else if (view === 'my_offers') newPath = '/offers';
    else if (view === 'user_profile') newPath = '/profile';
    else if (view === 'auth') newPath = '/auth';
    else if (view === 'item_detail') {
      const itemToUse = targetItem || selectedDetailItem;
      newPath = itemToUse ? `/item/${itemToUse.id}` : '/items';
    }

    if (window.location.pathname !== newPath) {
      try {
        window.history.pushState({ view }, '', newPath);
      } catch (e) {
        // Fallback to hash navigation if pushState is restricted
        window.location.hash = view === 'home' ? '' : `#${view}`;
      }
    }
  };

  // Resolve item from URL when navigating directly or on reload
  useEffect(() => {
    if (items.length === 0) return;
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;

    let targetId: string | null = null;
    if (path.startsWith('/item/')) {
      targetId = path.replace('/item/', '').trim();
    } else if (search.includes('item=')) {
      const match = search.match(/item=([^&]+)/);
      if (match) targetId = match[1];
    } else if (hash.includes('item=')) {
      const match = hash.match(/item=([^&]+)/);
      if (match) targetId = match[1];
    }

    if (targetId) {
      const found = items.find((i) => i.id === targetId);
      if (found) {
        setSelectedDetailItem(found);
      }
    }
  }, [items]);

  // Sync initial URL and popstate
  useEffect(() => {
    const handlePopState = () => {
      const urlView = getViewFromURL();
      if (urlView === 'admin') {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }
      setActiveView(urlView);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    const initialView = getViewFromURL();
    if (initialView === 'admin') {
      setIsAdminMode(true);
      setActiveView('admin');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [setIsAdminMode]);

  const handleViewUserProfile = (userId: string) => {
    setSelectedUserIdForProfile(userId);
    navigateToView('user_profile');
  };

  // Filter Items for Home Feed
  const filteredItems = items.filter((item) => {
    // Category match
    if (selectedCategoryFilter !== 'الكل' && item.category !== selectedCategoryFilter) {
      return false;
    }
    // City match
    if (selectedCityFilter !== 'الكل' && !item.location.includes(selectedCityFilter)) {
      return false;
    }
    // Search Query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchDesired = item.desiredDescription.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchDesired) {
        return false;
      }
    }
    return true;
  });

  const handleSelectItem = (item: BarterItem) => {
    setSelectedDetailItem(item);
    navigateToView('item_detail', item);
  };

  const handleOpenTrade = (targetItem: BarterItem) => {
    setSelectedTradeTargetItem(targetItem);
    navigateToView('submit_offer');
  };

  const effectiveView = (isAdminMode || activeView === 'admin') && isOwner ? 'admin' : activeView;

  // Render dynamic icon helper for feature boxes
  const renderFeatureBoxIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCheck2': return <FileCheck2 className="w-6 h-6 text-[#8c5332]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#8c5332]" />;
      case 'ArrowLeftRight': return <ArrowLeftRight className="w-6 h-6 text-[#8c5332]" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-[#8c5332]" />;
      case 'Package': return <Package className="w-6 h-6 text-[#8c5332]" />;
      default: return <CheckCircle2 className="w-6 h-6 text-[#8c5332]" />;
    }
  };

  // Home items limited display count based on settings
  const homepageItems = (settings.homeItemsLimit && settings.homeItemsLimit > 0)
    ? filteredItems.slice(0, settings.homeItemsLimit)
    : filteredItems;

  return (
    <div className="min-h-screen bg-[#faf6f0] flex flex-col font-['Cairo',sans-serif]">
      
      {/* Top Header */}
      <Header
        activeView={effectiveView}
        onNavigate={(view) => {
          navigateToView(view);
        }}
        onOpenAddItem={() => { navigateToView('add_item'); }}
        onOpenOffers={() => { navigateToView('my_offers'); }}
        onOpenContracts={() => { navigateToView('my_offers'); }}
        onOpenProfile={(tab) => {
          setSelectedUserIdForProfile(currentUser?.id || 'usr_1');
          setProfileInitialTab(tab === 'profile' ? 'profile' : tab === 'negotiations' ? 'negotiations' : 'items');
          navigateToView('user_profile');
        }}
        onOpenAdmin={() => {
          navigateToView('admin');
        }}
      />

      {/* Main Container */}
      <main className={`flex-1 mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 space-y-8 transition-all duration-300 ${
        settings.expandProductGridWidth ? 'max-w-[1650px]' : 'max-w-7xl'
      }`}>
        
        {/* VIEW 7: ADMIN DASHBOARD FULL PAGE */}
        {(isAdminMode || activeView === 'admin') && (
          isOwner ? (
            <AdminDashboard
              onClose={() => {
                navigateToView('home');
              }}
              onViewContract={(cnt) => {
                setSelectedContractForView(cnt);
                navigateToView('view_contract');
              }}
              onViewUserProfile={(userId) => {
                setSelectedUserIdForProfile(userId);
                navigateToView('user_profile');
              }}
            />
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-xl mx-auto my-12 dir-rtl">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl font-black">
                🔒
              </div>
              <h2 className="text-xl font-black text-slate-900">لوحة التحكم مخصصة لمالك المنصة فقط</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                عذراً، هذه الصفحة مخصصة فقط لمالك المنصة (crazyretiree@gmail.com). يرجى تسجيل الدخول بحساب المالك للوصول إلى لوحة التحكم والإعدادات.
              </p>
              <button
                onClick={() => navigateToView('auth')}
                className="px-6 py-2.5 bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
              >
                تسجيل الدخول بحساب مالك المنصة
              </button>
            </div>
          )
        )}

        {/* VIEW 1: ALL PRODUCTS PAGE */}
        {effectiveView === 'all_items' && (
          <AllItemsPage
            onSelectItem={handleSelectItem}
            onOpenTradeModal={handleOpenTrade}
            onOpenAddItem={() => { navigateToView('add_item'); }}
            onViewUserProfile={handleViewUserProfile}
            onNavigateHome={() => navigateToView('home')}
          />
        )}

        {/* VIEW 2: PRODUCT DETAIL FULL PAGE */}
        {effectiveView === 'item_detail' && (
          selectedDetailItem ? (
            <ItemDetailModal
              item={selectedDetailItem}
              onClose={() => navigateToView('all_items')}
              onOpenTradeModal={(targetItem) => {
                setSelectedTradeTargetItem(targetItem);
                navigateToView('submit_offer');
              }}
              onViewUserProfile={handleViewUserProfile}
              onNavigateAuth={() => navigateToView('auth')}
            />
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-[#e6d8c7] max-w-lg mx-auto dir-rtl my-8">
              <div className="w-8 h-8 border-3 border-[#8c5332] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">جاري تحميل تفاصيل السلعة...</p>
              <button
                onClick={() => navigateToView('all_items')}
                className="text-xs text-[#8c5332] underline font-bold cursor-pointer"
              >
                أو العودة لكافة السلع
              </button>
            </div>
          )
        )}

        {/* VIEW 3: ADD ITEM FULL PAGE */}
        {effectiveView === 'add_item' && (
          <AddItemModal
            onClose={() => navigateToView('home')}
            onSuccess={(createdItem) => {
              if (createdItem) {
                setSelectedDetailItem(createdItem);
                navigateToView('item_detail', createdItem);
              } else {
                navigateToView('all_items');
              }
            }}
            onNavigateAuth={() => navigateToView('auth')}
          />
        )}

        {/* VIEW 4: SUBMIT TRADE OFFER FULL PAGE */}
        {effectiveView === 'submit_offer' && selectedTradeTargetItem && (
          <SubmitTradeOfferModal
            targetItem={selectedTradeTargetItem}
            onClose={() => navigateToView('all_items')}
            onOpenAddItem={() => navigateToView('add_item')}
          />
        )}

        {/* VIEW 5: MY OFFERS & CONTRACTS FULL PAGE */}
        {effectiveView === 'my_offers' && (
          <TradeOffersModal
            onClose={() => navigateToView('home')}
            onViewContract={(cnt) => {
              setSelectedContractForView(cnt);
              navigateToView('view_contract');
            }}
            onOpenNegotiation={(offerId) => {
              setSelectedUserIdForProfile(currentUser?.id || 'usr_1');
              setProfileInitialTab('negotiations');
              navigateToView('user_profile');
            }}
          />
        )}

        {/* VIEW 6: E-CONTRACT DOCUMENT FULL PAGE */}
        {effectiveView === 'view_contract' && selectedContractForView && (
          <EContractModal
            contract={selectedContractForView}
            onClose={() => navigateToView('my_offers')}
          />
        )}

        {/* VIEW 8: USER PROFILE FULL PAGE */}
        {effectiveView === 'user_profile' && (
          <UserProfilePage
            userId={selectedUserIdForProfile || currentUser?.id}
            initialTab={profileInitialTab}
            onClose={() => navigateToView('home')}
            onSelectItem={handleSelectItem}
            onOpenTradeModal={handleOpenTrade}
            onOpenAddItem={() => navigateToView('add_item')}
            onViewContract={(cnt) => {
              setSelectedContractForView(cnt);
              navigateToView('view_contract');
            }}
            onOpenAdmin={() => navigateToView('admin')}
            onViewUserProfile={handleViewUserProfile}
          />
        )}

        {/* VIEW 8.5: USER SETTINGS & OPTIONS FULL PAGE */}
        {effectiveView === 'user_settings' && (
          <UserSettingsPage
            onClose={() => navigateToView('home')}
          />
        )}

        {/* VIEW 8.7: USER FAVORITES FULL PAGE */}
        {effectiveView === 'favorites' && (
          <FavoritesPage
            onSelectItem={handleSelectItem}
            onOpenTradeModal={handleOpenTrade}
            onNavigateHome={() => navigateToView('home')}
            onNavigateAllItems={() => navigateToView('all_items')}
            onViewUserProfile={handleViewUserProfile}
          />
        )}

        {/* VIEW 9: FULL PAGE AUTH PAGE */}
        {effectiveView === 'auth' && (
          <AuthPage
            onSuccess={() => navigateToView('home')}
            onBack={() => navigateToView('home')}
          />
        )}

        {/* VIEW 10: POLICY & LEGAL PAGES (الشروط والأحكام، الخصوصية، نسبة العمولة) */}
        {(effectiveView === 'terms' || effectiveView === 'privacy' || effectiveView === 'commission') && (
          <PolicyPage
            type={effectiveView as 'terms' | 'privacy' | 'commission'}
            onClose={() => navigateToView('home')}
            onNavigatePolicy={(policyType) => {
              navigateToView(policyType);
            }}
          />
        )}

        {/* VIEW 0: DEFAULT HOME FEED */}
        {effectiveView === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* HERO FEATURE SECTION - Seamless & Frameless Integrated Design */}
            {settings.showHeroBanner && (
              <div className="relative py-2 sm:py-4 text-[#261d17]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Right Column (Text Details Area in RTL: Arabic text on the right) */}
                  <div className={`${settings.showHeroImage !== false ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-5 text-right`}>
                    
                    {/* Top Badge */}
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#f5eee6] text-[#8c5332] border border-[#e6d8c7]">
                      <Sparkles className="w-3.5 h-3.5 text-[#8c5332] shrink-0" />
                      <span>{settings.heroBadgeText || 'منصة مقايضة كاملة'}</span>
                    </div>

                    {/* Giant Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#261d17] leading-[1.15] sm:leading-[1.15]">
                      {settings.heroTitle || (
                        <>
                          قايض وفاوض<br />بما تحتاجه.
                        </>
                      )}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-[#6b584a] max-w-xl font-medium leading-relaxed">
                      {settings.heroSubtitle || 'منصة تتيح لك عرض منتجاتك او مهارتك ومقايضتها بما تحتاجه مباشرة مع الآخرين – بكل بساطة وأمان.'}
                    </p>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => navigateToView('add_item')}
                        className="bg-[#8c5332] hover:bg-[#734123] active:scale-98 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-md shadow-[#8c5332]/20 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>أضف منتجك</span>
                      </button>
                      
                      <button
                        onClick={() => navigateToView('all_items')}
                        className="bg-white hover:bg-[#f5eee6] active:scale-98 text-[#4a3a2e] font-bold text-sm px-7 py-3.5 rounded-2xl transition-all border border-[#e5d8c8] shadow-xs cursor-pointer"
                      >
                        <span>تصفح المنتجات</span>
                      </button>
                    </div>
                  </div>

                  {/* Left Column (Illustration Area: Frameless Image) */}
                  {settings.showHeroImage !== false && (
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                      <div className="w-full max-w-md lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden flex items-center justify-center bg-slate-100 border border-[#e6d8c7]/50">
                        <img
                          src={(settings.heroImageUrl && !settings.heroImageUrl.includes('unsplash') && !settings.heroImageUrl.includes('556742049')) ? settings.heroImageUrl : heroIllustrationImage}
                          alt="منصة مقايضة"
                          className="w-full h-full object-cover rounded-3xl shadow-xs"
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* MODERN FEATURE BOXES (3 Boxes for Platform Advantages) */}
            {settings.showFeatureBoxes && settings.featureBoxes && settings.featureBoxes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {settings.featureBoxes.map((box, idx) => (
                  <div
                    key={box.id || idx}
                    className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e8ded2] shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#f5eee6] border border-[#e6d8c7] flex items-center justify-center text-[#8c5332]">
                      {renderFeatureBoxIcon(box.icon)}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">{box.title}</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{box.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* MAIN ITEMS FEED */}
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
                <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">لم نجد سلعاً تطابق خيارات البحث الحالية</h3>
                <p className="text-xs text-slate-500 font-medium">جرب تغيير الفئة المحددة أو تصفح كل المدن لعرض المزيد من الخيارات.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('الكل');
                  }}
                  className="px-4 py-2 bg-[#f5eee6] hover:bg-[#e6d8c7] text-[#734123] text-xs font-bold rounded-xl transition-all cursor-pointer border border-[#e6d8c7]"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => navigateToView('all_items')}
                    className="text-xs font-bold text-[#8c5332] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>عرض الكل في المعرض ({filteredItems.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
                <div className={`grid gap-4 sm:gap-4 ${
                  settings.productGridCols === '6' ? 'grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                  : settings.productGridCols === '5' ? 'grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                  : settings.productGridCols === '3' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
                }`}>
                  {homepageItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onSelectItem={handleSelectItem}
                      onOpenTradeModal={handleOpenTrade}
                      onViewUserProfile={handleViewUserProfile}
                    />
                  ))}
                </div>

                {/* SHOW MORE / 'المزيد' BUTTON TO GO TO ALL ITEMS */}
                {filteredItems.length > homepageItems.length && (
                  <div className="pt-4 flex flex-col items-center justify-center">
                    <button
                      onClick={() => navigateToView('all_items')}
                      className="px-8 py-3 bg-[#8c5332] hover:bg-[#734123] text-white text-sm font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 group"
                    >
                      <span>المزيد من منتجات المقايضة</span>
                      <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      {settings.showFooter && (
        <Footer
          isOwner={isOwner}
          onOpenAdmin={() => {
            navigateToView('admin');
          }}
          onNavigateView={(view) => {
            navigateToView(view as any);
          }}
        />
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        activeView={effectiveView}
        onNavigate={(view) => navigateToView(view as any)}
        onOpenAddItem={() => navigateToView('add_item')}
        onOpenOffers={() => navigateToView('my_offers')}
        onOpenProfileTab={(tab) => {
          setSelectedUserIdForProfile(currentUser?.id || 'usr_1');
          setProfileInitialTab(tab === 'negotiations' ? 'negotiations' : 'items');
          navigateToView('user_profile');
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <BarterProvider>
      <BarterAppMain />
    </BarterProvider>
  );
}
