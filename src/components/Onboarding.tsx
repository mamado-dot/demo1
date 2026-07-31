import React, { useState } from 'react';
import { RefreshCw, UserCheck, Sparkles, LogIn, Plus } from 'lucide-react';
import { City, User } from '../types';
import { CITIES, MOCK_USERS } from '../data/mockData';

interface OnboardingProps {
  onLogin: (user: User) => void;
  language?: 'en' | 'ar';
}

export default function Onboarding({ onLogin, language = 'ar' }: OnboardingProps) {
  const [mode, setMode] = useState<'select' | 'create'>('create');
  const [name, setName] = useState('');
  const [city, setCity] = useState<City>('الرياض');
  const [bio, setBio] = useState('');

  const cityDisplay = (c: string) => {
    if (language === 'en') {
      switch (c) {
        case 'الرياض': return 'Riyadh';
        case 'جدة': return 'Jeddah';
        case 'الدمام': return 'Dammam';
        case 'مكة المكرمة': return 'Makkah';
        case 'المدينة المنورة': return 'Madinah';
        case 'القصيم': return 'Qassim';
        case 'عسير': return 'Asir';
        default: return c;
      }
    }
    return c;
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const customUser: User = {
      id: `user_custom_${Date.now()}`,
      name: name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', // default nice avatar
      city: city,
      rating: 5.0,
      completedSwaps: 0,
      reliabilityLevel: 'مبتدئ',
      bio: bio || (language === 'en' ? 'New member interested in fair bartering in the Qayd community.' : 'عضو جديد مهتم بالتبادل والمقايضة العادلة في مجتمع قايض.'),
    };

    onLogin(customUser);
  };

  const isRtl = language === 'ar';

  return (
    <div id="onboarding_container" className={`max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden ${isRtl ? 'text-right' : 'text-start'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Visual Header */}
      <div className="bg-gradient-to-tr from-emerald-700 to-teal-500 p-8 text-white text-center relative">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md backdrop-blur-xs">
          <RefreshCw className="w-6 h-6 animate-spin-slow text-white" />
        </div>
        <h2 className="text-2xl font-black">{language === 'en' ? 'Welcome to Qayd 👋' : 'مرحباً بك في قايض 👋'}</h2>
        <p className="text-xs text-emerald-100 mt-1.5 leading-relaxed">
          {language === 'en' 
            ? 'The first smart digital platform to barter products and services (item for item, or service for service) without any monetary exchange!'
            : 'أول منصة رقمية عربية ذكية لمقايضة المنتجات والخدمات (سلعة مقابل سلعة أو خدمة مقابل خدمة) بدون أي مقابل مالي!'}
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Tab switches */}
        <div className="grid grid-cols-2 gap-2" id="onboarding_tabs">
          <button
            onClick={() => setMode('select')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 border ${
              mode === 'select'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'bg-white border-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            {language === 'en' ? 'Ready Accounts (Recommended)' : 'تجربة حسابات مجهزة (موصى بها)'}
          </button>
          
          <button
            onClick={() => setMode('create')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 border ${
              mode === 'create'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'bg-white border-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            {language === 'en' ? 'Create Custom Account' : 'إنشاء حساب شخصي جديد'}
          </button>
        </div>

        {/* MODE 1: SELECT PRESET USER */}
        {mode === 'select' ? (
          <div className="space-y-4" id="select_account_view">
            <div>
              <span className="text-xs font-bold text-gray-700">
                {language === 'en' 
                  ? 'Choose a role to test smart matching scenarios instantly:' 
                  : 'اختر أحد الأدوار التالية لتجربة سيناريوهات المطابقة الذكية فوراً:'}
              </span>
            </div>

            <div className={`space-y-2.5 max-h-80 overflow-y-auto ${isRtl ? 'pr-1' : 'pl-1'}`} id="preset_accounts_list">
              {Object.values(MOCK_USERS).map((user) => (
                <div
                  key={user.id}
                  id={`preset_user_${user.id}`}
                  onClick={() => onLogin(user)}
                  className={`p-3 bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 rounded-2xl flex items-center space-x-3 ${isRtl ? 'space-x-reverse' : ''} cursor-pointer transition-all duration-150 group`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-emerald-700">{user.name}</span>
                      <span className="text-[10px] bg-white text-gray-500 px-1.5 py-0.5 rounded-md border border-gray-100 font-semibold">
                        {cityDisplay(user.city)}
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.bio}</p>
                    
                    <div className={`flex items-center space-x-2 ${isRtl ? 'space-x-reverse' : ''} mt-1 text-[9px] text-emerald-700 font-bold`}>
                      <span>⭐ {user.rating} {language === 'en' ? 'Rating' : 'التقييم'}</span>
                      <span>•</span>
                      <span>🔄 {user.completedSwaps} {language === 'en' ? 'completed swaps' : 'مقايضات ناجحة'}</span>
                      <span>•</span>
                      <span>🏆 {
                        user.reliabilityLevel === 'ممتاز' ? (language === 'en' ? 'Excellent' : 'ممتاز') :
                        user.reliabilityLevel === 'جيد جداً' ? (language === 'en' ? 'Very Good' : 'جيد جداً') : 
                        (language === 'en' ? 'Beginner' : 'مبتدئ')
                      }</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* MODE 2: CREATE CUSTOM PROFILE */
          <form onSubmit={handleCreateProfile} className="space-y-4" id="create_account_form">
            
            <div id="create_group_name">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'en' ? 'Full Name *' : 'الاسم الكامل *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'en' ? 'Enter real or nickname' : 'أدخل اسمك الحقيقي أو المستعار'}
                className={`w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs ${isRtl ? 'text-right' : 'text-left'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-gray-50/50`}
              />
            </div>

            <div id="create_group_city">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'en' ? 'City *' : 'المدينة *'}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as City)}
                className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs ${isRtl ? 'text-right' : 'text-left'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-white cursor-pointer`}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{cityDisplay(c)}</option>
                ))}
              </select>
            </div>

            <div id="create_group_bio">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'en' ? 'Bio (Optional)' : 'النبذة الشخصية (اختياري)'}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder={language === 'en' ? 'Write a small bio about your hobbies to attract swap offers' : 'اكتب نبذة بسيطة عن هواياتك أو ما تبحث عنه بالعادة لجذب عروض مقايضة ذكية'}
                className={`w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs ${isRtl ? 'text-right' : 'text-left'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden bg-gray-50/50`}
              />
            </div>

            <button
              id="btn_create_account"
              type="submit"
              className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all duration-150 shadow-md shadow-emerald-100 flex items-center justify-center space-x-1.5 ${isRtl ? 'space-x-reverse' : ''}`}
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'en' ? 'Create Account & Start' : 'إنشاء الحساب وبدء التجربة'}</span>
            </button>

          </form>
        )}

        {/* Security / Verification Badge info */}
        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100/60 text-center text-[10px] text-gray-500 leading-relaxed" id="onboarding_safety_note">
          {language === 'en' 
            ? '🔒 Data protection is fully guaranteed. Qayd is committed to a secure, cash-free environment to promote sustainable consumption and the collaborative circular economy.'
            : '🔒 حماية البيانات مكفولة بالكامل. تلتزم منصة قايض ببيئة آمنة وخالية من العملات النقدية، لتشجيع الاستهلاك المستدام والاقتصاد الدائري التعاوني.'}
        </div>

      </div>
    </div>
  );
}
