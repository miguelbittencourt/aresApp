import { db } from '@/config/firebase';
import { CreateWorkoutDTO } from '@/DTOs/createWorkoutDTO';
import type { Workout } from '@/types/workout';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';

export async function getWorkouts(userId: string) {
    try {
        const workoutsRef = collection(db, "users", userId, "workouts");
        const q = query(workoutsRef, orderBy("created_at", "desc")); // ou "asc" para ordem crescente

        const querySnapshot = await getDocs(q);
        const workouts: Workout[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Workout));

        return workouts;
    } catch (e) {
        console.error("Error getting workouts: ", e);
        throw e;
    }
}

export async function getWorkoutById(userId: string, workoutId: string) {
    try {
        const docRef = doc(db, "users", userId, "workouts", workoutId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as Workout;
        } else {
            return null;
        }
    } catch (e) {
        console.error("Error getting workout by ID: ", e);
        throw e;
    }
}

export async function saveWorkout(
    userId: string,
    payload: CreateWorkoutDTO
) {
    const ref = collection(db, "users", userId, "workouts")

    await addDoc(ref, {
        ...payload,
        user_id: userId,
        created_at: serverTimestamp(),
    });
}

export async function updateWorkout(
    userId: string,
    workoutId: string,
    payload: CreateWorkoutDTO
) {
    const ref = doc(db, "users", userId, "workouts", workoutId);

    await updateDoc(ref, {
        ...payload,
        user_id: userId,
        updated_at: serverTimestamp(),
    });
}


export async function deleteWorkout(userId: string, workoutId: string) {
    try {
        await deleteDoc(doc(db, "users", userId, "workouts", workoutId));
    } catch (e) {
        console.error("Error deleting workout: ", e);
        throw e;
    }
}