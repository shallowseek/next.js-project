Excellent question!

When you use Zod's .safeParse() method, the result is always an object that looks like one of two possible shapes:
✅ 1. When validation succeeds:

{
  success: true,
  data: { ... } // your validated data
}

✅ Example:

const result = usernameQuerySchema.safeParse({ username: "john_doe" });
console.log(result);
/*
{
  success: true,
  data: {
    username: "john_doe"
  }
}
*/

❌ 2. When validation fails:

{
  success: false,
  error: ZodError
}

The error contains:

    issues: array of all validation errors

    format(): helpful structured error format (e.g., useful for forms)

    _errors: optional general errors (e.g. for .refine())

❌ Example:

const result = usernameQuerySchema.safeParse({ username: "john@" });
console.log(result);
/*
{
  success: false,
  error: ZodError {
    issues: [
      {
        code: "invalid_string",
        message: "Username can only contain letters, numbers, and underscores",
        path: ["username"]
      }
    ]
  }
}

And if you run:

console.log(result.error.format())

You'll get:

{
  username: {
    _errors: ["Username can only contain letters, numbers, and underscores"]
  }
}

🧠 Why Use safeParse?

    It never throws.

    You can easily handle both success and failure cases in one clean if-check:

const result = schema.safeParse(input);
if (!result.success) {
  const errors = result.error.format();
  // handle nicely
} else {
  const data = result.data;
  // use validated data
}

Let me know if you want me to show how to extract multiple field errors from a bigger schema!
