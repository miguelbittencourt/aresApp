import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
});

export type LoginForm = z.infer<typeof loginSchema>;
