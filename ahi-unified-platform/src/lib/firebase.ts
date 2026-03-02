import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase client-side initialization.
 * Los valores NEXT_PUBLIC_* se inyectan en apphosting.yaml (runtime)
 * o como secrets en GitHub Actions (CI). Fallbacks garantizan build limpio.
 */
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    'AIzaSyDummyKeyForBuildTimeOnly12345',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    'kintsugnosis-ahi.firebaseapp.com',
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    'kintsugnosis-ahi',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    'kintsugnosis-ahi.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    '000000000000',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    '1:000000000000:web:000000000000000000000000',
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Evita "Firebase: Firebase App named '[DEFAULT]' already exists" en HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
