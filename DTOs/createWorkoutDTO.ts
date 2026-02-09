export interface SetDTO {
    reps: number;
    weight: number;
    unit: "kg" | "lb";
}

export interface ExerciseDTO {
    id: string;
    order_index: number;
    name: string;
    notes?: string;
    sets: SetDTO[];
}

export interface CreateWorkoutDTO {
    gym_name: string;
    date: string;
    exercises: ExerciseDTO[];
}
