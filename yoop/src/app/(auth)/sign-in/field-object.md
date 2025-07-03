Excellent question! Let's break it down clearly.
🧠 Who gives the field object inside render in <FormField>?

    🔹 Answer: It comes from React Hook Form, via the useController hook inside shadcn/ui's <FormField /> component.

📦 What is happening under the hood?

Here’s the magic behind this:

<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <Input {...field} />
  )}
/>

🔍 Step-by-step:

    You provide control and name to <FormField />.

    Inside <FormField />, it internally calls useController() from React Hook Form:

const { field } = useController({ control, name });

This field object contains:

    value

    onChange

    onBlur

    ref

    name

So you can directly pass it into <input>, <textarea>, <select>, or even a custom component like this:

<input {...field} />

That field object is then passed to your render callback:

    render={({ field }) => (
      <Input {...field} />
    )}

🧪 What does the field object actually look like?

field = {
  name: "email",
  value: "jatin@example.com",
  onChange: fn,
  onBlur: fn,
  ref: fn
}

Perfect for wiring into controlled components.
✅ Why this is useful

    You don’t need to manually write onChange, value, onBlur, etc.

    Keeps your forms clean, reusable, and consistent.

Let me know if you'd like a real example with a custom component like a select or toggle switch too!
