import {z} from 'zod';

export const acceptMessageSchema = z.object({
    isAcceptedMessage: z.boolean()
})