import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import defaultConfig from '../../firebase-applet-config.json';

const activeConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig?.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig?.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig?.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig?.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig?.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig?.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || defaultConfig?.firestoreDatabaseId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);

export const db = activeConfig.firestoreDatabaseId 
  ? getFirestore(app, activeConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'general'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase connection warning: Check domain authorization or network config.", error);
    }
  }
}
testConnection();

export default app;
