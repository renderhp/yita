import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import type { Target } from "@/utils/model"

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
    const targetListSnap = await getDoc(targetListRef)

    if (targetListSnap.exists()) {
        const result = targetListSnap.data().targets.map((target: number) => {
            return {
                userID: target,
            } as Target
        });
        return result;
    } else {
        console.log(`Targets for ${apiKey} do not exist in the DB`)
        return [];
    }
}
