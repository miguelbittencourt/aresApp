import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAdqNw0BeWkvTB0028-Jn7cArnogh6Em4I",
    authDomain: "ares-855b3.firebaseapp.com",
    projectId: "ares-855b3",
    storageBucket: "ares-855b3.firebasestorage.app",
    messagingSenderId: "186192969212",
    appId: "1:186192969212:android:1af2fb657d9b1631364679"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);