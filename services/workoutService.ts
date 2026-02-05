import { db } from '@/config/firebase';
import type { CreateWorkoutDTO, Workout } from '@/types/workout';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

export async function getWorkouts(userId: string) {
    try {
        const querySnapshot = await getDocs(collection(db, "users", userId, "workouts"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
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
    workout: CreateWorkoutDTO
) {
    const newWorkout = {
        ...workout,
        created_at: Date.now(),
        updated_at: Date.now(),
        user_id: userId
    }

    try {
        const docRef = await addDoc(collection(db, "users", userId, "workouts"), newWorkout);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error saving workout: ", e);
        throw e;
    }
}

export async function updateWorkout(
    userId: string,
    workoutId: string,
    updatedWorkout: Partial<Omit<Workout, 'id' | 'user_id' | 'created_at'>>
): Promise<void> {
    try {
        const docRef = doc(db, "users", userId, "workouts", workoutId);

        await updateDoc(docRef, {
            ...updatedWorkout,
            updated_at: Date.now()
        });
    } catch (e) {
        console.error("Error updating workout: ", e);
        throw e;
    }
}

export async function deleteWorkout(userId: string, workoutId: string) {
    try {
        await deleteDoc(doc(db, "users", userId, "workouts", workoutId));
        console.log(`Workout with ID: ${workoutId} for user: ${userId} deleted.`);
    } catch (e) {
        console.error("Error deleting workout: ", e);
        throw e;
    }
}