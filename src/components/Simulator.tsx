import React, { useState } from 'react';
import { Play, Sparkles, MessageSquare, AlertCircle, Bell, ChevronDown, ChevronUp, X, Edit3 } from 'lucide-react';

interface SimulatorProps {
  onSimulateMessage: (senderId: string, text: string, listingTitle: string, userListingId: string) => void;
  onSimulateNotification: (title: string, description: string, type: 'message' | 'offer' | 'match' | 'rating') => void;
  onSimulateNewListing: () => void;
  hasActiveListings: boolean;
  onClose: () => void;
  platformSlogan: string;
  setPlatformSlogan: (v: string) => void;
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
}

export default function Simulator({
  onSimulateMessage,
  onSimulateNotification,
  onSimulateNewListing,
  hasActiveListings,
  onClose,
  platformSlogan,
  setPlatformSlogan,
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
}: SimulatorProps) {
  const [isOpen, setIsOpen] = useState(false); // Default to collapsed to avoid cluttering and distracting the user
  const [showConfigTab, setShowConfigTab] = useState(false); // Collapsible tab for layout content edits

  return (
    <div 
      id="simulation_dashboard" 
      className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-800 z-50 overflow-hidden transition-all duration-300"
    >
      {/* Header bar - click to collapse */}
      <div 
        className="px-4 py-3 bg-gray-950 flex justify-between items-center select-none border-b border-gray-850"
      >
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 space-x-reverse text-emerald-400 cursor-pointer flex-1"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-black tracking-wide">لوحة المحاكاة التجريبية (MVP)</span>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-850 rounded-lg text-gray-400 hover:text-white transition-colors"
            title={isOpen ? "تصغير" : "توسيع"}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={onClose}
            className="p-1 hover:bg-red-950/50 rounded-lg text-gray-400 hover:text-red-400 transition-colors border border-gray-800"
            title="إغلاق لوحة المحاكاة نهائياً"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-3.5 text-right" style={{ direction: 'rtl' }}>
          
          <p className="text-[10px] text-gray-400 leading-relaxed">
            استخدم هذه السيناريوهات السريعة لمحاكاة تجاوب المستخدمين الآخرين والنظام التلقائي لاختبار كامل وظائف منصة المقايضة (شات، تطابق ذكي، إشعارات، تقييم).
          </p>

          <div className="space-y-2" id="simulator_actions_list">
            
            {/* Scenario 1: Simulate Incoming Swap Proposal */}
            <button
              id="btn_sim_prop"
              onClick={() => {
                onSimulateNotification(
                  'عرض مقايضة جديد! 🤝',
                  'أرسل لك أحمد العتيبي عرض مقايضة رسمي: "بلايستيشن 5 برو" مقابل "آيباد برو M2" الخاص بك.',
                  'offer'
                );
                onSimulateMessage(
                  'user_ahmed',
                  'يا هلا والله! شفت جهازك الآيباد وأعجبني جداً، وش رأيك نقايضه بالبلايستيشن 5 برو حقي؟ الجهاز شبه جديد وبكامل ملحقاته وضمانه ساري. إذا يناسبك علمنا نتقابل بالرياض اليوم ونخلص التبادل.',
                  'آيباد برو 11 بوصة M2 مساحة 256 جيجا',
                  'list_5'
                );
              }}
              className="w-full bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-900 text-emerald-300 text-xs py-2 px-3 rounded-xl font-bold transition-all duration-150 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>محاكاة: عرض مقايضة وارد من (أحمد)</span>
              </div>
              <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-[-2px] transition-transform" />
            </button>

            {/* Scenario 2: Simulate Chat Message from Sara */}
            <button
              id="btn_sim_msg"
              onClick={() => {
                onSimulateNotification(
                  'رسالة جديدة من سارة الأحمد 💬',
                  'بخصوص عرضك: "تطوير موقع تعريفي كامل باستخدام React & Tailwind". "أهلاً بك! تواصلت معك..."',
                  'message'
                );
                onSimulateMessage(
                  'user_sara',
                  'أهلاً ومرحباً بك! تواصلت معك بخصوص خدمات البرمجة التي تعرضها. أنا جاهزة لتصميم هوية بصرية كاملة وعلامة تجارية احترافية لمشروعك مقابل برمجة موقعي التعريفي. تفضل بزيارة معرض أعمالي وأخبرني إن كنت موافقاً لبدء الاتفاق.',
                  'تصميم هوية بصرية متكاملة وعلامة تجارية',
                  'list_6'
                );
              }}
              className="w-full bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-900 text-indigo-300 text-xs py-2 px-3 rounded-xl font-bold transition-all duration-150 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <span>محاكاة: رسالة شات واردة من (سارة)</span>
              </div>
              <Play className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-[-2px] transition-transform" />
            </button>

            {/* Scenario 3: Simulate Smart Match Notification */}
            <button
              id="btn_sim_match"
              disabled={!hasActiveListings}
              onClick={() => {
                onSimulateNotification(
                  '💡 تم العثور على تطابق ذكي جديد!',
                  'هناك مستخدم في مدينتك يعرض سبيكر بلوتوث ذكي ويبحث بالضبط عن الكتب التعليمية التي قمت بنشرها. بادر بالمراسلة الآن لمقايضة ناجحة!',
                  'match'
                );
              }}
              className={`w-full text-xs py-2 px-3 rounded-xl font-bold transition-all duration-150 flex items-center justify-between group border ${
                hasActiveListings
                  ? 'bg-purple-950/40 hover:bg-purple-900/40 border-purple-900 text-purple-300'
                  : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>محاكاة: تنبيه تطابق ذكي تلقائي بقربك</span>
              </div>
              <Play className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-[-2px] transition-transform" />
            </button>

          </div>

          {!hasActiveListings && (
            <div className="flex items-start space-x-1.5 space-x-reverse text-[9px] text-amber-400/90 bg-amber-950/20 p-2 rounded-lg border border-amber-900/30">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <p>تنبيه: محاكاة التطابق الذكي تتطلب أن يكون لديك عرض مقايضة نشط في ملفك الشخصي لتتم مقارنته.</p>
            </div>
          )}

          {/* Landing Editor Section Toggle Button */}
          <div className="pt-2 border-t border-gray-800">
            <button
              onClick={() => setShowConfigTab(!showConfigTab)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-gray-350 hover:text-white bg-gray-850 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <Edit3 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>لوحة التحكم: تعديل نصوص الصفحة الرئيسية</span>
              </div>
              {showConfigTab ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showConfigTab && (
            <div className="space-y-3 bg-gray-950/50 p-3 rounded-xl border border-gray-850 max-h-72 overflow-y-auto text-right text-xs">
              
              {/* Slogan */}
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-bold">جملة المنصة التعريفية (Slogan):</label>
                <textarea
                  value={platformSlogan}
                  onChange={(e) => setPlatformSlogan(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2 text-xs text-white text-right focus:outline-none focus:border-emerald-500"
                  rows={2}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="block text-[10px] text-gray-400 font-bold">رابط صورة المقايضة (Image URL):</label>
                <input
                  type="text"
                  value={platformImageUrl}
                  onChange={(e) => setPlatformImageUrl(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2 text-xs text-white text-right focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="border-t border-gray-850 my-2 pt-2 font-black text-emerald-400 text-[10px]">
                الخانات الثلاث الرئيسية:
              </div>

              {/* Feature 1 */}
              <div className="space-y-1.5 border-b border-gray-850 pb-2">
                <label className="block text-[10px] text-gray-400 font-bold">الخانة 1: مقايضة مباشر</label>
                <input
                  type="text"
                  value={feature1Title}
                  onChange={(e) => setFeature1Title(e.target.value)}
                  placeholder="العنوان"
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-1.5 text-xs text-white text-right focus:outline-none focus:border-emerald-500"
                />
                <textarea
                  value={feature1Desc}
                  onChange={(e) => setFeature1Desc(e.target.value)}
                  placeholder="الوصف"
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-1.5 text-xs text-white text-right focus:outline-none focus:border-emerald-500"
                  rows={1.5}
                />
              </div>

              {/* Feature 2 */}
              <div className="space-y-1.5 border-b border-gray-850 pb-2">
                <label className="block text-[10px] text-gray-400 font-bold">الخانة 2: محادثات فورية</label>
                <input
                  type="text"
                  value={feature2Title}
                  onChange={(e) => setFeature2Title(e.target.value)}
                  placeholder="العنوان"
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-1.5 text-xs text-white text-right focus:outline-none focus:border-emerald-500"
                />
                <textarea
                  value={feature2Desc}
                  onChange={(e) => setFeature2Desc(e.target.value)}
                  placeholder="الوصف"
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-1.5 text-xs text-white text-right focus:outline-none focus:border-emerald-500"
                  rows={1.5}
                />
              </div>

              {/* Feature 3 */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-400 font-bold">الخانة 3: توثيق الهوية</label>
                <input
                  type="text"
                  value={feature3Title}
                  onChange={(e) => setFeature3Title(e.target.value)}
                  placeholder="العنوان"
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-1.5 text-xs text-white text-right focus:outline-none focus:border-emerald-500"
                />
                <textarea
                  value={feature3Desc}
                  onChange={(e) => setFeature3Desc(e.target.value)}
                  placeholder="الوصف"
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-1.5 text-xs text-white text-right focus:outline-none focus:border-emerald-500"
                  rows={1.5}
                />
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
