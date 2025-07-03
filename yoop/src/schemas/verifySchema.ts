import {z} from 'zod';



export const verifySchema = z.object({
  code: z.string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d+$/, "Verification code must contain only digits")
})

    // This is ideal if the input comes from a text field, since form input values are strings by default.