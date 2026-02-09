import { LocalExercise } from "@/components/ExerciseCard";
import { WorkoutFormValues } from "@/schemas/workoutSchema";
import { Workout } from "@/types/workout";

/* ============================
   Datas
============================ */

export function getLocalDateISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* ============================
   Peso
============================ */

export function parseWeight(input: string) {
    if (!input || input.trim() === "") {
        return { value: 0, unit: "kg" as "kg" | "lb" };
    }

    const clean = input.toLowerCase().replace(",", ".").trim();
    const match = clean.match(/^([\d.]+)\s*(kg|kgs|lb|lbs)?$/);

    if (!match) {
        return { value: 0, unit: "kg" as "kg" | "lb" };
    }

    const value = parseFloat(match[1]);
    const unit = match[2]?.startsWith("l") ? "lb" : "kg";

    return { value: isNaN(value) ? 0 : value, unit: unit as "kg" | "lb" };
}

export function normalizeWeightToKg(input: string) {
    const { value, unit } = parseWeight(input);
    return unit === "lb" ? value * 0.453592 : value;
}

/* ============================
   Utils
============================ */

export function generateId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ============================
   Local models
============================ */

export function createEmptySet() {
    return {
        id: generateId(),
        reps: "",
        weight: "",
        unit: "kg" as const,
    };
}

export function createEmptyExercise() {
    return {
        id: generateId(),
        name: "",
        notes: "",
        sets: [createEmptySet()], // 🔥 ESSENCIAL
    };
}


/* ============================
   Remove → Undo
============================ */

export function toLocalExercise(e: LocalExercise): LocalExercise {
    return {
        id: e.id,
        name: e.name,
        notes: e.notes ?? "",
        sets: e.sets.map((s) => ({
            id: s.id,
            reps: s.reps,
            weight: s.weight,
            unit: s.unit,
        })),
    };
}

/* ============================
   Edit mode (Workout → Form)
============================ */

export function workoutToFormValues(workout: Workout): WorkoutFormValues {
    return {
        gymName: workout.gym_name,
        date: workout.date,
        exercises: workout.exercises.map((e) => ({
            id: e.id,
            name: e.name ?? "",
            notes: e.notes ?? "",
            sets: e.sets.map((s, index) => ({
                id: `${e.id}-${index}`,
                reps: String(s.reps),
                weight: String(s.weight),
                unit: "kg",
            })),
        })),
    };
}
