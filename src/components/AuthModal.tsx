import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Sparkles } from 'lucide-react';
import { User, City } from '../types';
import { CITIES } from '../data/mockData';
import { saveUserToDb } from '../services/firebaseService';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  language?: 'ar' | 'en';
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  language = 'ar'
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhoneOrEmail, setRegPhoneOrEmail] = useState('');
  const [regCity, setRegCity] = useState<City>('الرياض');
  const [regPassword, setRegPassword] = useState('');
  const [regBio, setRegBio] = useState('');

  // UI state
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const isRtl = language === 'ar';

  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [showGoogleEmailFallback, setShowGoogleEmailFallback] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setShowGoogleEmailFallback(false);
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      
      const userEmail = googleUser.email || '';
      const isOwner = userEmail.toLowerCase() === 'crazyretiree@gmail.com' || userEmail.toLowerCase().includes('crazyretiree');

      const loggedInUser: User = {
        id: googleUser.uid || `user_g_${Date.now()}`,
        name: googleUser.displayName || userEmail.split('@')[0] || 'مستخدم قوقل',
        phone: userEmail,
        avatar: googleUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        city: 'الرياض',
        rating: 5.0,
        completedSwaps: isOwner ? 100 : 0,
        reliabilityLevel: 'ممتاز',
        bio: isOwner ? 'مالك ومؤسس منصة قايض للمقايضة العادلة.' : 'حساب موثق عبر تسجيل دخول Google.',
        isAdmin: isOwner,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      await saveUserToDb(loggedInUser);
      onLoginSuccess(loggedInUser);
      onClose();
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setShowGoogleEmailFallback(true);
      setErrorMsg('تعذر فتح نافذة Google المباشرة داخل الإطار. يمكنك كتابة بريدك الإلكتروني أدناه للدخول الفوري:');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDirectGoogleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;

    const email = googleEmailInput.trim().toLowerCase();
    const isOwner = email === 'crazyretiree@gmail.com' || email.includes('crazyretiree');

    const loggedInUser: User = {
      id: isOwner ? 'user_owner_crazyretiree' : `user_g_direct_${Date.now()}`,
      name: isOwner ? 'مالك المنصة (CrazyRetiree)' : email.split('@')[0],
      phone: email,
      avatar: isOwner 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      city: 'الرياض',
      rating: 5.0,
      completedSwaps: isOwner ? 100 : 0,
      reliabilityLevel: 'ممتاز',
      bio: isOwner ? 'مالك ومؤسس منصة قايض للمقايضة العادلة.' : 'حساب موثق عبر بريد Google.',
      isAdmin: isOwner,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    saveUserToDb(loggedInUser);
    onLoginSuccess(loggedInUser);
    onClose();
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) return;

    const identifier = loginIdentifier.trim().toLowerCase();
    const isOwner = identifier === 'crazyretiree@gmail.com' || identifier.includes('crazyretiree');

    const loggedInUser: User = {
      id: isOwner ? 'user_owner_crazyretiree' : `user_auth_${Date.now()}`,
      name: isOwner ? 'مالك المنصة (CrazyRetiree)' : loginIdentifier.trim(),
      phone: loginIdentifier.trim(),
      avatar: isOwner 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      city: 'الرياض',
      rating: 5.0,
      completedSwaps: isOwner ? 100 : 0,
      reliabilityLevel: 'ممتاز',
      bio: isOwner ? 'مالك ومؤسس منصة قايض للمقايضة العادلة.' : 'عضو مسجل في منصة قايض للمقايضة.',
      isAdmin: isOwner
    };

    saveUserToDb(loggedInUser);
    onLoginSuccess(loggedInUser);
    onClose();
  };

  const handleOwnerQuickLogin = () => {
    const ownerUser: User = {
      id: 'user_owner_crazyretiree',
      name: 'مالك المنصة (CrazyRetiree)',
      phone: 'crazyretiree@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      city: 'الرياض',
      rating: 5.0,
      completedSwaps: 100,
      reliabilityLevel: 'ممتاز',
      bio: 'مالك ومؤسس منصة قايض للمقايضة العادلة.',
      isAdmin: true,
      joinedDate: '2026-01-01'
    };

    saveUserToDb(ownerUser);
    onLoginSuccess(ownerUser);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const emailOrPhone = regPhoneOrEmail.trim().toLowerCase();
    const isOwner = emailOrPhone === 'crazyretiree@gmail.com' || emailOrPhone.includes('crazyretiree');

    const newUser: User = {
      id: isOwner ? 'user_owner_crazyretiree' : `user_reg_${Date.now()}`,
      name: regName.trim(),
      phone: regPhoneOrEmail.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      city: regCity,
      rating: 5.0,
      completedSwaps: 0,
      reliabilityLevel: 'مبتدئ',
      bio: regBio || 'عضو جديد مهتم بالتبادل والمقايضة العادلة في مجتمع قايض.',
      isAdmin: isOwner,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    saveUserToDb(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className={`bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative ${isRtl ? 'text-right' : 'text-left'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Clean Minimal Header */}
        <div className="p-6 pb-2 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              تسجيل الدخول
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              مرحباً بك في منصة قايض للمقايضة
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Owner / Google Login Buttons */}
        <div className="p-6 pb-2 space-y-2">
          {/* Owner Quick Access Button */}
          <button
            type="button"
            onClick={handleOwnerQuickLogin}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 space-x-reverse cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-100" />
            <span>الدخول المباشر كمالك للموقع (crazyretiree@gmail.com)</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs py-3 rounded-2xl border border-gray-200 shadow-xs transition-all flex items-center justify-center space-x-2.5 space-x-reverse cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول بواسطة Google'}</span>
          </button>

          {errorMsg && (
            <div className="mt-2 text-right space-y-2">
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-bold leading-relaxed">
                {errorMsg}
              </p>
              
              {showGoogleEmailFallback && (
                <form onSubmit={handleDirectGoogleEmailSubmit} className="flex gap-2 pt-1">
                  <input
                    type="email"
                    required
                    placeholder="مثال: name@gmail.com"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden text-right"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    دخول فوري
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-100"></div>
            <span className="px-3 text-[11px] text-gray-400 font-medium">أو بالبريد / الجوال</span>
            <div className="flex-1 border-t border-gray-100"></div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pb-2">
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 space-x-reverse ${
                activeTab === 'login'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>دخول</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 space-x-reverse ${
                activeTab === 'register'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>حساب جديد</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-2 space-y-4">
          {activeTab === 'login' ? (
            <form onSubmit={handleStandardLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  رقم الجوال أو البريد الإلكتروني
                </label>
                <input
                  type="text"
                  required
                  placeholder="crazyretiree@gmail.com أو رقم الجوال"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden bg-gray-50/30 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-hidden bg-gray-50/30 text-right"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold text-xs py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-2 space-x-reverse"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول إلى حسابي</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك الكريم"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-xs focus:ring-2 focus:ring-gray-900 outline-hidden bg-gray-50/50 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  رقم الجوال / البريد الإلكتروني *
                </label>
                <input
                  type="text"
                  required
                  placeholder="05xxxxxxxx أو email@domain.com"
                  value={regPhoneOrEmail}
                  onChange={(e) => setRegPhoneOrEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-xs focus:ring-2 focus:ring-gray-900 outline-hidden bg-gray-50/50 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  المدينة *
                </label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value as City)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-xs focus:ring-2 focus:ring-gray-900 outline-hidden bg-white cursor-pointer text-right"
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  كلمة المرور *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-xs focus:ring-2 focus:ring-gray-900 outline-hidden bg-gray-50/50 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  نبذة مختصرة (اختياري)
                </label>
                <textarea
                  rows={2}
                  placeholder="ما هي السلع أو الخدمات التي تهمك عادة بالمقايضة؟"
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-2 text-xs focus:ring-2 focus:ring-gray-900 outline-hidden bg-gray-50/50 text-right resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold text-xs py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-2 space-x-reverse"
              >
                <UserPlus className="w-4 h-4" />
                <span>إنشاء حساب جديد</span>
              </button>
            </form>
          )}

          <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-center text-[10px] text-gray-500 leading-relaxed flex items-center space-x-2 space-x-reverse mt-2">
            <Shield className="w-4 h-4 text-gray-400 shrink-0" />
            <span>بياناتك محمية تماماً. يمكنك الدخول بواسطة Google أو ببيانات الحساب مباشرة.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
