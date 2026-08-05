import React, { useState, useEffect } from 'react';
import { useBarter } from '../context/BarterContext';
import { 
  Settings, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  Check, 
  Save, 
  ArrowRight, 
  Camera, 
  Bell, 
  Lock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface UserSettingsPageProps {
  onClose: () => void;
}

export const UserSettingsPage: React.FC<UserSettingsPageProps> = ({ onClose }) => {
  const { currentUser, updateUserProfile } = useBarter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('الرياض');
  const [avatar, setAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [siteLanguage, setSiteLanguage] = useState<'ar' | 'en'>('ar');

  // Notification Toggles
  const [notifyTradeOffers, setNotifyTradeOffers] = useState(true);
  const [notifyContractUpdates, setNotifyContractUpdates] = useState(true);
  const [notifyPromotions, setNotifyPromotions] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setCity(currentUser.city || 'الرياض');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCustomAvatarUrl(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() || avatar;
    
    updateUserProfile({
      name,
      email,
      phone,
      city,
      avatar: finalAvatar
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 dir-rtl font-['Cairo',sans-serif]">
        <Lock className="w-12 h-12 text-[#8c5332] mx-auto" />
        <h2 className="text-lg font-black text-slate-900">يرجى تسجيل الدخول أولاً</h2>
        <p className="text-xs text-slate-500 font-medium">الوصول لصفحة خيارات وتعديل الحساب يتطلب تسجيل الدخول</p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl bg-[#8c5332] text-white text-xs font-bold transition-all cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 dir-rtl font-['Cairo',sans-serif] animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Page Title */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            title="العودة"
            aria-label="العودة"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-[#8c5332] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#8c5332]/20">
            <Settings className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900">إعدادات وخيارات الحساب</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                currentUser.membershipTier === 'عضو مشترك'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : currentUser.membershipTier === 'عضو موثق'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {currentUser.membershipTier || 'عضو عادي'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">إدارة البيانات الشخصية وتوثيق الحساب وإعدادات التواصل والتنبيهات</p>
          </div>
        </div>

        {isSaved && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ التعديلات بنجاح</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* SECTION 1: PERSONAL INFORMATION & AVATAR */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-[#8c5332]" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">البيانات الشخصية والصورة</h3>
              <p className="text-xs text-slate-500 font-medium">تعديل الاسم المعروض والبيانات المتاحة لأطراف المقايضة</p>
            </div>
          </div>

          {/* Profile Picture / Avatar Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-slate-800">الصورة الشخصية (رمز الحساب)</label>
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="relative group shrink-0">
                <img
                  src={customAvatarUrl.trim() || avatar || currentUser.avatar}
                  alt={currentUser.name}
                  className="w-22 h-22 rounded-2xl object-cover ring-4 ring-[#8c5332]/20 shadow-sm"
                />
                <label className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">تغيير الصورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-3 flex-1 w-full">
                
                {/* Upload Button & URL Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-4 py-2 rounded-xl bg-[#8c5332] text-white hover:bg-[#734123] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs">
                    <Camera className="w-4 h-4" />
                    <span>رفع صورة من جهازك</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-slate-400 font-bold hidden sm:inline">أو</span>

                  <input
                    type="url"
                    placeholder="أدخل رابط صورة خارجي (URL)..."
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-800 focus:outline-hidden focus:border-[#8c5332]"
                  />
                </div>



              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#8c5332] bg-slate-50/50 focus:bg-white"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#8c5332]" />
                <span>البريد الإلكتروني</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#8c5332] bg-slate-50/50 focus:bg-white font-mono"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#8c5332]" />
                <span>رقم الجوال</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#8c5332] bg-slate-50/50 focus:bg-white"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8c5332]" />
                <span>المدينة / المنطقة</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#8c5332] bg-slate-50/50 focus:bg-white"
              >
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الدمام">الدمام</option>
                <option value="مكة المكرمة">مكة المكرمة</option>
                <option value="المدينة المنورة">المدينة المنورة</option>
                <option value="الخبر">الخبر</option>
                <option value="أبها">أبها</option>
                <option value="تبوك">تبوك</option>
                <option value="القصيم">القصيم</option>
                <option value="حائل">حائل</option>
                <option value="جازان">جازان</option>
              </select>
            </div>

          </div>
        </div>

        {/* SECTION 2: LANGUAGE & INTERFACE */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-[#8c5332]" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">لغة واجهة المنصة (Site Language)</h3>
              <p className="text-xs text-slate-500 font-medium">تحديد اللغة المفضلة للتصفح والعرض</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setSiteLanguage('ar')}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                siteLanguage === 'ar'
                  ? 'bg-[#8c5332]/5 border-[#8c5332] ring-1 ring-[#8c5332]'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="block text-xs font-extrabold text-slate-900">🇸🇦 اللغة العربية (Default)</span>
                <span className="text-[11px] text-slate-500 font-medium">واجهة عربية كاملة بتنسيق RTL</span>
              </div>
              {siteLanguage === 'ar' && <Check className="w-5 h-5 text-[#8c5332]" />}
            </button>

            <button
              type="button"
              onClick={() => setSiteLanguage('en')}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                siteLanguage === 'en'
                  ? 'bg-[#8c5332]/5 border-[#8c5332] ring-1 ring-[#8c5332]'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="block text-xs font-extrabold text-slate-900">🇬🇧 English Interface</span>
                <span className="text-[11px] text-slate-500 font-medium">Translate UI headings & elements</span>
              </div>
              {siteLanguage === 'en' && <Check className="w-5 h-5 text-[#8c5332]" />}
            </button>
          </div>
        </div>

        {/* SECTION 3: NOTIFICATIONS & PREFERENCES */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-[#8c5332]" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">تفضيلات الإشعارات والتنبيهات</h3>
              <p className="text-xs text-slate-500 font-medium">التحكم في رسائل وتنبيهات العروض والمقايضات</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">إشعارات عروض المقايضة الجديدة</span>
                <span className="text-[11px] text-slate-500 font-medium">تنبيه عند تقديم عرض مقايضة على إحدى سلعك</span>
              </div>
              <input
                type="checkbox"
                checked={notifyTradeOffers}
                onChange={(e) => setNotifyTradeOffers(e.target.checked)}
                className="w-4 h-4 accent-[#8c5332] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">تحديثات توثيق وتوقيع العقود</span>
                <span className="text-[11px] text-slate-500 font-medium">إشعار عند قبول العقد وتوقيعه إلكترونياً</span>
              </div>
              <input
                type="checkbox"
                checked={notifyContractUpdates}
                onChange={(e) => setNotifyContractUpdates(e.target.checked)}
                className="w-4 h-4 accent-[#8c5332] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: ACCOUNT SECURITY & BADGE */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">حالة توثيق الحساب والأمان</h3>
              <p className="text-xs text-slate-500 font-medium">توثيق الهوية والعقود الإلكترونية</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-emerald-900 block">حساب موثق ومحمّي برقم الهوية والجوال</span>
                <span className="text-[11px] text-emerald-700 font-medium">يحق لك إبرام وتوقيع عقود المقايضة الرسمية بالمنصة</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black shrink-0">
              نشط وموثق
            </span>
          </div>
        </div>

        {/* SAVE BUTTON BAR */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e8ded2]">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            إلغاء والعودة
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-2xl bg-[#8c5332] hover:bg-[#734123] text-white text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#8c5332]/20 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>حفظ جميع التعديلات والخيارات</span>
          </button>
        </div>

      </form>
    </div>
  );
};
