import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(3, "Mínimo de 3 caracteres"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Mínimo de 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas não correspondem",
    });

export type RegisterForm = z.infer<typeof registerSchema>;
