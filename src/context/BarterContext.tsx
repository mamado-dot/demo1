import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  BarterItem, 
  TradeOffer, 
  BarterContract, 
  PlatformSettings, 
  CategoryItem, 
  ItemQuestion,
  TradeNegotiationMessage,
  UserReview
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ITEMS, 
  INITIAL_OFFERS, 
  INITIAL_CONTRACTS, 
  INITIAL_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_QUESTIONS,
  INITIAL_NEGOTIATIONS,
  INITIAL_REVIEWS
} from '../data/mockData';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

interface BarterContextType {
  // Auth / Active View State
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;

  // Data Collections
  items: BarterItem[];
  questions: ItemQuestion[];
  offers: TradeOffer[];
  negotiationMessages: TradeNegotiationMessage[];
  contracts: BarterContract[];
  reviews: UserReview[];
  settings: PlatformSettings;
  categories: CategoryItem[];

  // User Actions
  addItem: (newItemData: Omit<BarterItem, 'id' | 'ownerId' | 'status' | 'createdAt' | 'views' | 'likes'>) => BarterItem | undefined;
  updateItem: (id: string, updatedData: Partial<BarterItem>) => void;
  deleteItem: (id: string) => void;
  toggleItemLike: (id: string) => void;

  // Questions Actions
  addQuestion: (itemId: string, questionText: string) => void;
  answerQuestion: (questionId: string, answerText: string) => void;

  // Negotiation Actions
  addNegotiationMessage: (offerId: string, text: string) => void;

  // Trade Offers Actions
  createTradeOffer: (offerData: {
    targetItemId: string;
    offeredItemId: string;
    cashDifference: number;
    note: string;
    deliveryMethod: 'استلام يدوي' | 'شحن بريدي';
  }) => { success: boolean; message: string };
  
  respondToOffer: (offerId: string, action: 'accept' | 'reject' | 'cancel') => void;
  signContractAndFinalize: (offerId: string) => { contract: BarterContract | null; completed: boolean };

  // Review Actions
  addReview: (reviewData: Omit<UserReview, 'id' | 'createdAt'>) => void;
  adminDeleteReview: (reviewId: string) => void;
  adminUpdateReview: (reviewId: string, updatedData: Partial<UserReview>) => void;

  // Admin Actions
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  addCategory: (category: Omit<CategoryItem, 'id' | 'itemCount'>) => void;
  updateCategory: (id: string, category: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  adminDeleteContract: (id: string) => void;
  adminUpdateContract: (contractId: string, updatedData: Partial<BarterContract>) => void;
  adminUpdateUser: (userId: string, updatedData: Partial<User>) => void;
  adminDeleteUser: (userId: string) => void;
  adminAddUser: (userData: Omit<User, 'id'>) => void;
  updateUserProfile: (updatedData: Partial<User>) => void;

  // Favorites Actions
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;

  // Active UI Navigation state helpers
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCityFilter: string;
  setSelectedCityFilter: (city: string) => void;
}

const BarterContext = createContext<BarterContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'moqayada_v1_';

export const BarterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helper fallback
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
      if (!stored) return fallback;
      const parsed = JSON.parse(stored);
      if (key === 'settings' && parsed && typeof parsed === 'object') {
        if (parsed.heroImageUrl && (parsed.heroImageUrl.includes('unsplash') || parsed.heroImageUrl.includes('556742049'))) {
          parsed.heroImageUrl = '';
          try {
            localStorage.setItem(LOCAL_STORAGE_PREFIX + 'settings', JSON.stringify(parsed));
          } catch {}
        }
      }
      return parsed;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => getStored('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored<User | null>('currentUser', INITIAL_USERS[0]));
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const [items, setItems] = useState<BarterItem[]>(() => getStored('items', INITIAL_ITEMS));
  const [questions, setQuestions] = useState<ItemQuestion[]>(() => getStored('questions', INITIAL_QUESTIONS));
  const [offers, setOffers] = useState<TradeOffer[]>(() => getStored('offers', INITIAL_OFFERS));
  const [negotiationMessages, setNegotiationMessages] = useState<TradeNegotiationMessage[]>(() => getStored('negotiationMessages', INITIAL_NEGOTIATIONS));
  const [contracts, setContracts] = useState<BarterContract[]>(() => getStored('contracts', INITIAL_CONTRACTS));
  const [reviews, setReviews] = useState<UserReview[]>(() => getStored('reviews', INITIAL_REVIEWS));
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const loaded = getStored<PlatformSettings>('settings', INITIAL_SETTINGS);
    const heroUrl = loaded?.heroImageUrl;
    const isUnsplash = !heroUrl || heroUrl.includes('unsplash') || heroUrl.includes('556742049');
    return { ...INITIAL_SETTINGS, ...loaded, heroImageUrl: isUnsplash ? '' : heroUrl };
  });
  const [categories, setCategories] = useState<CategoryItem[]>(() => getStored('categories', INITIAL_CATEGORIES));
  const [favorites, setFavorites] = useState<string[]>(() => getStored('favorites', ['item_1', 'item_3']));

  // Filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('الكل');

  // Real-time Firestore Sync
  useEffect(() => {
    // 1. Items
    const unsubItems = onSnapshot(collection(db, 'items'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_ITEMS.forEach((it) => {
          setDoc(doc(db, 'items', it.id), it).catch(console.error);
        });
      } else {
        const fetched = snapshot.docs.map((d) => d.data() as BarterItem);
        setItems((prev) => {
          const itemMap = new Map<string, BarterItem>();
          prev.forEach((it) => itemMap.set(it.id, it));
          fetched.forEach((it) => itemMap.set(it.id, it));
          const list = Array.from(itemMap.values());
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          return list;
        });
      }
    }, (err) => console.error('Firestore items listener error:', err));

    // 2. Users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_USERS.forEach((u) => {
          setDoc(doc(db, 'users', u.id), u).catch(console.error);
        });
      } else {
        const fetched = snapshot.docs.map((d) => d.data() as User);
        setUsers((prev) => {
          const userMap = new Map<string, User>();
          prev.forEach((u) => userMap.set(u.id, u));
          fetched.forEach((u) => userMap.set(u.id, u));
          return Array.from(userMap.values());
        });
        if (currentUser) {
          const updatedCurrent = fetched.find((u) => u.id === currentUser.id);
          if (updatedCurrent) setCurrentUser(updatedCurrent);
        }
      }
    }, (err) => console.error('Firestore users listener error:', err));

    // 3. Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global_settings'), (docSnap) => {
      if (!docSnap.exists()) {
        setDoc(doc(db, 'settings', 'global_settings'), { ...INITIAL_SETTINGS, heroImageUrl: '' }).catch(console.error);
      } else {
        const data = docSnap.data() as PlatformSettings;
        const isUnsplash = Boolean(data.heroImageUrl && (data.heroImageUrl.includes('unsplash') || data.heroImageUrl.includes('556742049')));
        if (isUnsplash) {
          data.heroImageUrl = '';
          setDoc(doc(db, 'settings', 'global_settings'), { ...data, heroImageUrl: '' }).catch(console.error);
        }
        const cleanedSettings = { ...INITIAL_SETTINGS, ...data, heroImageUrl: isUnsplash ? '' : (data.heroImageUrl ?? '') };
        localStorage.setItem(LOCAL_STORAGE_PREFIX + 'settings', JSON.stringify(cleanedSettings));
        setSettings(cleanedSettings);
      }
    }, (err) => console.error('Firestore settings listener error:', err));

    // 4. Categories
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_CATEGORIES.forEach((c) => {
          setDoc(doc(db, 'categories', c.id), c).catch(console.error);
        });
      } else {
        const fetched = snapshot.docs.map((d) => d.data() as CategoryItem);
        setCategories(fetched);
      }
    }, (err) => console.error('Firestore categories listener error:', err));

    // 5. Questions
    const unsubQuestions = onSnapshot(collection(db, 'questions'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_QUESTIONS.forEach((q) => {
          setDoc(doc(db, 'questions', q.id), q).catch(console.error);
        });
      } else {
        const fetched = snapshot.docs.map((d) => d.data() as ItemQuestion);
        setQuestions(fetched);
      }
    }, (err) => console.error('Firestore questions listener error:', err));

    // 6. Offers
    const unsubOffers = onSnapshot(collection(db, 'offers'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_OFFERS.forEach((o) => {
          setDoc(doc(db, 'offers', o.id), o).catch(console.error);
        });
      } else {
        const fetched = snapshot.docs.map((d) => d.data() as TradeOffer);
        setOffers(fetched);
      }
    }, (err) => console.error('Firestore offers listener error:', err));

    // 7. Negotiation Messages
    const unsubNegotiations = onSnapshot(collection(db, 'negotiationMessages'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_NEGOTIATIONS.forEach((m) => {
          setDoc(doc(db, 'negotiationMessages', m.id), m).catch(console.error);
        });
      } else {
        const fetched = snapshot.docs.map((d) => d.data() as TradeNegotiationMessage);
        setNegotiationMessages(fetched);
      }
    }, (err) => console.error('Firestore negotiations listener error:', err));

    // 8. Contracts
    const unsubContracts = onSnapshot(collection(db, 'contracts'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_CONTRACTS.forEach((c) => {
          setDoc(doc(db, 'contracts', c.id), c).catch(console.error);
        });
      } else {
        const fetched = snapshot.docs.map((d) => d.data() as BarterContract);
        setContracts(fetched);
      }
    }, (err) => console.error('Firestore contracts listener error:', err));

    // 9. Reviews
    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_REVIEWS.forEach((r) => {
          setDoc(doc(db, 'reviews', r.id), r).catch(console.error);
        });
      } else {
        const fetched = snapshot.docs.map((d) => d.data() as UserReview);
        setReviews(fetched);
      }
    }, (err) => console.error('Firestore reviews listener error:', err));

    return () => {
      unsubItems();
      unsubUsers();
      unsubSettings();
      unsubCategories();
      unsubQuestions();
      unsubOffers();
      unsubNegotiations();
      unsubContracts();
      unsubReviews();
    };
  }, []);

  // Local Storage Backups for instant rendering on page refresh
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Actions with Firestore Sync
  const addItem = (newItemData: Omit<BarterItem, 'id' | 'ownerId' | 'status' | 'createdAt' | 'views' | 'likes'>): BarterItem | undefined => {
    if (!currentUser) return undefined;
    const newItem: BarterItem = {
      ...newItemData,
      id: 'item_' + Date.now(),
      ownerId: currentUser.id,
      status: 'active',
      createdAt: new Date().toISOString(),
      views: 1,
      likes: 0,
    };

    setItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);

    try {
      const stored = getStored<BarterItem[]>('items', INITIAL_ITEMS);
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'items', JSON.stringify([newItem, ...stored.filter((i) => i.id !== newItem.id)]));
    } catch (e) {
      // ignore local storage quota error if any
    }

    setDoc(doc(db, 'items', newItem.id), newItem).catch(console.error);

    // Update category item count
    const updatedCategory = categories.find((c) => c.name === newItemData.category);
    if (updatedCategory) {
      updateCategory(updatedCategory.id, { itemCount: updatedCategory.itemCount + 1 });
    }

    return newItem;
  };

  const updateItem = (id: string, updatedData: Partial<BarterItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    updateDoc(doc(db, 'items', id), updatedData).catch(console.error);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    deleteDoc(doc(db, 'items', id)).catch(console.error);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(itemId);
      if (isFav) {
        setItems((itemsPrev) =>
          itemsPrev.map((item) => {
            if (item.id === itemId) {
              const newLikes = Math.max(0, item.likes - 1);
              updateDoc(doc(db, 'items', itemId), { likes: newLikes }).catch(console.error);
              return { ...item, likes: newLikes };
            }
            return item;
          })
        );
        return prev.filter((id) => id !== itemId);
      } else {
        setItems((itemsPrev) =>
          itemsPrev.map((item) => {
            if (item.id === itemId) {
              const newLikes = item.likes + 1;
              updateDoc(doc(db, 'items', itemId), { likes: newLikes }).catch(console.error);
              return { ...item, likes: newLikes };
            }
            return item;
          })
        );
        return [...prev, itemId];
      }
    });
  };

  const isFavorite = (itemId: string) => {
    return favorites.includes(itemId);
  };

  const toggleItemLike = (id: string) => {
    toggleFavorite(id);
  };

  const addQuestion = (itemId: string, questionText: string) => {
    if (!currentUser) return;
    const newQ: ItemQuestion = {
      id: 'q_' + Date.now(),
      itemId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      question: questionText,
      createdAt: new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setQuestions((prev) => [newQ, ...prev]);
    setDoc(doc(db, 'questions', newQ.id), newQ).catch(console.error);
  };

  const answerQuestion = (questionId: string, answerText: string) => {
    const answeredAt = new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' });
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answer: answerText,
              answeredAt,
            }
          : q
      )
    );
    updateDoc(doc(db, 'questions', questionId), {
      answer: answerText,
      answeredAt
    }).catch(console.error);
  };

  const addNegotiationMessage = (offerId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const newMsg: TradeNegotiationMessage = {
      id: 'msg_' + Date.now(),
      offerId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setNegotiationMessages((prev) => [...prev, newMsg]);
    setDoc(doc(db, 'negotiationMessages', newMsg.id), newMsg).catch(console.error);
  };

  const createTradeOffer = (offerData: {
    targetItemId: string;
    offeredItemId: string;
    cashDifference: number;
    note: string;
    deliveryMethod: 'استلام يدوي' | 'شحن بريدي';
  }) => {
    if (!currentUser) {
      return { success: false, message: 'يرجى تسجيل الدخول أولاً لإرسال عرض مقايضة' };
    }
    const targetItem = items.find((i) => i.id === offerData.targetItemId);
    const offeredItem = items.find((i) => i.id === offerData.offeredItemId);

    if (!targetItem || !offeredItem) {
      return { success: false, message: 'السلعة غير متوفرة حالياً' };
    }

    if (offeredItem.ownerId !== currentUser.id) {
      return { success: false, message: 'يجب أن تكون السلعة المعروضة ملكاً لك' };
    }

    if (targetItem.ownerId === currentUser.id) {
      return { success: false, message: 'لا يمكنك تقديم عرض مقايضة على سلعتك الخاصة' };
    }

    const existing = offers.find(
      (o) =>
        o.targetItemId === offerData.targetItemId &&
        o.offeredByUserId === currentUser.id &&
        (o.status === 'pending' || o.status === 'accepted' || o.status === 'contract_pending')
    );

    if (existing) {
      return { success: false, message: 'لديك عرض مقايضة نشط سابق على هذه السلعة بالفعل' };
    }

    const newOffer: TradeOffer = {
      id: 'off_' + Date.now(),
      targetItemId: offerData.targetItemId,
      offeredItemId: offerData.offeredItemId,
      offeredByUserId: currentUser.id,
      targetOwnerUserId: targetItem.ownerId,
      cashDifference: offerData.cashDifference,
      note: offerData.note,
      status: 'pending',
      createdAt: new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
      deliveryMethod: offerData.deliveryMethod,
    };

    setOffers((prev) => [newOffer, ...prev]);
    setDoc(doc(db, 'offers', newOffer.id), newOffer).catch(console.error);

    const initialText = offerData.note && offerData.note.trim() !== '' 
      ? offerData.note 
      : `أهلاً بك! لقد أرسلت لك عرض مقايضة لـ (${offeredItem.title}) مقابل (${targetItem.title}). يسرني النقاش والتنسيق معك هنا.`;

    const initialMsg: TradeNegotiationMessage = {
      id: 'msg_' + Date.now(),
      offerId: newOffer.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: initialText,
      createdAt: newOffer.createdAt,
    };

    setNegotiationMessages((prev) => [...prev, initialMsg]);
    setDoc(doc(db, 'negotiationMessages', initialMsg.id), initialMsg).catch(console.error);

    return { success: true, message: 'تم إرسال عرض المقايضة بنجاح وبدء محادثة المفاوضة!' };
  };

  const respondToOffer = (offerId: string, action: 'accept' | 'reject' | 'cancel') => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        let updateObj: Partial<TradeOffer> = {};
        if (action === 'accept') {
          updateObj = { status: 'accepted', targetOwnerSigned: true };
        } else if (action === 'reject') {
          updateObj = { status: 'rejected' };
        } else if (action === 'cancel') {
          updateObj = { status: 'cancelled' };
        }
        updateDoc(doc(db, 'offers', offerId), updateObj).catch(console.error);
        return { ...o, ...updateObj };
      })
    );
  };

  const signContractAndFinalize = (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return { contract: null, completed: false };

    if (!currentUser) return { contract: null, completed: false };
    const isPartyA = offer.offeredByUserId === currentUser.id;
    const isPartyB = offer.targetOwnerUserId === currentUser.id;

    let updatedOffer = { ...offer };

    if (isPartyA) {
      updatedOffer.offeredBySigned = true;
    }
    if (isPartyB) {
      updatedOffer.targetOwnerSigned = true;
    }

    const targetItem = items.find((i) => i.id === offer.targetItemId);
    const offeredItem = items.find((i) => i.id === offer.offeredItemId);
    const partyAUser = users.find((u) => u.id === offer.offeredByUserId) || currentUser;
    const partyBUser = users.find((u) => u.id === offer.targetOwnerUserId) || currentUser;

    const bothSigned = updatedOffer.offeredBySigned && updatedOffer.targetOwnerSigned;

    if (bothSigned || (updatedOffer.status === 'accepted' && (isPartyA || isPartyB))) {
      updatedOffer.offeredBySigned = true;
      updatedOffer.targetOwnerSigned = true;
      updatedOffer.status = 'completed';

      const contractNumber = `BARTER-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const nowStr = new Date().toLocaleString('ar-SA', { dateStyle: 'long', timeStyle: 'short' });

      let cashPayerId: string | undefined = undefined;
      if (offer.cashDifference > 0) {
        cashPayerId = offer.offeredByUserId;
      } else if (offer.cashDifference < 0) {
        cashPayerId = offer.targetOwnerUserId;
      }

      const newContract: BarterContract = {
        id: 'cnt_' + Date.now(),
        contractNumber,
        offerId: offer.id,
        partyA: {
          userId: partyAUser.id,
          name: partyAUser.name,
          phone: partyAUser.phone,
          city: partyAUser.city,
          itemId: offeredItem?.id || '',
          itemTitle: offeredItem?.title || 'سلعة المقايِض الأول',
          itemEstimatedValue: offeredItem?.estimatedValue || 0,
          signatureDate: nowStr,
        },
        partyB: {
          userId: partyBUser.id,
          name: partyBUser.name,
          phone: partyBUser.phone,
          city: partyBUser.city,
          itemId: targetItem?.id || '',
          itemTitle: targetItem?.title || 'سلعة المقايِض الثاني',
          itemEstimatedValue: targetItem?.estimatedValue || 0,
          signatureDate: nowStr,
        },
        cashDifferenceAmount: Math.abs(offer.cashDifference),
        cashPayerUserId: cashPayerId,
        deliveryMethod: offer.deliveryMethod,
        termsAndConditions: [
          `تم توثيق اتفاقية المقايضة الإلكترونية برقم ${contractNumber} عبر منصة ${settings.siteName}.`,
          ...settings.customContractTerms,
          settings.enableInspectionGuarantee 
            ? `يسري ضمان المعاينة والفحص لمدة ${settings.inspectionDays} أيام من تاريخ استلام الطرفين للسلعتين.`
            : 'تتم المقايضة بحالتها المعروضة والمعاينة الفورية عند التسليم.',
        ],
        issuedAt: nowStr,
        qrCodeSeed: `MOQAYADA-E-CONTRACT-${contractNumber}`,
        status: 'نشط وموثق',
      };

      updatedOffer.contractId = newContract.id;

      setOffers((prev) => prev.map((o) => (o.id === offerId ? updatedOffer : o)));
      updateDoc(doc(db, 'offers', offerId), updatedOffer).catch(console.error);

      setContracts((prev) => [newContract, ...prev]);
      setDoc(doc(db, 'contracts', newContract.id), newContract).catch(console.error);

      setItems((prev) =>
        prev.map((i) => {
          if (i.id === targetItem?.id || i.id === offeredItem?.id) {
            updateDoc(doc(db, 'items', i.id), { status: 'bartered' }).catch(console.error);
            return { ...i, status: 'bartered' };
          }
          return i;
        })
      );

      return { contract: newContract, completed: true };
    } else {
      setOffers((prev) => prev.map((o) => (o.id === offerId ? updatedOffer : o)));
      updateDoc(doc(db, 'offers', offerId), updatedOffer).catch(console.error);
      return { contract: null, completed: false };
    }
  };

  const addReview = (reviewData: Omit<UserReview, 'id' | 'createdAt'>) => {
    const newReview: UserReview = {
      ...reviewData,
      id: 'rev_' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    
    setReviews((prev) => {
      const nextReviews = [newReview, ...prev];
      const userRevList = nextReviews.filter(r => r.targetUserId === reviewData.targetUserId);
      const sum = userRevList.reduce((acc, r) => acc + r.rating, 0);
      const newRating = userRevList.length > 0 ? Math.round((sum / userRevList.length) * 10) / 10 : 0;
      
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === reviewData.targetUserId ? { ...u, rating: newRating } : u))
      );
      updateDoc(doc(db, 'users', reviewData.targetUserId), { rating: newRating }).catch(console.error);
      return nextReviews;
    });

    setDoc(doc(db, 'reviews', newReview.id), newReview).catch(console.error);
  };

  const adminDeleteReview = (reviewId: string) => {
    setReviews((prev) => {
      const targetReview = prev.find(r => r.id === reviewId);
      const nextReviews = prev.filter((r) => r.id !== reviewId);
      if (targetReview) {
        const userRevList = nextReviews.filter(r => r.targetUserId === targetReview.targetUserId);
        const sum = userRevList.reduce((acc, r) => acc + r.rating, 0);
        const newRating = userRevList.length > 0 ? Math.round((sum / userRevList.length) * 10) / 10 : 0;
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === targetReview.targetUserId ? { ...u, rating: newRating } : u))
        );
        updateDoc(doc(db, 'users', targetReview.targetUserId), { rating: newRating }).catch(console.error);
      }
      return nextReviews;
    });
    deleteDoc(doc(db, 'reviews', reviewId)).catch(console.error);
  };

  const adminUpdateReview = (reviewId: string, updatedData: Partial<UserReview>) => {
    setReviews((prev) => {
      const nextReviews = prev.map((r) => (r.id === reviewId ? { ...r, ...updatedData } : r));
      const targetReview = nextReviews.find(r => r.id === reviewId);
      if (targetReview) {
        const userRevList = nextReviews.filter(r => r.targetUserId === targetReview.targetUserId);
        const sum = userRevList.reduce((acc, r) => acc + r.rating, 0);
        const newRating = userRevList.length > 0 ? Math.round((sum / userRevList.length) * 10) / 10 : 0;
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === targetReview.targetUserId ? { ...u, rating: newRating } : u))
        );
        updateDoc(doc(db, 'users', targetReview.targetUserId), { rating: newRating }).catch(console.error);
      }
      return nextReviews;
    });
    updateDoc(doc(db, 'reviews', reviewId), updatedData).catch(console.error);
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      setDoc(doc(db, 'settings', 'global_settings'), updated, { merge: true }).catch(console.error);
      return updated;
    });
  };

  const addCategory = (category: Omit<CategoryItem, 'id' | 'itemCount'>) => {
    const newCat: CategoryItem = {
      ...category,
      id: 'cat_' + Date.now(),
      itemCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    setDoc(doc(db, 'categories', newCat.id), newCat).catch(console.error);
  };

  const updateCategory = (id: string, updatedCat: Partial<CategoryItem>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedCat } : c)));
    updateDoc(doc(db, 'categories', id), updatedCat).catch(console.error);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteDoc(doc(db, 'categories', id)).catch(console.error);
  };

  const adminDeleteContract = (id: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
    deleteDoc(doc(db, 'contracts', id)).catch(console.error);
  };

  const adminUpdateContract = (contractId: string, updatedData: Partial<BarterContract>) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, ...updatedData } : c))
    );
    updateDoc(doc(db, 'contracts', contractId), updatedData).catch(console.error);
  };

  const adminUpdateUser = (userId: string, updatedData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updatedData };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    updateDoc(doc(db, 'users', userId), updatedData).catch(console.error);
  };

  const adminDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    deleteDoc(doc(db, 'users', userId)).catch(console.error);
  };

  const adminAddUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      rating: 0,
      completedBartersCount: 0,
      ...userData,
      id: 'usr_' + Date.now(),
    };
    setUsers((prev) => [...prev, newUser]);
    setDoc(doc(db, 'users', newUser.id), newUser).catch(console.error);
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers((all) => all.map((u) => (u.id === currentUser.id ? updated : u)));
    updateDoc(doc(db, 'users', currentUser.id), updatedData).catch(console.error);
  };

  return (
    <BarterContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        isAdminMode,
        setIsAdminMode,

        items,
        questions,
        offers,
        negotiationMessages,
        contracts,
        reviews,
        settings,
        categories,

        addItem,
        updateItem,
        deleteItem,
        toggleItemLike,

        favorites,
        toggleFavorite,
        isFavorite,

        addQuestion,
        answerQuestion,

        addNegotiationMessage,
        createTradeOffer,
        respondToOffer,
        signContractAndFinalize,

        addReview,
        adminDeleteReview,
        adminUpdateReview,

        updateSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        adminDeleteContract,
        adminUpdateContract,
        adminUpdateUser,
        adminDeleteUser,
        adminAddUser,
        updateUserProfile,

        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        selectedCityFilter,
        setSelectedCityFilter,
      }}
    >
      {children}
    </BarterContext.Provider>
  );
};

export const useBarter = () => {
  const context = useContext(BarterContext);
  if (!context) {
    throw new Error('useBarter must be used within a BarterProvider');
  }
  return context;
};
