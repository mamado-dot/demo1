import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, MapPin, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useBarter } from '../context/BarterContext';
import { User } from '../types';

interface AuthPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBack }) => {
  const { users, setCurrentUser, adminAddUser, settings } = useBarter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('الرياض');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoogleAuth = (googleEmail?: string) => {
    const targetEmail = googleEmail || email || 'user.google@gmail.com';
    
    // Check if user with this email already exists
    let user = users.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());

    if (!user) {
      // Create user via Google
      const isOwner = targetEmail.toLowerCase() === 'crazyretiree@gmail.com';
      const autoActivate = settings?.autoActivateNewUsers ?? true;
      user = {
        id: 'usr_' + Date.now(),
        name: isOwner ? 'أحمد العتيبي' : (name || targetEmail.split('@')[0]),
        email: targetEmail,
        avatar: isOwner 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        city: city || 'الرياض',
        phone: '05' + Math.floor(10000000 + Math.random() * 90000000),
        verified: true,
        rating: 0,
        completedBartersCount: 0,
        isActive: isOwner ? true : autoActivate,
        membershipTier: isOwner ? 'عضو موثق' : 'عضو عادي',
      };
      adminAddUser(user);
    }

    setCurrentUser(user);
    setSuccess(`تم تسجيل الدخول بنجاح بواسطة حساب Google (${user.email})`);
    setTimeout(() => {
      onSuccess();
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('يرجى كتابة البريد الإلكتروني');
      return;
    }

    if (isSignUp && !name) {
      setError('يرجى كتابة الاسم الكامل');
      return;
    }

    const targetEmail = email.trim();
    let existingUser = users.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());

    if (isSignUp) {
      if (existingUser) {
        setError('هذا البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول به مباشرة');
        return;
      }

      const isOwner = targetEmail.toLowerCase() === 'crazyretiree@gmail.com';
      if (isOwner && password !== '054422516') {
        setError('كلمة المرور غير صحيحة');
        return;
      }

      const autoActivate = settings?.autoActivateNewUsers ?? true;
      const newUser: User = {
        id: isOwner ? 'usr_1' : 'usr_' + Date.now(),
        name: isOwner ? 'أحمد العتيبي' : name,
        email: targetEmail,
        password: password || '054422516',
        isOwner: isOwner,
        role: isOwner ? 'admin' : 'user',
        avatar: isOwner 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' 
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        city,
        phone: '05' + Math.floor(10000000 + Math.random() * 90000000),
        verified: true,
        rating: 0,
        completedBartersCount: isOwner ? 8 : 0,
        isActive: isOwner ? true : autoActivate,
        membershipTier: isOwner ? 'عضو موثق' : 'عضو عادي',
      };

      adminAddUser(newUser);
      setCurrentUser(newUser);
      if (autoActivate || isOwner) {
        setSuccess('تم إنشاء الحساب وتفعيله بنجاح! يمكنك البدء بالاستخدام الآن.');
      } else {
        setSuccess('تم إنشاء الحساب بنجاح! حسابك حالياً بانتظار تفعيل إدارة المنصة.');
      }
    } else {
      const isOwner = targetEmail.toLowerCase() === 'crazyretiree@gmail.com';
      if (isOwner) {
        if (password && password !== '054422516') {
          setError('كلمة المرور غير صحيحة');
          return;
        }
      }

      if (!existingUser) {
        if (isOwner) {
          existingUser = {
            id: 'usr_1',
            name: 'أحمد العتيبي',
            email: 'crazyretiree@gmail.com',
            password: '054422516',
            isOwner: true,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            city: 'الرياض',
            phone: '0501234567',
            verified: true,
            rating: 0,
            completedBartersCount: 8
          };
          adminAddUser(existingUser);
        } else {
          setError('لم نجد حساباً بهذا البريد الإلكتروني. يمكنك إنشاء حساب جديد مجاناً');
          return;
        }
      } else if (existingUser.password && password && existingUser.password !== password) {
        setError('كلمة المرور غير صحيحة');
        return;
      }

      setCurrentUser(existingUser);
      setSuccess(`أهلاً بك مجدداً يا ${existingUser.name}`);
    }

    setTimeout(() => {
      onSuccess();
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-10 px-4 dir-rtl">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#e8ded2] overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#faf6f0] p-6 border-b border-[#e8ded2] text-right relative">
          <button
            onClick={onBack}
            className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للموقع</span>
          </button>

          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-7 h-7 text-[#8c5332]" />
            <h1 className="text-xl font-black text-slate-900">
              {isSignUp ? 'إنشاء حساب جديد في مقايضة' : 'تسجيل الدخول إلى حسابك'}
            </h1>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            تصفح كل المنتجات بحرية، وعند الرغبة في إضافة العروض وتوثيق العقود يمكنك تسجيل الدخول بسهولة.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={() => handleGoogleAuth(email || undefined)}
            className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 hover:border-[#8c5332]/40 bg-white hover:bg-slate-50 text-slate-800 text-xs font-extrabold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isSignUp ? 'متابعة بضغطة واحدة عبر Google' : 'تسجيل الدخول السريع عبر Google'}</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs font-bold text-slate-400 shrink-0">
              أو بواسطة البريد الإلكتروني
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل:</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد علي"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-3 text-xs font-bold text-slate-900 focus:border-[#8c5332] outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-3 text-xs font-bold text-slate-900 focus:border-[#8c5332] outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-3 text-xs font-bold text-slate-900 focus:border-[#8c5332] outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المدينة:</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-3 text-xs font-bold text-slate-900 focus:border-[#8c5332] outline-hidden cursor-pointer"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-bold shadow-md shadow-[#8c5332]/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="pt-4 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-xs font-bold text-[#8c5332] hover:underline cursor-pointer"
            >
              {isSignUp ? 'لديك حساب بالفعل؟ اضغط هنا لتسجيل الدخول' : 'ليس لديك حساب؟ اضغط هنا لإنشاء حساب جديد مجاناً'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
