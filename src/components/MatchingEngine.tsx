import React from 'react';
import { Sparkles, ArrowLeftRight, MessageSquare, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { Listing, User as UserType } from '../types';

interface MatchingEngineProps {
  currentUser: UserType | null;
  userListings: Listing[];
  allListings: Listing[];
  onInitiateSwap: (listing: Listing, systemMessage?: string) => void;
}

interface MatchResult {
  id: string;
  userListing: Listing;
  matchedListing: Listing;
  matchScore: number; // 0 to 100
  matchReason: string;
  isMutual: boolean;
}

export default function MatchingEngine({
  currentUser,
  userListings,
  allListings,
  onInitiateSwap,
}: MatchingEngineProps) {
  
  // Calculate matches dynamically
  const calculateMatches = (): MatchResult[] => {
    if (!currentUser || userListings.length === 0) return [];

    const activeUserListings = userListings.filter(l => l.status === 'نشط');
    const otherActiveListings = allListings.filter(
      l => l.ownerId !== currentUser.id && l.status === 'نشط'
    );

    const matches: MatchResult[] = [];

    activeUserListings.forEach(userList => {
      otherActiveListings.forEach(otherList => {
        let score = 0;
        let reason = '';
        let isMutual = false;

        // Clean and prepare texts for keyword checking
        const uTitle = userList.title.toLowerCase();
        const uWanted = userList.wantedInReturn.toLowerCase();
        const oTitle = otherList.title.toLowerCase();
        const oWanted = otherList.wantedInReturn.toLowerCase();

        // Check for pre-seeded 100% matches
        if (
          (userList.id === 'list_1' && otherList.id === 'list_5') || 
          (userList.id === 'list_5' && otherList.id === 'list_1')
        ) {
          score = 100;
          reason = 'تطابق كامل ومتبادل: أنت تقدم بلايستيشن وتبحث عن آيباد، وهو يقدم آيباد ويبحث عن بلايستيشن!';
          isMutual = true;
        } else if (
          (userList.id === 'list_2' && otherList.id === 'list_6') ||
          (userList.id === 'list_6' && otherList.id === 'list_2')
        ) {
          score = 100;
          reason = 'تطابق كامل ومتبادل: أنت تقدم خدمات تطوير ويب وتطلب هوية بصرية، وهو يقدم هوية بصرية ويطلب تطوير ويب!';
          isMutual = true;
        } else {
          // Dynamic text-based matching (Keyword match)
          const wordsUserWants = uWanted.split(/[\s،,أوو]+/).filter(w => w.length > 2);
          const wordsOtherOffers = oTitle.split(/[\s،,]+/).filter(w => w.length > 2);

          const wordsOtherWants = oWanted.split(/[\s،,أوو]+/).filter(w => w.length > 2);
          const wordsUserOffers = uTitle.split(/[\s،,]+/).filter(w => w.length > 2);

          // Count intersecting words
          const matchUserWants = wordsUserWants.filter(w => oTitle.includes(w) || otherList.category.toLowerCase().includes(w)).length;
          const matchOtherWants = wordsOtherWants.filter(w => uTitle.includes(w) || userList.category.toLowerCase().includes(w)).length;

          if (matchUserWants > 0 && matchOtherWants > 0) {
            score = 95;
            reason = 'تطابق ذكي متقدم: تداخل كبير بين السلع المطلوبة والمعروضة للطرفين!';
            isMutual = true;
          } else if (matchUserWants > 0) {
            score = 75;
            reason = `تطابق رغباتك: الطرف الآخر يعرض "${otherList.title}" التي تطابق بحثك عن "${userList.wantedInReturn}".`;
            isMutual = false;
          } else if (matchOtherWants > 0) {
            score = 65;
            reason = `تطابق رغبات الطرف الآخر: أنت تعرض سلعة يريدها ولكنه قد لا يملك السلعة التي تطلبها بالظبط.`;
            isMutual = false;
          } else if (userList.category === otherList.category && userList.city === otherList.city) {
            score = 45;
            reason = `مجاورة جغرافية وفئوية: كلاكما في مدينة "${userList.city}" وضمن فئة "${userList.category}".`;
            isMutual = false;
          }
        }

        if (score >= 40) {
          matches.push({
            id: `${userList.id}_${otherList.id}`,
            userListing: userList,
            matchedListing: otherList,
            matchScore: score,
            matchReason: reason,
            isMutual,
          });
        }
      });
    });

    // Sort by score descending
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  };

  const matches = calculateMatches();

  return (
    <div id="matching_engine_section" className="space-y-6">
      
      {/* Introduction Banner */}
      <div className="bg-linear-to-r from-purple-900 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white text-right relative overflow-hidden shadow-lg" id="matches_intro_banner">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <span className="bg-purple-500/30 text-purple-200 border border-purple-400/20 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 space-x-reverse mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>محرك بادل للذكاء الاصطناعي</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">لوحة المطابقة الذكية</h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
            يقوم نظامنا بتحليل عروضك النشطة ومقارنتها فوراً بمتطلبات آلاف المستخدمين الآخرين ليعثر لك على فرص مقايضة متبادلة (سلعة مقابل سلعة) في مدينتك دون أي تكاليف مالية!
          </p>
        </div>
      </div>

      {/* Main Matching Logic Grid */}
      {!currentUser ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 text-sm" id="matching_guest_state">
          يرجى تسجيل الدخول لعرض فرص المطابقة الخاصة بك.
        </div>
      ) : userListings.filter(l => l.status === 'نشط').length === 0 ? (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-right flex items-start space-x-3 space-x-reverse" id="matching_no_listings">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">لم تقم بإضافة أي عروض بعد!</h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              محرك المطابقة يحتاج إلى وجود عرض نشط واحد على الأقل في حسابك لكي يطابق رغباتك مع رغبات الآخرين. اضغط على "أضف عرضاً" لعرض ما لديك الآن وبدء البحث الذكي.
            </p>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 text-sm flex flex-col items-center space-y-3" id="matching_empty_state">
          <Zap className="w-8 h-8 text-purple-400 animate-pulse" />
          <p className="font-bold text-gray-800 text-sm">البحث جارٍ عن صفقات مطابقة...</p>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            حالياً لم يتم العثور على عروض تتقاطع بنسبة عالية مع متطلباتك. سنقوم بإرسال إشعار فوري لك فور قيام أي مستخدم بإضافة عرض يناسب رغباتك!
          </p>
        </div>
      ) : (
        <div className="space-y-4" id="matching_results_list">
          <h3 className="font-extrabold text-gray-900 text-base text-right px-1">فرص المقايضة النشطة المكتشفة ({matches.length})</h3>
          
          {matches.map((match) => (
            <div 
              key={match.id}
              id={`match_card_${match.id}`}
              className={`border rounded-2xl p-5 bg-white transition-all duration-200 text-right ${
                match.isMutual 
                  ? 'border-purple-200 ring-4 ring-purple-500/5 hover:shadow-lg' 
                  : 'border-gray-100 hover:shadow-md'
              }`}
            >
              {/* Header: Score and Mutual Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-50 pb-4 mb-4">
                <div className="flex items-center space-x-2 space-x-reverse justify-end order-1 sm:order-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 space-x-reverse ${
                    match.isMutual 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Zap className="w-3 h-3 text-purple-600 fill-purple-600 animate-bounce" />
                    <span>تطابق بنسبة {match.matchScore}%</span>
                  </span>
                  
                  {match.isMutual && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      مقايضة متبادلة مؤكدة ✨
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 space-x-reverse order-2 sm:order-1" id={`match_owner_${match.id}`}>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{match.matchedListing.ownerName}</h4>
                    <span className="text-[10px] text-gray-400">مستوى موثوقية: {match.matchedListing.ownerReliability}</span>
                  </div>
                </div>
              </div>

              {/* Match Explanation */}
              <div className="bg-purple-50/50 border border-purple-100/30 rounded-xl p-3 mb-4 text-xs font-semibold text-purple-950 flex items-start space-x-2 space-x-reverse">
                <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <p className="leading-relaxed">{match.matchReason}</p>
              </div>

              {/* The Two Listings Side-by-Side (Comparison) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch mb-5" id={`match_comparison_${match.id}`}>
                
                {/* Your listing */}
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">ما تعرضه أنت:</span>
                    <h5 className="font-bold text-gray-900 text-xs sm:text-sm">{match.userListing.title}</h5>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-lg p-2.5 mt-2.5 text-right">
                    <span className="text-[9px] font-bold text-gray-400 block">وتبحث عن:</span>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">{match.userListing.wantedInReturn}</p>
                  </div>
                </div>

                {/* Match indicator separator for desktop */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 self-center bg-purple-600 text-white rounded-full p-1.5 shadow-md border-4 border-white z-10">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </div>

                {/* Their listing */}
                <div className="bg-purple-50/20 rounded-xl p-4 border border-purple-100/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 block mb-1">ما يعرضه {match.matchedListing.ownerName}:</span>
                    <h5 className="font-bold text-purple-950 text-xs sm:text-sm">{match.matchedListing.title}</h5>
                  </div>
                  <div className="bg-white border border-purple-100/10 rounded-lg p-2.5 mt-2.5 text-right">
                    <span className="text-[9px] font-bold text-purple-400 block">ويبحث عن:</span>
                    <p className="text-xs text-purple-950 font-medium leading-relaxed">{match.matchedListing.wantedInReturn}</p>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 space-x-reverse" id={`match_actions_${match.id}`}>
                <button
                  onClick={() => onInitiateSwap(
                    match.matchedListing, 
                    `أهلاً! تم اكتشاف تطابق ذكي بين عرضي "${match.userListing.title}" وعرضك "${match.matchedListing.title}". هل يناسبك إجراء المقايضة؟`
                  )}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-purple-100 flex items-center space-x-1.5 space-x-reverse"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>بدء التفاوض والمراسلة</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
