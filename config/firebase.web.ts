import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBaM-hH2vIuwx1EoARAaUI6ra_xgwHSSC4",
    authDomain: "ares-855b3.firebaseapp.com",
    projectId: "ares-855b3",
    storageBucket: "ares-855b3.firebasestorage.app",
    messagingSenderId: "186192969212",
    appId: "1:186192969212:android:1af2fb657d9b1631364679",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
