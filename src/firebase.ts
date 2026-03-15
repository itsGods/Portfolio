import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Safely try to load the local config file. 
// This won't break the build on Netlify if the file is missing (because it's in .gitignore).
// In AI Studio, this will successfully load the local file.
const localConfigs = import.meta.glob('../firebase-applet-config.json', { eager: true });
const localConfig = (localConfigs['../firebase-applet-config.json'] as any)?.default || {};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId || "",
  firestoreDatabaseId: import.meta.env.VITE_FIRESTORE_DATABASE_ID || localConfig.firestoreDatabaseId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || localConfig.measurementId || ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
