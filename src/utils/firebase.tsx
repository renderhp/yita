import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getTargets(apiKey: string) {
    const targetListRef = doc(db, "targets", apiKey)
    const targetListSnap = await getDoc(targetListRef) // eslint-disable-line @typescript-eslint/no-unused-vars
    return []
}
