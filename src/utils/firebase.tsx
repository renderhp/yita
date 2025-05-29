import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import type { Player } from "./model";

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

const TARGETS_COLLECTION_NAME = "targets";
const TARGETS_FIELD_IN_DOCUMENT = "targets";

export async function getTargets(apiKey: string): Promise<Player[]> {
    if (!apiKey) {
        console.error("getTargets: apiKey is required.");
        return [];
    }
    try {
        const docRef = doc(db, TARGETS_COLLECTION_NAME, apiKey); // Use apiKey as document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && Array.isArray(data[TARGETS_FIELD_IN_DOCUMENT])) {
                return data[TARGETS_FIELD_IN_DOCUMENT] as Player[];
            } else {
                console.warn(`Field "${TARGETS_FIELD_IN_DOCUMENT}" not found or not an array for apiKey: ${apiKey}. Returning empty list.`);
                return [];
            }
        } else {
            // Document does not exist (e.g., new user or no targets saved yet)
            console.log(`No target document found for apiKey: ${apiKey}. A new one can be created upon saving targets.`);
            return [];
        }
    } catch (error) {
        console.error("Error fetching targets from Firestore:", error);
        return []; // Return empty array on error to prevent app crash
    }
}

export async function saveTargets(apiKey: string, targetsToSave: Player[]): Promise<void> {
    if (!apiKey) {
        console.error("saveTargets: apiKey is required.");
        throw new Error("API key is required to save targets.");
    }
    try {
        const docRef = doc(db, TARGETS_COLLECTION_NAME, apiKey); // Use apiKey as document ID
        await setDoc(docRef, { [TARGETS_FIELD_IN_DOCUMENT]: targetsToSave });
        console.log("Targets saved successfully for apiKey:", apiKey);
    } catch (error) {
        console.error("Error saving targets to Firestore:", error);
        throw error; // Re-throw to be handled by the calling component
    }
}