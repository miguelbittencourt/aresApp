import { z } from "zod";

export const exerciseSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Nome do exercício é obrigatório"),
    weight: z.string().optional(),
    sets: z
        .string()
        .min(1, "Informe as séries")
        .refine((v) => !isNaN(Number(v)), "Séries inválidas"),
    reps: z
        .string()
        .min(1, "Informe as repetições")
        .refine((v) => !isNaN(Number(v)), "Repetições inválidas"),
    unit: z.enum(["kg", "lb"]),
    notes: z.string().optional(),
});

export const workoutSchema = z.object({
    gymName: z.string().min(1, "Nome da academia é obrigatório"),
    date: z.string(),
    exercises: z
        .array(exerciseSchema)
        .min(1)
        .refine(
            (arr) => arr.some((e) => e.name.trim() && e.reps.trim()),
            "Adicione pelo menos um exercício válido"
        ),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;
