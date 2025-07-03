import {z} from 'zod';

export const MessageSchema = z.object({
    content: z
        .string() //z.string() - Validates that the value is a string
        .min(10, "Content must be at least 10 characters")
        // Schema for validating JavaScript string
})