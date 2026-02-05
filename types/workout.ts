// export interface Set {
//     weight: number;
//     reps: number;
//     unit: string;
// }

export interface Exercise {
    id: string;
    name: string;
    weight: number;
    unit: string;
    reps: number;
    notes?: string;
    order_index: number;
}

export interface Workout {
    id: string;
    user_id: string;
    date: string;
    gym_name: string;
    raw_text?: string;
    exercises: Exercise[];
    created_at: number;
    updated_at: number;
}

export type CreateWorkoutDTO = {
    gym_name: string;
    date: string;
    exercises: Exercise[];
    raw_text?: string;
};