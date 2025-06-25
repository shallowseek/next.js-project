import {z} from 'zod';

export const usernameValidation = z.string().min(1, 'Username is required').max(20, 'Username must be at most 20 characters long')
.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: usernameValidation,
  email: z.string().email('Invalid email address').regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Email must be a valid email address'
  ),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  
})
