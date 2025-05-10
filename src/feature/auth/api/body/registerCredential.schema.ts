import { z } from 'zod';

export const RegisterCredentialSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
})