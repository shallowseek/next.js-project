####
The lowercase `credentials` is a **property/field definition object** that tells Auth.js what input fields to show on the login form and how to handle them.

## Breaking it down:

```typescript
credentials: {
  username: { label: "Username" },
  password: { label: "Password", type: "password" },
}
```

**`credentials`** (lowercase) = The property name that defines form fields
**`Credentials`** (uppercase) = The provider method/function

## What each field object contains:

**`username: { label: "Username" }`**:
- `username` = The field name (this becomes the key in the form data)
- `label: "Username"` = What text appears next to the input field
- No `type` specified = defaults to text input

**`password: { label: "Password", type: "password" }`**:
- `password` = The field name
- `label: "Password"` = Display text
- `type: "password"` = Makes it a password input (dots instead of visible text)

## How it works:

1. Auth.js reads this `credentials` object
2. It automatically generates a login form with these fields
3. When user submits the form, you get an object like:
   ```javascript
   {
     username: "john_doe",
     password: "user_entered_password"
   }
   ```

## You can add more fields:

```typescript
credentials: {
  email: { label: "Email", type: "email" },
  password: { label: "Password", type: "password" },
  rememberMe: { label: "Remember me", type: "checkbox" }
}
```

So `credentials` (lowercase) is essentially your "form schema" - it defines what the login form looks like and what data you'll receive when the user tries to authenticate.










####
##
####
