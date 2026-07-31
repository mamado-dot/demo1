import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Listing, User, Chat, ListingQuestion, SiteSettings, CustomPage, AdBanner } from '../types';
import { INITIAL_LISTINGS, MOCK_USERS } from '../data/mockData';

// 1. LISTINGS
export function subscribeToListings(callback: (listings: Listing[]) => void) {
  const listingsRef = collection(db, 'listings');
  
  return onSnapshot(listingsRef, async (snapshot) => {
    const dbListings: Listing[] = [];

    snapshot.forEach((docSnap) => {
      const id = docSnap.id;
      // Filter out demo listings if present in DB (e.g., listing_1, listing_2, etc.)
      if (id.startsWith('listing_') && (!isNaN(Number(id.replace('listing_', ''))) || id.length < 15)) {
        deleteDoc(doc(db, 'listings', id)).catch(() => {});
        return;
      }
      const data = { id, ...docSnap.data() } as Listing;
      dbListings.push(data);
    });

    // Sort by createdAt descending
    dbListings.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;
      return dateB - dateA;
    });

    callback(dbListings);
  }, (err) => {
    console.error("Listings listener error:", err);
    callback([]);
  });
}

export async function addListingToDb(listing: Omit<Listing, 'id'> | Listing) {
  if ('id' in listing && listing.id) {
    await setDoc(doc(db, 'listings', listing.id), listing);
    return listing.id;
  } else {
    const docRef = await addDoc(collection(db, 'listings'), listing);
    return docRef.id;
  }
}

export async function updateListingInDb(id: string, data: Partial<Listing>) {
  await updateDoc(doc(db, 'listings', id), data);
}

export async function deleteListingFromDb(id: string) {
  await deleteDoc(doc(db, 'listings', id));
}

export async function clearAllListingsFromDb() {
  try {
    const listingsRef = collection(db, 'listings');
    const snapshot = await getDocs(listingsRef);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, 'listings', docSnap.id)));
    await Promise.all(deletePromises);
  } catch (err) {
    console.error("Error clearing all listings:", err);
  }
}

export async function clearAllDemoDataFromDb() {
  try {
    // Clear all listings
    await clearAllListingsFromDb();

    // Clear demo users except owner
    const usersRef = collection(db, 'users');
    const userSnapshot = await getDocs(usersRef);
    const userDeletePromises = userSnapshot.docs.map((docSnap) => {
      const u = docSnap.data() as User;
      if (docSnap.id !== 'user_owner_crazyretiree' && u.email !== 'crazyretiree@gmail.com' && u.phone !== 'crazyretiree@gmail.com') {
        return deleteDoc(doc(db, 'users', docSnap.id));
      }
      return Promise.resolve();
    });
    await Promise.all(userDeletePromises);

    // Clear all chats
    const chatsRef = collection(db, 'chats');
    const chatSnapshot = await getDocs(chatsRef);
    const chatDeletePromises = chatSnapshot.docs.map((docSnap) => deleteDoc(doc(db, 'chats', docSnap.id)));
    await Promise.all(chatDeletePromises);

    // Clear all questions
    const qRef = collection(db, 'questions');
    const qSnapshot = await getDocs(qRef);
    const qDeletePromises = qSnapshot.docs.map((docSnap) => deleteDoc(doc(db, 'questions', docSnap.id)));
    await Promise.all(qDeletePromises);
  } catch (err) {
    console.error("Error clearing demo data:", err);
  }
}

// 2. USERS
export function subscribeToUsers(callback: (users: User[]) => void) {
  const usersRef = collection(db, 'users');
  return onSnapshot(usersRef, async (snapshot) => {
    // Always guarantee owner user exists in database
    const ownerUser: User = {
      id: 'user_owner_crazyretiree',
      name: 'مالك المنصة',
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

    const usersList: User[] = [];
    let foundOwner = false;

    snapshot.forEach((docSnap) => {
      const id = docSnap.id;
      // Clean demo users if present
      if (['user_admin', 'user_ahmed', 'user_sara', 'user_khaled', 'user_maryam', 'user_faisal', 'user_renad', 'user_mona', 'user_mohammed', 'user_omar', 'user_saud', 'user_huda'].includes(id) || id.startsWith('user_demo_')) {
        deleteDoc(doc(db, 'users', id)).catch(() => {});
        return;
      }
      const u = { id, ...docSnap.data() } as User;
      if (u.phone === 'crazyretiree@gmail.com' || u.email === 'crazyretiree@gmail.com' || u.id === ownerUser.id) {
        foundOwner = true;
        u.isAdmin = true; // Ensure admin privilege is attached
      }
      usersList.push(u);
    });

    if (!foundOwner) {
      try {
        await setDoc(doc(db, 'users', ownerUser.id), ownerUser);
        usersList.push(ownerUser);
      } catch (e) {
        console.error("Error adding owner user:", e);
      }
    }

    callback(usersList);
  }, (err) => {
    console.error("Users listener error:", err);
    callback([]);
  });
}

export async function saveUserToDb(user: User) {
  await setDoc(doc(db, 'users', user.id), user, { merge: true });
}

// 3. CHATS
export function subscribeToChats(callback: (chats: Chat[]) => void) {
  const chatsRef = collection(db, 'chats');
  return onSnapshot(chatsRef, (snapshot) => {
    const chatsList: Chat[] = [];
    snapshot.forEach((docSnap) => {
      chatsList.push({ id: docSnap.id, ...docSnap.data() } as Chat);
    });
    callback(chatsList);
  }, (err) => {
    console.error("Chats listener error:", err);
  });
}

export async function saveChatToDb(chat: Chat) {
  await setDoc(doc(db, 'chats', chat.id), chat, { merge: true });
}

// 4. QUESTIONS
export function subscribeToQuestions(callback: (questions: ListingQuestion[]) => void) {
  const questionsRef = collection(db, 'questions');
  return onSnapshot(questionsRef, (snapshot) => {
    const qList: ListingQuestion[] = [];
    snapshot.forEach((docSnap) => {
      qList.push({ id: docSnap.id, ...docSnap.data() } as ListingQuestion);
    });
    callback(qList);
  }, (err) => {
    console.error("Questions listener error:", err);
  });
}

export async function saveQuestionToDb(question: ListingQuestion) {
  await setDoc(doc(db, 'questions', question.id), question, { merge: true });
}

// 5. SITE & PLATFORM SETTINGS
export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void) {
  const docRef = doc(db, 'settings', 'general');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.siteSettings) {
        callback(data.siteSettings as SiteSettings);
      } else {
        callback(data as SiteSettings);
      }
    }
  }, (err) => {
    console.error("Settings listener error:", err);
  });
}

export function subscribeToPlatformSettings(callback: (settings: any) => void) {
  const docRef = doc(db, 'settings', 'general');
  return onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (err) => {
    console.error("Platform Settings listener error:", err);
  });
}

export async function saveSiteSettingsToDb(settings: SiteSettings) {
  await setDoc(doc(db, 'settings', 'general'), { siteSettings: settings }, { merge: true });
}

export async function savePlatformSettingsToDb(settingsData: any) {
  await setDoc(doc(db, 'settings', 'general'), settingsData, { merge: true });
}

