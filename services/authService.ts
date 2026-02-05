import { auth } from '@/config/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from 'firebase/auth';

export async function signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (displayName) {
            await updateProfile(user, {
                displayName: displayName
            });
        }

        return user;
    } catch (e) {
        console.error("Error signing up: ", e);
        throw e;
    }
}

export async function signIn(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (e) {
        console.error("Error signing in: ", e);
        throw e;
    }
}

export async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (e) {
        console.error("Error signing out: ", e);
        throw e;
    }
}

export function getCurrentUser(): User | null {
    return auth.currentUser;
}