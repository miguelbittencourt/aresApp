import { z } from "zod";

/* =========================
   Série
========================= */

export const setSchema = z.object({
    id: z.string(),
    reps: z
        .string()
        .min(1, "Obrigatório")
        .regex(/^\d+$/, "Apenas números"),
    weight: z
        .string()
        .min(1, "Obrigatório")
        .refine((val) => !val || /^[0-9.,\s]*(kg|lb|lbs)?$/i.test(val), {
            message: "Ex: 50kg, 20lb ou 0 se for sem peso",
        }),
    unit: z.enum(["kg", "lb"]),
});

/* =========================
   Exercício
========================= */

export const exerciseSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Nome é obrigatório"),
    notes: z.string().optional(),
    sets: z.array(setSchema).min(1, "Adicione ao menos uma série"),
});

/* =========================
   Treino
========================= */

export const workoutSchema = z.object({
    gymName: z.string().min(1, "Informe a academia"),
    date: z.string().min(1),
    exercises: z.array(exerciseSchema).min(1, "Adicione ao menos um exercício"),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;
