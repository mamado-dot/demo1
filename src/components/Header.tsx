import React, { useState } from 'react';
import { 
  RefreshCw, 
  Bell, 
  User, 
  MessageSquare, 
  PlusCircle, 
  Plus,
  Search, 
  Sparkles, 
  LogOut, 
  LogIn,
  Check, 
  Home, 
  Heart,
  ArrowLeftRight,
  Settings,
  Globe,
  Package,
  Shield
} from 'lucide-react';
import { User as UserType, Notification, BrandConfig } from '../types';
import { Language, translations } from '../utils/translations';

interface HeaderProps {
  currentUser: UserType | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  onLogout: () => void;
  brandConfig: BrandConfig;
  language: Language;
  setLanguage: (lang: Language) => void;
  onNavigateToProfileSubTab?: (subTab: 'listings' | 'reviews' | 'trust') => void;
  onOpenAuthModal?: () => void;
  children?: React.ReactNode;
}

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  notifications,
  markNotificationAsRead,
  onLogout,
  brandConfig,
  language,
  setLanguage,
  onNavigateToProfileSubTab,
  onOpenAuthModal,
  children,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs" id="app_header">
      {/* Top Announcement Bar if enabled */}
      {brandConfig.showHeaderNotice && brandConfig.headerNoticeText && (
        <div className="bg-brand-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center space-x-2 space-x-reverse shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
          <span>{brandConfig.headerNoticeText}</span>
        </div>
      )}

      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Platform Name */}
          <div className={`flex items-center space-x-2 ${language === 'ar' ? 'space-x-reverse' : ''} cursor-pointer`} onClick={() => setActiveTab('feed')} id="header_logo_container">
            <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0" id="logo_badge">
              <span>{brandConfig.brandLogo && brandConfig.brandLogo.length === 1 ? (language === 'en' ? 'B' : brandConfig.brandLogo) : (language === 'en' ? 'B' : 'م')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-gray-900 leading-tight" id="logo_text">{language === 'en' ? 'Badel' : (brandConfig.brandName || 'مقايضة')}</span>
              {brandConfig.showHeaderTagline && brandConfig.brandTagline && (
                <span className="text-[10px] text-brand-600 font-bold leading-none">{brandConfig.brandTagline}</span>
              )}
            </div>
          </div>

          {/* Search Bar or Custom Children Slot */}
          <div className="flex-1 flex justify-center px-4" id="header_middle_slot">
            {brandConfig.showHeaderSearch ? (
              <div className="w-full max-w-md relative hidden md:block">
                <input
                  type="text"
                  placeholder="بحث سريع في العروض والسلع..."
                  onClick={() => setActiveTab('offers_page')}
                  className="w-full border border-gray-200 rounded-xl py-1.5 pr-9 pl-3 text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-hidden cursor-pointer"
                  readOnly
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
              </div>
            ) : (
              children
            )}
          </div>
                 {/* User Controls and Notification Icon */}
          {currentUser ? (
            <div className={`flex items-center space-x-3 ${language === 'ar' ? 'space-x-reverse' : ''}`} id="user_actions_header">
              
              {/* Add Product Button (Desktop, like in the screenshot) */}
              <button
                onClick={() => setActiveTab('add')}
                className={`hidden md:flex items-center space-x-1 ${language === 'ar' ? 'space-x-reverse' : ''} bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl px-4 py-2 transition-all cursor-pointer`}
              >
                <span>+ {t.addProduct}</span>
              </button>

              {/* Notification Center */}
              <div className="relative">
                <button
                  id="notif_bell_btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-full relative transition-colors duration-150 cursor-pointer"
                >
                  <Bell className="w-5.5 h-5.5" />
                  {unreadCount > 0 && (
                    <span id="unread_notif_count" className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div id="notif_dropdown" className={`absolute ${language === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden transform transition-all duration-200`}>
                    <div className={`px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <h3 className="font-bold text-gray-900 text-sm">{t.notifications}</h3>
                      <span className="text-[10px] text-gray-400">{t.latestUpdates}</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-400 text-xs">
                          {t.noNotifications}
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              markNotificationAsRead(notification.id);
                              if (notification.type === 'message' || notification.type === 'offer') {
                                setActiveTab('chat');
                              } else if (notification.type === 'match') {
                                setActiveTab('my_swaps');
                              } else if (notification.type === 'rating') {
                                setActiveTab('profile');
                              }
                              setShowNotifications(false);
                            }}
                            className={`p-3 text-start hover:bg-brand-50/50 cursor-pointer transition-colors duration-150 flex items-start space-x-2 ${language === 'ar' ? 'space-x-reverse' : ''} ${
                              !notification.read ? 'bg-brand-50/30' : ''
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold ${!notification.read ? 'text-brand-700' : 'text-gray-700'}`}>
                                  {notification.title}
                                </span>
                                {!notification.read && <span className="h-2 w-2 rounded-full bg-brand-600"></span>}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {notification.description}
                              </p>
                              <span className="text-[9px] text-gray-400 mt-1 block">
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Quick Info with Dropdown Menu */}
              <div className="relative" id="profile_menu_container">
                <button 
                  id="user_profile_trigger"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-1 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150 flex items-center"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                  />
                </button>

                {showProfileMenu && (
                  <>
                    {/* Transparent Click-Away Overlay */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    
                    {/* The Dropdown Panel */}
                    <div 
                      id="profile_dropdown_menu" 
                      className={`absolute ${language === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden transform transition-all duration-200`}
                    >
                      {/* Menu Items */}
                      <button
                        onClick={() => {
                          onNavigateToProfileSubTab?.('listings');
                          setActiveTab('profile');
                          setShowProfileMenu(false);
                        }}
                        className={`w-full flex items-center ${language === 'ar' ? 'text-right' : 'text-left'} px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer`}
                      >
                        <span>{language === 'en' ? 'My Profile' : 'ملفي الشخصي'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('my_swaps');
                          setShowProfileMenu(false);
                        }}
                        className={`w-full flex items-center ${language === 'ar' ? 'text-right' : 'text-left'} px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer`}
                      >
                        <span>{language === 'en' ? 'My Swaps' : 'مقايضاتي'}</span>
                      </button>

                      {currentUser?.isAdmin && (
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-center ${language === 'ar' ? 'text-right' : 'text-left'} px-4 py-2.5 text-xs font-bold text-purple-700 hover:bg-purple-50 transition-colors duration-150 cursor-pointer`}
                        >
                          <span>{t.controlPanel}</span>
                        </button>
                      )}

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => {
                          onLogout();
                          setShowProfileMenu(false);
                        }}
                        className={`w-full flex items-center ${language === 'ar' ? 'text-right' : 'text-left'} px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer`}
                      >
                        <span>{t.logout}</span>
                      </button>

                    </div>
                  </>
                )}
              </div>

            </div>
          ) : (
            <div className={`flex items-center space-x-2 ${language === 'ar' ? 'space-x-reverse' : ''}`} id="guest_header_actions">
              <button
                onClick={onOpenAuthModal}
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl px-3.5 py-2 transition-all cursor-pointer flex items-center space-x-1.5 space-x-reverse shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === 'en' ? 'Sign In' : 'تسجيل الدخول'}</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-1.5 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]" id="mobile_nav">
        <div className="flex justify-between items-center w-full max-w-md mx-auto px-1">
          
          {/* 1. الرئيسية (Far Right in RTL) */}
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 cursor-pointer ${
              activeTab === 'feed' || activeTab === 'offers_page' ? 'text-brand-600 font-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">{language === 'en' ? 'Home' : 'الرئيسية'}</span>
          </button>

          {/* 2. المفضلة (Second Right in RTL) */}
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuthModal?.();
              } else {
                setActiveTab('favorites');
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 cursor-pointer ${
              activeTab === 'favorites' ? 'text-brand-600 font-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">{language === 'en' ? 'Favorites' : 'المفضلة'}</span>
          </button>

          {/* 3. + (Center Elevated Circular Brand Color Button) */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuthModal?.();
                } else {
                  setActiveTab('add');
                }
              }}
              className="w-12 h-12 -mt-5 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 ring-4 ring-white active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={language === 'en' ? 'Add Listing' : 'إضافة عرض'}
              title={language === 'en' ? 'Add Listing' : 'إضافة عرض'}
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>

          {/* 4. الإشعارات (Second Left in RTL) */}
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuthModal?.();
              } else {
                setShowNotifications(!showNotifications);
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 relative cursor-pointer ${
              showNotifications ? 'text-brand-600 font-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5">{language === 'en' ? 'Notifications' : 'الإشعارات'}</span>
          </button>

          {/* 5. مقايضاتي (Far Left in RTL) */}
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuthModal?.();
              } else {
                setActiveTab('my_swaps');
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 relative cursor-pointer ${
              activeTab === 'my_swaps' ? 'text-brand-600 font-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">{language === 'en' ? 'My Swaps' : 'مقايضاتي'}</span>
          </button>

        </div>
      </div>
    </header>
  );
}

