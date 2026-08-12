import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const config = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};
const firestoreDatabaseId = import.meta.env.VITE_FIRESTORE_DATABASE_ID;

const app = getApps().length > 0 ? getApp() : initializeApp(config);

// Pass custom databaseId if specified
export const db = firestoreDatabaseId && firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);

// Enable offline IndexedDB persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore offline persistence: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore offline persistence: Not supported by browser');
    }
  });
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithPopup(auth, googleProvider);
}

export async function logoutUser() {
  return await firebaseSignOut(auth);
}

export { onAuthStateChanged };
export type { User };
