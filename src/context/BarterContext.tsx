import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  BarterItem, 
  TradeOffer, 
  BarterContract, 
  PlatformSettings, 
  CategoryItem, 
  ItemQuestion,
  CategoryName,
  ItemCondition,
  OfferStatus,
  TradeNegotiationMessage
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ITEMS, 
  INITIAL_OFFERS, 
  INITIAL_CONTRACTS, 
  INITIAL_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_QUESTIONS,
  INITIAL_NEGOTIATIONS
} from '../data/mockData';

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
  settings: PlatformSettings;
  categories: CategoryItem[];

  // User Actions
  addItem: (newItemData: Omit<BarterItem, 'id' | 'ownerId' | 'status' | 'createdAt' | 'views' | 'likes'>) => void;
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
  // Helper to read from local storage or fallback
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
      if (!stored) return fallback;
      const parsed = JSON.parse(stored);
      if (key === 'settings') {
        return { ...INITIAL_SETTINGS, ...parsed };
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
  const [settings, setSettings] = useState<PlatformSettings>(() => getStored('settings', INITIAL_SETTINGS));
  const [categories, setCategories] = useState<CategoryItem[]>(() => getStored('categories', INITIAL_CATEGORIES));
  const [favorites, setFavorites] = useState<string[]>(() => getStored('favorites', ['item_1', 'item_3']));

  // Filters
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('الكل');

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'negotiationMessages', JSON.stringify(negotiationMessages));
  }, [negotiationMessages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'categories', JSON.stringify(categories));
  }, [categories]);

  // Actions
  const addItem = (newItemData: Omit<BarterItem, 'id' | 'ownerId' | 'status' | 'createdAt' | 'views' | 'likes'>) => {
    if (!currentUser) return;
    const newItem: BarterItem = {
      ...newItemData,
      id: 'item_' + Date.now(),
      ownerId: currentUser.id,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
      likes: 0,
    };

    setItems((prev) => [newItem, ...prev]);

    // Update category item count
    setCategories((prev) =>
      prev.map((c) => (c.name === newItemData.category ? { ...c, itemCount: c.itemCount + 1 } : c))
    );
  };

  const updateItem = (id: string, updatedData: Partial<BarterItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(itemId);
      if (isFav) {
        setItems((itemsPrev) =>
          itemsPrev.map((item) => (item.id === itemId ? { ...item, likes: Math.max(0, item.likes - 1) } : item))
        );
        return prev.filter((id) => id !== itemId);
      } else {
        setItems((itemsPrev) =>
          itemsPrev.map((item) => (item.id === itemId ? { ...item, likes: item.likes + 1 } : item))
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
  };

  const answerQuestion = (questionId: string, answerText: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answer: answerText,
              answeredAt: new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
            }
          : q
      )
    );
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

    // Check existing active offer
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

    // Create initial negotiation message automatically
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

    return { success: true, message: 'تم إرسال عرض المقايضة بنجاح وبدء محادثة المفاوضة!' };
  };

  const respondToOffer = (offerId: string, action: 'accept' | 'reject' | 'cancel') => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        if (action === 'accept') {
          return { ...o, status: 'accepted', targetOwnerSigned: true };
        }
        if (action === 'reject') {
          return { ...o, status: 'rejected' };
        }
        if (action === 'cancel') {
          return { ...o, status: 'cancelled' };
        }
        return o;
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

    // If both signed (or if one party signs after accept)
    const bothSigned = updatedOffer.offeredBySigned && updatedOffer.targetOwnerSigned;

    if (bothSigned || (updatedOffer.status === 'accepted' && (isPartyA || isPartyB))) {
      updatedOffer.offeredBySigned = true;
      updatedOffer.targetOwnerSigned = true;
      updatedOffer.status = 'completed';

      // Generate E-Contract
      const contractNumber = `BARTER-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const nowStr = new Date().toLocaleString('ar-SA', { dateStyle: 'long', timeStyle: 'short' });

      // Calculate cash payer
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

      // Update offer in state
      setOffers((prev) => prev.map((o) => (o.id === offerId ? updatedOffer : o)));

      // Add Contract
      setContracts((prev) => [newContract, ...prev]);

      // Update Items status to bartered
      setItems((prev) =>
        prev.map((i) => {
          if (i.id === targetItem?.id || i.id === offeredItem?.id) {
            return { ...i, status: 'bartered' };
          }
          return i;
        })
      );

      return { contract: newContract, completed: true };
    } else {
      setOffers((prev) => prev.map((o) => (o.id === offerId ? updatedOffer : o)));
      return { contract: null, completed: false };
    }
  };

  // Admin Actions
  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addCategory = (category: Omit<CategoryItem, 'id' | 'itemCount'>) => {
    const newCat: CategoryItem = {
      ...category,
      id: 'cat_' + Date.now(),
      itemCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, updatedCat: Partial<CategoryItem>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedCat } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const adminDeleteContract = (id: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
  };

  const adminUpdateContract = (contractId: string, updatedData: Partial<BarterContract>) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, ...updatedData } : c))
    );
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
  };

  const adminDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const adminAddUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: 'usr_' + Date.now(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      setUsers((all) => all.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
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
