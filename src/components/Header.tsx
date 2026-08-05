import React, { useState, useRef, useEffect } from 'react';
import { useBarter } from '../context/BarterContext';
import { 
  ArrowLeftRight, 
  PlusCircle, 
  LogIn,
  LogOut,
  Search, 
  LayoutDashboard,
  Sparkles,
  Package,
  Settings,
  ChevronDown,
  Globe,
  Mail,
  Phone,
  MapPin,
  X,
  Check,
  User as UserIcon,
  Save,
  Shield,
  MessageSquare,
  Heart
} from 'lucide-react';

interface HeaderProps {
  activeView?: string;
  onNavigate?: (view: any) => void;
  onOpenAddItem: () => void;
  onOpenOffers: () => void;
  onOpenContracts: () => void;
  onOpenProfile?: (tab?: 'profile' | 'items' | 'offers' | 'contracts' | 'negotiations') => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeView = 'home',
  onNavigate,
  onOpenAddItem, 
  onOpenOffers, 
  onOpenContracts,
  onOpenProfile,
  onOpenAdmin
}) => {
  const { 
    currentUser, 
    setCurrentUser,
    updateUserProfile,
    isAdminMode, 
    setIsAdminMode,
    searchQuery,
    setSearchQuery,
    selectedCityFilter,
    setSelectedCityFilter,
    offers,
    settings,
    favorites
  } = useBarter();

  const userNegotiationsCount = currentUser
    ? offers.filter((o) => o.offeredByUserId === currentUser.id || o.targetOwnerUserId === currentUser.id).length
    : 0;

  // Dropdown state & Ref for outside click detection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle Outside Click to Close Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if current user is the platform owner
  const isOwner = currentUser?.email?.toLowerCase() === 'crazyretiree@gmail.com';

  return (
    <header className="sticky top-0 z-40 bg-[#faf6f0]/95 backdrop-blur-md border-b border-[#e8ded2] shadow-xs dir-rtl">
      {/* Top Banner Notice if enabled */}
      {settings.showHeaderTopNotice && settings.headerNotice && (
        <div className="bg-[#2b1c14] text-[#e8ded2] text-xs px-4 py-2 text-center font-medium border-b border-[#3b271c]">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d9a885] shrink-0" />
            <span>{settings.headerNotice}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Logo & Brand (Top Right in Arabic RTL) */}
          <div 
            onClick={() => {
              setIsAdminMode(false);
              if (onNavigate) onNavigate('home');
            }}
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#8c5332] group-hover:bg-[#734123] flex items-center justify-center text-white shadow-md shadow-[#8c5332]/20 transition-all shrink-0 font-black text-lg">
              <ArrowLeftRight className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#261d17] tracking-tight">
                  {settings?.siteName || 'مقايضة'}
                </span>
              </div>
            </div>
          </div>

          {/* HEADER SEARCH BOX */}
          {settings.showHeaderSearch && (
            <div className="relative max-w-xs sm:max-w-sm md:max-w-md w-full mx-2 hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5eee6] focus:bg-white text-slate-900 text-xs sm:text-sm rounded-full pr-10 pl-4 py-2 border border-[#e6d8c7] focus:border-[#8c5332] focus:ring-2 focus:ring-[#8c5332]/20 transition-all outline-hidden font-medium shadow-2xs"
              />
            </div>
          )}

          {/* User Actions & Left Side Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Control Panel (Admin option strictly for owner crazyretiree@gmail.com) */}
            {onOpenAdmin && isOwner && (
              <button
                onClick={() => {
                  setIsAdminMode(true);
                  onOpenAdmin();
                }}
                className={`hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isAdminMode
                    ? 'bg-[#261d17] text-white shadow-xs'
                    : 'bg-[#e8ded2] text-[#4a3a2e] hover:bg-[#ded1c2]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#8c5332]" />
                <span>لوحة التحكم (المالك)</span>
              </button>
            )}

            {/* Add Item Primary Brown Button (Visible only for logged-in users) */}
            {currentUser && settings.showHeaderAddItemBtn && (
              <button
                onClick={onOpenAddItem}
                className="bg-[#8c5332] hover:bg-[#734123] active:scale-98 text-white text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-md shadow-[#8c5332]/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>أضف منتجاً</span>
              </button>
            )}

            {/* User Account Login / Dropdown Menu */}
            <div className="flex items-center gap-2 shrink-0 pr-1 border-r border-[#e8ded2] relative" ref={dropdownRef}>
              {!currentUser ? (
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('auth');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </button>
              ) : (
                <div className="relative">
                  {/* User Profile Avatar Trigger Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2.5 rounded-full hover:bg-[#f5eee6] bg-[#faf6f0] border border-[#e8ded2] transition-all cursor-pointer active:scale-95 shadow-2xs"
                    title="قائمة حسابي"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#8c5332]/20"
                    />
                    <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Overlay */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 text-right animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* User Brief Info Header */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
                        <div className="font-black text-xs text-slate-900 truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                          {currentUser.email || currentUser.phone || 'عضو موثق'}
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="py-1">
                        
                        {/* 0. لوحة التحكم (Strictly for Platform Owner) */}
                        {isOwner && onOpenAdmin && (
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setIsAdminMode(true);
                              onOpenAdmin();
                            }}
                            className="w-full px-4 py-2.5 text-xs font-black text-[#8c5332] bg-[#f5eee6] hover:bg-[#e8ded2] flex items-center gap-2.5 transition-colors cursor-pointer border-b border-[#e6d8c7]"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#8c5332]" />
                            <span>لوحة التحكم (المالك)</span>
                          </button>
                        )}

                        {/* 1. الملف الشخصي (Profile) */}
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (onOpenProfile) {
                              onOpenProfile('profile');
                            } else if (onNavigate) {
                              onNavigate('user_profile');
                            }
                          }}
                          className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f5eee6] hover:text-[#8c5332] flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <UserIcon className="w-4 h-4 text-[#8c5332]" />
                            <span>الملف الشخصي</span>
                          </div>
                        </button>

                        {/* 2. منتجاتي (My Products) */}
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (onOpenProfile) {
                              onOpenProfile('items');
                            } else if (onNavigate) {
                              onNavigate('user_profile');
                            }
                          }}
                          className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f5eee6] hover:text-[#8c5332] flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Package className="w-4 h-4 text-[#8c5332]" />
                            <span>منتجاتي</span>
                          </div>
                        </button>

                        {/* 1.5. مفاوضات (Negotiations Chat) */}
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (onOpenProfile) {
                              onOpenProfile('negotiations');
                            } else if (onNavigate) {
                              onNavigate('negotiations');
                            }
                          }}
                          className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f5eee6] hover:text-[#8c5332] flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageSquare className="w-4 h-4 text-[#8c5332]" />
                            <span>مفاوضات</span>
                          </div>
                        </button>

                        {/* 2. مقايضاته (My Barters / Contracts) */}
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onOpenOffers();
                          }}
                          className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f5eee6] hover:text-[#8c5332] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <ArrowLeftRight className="w-4 h-4 text-[#8c5332]" />
                          <span>مقايضاته</span>
                        </button>

                        {/* 2.5. المفضلة (Favorites) */}
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (onNavigate) onNavigate('favorites');
                          }}
                          className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f5eee6] hover:text-[#8c5332] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                          <span>المفضلة</span>
                        </button>

                        {/* 3. خيارات (Options: Page Navigation) */}
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (onNavigate) onNavigate('user_settings');
                          }}
                          className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#f5eee6] hover:text-[#8c5332] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-[#8c5332]" />
                          <span>خيارات</span>
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-100 my-1"></div>

                      {/* 4. تسجيل الخروج (Log Out) */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setCurrentUser(null);
                          if (onNavigate) onNavigate('home');
                        }}
                        className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>تسجيل الخروج</span>
                      </button>

                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Search Bar */}
        {settings.showHeaderSearch && (
          <div className="pb-3 md:hidden flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f5eee6] focus:bg-white text-slate-900 text-xs rounded-full pr-10 pl-4 py-2 border border-[#e6d8c7] focus:border-[#8c5332] outline-hidden font-medium shadow-2xs"
              />
            </div>
          </div>
        )}

      </div>
    </header>
  );
};


