import { z } from 'zod';

export const loginCredentialSchema = z.object({
    email: z.string(),
    password: z.string(),
})