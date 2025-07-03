what does data containing form values of different form fields look like when send to submithandle
ChatGPT said:

When you use react-hook-form with a schema like this:

const form = useForm<z.infer<typeof signUpSchema>>({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    name: '',
    username: '',
    email: '',
    password: '',
  },
});

And you define your signUpSchema like:

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

Then inside the handleSubmit(onSubmit) callback, the data you receive looks like a plain JavaScript object with all the field values as strings:
✅ Example:

If a user submits this form:

    Name: Jatin

    Username: jatin_123

    Email: jatin@example.com

    Password: mypassword

data in onSubmit will look like:

{
  name: "Jatin",
  username: "jatin_123",
  email: "jatin@example.com",
  password: "mypassword"
}

Each key matches a name defined in your form schema and corresponds to the form field.

If you log it:

const onSubmit = (data) => {
  console.log("📦 Submitted data:", data);
};

Browser console will show:

📦 Submitted data: {
  name: "Jatin",
  username: "jatin_123",
  email: "jatin@example.com",
  password: "mypassword"
}

Let me know if you're sending this to a backend, I can also show how to pass this in a fetch or axios call.
