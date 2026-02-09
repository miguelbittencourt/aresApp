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

export interface Exercise {
    id: string;
    order_index: number;
    name: string;
    notes?: string;
    sets: ExerciseSet[];
}

export interface ExerciseSet {
    reps: number;
    weight: number;
    unit: "kg" | "lb";
}